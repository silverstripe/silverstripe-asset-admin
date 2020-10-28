<?php

namespace SilverStripe\AssetAdmin\Tests\Legacy\GraphQL;

use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\AssetAdmin\GraphQL\FileFilterInputTypeCreator;
use SilverStripe\GraphQL\Schema\Schema;

class FileFilterInputTypeCreatorTest extends SapphireTest
{

    protected $usesDatabase = true;

    public function setUp()
    {
        parent::setUp();
        if (class_exists(Schema::class)) {
            $this->markTestSkipped('GraphQL 3 test ' . __CLASS__ . ' skipped');
        }
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

    public function testItFiltersByCreated()
    {
        $folder = new Folder([
            'name' => 'folder'
        ]);
        $folder->write();

        $file1 = new File([
            'Created' => '2014-01-05 23:11:39',
            'ParentID' => $folder->ID,
        ]);
        $file1->write();

        $file2 = new File([
            'Created' => '2014-01-06 12:00:00',
            'ParentID' => $folder->ID,
        ]);
        $file2->write();

        $baseList = $folder->stageChildren();

        $creator = new FileFilterInputTypeCreator();

        // Mock searches for 4th Jan
        $list = $creator->filterList($baseList, [
            'lastEditedFrom' => '2014-01-04',
            'lastEditedTo' => '2014-01-04',
        ]);
        $this->assertEquals(0, $list->Count());

        // Mock searches for 5th Jan
        $list = $creator->filterList($baseList, [
            'lastEditedFrom' => date('Y-m-d'),
            'lastEditedTo' => date('Y-m-d'),
        ]);
        $this->assertEquals(2, $list->Count());
        $this->assertContains($file1->ID, $list->column('ID'));


        // Mock searches for 5th-6th Jan
        $list = $creator->filterList($baseList, [
            'createdFrom' => '2014-01-05',
            'createdTo' => '2014-01-06',
        ]);
        $this->assertEquals(2, $list->Count());
        $this->assertContains($file1->ID, $list->column('ID'));
        $this->assertContains($file2->ID, $list->column('ID'));

        // Mock searches for 6th Jan
        $list = $creator->filterList($baseList, [
            'createdFrom' => '2014-01-06',
            'createdTo' => '2014-01-06',
        ]);
        $this->assertEquals(1, $list->Count());
        $this->assertContains($file2->ID, $list->column('ID'));

        // Mock searches for 7th Jan
        $list = $creator->filterList($baseList, [
            'lastEditedFrom' => '2014-01-07',
            'lastEditedTo' => '2014-01-07',
        ]);
        $this->assertEquals(0, $list->Count());
    }

    public function testItFiltersByParentId()
    {
        $folder1 = new Folder([
            'name' => 'folder1'
        ]);
        $folder1->write();

        $folder2 = new Folder([
            'name' => 'folder2'
        ]);
        $folder2->write();

        $file1 = new File([
            'ParentID' => $folder1->ID,
        ]);
        $file1->write();

        $file2 = new File([
            'ParentID' => $folder2->ID,
        ]);
        $file2->write();

        $baseList = File::get();

        $creator = new FileFilterInputTypeCreator();
        $list = $creator->filterList($baseList, [
            'parentId' => $folder1->ID
        ]);
        $this->assertContains(
            $file1->ID,
            $list->column('ID'),
            'Contains file in folder'
        );
        $this->assertNotContains(
            $file2->ID,
            $list->column('ID'),
            'Does not contain file in another folder'
        );
    }

    public function testItFiltersById()
    {
        $file1 = new File([
        ]);
        $file1->write();

        $file2 = new File([
        ]);
        $file2->write();

        $baseList = File::get();

        $creator = new FileFilterInputTypeCreator();
        $list = $creator->filterList($baseList, [
            'id' => $file1->ID
        ]);
        $this->assertContains(
            $file1->ID,
            $list->column('ID'),
            'Contains file matched by ID'
        );
        $this->assertNotContains(
            $file2->ID,
            $list->column('ID'),
            'Does not contain other files'
        );
    }

    public function testItFiltersByChildId()
    {
        $folder1 = new Folder([
            'name' => 'folder1'
        ]);
        $folder1->write();

        $folder2 = new Folder([
            'name' => 'folder2'
        ]);
        $folder2->write();

        $file1 = new File([
            'ParentID' => $folder1->ID,
        ]);
        $file1->write();

        $file2 = new File([
            'ParentID' => $folder2->ID,
        ]);
        $file2->write();

        $baseList = File::get();

        $creator = new FileFilterInputTypeCreator();
        $list = $creator->filterList($baseList, [
            'anyChildId' => $file2->ID
        ]);
        $this->assertContains(
            $folder2->ID,
            $list->column('ID'),
            'Finds parent folder'
        );
        $this->assertNotContains(
            $folder1->ID,
            $list->column('ID'),
            'Does not find non-parent folder'
        );
    }

    public function testItFiltersByName()
    {
        $folder = new Folder([
            'Name' => 'FooFolderName',
            'Title' => 'FooFolderTitle'
        ]);
        $folder->write();

        $file1 = new File([
            'Name' => 'FooFileName',
            'Title' => 'FooFileTitle'
        ]);
        $file1->write();

        $file2 = new File([
            'Name' => 'BarFileName',
            'Title' => 'BarFileTitle',
        ]);
        $file2->write();

        $baseList = File::get();
        $creator = new FileFilterInputTypeCreator();
        $listByName = $creator->filterList($baseList, [
            'name' => 'Foo',
        ]);

        $this->assertEquals(
            [$file1->ID, $folder->ID],
            $listByName->column('ID'),
            'Finds files and folders by name'
        );

        $baseList = File::get();
        $creator = new FileFilterInputTypeCreator();
        $listByTitle = $creator->filterList($baseList, [
            'name' => 'FooFileTitle',
        ]);

        $this->assertEquals(
            [$file1->ID],
            $listByTitle->column('ID'),
            'Finds files and folders by title'
        );
    }

    public function testItFiltersByAppCategory()
    {
        $image = new File([
            'Name' => 'image.jpg',
        ]);
        $image->write();

        $archive = new File([
            'Name' => 'archive.zip',
        ]);
        $archive->write();

        $baseList = File::get();
        $creator = new FileFilterInputTypeCreator();
        $listImages = $creator->filterList($baseList, [
            'appCategory' => ['jpg'],
        ]);
        $this->assertEquals(
            [$image->ID],
            $listImages->column('ID'),
            'Finds images by appCategory'
        );

        $baseList = File::get();
        $creator = new FileFilterInputTypeCreator();
        $listArchives = $creator->filterList($baseList, [
            'appCategory' => ['zip'],
        ]);
        $this->assertEquals(
            [$archive->ID],
            $listArchives->column('ID'),
            'Finds archives by appCategory'
        );
    }
}
