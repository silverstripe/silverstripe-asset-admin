<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use SilverStripe\AssetAdmin\GraphQL\ReadFileQueryCreator;
use SilverStripe\AssetAdmin\GraphQL\ReadFileUsageQueryCreator;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\GraphQL\Manager;
use Silverstripe\Assets\Dev\TestAssetStore;

/**
 * Most of the search functionality is covered in {@link FileFilterInputTypeCreatorTest}
 */
class ReadFileUsageQueryCreatorTest extends SapphireTest
{

    protected $usesDatabase = true;

    protected static $fixture_file = '../fixtures.yml';

    public function setUp()
    {
        parent::setUp();

        TestAssetStore::activate('AssetAdminTest');

        File::add_extension(FileExtension::class);
        Folder::add_extension(FolderExtension::class);
    }

    public function tearDown()
    {
        File::remove_extension(FileExtension::class);
        Folder::remove_extension(FolderExtension::class);

        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testUsageCountForRegularFile()
    {
        $this->assertUsageCountForFixture(File::class, 'rootfile', 2, 'rootfile file is used twice');
    }

    public function testUsageCountForUnusedFile()
    {
        $this->assertUsageCountForFixture(File::class, 'file2', 0, 'file2 is not used');
    }

    public function testUsageCountForFileWithoutReadAccess()
    {
        $this->assertUsageCountForFixture(File::class, 'disallowCanView', false, 'file2 is not used');
    }

    public function testUsageCountForRegularFolder()
    {
        $this->assertUsageCountForFixture(Folder::class, 'folder1', 2, 'folder1 contains files used 3 times');
    }

    public function testUsageCountForUnusedFolder()
    {
        $this->assertUsageCountForFixture(Folder::class, 'folder1.1', 0, 'folder1.1 does not contained any used files');
    }

    public function testUsageCountForNonExistentFile()
    {
        $this->expectException('InvalidArgumentException');
        $this->assertUsageCount(999, false, 'File 999 should throw an exception because it does not exists.');
    }

    /**
     * @param array $args
     * @param array $context
     * @return array
     */
    protected function getResultsForSearch($args, $context = null)
    {
        $context = $context ? $context : ['currentUser' => null];
        $creator = new ReadFileUsageQueryCreator(new Manager());
        return $creator->resolve(null, $args, $context, new ResolveInfo([]));
    }

    /**
     * Assert the file usage of the provided fixture.
     * @param string $fixture
     * @param int|false $expectedCount $expectedCount or false, if no result should be returned
     */
    private function assertUsageCountForFixture(string $class, string $fixture, $expectedCount, $message)
    {
        $id = $this->idFromFixture($class, $fixture);
        $this->assertUsageCount($id, $expectedCount, $message);
    }

    /**
     * Assert the file usage of the provided file ID.
     * @param string $fixture
     * @param int|false $expectedCount $expectedCount or false, if no result should be returned
     */
    private function assertUsageCount($id, $expectedCount, $message)
    {
        $actual = $this->getResultsForSearch(['IDs' => [$id]]);
        if ($expectedCount === false) {
            $this->assertEmpty($actual, $message);
        } else {
            $expected = [[
                'id' => $id,
                'inUseCount' => $expectedCount
            ]];
            $this->assertEquals($expected, $actual, $message);
        }
    }
}
