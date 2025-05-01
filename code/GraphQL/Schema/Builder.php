<?php


namespace SilverStripe\AssetAdmin\GraphQL\Schema;

use SilverStripe\Assets\File;
use SilverStripe\GraphQL\Schema\Interfaces\SchemaUpdater;
use SilverStripe\GraphQL\Schema\Schema;
use SilverStripe\GraphQL\Schema\Type\Enum;
use SilverStripe\ORM\ArrayLib;
use SilverStripe\Dev\Deprecation;

if (!interface_exists(SchemaUpdater::class)) {
    return;
}

/**
 * @deprecated 5.3.0 Will be moved to the silverstripe/graphql module in a future major release
 */
class Builder implements SchemaUpdater
{
    public function __construct()
    {
        Deprecation::withSuppressedNotice(function () {
            Deprecation::notice('2.3.0', 'Will be moved to the silverstripe/graphql module', Deprecation::SCOPE_CLASS);
        });
    }

    public static function updateSchema(Schema $schema): void
    {
        $categoryValues = array_map(function ($category) {
            return ['value' => $category];
        }, File::config()->get('app_categories') ?? []);

        // Sanitise GraphQL Enum aliases (some contain slashes)
        foreach ($categoryValues as $key => $v) {
            unset($categoryValues[$key]);
            $newKey = strtoupper(preg_replace('/[^[[:alnum:]]]*/', '', $key ?? '') ?? '');
            $categoryValues[$newKey] = $v;
        }

        $schema->addEnum(Enum::create('AppCategory', $categoryValues));
    }
}
