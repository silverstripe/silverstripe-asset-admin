<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use SilverStripe\AssetAdmin\GraphQL\Resolvers\AssetAdminResolver;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;

use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\GraphQL\Schema\Schema;

/**
 * Most of the search functionality is covered in {@link FileFilterInputTypeCreatorTest}
 */
class ReadFileQueryCreatorTest extends SapphireTest
{

    protected $usesDatabase = true;

    protected function setUp(): void
    {
        parent::setUp();
        if (!class_exists(Schema::class)) {
            $this->markTestSkipped('GraphQL 4 test ' . __CLASS__ . ' skipped');
        }

        TestAssetStore::activate('AssetAdminTest');

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

    public function testItRestrictsParentByCanView()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('view access not permitted');
        $folder = new Folder(['Name' => 'disallowCanView']);
        $folder->write();

        $this->getResultsForSearch([
            'filter' => ['parentId' => $folder->ID],
        ]);
    }

    public function testItFiltersResultsByCanView()
    {
        $allowedFolder = new Folder(['Name' => 'allowedFolder']);
        $allowedFolder->write();

        $disallowedFolder = new Folder(['Name' => 'disallowCanView']);
        $disallowedFolder->write();

        $allowedFile = new File(['Name' => 'allowedFile']);
        $allowedFile->write();

        $disallowedFile = new File(['Name' => 'disallowCanView.txt']);
        $disallowedFile->write();

        $list = $this->getResultsForSearch([
            'filter' => ['parentId' => 0],
        ]);

        $this->assertEquals(
            [
                $allowedFile->Name,
                $allowedFolder->Name,
            ],
            $list->column('Name')
        );
    }

    /**
     * @param array $args
     * @param array $context
     * @return \SilverStripe\ORM\DataList|\SilverStripe\ORM\Filterable
     */
    protected function getResultsForSearch($args, $context = null)
    {
        $context = $context ? $context : ['currentUser' => null];

        return AssetAdminResolver::resolveReadFiles(null, $args, $context, new FakeResolveInfo());
    }
}
