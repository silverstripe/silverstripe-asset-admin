<?php

namespace SilverStripe\AssetAdmin\Tests;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use FunctionalTest;
use Versioned;
use File;
use AssetStoreTest_SpyStore;
use SS_HTTPRequest;
use Director;
use Injector;


/**
 * Tests {@see AssetAdmin}
 */
class AssetAdminTest extends FunctionalTest
{

    protected static $fixture_file = 'AssetAdminTest.yml';

    /**
     * @var Session
     */
    protected $session = null;

    public function setUp()
    {
        parent::setUp();

        AssetStoreTest_SpyStore::activate('AssetAdminTest');
        $memberID = $this->logInWithPermission('ADMIN');
        $this->session = Injector::inst()->create('Session', array('loggedInAs' => $memberID));

        // Create a test folders for each of the fixture references
        foreach (File::get()->filter('ClassName', 'Folder') as $folder) {
            /** @var Folder $folder */
            $folder->publish(Versioned::DRAFT, Versioned::LIVE);
        }

        // Create a test files for each of the fixture references
        $content = str_repeat('x', 1000000);
        foreach (File::get()->exclude('ClassName', 'Folder') as $file) {
            /** @var File $file */
            $file->setFromString($content, $file->generateFilename());
            $file->publish(Versioned::DRAFT, Versioned::LIVE);
        }
    }

    public function tearDown()
    {
        AssetStoreTest_SpyStore::reset();
        parent::tearDown();
    }

    /**
     * Mock a file search using AssetAdmin
     *
     * @param string $name
     * @param string $from Created from date
     * @param string $to Createi to date
     * @param string $category
     * @return SS_List
     */
    protected function getResultsForSearch($name = '', $from = '', $to = '', $category = '')
    {
        $request = new SS_HTTPRequest(null, 'admin/assets/show', array(
            'q' => array(
                'Name' => $name,
                'CreatedFrom' => $from,
                'CreatedTo' => $to,
                'AppCategory' => $category
            ),
            'action_doSearch' => 'Apply Filter'
        ));
        $admin = new AssetAdmin();
        $admin->setRequest($request);
        return $admin->getList();
    }

    /**
     * Tests filtering between date ranges
     */
    public function testDateFromToLastSameDate()
    {
        $file1 = $this->objFromFixture('File', 'file1');
        $file2 = $this->objFromFixture('File', 'file2');

        // Force creation times
        $file1->Created = '2014-01-05 23:11:39';
        $file1->write();
        $file2->Created = '2014-01-06 12:00:00';
        $file2->write();

        // Mock searches for 4th Jan
        $results = $this->getResultsForSearch(null, '2014-01-04', '2014-01-04');
        $this->assertEmpty($results->column('Title'));

        // Mock searches for 5th Jan
        $results = $this->getResultsForSearch(null, '2014-01-05', '2014-01-05');
        $this->assertEquals(array('file1'), $results->column('Title'));

        // Mock searches for 5th-6th Jan
        $results = $this->getResultsForSearch(null, '2014-01-05', '2014-01-06');
        $this->assertEquals(array('file1', 'file2'), $results->sort('Title')->column('Title'));

        // Mock searches for 6th Jan
        $results = $this->getResultsForSearch(null, '2014-01-06', '2014-01-06');
        $this->assertEquals(array('file2'), $results->column('Title'));

        // Mock searches for 7th Jan
        $results = $this->getResultsForSearch(null, '2014-01-07', '2014-01-07');
        $this->assertEmpty($results->column('Title'));
    }


    public function testItFiltersData()
    {
        $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'file2');
        $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'file3');


        $field = $this->getNewField();
        $field->setCurrentFolder('Folder2');

        $request = new SS_HTTPRequest('GET', 'http://example.com');

        $response = $field->search($request);
        $files = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('files', $files);
        $this->assertCount(2, $files['files']);

        $request = new SS_HTTPRequest('GET', 'http://example.com', array('name' => 'Third'));

        $response = $field->search($request);
        $files = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('files', $files);
        $this->assertCount(1, $files['files']);
        $this->assertEquals('The Third File', $files['files'][0]['title']);
    }

    public function testItRestrictsViewInSearch()
    {
        $allowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'file1');
        $disallowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'disallowCanView');
        $field = $this->getNewField();

        $request = new SS_HTTPRequest('GET', 'http://example.com', ['name' => $allowedFile->Name]);
        $response = $field->search($request);
        $files = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('files', $files);
        $this->assertCount(1, $files['files']);
        $this->assertEquals($allowedFile->ID, $files['files'][0]['id']);

        $request = new SS_HTTPRequest('GET', 'http://example.com', ['name' => $disallowedFile->Name]);
        $response = $field->search($request);
        $files = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('files', $files);
        $this->assertCount(0, $files['files']);
    }

    public function testItRestrictsViewInReadFolder()
    {
        $folder1 = $this->objFromFixture('Folder', 'folder1');
        $allowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'file1');
        $disallowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'disallowCanView');

        $response = $this->get('admin/assets/api/readFolder?' . http_build_query(['id' => $folder1->ID]));
        $files = json_decode($response->getBody(), true);
        $this->assertArrayHasKey('files', $files);
        $ids = array_map(function ($file) {return $file['id'];}, $files['files']);
        $this->assertContains($allowedFile->ID, $ids);
        $this->assertEquals($allowedFile->ParentID, $folder1->ID);
        $this->assertNotContains($disallowedFile->ID, $ids);
        $this->assertEquals($disallowedFile->ParentID, $folder1->ID);
    }

    public function testItRestrictsUpdateFile()
    {
        $allowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'file1');
        $disallowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'disallowCanEdit');

        $response = Director::test(
            'admin/assets/api/updateFile',
            null,
            $this->session,
            'PUT',
            http_build_query(['id' => $allowedFile->ID, 'title' => 'new'])
        );
        $this->assertFalse($response->isError());

        $response = Director::test(
            'admin/assets/api/updateFile',
            null,
            $this->session,
            'PUT',
            http_build_query(['id' => $disallowedFile->ID, 'title' => 'new'])
        );
        $this->assertTrue($response->isError());
    }

    public function testItRestrictsDelete()
    {
        $allowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'file1');
        $disallowedFile = $this->objFromFixture('SilverStripe\AssetAdmin\Tests\AssetAdminTest_File', 'disallowCanDelete');

        $response = Director::test(
            'admin/assets/api/delete',
            null,
            $this->session,
            'DELETE',
            http_build_query(['ids' => [$allowedFile->ID, $disallowedFile->ID]])
        );
        $this->assertTrue($response->isError());

        $response = Director::test(
            'admin/assets/api/delete',
            null,
            $this->session,
            'DELETE',
            http_build_query(['ids' => [$allowedFile->ID]])
        );
        $this->assertFalse($response->isError());
    }
}

class AssetAdminTest_File extends File implements \TestOnly
{
    public function canView($member = null)
    {
        return ($this->Name != 'disallowCanView.txt');
    }

    public function canEdit($member = null)
    {
        return ($this->Name != 'disallowCanEdit.txt');
    }

    public function canDelete($member = null)
    {
        return ($this->Name != 'disallowCanDelete.txt');
    }
}
