<?php

namespace SilverStripe\AssetAdmin\Tests\Legacy\GraphQL;

use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\AssetAdmin\Tests\GraphQL\FakeResolveInfo;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\AssetAdmin\GraphQL\CreateFolderMutationCreator;
use SilverStripe\GraphQL\Schema\Schema;

class CreateFolderMutationCreatorTest extends SapphireTest
{

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
        $newFolder = $creator->resolve(null, $args, null, new FakeResolveInfo());
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
        $creator->resolve(null, $args, null, new FakeResolveInfo());
    }
}
