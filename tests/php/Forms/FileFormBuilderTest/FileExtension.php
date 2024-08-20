<?php

namespace SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\Core\Extension;

/**
 * An extension to test file permissions
 * @package SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest
 */
class FileExtension extends Extension implements TestOnly
{
    // public flags to toggle permissions during tests
    public static $canDelete = false;
    public static $canPublish = true;
    public static $canUnpublish = true;
    public static $canEdit = true;

    protected function canDelete($member)
    {
        return FileExtension::$canDelete;
    }

    protected function canPublish($member = null)
    {
        return FileExtension::$canPublish;
    }

    protected function canUnpublish($member = null)
    {
        return FileExtension::$canUnpublish;
    }

    protected function canEdit($member = null)
    {
        return FileExtension::$canEdit;
    }
}
