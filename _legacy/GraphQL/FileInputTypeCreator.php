<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;
use SilverStripe\GraphQL\Manager;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * @todo Allow setting of Owner and ShowInSearch fields
 * @deprecated 1.8.0 Use the latest version of graphql instead
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
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
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
