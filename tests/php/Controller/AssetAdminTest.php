<?php

namespace SilverStripe\AssetAdmin\Tests\Controller;

use SilverStripe\AssetAdmin\Forms\FolderFormFactory;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FileExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FolderExtension;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\TestFile;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\TestObject;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Assets\Upload_Validator;
use SilverStripe\Control\Director;
use SilverStripe\Control\Session;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Subsites\Extensions\FolderFormFactoryExtension;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Core\Config\Config;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest\FilesInUseFileExtension;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Tests {@see AssetAdmin}
 */
class AssetAdminTest extends FunctionalTest
{
    protected static $extra_dataobjects = [
        TestFile::class,
        TestObject::class,
    ];

    protected static $fixture_file = '../fixtures.yml';

    /**
     * @var Session
     */
    protected $session = null;

    protected static $illegal_extensions = [
        FolderFormFactory::class => [FolderFormFactoryExtension::class],
    ];

    protected function setUp(): void
    {
        parent::setUp();

        TestAssetStore::activate('AssetAdminTest');
        $this->logInWithPermission('ADMIN');
        $this->session = $this->mainSession->session();

        File::add_extension(FileExtension::class);
        Folder::add_extension(FolderExtension::class);

        // Create a test folders for each of the fixture references
        foreach (File::get()->filter('ClassName', Folder::class) as $folder) {
            /** @var Folder $folder */
            $folder->copyVersionToStage(Versioned::DRAFT, Versioned::LIVE);
        }

        // Create a test files for each of the fixture references, excluding Folders the TestFile class
        $content = str_repeat('x', 100);
        foreach (File::get()->exclude('ClassName', [Folder::class, TestFile::class]) as $file) {
            /** @var File $file */
            $file->setFromString($content, $file->generateFilename());
            $file->write();
            $file->copyVersionToStage(Versioned::DRAFT, Versioned::LIVE);
        }

        // Override FunctionalTest defaults
        SecurityToken::enable();
        $this->session->set('SecurityID', SecurityToken::inst()->getValue());

        // Disable is_uploaded_file() in tests
        Upload_Validator::config()->set('use_is_uploaded_file', false);
    }

    protected function tearDown(): void
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

        $body = json_decode($response->getBody() ?? '', true);

        $this->assertArrayHasKey('summary', $body[0]);
        $this->assertArrayHasKey('versionid', $body[0]);
        $this->assertArrayHasKey('summary', $body[0]);

        // test permission filtering and
    }

    public function testItCreatesFile()
    {
        $folder1 = $this->objFromFixture(Folder::class, 'folder1');

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
        $responseData = json_decode($response->getBody() ?? '', true);
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
        $responseData = json_decode($response->getBody() ?? '', true);
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
        $responseData = json_decode($response->getBody() ?? '', true);
        $this->assertEquals(
            [
                'type' => 'error',
                'code' => 400,
                'value' => "Extension 'php' is not allowed",
            ],
            $responseData['errors'][0]
        );
    }

    public function testItRestrictsUpdateFile()
    {
        /** @var File $allowedFile */
        $allowedFile = $this->objFromFixture(File::class, 'file1');
        /** @var File $disallowedFile */
        $disallowedFile = $this->objFromFixture(File::class, 'disallowCanEdit');

        $response = Director::test(
            'admin/assets/fileEditForm/' . $allowedFile->ID,
            [
                'action_save' => 1,
                'ID' => $allowedFile->ID,
                'Name' => 'disallowCanEdit.txt',
                'Title' => 'new',
                'SecurityID' => SecurityToken::inst()->getValue(),
                'CanViewType' => $allowedFile->CanViewType,
                'ViewerGroups' => 'unchanged',
                'CanEditType' => $allowedFile->CanEditType,
                'EditorGroups' => 'unchanged',
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
                'CanViewType' => $disallowedFile->CanViewType,
                'ViewerGroups' => 'unchanged',
                'CanEditType' => $disallowedFile->CanEditType,
                'EditorGroups' => 'unchanged',
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
        $tmpFilePath = TEMP_PATH . DIRECTORY_SEPARATOR . $tmpFileName;
        $tmpFileContent = '';
        for ($i = 0; $i < 10000; $i++) {
            $tmpFileContent .= '0';
        }
        file_put_contents($tmpFilePath ?? '', $tmpFileContent);

        // emulates the $_FILES array
        return array(
            'name' => $tmpFileName,
            'type' => 'text/plaintext',
            'size' => filesize($tmpFilePath ?? ''),
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
                'CanViewType' => 'Inherit',
                'ViewerGroups' => 'unchanged',
                'CanEditType' => 'Inherit',
                'EditorGroups' => 'unchanged',
            ]
        );
        $this->assertFalse($response->isError());
        $folder1 = Folder::get()->byID($folder1ID);
        $this->assertEquals('folder1-renamed', $folder1->Name);
    }

    public function testGetMinimalistObjectFromData()
    {
        /** @var File $file */
        $assetAdmin = AssetAdmin::singleton();
        $file = $this->objFromFixture(File::class, 'file1');

        $data = $assetAdmin->getMinimalistObjectFromData($file);

        // Thumbnail value is hard to predit, so we'll just check that it's there before unseting it.
        $this->assertNotEmpty($data['thumbnail']);
        unset($data['thumbnail']);

        $expected = [
            "id" => $file->ID,
            "parent" => [
                "id" => $file->Parent()->ID,
                "title" => $file->Parent()->Title,
                "filename" => $file->Parent()->Filename,
            ],
            "title" => $file->Title,
            "exists" => $file->exists(),
            "category" => $file->appCategory(),
            "extension" => $file->Extension,
            "size" => $file->AbsoluteSize,
            "published" => $file->isPublished(),
            "modified" => $file->isModifiedOnDraft(),
            "draft" => $file->isOnDraftOnly(),
            "hasRestrictedAccess" => $file->hasRestrictedAccess(),
            "isTrackedFormUpload" => $file->isTrackedFormUpload(),
            "visibility" => $file->getVisibility(),
        ];

        $this->assertEquals($expected, $data);
    }

    public function testGetObjectFromDataFile()
    {
        $assetAdmin = AssetAdmin::singleton();
        /** @var File $file */
        $file = $this->objFromFixture(File::class, 'file1');


        $data = $assetAdmin->getObjectFromData($file);

        // Thumbnail value is hard to predict, so we'll just check that it's there before unseting it.
        $this->assertNotEmpty($data['thumbnail']);
        unset($data['thumbnail']);

        $expected = [
            "id" => $file->ID,
            "parent" => [
                "id" => $file->Parent()->ID,
                "title" => $file->Parent()->Title,
                "filename" => $file->Parent()->Filename,
            ],
            "title" => $file->Title,
            "exists" => $file->exists(),
            "category" => $file->appCategory(),
            "extension" => $file->Extension,
            "size" => $file->AbsoluteSize,
            "published" => $file->isPublished(),
            "modified" => $file->isModifiedOnDraft(),
            "draft" => $file->isOnDraftOnly(),
            "inUseCount" => 1,
            "created" => $file->Created,
            "lastUpdated" => $file->LastEdited,
            "owner" => [
                "id" => $file->Owner()->ID,
                "title" => $file->Owner()->Name
            ],
            "type" => $file->FileType,
            "name" => $file->Name,
            "filename" => $file->Filename,
            "url" => $file->AbsoluteURL,
            "canEdit" => $file->canEdit(),
            "canDelete" => $file->canDelete(),
            "hasRestrictedAccess" => $file->hasRestrictedAccess(),
            "isTrackedFormUpload" => $file->isTrackedFormUpload(),
            "visibility" => $file->getVisibility(),
        ];

        $this->assertEquals($expected, $data);
    }

    public function testGetObjectFromDataFileWithFolder()
    {
        $assetAdmin = AssetAdmin::singleton();
        /** @var File $file */
        $file = $this->objFromFixture(Folder::class, 'folder1');


        $data = $assetAdmin->getObjectFromData($file);

        // Thumbnail value is hard to predit, so we'll just check that it's there before unseting it.
        $this->assertNotEmpty($data['thumbnail']);
        unset($data['thumbnail']);

        $expected = [
            "id" => $file->ID,
            "parent" => [
                "id" => $file->Parent()->ID,
                "title" => $file->Parent()->Title,
                "filename" => $file->Parent()->Filename,
            ],
            "title" => $file->Title,
            "exists" => $file->exists(),
            "category" => 'folder',
            "extension" => $file->Extension,
            "size" => $file->AbsoluteSize,
            "published" => $file->isPublished(),
            "modified" => $file->isModifiedOnDraft(),
            "draft" => $file->isOnDraftOnly(),
            "inUseCount" => 0,
            "created" => $file->Created,
            "lastUpdated" => $file->LastEdited,
            "owner" => [
                "id" => $file->Owner()->ID,
                "title" => $file->Owner()->Name
            ],
            "type" => 'folder',
            "name" => $file->Name,
            "filename" => $file->Filename,
            "url" => $file->AbsoluteURL,
            "canEdit" => $file->canEdit(),
            "canDelete" => $file->canDelete(),
            "hasRestrictedAccess" => $file->hasRestrictedAccess(),
            "isTrackedFormUpload" => $file->isTrackedFormUpload(),
            "visibility" => $file->getVisibility(),
        ];

        $this->assertEquals($expected, $data);
    }

    public function testGetClientConfigExtensions()
    {
        Config::withConfig(function () {
            $assetAdmin = AssetAdmin::singleton();
            Config::modify()->set(File::class, 'allowed_extensions', ['boom']);

            $config = $assetAdmin->getClientConfig();
            $acceptedFiles = $config['dropzoneOptions']['acceptedFiles'];
            $this->assertStringContainsString(
                '.boom',
                $acceptedFiles,
                'Extension added to File::allowed_extensions should be allowed by asset admin'
            );

            Config::modify()->set(File::class, 'allowed_extensions', ['boom', 'boom' => false]);

            $config = $assetAdmin->getClientConfig();
            $acceptedFiles = $config['dropzoneOptions']['acceptedFiles'];
            $this->assertStringNotContainsString(
                '.boom',
                $acceptedFiles,
                'Extension that have been manually disallowed should be not be allowed by asset admin'
            );
        });
    }

    public static function provideApiReadDescendantCounts(): array
    {
        return [
            'Valid' => [
                'idsType' => 'existing',
                'fail' => '',
                'expectedCode' => 200,
            ],
            'Reject fail canView()' => [
                'idsType' => 'existing',
                'fail' => 'can-view',
                'expectedCode' => 403,
            ],
            'Reject ids not passed' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-passed',
                'expectedCode' => 404,
            ],
            'Reject ids is not array' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-array',
                'expectedCode' => 404,
            ],
            'Reject invalid ID' => [
                'idsType' => 'second-is-invalid',
                'fail' => '',
                'expectedCode' => 404,
            ],
            'Reject non-numeric ID' => [
                'idsType' => 'second-is-non-numeric',
                'fail' => '',
                'expectedCode' => 404,
            ],
            'Reject new record ID' => [
                'idsType' => 'second-is-new-record',
                'fail' => '',
                'expectedCode' => 404,
            ],
        ];
    }

    #[DataProvider('provideApiReadDescendantCounts')]
    public function testApiReadDescendantCounts(
        string $idsType,
        string $fail,
        int $expectedCode
    ): void {
        TestFile::$fail = $fail;
        $ids = $this->getIDs($idsType);
        // swap out the first ID with a Folder fixture that contains a nested folder
        // which contains a file
        $ids[0] = $this->idFromFixture(Folder::class, 'ApiFolder02');
        $url = '/admin/assets/api/readDescendantCounts';
        if ($fail !== 'ids-not-passed') {
            if ($fail === 'ids-not-array') {
                $url .= '?ids=' . implode(',', $ids);
            } else {
                $qsa = array_map(fn($id) => "ids[]=$id", $ids);
                $url .= '?' . implode('&', $qsa);
            }
        }
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame('application/json', $response->getHeader('Content-type'));
        $this->assertSame($expectedCode, $response->getStatusCode());
        if ($expectedCode === 200) {
            $data = json_decode($response->getBody(), true);
            $this->assertSame([
                [
                    'id' => $ids[0],
                    'type' => 'folder',
                    'count' => 1,
                ],
                [
                    'id' => $ids[1],
                    'type' => 'file',
                    'count' => 0,
                ]
            ], $data);
        }
    }

    public static function provideApiReadLiveOwnerCounts(): array
    {
        return [
            'Valid' => [
                'idsType' => 'existing',
                'fail' => '',
                'expectedCode' => 200,
            ],
            'Reject fail canView()' => [
                'idsType' => 'existing',
                'fail' => 'can-view',
                'expectedCode' => 403,
            ],
            'Reject ids not passed' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-passed',
                'expectedCode' => 404,
            ],
            'Reject ids is not array' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-array',
                'expectedCode' => 404,
            ],
            'Reject invalid ID' => [
                'idsType' => 'second-is-invalid',
                'fail' => '',
                'expectedCode' => 404,
            ],
            'Reject non-numeric ID' => [
                'idsType' => 'second-is-non-numeric',
                'fail' => '',
                'expectedCode' => 404,
            ],
            'Reject new record ID' => [
                'idsType' => 'second-is-new-record',
                'fail' => '',
                'expectedCode' => 404,
            ],
        ];
    }

    #[DataProvider('provideApiReadLiveOwnerCounts')]
    public function testApiReadLiveOwnerCounts(
        string $idsType,
        string $fail,
        int $expectedCode
    ): void {
        foreach (TestFile::get() as $file) {
            $file->publishSingle();
        }
        foreach (TestObject::get() as $file) {
            $file->publishSingle();
        }
        try {
            TestFile::$fail = $fail;
            $ids = $this->getIDs($idsType);
            $url = '/admin/assets/api/readLiveOwnerCounts';
            if ($fail !== 'ids-not-passed') {
                if ($fail === 'ids-not-array') {
                    $url .= '?ids=' . implode(',', $ids);
                } else {
                    $qsa = array_map(fn($id) => "ids[]=$id", $ids);
                    $url .= '?' . implode('&', $qsa);
                }
            }
            $response = $this->mainSession->sendRequest('GET', $url, []);
            $this->assertSame('application/json', $response->getHeader('Content-type'));
            $this->assertSame($expectedCode, $response->getStatusCode());
            if ($expectedCode === 200) {
                $data = json_decode($response->getBody(), true);
                $this->assertSame([
                    [
                        'id' => $ids[0],
                        'count' => 2,
                        'message' => 'File "ApiTestFile01" is used in 2 places.'
                    ],
                    [
                        'id' => $ids[1],
                        'count' => 1,
                        'message' => 'File "ApiTestFile02" is used in 1 place'
                    ]
                ], $data);
            }
        } finally {
            foreach (TestFile::get() as $file) {
                $file->doUnpublish();
            }
            foreach (TestObject::get() as $file) {
                $file->doUnpublish();
            }
        }
    }

    public static function provideApiReadUsage(): array
    {
        return [
            'Valid' => [
                'idType' => 'existing',
                'fail' => '',
                'expectedCode' => 200,
            ],
            'Reject fail canView()' => [
                'idType' => 'existing',
                'fail' => 'can-view',
                'expectedCode' => 403,
            ],
            'Reject invalid ID' => [
                'idType' => 'invalid',
                'fail' => '',
                'expectedCode' => 404,
            ],
            'Reject non-numeric ID' => [
                'idType' => 'non-numeric',
                'fail' => '',
                'expectedCode' => 404,
            ],
            'Reject new record ID' => [
                'idType' => 'new-record',
                'fail' => '',
                'expectedCode' => 404,
            ],
        ];
    }

    #[DataProvider('provideApiReadUsage')]
    public function testApiReadUsage(
        string $idType,
        string $fail,
        int $expectedCode
    ): void {
        File::add_extension(FilesInUseFileExtension::class);
        try {
            TestFile::$fail = $fail;
            $id = $this->getID($idType);
            $url = "/admin/assets/api/readUsage/$id";
            $response = $this->mainSession->sendRequest('GET', $url, []);
            $this->assertSame('application/json', $response->getHeader('Content-type'));
            $this->assertSame($expectedCode, $response->getStatusCode());
            if ($expectedCode === 200) {
                // data is defined in FilesInUseFileExtension
                $data = json_decode($response->getBody(), true);
                $this->assertSame(['count' => 5], $data);
            }
        } finally {
            File::remove_extension(FilesInUseFileExtension::class);
        }
    }

    public static function provideApiDelete(): array
    {
        return [
            'Valid' => [
                'idsType' => 'existing',
                'fail' => '',
                'expectedCode' => 204,
            ],
            'Reject fail canDelete()' => [
                'idsType' => 'existing',
                'fail' => 'can-delete',
                'expectedCode' => 403,
            ],
            'Reject fail csrf-token' => [
                'idsType' => 'existing',
                'fail' => 'csrf-token',
                'expectedCode' => 400,
            ],
            'Reject ids not passed' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-passed',
                'expectedCode' => 400,
            ],
            'Reject ids is not array' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-array',
                'expectedCode' => 400,
            ],
            'Reject ids is empty' => [
                'idsType' => 'existing',
                'fail' => 'ids-is-empty',
                'expectedCode' => 400,
            ],
            'Reject invalid ID' => [
                'idsType' => 'second-is-invalid',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject non-numeric ID' => [
                'idsType' => 'second-is-non-numeric',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject new record ID' => [
                'idsType' => 'second-is-new-record',
                'fail' => '',
                'expectedCode' => 400,
            ],
        ];
    }

    #[DataProvider('provideApiDelete')]
    public function testApiDelete(
        string $idsType,
        string $fail,
        int $expectedCode
    ): void {
        $ids = $this->getIDs($idsType);
        $existingIDs = $this->getIDs('existing');
        TestFile::$fail = $fail;
        $url = '/admin/assets/api/delete';
        $headers = [];
        if ($fail !== 'csrf-token') {
            $headers = array_merge($headers, $this->getCsrfTokenheader());
        }
        $data = [];
        if ($fail !== 'ids-not-passed') {
            $data['ids'] = $ids;
        }
        if ($fail === 'ids-not-array') {
            $data['ids'] = implode(',', $ids);
        } elseif ($fail === 'ids-is-empty') {
            $data['ids'] = [];
        }
        $body = json_encode($data);
        $response = $this->mainSession->sendRequest('POST', $url, [], $headers, null, $body);
        $this->assertSame('application/json', $response->getHeader('Content-type'));
        $this->assertSame($expectedCode, $response->getStatusCode());
        if ($expectedCode >= 400) {
            $count = TestFile::get()->filter('ID', $existingIDs)->count();
            $this->assertSame(count($existingIDs), $count);
        } else {
            $count = TestFile::get()->filter('ID', $existingIDs)->count();
            $this->assertSame(0, $count);
        }
    }

    public static function provideApiMove(): array
    {
        return [
            'Valid' => [
                'idsType' => 'existing',
                'fail' => '',
                'expectedCode' => 204,
            ],
            'Reject fail canEdit()' => [
                'idsType' => 'existing',
                'fail' => 'can-edit',
                'expectedCode' => 403,
            ],
            'Reject fail csrf-token' => [
                'idsType' => 'existing',
                'fail' => 'csrf-token',
                'expectedCode' => 400,
            ],
            'Reject ids not passed' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-passed',
                'expectedCode' => 400,
            ],
            'Reject ids is not array' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-array',
                'expectedCode' => 400,
            ],
            'Reject ids is empty' => [
                'idsType' => 'existing',
                'fail' => 'ids-is-empty',
                'expectedCode' => 400,
            ],
            'Reject invalid ID' => [
                'idsType' => 'second-is-invalid',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject non-numeric ID' => [
                'idsType' => 'second-is-non-numeric',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject new record ID' => [
                'idsType' => 'second-is-new-record',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject folderID not passed' => [
                'idsType' => 'existing',
                'fail' => 'folder-id-not-passed',
                'expectedCode' => 400,
            ],
            'Reject folder does not exist' => [
                'idsType' => 'existing',
                'fail' => 'folder-not-exist',
                'expectedCode' => 400,
            ],
        ];
    }

    #[DataProvider('provideApiMove')]
    public function testApiMove(
        string $idsType,
        string $fail,
        int $expectedCode
    ): void {
        $ids = $this->getIDs($idsType);
        $folderIDs = [
            $this->idFromFixture(Folder::class, 'ApiFolder01'),
            $this->idFromFixture(Folder::class, 'ApiFolder02'),
        ];
        $existingIDs = $this->getIDs('existing');
        TestFile::$fail = $fail;
        $url = '/admin/assets/api/move';
        $headers = [];
        if ($fail !== 'csrf-token') {
            $headers = array_merge($headers, $this->getCsrfTokenheader());
        }
        $data = [];
        if ($fail !== 'folder-id-not-passed') {
            $data['folderID'] = $folderIDs[1];
        }
        if ($fail === 'folder-not-exist') {
            $data['folderID'] = Folder::get()->max('ID') + 1;
        }
        if ($fail !== 'ids-not-passed') {
            $data['ids'] = $ids;
        }
        if ($fail === 'ids-not-array') {
            $data['ids'] = implode(',', $ids);
        } elseif ($fail === 'ids-is-empty') {
            $data['ids'] = [];
        }
        $body = json_encode($data);
        $response = $this->mainSession->sendRequest('POST', $url, [], $headers, null, $body);
        $this->assertSame('application/json', $response->getHeader('Content-type'));
        $this->assertSame($expectedCode, $response->getStatusCode());
        if ($expectedCode >= 400) {
            foreach ($existingIDs as $id) {
                $file = TestFile::get()->byID($id);
                $this->assertSame($folderIDs[0], $file->ParentID);
            }
        } else {
            foreach ($existingIDs as $id) {
                $file = TestFile::get()->byID($id);
                $this->assertSame($folderIDs[1], $file->ParentID);
            }
        }
    }

    public static function provideApiPublish(): array
    {
        return [
            'Valid' => [
                'idsType' => 'existing',
                'fail' => '',
                'expectedCode' => 204,
            ],
            'Reject fail canPublish()' => [
                'idsType' => 'existing',
                'fail' => 'can-publish',
                'expectedCode' => 403,
            ],
            'Reject fail csrf-token' => [
                'idsType' => 'existing',
                'fail' => 'csrf-token',
                'expectedCode' => 400,
            ],
            'Reject ids not passed' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-passed',
                'expectedCode' => 400,
            ],
            'Reject ids is not array' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-array',
                'expectedCode' => 400,
            ],
            'Reject ids is empty' => [
                'idsType' => 'existing',
                'fail' => 'ids-is-empty',
                'expectedCode' => 400,
            ],
            'Reject invalid ID' => [
                'idsType' => 'second-is-invalid',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject non-numeric ID' => [
                'idsType' => 'second-is-non-numeric',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject new record ID' => [
                'idsType' => 'second-is-new-record',
                'fail' => '',
                'expectedCode' => 400,
            ],
        ];
    }

    #[DataProvider('provideApiPublish')]
    public function testApiPublish(
        string $idsType,
        string $fail,
        int $expectedCode
    ): void {
        $ids = $this->getIDs($idsType);
        $existingIDs = $this->getIDs('existing');
        try {
            TestFile::$fail = $fail;
            $url = '/admin/assets/api/publish';
            $headers = [];
            if ($fail !== 'csrf-token') {
                $headers = array_merge($headers, $this->getCsrfTokenheader());
            }
            $data = [];
            if ($fail !== 'ids-not-passed') {
                $data['ids'] = $ids;
            }
            if ($fail === 'ids-not-array') {
                $data['ids'] = implode(',', $ids);
            } elseif ($fail === 'ids-is-empty') {
                $data['ids'] = [];
            }
            $body = json_encode($data);
            $response = $this->mainSession->sendRequest('POST', $url, [], $headers, null, $body);
            $this->assertSame('application/json', $response->getHeader('Content-type'));
            $this->assertSame($expectedCode, $response->getStatusCode());
            if ($expectedCode >= 400) {
                foreach ($existingIDs as $id) {
                    $file = TestFile::get()->byID($id);
                    $this->assertFalse($file->isPublished());
                }
            } else {
                foreach ($existingIDs as $id) {
                    $file = TestFile::get()->byID($id);
                    $this->assertTrue($file->isPublished());
                }
            }
        } finally {
            // fixtures will remain published between tests, fixtures are normally unpublished
            foreach ($existingIDs as $id) {
                $file = TestFile::get()->byID($id);
                if ($file->isPublished()) {
                    $file->doUnpublish();
                }
            }
        }
    }

    public static function provideApiUnpublish(): array
    {
        return [
            'Valid' => [
                'idsType' => 'existing',
                'fail' => '',
                'expectedCode' => 204,
            ],
            'Reject fail canUnpublish()' => [
                'idsType' => 'existing',
                'fail' => 'can-unpublish',
                'expectedCode' => 403,
            ],
            'Reject fail csrf-token' => [
                'idsType' => 'existing',
                'fail' => 'csrf-token',
                'expectedCode' => 400,
            ],
            'Reject ids not passed' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-passed',
                'expectedCode' => 400,
            ],
            'Reject ids is not array' => [
                'idsType' => 'existing',
                'fail' => 'ids-not-array',
                'expectedCode' => 400,
            ],
            'Reject ids is empty' => [
                'idsType' => 'existing',
                'fail' => 'ids-is-empty',
                'expectedCode' => 400,
            ],
            'Reject invalid ID' => [
                'idsType' => 'second-is-invalid',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject non-numeric ID' => [
                'idsType' => 'second-is-non-numeric',
                'fail' => '',
                'expectedCode' => 400,
            ],
            'Reject new record ID' => [
                'idsType' => 'second-is-new-record',
                'fail' => '',
                'expectedCode' => 400,
            ],
        ];
    }

    #[DataProvider('provideApiUnpublish')]
    public function testApiUnpublish(
        string $idsType,
        string $fail,
        int $expectedCode
    ): void {
        $ids = $this->getIDs($idsType);
        $existingIDs = $this->getIDs('existing');
        foreach ($existingIDs as $id) {
            $file = TestFile::get()->byID($id);
            $file->publishSingle();
        }
        try {
            TestFile::$fail = $fail;
            $url = '/admin/assets/api/unpublish';
            $headers = [];
            if ($fail !== 'csrf-token') {
                $headers = array_merge($headers, $this->getCsrfTokenheader());
            }
            $data = [];
            if ($fail !== 'ids-not-passed') {
                $data['ids'] = $ids;
            }
            if ($fail === 'ids-not-array') {
                $data['ids'] = implode(',', $ids);
            } elseif ($fail === 'ids-is-empty') {
                $data['ids'] = [];
            }
            $body = json_encode($data);
            $response = $this->mainSession->sendRequest('POST', $url, [], $headers, null, $body);
            $this->assertSame('application/json', $response->getHeader('Content-type'));
            $this->assertSame($expectedCode, $response->getStatusCode());
            if ($expectedCode >= 400) {
                foreach ($existingIDs as $id) {
                    $file = TestFile::get()->byID($id);
                    $this->assertTrue($file->isPublished());
                }
            } else {
                foreach ($existingIDs as $id) {
                    $file = TestFile::get()->byID($id);
                    $this->assertFalse($file->isPublished());
                }
            }
        } finally {
            // fixtures will remain published between tests, fixtures are normally unpublished
            foreach ($existingIDs as $id) {
                $file = TestFile::get()->byID($id);
                if ($file->isPublished()) {
                    $file->doUnpublish();
                }
            }
        }
    }

    private function getFileFixtures(): array
    {
        return [
            $this->objFromFixture(TestFile::class, 'ApiTestFile01'),
            $this->objFromFixture(TestFile::class, 'ApiTestFile02'),
        ];
    }

    private function getID(string $idType): mixed
    {
        $objs = $this->getFileFixtures();
        return match ($idType) {
            'existing' => $objs[0]->ID,
            'invalid' => $objs[0]->ID + 99999,
            'non-numeric' => 'fish',
            'new-record' => 0,
        };
    }

    private function getIDs(string $idsType): mixed
    {
        $objs = $this->getFileFixtures();
        return match ($idsType) {
            'existing' => [$objs[0]->ID, $objs[1]->ID],
            'second-is-invalid' => [$objs[0]->ID, $objs[1]->ID + 99999],
            'second-is-non-numeric' => [$objs[0]->ID, 'fish'],
            'second-is-new-record' => [$objs[0]->ID, 0],
            'ids-is-not-passed' => [],
        };
    }

    private function getCsrfTokenheader(): array
    {
        $securityToken = SecurityToken::inst();
        return [
            'X-' . $securityToken->getName() => $securityToken->getSecurityID()
        ];
    }
}
