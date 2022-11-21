<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\Pagination\Connection;
use SilverStripe\ORM\DataQuery;
use SilverStripe\ORM\DB;
use SilverStripe\ORM\SS_List;

if (!class_exists(Connection::class)) {
    return;
}
/**
 * Connection that sorts by folders first
 *
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class ReadFileConnection extends Connection
{
    /**
     * @param string $connectionName
     */
    public function __construct($connectionName)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($connectionName);
    }

    /**
     * Always sort by folders before files
     *
     * @param SS_List $list
     * @param array $sortBy
     * @return SS_List
     */
    protected function applySort($list, $sortBy)
    {
        $className = DB::get_conn()->quoteString(Folder::class);
        $field = "(CASE WHEN \"ClassName\"={$className} THEN 1 ELSE 0 END)";
        $sortableFields = $this->getSortableFields();
        $this->setSortableFields(array_merge([$field => $field], $sortableFields));
        $updatedSortBy = array_merge([['field' => $field, 'direction' => 'DESC']], $sortBy);
        return parent::applySort($list, $updatedSortBy);
    }
}
