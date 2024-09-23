<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Model\ThumbnailGenerator;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Model\List\ArrayList;
use SilverStripe\Versioned\Versioned;
use SilverStripe\AssetAdmin\Controller\AssetAdminFile;
use stdClass;
use SilverStripe\ORM\DataList;
use SilverStripe\Forms\DateField;
use SilverStripe\ORM\DataQuery;
use SilverStripe\View\Requirements;
use SilverStripe\ORM\Hierarchy\Hierarchy;

/**
 * Read-only sub-version of AssetAdmin, which only allows viewing and searching of files and folders
 * for users without the CMS_ACCESS_AssetAdmin permission
 *
 * This used specifically for 'Insert from files' in the HTMLEditorField which does not require
 * access to the Files section of the CMS
 */
class AssetAdminOpen extends LeftAndMain
{
    private static string $url_segment = 'assets-open';

    private static string $url_rule = '/$Action/$ID';

    private static string  $menu_title = 'Files open';

    private static string $menu_icon_class = 'font-icon-image';

    private static string $tree_class = Folder::class;

    private static array $url_handlers = [
        'GET api/read/$ID!' => 'apiRead',
    ];

    private static array $allowed_actions = [
        'apiRead',
    ];

    /**
     * Amount of results showing on a single page.
     */
    private static int $page_length = 50;

    /**
     * Allow any authenticated CMS user access to this controller
     *
     * This must be false, not 'CMS_ACCESS' or else this will not work with silverstripe/subsites
     * for users with limited permissions e.g. 'CMS_ACCESS_AssetAdmin' only
     */
    private static bool $required_permission_codes = false;

    /**
     * Do not show this controller in the CMS menu
     */
    private static bool $ignore_menuitem = true;

    protected ThumbnailGenerator $thumbnailGenerator;

    /**
     * Set up the controller
     */
    public function init()
    {
        parent::init();
        Requirements::add_i18n_javascript('silverstripe/asset-admin:client/lang', false);
        Requirements::javascript('silverstripe/asset-admin:client/dist/js/bundle.js');
        Requirements::css('silverstripe/asset-admin:client/dist/styles/bundle.css');
    }

    /**
     * Returns configuration required by the client app
     */
    public function getClientConfig()
    {
        return array_merge(parent::getClientConfig(), [
            'reactRouter' => true,
            'endpoints' => [
                'read' => [
                    'url' => $this->Link('api/read'),
                    'method' => 'get',
                    'responseFormat' => 'json',
                ],
            ],
        ]);
    }

    /**
     * JSON endpoint that shows data for a single file or folder including ancestor and child data
     */
    public function apiRead(HTTPRequest $request): HTTPResponse
    {
        $id = $this->getIDParam($request);
        $file = null;
        if ($id === 0) {
            // The root folder has an ID of 0
            $data = $this->getFileData(Folder::singleton(), $request, false, false);
            $tmp = $this->getFileData(null, $request, false, true);
            $data['children'] = $tmp['children'];
        } else {
            $file = $this->getFileByID($id, false, 404);
            $data = $this->getFileData($file, $request, true, true);
        }
        $this->extend('updateApiRead', $data, $file, $request);
        return $this->jsonSuccess(200, $data);
    }

    public function getThumbnailGenerator(): ThumbnailGenerator
    {
        return $this->thumbnailGenerator;
    }

    public function setThumbnailGenerator(ThumbnailGenerator $generator): static
    {
        $this->thumbnailGenerator = $generator;
        return $this;
    }

    /**
     * Get data for a single file or folder including ancestor and child data
     *
     * @param File|Versioned $file
     */
    protected function getFileData(
        ?File $file,
        HTTPRequest $request,
        bool $includeAncestors,
        bool $includeChildren,
    ): array {
        // Ancestors - used for breadcrumbs
        $ancestors = [];
        if ($includeAncestors) {
            /** @var File|Hierarchy $file */
            foreach ($file->getAncestors() as $ancestor) {
                $ancestors[] = $this->getFileData($ancestor, $request, false, false);
            }
            $ancestors = array_reverse($ancestors);
        }
        // Children
        $children = [];
        $totalCount = 0;
        if ($includeChildren) {
            $childFiles = $this->getFilteredChildFiles($file, $request);
            $limit = static::config()->get('page_length');
            $offset = 0;
            $page = $this->getQueryStringValue($request, 'page', true);
            if ($page) {
                $offset = $limit * ($page - 1);
            }
            $totalCount = $childFiles->count();
            // Folders show first in paginated results, no matter the sort order
            // it's assumed that no one will every subclass a Folder
            $childFiles = $childFiles->alterDataQuery(function (DataQuery $query) {
                $query->selectField('CASE WHEN "File"."ClassName" = \'SilverStripe\\\\Assets\\\\Folder\' THEN 1 ELSE 0 END AS "IsFolderTmp"');
                $query->sort('"IsFolderTmp" DESC', null, true);
            });
            $childFiles = $childFiles->limit($limit, $offset);
            foreach ($childFiles as $childFile) {
                if (!$childFile->canView()) {
                    continue;
                }
                $children[] = $this->getFileData($childFile, $request, false, false);
            }
            // Sorting
            $sort = $this->getQueryStringValue($request, 'sort', true);
            if (!$sort) {
                $sort = 'title,asc';
            }
            [$field, $dir] = explode(',', $sort);
            if (!in_array($field, ['title', 'lastEdited']) || !in_array($dir, ['asc', 'desc'])) {
                $this->jsonError(404);
            }
            $d = $dir === 'asc' ? 1 : -1;
            usort($children, function ($a, $b) use ($field, $d) {
                if ($field === 'title') {
                    return strcasecmp($a['title'], $b['title']) * $d;
                } elseif ($field === 'lastEdited') {
                    return (strtotime($a['lastEdited']) <=> strtotime($b['lastEdited'])) * $d;
                }
            });
        }
        $childObj = new stdClass;
        $childObj->pageInfo = new stdClass;
        $childObj->pageInfo->totalCount = $totalCount;
        $childObj->nodes = $children;
        // This is purely for the root folder
        if (!$file) {
            return [
                'children' => $childObj
            ];
        }
        // Values
        return [
            'canDelete' => $file->canDelete(),
            'canEdit' => $file->canEdit(),
            'canView' => $file->canView(),
            'category' => $file instanceof Folder ? 'folder' : $file->appCategory(),
            'exists' => $file->exists(),
            'filename' => $file->getFilename(),
            'id' => $file->ID,
            'lastEdited' => $file->LastEdited,
            'name' => $file->Name,
            'parentId' => $file->ParentID,
            'title' => $file->Title,
            'type' => $file instanceof Folder ? 'folder' : 'file',
            'url' => $file->getURL(),
            'visibility' => $file->getVisibility(),
            'hasRestrictedAccess' => $file->hasRestrictedAccess(),
            'children' => $childObj,
            'ancestors' => $ancestors,
            'draft' => $file->isOnDraftOnly(),
            'extension' => $file->getExtension(),
            'published' => $file->isPublished(),
            'modified' => $file->isModifiedOnDraft(),
            'size' => $file->getSize(),
            'smallThumbnail' => $this->getSmallThumbnailUrl($file),
            'thumbnail' => $this->getThumbnailUrl($file),
            'version' => $file->Version,
            'isTrackedFormUpload' => $file->isTrackedFormUpload(),
        ];
    }

    /**
     * Get a file by ID, ensuring it exists and the user has permission to view it
     */
    protected function getFileByID(int $id, bool $mustBeFolder, int $missingFileErrorCode): ?File
    {
        if ($id === 0) {
            $this->jsonError($missingFileErrorCode);
        }
        if ($mustBeFolder) {
            $file = Folder::get()->byID($id);
        } else {
            $file = File::get()->byID($id);
        }
        if (!$file) {
            $this->jsonError($missingFileErrorCode);
        }
        if (!$file->canView()) {
            $this->jsonError(403);
        }
        return $file;
    }

    /**
     * Get a data value from the GET request, ensuring it exists and is valid
     */
    protected function getQueryStringValue(HTTPRequest $request, string $key, bool $allowMissing = false): mixed
    {
        $getVars = $request->getVars();
        if (!array_key_exists($key, $getVars)) {
            if ($allowMissing) {
                return null;
            }
            $this->jsonError(404);
        }
        $value = $getVars[$key];
        if ($key === 'ids') {
            if (!is_array($value)
                || count(array_filter($value, 'ctype_digit')) !== count($value)
                || count(array_filter($value, fn($id) => (int) $id > 0)) !== count($value)
            ) {
                $this->jsonError(404);
            }
        }
        if ($key === 'page') {
            if (!ctype_digit($value) || (int) $value != $value) {
                $this->jsonError(404);
            }
        }
        if ($key === 'filter') {
            if (!is_array($value)) {
                $this->jsonError(404);
            }
        }
        return $value;
    }

    private function getFilteredChildFiles(?File $file, HTTPRequest $request): DataList
    {
        // Scenarios for children/childFiles:
        // a) No filter - child files
        // b) Filter - all files
        // c) Filter with currentFolderOnly - descendant files
        $childFiles = File::get();
        $filter = $this->getQueryStringValue($request, 'filter', true);
        $parentID = $file ? $file->ID : 0;
        if ($filter) {
            if (isset($filter['currentFolderOnly']) && $filter['currentFolderOnly']) {
                $filter['recursive'] = true;
                unset($filter['currentFolderOnly']);
                $filter['parentId'] = $parentID;
            }
            return $this->filterFiles($childFiles, $filter);
        } else {
            return $childFiles->filter('ParentID', $parentID);
        }
    }

    /**
     * Get the ID parameter from the request, ensuring it exists and is valid
     */
    private function getIDParam(HTTPRequest $request): int
    {
        $id = $request->param('ID');
        // When passing in an ID of 0, Silverstripe routing will have an ID value of
        // "read", presumbably because 0 is falsey.
        // Unlike most endpoints, we want to allow 0 as a valid ID here.
        if ($id === 'read') {
            $id = '0';
        }
        if (!ctype_digit($id)) {
            $this->jsonError(404);
        }
        return (int) $id;
    }

    private function getSmallThumbnailUrl(File $file): ?string
    {
        $width = UploadField::config()->uninherited('thumbnail_width');
        $height = UploadField::config()->uninherited('thumbnail_height');
        return $this->getThumbnailGenerator()->generateThumbnailLink($file, $width, $height);
    }

    private function getThumbnailUrl(File $file): ?string
    {
        $width = AssetAdmin::config()->uninherited('thumbnail_width');
        $height = AssetAdmin::config()->uninherited('thumbnail_height');
        return $this->getThumbnailGenerator()->generateThumbnailLink($file, $width, $height);
    }

    private function filterFiles(DataList $list, array $filter): DataList
    {
        // ID filtering
        if (isset($filter['id']) && !ctype_digit($filter['id'])) {
            $this->jsonError(404);
        }
        if (isset($filter['id']) && (int) $filter['id'] > 0) {
            $list = $list->filter('ID', $filter['id']);
            if ($list->count() === 0) {
                $this->httpError(404);
            }
        } elseif (isset($filter['id']) && (int) $filter['id'] === 0) {
            // Special case for root folder
            $list = ArrayList::create([Folder::create([
                'ID' => 0,
            ])]);
        }
        // track if search is being applied
        $search = false;
        // Optionally limit search to a folder, supporting recursion
        if (isset($filter['parentId'])) {
            $recursive = !empty($filter['recursive']);
            if (!$recursive) {
                $list = $list->filter('ParentID', $filter['parentId']);
            } elseif ($filter['parentId']) {
                // Note: Simplify parentID = 0 && recursive to no filter at all
                $parents = AssetAdminFile::nestedFolderIDs($filter['parentId']);
                $list = $list->filter('ParentID', $parents);
            }
            $search = true;
        }
        if (!empty($filter['name'])) {
            $list = $list->filterAny(array(
                'Name:PartialMatch' => $filter['name'],
                'Title:PartialMatch' => $filter['name']
            ));
            $search = true;
        }
        // Date filtering last edited
        if (!empty($filter['lastEditedFrom'])) {
            $fromDate = DateField::create(null, null, $filter['lastEditedFrom']);
            $list = $list->filter("LastEdited:GreaterThanOrEqual", $fromDate->dataValue().' 00:00:00');
            $search = true;
        }
        if (!empty($filter['lastEditedTo'])) {
            $toDate = DateField::create(null, null, $filter['lastEditedTo']);
            $list = $list->filter("LastEdited:LessThanOrEqual", $toDate->dataValue().' 23:59:59');
            $search = true;
        }
        // Date filtering created
        if (!empty($filter['createdFrom'])) {
            $fromDate = DateField::create(null, null, $filter['createdFrom']);
            $list = $list->filter("Created:GreaterThanOrEqual", $fromDate->dataValue().' 00:00:00');
            $search = true;
        }
        if (!empty($filter['createdTo'])) {
            $toDate = DateField::create(null, null, $filter['createdTo']);
            $list = $list->filter("Created:LessThanOrEqual", $toDate->dataValue().' 23:59:59');
            $search = true;
        }
        // Categories (mapped to extensions through the enum type automatically)
        if (!empty($filter['appCategory'])) {
            $list = $list->filter('Name:EndsWith', $filter['appCategory']);
            $search = true;
        }
        // Filter unknown id by known child if search is not applied
        if (!$search && isset($filter['anyChildId'])) {
            $child = File::get()->byID($filter['anyChildId']);
            $id = $child ? ($child->ParentID ?: 0) : 0;
            if ($id) {
                $list = $list->filter('ID', $id);
            } else {
                // Special case for root folder, since filter by ID = 0 will return an empty list
                $list = ArrayList::create([Folder::create([
                    'ID' => 0,
                ])]);
            }
        }
        return $list;
    }
}
