<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\TypeCreator;
use GraphQL\Type\Definition\ResolveInfo;
use Exception;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * Define the return type for ReadFileUsageQueryCreator. File usage is return as an array of object with an
 * 'id' property and 'inUseCount' property.
 *
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class FileUsageType extends TypeCreator
{
    /**
     * @return array
     */
    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

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
