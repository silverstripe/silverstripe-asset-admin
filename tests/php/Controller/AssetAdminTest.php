<?php

namespace SilverStripe\AssetAdmin\Tests\Controller;

use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Tests\Storage\AssetStoreTest\TestAssetStore;
use SilverStripe\Control\Director;
use SilverStripe\Control\Session;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Security\SecurityToken;

/**
 * Tests {@see AssetAdmin}
 */
class AssetAdminTest extends FunctionalTest
{

    protected static $fixture_file = '../fixtures.yml';

    /**
     * @var Session
     */
    protected $session = null;

    public function setUp()
    {
        parent::setUp();

        TestAssetStore::activate('AssetAdminTest');
        $memberID = $this->logInWithPermission('ADMIN');
        $this->session = new Session([ 'loggedInAs' => $memberID ]);

        File::add_extension(FileExtension::class);
        Folder::add_extension(FolderExtension::class);

        // Create a test folders for each of the fixture references
        foreach (File::get()->filter('ClassName', Folder::class) as $folder) {
            /** @var Folder $folder */
            $folder->copyVersionToStage(Versioned::DRAFT, Versioned::LIVE);
        }

        // Create a test files for each of the fixture references
        $content = str_repeat('x', 1000000);
        foreach (File::get()->exclude('ClassName', Folder::class) as $file) {
            /** @var File $file */
            $file->setFromString($content, $file->generateFilename());
            $file->copyVersionToStage(Versioned::DRAFT, Versioned::LIVE);
        }

        // Override FunctionalTest defaults
        SecurityToken::enable();
        $this->session->set('SecurityID', SecurityToken::inst()->getValue());
    }

    public function tearDown()
    {
        File::remove_extension(FileExtension::class);
        Folder::remove_extension(FolderExtension::class);

        TestAssetStore::reset();
        parent::tearDown();
    }


    public function testApiHistory()
    {
        $file = $this->objFromFixture(File::class, 'file1');
        $response = Director::test(
            'admin/assets/api/history?fileId='. $file->ID,
            null,
            $this->session,
            'GET'
        );

        $this->assertFalse($response->isError());

        $body = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('summary', $body[0]);
        $this->assertArrayHasKey('versionid', $body[0]);
        $this->assertArrayHasKey('summary', $body[0]);

        // test permission filtering and
    }

    public function testItCreatesFile()
    {
        $folder1 = $this->objFromFixture(Folder::class, 'folder1');

        /** @skipUpgrade */
        $fileData = array('Upload' => $this->getUploadFile('Upload', 'testItCreatesFile.txt'));
        $_FILES = $fileData;
        $postedData = array_merge(
            $fileData,
            [
                    'ParentID' => $folder1->ID,
                    'SecurityID' => SecurityToken::inst()->getValue(),
                ]
        );
        $response = Director::test(
            'admin/assets/api/createFile',
            $postedData,
            $this->session,
            'POST'
        );
        $this->assertFalse($response->isError());
        $responseData = json_decode($response->getBody(), true);
        $newFile = File::get()->byID($responseData[0]['id']);
        $this->assertNotNull($newFile);
        $this->assertEquals($folder1->ID, $newFile->ParentID);
        $this->assertEquals('testItCreatesFile.txt', $newFile->Name);

        // Test that duplicate uploads are renamed
        $response = Director::test(
            'admin/assets/api/createFile',
            $postedData,
            $this->session,
            'POST'
        );
        $this->assertFalse($response->isError());
        $responseData = json_decode($response->getBody(), true);
        $newFile2 = File::get()->byID($responseData[0]['id']);
        $this->assertNotNull($newFile2);
        $this->assertEquals($folder1->ID, $newFile2->ParentID);
        $this->assertNotEquals($newFile->ID, $newFile2->ID);
        $this->assertEquals('testItCreatesFile-v2.txt', $newFile2->Name);
    }

    public function testItRestrictsCreateFileOnCanCreate()
    {
        $folder = $this->objFromFixture(Folder::class, 'folder1');

        $fileData = array('Upload' => $this->getUploadFile('Upload', 'disallowCanCreate.txt'));
        $_FILES = $fileData;
        $response = Director::test(
            'admin/assets/api/createFile',
            array_merge(
                $fileData,
                [
                    'ParentID' => $folder->ID,
                    'SecurityID' => SecurityToken::inst()->getValue(),
                ]
            ),
            $this->session,
            'POST'
        );
        $this->assertTrue($response->isError());
        $this->assertEquals(403, $response->getStatusCode());
    }

    public function testItRestrictsCreateFileOnCanAddChildren()
    {
        $folder = $this->objFromFixture(Folder::class, 'disallowCanAddChildren');

        /** @skipUpgrade */
        $fileData = array('Upload' => $this->getUploadFile('Upload', 'test.txt'));
        $_FILES = $fileData;
        $response = Director::test(
            'admin/assets/api/createFile',
            array_merge(
                $fileData,
                [
                    'ParentID' => $folder->ID,
                    'SecurityID' => SecurityToken::inst()->getValue(),
                ]
            ),
            $this->session,
            'POST'
        );
        $this->assertTrue($response->isError());
        $this->assertEquals(403, $response->getStatusCode());
    }

    public function testItRestrictsCreateFileOnExtension()
    {
        $folder1 = $this->objFromFixture(
            Folder::class,
            'folder1'
        );

        /** @skipUpgrade */
        $fileData = array('Upload' => $this->getUploadFile('Upload', 'disallowed.php'));
        $_FILES = $fileData;
        $response = Director::test(
            'admin/assets/api/createFile',
            array_merge(
                $fileData,
                [
                    'ParentID' => $folder1->ID,
                    'SecurityID' => SecurityToken::inst()->getValue(),
                ]
            ),
            $this->session,
            'POST'
        );
        $this->assertTrue($response->isError());
        $this->assertEquals(400, $response->getStatusCode());
        $responseData = json_decode($response->getBody(), true);
        $this->assertContains(
            'Extension is not allowed',
            $responseData['message']['value']
        );
    }

    public function testItRestrictsUpdateFile()
    {
        $allowedFile = $this->objFromFixture(File::class, 'file1');
        $disallowedFile = $this->objFromFixture(File::class, 'disallowCanEdit');

        $response = Director::test(
            'admin/assets/fileEditForm/' . $allowedFile->ID,
            [
                'action_save' => 1,
                'ID' => $allowedFile->ID,
                'Name' => 'disallowCanEdit.txt',
                'Title' => 'new',
                'SecurityID' => SecurityToken::inst()->getValue(),
            ],
            $this->session
        );
        $this->assertFalse($response->isError());

        $response = Director::test(
            'admin/assets/fileEditForm/' . $disallowedFile->ID,
            [
                'action_save' => 1,
                'ID' => $disallowedFile->ID,
                'Title' => 'new',
                'SecurityID' => SecurityToken::inst()->getValue(),
            ],
            $this->session
        );
        $this->assertTrue($response->isError());
    }

    /**
     * @param string $paramName
     * @param string $tmpFileName
     * @return array Emulating an entry in the $_FILES superglobal
     */
    protected function getUploadFile($paramName, $tmpFileName = 'AssetAdminTest.txt')
    {
        $tmpFilePath = TEMP_FOLDER . '/' . $tmpFileName;
        $tmpFileContent = '';
        for ($i = 0; $i < 10000; $i++) {
            $tmpFileContent .= '0';
        }
        file_put_contents($tmpFilePath, $tmpFileContent);

        // emulates the $_FILES array
        return array(
            'name' => $tmpFileName,
            'type' => 'text/plaintext',
            'size' => filesize($tmpFilePath),
            'tmp_name' => $tmpFilePath,
            'error' => UPLOAD_ERR_OK,
        );
    }

    public function testSaveOrPublish()
    {
        // Test rename folder
        $folder1ID = $this->idFromFixture(Folder::class, 'folder1');
        $response = $this->post(
            'admin/assets/fileEditForm/' . $folder1ID,
            [
                'ID' => $folder1ID,
                'action_save' => 1,
                'Name' => 'folder1-renamed',
                'SecurityID' => SecurityToken::inst()->getValue(),
            ]
        );
        $this->assertFalse($response->isError());
        $folder1 = Folder::get()->byID($folder1ID);
        $this->assertEquals('folder1-renamed', $folder1->Name);
    }
}
