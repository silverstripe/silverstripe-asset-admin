<?php

namespace SilverStripe\AssetAdmin\Controller;

use InvalidArgumentException;
use SilverStripe\Admin\AddToCampaignHandler;
use SilverStripe\Admin\CMSBatchActionHandler;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderFormFactory;
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
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DateField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\HeaderField;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\Search\SearchContext;
use SilverStripe\Security\Member;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\SecurityToken;
use SilverStripe\View\Requirements;
use SilverStripe\ORM\Versioning\Versioned;

/**
 * AssetAdmin is the 'file store' section of the CMS.
 * It provides an interface for manipulating the File and Folder objects in the system.
 */
class AssetAdmin extends LeftAndMain implements PermissionProvider
{
    private static $url_segment = 'assets';

    private static $url_rule = '/$Action/$ID';

    private static $menu_title = 'Files';

    private static $tree_class = 'SilverStripe\\Assets\\Folder';

    private static $url_handlers = [
        // Legacy redirect for SS3-style detail view
        'EditForm/field/File/item/$FileID/$Action' => 'legacyRedirectForEditView',
        // Pass all URLs to the index, for React to unpack
        'show/$FolderID/edit/$FileID' => 'index',
        // API access points with structured data
        'POST api/createFolder' => 'apiCreateFolder',
        'POST api/createFile' => 'apiCreateFile',
        'GET api/readFolder' => 'apiReadFolder',
        'PUT api/updateFolder' => 'apiUpdateFolder',
        'DELETE api/delete' => 'apiDelete',
        'GET api/search' => 'apiSearch',
        'GET api/history' => 'apiHistory'
    ];

    /**
     * Amount of results showing on a single page.
     *
     * @config
     * @var int
     */
    private static $page_length = 15;

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
        'apiCreateFolder',
        'apiCreateFile',
        'apiReadFolder',
        'apiUpdateFolder',
        'apiHistory',
        'apiDelete',
        'apiSearch',
        'FileEditForm',
        'FileHistoryForm',
        'AddToCampaignForm',
        'FileInsertForm',
        'schema',
    );

    private static $required_permission_codes = 'CMS_ACCESS_AssetAdmin';

    private static $thumbnail_width = 400;

    private static $thumbnail_height = 300;

    /**
     * Set up the controller
     */
    public function init()
    {
        parent::init();

        Requirements::add_i18n_javascript(ASSET_ADMIN_DIR . '/client/lang', false, true);
        Requirements::javascript(ASSET_ADMIN_DIR . "/client/dist/js/bundle.js");
        Requirements::css(ASSET_ADMIN_DIR . "/client/dist/styles/bundle.css");

        CMSBatchActionHandler::register(
            'delete',
            'SilverStripe\AssetAdmin\BatchAction\DeleteAssets',
            'SilverStripe\\Assets\\Folder'
        );
    }

    public function getClientConfig()
    {
        $baseLink = $this->Link();
        return array_merge( parent::getClientConfig(), [
            'reactRouter' => true,
            'createFileEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/createFile'),
                'method' => 'post',
                'payloadFormat' => 'urlencoded',
            ],
            'createFolderEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/createFolder'),
                'method' => 'post',
                'payloadFormat' => 'urlencoded',
            ],
            'readFolderEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/readFolder'),
                'method' => 'get',
                'responseFormat' => 'json',
            ],
            'searchEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/search'),
                'method' => 'get',
                'responseFormat' => 'json',
            ],
            'updateFolderEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/updateFolder'),
                'method' => 'put',
                'payloadFormat' => 'urlencoded',
            ],
            'deleteEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/delete'),
                'method' => 'delete',
                'payloadFormat' => 'urlencoded',
            ],
            'historyEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/history'),
                'method' => 'get',
                'responseFormat' => 'json'
            ],
            'limit' => $this->config()->page_length,
            'form' => [
                'FileEditForm' => [
                    'schemaUrl' => $this->Link('schema/FileEditForm')
                ],
                'FileInsertForm' => [
                    'schemaUrl' => $this->Link('schema/FileInsertForm')
                ],
                'AddToCampaignForm' => [
                    'schemaUrl' => $this->Link('schema/AddToCampaignForm')
                ],
                'FileHistoryForm' => [
                    'schemaUrl' => $this->Link('schema/FileHistoryForm')
                ]
            ],
        ]);
    }

    /**
     * Fetches a collection of files by ParentID.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function apiReadFolder(HTTPRequest $request)
    {
        $params = $request->requestVars();
        $items = array();
        $parentId = null;
        $folderID = null;

        if (!isset($params['id']) && !strlen($params['id'])) {
            $this->httpError(400);
        }

        $folderID = (int)$params['id'];
        /** @var Folder $folder */
        $folder = $folderID ? Folder::get()->byID($folderID) : Folder::singleton();

        if (!$folder) {
            $this->httpError(400);
        }

        // TODO Limit results to avoid running out of memory (implement client-side pagination)
        $files = $this->getList()->filter('ParentID', $folderID);

        if ($files) {
            /** @var File $file */
            foreach ($files as $file) {
                if (!$file->canView()) {
                    continue;
                }

                $items[] = $this->getObjectFromData($file);
            }
        }

        // Build parents (for breadcrumbs)
        $parents = [];
        $next = $folder->Parent();
        while($next && $next->exists()) {
            array_unshift($parents, [
                'id' => $next->ID,
                'title' => $next->getTitle(),
                'filename' => $next->getFilename(),
            ]);
            if($next->ParentID) {
                $next = $next->Parent();
            } else {
                break;
            }
        }

        // Build response
        $response = new HTTPResponse();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode([
            'files' => $items,
            'title' => $folder->getTitle(),
            'count' => count($items),
            'parents' => $parents,
            'parent' => $parents ? $parents[count($parents) - 1] : null,
            'parentID' => $folder->exists() ? $folder->ParentID : null, // grandparent
            'folderID' => $folderID,
            'canEdit' => $folder->canEdit(),
            'canDelete' => $folder->canArchive(),
        ]));

        return $response;
    }

    /**
     * @param HTTPRequest $request
     *
     * @return HTTPResponse
     */
    public function apiSearch(HTTPRequest $request)
    {
        $params = $request->getVars();
        $list = $this->getList($params);

        $response = new HTTPResponse();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode([
            // Serialisation
            "files" => array_map(function($file) {
                return $this->getObjectFromData($file);
            }, $list->toArray()),
            "count" => $list->count(),
        ]));

        return $response;
    }

    /**
     * @param HTTPRequest $request
     *
     * @return HTTPResponse
     */
    public function apiDelete(HTTPRequest $request)
    {
        parse_str($request->getBody(), $vars);

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($vars[$token->getName()]) || !$token->check($vars[$token->getName()])) {
            return new HTTPResponse(null, 400);
        }

        if (!isset($vars['ids']) || !$vars['ids']) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $fileIds = $vars['ids'];
        $files = $this->getList()->filter("ID", $fileIds)->toArray();

        if (!count($files)) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!min(array_map(function (File $file) {
            return $file->canArchive();
        }, $files))) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        /** @var File $file */
        foreach ($files as $file) {
            $file->doArchive();
        }

        return (new HTTPResponse(json_encode(['status' => 'file was deleted'])))
            ->addHeader('Content-Type', 'application/json');
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
        $upload = $this->getUpload();

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
        if(!$upload->validate($tmpFile)) {
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
        if(!$uploadResult) {
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

        return (new HTTPResponse(json_encode($result)))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * Returns a JSON array for history of a given file ID. Returns a list of all the history.
     *
     * @param HTTPRequest
     *
     * @return HTTPResponse
     */
    public function apiHistory(HTTPRequest $request)
    {
        // CSRF check not required as the GET request has no side effects.
        $fileId = $request->getVar('fileId');

        if(!$fileId || !is_numeric($fileId)) {
            return new HTTPResponse(null, 400);
        }

        $class = File::class;
        $file = DataObject::get($class)->byId($fileId);

        if(!$file) {
            return new HTTPResponse(null, 404);
        }

        if(!$file->canView()) {
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
        foreach(array_reverse($copy) as $k => $v) {
            if($prev) {
                $next[$v] = $prev;
            }

            $prev = $v;
        }

        $_cachedMembers = array();

        foreach($versions as $version) {
            $author = null;

            if($version->AuthorID) {
                if(!isset($_cachedMembers[$version->AuthorID])) {
                    $_cachedMembers[$version->AuthorID] = DataObject::get(Member::class)
                        ->byId($version->AuthorID);
                }

                $author = $_cachedMembers[$version->AuthorID];
            }

            if($version->canView()) {
                $published = true;

                if(isset($next[$version->Version])) {
                    $summary = $version->humanizedChanges(
                        $version->Version,
                        $next[$version->Version]
                    );

                    // if no summary returned by humanizedChanges, i.e we cannot work out what changed, just show a
                    // generic message
                    if(!$summary) {
                        $summary = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.SAVEDFILE', "Saved file");
                    }
                } else {
                    $summary = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.UPLOADEDFILE', "Uploaded file");
                }

                $output[] = array(
                    'versionid' => $version->Version,
                    'date_ago' => $version->dbObject('LastEdited')->Ago(),
                    'date_formatted' => $version->dbObject('LastEdited')->Nice(),
                    'status' => ($version->WasPublished) ? _t('File.PUBLISHED', 'Published') : '',
                    'author' => ($author)
                        ? $author->Name
                        : _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.UNKNOWN', "Unknown"),
                    'summary' => ($summary) ? $summary : _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.NOSUMMARY', "No summary available")
                );
            }
        }

        return
            (new HTTPResponse(json_encode($output)))->addHeader('Content-Type', 'application/json');

    }


    /**
     * Creates a single folder, within an optional parent folder.
     *
     * @param HTTPRequest $request
     * @return HTTPRequest|HTTPResponse
     */
    public function apiCreateFolder(HTTPRequest $request)
    {
        $data = $request->postVars();

        $class = 'SilverStripe\\Assets\\Folder';

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($data[$token->getName()]) || !$token->check($data[$token->getName()])) {
            return new HTTPResponse(null, 400);
        }

        // check addchildren permissions
        /** @var Folder $parentRecord */
        $parentRecord = null;
        if (!empty($data['ParentID']) && is_numeric($data['ParentID'])) {
            $parentRecord = DataObject::get_by_id($class, $data['ParentID']);
        }
        $data['Parent'] = $parentRecord;
        $data['ParentID'] = $parentRecord ? (int)$parentRecord->ID : 0;

        // Build filename
        $baseFilename = isset($data['Name'])
            ? basename($data['Name'])
            : _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.NEWFOLDER', "NewFolder");

        if ($parentRecord && $parentRecord->ID) {
            $baseFilename = $parentRecord->getFilename() . '/' . $baseFilename;
        }

        // Ensure name is unique
        $nameGenerator = $this->getNameGenerator($baseFilename);
        $filename = null;
        foreach ($nameGenerator as $filename) {
            if (! File::find($filename)) {
                break;
            }
        }
        $data['Name'] = basename($filename);

        // Create record
        /** @var Folder $record */
        $record = Injector::inst()->create($class);

        // check create permissions
        if (!$record->canCreate(null, $data)) {
            return (new HTTPResponse(null, 403))
                ->addHeader('Content-Type', 'application/json');
        }

        $record->ParentID = $data['ParentID'];
        $record->Name = $record->Title = basename($data['Name']);
        $record->write();

        $result = $this->getObjectFromData($record);

        return (new HTTPResponse(json_encode($result)))->addHeader('Content-Type', 'application/json');
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
        if(!$file || !$file->isInDB()) {
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
     * Get the search context from {@link File}, used to create the search form
     * as well as power the /search API endpoint.
     *
     * @return SearchContext
     */
    public function getSearchContext()
    {
        $context = File::singleton()->getDefaultSearchContext();

        // Customize fields
        $dateHeader = HeaderField::create('Date', _t('CMSSearch.FILTERDATEHEADING', 'Date'), 4);
        $dateFrom = DateField::create('CreatedFrom', _t('CMSSearch.FILTERDATEFROM', 'From'))
        ->setConfig('showcalendar', true);
        $dateTo = DateField::create('CreatedTo', _t('CMSSearch.FILTERDATETO', 'To'))
        ->setConfig('showcalendar', true);
        $dateGroup = FieldGroup::create(
            $dateHeader,
            $dateFrom,
            $dateTo
        );
        $context->addField($dateGroup);
        /** @skipUpgrade */
        $appCategories = array(
            'archive' => _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryArchive',
                'Archive'
            ),
            'audio' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryAudio', 'Audio'),
            'document' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryDocument', 'Document'),
            'flash' => _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryFlash',
                'Flash',
                'The fileformat'
            ),
            'image' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryImage', 'Image'),
            'video' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryVideo', 'Video'),
        );
        $context->addField(
            $typeDropdown = new DropdownField(
                'AppCategory',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Filetype', 'File type'),
                $appCategories
            )
        );

        $typeDropdown->setEmptyString(' ');

        $currentfolderLabel = _t(
            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.CurrentFolderOnly',
            'Limit to current folder?'
        );
        $context->addField(
            new CheckboxField('CurrentFolderOnly', $currentfolderLabel)
        );
        $context->getFields()->removeByName('Title');

        return $context;
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
                'name' => _t('CMSMain.ACCESS', "Access to '{title}' section", array(
                    'title' => static::menu_title()
                )),
                'category' => _t('Permission.CMS_ACCESS_CATEGORY', 'CMS Access')
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
        /** @var File $file */
        $file = $this->getList()->byID($id);

        if (!$file->canView()) {
            $this->httpError(403, _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ErrorItemPermissionDenied',
                'You don\'t have the necessary permissions to modify {ObjectTitle}',
                '',
                ['ObjectTitle' => $file->i18n_singular_name()]
            ));
            return null;
        }

        $scaffolder = $this->getFormFactory($file);
        $form = $scaffolder->getForm($this, 'FileEditForm', [
            'Record' => $file
        ]);

        // Configure form to respond to validation errors with form schema
        // if requested via react.
        $form->setValidationResponseCallback(function() use ($form, $file) {
            $schemaId = Controller::join_links($this->Link('schema/FileEditForm'), $file->exists() ? $file->ID : '');
            return $this->getSchemaResponse($form, $schemaId);
        });

        return $form;
    }

    /**
     * Get file edit form
     *
     * @return Form
     */
    public function FileEditForm()
    {
        // Get ID either from posted back value, or url parameter
        $request = $this->getRequest();
        $id = $request->param('ID') ?: $request->postVar('ID');
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
        /** @var File $file */
        $file = $this->getList()->byID($id);

        if (!$file->canView()) {
            $this->httpError(403, _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ErrorItemPermissionDenied',
                'You don\'t have the necessary permissions to modify {ObjectTitle}',
                '',
                ['ObjectTitle' => $file->i18n_singular_name()]
            ));
            return null;
        }

        $scaffolder = $this->getFormFactory($file);
        $form = $scaffolder->getForm($this, 'FileInsertForm', [
            'Record' => $file,
            'Type' => 'insert',
        ]);

        return $form;
    }

    /**
     * Get file insert form
     *
     * @return Form
     */
    public function FileInsertForm()
    {
        // Get ID either from posted back value, or url parameter
        $request = $this->getRequest();
        $id = $request->param('ID') ?: $request->postVar('ID');
        return $this->getFileInsertForm($id);
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
        if(!$id || !$versionId) {
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
        $form = $scaffolder->getForm($this, 'FileHistoryForm', $effectiveContext);

        // Configure form to respond to validation errors with form schema
        // if requested via react.
        $form->setValidationResponseCallback(function() use ($form, $id, $versionId) {
            $schemaId = Controller::join_links($this->Link('schema/FileHistoryForm'), $id, $versionId);
            return $this->getSchemaResponse($form, $schemaId);
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
	public function schema($request) {
		$formName = $request->param('FormName');
        if ($formName !== 'FileHistoryForm') {
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
        $response->setBody(Convert::raw2json($this->getSchemaForForm($form)));
        return $response;
	}

    /**
     * Get file history form
     *
     * @return Form
     */
    public function FileHistoryForm()
    {
        $request = $this->getRequest();
        $id = $request->param('ID') ?: $request->postVar('ID');
        $version = $request->param('OtherID') ?: $request->postVar('Version');
        $form = $this->getFileHistoryForm([
            'RecordID' => $id,
            'RecordVersion' => $version,
        ]);
        return $form;
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
        $record = $this->getList()->filter('ID', $id)->first();

        if (!$record) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!$record->canEdit() || ($doPublish && !$record->canPublish())) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        $form->saveInto($record);
        $record->write();

        // Publish this record and owned objects
        if ($doPublish) {
            $record->publishRecursive();
        }

        // Return the record data in the same response as the schema to save a postback
        $schemaId = Controller::join_links($this->Link('schema/FileEditForm'), $record->exists() ? $record->ID : '');
        $schemaData = $this->getSchemaForForm($this->getFileEditForm($id), $schemaId);
        $schemaData['record'] = $this->getObjectFromData($record);
        $response = new HTTPResponse(Convert::raw2json($schemaData));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
    }

    public function unpublish($data, $form)
    {
        if (!isset($data['ID']) || !is_numeric($data['ID'])) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $id = (int) $data['ID'];
        /** @var File $record */
        $record = $this->getList()->filter('ID', $id)->first();

        if (!$record) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!$record->canUnpublish()) {
            return (new HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        $record->doUnpublish();

        // Return the record data in the same response as the schema to save a postback
        $schemaId = Controller::join_links($this->Link('schema/FileEditForm'), $record->exists() ? $record->ID : '');
        $schemaData = $this->getSchemaForForm($this->getFileEditForm($id), $schemaId);
        $schemaData['record'] = $this->getObjectFromData($record);
        $response = new HTTPResponse(Convert::raw2json($schemaData));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
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
            'size' => $file->Size,
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
            $smallWidth = UploadField::config()->get('thumbnail_width');
            $smallHeight = UploadField::config()->get('thumbnail_height');
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
            $object['dimensions']['width'] = $file->Width;
            $object['dimensions']['height'] = $file->Height;
        }

        return $object;
    }

    /**
     * Returns the files and subfolders contained in the currently selected folder,
     * defaulting to the root node. Doubles as search results, if any search parameters
     * are set through {@link SearchForm()}.
     *
     * @param array $params Unsanitised request parameters
     * @return DataList
     */
    protected function getList($params = array())
    {
        $context = $this->getSearchContext();

        // Overwrite name filter to search both Name and Title attributes
        $context->removeFilterByName('Name');

        // Lazy loaded list. Allows adding new filters through SearchContext.
        /** @var DataList $list */
        $list = $context->getResults($params);

        // Re-add previously removed "Name" filter as combined filter
        // TODO Replace with composite SearchFilter once that API exists
        if(!empty($params['Name'])) {
            $list = $list->filterAny(array(
                'Name:PartialMatch' => $params['Name'],
                'Title:PartialMatch' => $params['Name']
            ));
        }

        // Optionally limit search to a folder (non-recursive)
        if(!empty($params['ParentID']) && is_numeric($params['ParentID'])) {
            $list = $list->filter('ParentID', $params['ParentID']);
        }

        // Date filtering
        if (!empty($params['CreatedFrom'])) {
            $fromDate = new DateField(null, null, $params['CreatedFrom']);
            $list = $list->filter("Created:GreaterThanOrEqual", $fromDate->dataValue().' 00:00:00');
        }
        if (!empty($params['CreatedTo'])) {
            $toDate = new DateField(null, null, $params['CreatedTo']);
            $list = $list->filter("Created:LessThanOrEqual", $toDate->dataValue().' 23:59:59');
        }

        // Categories
        if (!empty($filters['AppCategory']) && !empty(File::config()->app_categories[$filters['AppCategory']])) {
            $extensions = File::config()->app_categories[$filters['AppCategory']];
            $list = $list->filter('Name:PartialMatch', $extensions);
        }

        // Sort folders first
        $list = $list->sort(
            '(CASE WHEN "File"."ClassName" = \'Folder\' THEN 0 ELSE 1 END), "Name"'
        );

        // Pagination
        if (isset($filters['page']) && isset($filters['limit'])) {
            $page = $filters['page'];
            $limit = $filters['limit'];
            $offset = ($page - 1) * $limit;
            $list = $list->limit($limit, $offset);
        }

        // Access checks
        $list = $list->filterByCallback(function(File $file) {
            return $file->canView();
        });

        return $list;
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
        $record = $this->getList()->byID($id);

        $handler = AddToCampaignHandler::create($this, $record);
        $results = $handler->addToCampaign($record, $data['Campaign']);
        if (!isset($results)) {
            return null;
        }
        $request = $this->getRequest();
        if($request->getHeader('X-Formschema-Request')) {
            $data = $this->getSchemaForForm($handler->Form($record));
            $data['message'] = $results;

            $response = new HTTPResponse(Convert::raw2json($data));
            $response->addHeader('Content-Type', 'application/json');
            return $response;
        }
        return $results;
    }

    /**
     * Url handler for add to campaign form
     *
     * @param HTTPRequest $request
     * @return Form
     */
    public function AddToCampaignForm($request)
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
        $record = $this->getList()->byID($id);

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

        $handler = AddToCampaignHandler::create($this, $record);
        $form = $handler->Form($record);

        $form->setValidationResponseCallback(function() use ($form, $id) {
            $schemaId = Controller::join_links($this->Link('schema/AddToCampaignForm'), $id);
            return $this->getSchemaResponse($form, $schemaId);
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
            array_filter(File::config()->get('allowed_extensions'))
        );

        return $upload;
    }
}
