<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\GraphQL\FolderTypeCreator;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\GraphQL\Manager;

class FolderTypeCreatorTest extends SapphireTest
{

    protected $usesDatabase = true;

    public function testItSortsChildrenOnTypeByDefault()
    {
        $rootFolder = Folder::singleton();

        $file = File::create(['Name' => 'aaa file']);
        $file->write();

        $folder = Folder::create(['Name' => 'bbb folder']);
        $folder->write();

        $managerMock = $this->getManagerMock();
        $creator = new FolderTypeCreator($managerMock->reveal());
        $fields = $creator->fields();
        $list = $fields['children']['resolve'](
            $rootFolder,
            [],
            $this->getContext(),
            new ResolveInfo([])
        );
        $this->assertEquals(
            [
                $folder->Name,
                $file->Name,
            ],
            $list['edges']->column('Name')
        );
    }

    public function testItShowsParents()
    {
        $folder1 = Folder::create(['Name' => 'folder1', 'ParentID' => 0]);
        $folder1->write();

        $folder1_1 = Folder::create(['Name' => 'folder1_1', 'ParentID' => $folder1->ID]);
        $folder1_1->write();

        $folder1_1_1 = Folder::create(['Name' => 'folder1_1_1', 'ParentID' => $folder1_1->ID]);
        $folder1_1_1->write();

        $folder2 = Folder::create(['Name' => 'folder2', 'ParentID' => 0]);
        $folder2->write();

        $managerMock = $this->getManagerMock();
        $creator = new FolderTypeCreator($managerMock->reveal());
        $parents = $creator->resolveParentsField(
            $folder1_1_1,
            [],
            $this->getContext(),
            new ResolveInfo([])
        );
        $this->assertEquals(
            [
                $folder1->Name,
                $folder1_1->Name
            ],
            array_map(function ($folder) {
                return $folder->Name;
            }, $parents)
        );
    }

    protected function getManagerMock()
    {
        $mock = $this->prophesize(Manager::class);
        return $mock;
    }

    protected function getContext()
    {
        return [
            'currentUser' => null
        ];
    }
}
