<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\AssetAdmin\Controller\AssetAdminFile;
use SilverStripe\AssetAdmin\Controller\AssetAdminFolder;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\ORM\Filterable;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\Pagination\Connection;
use SilverStripe\GraphQL\TypeCreator;
use SilverStripe\ORM\DataQuery;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\DB;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * @skipUpgrade
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class FolderTypeCreator extends FileTypeCreator
{

    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

    public function attributes()
    {
        return [
            'name' => 'Folder',
            'description' => 'Type for folders',
            'isTypeOf' => function ($obj) {
                return ($obj instanceof Folder);
            }
        ];
    }

    public function fields()
    {
        $childrenConnection = $this->getChildrenConnection();

        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'created' => [
                'type' => Type::string(),
            ],
            'lastEdited' => [
                'type' => Type::string(),
            ],
            'owner' => [
                'type' => Type::string(),
            ],
            'parentId' => [
                'type' => Type::int(),
            ],
            'title' => [
                'type' => Type::string(),
            ],
            'type' => [
                'type' => Type::string(),
            ],
            'category' => [
                'type' => Type::string(),
            ],
            'exists' => [
                'type' => Type::boolean(),
            ],
            'name' => [
                'type' => Type::string(),
            ],
            'filename' => [
                'type' => Type::string(),
            ],
            'url' => [
                'type' => Type::string(),
            ],
            'canView' => [
                'type' => Type::boolean(),
            ],
            'canEdit' => [
                'type' => Type::boolean(),
            ],
            'canDelete' => [
                'type' => Type::boolean(),
            ],
            'hasRestrictedAccess' => [
                'type' => Type::boolean(),
            ],
            'visibility' => [
                'type' => Type::string(),
            ],
            'children' => [
                'type' => $childrenConnection->toType(),
                'args' => $childrenConnection->args(),
                'resolve' => function ($object, array $args, $context, ResolveInfo $info) use ($childrenConnection) {
                    return $this->resolveChildrenConnection($object, $args, $context, $info, $childrenConnection);
                }
            ],
            'parents' => [
                'type' => Type::listOf($this->manager->getType('FileInterface'))
            ],
            'filesInUseCount' => [
                'type' => Type::int(),
            ],
        ];
    }

    /**
     * @return Connection
     */
    public function getChildrenConnection()
    {
        return ReadFileConnection::create('Children')
            ->setConnectionType(function () {
                return $this->manager->getType('FileInterface');
            })
            ->setArgs(function () {
                return [
                    'filter' => [
                        'type' => $this->manager->getType('FileFilterInput')
                    ]
                ];
            })
            ->setSortableFields([
                'id' => 'ID',
                'title' => 'Title',
                'created' => 'Created',
                'lastEdited' => 'LastEdited',
                // TODO Make memory-based size search efficient enough for 10k records
                //size' => 'Size'
            ]);
    }

    /**
     * @param Folder $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @param Connection $childrenConnection
     * @return mixed
     */
    public function resolveChildrenConnection(
        $object,
        array $args,
        $context,
        ResolveInfo $info,
        Connection $childrenConnection
    ) {
        // canView() checks on parent folder are implied by the query returning $object
        // Note: The inability to query permissions against the entire set means pagination
        // is inaccurate when any item in the list returns false on canView()

        $filter = (!empty($args['filter'])) ? $args['filter'] : [];

        if (isset($filter['parentId']) && (int)$filter['parentId'] !== (int)$object->ID) {
            throw new \InvalidArgumentException(sprintf(
                'The "parentId" value (#%d) needs to match the current object id (#%d)',
                (int)$filter['parentId'],
                (int)$object->ID
            ));
        }

        /** @var DataList $list */
        $list = Versioned::get_by_stage(File::class, 'Stage');
        $filterInputType = FileFilterInputTypeCreator::create($this->manager);

        $filter['parentId'] = $object->ID;
        $list = $filterInputType->filterList($list, $filter);


        // Ensure that we're looking at a subset of relevant data.
        if (!isset($args['sortBy'])) {
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

        return $childrenConnection->resolveList($list, $args);
    }

    /**
     * @param Folder|AssetAdminFile $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return int
     */
    public function resolveFilesInUseCountField($object, array $args, $context, ResolveInfo $info)
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
    public function resolveParentsField($object, array $args, $context, ResolveInfo $info)
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
}
