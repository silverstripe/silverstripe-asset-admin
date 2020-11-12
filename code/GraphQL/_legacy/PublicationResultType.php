<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\File;
use SilverStripe\GraphQL\TypeCreator;
use GraphQL\Type\Definition\UnionType;

if (!class_exists(TypeCreator::class)) {
    return;
}

/**
 * @deprecated 4.8..5.0 Use silverstripe/graphql:^4 functionality.
 */
class PublicationResultType extends TypeCreator
{
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
