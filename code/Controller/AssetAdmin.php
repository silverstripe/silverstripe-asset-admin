<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Admin\CMSBatchActionHandler;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Filesystem\Storage\AssetNameGenerator;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\SecurityToken;
use SearchContext;
use DateField;
use DropdownField;
use Controller;
use FieldList;
use Form;
use CheckboxField;
use File;
use Requirements;
use Injector;
use Folder;
use HeaderField;
use FieldGroup;
use SS_HTTPRequest;
use SS_HTTPResponse;
use Upload;
use Config;


/**
 * AssetAdmin is the 'file store' section of the CMS.
 * It provides an interface for manipulating the File and Folder objects in the system.
 *
 * @package cms
 * @subpackage assets
 */
class AssetAdmin extends LeftAndMain implements PermissionProvider
{
    private static $url_segment = 'assets';

    private static $url_rule = '/$Action/$ID';

    private static $menu_title = 'Files';

    private static $tree_class = 'Folder';

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
        'PUT api/updateFile' => 'apiUpdateFile',
        'DELETE api/delete' => 'apiDelete',
        'GET api/search' => 'apiSearch',
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
     * @var array
     */
    private static $allowed_actions = array(
        'legacyRedirectForEditView',
        'apiCreateFolder',
        'apiCreateFile',
        'apiReadFolder',
        'apiUpdateFolder',
        'apiUpdateFile',
        'apiDelete',
        'apiSearch',
    );

    /**
     * Set up the controller
     */
    public function init()
    {
        parent::init();

        Requirements::add_i18n_javascript(ASSET_ADMIN_DIR . '/client/lang', false, true);
        Requirements::javascript(ASSET_ADMIN_DIR . "/client/dist/js/bundle.js");
        Requirements::css(ASSET_ADMIN_DIR . "/client/dist/styles/bundle.css");

        CMSBatchActionHandler::register('delete', 'SilverStripe\AssetAdmin\BatchAction\DeleteAssets', 'Folder');
    }

    public function getClientConfig() {
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
            'updateFileEndpoint' => [
                'url' => Controller::join_links($baseLink, 'api/updateFile'),
                'method' => 'put',
                'payloadFormat' => 'urlencoded',
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
            'limit' => $this->config()->page_length,
        ]);
	}

    /**
     * Fetches a collection of files by ParentID.
     *
     * @param SS_HTTPRequest $request
     * @return SS_HTTPResponse
     */
    public function apiReadFolder(SS_HTTPRequest $request)
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
        $folder = $folderID ? Folder::get()->byID($folderID) : singleton('Folder');

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
            ]);
            if($next->ParentID) {
                $next = $next->Parent();
            } else {
                break;
            }
        }

        // Build response
        $response = new SS_HTTPResponse();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode([
            'files' => $items,
            'title' => $folder->getTitle(),
            'count' => count($items),
            'parents' => $parents,
            'parentID' => $folder->exists() ? $folder->ParentID : null, // grandparent
            'folderID' => $folderID,
            'canEdit' => $folder->canEdit(),
            'canDelete' => $folder->canDelete(),
        ]));

        return $response;
    }

    /**
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function apiSearch(SS_HTTPRequest $request)
    {
        $params = $request->getVars();
        $list = $this->getList($params);

        $response = new SS_HTTPResponse();
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
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function apiUpdateFile(SS_HTTPRequest $request)
    {
        parse_str($request->getBody(), $data);

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($data[$token->getName()]) || !$token->check($data[$token->getName()])) {
            return new SS_HTTPResponse(null, 400);
        }

        if (!isset($data['id']) || !is_numeric($data['id'])) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $id = $data['id'];
        /** @var File $record */
        $record = $this->getList()->filter('ID', (int) $id)->first();

        if (!$record) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!$record->canEdit()) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        // TODO Use same property names and capitalisation as DataObject
        if (!empty($data['title'])) {
            $record->Title = $data['title'];
        }

        // TODO Use same property names and capitalisation as DataObject
        if (!empty($data['basename'])) {
            $record->Name = $data['basename'];
        }

        $record->write();

        return (new SS_HTTPResponse(json_encode(['status' => 'ok']), 200))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function apiDelete(SS_HTTPRequest $request)
    {
        parse_str($request->getBody(), $vars);

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($vars[$token->getName()]) || !$token->check($vars[$token->getName()])) {
            return new SS_HTTPResponse(null, 400);
        }

        if (!isset($vars['ids']) || !$vars['ids']) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $fileIds = $vars['ids'];
        $files = $this->getList()->filter("ID", $fileIds)->toArray();

        if (!count($files)) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!min(array_map(function (File $file) {
            return $file->canDelete();
        }, $files))) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        /** @var File $file */
        foreach ($files as $file) {
            $file->delete();
        }

        return (new SS_HTTPResponse(json_encode(['status' => 'file was deleted'])))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * Creates a single file based on a form-urlencoded upload.
     *
     * @param SS_HTTPRequest $request
     * @return SS_HTTPRequest|SS_HTTPResponse
     */
    public function apiCreateFile(SS_HTTPRequest $request)
    {
        $data = $request->postVars();
        $upload = $this->getUpload();

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($data[$token->getName()]) || !$token->check($data[$token->getName()])) {
            return new SS_HTTPResponse(null, 400);
        }

        // check canAddChildren permissions
        if (!empty($data['ParentID']) && is_numeric($data['ParentID'])) {
            $parentRecord = Folder::get()->byID($data['ParentID']);
            if ($parentRecord->hasMethod('canAddChildren') && !$parentRecord->canAddChildren()) {
                return (new SS_HTTPResponse(json_encode(['status' => 'error']), 403))
                    ->addHeader('Content-Type', 'application/json');
            }
        } else {
            $parentRecord = singleton('Folder');
        }

        // check create permissions
        if (!$parentRecord->canCreate()) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 403))
                ->addHeader('Content-Type', 'application/json');
        }

        $tmpFile = $request->postVar('Upload');
        if(!$upload->validate($tmpFile)) {
            $result = ['error' => $upload->getErrors()];
            return (new SS_HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        // TODO Allow batch uploads
        $fileClass = File::get_class_for_file_extension(File::get_file_extension($tmpFile['name']));
        $file = Injector::inst()->create($fileClass);
        $uploadResult = $upload->loadIntoFile($tmpFile, $file, $parentRecord ? $parentRecord->getFilename() : '/');
        if(!$uploadResult) {
            $result = ['error' => 'unknown'];
            return (new SS_HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $file->ParentID = $parentRecord->ID;
        $file->write();

        $result = [$this->getObjectFromData($file)];

        return (new SS_HTTPResponse(json_encode($result)))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * Creates a single folder, within an optional parent folder.
     *
     * @param SS_HTTPRequest $request
     * @return SS_HTTPRequest|SS_HTTPResponse
     */
    public function apiCreateFolder(SS_HTTPRequest $request)
    {
        $data = $request->postVars();

        $class = 'Folder';

        // CSRF check
        $token = SecurityToken::inst();
        if (empty($data[$token->getName()]) || !$token->check($data[$token->getName()])) {
            return new SS_HTTPResponse(null, 400);
        }

        // check addchildren permissions
        if (!empty($data['ParentID']) && is_numeric($data['ParentID'])) {
            $parentRecord = DataObject::get_by_id($class, $data['ParentID']);
            if ($parentRecord->hasMethod('canAddChildren') && !$parentRecord->canAddChildren()) {
                return (new SS_HTTPResponse(null, 403))
                    ->addHeader('Content-Type', 'application/json');
            }
        } else {
            $parentRecord = singleton($class);
        }
        $data['ParentID'] = ($parentRecord->exists()) ? (int)$parentRecord->ID : 0;

        // check create permissions
        if (!$parentRecord->canCreate()) {
            return (new SS_HTTPResponse(null, 403))
                ->addHeader('Content-Type', 'application/json');
        }

        // Build filename
        $baseFilename = isset($data['Name'])
            ? basename($data['Name'])
            : _t('AssetAdmin.NEWFOLDER', "NewFolder");

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
        $record->ParentID = $data['ParentID'];
        $record->Name = $record->Title = basename($data['Name']);
        $record->write();

        $result = [
            "ParentID" => $record->ParentID,
            "ID" => $record->ID,
            "Filename" => $record->Filename,
        ];

        return (new SS_HTTPResponse(json_encode($result)))->addHeader('Content-Type', 'application/json');
    }

    /**
     * Redirects 3.x style detail links to new 4.x style routing.
     *
     * @param SS_HTTPRequest $request
     */
    public function legacyRedirectForEditView($request)
    {
        $fileID = $request->param('FileID');
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
    public function getFileEditLink($file) {
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
        $appCategories = array(
            'archive' => _t('AssetAdmin.AppCategoryArchive', 'Archive', 'A collection of files'),
            'audio' => _t('AssetAdmin.AppCategoryAudio', 'Audio'),
            'document' => _t('AssetAdmin.AppCategoryDocument', 'Document'),
            'flash' => _t('AssetAdmin.AppCategoryFlash', 'Flash', 'The fileformat'),
            'image' => _t('AssetAdmin.AppCategoryImage', 'Image'),
            'video' => _t('AssetAdmin.AppCategoryVideo', 'Video'),
        );
        $context->addField(
            $typeDropdown = new DropdownField(
                'AppCategory',
                _t('AssetAdmin.Filetype', 'File type'),
                $appCategories
            )
        );

        $typeDropdown->setEmptyString(' ');

        $context->addField(
            new CheckboxField('CurrentFolderOnly', _t('AssetAdmin.CurrentFolderOnly', 'Limit to current folder?'))
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
     * The form is used to generate a form schema,
     * as well as an intermediary object to process data through API endpoints.
     * Since it's used directly on API endpoints, it does not have any form actions.
     *
     * @param Folder $folder
     * @return Form
     */
    protected function getFolderEditForm(Folder $folder)
    {
        $form = Form::create(
            $this,
            'FolderEditForm',
            $folder->getCMSFields(),
            FieldList::create()
        );

        return $form;
    }

    /**
     * See {@link getFolderEditForm()} for details.
     *
     * @param File $file
     * @return Form
     */
    protected function getFileEditForm(File $file)
    {
        $form = Form::create(
            $this,
            'FileEditForm',
            $file->getCMSFields(),
            FieldList::create()
        );

        return $form;
    }

    /**
     * @param File $file
     *
     * @return array
     */
    protected function getObjectFromData(File $file)
    {
        $object = array(
            'id' => $file->ID,
            'created' => $file->Created,
            'lastUpdated' => $file->LastEdited,
            'owner' => null,
            'parent' => null,
            'title' => $file->Title,
            'exists' => $file->exists(), // Broken file check
            'type' => $file->is_a('Folder') ? 'folder' : $file->FileType,
            'category' => $file->is_a('Folder') ? 'folder' : $file->appCategory(),
            'name' => $file->Name,
            'filename' => $file->Filename,
            'extension' => $file->Extension,
            'size' => $file->Size,
            'url' => $file->AbsoluteURL,
            'canEdit' => $file->canEdit(),
            'canDelete' => $file->canDelete()
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
     * @return Upload
     */
    protected function getUpload()
    {
        $upload = Upload::create();
        $upload->getValidator()->setAllowedExtensions(
            // filter out '' since this would be a regex problem on JS end
            array_filter(Config::inst()->get('File', 'allowed_extensions'))
        );

        return $upload;
    }
}
