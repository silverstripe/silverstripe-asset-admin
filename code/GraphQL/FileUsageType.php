<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;
use GraphQL\Type\Definition\ResolveInfo;
use Exception;

/**
 * Define the return type for ReadFileUsageQueryCreator. File usage is return as an array of object with an
 * 'id' property and 'inUseCount' property.
 */
class FileUsageType extends TypeCreator
{
    /**
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => 'FileUsage',
            'description' => 'Describe the usage of a file or folder',
        ];
    }

    /**
     * @return array
     */
    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
            'inUseCount' => [
                'type' => Type::int(),
            ],
        ];
    }
}
