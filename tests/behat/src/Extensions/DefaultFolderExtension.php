<?php

namespace SilverStripe\AssetAdmin\Tests\Behat\Context\Extensions;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Forms\FieldList;

class DefaultFolderExtension extends Extension implements TestOnly
{
    protected function updateCMSFields(FieldList $fields): void
    {
        $fields->dataFieldByName('GroupPhotos')->setFolderName('test-folder');
    }
}
