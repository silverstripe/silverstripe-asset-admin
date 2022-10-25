<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use SilverStripe\GraphQL\Manager;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * Define the return type for ReadDescendantFileCountsQueryCreator
 * Return as an array of object with an 'id' property and 'count' property.
 *
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class DescendantFileCountType extends TypeCreator
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
            'name' => 'DescendantFileCount',
            'description' => 'Count of descendant non-folder Files',
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
            'count' => [
                'type' => Type::int(),
            ],
        ];
    }
}
