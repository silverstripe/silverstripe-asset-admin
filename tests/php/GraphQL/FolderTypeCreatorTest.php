<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\GraphQL\FolderTypeCreator;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\GraphQL\Manager;

/**
 * Most of the search functionality is covered in {@link FileFilterInputTypeCreatorTest}
 */
class FolderTypeCreatorTest extends SapphireTest
{
    protected $usesTransactions = false;

    protected $usesDatabase = true;

    public function testItDoesNotFilterByParentIdWithRecursiveFlag()
    {
        $rootFolder = Folder::singleton();

        $folder = Folder::create(['Name' => 'folder']);
        $folder->write();

        $nestedFile = File::create([
            'Name' => 'myNestedFile',
            'ParentID' => $folder->ID,
        ]);
        $nestedFile->write();

        $rootFile = File::create([
            'Name' => 'myRootFile',
            'ParentID' => 0,
        ]);
        $rootFile->write();

        $listWithoutRecursive = $this->resolveChildrenConnection(
            $rootFolder,
            ['filter' => [
                'recursive' => false
            ]]
        );
        $this->assertEquals(
            [
                $folder->Name,
                $rootFile->Name,
            ],
            $listWithoutRecursive['edges']->column('Name')
        );

        $listWithRecursive = $this->resolveChildrenConnection(
            $rootFolder,
            ['filter' => [
                'recursive' => true
            ]]
        );
        $this->assertEquals(
            [
                $folder->Name,
                $nestedFile->Name,
                $rootFile->Name,
            ],
            $listWithRecursive['edges']->column('Name')
        );

        // Test with partial tree search
        $listWithPartialTreeRecursive = $this->resolveChildrenConnection(
            $folder,
            ['filter' => [
                'recursive' => true
            ]]
        );
        $this->assertEquals(
            [
                $nestedFile->Name,
            ],
            $listWithPartialTreeRecursive['edges']->column('Name')
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

    protected function resolveChildrenConnection($object, $args, $context = null)
    {
        $context = $context ? $context : $this->getContext();

        $managerMock = $this->getManagerMock();
        $creator = new FolderTypeCreator($managerMock->reveal());
        return $creator->resolveChildrenConnection(
            $object,
            $args,
            $context,
            new ResolveInfo([]),
            $creator->getChildrenConnection()
        );
    }
}
