<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use SilverStripe\AssetAdmin\GraphQL\Resolvers\AssetAdminResolver;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\GraphQL\Schema\Schema;
use SilverStripe\Versioned\Tests\GraphQL\Fake\Fake;

class CreateFolderMutationCreatorTest extends SapphireTest
{

    protected static $fixture_file = '../fixtures.yml';

    public function setUp()
    {
        parent::setUp();
        if (!class_exists(Schema::class)) {
            $this->markTestSkipped('GraphQL 4 test ' . __CLASS__ . ' skipped');
        }
        File::add_extension(FileExtension::class);
        Folder::add_extension(FolderExtension::class);
    }

    public function tearDown()
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
        $newFolder = AssetAdminResolver::resolveCreateFolder(null, $args, null, new FakeResolveInfo());
        $this->assertNotNull($newFolder);
        $this->assertEquals($folder1->ID, $newFolder->ParentID);
        $this->assertEquals('testItCreatesFolder', $newFolder->Name);
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage create not allowed
     */
    public function testItRestrictsCreateFolderByCanCreate()
    {
        $folder1 = $this->objFromFixture(Folder::class, 'folder1');

        $args = [
            'folder' => [
                'parentID' => $folder1->ID,
                'name' => 'disallowCanCreate',
            ]
        ];
        AssetAdminResolver::resolveCreateFolder(null, $args, null, new FakeResolveInfo());
    }
}
