<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\AssetAdmin\Controller\AssetAdminFile;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\QueryCreator;
use SilverStripe\ORM\DataList;
use SilverStripe\Versioned\Versioned;

if (!class_exists(QueryCreator::class)) {
    return;
}
/**
 * GraphQL Query to retrieve the file count within a folder
 *
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class ReadDescendantFileCountsQueryCreator extends QueryCreator
{

    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

    public function attributes()
    {
        return [
            'name' => 'readDescendantFileCounts',
        ];
    }

    public function type()
    {
        return Type::listOf($this->manager->getType('DescendantFileCount'));
    }

    public function args()
    {
        return [
            'ids' => [
                'type' => Type::nonNull(Type::listOf(Type::id())),
            ],
        ];
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        /** @var File|AssetAdminFile $file */
        if (!isset($args['ids']) || !is_array($args['ids'])) {
            throw new \InvalidArgumentException('ids must be an array');
        }
        $ids = $args['ids'];

        /** @var DataList|File[] $files */
        $files = Versioned::get_by_stage(File::class, Versioned::DRAFT)->byIDs($ids);
        if ($files->count() < count($ids)) {
            $class = File::class;
            $missingIds = implode(', ', array_diff($ids, $files->column('ID')));
            throw new \InvalidArgumentException("{$class} items {$missingIds} are not found");
        }

        $data = [];
        foreach ($files as $file) {
            if (!$file->canView($context['currentUser'])) {
                continue;
            }
            $data[] = [
                'id' => $file->ID,
                'count' => $file->getDescendantFileCount()
            ];
        }
        return $data;
    }
}
