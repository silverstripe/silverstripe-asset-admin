<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\ORM\Filterable;
use SilverStripe\ORM\Versioning\Versioned;
use SilverStripe\GraphQL\Pagination\Connection;
use SilverStripe\ORM\DataQuery;
use SilverStripe\ORM\DataList;

class FolderTypeCreator extends FileTypeCreator
{

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
        $childrenConnection = Connection::create('Children')
            ->setConnectionType(function () {
                return $this->manager->getType('FileInterface');
            })
            ->setSortableFields([
                'id' => 'ID',
                'title' => 'Title',
                'created' => 'Created',
                'lastEdited' => 'LastEdited',
                // TODO Make memory-based size search efficient enough for 10k records
                //size' => 'Size'
            ]);

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
            'children' => [
                'type' => $childrenConnection->toType(),
                'args' => $childrenConnection->args(),
                'resolve' => function ($object, array $args, $context, ResolveInfo $info) use ($childrenConnection) {
                    // canView() checks on parent folder are implied by the query returning $object

                    $list = Versioned::get_by_stage(File::class, 'Stage');
                    $list = $list->filter('ParentID', $object->ID);

                    // Sort folders first
                    $list = $list->alterDataQuery(function (DataQuery $query, DataList $list) {
                        $existingOrderBys = $query->query()->getOrderBy();
                        $query->sort(
                            '(CASE WHEN "ClassName"=\'SilverStripe\\\\Assets\\\\Folder\' THEN 1 ELSE 0 END)',
                            'DESC',
                            true
                        );
                        foreach ($existingOrderBys as $field => $dir) {
                            $query->sort($field, $dir, false);
                        }
                    });

                    // Apply pagination
                    $return = $childrenConnection->resolveList(
                        $list,
                        $args
                    );

                    // Filter by permission. Converts from DataList to ArrayList
                    // TODO Add more records if records are filtered out here
                    /** @var Filterable $resolvedList */
                    $resolvedList = $return['edges'];
                    $return['edges'] = $resolvedList->filterByCallback(function (File $file) use ($context) {
                        return $file->canView($context['currentUser']);
                    });

                    return $return;
                }
            ],
            'parents' => [
                'type' => function () {
                    return Type::listOf($this->manager->getType('FileInterface'));
                }
            ],

        ];
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
