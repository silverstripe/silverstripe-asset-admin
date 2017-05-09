<?php

namespace SilverStripe\AssetAdmin\Controller;

use Embed\Exceptions\InvalidUrlException;
use InvalidArgumentException;
use SilverStripe\AssetAdmin\Forms\FolderCreateFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderFormFactory;
use SilverStripe\Admin\LeftAndMainFormRequestHandler;
use SilverStripe\CampaignAdmin\AddToCampaignHandler;
use SilverStripe\Admin\CMSBatchActionHandler;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\AssetAdmin\BatchAction\DeleteAssets;
use SilverStripe\AssetAdmin\Forms\AssetFormFactory;
use SilverStripe\AssetAdmin\Forms\FileSearchFormFactory;
use SilverStripe\AssetAdmin\Forms\RemoteFileFormFactory;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Forms\FileHistoryFormFactory;
use SilverStripe\AssetAdmin\Forms\ImageFormFactory;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Storage\AssetNameGenerator;
use SilverStripe\Assets\Upload;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Security\Member;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\SecurityToken;
use SilverStripe\View\Requirements;
use SilverStripe\Versioned\Versioned;
use Exception;

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
        // for validating before generating the schema
        'schemaWithValidate/$FormName' => 'schemaWithValidate',
        'fileEditForm/$ID' => 'fileEditForm',
        'fileHistoryForm/$ID/$VersionID' => 'fileHistoryForm',
        'folderCreateForm/$ParentID' => 'folderCreateForm',
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
     * @see Upload->allowedMaxFileSize
     * @var int
     */
    private static $allowed_max_file_size;

    /**
     * @config
     *
     * @var int
     */
    private static $max_history_entries = 100;

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
        'remoteEditForm',
        'remoteCreateForm',
        'schema',
        'fileSelectForm',
        'fileSearchForm',
        'schemaWithValidate',
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
     * Set up the controller
     */
    public function init()
    {
        parent::init();

        $module = ModuleLoader::getModule('silverstripe/asset-admin');
        Requirements::add_i18n_javascript($module->getResourcePath('client/lang'), false, true);
        Requirements::javascript($module->getResourcePath("client/dist/js/bundle.js"));
        Requirements::css($module->getResourcePath("client/dist/styles/bundle.css"));

        CMSBatchActionHandler::register('delete', DeleteAssets::class, Folder::class);
    }

    public function getClientConfig()
    {
        $baseLink = $this->Link();
        return array_merge(parent::getClientConfig(), [
            'reactRouter' => true,
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
            'form' => [
                'fileEditForm' => [
                    'schemaUrl' => $this->Link('schema/fileEditForm')
                ],
                'fileInsertForm' => [
                    'schemaUrl' => $this->Link('schema/fileInsertForm')
                ],
                'remoteEditForm' => [
                    'schemaUrl' => $this->Link('schemaWithValidate/remoteEditForm')
                ],
                'remoteCreateForm' => [
                    'schemaUrl' => $this->Link('schema/remoteCreateForm')
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
            ],
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
            return new HTTPResponse(null, 400);
        }

        // Check parent record
        /** @var Folder $parentRecord */
        $parentRecord = null;
        if (!empty($data['ParentID']) && is_numeric($data['ParentID'])) {
            $parentRecord = Folder::get()->byID($data['ParentID']);
        }
        $data['Parent'] = $parentRecord;

        $tmpFile = $request->postVar('Upload');
        if (!$upload->validate($tmpFile)) {
            $result = ['message' => null];
            $errors = $upload->getErrors();
            if ($message = array_shift($errors)) {
                $result['message'] = [
                    'type' => 'error',
                    'value' => $message,
                ];
            }
            return (new HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        // TODO Allow batch uploads
        $fileClass = File::get_class_for_file_extension(File::get_file_extension($tmpFile['name']));
        /** @var File $file */
        $file = Injector::inst()->create($fileClass);

        // check canCreate permissions
        if (!$file->canCreate(null, $data)) {
            $result = ['message' => [
                'type' => 'error',
                'value' => _t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.CreatePermissionDenied',
                    'You do not have permission to add files'
                )
            ]];
            return (new HTTPResponse(json_encode($result), 403))
                ->addHeader('Content-Type', 'application/json');
        }

        $uploadResult = $upload->loadIntoFile($tmpFile, $file, $parentRecord ? $parentRecord->getFilename() : '/');
        if (!$uploadResult) {
            $result = ['message' => [
                'type' => 'error',
                'value' => _t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.LoadIntoFileFailed',
                    'Failed to load file'
                )
            ]];
            return (new HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $file->ParentID = $parentRecord ? $parentRecord->ID : 0;
        $file->write();

        $result = [$this->getObjectFromData($file)];

        // Don't discard pre-generated client side canvas thumbnail
        if ($result[0]['category'] === 'image') {
            unset($result[0]['thumbnail']);
        }

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
            return new HTTPResponse(null, 400);
        }
        $tmpFile = $data['Upload'];
        if (empty($data['ID']) || empty($tmpFile['name']) || !array_key_exists('Name', $data)) {
            return new HTTPResponse('Invalid request', 400);
        }

        // Check parent record
        /** @var File $file */
        $file = File::get()->byID($data['ID']);
        if (!$file) {
            return new HTTPResponse('File not found', 404);
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
            $result = ['message' => null];
            $errors = $upload->getErrors();
            if ($message = array_shift($errors)) {
                $result['message'] = [
                    'type' => 'error',
                    'value' => $message,
                ];
            }
            return (new HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        try {
            $tuple = $upload->load($tmpFile, $folder);
        } catch (Exception $e) {
            $result = [
                'message' => [
                    'type' => 'error',
                    'value' => $e->getMessage(),
                ]
            ];
            return (new HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        if ($upload->isError()) {
            $result['message'] = [
                'type' => 'error',
                'value' => implode(' ' . PHP_EOL, $upload->getErrors()),
            ];
            return (new HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $tuple['Name'] = basename($tuple['Filename']);
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
            return new HTTPResponse(null, 400);
        }

        $class = File::class;
        $file = DataObject::get($class)->byID($fileId);

        if (!$file) {
            return new HTTPResponse(null, 404);
        }

        if (!$file->canView()) {
            return new HTTPResponse(null, 403);
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
        foreach (array_reverse($copy) as $k => $v) {
            if ($prev) {
                $next[$v] = $prev;
            }

            $prev = $v;
        }

        $_cachedMembers = array();

        /** @var File $version */
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
                    'versionid' => $version->Version,
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

        return
            (new HTTPResponse(json_encode($output)))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Redirects 3.x style detail links to new 4.x style routing.
     *
     * @param HTTPRequest $request
     */
    public function legacyRedirectForEditView($request)
    {
        $fileID = $request->param('FileID');
        /** @var File $file */
        $file = File::get()->byID($fileID);
        $link = $this->getFileEditLink($file) ?: $this->Link();
        $this->redirect($link);
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
     * @param  string             $filename Path name
     * @return AssetNameGenerator
     */
    protected function getNameGenerator($filename)
    {
        return Injector::inst()
            ->createWithArgs('AssetNameGenerator', array($filename));
    }

    /**
     * @todo Implement on client
     *
     * @param bool $unlinked
     * @return ArrayList
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
        return $this->getAbstractFileForm($id, 'fileEditForm');
    }

    /**
     * Get file edit form
     *
     * @param HTTPRequest $request
     * @return Form
     */
    public function fileEditForm($request = null)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->httpError(400);
            return null;
        }
        $id = $request->param('ID');
        if (!$id) {
            $this->httpError(400);
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
        return $this->getAbstractFileForm($id, 'fileInsertForm', [ 'Type' => AssetFormFactory::TYPE_INSERT ]);
    }

    /**
     * Get file insert form
     *
     * @return Form
     */
    public function fileInsertForm()
    {
        // Get ID either from posted back value, or url parameter
        $request = $this->getRequest();
        $id = $request->param('ID') ?: $request->postVar('ID');
        return $this->getFileInsertForm($id);
    }

    /**
     * Abstract method for generating a form for a file
     *
     * @param int $id Record ID
     * @param string $name Form name
     * @param array $context Form context
     * @return Form
     */
    protected function getAbstractFileForm($id, $name, $context = [])
    {
        /** @var File $file */
        $file = File::get()->byID($id);

        if (!$file) {
            $this->httpError(404);
            return null;
        }

        if (!$file->canView()) {
            $this->httpError(403, _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ErrorItemPermissionDenied',
                'You don\'t have the necessary permissions to modify {ObjectTitle}',
                '',
                ['ObjectTitle' => $file->i18n_singular_name()]
            ));
            return null;
        }

        // Pass to form factory
        $augmentedContext = array_merge($context, ['Record' => $file]);
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
     * @return Form
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
            return $this->httpError(404);
        }

        /** @var File $file */
        $file = Versioned::get_version(File::class, $id, $versionId);
        if (!$file) {
            return $this->httpError(404);
        }

        if (!$file->canView()) {
            $this->httpError(403, _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ErrorItemPermissionDenied',
                'You don\'t have the necessary permissions to modify {ObjectTitle}',
                '',
                ['ObjectTitle' => $file->i18n_singular_name()]
            ));
            return null;
        }

        $effectiveContext = array_merge($context, ['Record' => $file]);
        /** @var FormFactory $scaffolder */
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
     *
     * WARNING: Experimental API.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function schema($request)
    {
        $formName = $request->param('FormName');
        if ($formName !== 'fileHistoryForm') {
            return parent::schema($request);
        }

        // Get schema for history form
        // @todo Eventually all form scaffolding will be based on context rather than record ID
        // See https://github.com/silverstripe/silverstripe-framework/issues/6362
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
     * @return Form
     */
    public function fileHistoryForm($request = null)
    {
        // Get ID either from posted back value, or url parameter
        if (!$request) {
            $this->httpError(400);
            return null;
        }
        $id = $request->param('ID');
        if (!$id) {
            $this->httpError(400);
            return null;
        }
        $versionID = $request->param('VersionID');
        if (!$versionID) {
            $this->httpError(400);
            return null;
        }
        $form = $this->getFileHistoryForm([
            'RecordID' => $id,
            'RecordVersion' => $versionID,
        ]);
        return $form;
    }

    /**
     * @param array $data
     * @param Form $form
     * @return HTTPResponse
     */
    public function createfolder($data, $form)
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
        if (!Folder::singleton()->canCreate(Member::currentUser(), $data)) {
            throw new \InvalidArgumentException(sprintf(
                '%s create not allowed',
                Folder::class
            ));
        }

        $folder = Folder::create();
        $form->saveInto($folder);
        $folder->write();

        // Return the record data in the same response as the schema to save a postback
        $schemaData = ['record' => $this->getObjectFromData($folder)];
        $schemaId = Controller::join_links($this->Link('schema/folderCreateForm'), $folder->ID);
        return $this->getSchemaResponse($schemaId, $form, null, $schemaData);
    }

    /**
     * @param array $data
     * @param Form $form
     * @return HTTPResponse
     */
    public function save($data, $form)
    {
        return $this->saveOrPublish($data, $form, false);
    }

    /**
     * @param array $data
     * @param Form $form
     * @return HTTPResponse
     */
    public function publish($data, $form)
    {
        return $this->saveOrPublish($data, $form, true);
    }

    /**
     * Update thisrecord
     *
     * @param array $data
     * @param Form $form
     * @param bool $doPublish
     * @return HTTPResponse
     */
    protected function saveOrPublish($data, $form, $doPublish = false)
    {
        if (!isset($data['ID']) || !is_numeric($data['ID'])) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $id = (int) $data['ID'];
        /** @var File $record */
        $record = DataObject::get_by_id(File::class, $id);

        if (!$record) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!$record->canEdit() || ($doPublish && !$record->canPublish())) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        // check File extension
        if (!empty($data['FileFilename'])) {
            $extension = File::get_file_extension($data['FileFilename']);
            $newClass = File::get_class_for_file_extension($extension);

            // if the class has changed, cast it to the proper class
            if ($record->getClassName() !== $newClass) {
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

        // Note: Force return of schema / state in success result
        return $this->getRecordUpdatedResponse($record, $form);
    }

    public function unpublish($data, $form)
    {
        if (!isset($data['ID']) || !is_numeric($data['ID'])) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $id = (int) $data['ID'];
        /** @var File $record */
        $record = DataObject::get_by_id(File::class, $id);

        if (!$record) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!$record->canUnpublish()) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        $record->doUnpublish();
        return $this->getRecordUpdatedResponse($record, $form);
    }

    /**
     * @param File $file
     *
     * @return array
     */
    public function getObjectFromData(File $file)
    {
        $object = array(
            'id' => $file->ID,
            'created' => $file->Created,
            'lastUpdated' => $file->LastEdited,
            'owner' => null,
            'parent' => null,
            'title' => $file->Title,
            'exists' => $file->exists(), // Broken file check
            'type' => $file instanceof Folder ? 'folder' : $file->FileType,
            'category' => $file instanceof Folder ? 'folder' : $file->appCategory(),
            'name' => $file->Name,
            'filename' => $file->Filename,
            'extension' => $file->Extension,
            'size' => $file->AbsoluteSize,
            'url' => $file->AbsoluteURL,
            'published' => $file->isPublished(),
            'modified' => $file->isModifiedOnDraft(),
            'draft' => $file->isOnDraftOnly(),
            'canEdit' => $file->canEdit(),
            'canDelete' => $file->canArchive(),
        );

        /** @var Member $owner */
        $owner = $file->Owner();

        if ($owner) {
            $object['owner'] = array(
                'id' => $owner->ID,
                'title' => trim($owner->FirstName . ' ' . $owner->Surname),
            );
        }

        /** @var Folder $parent */
        $parent = $file->Parent();

        if ($parent) {
            $object['parent'] = array(
                'id' => $parent->ID,
                'title' => $parent->Title,
                'filename' => $parent->Filename,
            );
        }

        /** @var File $file */
        if ($file->getIsImage()) {
            // Small thumbnail
            $smallWidth = UploadField::config()->uninherited('thumbnail_width');
            $smallHeight = UploadField::config()->uninherited('thumbnail_height');
            $smallThumbnail = $file->FitMax($smallWidth, $smallHeight);
            if ($smallThumbnail && $smallThumbnail->exists()) {
                $object['smallThumbnail'] = $smallThumbnail->getAbsoluteURL();
            }

            // Large thumbnail
            $width = $this->config()->get('thumbnail_width');
            $height = $this->config()->get('thumbnail_height');
            $thumbnail = $file->FitMax($width, $height);
            if ($thumbnail && $thumbnail->exists()) {
                $object['thumbnail'] = $thumbnail->getAbsoluteURL();
            }
            $object['width'] = $file->Width;
            $object['height'] = $file->Height;
        } else {
            $object['thumbnail'] = $file->PreviewLink();
        }

        return $object;
    }

    /**
     * Action handler for adding pages to a campaign
     *
     * @param array $data
     * @param Form $form
     * @return DBHTMLText|HTTPResponse
     */
    public function addtocampaign($data, $form)
    {
        $id = $data['ID'];
        $record = File::get()->byID($id);

        $handler = AddToCampaignHandler::create($this, $record, 'addToCampaignForm');
        $results = $handler->addToCampaign($record, $data['Campaign']);
        if (!isset($results)) {
            return null;
        }

        // Send extra "message" data with schema response
        $extraData = ['message' => $results];
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
     * @return Form
     */
    public function getAddToCampaignForm($id)
    {
        // Get record-specific fields
        $record = File::get()->byID($id);

        if (!$record) {
            $this->httpError(404, _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ErrorNotFound',
                'That {Type} couldn\'t be found',
                '',
                ['Type' => File::singleton()->i18n_singular_name()]
            ));
            return null;
        }
        if (!$record->canView()) {
            $this->httpError(403, _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ErrorItemPermissionDenied',
                'You don\'t have the necessary permissions to modify {ObjectTitle}',
                '',
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
            array_filter(File::config()->uninherited('allowed_extensions'))
        );

        return $upload;
    }

    /**
     * Get response for successfully updated record
     *
     * @param File $record
     * @param Form $form
     * @return HTTPResponse
     */
    protected function getRecordUpdatedResponse($record, $form)
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
            $this->httpError(400);
            return null;
        }
        $id = $request->param('ParentID');
        // Fail on null ID (but not parent)
        if (!isset($id)) {
            $this->httpError(400);
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
        /** @var FolderCreateFormFactory $factory */
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
     * Form for creating a new OEmbed object in the WYSIWYG, used by the InsertEmbedModal component
     *
     * @param null $id
     * @return mixed
     */
    public function getRemoteCreateForm($id = null)
    {
        return Injector::inst()->get(RemoteFileFormFactory::class)
            ->getForm($this, 'remoteCreateForm', ['type' => 'create']);
    }

    /**
     * Allow form to be accessible for schema
     *
     * @return mixed
     */
    public function remoteCreateForm()
    {
        return $this->getRemoteCreateForm();
    }

    /**
     * Form for editing a OEmbed object in the WYSIWYG, used by the InsertEmbedModal component
     *
     * @return mixed
     */
    public function getRemoteEditForm()
    {
        $url = $this->request->requestVar('embedurl');
        $form = null;
        $form = Injector::inst()->get(RemoteFileFormFactory::class)
            ->getForm($this, 'remoteEditForm', ['type' => 'edit', 'url' => $url]);
        return $form;
    }

    /**
     * Allow form to be accessible for schema
     *
     * @return mixed
     */
    public function remoteEditForm()
    {
        return $this->getRemoteEditForm();
    }

    /**
     * Capture the schema handling process, as there is validation done to the URL provided before form is generated
     *
     * @param $request
     * @return HTTPResponse
     */
    public function schemaWithValidate(HTTPRequest $request)
    {
        $formName = $request->param('FormName');
        $itemID = $request->param('ItemID');

        if (!$formName) {
            return (new HTTPResponse('Missing request params', 400));
        }

        $formMethod = "get{$formName}";
        if (!$this->hasMethod($formMethod)) {
            return (new HTTPResponse('Form not found', 404));
        }

        if (!$this->hasAction($formName)) {
            return (new HTTPResponse('Form not accessible', 401));
        }

        $schemaID = $request->getURL();
        try {
            if ($itemID) {
                $form = $this->{$formMethod}($itemID);
            } else {
                $form = $this->{$formMethod}();
            }
            return $this->getSchemaResponse($schemaID, $form);
        } catch (InvalidUrlException $exception) {
            $errors = ValidationResult::create()
                ->addError($exception->getMessage());
            $form = Form::create(null, 'Form', FieldList::create(), FieldList::create());
            $code = $exception->getCode();

            if ($code < 300) {
                $code = 500;
            }

            return $this->getSchemaResponse($schemaID, $form, $errors)
                ->setStatusCode($code);
        }
    }
}
