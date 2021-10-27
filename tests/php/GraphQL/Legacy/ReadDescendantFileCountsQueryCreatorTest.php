<?php

namespace SilverStripe\AssetAdmin\Tests\Legacy\GraphQL;

use SilverStripe\AssetAdmin\GraphQL\ReadDescendantFileCountsQueryCreator;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\GraphQL\Manager;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\GraphQL\Schema\Schema;

class ReadDescendantFileCountsQueryCreatorTest extends SapphireTest
{

    protected $usesDatabase = true;

    protected static $fixture_file = '../../fixtures.yml';

    protected function setUp(): void
    {
        parent::setUp();
        if (class_exists(Schema::class)) {
            $this->markTestSkipped('GraphQL 3 test ' . __CLASS__ . ' skipped');
        }

        File::add_extension(FileExtension::class);
        Folder::add_extension(FolderExtension::class);
    }

    protected function tearDown(): void
    {
        File::remove_extension(FileExtension::class);
        Folder::remove_extension(FolderExtension::class);

        TestAssetStore::reset();
        parent::tearDown();
    }

    public function descendantFileCountsProvider()
    {
        return [
            [File::class, 'rootfile', 0, 'non-folder is counted 0 times'],
            [File::class, 'disallowCanView', false, 'disallowCanView should provide file usage data'],
            [Folder::class, 'folder1', 4, 'folder1 contains 4 files'],
            [Folder::class, 'folder1.1', 0, 'folder1.1 does not contained any files'],
        ];
    }

    /**
     * @dataProvider descendantFileCountsProvider
     * @param string $class
     * @param string $fixture
     * @param int|false $expectedCount
     * @param $message
     */
    public function testUsageCount(string $class, string $fixture, $expectedCount, $message)
    {
        $id = $this->idFromFixture($class, $fixture);
        $this->assertDescendantFileCount($id, $expectedCount, $message);
    }

    public function testUsageCountForNonExistentFile()
    {
        $this->expectException('InvalidArgumentException');
        $this->assertDescendantFileCount(999, false, 'File 999 should throw an exception because it does not exists.');
    }

    /**
     * @param array $args
     * @param array $context
     * @return array
     */
    protected function getResultsForSearch($args, $context = null)
    {
        $context = $context ? $context : ['currentUser' => null];
        $creator = new ReadDescendantFileCountsQueryCreator(new Manager());
        return $creator->resolve(null, $args, $context, new ResolveInfo([]));
    }

    /**
     * Assert the file usage of the provided file ID.
     * @param string $fixture
     * @param int|false $expectedCount $expectedCount or false, if no result should be returned
     */
    private function assertDescendantFileCount($id, $expectedCount, $message)
    {
        $actual = $this->getResultsForSearch(['ids' => [$id]]);
        if ($expectedCount === false) {
            $this->assertEmpty($actual, $message);
        } else {
            $expected = [[
                'id' => $id,
                'count' => $expectedCount
            ]];
            $this->assertEquals($expected, $actual, $message);
        }
    }
}
