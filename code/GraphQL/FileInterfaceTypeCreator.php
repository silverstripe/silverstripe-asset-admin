<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\GraphQL\DataObjectInterfaceTypeCreator;
use GraphQL\Type\Definition\Type;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Versioned\RecursivePublishable;

/**
 * @skipUpgrade
 */
class FileInterfaceTypeCreator extends DataObjectInterfaceTypeCreator
{

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
