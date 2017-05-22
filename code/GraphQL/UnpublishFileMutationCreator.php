<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\File;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;

class UnpublishFileMutationCreator extends MutationCreator implements OperationResolver
{
    public function attributes()
    {
        return [
            'name '=> 'unpublishFile',
            'description' => 'Unpublishes a file',
        ];
    }

    public function type()
    {
        return $this->manager->getType('FileInterface');
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
        if (!isset($args['id']) || !ctype_digit($args['id'])) {
            throw new \InvalidArgumentException('Invalid id');
        }

        $file = Versioned::get_by_stage(File::class, Versioned::LIVE)
            ->byId($args['id']);

        if (!$file) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s not published or doesn\'t exist',
                File::class,
                $args['id']
            ));
        }

        if (!$file->canUnpublish($context['currentUser'])) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s unpublish not allowed',
                File::class,
                $args['id']
            ));
        }

        $file->doUnpublish();

        return $file;
    }
}
