<?php

namespace SilverStripe\AssetAdmin\Controller;

use Exception;
use InvalidArgumentException;
use SilverStripe\Admin\CMSBatchActionHandler;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Admin\LeftAndMainFormRequestHandler;
use SilverStripe\AssetAdmin\BatchAction\DeleteAssets;
use SilverStripe\AssetAdmin\Forms\AssetFormFactory;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Forms\FileHistoryFormFactory;
use SilverStripe\AssetAdmin\Forms\FileSearchFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderCreateFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderFormFactory;
use SilverStripe\AssetAdmin\Forms\ImageFormFactory;
use SilverStripe\AssetAdmin\Forms\MoveFormFactory;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Model\ThumbnailGenerator;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Storage\AssetNameGenerator;
use SilverStripe\Assets\Upload;
use SilverStripe\CampaignAdmin\AddToCampaignHandler;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Security\Member;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\Requirements;
use SilverStripe\View\SSViewer;
use SilverStripe\VersionedAdmin\Extensions\FileArchiveExtension;

/**
 * AssetAdmin is the 'file store' section of the CMS.
 * It provides an interface for manipulating the File and Folder objects in the system.
 */
class AssetAdmin extends LeftAndMain implements PermissionProvider
{
    private static $url_segment = 'assets';

    private static $url_rule = '/$Action/$ID';

    private static $menu_title = 'Files';

    private static $menu_icon_class = 'font-icon-image';

    private static $tree_class = Folder::class;

    private static $url_handlers = [
        // Legacy redirect for SS3-style detail view
        'EditForm/field/File/item/$FileID/$Action' => 'legacyRedirectForEditView',
        // Pass all URLs to the index, for React to unpack
        'show/$FolderID/edit/$FileID' => 'index',
        // API access points with structured data
        'POST api/createFile' => 'apiCreateFile',
        'POST api/uploadFile' => 'apiUploadFile',
        'GET api/history' => 'apiHistory',
        'fileEditForm/$ID' => 'fileEditForm',
        'fileInsertForm/$ID' => 'fileInsertForm',
        'fileEditorLinkForm/$ID' => 'fileEditorLinkForm',
        'fileHistoryForm/$ID/$VersionID' => 'fileHistoryForm',
        'folderCreateForm/$ParentID' => 'folderCreateForm',
        'fileSelectForm/$ID' => 'fileSelectForm',
        'moveForm/$ID' => 'moveForm',
    ];

    /**
     * Amount of results showing on a single page.
     *
     * @config
     * @var int
     */
    private static $page_length = 50;

    /**
     * @config
     *
     * @var int
     */
    private static $max_history_entries = 100;

    /**
     * @config
     *
     * @var int The max file size, in bytes or INI format
     */
    private static $max_upload_size;

    /**
     * If an image load fails in JS, retry it after this many seconds.
     * This value will be doubled and retried multiple times until it reaches max_image_retry
     * (inclusive)
     *
     * @config
     * @var int
     */
    private static $image_retry_min = 0;

    /**
     * Stop retrying after we reach this retry period.
     *
     * @config
     * @var int
     */
    private static $image_retry_max = 0;

    /**
     * If we fail after max_image_retry, a reload can be re-attempted again
     * after this period, but won't be automatically started.
     *
     * @config
     * @var int
     */
    private static $image_retry_failure_expiry = 300;


    /**
     * @var array
     */
    private static $allowed_actions = array(
        'legacyRedirectForEditView',
        'apiCreateFile',
        'apiUploadFile',
        'apiHistory',
        'folderCreateForm',
        'fileEditForm',
        'fileHistoryForm',
        'addToCampaignForm',
        'fileInsertForm',
        'fileEditorLinkForm',
        'schema',
        'fileSelectForm',
        'fileSearchForm',
        'moveForm',
    );

    private static $required_permission_codes = 'CMS_ACCESS_AssetAdmin';

    /**
     * Retina thumbnail image (native size: 176)
     *
     * @config
     * @var int
     */
    private static $thumbnail_width = 352;

    /**
     * Retina thumbnail height (native size: 132)
     *
     * @config
     * @var int
     */
    private static $thumbnail_height = 264;


    /**
     * Whatever the front end should try to bust cache by appending the version id to the image URL.
     * @config
     * @var bool
     */
    private static $bust_cache = true;

    /**
     * @var ThumbnailGenerator
     */
    protected $thumbnailGenerator;

    /**
     * Set up the controller
     */
    public function init()
    {
        parent::init();

        Requirements::add_i18n_javascript('silverstripe/asset-admin:client/lang', false);
        Requirements::javascript('silverstripe/asset-admin:client/dist/js/bundle.js');
        Requirements::css('silverstripe/asset-admin:client/dist/styles/bundle.css');

        CMSBatchActionHandler::register('delete', DeleteAssets::class, Folder::class);
    }

    public function getClientConfig()
    {
        $baseLink = $this->Link();
        $validator = $this->getUpload()->getValidator();

        return array_merge(parent::getClientConfig(), [
            'reactRouter' => true,
            'bustCache' => static::config()->get('bust_cache'),
            'createFileEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/createFile'),
                'method' => 'post',
                'payloadFormat' => 'urlencoded',
            ],
            'uploadFileEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/uploadFile'),
                'method' => 'post',
                'payloadFormat' => 'urlencoded',
            ],
            'historyEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/history'),
                'method' => 'get',
                'responseFormat' => 'json',
            ],
            'limit' => $this->config()->page_length,
            'imageRetry' => [
                'minRetry' => $this->config()->image_retry_min,
                'maxRetry' => $this->config()->image_retry_max,
                'expiry' => $this->config()->image_retry_failure_expiry,
            ],
            'form' => [
                'fileEditForm' => [
                    'schemaUrl' => $this->Link('schema/fileEditForm')
                ],
                'fileInsertForm' => [
                    'schemaUrl' => $this->Link('schema/fileInsertForm')
                ],
                'remoteEditForm' => [
                    'schemaUrl' => LeftAndMain::singleton()
                        ->Link('Modals/remoteEditFormSchema'),
                ],
                'remoteCreateForm' => [
                    'schemaUrl' => LeftAndMain::singleton()
                        ->Link('methodSchema/Modals/remoteCreateForm')
                ],
                'fileSelectForm' => [
                    'schemaUrl' => $this->Link('schema/fileSelectForm')
                ],
                'addToCampaignForm' => [
                    'schemaUrl' => $this->Link('schema/addToCampaignForm')
                ],
                'fileHistoryForm' => [
                    'schemaUrl' => $this->Link('schema/fileHistoryForm')
                ],
                'fileSearchForm' => [
                    'schemaUrl' => $this->Link('schema/fileSearchForm')
                ],
                'folderCreateForm' => [
                    'schemaUrl' => $this->Link('schema/folderCreateForm')
                ],
                'fileEditorLinkForm' => [
                    'schemaUrl' => $this->Link('schema/fileEditorLinkForm'),
                ],
                'moveForm' => [
                    'schemaUrl' => $this->Link('schema/moveForm'),
                ],
            ],
            'dropzoneOptions' => [
                'maxFilesize' => floor(
                    $validator->getAllowedMaxFileSize() / (1024 * 1024)
                ),
                'filesizeBase' => 1024,
                'acceptedFiles' => implode(',', array_map(function ($ext) {
                    return $ext[0] != '.' ? ".$ext" : $ext;
                }, $validator->getAllowedExtensions() ?? []))
            ],
            'archiveFiles' => class_exists(FileArchiveExtension::class)
                && File::singleton()->isArchiveFieldEnabled(),
        ]);
    }

    /**
     * Creates a single file based on a form-urlencoded upload.
     *
     * @param HTTPRequest $request
     * @return HTTPRequest|HTTPResponse
     */
    public function apiCreateFile(HTTPRequest $request)
    {
        $data = $request->postVars();

        // When creating new files, rename on conflict
        $upload = $this->getUpload();
        $upload->setReplaceFile(false);

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($data[$token->getName()]) || !$token->check($data[$token->getName()])) {
            $this->jsonError(400);
            return null;
        }

        // Check parent record
        $parentRecord = null;
        if (!empty($data['ParentID']) && is_numeric($data['ParentID'])) {
            $parentRecord = Folder::get()->byID($data['ParentID']);
        }
        $data['Parent'] = $parentRecord;

        $tmpFile = $request->postVar('Upload');
        if (!$upload->validate($tmpFile)) {
            $errors = $upload->getErrors();
            $message = array_shift($errors);
            $this->jsonError(400, $message);
            return null;
        }

        $fileClass = File::get_class_for_file_extension(File::get_file_extension($tmpFile['name']));
        /** @var File $file */
        $file = Injector::inst()->create($fileClass);

        // check canCreate permissions
        if (!$file->canCreate(null, $data)) {
            $this->jsonError(
                403,
                _t(__CLASS__.'.CreatePermissionDenied', 'You do not have permission to add files')
            );
            return null;
        }

        $uploadResult = $upload->loadIntoFile($tmpFile, $file, $parentRecord ? $parentRecord->getFilename() : '/');
        if (!$uploadResult) {
            $this->jsonError(
                400,
                _t(__CLASS__.'.LoadIntoFileFailed', 'Failed to load file')
            );
            return null;
        }

        $file->ParentID = $parentRecord ? $parentRecord->ID : 0;
        $file->write();

        $result = [
            $this->getObjectFromData($file, false)
        ];

        return (new HTTPResponse(json_encode($result)))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * Upload a new asset for a pre-existing record. Returns the asset tuple.
     *
     * Note that conflict resolution is as follows:
     *  - If uploading a file with the same extension, we simply keep the same filename,
     *    and overwrite any existing files (same name + sha = don't duplicate).
     *  - If uploading a new file with a different extension, then the filename will
     *    be replaced, and will be checked for uniqueness against other File dataobjects.
     *
     * @param HTTPRequest $request Request containing vars 'ID' of parent record ID,
     * and 'Name' as form filename value
     * @return HTTPRequest|HTTPResponse
     */
    public function apiUploadFile(HTTPRequest $request)
    {
        $data = $request->postVars();

        // When updating files, replace on conflict
        $upload = $this->getUpload();
        $upload->setReplaceFile(true);

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($data[$token->getName()]) || !$token->check($data[$token->getName()])) {
            $this->jsonError(400);
            return null;
        }
        $tmpFile = $data['Upload'];
        if (empty($data['ID']) || empty($tmpFile['name']) || !array_key_exists('Name', $data ?? [])) {
            $this->jsonError(400, _t(__CLASS__.'.INVALID_REQUEST', 'Invalid request'));
            return null;
        }

        // Check parent record
        $file = File::get()->byID($data['ID']);
        if (!$file) {
            $this->jsonError(404, _t(__CLASS__.'.FILE_NOT_FOUND', 'File not found'));
            return null;
        }
        $folder = $file->ParentID ? $file->Parent()->getFilename() : '/';

        // If extension is the same, attempt to re-use existing name
        if (File::get_file_extension($tmpFile['name']) === File::get_file_extension($data['Name'])) {
            $tmpFile['name'] = $data['Name'];
        } else {
            // If we are allowing this upload to rename the underlying record,
            // do a uniqueness check.
            $renamer = $this->getNameGenerator($tmpFile['name']);
            foreach ($renamer as $name) {
                $filename = File::join_paths($folder, $name);
                if (!File::find($filename)) {
                    $tmpFile['name'] = $name;
                    break;
                }
            }
        }

        if (!$upload->validate($tmpFile)) {
            $errors = $upload->getErrors();
            $message = array_shift($errors);
            $this->jsonError(400, $message);
            return null;
        }

        try {
            $tuple = $upload->load($tmpFile, $folder);
        } catch (Exception $e) {
            $this->jsonError(400, $e->getMessage());
            return null;
        }

        if ($upload->isError()) {
            $errors = implode(' ' . PHP_EOL, $upload->getErrors());
            $this->jsonError(400, $errors);
            return null;
        }

        $tuple['Name'] = basename($tuple['Filename'] ?? '');
        return (new HTTPResponse(json_encode($tuple)))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * Returns a JSON array for history of a given file ID. Returns a list of all the history.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function apiHistory(HTTPRequest $request)
    {
        // CSRF check not required as the GET request has no side effects.
        $fileId = $request->getVar('fileId');

        if (!$fileId || !is_numeric($fileId)) {
            $this->jsonError(400);
            return null;
        }

        $class = File::class;
        $file = DataObject::get($class)->byID($fileId);

        if (!$file) {
            $this->jsonError(404);
            return null;
        }

        if (!$file->canView()) {
            $this->jsonError(403);
            return null;
        }

        $versions = Versioned::get_all_versions($class, $fileId)
            ->limit($this->config()->max_history_entries)
            ->sort('Version', 'DESC');

        $output = array();
        $next = array();
        $prev = null;

        // swap the order so we can get the version number to compare against.
        // i.e version 3 needs to know version 2 is the previous version
        $copy = $versions->map('Version', 'Version')->toArray();
        foreach (array_reverse($copy ?? []) as $k => $v) {
            if ($prev) {
                $next[$v] = $prev;
            }

            $prev = $v;
        }

        $_cachedMembers = array();

        /** @var File|AssetAdminFile $version */
        foreach ($versions as $version) {
            $author = null;

            if ($version->AuthorID) {
                if (!isset($_cachedMembers[$version->AuthorID])) {
                    $_cachedMembers[$version->AuthorID] = DataObject::get(Member::class)
                        ->byID($version->AuthorID);
                }

                $author = $_cachedMembers[$version->AuthorID];
            }

            if ($version->canView()) {
                if (isset($next[$version->Version])) {
                    $summary = $version->humanizedChanges(
                        $version->Version,
                        $next[$version->Version]
                    );

                    // if no summary returned by humanizedChanges, i.e we cannot work out what changed, just show a
                    // generic message
                    if (!$summary) {
                        $summary = _t(__CLASS__.'.SAVEDFILE', "Saved file");
                    }
                } else {
                    $summary = _t(__CLASS__.'.UPLOADEDFILE', "Uploaded file");
                }

                $output[] = array(
                    'versionid' => (int) $version->Version,
                    'date_ago' => $version->dbObject('LastEdited')->Ago(),
                    'date_formatted' => $version->dbObject('LastEdited')->Nice(),
                    'status' => ($version->WasPublished) ? _t(__CLASS__.'.PUBLISHED', 'Published') : '',
                    'author' => ($author)
                        ? $author->Name
                        : _t(__CLASS__.'.UNKNOWN', "Unknown"),
                    'summary' => ($summary)
                        ? $summary
                        : _t(__CLASS__.'.NOSUMMARY', "No summary available")
                );
            }
        }

        $response = new HTTPResponse(json_encode($output));
        return $response->addHeader('Content-Type', 'application/json');
    }

    /**
     * Redirects 3.x style detail links to new 4.x style routing.
     */
    public function legacyRedirectForEditView(HTTPRequest $request): HTTPResponse
    {
        $fileID = $request->param('FileID');
        $file = File::get()->byID($fileID);
        $link = $this->getFileEditLink($file) ?: $this->Link();
        return $this->redirect($link);
    }

    /**
     * Given a file return the CMS link to edit it
     *
     * @param File $file
     * @return string
     */
    public function getFileEditLink($file)
    {
        if (!$file || !$file->isInDB()) {
            return null;
        }

        return Controller::join_links(
            $this->Link('show'),
            $file->ParentID,
            'edit',
            $file->ID
        );
    }

    /**
     * Get an asset renamer for the given filename.
     *
     * @param string $filename Path name
     * @return AssetNameGenerator
     */
    protected function getNameGenerator($filename)
    {
        return Injector::inst()
            ->createWithArgs(AssetNameGenerator::class, array($filename));
    }

    /**
     * @return null
     */
    public function breadcrumbs($unlinked = false)
    {
        return null;
    }

    /**
     * Don't include class namespace in auto-generated CSS class
     */
    public function baseCSSClasses()
    {
        return 'AssetAdmin LeftAndMain';
    }

    public function providePermissions()
    {
        return array(
            "CMS_ACCESS_AssetAdmin" => array(
                'name' => _t('SilverStripe\\CMS\\Controllers\\CMSMain.ACCESS', "Access to '{title}' section", array(
                    'title' => static::menu_title()
                )),
                'category' => _t('SilverStripe\\Security\\Permission.CMS_ACCESS_CATEGORY', 'CMS Access')
            )
        );
    }

    /**
     * Build a form scaffolder for this model
     *
     * NOTE: Volatile api. May be moved to {@see LeftAndMain}
     *
     * @param File $file
     * @return FormFactory
     */
    public function getFormFactory(File $file)
    {
        // Get service name based on file class
        $name = null;
        if ($file instanceof Folder) {
            $name = FolderFormFactory::class;
        } elseif ($file instanceof Image) {
            $name = ImageFormFactory::class;
        } else {
            $name = FileFormFactory::class;
        }
        return Injector::inst()->get($name);
    }

    /**
     * The form is used to generate a form schema,
     * as well as an intermediary object to process data through API endpoints.
     * Since it's used directly on API endpoints, it does not have any form actions.
     * It handles both {@link File} and {@link Folder} records.
     *
     * @param int $id
     * @return Form
     */
    public function getFileEditForm($id)
    {
        $form = $this->getAbstractFileForm($id, 'fileEditForm');
        if ($form instanceof Form) {
            $form->setNotifyUnsavedChanges(true);
        }

        return $form;
    }

    /**
     * Get file edit form
     *
     * @param HTTPRequest $request
     * @return Form|HTTPResponse
     */
    public function fileEditForm($request = null)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->jsonError(400);
            return null;
        }
        $id = $request->param('ID');
        if (!$id) {
            $this->jsonError(400);
            return null;
        }
        return $this->getFileEditForm($id);
    }

    /**
     * The form is used to generate a form schema,
     * as well as an intermediary object to process data through API endpoints.
     * Since it's used directly on API endpoints, it does not have any form actions.
     * It handles both {@link File} and {@link Folder} records.
     *
     * @param int $id
     * @return Form
     */
    public function getFileInsertForm($id)
    {
        return $this->getAbstractFileForm($id, 'fileInsertForm', [ 'Type' => AssetFormFactory::TYPE_INSERT_MEDIA ]);
    }

    /**
     * Get file insert media form
     *
     * @param HTTPRequest $request
     * @return Form|HTTPResponse
     */
    public function fileInsertForm($request = null)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->jsonError(400);
            return null;
        }
        $id = $request->param('ID');
        if (!$id) {
            $this->jsonError(400);
            return null;
        }
        return $this->getFileInsertForm($id);
    }

    /**
     * The form used to generate a form schema, since it's used directly on API endpoints,
     * it does not have any form actions.
     *
     * @param $id
     * @return Form
     */
    public function getFileEditorLinkForm($id)
    {
        return $this->getAbstractFileForm($id, 'fileInsertForm', [ 'Type' => AssetFormFactory::TYPE_INSERT_LINK ]);
    }

    /**
     * Get the file insert link form
     *
     * @param HTTPRequest $request
     * @return Form|HTTPResponse
     */
    public function fileEditorLinkForm($request = null)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->jsonError(400);
            return null;
        }
        $id = $request->param('ID');
        if (!$id) {
            $this->jsonError(400);
            return null;
        }
        return $this->getFileInsertForm($id);
    }

    /**
     * Abstract method for generating a form for a file
     *
     * @param int $id Record ID
     * @param string $name Form name
     * @param array $context Form context
     * @return Form|HTTPResponse
     */
    protected function getAbstractFileForm($id, $name, $context = [])
    {
        $file = File::get()->byID($id);

        if (!$file) {
            $this->jsonError(404);
            return null;
        }

        if (!$file->canView()) {
            $this->jsonError(403, _t(
                __CLASS__.'.ErrorItemPermissionDenied',
                "You don't have the necessary permissions to modify {ObjectTitle}",
                [ 'ObjectTitle' => $file->i18n_singular_name() ]
            ));
            return null;
        }

        // Pass to form factory
        $showLinkText = $this->getRequest()->getVar('requireLinkText');
        $fileSelected = $this->getRequest()->getVar('fileSelected');
        $augmentedContext = array_merge(
            $context,
            [ 'Record' => $file, 'RequireLinkText' => isset($showLinkText), 'FileSelected' => isset($fileSelected) ]
        );
        $scaffolder = $this->getFormFactory($file);
        $form = $scaffolder->getForm($this, $name, $augmentedContext);

        // Set form action handler with ID included
        $form->setRequestHandler(
            LeftAndMainFormRequestHandler::create($form, [ $id ])
        );

        // Configure form to respond to validation errors with form schema
        // if requested via react.
        $form->setValidationResponseCallback(function (ValidationResult $error) use ($form, $id, $name) {
            $schemaId = Controller::join_links($this->Link('schema'), $name, $id);
            return $this->getSchemaResponse($schemaId, $form, $error);
        });

        return $form;
    }

    /**
     * Get form for selecting a file
     *
     * @return Form
     */
    public function fileSelectForm()
    {
        // Get ID either from posted back value, or url parameter
        $request = $this->getRequest();
        $id = $request->param('ID') ?: $request->postVar('ID');
        return $this->getFileSelectForm($id);
    }

    /**
     * Get form for moving files/folders to a new location
     *
     * @return Form
     */
    public function moveForm()
    {
        return $this->getMoveForm();
    }

    /**
     * Get form for moving files/folders to a new location
     *
     * @return Form
     */
    public function getMoveForm()
    {
        $id = $this->getRequest()->param('ItemID');
        $scaffolder = Injector::inst()->get(MoveFormFactory::class);

        $form = $scaffolder->getForm($this, 'moveForm', ['FolderID' => $id]);
        $form->setRequestHandler(
            LeftAndMainFormRequestHandler::create($form, [ $id ])
        );

        return $form;
    }
    /**
     * Get form for selecting a file
     *
     * @param int $id ID of the record being selected
     * @return Form
     */
    public function getFileSelectForm($id)
    {
        return $this->getAbstractFileForm($id, 'fileSelectForm', [ 'Type' => AssetFormFactory::TYPE_SELECT ]);
    }

    /**
     * @param array $context
     * @return Form|HTTPResponse
     * @throws InvalidArgumentException
     */
    public function getFileHistoryForm($context)
    {
        // Check context
        if (!isset($context['RecordID']) || !isset($context['RecordVersion'])) {
            throw new InvalidArgumentException("Missing RecordID / RecordVersion for this form");
        }
        $id = $context['RecordID'];
        $versionId = $context['RecordVersion'];
        if (!$id || !$versionId) {
            $this->jsonError(404);
            return null;
        }

        $file = Versioned::get_version(File::class, $id, $versionId);
        if (!$file) {
            $this->jsonError(404);
            return null;
        }

        if (!$file->canView()) {
            $this->jsonError(403, _t(
                __CLASS__.'.ErrorItemPermissionDenied',
                "You don't have the necessary permissions to modify {ObjectTitle}",
                [ 'ObjectTitle' => $file->i18n_singular_name() ]
            ));
            return null;
        }

        $effectiveContext = array_merge($context, ['Record' => $file]);
        $scaffolder = Injector::inst()->get(FileHistoryFormFactory::class);
        $form = $scaffolder->getForm($this, 'fileHistoryForm', $effectiveContext);

        // Set form handler with ID / VersionID
        $form->setRequestHandler(
            LeftAndMainFormRequestHandler::create($form, [ $id, $versionId ])
        );

        // Configure form to respond to validation errors with form schema
        // if requested via react.
        $form->setValidationResponseCallback(function (ValidationResult $errors) use ($form, $id, $versionId) {
            $schemaId = Controller::join_links($this->Link('schema/fileHistoryForm'), $id, $versionId);
            return $this->getSchemaResponse($schemaId, $form, $errors);
        });

        return $form;
    }

    /**
     * Gets a JSON schema representing the current edit form.
     */
    public function schema(HTTPRequest $request): HTTPResponse
    {
        $formName = $request->param('FormName');
        if ($formName !== 'fileHistoryForm') {
            return parent::schema($request);
        }

        // Get schema for history form
        $itemID = $request->param('ItemID');
        $version = $request->param('OtherItemID');
        $form = $this->getFileHistoryForm([
            'RecordID' => $itemID,
            'RecordVersion' => $version,
        ]);

        // Respond with this schema
        $response = $this->getResponse();
        $response->addHeader('Content-Type', 'application/json');
        $schemaID = $this->getRequest()->getURL();
        return $this->getSchemaResponse($schemaID, $form);
    }

    /**
     * Get file history form
     *
     * @param HTTPRequest $request
     * @return Form|HTTPResponse
     */
    public function fileHistoryForm($request = null)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->jsonError(400);
            return null;
        }
        $id = $request->param('ID');
        if (!$id) {
            $this->jsonError(400);
            return null;
        }
        $versionID = $request->param('VersionID');
        if (!$versionID) {
            $this->jsonError(400);
            return null;
        }
        $form = $this->getFileHistoryForm([
            'RecordID' => $id,
            'RecordVersion' => $versionID,
        ]);
        return $form;
    }

    public function createfolder(array $data, Form $form): HTTPResponse
    {
        $parentID = isset($data['ParentID']) ? intval($data['ParentID']) : 0;
        $data['Parent'] = null;
        if ($parentID) {
            $parent = Folder::get()->byID($parentID);
            if (!$parent) {
                throw new \InvalidArgumentException(sprintf(
                    '%s#%s not found',
                    Folder::class,
                    $parentID
                ));
            }
            $data['Parent'] = $parent;
        }

        // Check permission
        if (!Folder::singleton()->canCreate(Security::getCurrentUser(), $data)) {
            throw new \InvalidArgumentException(sprintf(
                '%s create not allowed',
                Folder::class
            ));
        }

        $folder = Folder::create();
        $form->saveInto($folder);
        $folder->write();

        $createForm = $this->getFolderCreateForm($folder->ID);

        // Return the record data in the same response as the schema to save a postback
        $schemaData = ['record' => $this->getObjectFromData($folder)];
        $schemaId = Controller::join_links($this->Link('schema/folderCreateForm'), $folder->ID);
        return $this->getSchemaResponse($schemaId, $createForm, null, $schemaData);
    }

    public function save(array $data, Form $form): HTTPResponse
    {
        return $this->saveOrPublish($data, $form, false);
    }

    public function publish(array $data, Form $form): HTTPResponse
    {
        return $this->saveOrPublish($data, $form, true);
    }

    /**
     * Update this record
     */
    protected function saveOrPublish(array $data, Form $form, bool $doPublish = false): HTTPResponse
    {
        if (!isset($data['ID']) || !is_numeric($data['ID'])) {
            $this->jsonError(400);
        }

        $id = (int) $data['ID'];
        $record = DataObject::get_by_id(File::class, $id);

        if (!$record) {
            $this->jsonError(404);
        }

        if (!$record->canEdit() || ($doPublish && !$record->canPublish())) {
            $this->jsonError(401);
        }

        // check File extension
        if (!empty($data['FileFilename'])) {
            $extension = File::get_file_extension($data['FileFilename']);
            $newClass = File::get_class_for_file_extension($extension);

            // If the file extension has changed, change to the proper new class which represents it.
            // The class will not change if the current class is a subclass of the new class.
            // An exception is if new class is the generic File::class - to not change to the generic
            // File::class make sure to register the file extension and your class to config in
            // File::class_for_file_extension
            $currentClass = $record->getClassName();
            if (!is_a($currentClass, $newClass ?? '', true) ||
                ($currentClass !== $newClass && $newClass === File::class)
            ) {
                $record = $record->newClassInstance($newClass);

                // update the allowed category for the new file extension
                $category = File::get_app_category($extension);
                $record->File->setAllowedCategories($category);
            }
        }

        $form->saveInto($record);
        $record->write();

        // Publish this record and owned objects
        if ($doPublish) {
            $record->publishRecursive();
        }
        // regenerate form, so that it constants/literals on the form are updated
        $form = $this->getFileEditForm($record->ID);

        // Note: Force return of schema / state in success result
        return $this->getRecordUpdatedResponse($record, $form);
    }

    public function unpublish(array $data, Form $form): HTTPResponse
    {
        if (!isset($data['ID']) || !is_numeric($data['ID'])) {
            $this->jsonError(400);
        }

        $id = (int) $data['ID'];
        $record = DataObject::get_by_id(File::class, $id);

        if (!$record) {
            $this->jsonError(404);
        }

        if (!$record->canUnpublish()) {
            $this->jsonError(401);
        }

        $record->doUnpublish();

        // regenerate form, so that it constants/literals on the form are updated
        $form = $this->getFileEditForm($record->ID);
        return $this->getRecordUpdatedResponse($record, $form);
    }

    /**
     * Build the array containing the all attributes the AssetAdmin client interact with.
     * @param File $file
     * @param bool $thumbnailLinks Set to true if thumbnail links should be included.
     * Set to false to skip thumbnail link generation.
     * Note: Thumbnail content is always generated to pre-optimise for future use, even if
     * links are not generated.
     * @return array
     */
    public function getObjectFromData(File $file, $thumbnailLinks = true)
    {
        $object = $this->getMinimalistObjectFromData($file, $thumbnailLinks);

        // Slightly more accurate than graphql bulk-usage lookup, but more expensive
        $object['inUseCount'] = ($file->hasMethod('findOwners')) ? $file->findOwners()->count() : 0;
        $object['created'] = $file->Created;
        $object['lastUpdated'] = $file->LastEdited;
        $object['owner'] = null;
        $object['type'] = $file instanceof Folder ? 'folder' : $file->FileType;
        $object['name'] = $file->Name;
        $object['filename'] = $file->Filename;
        $object['url'] = $file->AbsoluteURL;
        $object['canEdit'] = $file->canEdit();
        $object['canDelete'] = ($file->hasMethod('canArchive')) ? $file->canArchive() : $file->canDelete();

        $owner = $file->Owner();

        if ($owner) {
            $object['owner'] = array(
                'id' => $owner->ID,
                'title' => $owner->Name,
            );
        }

        return $object;
    }

    /**
     * Build the array containing the minimal attributes needed to render an UploadFieldItem.
     *
     * @param File $file
     * @param bool $thumbnailLinks Set to true if thumbnail links should be included.
     * Set to false to skip thumbnail link generation.
     * Note: Thumbnail content is always generated to pre-optimise for future use, even if
     * links are not generated.
     * @return array
     */
    public function getMinimalistObjectFromData(File $file, $thumbnailLinks = true)
    {
        $object = array(
            'id' => (int) $file->ID,
            'parent' => null,
            'title' => $file->Title,
            'exists' => $file->exists(), // Broken file check
            'category' => $file instanceof Folder ? 'folder' : $file->appCategory(),
            'extension' => $file->Extension,
            'size' => $file->AbsoluteSize,
            'published' => ($file->hasMethod('isPublished')) ? $file->isPublished() : true,
            'modified' => ($file->hasMethod('isModifiedOnDraft')) ? $file->isModifiedOnDraft() : false,
            'draft' => ($file->hasMethod('isOnDraftOnly')) ? $file->isOnDraftOnly() : false,
            'hasRestrictedAccess' => $file->hasRestrictedAccess(),
            'isTrackedFormUpload' => $file->isTrackedFormUpload(),
            'visibility' => $file->getVisibility()
        );

        $parent = $file->Parent();

        if ($parent) {
            $object['parent'] = array(
                'id' => $parent->ID,
                'title' => $parent->Title,
                'filename' => $parent->Filename,
            );
        }

        if ($file->getIsImage()) {
            $thumbnails = $this->generateThumbnails($file, $thumbnailLinks);

            if ($thumbnailLinks) {
                $object = array_merge($object, $thumbnails);
            }
            // Save dimensions
            $object['width'] = $file->getWidth();
            $object['height'] = $file->getHeight();
        } else {
            $object['thumbnail'] = $file->PreviewLink();
        }

        return $object;
    }

    /**
     * Generate thumbnails and provide links for a given file
     *
     * @param File $file
     * @param bool $thumbnailLinks
     * @return array
     */
    public function generateThumbnails(File $file, $thumbnailLinks = false)
    {
        $links = [];
        if (!$file->getIsImage() || $file->config()->resample_images === false) {
            return $links;
        }
        $generator = $this->getThumbnailGenerator();

        // Small thumbnail
        $smallWidth = UploadField::config()->uninherited('thumbnail_width');
        $smallHeight = UploadField::config()->uninherited('thumbnail_height');

        // Large thumbnail
        $width = $this->config()->get('thumbnail_width');
        $height = $this->config()->get('thumbnail_height');

        // Generate links if client requests them
        // Note: Thumbnails should always be generated even if links are not
        if ($thumbnailLinks) {
            $links['smallThumbnail'] = $generator->generateThumbnailLink($file, $smallWidth, $smallHeight);
            $links['thumbnail'] = $generator->generateThumbnailLink($file, $width, $height);
        } else {
            $generator->generateThumbnail($file, $smallWidth, $smallHeight);
            $generator->generateThumbnail($file, $width, $height);
        }

        $this->extend('updateGeneratedThumbnails', $file, $links, $generator);
        return $links;
    }

    /**
     * Action handler for adding pages to a campaign
     */
    public function addtocampaign(array $data, Form $form): HTTPResponse
    {
        $id = $data['ID'];
        $record = File::get()->byID($id);

        $handler = AddToCampaignHandler::create($this, $record, 'addToCampaignForm');
        $response = $handler->addToCampaign($record, $data);
        $message = $response->getBody();
        if (empty($message)) {
            return $response;
        }

        // Send extra "message" data with schema response
        $extraData = ['message' => $message];
        $schemaId = Controller::join_links($this->Link('schema/addToCampaignForm'), $id);
        return $this->getSchemaResponse($schemaId, $form, null, $extraData);
    }

    /**
     * Url handler for add to campaign form
     *
     * @param HTTPRequest $request
     * @return Form
     */
    public function addToCampaignForm($request)
    {
        // Get ID either from posted back value, or url parameter
        $id = $request->param('ID') ?: $request->postVar('ID');
        return $this->getAddToCampaignForm($id);
    }

    /**
     * @param int $id
     * @return Form|HTTPResponse
     */
    public function getAddToCampaignForm($id)
    {
        // Get record-specific fields
        $record = File::get()->byID($id);

        if (!$record) {
            $this->jsonError(404, _t(
                __CLASS__.'.ErrorNotFound',
                "That {Type} couldn't be found",
                ['Type' => File::singleton()->i18n_singular_name()]
            ));
            return null;
        }
        if (!$record->canView()) {
            $this->jsonError(403, _t(
                __CLASS__.'.ErrorItemPermissionDenied',
                "You don't have the necessary permissions to modify {ObjectTitle}",
                ['ObjectTitle' => $record->i18n_singular_name()]
            ));
            return null;
        }

        $handler = AddToCampaignHandler::create($this, $record, 'addToCampaignForm');
        $form = $handler->Form($record);

        $form->setValidationResponseCallback(function (ValidationResult $errors) use ($form, $id) {
            $schemaId = Controller::join_links($this->Link('schema/addToCampaignForm'), $id);
            return $this->getSchemaResponse($schemaId, $form, $errors);
        });

        return $form;
    }

    /**
     * @return Upload
     */
    protected function getUpload()
    {
        $upload = Upload::create();
        $upload->getValidator()->setAllowedExtensions(
            // filter out '' since this would be a regex problem on JS end
            array_filter(File::getAllowedExtensions() ?? [])
        );
        $maxFileSize = $this->config()->get('max_upload_size');
        if ($maxFileSize !== null) {
            $upload->getValidator()->setAllowedMaxFileSize($maxFileSize);
        }

        return $upload;
    }

    /**
     * Get response for successfully updated record
     *
     * @param Form $form
     */
    protected function getRecordUpdatedResponse(File $record, $form): HTTPResponse
    {
        // Return the record data in the same response as the schema to save a postback
        $schemaData = ['record' => $this->getObjectFromData($record)];
        $schemaId = Controller::join_links($this->Link('schema/fileEditForm'), $record->ID);
        return $this->getSchemaResponse($schemaId, $form, null, $schemaData);
    }

    /**
     * @param HTTPRequest $request
     * @return Form
     */
    public function folderCreateForm($request = null)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->jsonError(400);
            return null;
        }
        $id = $request->param('ParentID');
        // Fail on null ID (but not parent)
        if (!isset($id)) {
            $this->jsonError(400);
            return null;
        }
        return $this->getFolderCreateForm($id);
    }

    /**
     * Returns the form to be used for creating a new folder
     * @param $parentId
     * @return Form
     */
    public function getFolderCreateForm($parentId = 0)
    {
        $factory = Injector::inst()->get(FolderCreateFormFactory::class);
        $form = $factory->getForm($this, 'folderCreateForm', [ 'ParentID' => $parentId ]);

        // Set form action handler with ParentID included
        $form->setRequestHandler(
            LeftAndMainFormRequestHandler::create($form, [ $parentId ])
        );

        return $form;
    }

    /**
     * Scaffold a search form.
     * Note: This form does not submit to itself, but rather uses the apiReadFolder endpoint
     * (to be replaced with graphql)
     *
     * @return Form
     */
    public function fileSearchForm()
    {
        $scaffolder = FileSearchFormFactory::singleton();
        return $scaffolder->getForm($this, 'fileSearchForm', []);
    }

    /**
     * Allow search form to be accessible to schema
     *
     * @return Form
     */
    public function getFileSearchform()
    {
        return $this->fileSearchForm();
    }

    /**
     * @return ThumbnailGenerator
     */
    public function getThumbnailGenerator()
    {
        return $this->thumbnailGenerator;
    }

    /**
     * @param ThumbnailGenerator $generator
     * @return $this
     */
    public function setThumbnailGenerator(ThumbnailGenerator $generator)
    {
        $this->thumbnailGenerator = $generator;
        return $this;
    }

    public function canView($member = null)
    {
        // Since admin/assets is used as the endpoint for various other CMS modals,
        // we need to permit most admin/assets actions
        $asAjax = $this->getRequest()->isAjax()
            || in_array('application/json', $this->getRequest()->getAcceptMimetypes(false) ?? []);
        if ($asAjax && Permission::checkMember($member, 'CMS_ACCESS')) {
            return true;
        }

        // Default permissions
        return parent::canView($member);
    }

    public function PreviewPanel()
    {
        $templates = SSViewer::get_templates_by_class(get_class($this), '_PreviewPanel', __CLASS__);
        $template = SSViewer::chooseTemplate($templates);
        // Only render preview panel if a template specifically for the asset admin has been provided
        if ($template) {
            return $this->renderWith($template);
        }
        return null;
    }
}
