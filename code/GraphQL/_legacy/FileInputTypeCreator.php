<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;
use SilverStripe\GraphQL\Manager;

/**
 * @todo Allow setting of Owner and ShowInSearch fields
 */
class FileInputTypeCreator extends TypeCreator
{

    /**
     * @var CaseInsensitiveFieldAccessor
     */
    protected $accessor;

    protected $inputObject = true;

    public function __construct(Manager $manager = null)
    {
        $this->accessor = new CaseInsensitiveFieldAccessor();

        parent::__construct($manager);
    }

    public function attributes()
    {
        return [
            'name' => 'FileInput',
            'description' => 'Input type for files and images',
        ];
    }

    public function fields()
    {
        return [
            'parentId' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'title' => [
                'type' => Type::string(),
            ],
            'name' => [
                'type' => Type::string(),
            ],
        ];
    }

    public function resolveField($object, array $args, $context, $info)
    {
        return $this->accessor->getValue($object, $info->fieldName);
    }
}
