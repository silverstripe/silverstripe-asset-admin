<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use SilverStripe\GraphQL\DataObjectInterfaceTypeCreator;
use SilverStripe\GraphQL\Manager;
use GraphQL\Type\Definition\Type;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Versioned\RecursivePublishable;

if (!class_exists(DataObjectInterfaceTypeCreator::class)) {
    return;
}

/**
 * @skipUpgrade
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class FileInterfaceTypeCreator extends DataObjectInterfaceTypeCreator
{

    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

    public function attributes()
    {
        return [
            'name' => 'FileInterface',
            'description' => 'Interface for files and folders',
        ];
    }

    public function fields()
    {
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
        ];
    }

    public function resolveType($object)
    {
        if ($object instanceof Folder) {
            return $this->manager->getType('Folder');
        }
        if ($object instanceof File) {
            return $this->manager->getType('File');
        }
        return null;
    }
}
