<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use SilverStripe\AssetAdmin\GraphQL\ReadFileQueryCreator;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\GraphQL\Manager;

class ReadFileQueryCreatorTest extends SapphireTest
{

    protected $usesDatabase = true;

    public function setUp()
    {
        parent::setUp();

        File::add_extension(FileExtension::class);
        Folder::add_extension(FolderExtension::class);
    }

    public function tearDown()
    {
        File::remove_extension(FileExtension::class);
        Folder::remove_extension(FolderExtension::class);

        parent::tearDown();
    }

    /**
     * @expectedException \InvalidArgumentException
     * @expectedExceptionMessage view access not permitted
     */
    public function testItRestrictsQueryByCanView()
    {
        $folder = new Folder([
            'Name' => 'disallowCanView'
        ]);
        $folder->write();

        $args = [
            'parentId' => $folder->ID,
        ];
        $creator = new ReadFileQueryCreator(new Manager());
        $creator->resolveConnection(null, $args, null, new ResolveInfo([]));
    }
}
