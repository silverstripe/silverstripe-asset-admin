<?php

namespace SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest;

use SilverStripe\Assets\File;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Versioned\Versioned;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\TestFile;

class TestObject extends File implements TestOnly
{
    private static string $table_name = 'AssetAdminTest_TestObject';

    private static array $has_one = [
        'TestFile' => TestFile::class,
    ];

    private static array $owns = [
        'TestFile',
    ];

    private static array $extensions = [
        Versioned::class,
    ];
}
