<?php

namespace SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest;

use SilverStripe\Assets\File;
use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;
use SilverStripe\Versioned\RecursivePublishable;
use SilverStripe\Versioned\Versioned;

/**
 * @mixin Versioned|RecursivePublishable
 * @property int $OwnedFileID
 */
class FileOwner extends DataObject implements TestOnly
{
    private static $table_name = 'FileFormBuilderTest_FileOwner';

    private static $db = [
        'Title' => 'Varchar',
    ];

    private static $extensions = [
        Versioned::class,
    ];

    private static $has_one = [
        'OwnedFile' => File::class,
    ];
}
