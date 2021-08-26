<?php


namespace SilverStripe\AssetAdmin\GraphQL\Resolvers;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\Controller\AssetAdminFile;
use SilverStripe\AssetAdmin\GraphQL\FileFilter;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\QueryHandler\UserContextProvider;
use SilverStripe\GraphQL\Schema\DataObject\FieldAccessor;
use SilverStripe\GraphQL\Schema\Schema;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\DB;
use SilverStripe\ORM\Sortable;
use SilverStripe\Versioned\Versioned;
use InvalidArgumentException;
use Exception;
use Closure;

class FolderTypeResolver
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

        // Filter by permission
        // DataQuery::column ignores surrogate sorting fields
        // see https://github.com/silverstripe/silverstripe-framework/issues/8926
        // the following line is a workaround for `$ids = $list->column('ID');`
        $ids = $list->dataQuery()->execute()->column('ID');

        $permissionChecker = File::singleton()->getPermissionChecker();
        $member = UserContextProvider::get($context);
        $canViewIDs = array_keys(array_filter($permissionChecker->canViewMultiple(
            $ids,
            $member
        )));
        // Filter by visible IDs (or force empty set if none are visible)
        // Remove the limit as it no longer applies. We've already filtered down to the exact
        // IDs we need.
        $canViewList = $list->filter('ID', $canViewIDs ?: 0)
            ->limit(null);

        return $canViewList;
    }

    /**
     * @param Folder|AssetAdminFile $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return int
     */
    public static function resolveFolderDescendantFileCount($object, array $args, $context, ResolveInfo $info)
    {
        return $object->getDescendantFileCount();
    }

    /**
     * @param Folder|AssetAdminFile $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return int
     */
    public static function resolveFolderFilesInUseCount($object, array $args, $context, ResolveInfo $info)
    {
        return $object->getFilesInUse()->count();
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return File[]
     */
    public static function resolveFolderParents($object, array $args, $context, ResolveInfo $info)
    {
        $parents = [];
        $next = $object->Parent();
        while ($next && $next->isInDB()) {
            array_unshift($parents, $next);
            if ($next->ParentID) {
                $next = $next->Parent();
            } else {
                break;
            }
        }

        return $parents;
    }

    /**
     * @param array $context
     * @return Closure
     */
    public static function sortChildren(array $context): Closure
    {
        $fieldName = $context['fieldName'];
        return function (?Sortable $list, array $args) use ($fieldName) {
            if ($list === null) {
                return null;
            }

            $sortArgs = $args[$fieldName] ?? [];

            // ensure that folders appear first
            $className = DB::get_conn()->quoteString(Folder::class);
            $classNameField = "(CASE WHEN \"ClassName\"={$className} THEN 1 ELSE 0 END)";
            $sortArgs = array_merge([$classNameField => 'DESC'], $sortArgs);

            $sort = [];
            foreach ($sortArgs as $field => $dir) {
                if ($field == $classNameField) {
                    $normalised = $classNameField;
                } else {
                    $normalised = FieldAccessor::singleton()->normaliseField(File::singleton(), $field);
                }
                Schema::invariant(
                    $normalised,
                    'Could not find field %s on %s',
                    $field,
                    File::class
                );
                $sort[$normalised] = $dir;
            }
            $list = $list->sort($sort);

            return $list;
        };
    }
}
