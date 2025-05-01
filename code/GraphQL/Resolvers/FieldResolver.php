<?php


namespace SilverStripe\AssetAdmin\GraphQL\Resolvers;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\GraphQL\Schema\DataObject\FieldAccessor;
use SilverStripe\Dev\Deprecation;

/**
 * @deprecated 5.3.0 Will be moved to the silverstripe/graphql module in a future major release
 */
class FieldResolver
{
    public function __construct()
    {
        Deprecation::withSuppressedNotice(function () {
            Deprecation::notice('2.3.0', 'Will be moved to the silverstripe/graphql module', Deprecation::SCOPE_CLASS);
        });
    }

    public static function resolve($obj, array $args, array $context, ResolveInfo $info)
    {
        $field = $info->fieldName;
        if ($obj->hasMethod($field)) {
            return $obj->$field();
        }
        $fieldName = FieldAccessor::singleton()->normaliseField($obj, $field);
        return $obj->$fieldName;
    }
}
