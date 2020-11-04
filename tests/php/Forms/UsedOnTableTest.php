<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use SilverStripe\Admin\Forms\UsedOnTable;
use SilverStripe\Assets\Dev\TestAssetStore;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Versioned\Versioned;

/**
 * @skipUpgrade
 */
class UsedOnTableTest extends SapphireTest
{
    protected static $fixture_file = 'UsedOnTableTest.yml';

    /**
     * Ensure fixture testfile is in the test asset store so that
     * $file->exists() check in code will return true
     */
    public function setup()
    {
        /** @var File $file */
        parent::setUp();
        TestAssetStore::activate('UsedOnTableTest');
        $path = dirname(__DIR__) . '/Forms/fixtures/testfile.txt';
        $content = file_get_contents($path);
        $file = File::get()->find('Name', 'testfile.txt');
        $file->setFromString($content, $file->generateFilename());
    }

    public function tearDown()
    {
        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testExcludes()
    {
        $usedOnTable = new UsedOnTable("Used On");
        $file1 = $this->objFromFixture(File::class, 'file1');
        $usedOnTable->setRecord($file1);

        $response = $usedOnTable->usage(new HTTPRequest("GET", "/"));

        $expected = json_encode([
            "usage"=> [[
                "id" => 1,
                "title" => "My Page",
                "type" => "Page",
                "link" => Director::absoluteURL('admin/pages/edit/show/1'),
                "ancestors" => []
            ]]
        ]);
        $this->assertEquals($expected, $response->getBody());
    }
}
