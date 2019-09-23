<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use GraphQL\Type\Definition\UnionType;
use SilverStripe\GraphQL\Pagination\PaginatedQueryCreator;
use SilverStripe\GraphQL\Pagination\Connection;
use SilverStripe\GraphQL\QueryCreator;
use SilverStripe\Versioned\Versioned;

/**
 * GraphQL Query to retrieve usage count for files and folders on GraphQL request.
 */
class ReadFileUsageQueryCreator extends QueryCreator
{

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
            'IDs' => [
                'type' => Type::nonNull(Type::listOf(Type::id())),
            ],
        ];
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        if (!isset($args['IDs']) || !is_array($args['IDs'])) {
            throw new \InvalidArgumentException('IDs must be an array');
        }
        $idList = $args['IDs'];

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
