<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\Pagination\Connection;
use SilverStripe\ORM\DataQuery;
use SilverStripe\ORM\DB;

class ReadFileConnection extends Connection
{

    protected function applySort($list, $sortBy)
    {
        $list = parent::applySort($list, $sortBy);


        $list = $list->alterDataQuery(static function (DataQuery $dataQuery) {
            $query = $dataQuery->query();
            $existingOrderBys = [];
            foreach ($query->getOrderBy() as $field => $direction) {
                if (strpos($field, '.') === false) {
                    // some fields may be surrogates added by extending augmentSQL
                    // we have to preserve those expressions rather than auto-generated names
                    // that SQLSelect::addOrderBy leaves for them (e.g. _SortColumn0)
                    $field = $query->expressionForField(trim($field, '"')) ?: $field;
                }

                $existingOrderBys[$field] = $direction;
            }

            // Folders should always go first
            $dataQuery->sort(
                sprintf(
                    '(CASE WHEN "ClassName"=%s THEN 1 ELSE 0 END)',
                    DB::get_conn()->quoteString(Folder::class)
                ),
                'DESC',
                true
            );

            foreach ($existingOrderBys as $field => $dir) {
                $dataQuery->sort($field, $dir, false);
            }

            return $dataQuery;
        });

        return $list;
    }
}
