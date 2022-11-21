<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use SilverStripe\Assets\File;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\TypeCreator;
use GraphQL\Type\Definition\UnionType;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class PublicationResultType extends TypeCreator
{
    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

    public function toType()
    {
        return new UnionType([
            'name' => 'PublicationResult',
            'types' => [
                $this->manager->getType('File'),
                $this->manager->getType('PublicationNotice'),
            ],
            'resolveType' => function ($value) {
                if ($value instanceof File) {
                    return $this->manager->getType('File');
                }
                if ($value instanceof Notice) {
                    return $this->manager->getType('PublicationNotice');
                }
            }
        ]);
    }
}
