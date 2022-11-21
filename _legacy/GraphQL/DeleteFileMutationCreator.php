<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Assets\File;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\ORM\DataList;
use SilverStripe\Versioned\Versioned;

if (!class_exists(MutationCreator::class)) {
    return;
}

/**
 * Handles create and update
 *
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class DeleteFileMutationCreator extends MutationCreator implements OperationResolver
{

    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

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
