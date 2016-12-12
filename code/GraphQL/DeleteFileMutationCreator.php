<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Assets\File;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\ORM\Versioning\Versioned;

/**
 * Handles create and update
 */
class DeleteFileMutationCreator extends MutationCreator implements OperationResolver
{

    public function attributes()
    {
        return [
            'name' => 'deleteFile'
        ];
    }

    public function type()
    {
        return Type::id();
    }

    public function args()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
        ];
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        /** @var File $file */
        $file = Versioned::get_by_stage(File::class, Versioned::DRAFT)->byID($args['id']);
        if (!$file) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s not found',
                File::class,
                $args['id']
            ));
        }

        if (!$file->canArchive($context['currentUser'])) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s delete not allowed',
                File::class,
                $args['id']
            ));
        }

        $file->doArchive();

        return $args['id'];
    }
}
