<?php


namespace SilverStripe\AssetAdmin\GraphQL\Resolvers;


use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\GraphQL\FileFilter;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\Pagination\Connection;
use SilverStripe\GraphQL\QueryHandler\QueryHandler;
use SilverStripe\GraphQL\Schema\Resolver\DefaultResolverProvider;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\DataQuery;
use SilverStripe\ORM\DB;
use SilverStripe\Versioned\Versioned;
use InvalidArgumentException;
use Exception;

class FolderTypeResolver extends DefaultResolverProvider
{
    /**
     * @param Folder $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return mixed
     * @throws InvalidArgumentException
     * @throws Exception
     */
    public static function resolveFolderChildren(
        $object,
        array $args,
        $context,
        ResolveInfo $info
    ) {
        // canView() checks on parent folder are implied by the query returning $object
        // Note: The inability to query permissions against the entire set means pagination
        // is inaccurate when any item in the list returns false on canView()

        $filter = (!empty($args['filter'])) ? $args['filter'] : [];

        if (isset($filter['parentId']) && (int)$filter['parentId'] !== (int)$object->ID) {
            throw new InvalidArgumentException(sprintf(
                'The "parentId" value (#%d) needs to match the current object id (#%d)',
                (int)$filter['parentId'],
                (int)$object->ID
            ));
        }

        /** @var DataList $list */
        $list = Versioned::get_by_stage(File::class, 'Stage');
        $filter['parentId'] = $object->ID;
        $list = FileFilter::filterList($list, $filter);


        // Ensure that we're looking at a subset of relevant data.
        if (!isset($args['sort'])) {
            // only show folders first if no manual ordering is set

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
        }

        // Filter by permission
        // DataQuery::column ignores surrogate sorting fields
        // see https://github.com/silverstripe/silverstripe-framework/issues/8926
        // the following line is a workaround for `$ids = $list->column('ID');`
        $ids = $list->dataQuery()->execute()->column('ID');

        $permissionChecker = File::singleton()->getPermissionChecker();
        $canViewIDs = array_keys(array_filter($permissionChecker->canViewMultiple(
            $ids,
            $context[QueryHandler::CURRENT_USER]
        )));
        // Filter by visible IDs (or force empty set if none are visible)
        // Remove the limit as it no longer applies. We've already filtered down to the exact
        // IDs we need.
        $canViewList = $list->filter('ID', $canViewIDs ?: 0)
            ->limit(null);

        return $canViewList;
    }

}
