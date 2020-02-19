<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use SilverStripe\Admin\Forms\UsedOnTable;
use SilverStripe\Assets\File;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Dev\SapphireTest;

/**
 * @skipUpgrade
 */
class UsedOnTableTest extends SapphireTest
{
    protected static $fixture_file = 'UsedOnTableTest.yml';

    public function testExcludes()
    {
        $usedOnTable = new UsedOnTable("Used On");
        $file1 = $this->objFromFixture(File::class, 'file1');
        $usedOnTable->setRecord($file1);

        $response = $usedOnTable->usage(new HTTPRequest("GET", "/"));

        $protocol = Director::is_https() ? 'https' : 'http';

        $expected = json_encode([
            "usage"=> [[
                "id" => 0,
                "title" => "My Page",
                "type" => "Page",
                "state" => "Draft",
                "link" => sprintf('%s://localhost/admin/pages/edit/show/1', $protocol)
            ]]
        ]);
        $this->assertEquals($expected, $response->getBody());
    }
}
