<?php

namespace SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest;

use SilverStripe\Core\Extension;
use SilverStripe\ORM\ArrayList;
use SilverStripe\Dev\TestOnly;

class FilesInUseFileExtension extends Extension implements TestOnly
{
    protected function updateFilesInUse(&$list)
    {
        // this data returned is mostly irrelevant to the test, AssetAdmin::apiReadUsage()
        // will simply return a count of the number of items in the list
        $list = new ArrayList([
            ['ID' => 10001],
            ['ID' => 10002],
            ['ID' => 10003],
            ['ID' => 10004],
            ['ID' => 10005],
        ]);
    }
}
