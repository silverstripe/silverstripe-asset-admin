<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\GraphQL\CreateFolderMutationCreator;

class CreateFolderMutationCreatorTest extends SapphireTest
{

    protected static $fixture_file = '../fixtures.yml';

    protected function setUp() : void
    {
        parent::setUp();

        File::add_extension(FileExtension::class);
        Folder::add_extension(FolderExtension::class);
    }

    protected function tearDown() : void
    {
        File::remove_extension(FileExtension::class);
        Folder::remove_extension(FolderExtension::class);

        parent::tearDown();
    }

    public function testItCreatesFolder()
    {
        $folder1 = $this->objFromFixture(Folder::class, 'folder1');

        $args = [
            'folder' => [
                'parentID' => $folder1->ID,
                'name' => 'testItCreatesFolder',
            ]
        ];
        $creator = new CreateFolderMutationCreator();
        $newFolder = $creator->resolve(null, $args, null, new ResolveInfo([]));
        $this->assertNotNull($newFolder);
        $this->assertEquals($folder1->ID, $newFolder->ParentID);
        $this->assertEquals('testItCreatesFolder', $newFolder->Name);
    }

    public function testItRestrictsCreateFolderByCanCreate()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('create not allowed');
        $folder1 = $this->objFromFixture(Folder::class, 'folder1');

        $args = [
            'folder' => [
                'parentID' => $folder1->ID,
                'name' => 'disallowCanCreate',
            ]
        ];
        $creator = new CreateFolderMutationCreator();
        $creator->resolve(null, $args, null, new ResolveInfo([]));
    }
}
