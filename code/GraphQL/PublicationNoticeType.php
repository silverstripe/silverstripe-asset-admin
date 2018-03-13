<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;
use GraphQL\Type\Definition\ResolveInfo;
use Exception;

class PublicationNoticeType extends TypeCreator
{
    /**
     * @return array
     */
    public function attributes()
    {
        return [
            'name' => 'PublicationNotice',
            'description' => 'Describes an error that occurred on a failed publication operation',
        ];
    }

    /**
     * @return array
     */
    public function fields()
    {
        return [
            'Type' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The type of notice',
            ],
            'Message' => [
                'type' => Type::string(),
                'description' => 'Relevant information pertaining to the error',
            ],
            'IDs' => [
                'type' => Type::listOf(Type::id()),
                'description' => 'Relevant record IDs',
            ],
        ];
    }

    /**
     * @param OperationException $value
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return mixed
     * @throws Exception
     */
    public function resolveField($value, $args, $context, ResolveInfo $info)
    {
        $fieldName = $info->fieldName;
        $method = 'get'.$fieldName;
        if (method_exists($value, $method)) {
            return $value->$method();
        }

        throw new Exception(sprintf(
            'Invalid field %s on %s',
            $fieldName,
            get_class($value)
        ));
    }
}
