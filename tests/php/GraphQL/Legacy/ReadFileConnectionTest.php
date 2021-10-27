<?php

namespace SilverStripe\AssetAdmin\Tests\Legacy\GraphQL;

use SilverStripe\AssetAdmin\GraphQL\ReadFileConnection;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\GraphQL\Schema\Schema;
use SilverStripe\Assets\File;

class ReadFileConnectionTest extends SapphireTest
{
    protected static $fixture_file = '../../fixtures.yml';

    protected function setUp(): void
    {
        parent::setUp();
        if (class_exists(Schema::class)) {
            $this->markTestSkipped('GraphQL 3 test ' . __CLASS__ . ' skipped');
        }
    }

    public function testApplySortFoldersFirst()
    {
        $list = File::get();

        $connection = ReadFileConnection::create('readFiles')
            ->setSortableFields(['Title'])
            ->setConnectionType(function () {
                return $this->manager->getType('FileInterface');
            });

        $result = $connection->resolveList($list, ['sortBy' => [['field' => 'Title', 'direction' => 'ASC']]]);
        $titles = $result['edges']->column('Title');
        $this->assertEquals('disallowCanAddChildren', $titles[0]); // disallowCanAddChildren is a folder
        $this->assertEquals('folder1', $titles[1]);
        $this->assertEquals('folder1-1', $titles[2]);
        $this->assertEquals('folder2', $titles[3]);
        $this->assertEquals('disallowCanDelete', $titles[4]); // disallowCanDelete is a file

        $result = $connection->resolveList($list, ['sortBy' => [['field' => 'Title', 'direction' => 'DESC']]]);
        $titles = $result['edges']->column('Title');
        $this->assertEquals('folder2', $titles[0]);
        $this->assertEquals('folder1-1', $titles[1]);
        $this->assertEquals('folder1', $titles[2]);
        $this->assertEquals('disallowCanAddChildren', $titles[3]);
        $this->assertEquals('The Third File', $titles[4]);
    }
}
