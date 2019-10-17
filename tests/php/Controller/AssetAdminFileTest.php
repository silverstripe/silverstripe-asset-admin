<?php

namespace SilverStripe\AssetAdmin\Tests\Controller;

use SilverStripe\AssetAdmin\Controller\AssetAdminFile;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;

class AssetAdminFileTest extends SapphireTest
{
    protected static $fixture_file = 'AssetAdminFileTest.yml';

    public function testNestedFolderIds()
    {
        $parent = $this->objFromFixture(Folder::class, 'folder1');

        $ids = AssetAdminFile::nestedFolderIDs($parent->ID);

        $names = Folder::get()->byIDs($ids)->column('Title');
        $this->assertCount(8, $names); // 7 children but the original ID is included
        $this->assertCount(8, array_intersect([
            'folder1',
            'folder1-1',
            'folder1-2',
            'folder1-1-1',
            'folder1-2-1',
            'folder1-2-2',
            'folder1-1-1-1',
            'folder1-2-2-1',
        ], $names), 'Names match those saved to the database (' . implode(', ', $names) . ')');
    }
}
