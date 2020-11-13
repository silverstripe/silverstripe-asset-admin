<?php


namespace SilverStripe\AssetAdmin\GraphQL\Resolvers;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\GraphQL\Schema\DataObject\FieldAccessor;

class FieldResolver
{
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
