<?php


namespace SilverStripe\AssetAdmin\GraphQL\Schema;


use SilverStripe\Assets\File;
use SilverStripe\GraphQL\Schema\Interfaces\SchemaUpdater;
use SilverStripe\GraphQL\Schema\Schema;
use SilverStripe\GraphQL\Schema\Type\Enum;
use SilverStripe\ORM\ArrayLib;

class Builder implements SchemaUpdater
{
    public static function updateSchema(Schema $schema): void
    {
        $appCategories = array_keys(File::config()->get('app_categories'));
        // Build the app category type
        $categoryValues = [];
        foreach ($appCategories as $category) {
            $categoryValues[$category] = $category;
        }
        // Sanitise GraphQL Enum aliases (some contain slashes)
        foreach ($categoryValues as $key => $v) {
            unset($categoryValues[$key]);
            $newKey = strtoupper(preg_replace('/[^[[:alnum:]]]*/', '', $key));
            $categoryValues[$newKey] = $v;
        }

        $schema->addEnum(Enum::create('AppCategory', $categoryValues));
    }
}
