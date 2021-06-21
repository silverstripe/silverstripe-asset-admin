<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * Define the return type for ReadDescendantFileCountsQueryCreator
 * Return as an array of object with an 'id' property and 'count' property.
 *
 * @deprecated 1.8..2.0 Use silverstripe/graphql:^4 functionality.
 */
class DescendantFileCountType extends TypeCreator
{
    /**
     * @return array
     */
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
