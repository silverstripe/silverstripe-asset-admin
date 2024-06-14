<?php

namespace SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataExtension;

/**
 * An extension to test file permissions
 * @package SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest
 */
class FileExtension extends DataExtension implements TestOnly
{
    // public flags to toggle permissions during tests
    public static $canDelete = false;
    public static $canPublish = true;
    public static $canUnpublish = true;
    public static $canEdit = true;

    public function canDelete($member)
    {
        return FileExtension::$canDelete;
    }

    public function canPublish($member = null)
    {
        return FileExtension::$canPublish;
    }

    public function canUnpublish($member = null)
    {
        return FileExtension::$canUnpublish;
    }

    public function canEdit($member = null)
    {
        return FileExtension::$canEdit;
    }
}
