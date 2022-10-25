<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use GraphQL\Type\Definition\UnionType;
use SilverStripe\GraphQL\Pagination\PaginatedQueryCreator;
use SilverStripe\GraphQL\Pagination\Connection;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\QueryCreator;
use SilverStripe\Versioned\Versioned;

if (!class_exists(QueryCreator::class)) {
    return;
}
/**
 * GraphQL Query to retrieve usage count for files and folders on GraphQL request.
 *
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class ReadFileUsageQueryCreator extends QueryCreator
{

    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

    public function attributes()
    {
        return [
            'name' => 'readFileUsage'
        ];
    }

    public function type()
    {
        return Type::listOf($this->manager->getType('FileUsage'));
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
        if (!isset($args['ids']) || !is_array($args['ids'])) {
            throw new \InvalidArgumentException('ids must be an array');
        }
        $idList = $args['ids'];

        /** @var DataList|File[] $files */
        $files = Versioned::get_by_stage(File::class, Versioned::DRAFT)->byIDs($idList);
        if ($files->count() < count($idList)) {
            // Find out which files count not be found
            $missingIds = array_diff($idList, $files->column('ID'));
            throw new \InvalidArgumentException(sprintf(
                '%s items %s are not found',
                File::class,
                implode(', ', $missingIds)
            ));
        }

        $usage = [];
        foreach ($files as $file) {
            if ($file->canView($context['currentUser'])) {
                $useEntry = ['id' => $file->ID];
                $useEntry['inUseCount'] = $file instanceof Folder ?
                    $file->getFilesInUse()->count():
                    $file->BackLinkTrackingCount();
                $usage[] = $useEntry;
            }
        }

        return $usage;
    }
}
