<?php

namespace SilverStripe\Forms;

use Controller;
use File;
use Folder;
use FormField;
use Member;
use Requirements;
use SS_HTTPRequest;
use SS_HTTPResponse;
use DataList;
use Convert;
use SilverStripe\Filesystem\Storage\AssetContainer;

/**
 * Class AssetGalleryField
 * @package SilverStripe\Forms
 * @todo Consistent request parameter naming with DataObject properties (capitalisation and naming)
 */
class AssetGalleryField extends FormField
{
    /**
     * @var array
     */
    private static $allowed_actions = array(
        'item',
        'getFilesByParentID',
        'getFilesBySiblingID',
        'search',
        'update',
        'delete',
    );

    private static $url_handlers = array(
        'GET item/$ID/$Action' => 'item',
        'GET getFilesByParentID' => 'getFilesByParentID',
        'GET getFilesBySiblingID' => 'getFilesBySiblingID',
        'GET search' => 'search',
        'PUT update' => 'update',
        'DELETE delete' => 'delete',
    );

    /**
     * @config
     *
     * @var string
     */
    private static $defaultPath = 'uploads';

    /**
     * @var string
     */
    protected $currentFolder;

    /**
     * @var string
     */
    protected $idFromURL;

    /**
     * @var int
     */
    protected $limit = 10;

    /**
     * @var boolean
     */
    protected $bulkActions = true;

    /**
     * Data source.
     *
     * @var DataList
     */
    protected $list = null;

    protected $schemaDataType = 'Custom';

    protected $schemaComponent = 'AssetGalleryField';

    /**
     * @param string   $name
     * @param string   $title
     * @param DataList $dataList
     */
    public function __construct($name, $title = null, DataList $dataList = null)
    {
        parent::__construct($name, $title, null);

        if (!$dataList) {
            $dataList = File::get();
        }

        $this->setList($dataList);
    }

    /**
     * Set the data source.
     *
     * @param  DataList $list
     * @return $this
     * @throws InvalidArgumentException
     */
    public function setList(DataList $list)
    {
        if (!is_a($list->dataClass(), 'File', true)) {
            throw new \InvalidArgumentException('Requires a DataList based on File');
        }

        $this->list = $list;

        return $this;
    }

    /**
     * Get the data source.
     *
     * @return DataList
     */
    public function getList()
    {
        return $this->list;
    }

    /**
     * @return $this
     */
    public function performReadonlyTransformation()
    {
        return $this;
    }

    /**
     * @return string
     */
    public function Type()
    {
        return 'asset-gallery';
    }

    /**
     * Handles routing to a file.
     *
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function item(SS_HTTPRequest $request)
    {
        return $this->getForm()->getController();
    }

    /**
     * Fetches a collection of files by ParentID.
     *
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function getFilesByParentID(SS_HTTPRequest $request)
    {
        $params = $request->postVars();
        $items = array();
        $parentId = null;
        $folderID = $params['id'];

        if (!isset($params['id']) && !strlen($params['id'])) {
            $this->httpError(400);
        }

        // TODO Limit results to avoid running out of memory (implement client-side pagination)
        $files = $this->getList()->filter('ParentID', $params['id']);

        if (isset($this->getList()->byID($params['id'])->ParentID)) {
            $parentId = $this->getList()->byID($params['id'])->ParentID;
        }

        if ($files) {
            foreach ($files as $file) {
                if (!$file->canView()) {
                    continue;
                }

                $items[] = $this->getObjectFromData($file);
            }
        }

        $response = new SS_HTTPResponse();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode([
            'files' => $items,
            'count' => count($items),
            'parent' => $parentId,
            'folderID' => $folderID
        ]));

        return $response;
    }

    /**
     * Fetches a collection of files in the same folder as the file with the given id.
     *
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function getFilesBySiblingID(SS_HTTPRequest $request)
    {
        $params = $request->postVars();
        $parentID = 0;

        if (isset($this->getList()->byID($params['id'])->ParentID)) {
            $parentID = $this->getList()->byID($params['id'])->ParentID;
        }

        $getFilesByParentIDURL = $this->getFilesByParentIDURL();
        $postVars = [
            'id' => $parentID
        ];

        $response = new SS_HTTPRequest(
            'POST',
            $getFilesByParentIDURL,
            [],
            $postVars
        );

        return $this->getFilesByParentID($response);
    }

    /**
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function search(SS_HTTPRequest $request)
    {
        $filters = array();

        if ($name = $request->getVar('name')) {
            $filters['name'] = $name;
        }

        if ($folder = $request->getVar('folder')) {
            $filters['folder'] = $folder;
        }

        if ($folder = $request->getVar('type')) {
            $filters['type'] = $folder;
        }

        if ($createdFrom = $request->getVar('createdFrom')) {
            $filters['createdFrom'] = $createdFrom;
        }

        if ($createdTo = $request->getVar('createdTo')) {
            $filters['createdTo'] = $createdTo;
        }

        if ($onlySearchInFolder = $request->getVar('onlySearchInFolder')) {
            $filters['onlySearchInFolder'] = $onlySearchInFolder;
        }

        $filters['page'] = 1;
        $filters['limit'] = 10;

        if ($page = $request->getVar('page')) {
            $filters['page'] = $page;
        }

        if ($limit = $request->getVar('limit')) {
            $filters['limit'] = $limit;
        }

        $data = $this->getData($filters);

        $response = new SS_HTTPResponse();
        $response->addHeader('Content-Type', 'application/json');
        $response->setBody(json_encode(array(
            'files' => $data['items'],
            'count' => $data['count'],
        )));

        return $response;
    }

    /**
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function update(SS_HTTPRequest $request)
    {
        parse_str($request->getBody(), $vars);

        if (!isset($vars['id']) || !is_numeric($vars['id'])) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $id = $vars['id'];
        $file = $this->getList()->filter('id', (int) $id)->first();

        if (!$file) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!$file->canEdit()) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        $title = $request->postVar('title');
        $basename = $request->postVar('basename');

        if (!empty($title)) {
            $file->Title = $title;
        }

        if (!empty($basename)) {
            $file->Name = $basename;
        }

        $file->write();

        return (new SS_HTTPResponse(json_encode(['status' => 'ok']), 200))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * @param SS_HTTPRequest $request
     *
     * @return SS_HTTPResponse
     */
    public function delete(SS_HTTPRequest $request)
    {
        parse_str($request->getBody(), $vars);

        if (!isset($vars['ids']) || !$vars['ids']) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        $fileIds = $vars['ids'];
        $files = $this->getList()->filter("id", $fileIds)->toArray();

        if (!count($files)) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 404))
                ->addHeader('Content-Type', 'application/json');
        }

        if (!min(array_map(function ($file) {return $file->canDelete();}, $files))) {
            return (new SS_HTTPResponse(json_encode(['status' => 'error']), 401))
                ->addHeader('Content-Type', 'application/json');
        }

        foreach ($files as $file) {
            $file->delete();
        }

        return (new SS_HTTPResponse(json_encode(['status' => 'file was deleted'])))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * @param array $filters
     *
     * @return array
     */
    protected function getData($filters = array())
    {
        $items = array();
        $files = null;

        $hasFilters = (
            empty($filters["name"])
            && empty($filters["type"])
            && empty($filters["createdFrom"])
            && empty($filters["createdTo"])
        );

        $searchInFolder = (
            !empty($filters['folder'])
            && isset($filters['onlySearchInFolder'])
            && $filters['onlySearchInFolder'] == '1'
        );

        if ($searchInFolder || $hasFilters) {
            $folder = null;

            if (isset($filters['folder'])) {
                $folder = $filters['folder'];
            }

            $folder = $this->getFolder($folder);

            if ($folder && $folder->hasChildren()) {
                // When there's a folder with stuff in it.
                /** @var File[]|DataList $files */
                $files = $folder->myChildren();
            } elseif ($folder && !$folder->hasChildren()) {
                // When there's an empty folder
                $files = array();
            } else {
                // When there's no folder (we're at the top level).
                $files = $this->getList()->filter('ParentID', 0);
            }
        } else {
            $files = $this->getList();
        }

        $count = 0;

        if ($files) {
            if (!empty($filters['name'])) {
                $files = $files->filterAny(array(
                    'Name:PartialMatch' => $filters['name'],
                    'Title:PartialMatch' => $filters['name']
                ));
            }

            if (!empty($filters['createdFrom'])) {
                $fromDate = new DateField(null, null, $filters['createdFrom']);
                $files = $files->filter("Created:GreaterThanOrEqual", $fromDate->dataValue().' 00:00:00');
            }

            if (!empty($filters['createdTo'])) {
                $toDate = new DateField(null, null, $filters['createdTo']);
                $files = $files->filter("Created:LessThanOrEqual", $toDate->dataValue().' 23:59:59');
            }

            if (!empty($filters['type']) && !empty(File::config()->app_categories[$filters['type']])) {
                $extensions = File::config()->app_categories[$filters['type']];
                $files = $files->filter('Name:PartialMatch', $extensions);
            }

            $files = $files->sort(
                '(CASE WHEN "File"."ClassName" = \'Folder\' THEN 0 ELSE 1 END), "Name"'
            );

            $count = $files->count();

            if (isset($filters['page']) && isset($filters['limit'])) {
                $page = $filters['page'];
                $limit = $filters['limit'];

                $offset = ($page - 1) * $limit;

                $files = $files->limit($limit, $offset);
            }

            foreach ($files as $file) {
                if (!$file->canView()) {
                    continue;
                }

                $items[] = $this->getObjectFromData($file);
            }
        }

        return array(
            "items" => $items,
            "count" => $count,
        );
    }

    /**
     * @param null|string $folder
     *
     * @return null|Folder
     */
    protected function getFolder($folder = null)
    {
        if ($folder) {
            return Folder::find_or_make($folder);
        }

        $path = $this->config()->defaultPath;

        if ($this->getCurrentFolder() !== null) {
            $path = $this->getCurrentFolder();
        }

        if (empty($path)) {
            return null;
        }

        return Folder::find_or_make($path);
    }

    /**
     * @inheritdoc
     *
     * @param array $properties
     *
     * @return string
     */
    public function Field($properties = array())
    {
        $name = $this->getName();

        Requirements::css(ASSET_ADMIN_DIR . "/javascript/dist/main.css");
        Requirements::javascript(FRAMEWORK_DIR . "/admin/javascript/dist/bundle-lib.js");
        Requirements::add_i18n_javascript(ASSET_ADMIN_DIR . "/javascript/lang");
        Requirements::javascript(ASSET_ADMIN_DIR . "/javascript/dist/bundle.js");

        $getFilesByParentIDURL = $this->getFilesByParentIDURL();
        $getFilesBySiblingIDURL = $this->getFilesBySiblingIDURL();
        $searchURL = $this->getSearchURL();
        $updateURL = $this->getUpdateURL();
        $deleteURL = $this->getDeleteURL();
        $initialFolder = $this->getCurrentFolder();
        $idFromURL = $this->getIdFromURL();
        $limit = $this->getLimit();
        $bulkActions = $this->getBulkActions();

        return "<div
            class='asset-gallery-component-wrapper'
            data-asset-gallery-name='{$name}'
            data-asset-gallery-bulk-actions='{$bulkActions}'
            data-asset-gallery-limit='{$limit}'
            data-asset-gallery-files-by-parent-url='{$getFilesByParentIDURL}'
            data-asset-gallery-files-by-sibling-url='{$getFilesBySiblingIDURL}'
            data-asset-gallery-search-url='{$searchURL}'
            data-asset-gallery-update-url='{$updateURL}'
            data-asset-gallery-delete-url='{$deleteURL}'
            data-asset-gallery-initial-folder='{$initialFolder}'
            data-asset-gallery-id-from-url='{$idFromURL}'
            ></div>";
    }

    /**
     * @return string
     */
    protected function getFilesByParentIDURL()
    {
        return Controller::join_links($this->Link(), 'getFilesByParentID');
    }

    /**
     * @return string
     */
    protected function getFilesBySiblingIDURL()
    {
        return Controller::join_links($this->Link(), 'getFilesBySiblingID');
    }

    /**
     * @return string
     */
    protected function getSearchURL()
    {
        return Controller::join_links($this->Link(), 'search');
    }

    /**
     * @return string
     */
    protected function getUpdateURL()
    {
        return Controller::join_links($this->Link(), 'update');
    }

    /**
     * @return string
     */
    protected function getDeleteURL()
    {
        return Controller::join_links($this->Link(), 'delete');
    }

    /**
     * @return string
     */
    public function getCurrentFolder()
    {
        return $this->currentFolder;
    }

    /**
     * @return string
     */
    public function getIdFromURL()
    {
        if($this->idFromURL) {
            return $this->idFromURL;
        }

        $getIdFromRequest = $this->getForm()->getController()->getRequest()->param('ID');

        return $getIdFromRequest;
    }

    /**
     * Sets the folder being requested.
     *
     * @param int ID - The ID of the folder being set.
     * @return AssetGalleryField
     */
    public function setCurrentFolder($currentFolder)
    {
        $this->currentFolder = $currentFolder;

        return $this;
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
            'attributes' => array(
                'dimensions' => array(),
            ),
            'title' => $file->Title,
            'type' => $file->is_a('Folder') ? 'folder' : $file->FileType,
            'category' => $file->is_a('Folder') ? 'folder' : $file->appCategory(),
            'basename' => $file->Name,
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
        if ($file->hasMethod('getWidth') && $file->hasMethod('getHeight')) {
            $object['attributes']['dimensions']['width'] = $file->Width;
            $object['attributes']['dimensions']['height'] = $file->Height;
        }

        return $object;
    }

    /**
     * @param int $limit
     *
     * @return $this
     */
    public function setLimit($limit)
    {
        $this->limit = $limit;

        return $this;
    }

    /**
     * @return int
     */
    public function getLimit()
    {
        return $this->limit;
    }

    /**
     * @param boolean $bulkActions
     *
     * @return $this
     */
    public function disableBulkActions()
    {
        $this->bulkActions = false;

        return $this;
    }

    /**
     * @return boolean
     */
    public function getBulkActions()
    {
        return $this->bulkActions;
    }
}
