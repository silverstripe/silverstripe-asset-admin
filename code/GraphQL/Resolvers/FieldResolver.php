<?php


namespace SilverStripe\AssetAdmin\GraphQL\Resolvers;


use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\GraphQL\Schema\DataObject\FieldAccessor;

class FieldResolver
{
    public static function resolve ($obj, array $args, array $context, ResolveInfo $info)
    {
        $fieldName = FieldAccessor::singleton()->normaliseField($obj, $info->fieldName);
        return $obj->$fieldName;
    }
}
