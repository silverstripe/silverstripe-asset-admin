<?php

namespace SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest;

use SilverStripe\Assets\File;
use SilverStripe\Dev\TestOnly;

class TestFile extends File implements TestOnly
{
    private static $table_name = 'AssetAdminTest_TestFile';

    // Create a generic column just to ensure that the table is created
    private static $db = [
        'TestField' => 'Varchar',
    ];

    public static $fail = '';

    public function canCreate($member = null, $context = [])
    {
        return self::$fail !== 'can-create';
    }

    public function canDelete($member = null, $context = [])
    {
        return self::$fail !== 'can-delete';
    }

    public function canEdit($member = null, $context = [])
    {
        return self::$fail !== 'can-edit';
    }

    public function canView($member = null)
    {
        return self::$fail !== 'can-view';
    }

    public function canPublish($member = null)
    {
        return self::$fail !== 'can-publish';
    }

    public function canUnpublish($member = null)
    {
        return self::$fail !== 'can-unpublish';
    }
}
