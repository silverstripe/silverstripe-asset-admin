<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Assets\File;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\ORM\DataList;
use SilverStripe\Versioned\Versioned;

/**
 * Handles create and update
 */
class DeleteFileMutationCreator extends MutationCreator implements OperationResolver
{

    public function attributes()
    {
        return [
            'name' => 'deleteFiles'
        ];
    }

    public function type()
    {
        return Type::listOf(Type::id());
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

        /** @var DataList $file */
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

        $deletedIDs = [];
        foreach ($files as $file) {
            if ($file->canArchive($context['currentUser'])) {
                $file->doArchive();
                $deletedIDs[] = $file->ID;
            }
        }

        return $deletedIDs;
    }
}
