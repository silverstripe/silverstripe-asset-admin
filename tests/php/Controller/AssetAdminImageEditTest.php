<?php

namespace SilverStripe\AssetAdmin\Tests\Controller;

use GdImage;
use Psr\SimpleCache\CacheInterface;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Model\ImageEditor;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminImageEditTest\PermissionExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Injector\Injector;
use PHPUnit\Framework\Attributes\DataProvider;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;
use Symfony\Component\Cache\Adapter\ArrayAdapter;
use Symfony\Component\Cache\Psr16Cache;

/**
 * Tests the api/editImage endpoint on {@see \SilverStripe\AssetAdmin\Controller\AssetAdmin}.
 */
class AssetAdminImageEditTest extends FunctionalTest
{
    protected $usesDatabase = true;

    protected function setUp(): void
    {
        parent::setUp();
        TestAssetStore::activate('AssetAdminImageEditTest');
        $this->logInWithPermission('ADMIN');
        Image::add_extension(PermissionExtension::class);

        SecurityToken::enable();
        $this->mainSession->session()->set('SecurityID', SecurityToken::inst()->getValue());
    }

    protected function tearDown(): void
    {
        Image::remove_extension(PermissionExtension::class);
        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testEditImageReplacesTheOriginalAndBacksItUp(): void
    {
        $source = $this->createImage('editme.png', 4, 2);
        $originalHash = $source->getHash();
        $originalBytes = (string) $source->getString();

        $response = $this->editImage([
            'fileId' => $source->ID,
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 90,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody() ?? '', true);
        // The file object stays at the top level and describes the record that was sent, now updated.
        $this->assertSame($source->ID, $data['id']);
        $this->assertSame('editme.png', $data['name']);
        $this->assertSame('editme-v2.png', $data['backupFilename']);

        $reloaded = Image::get()->byID($source->ID);
        $this->assertNotSame($originalHash, $reloaded->getHash());
        $this->assertFalse($reloaded->isPublished());

        $backup = Image::get()->filter('Name', 'editme-v2.png')->first();
        $this->assertNotNull($backup);
        $this->assertSame($originalBytes, (string) $backup->getString());
        $this->assertFalse($backup->isPublished());
    }

    public function testEditImageReportsANullBackupFilenameWhenDeclined(): void
    {
        $source = $this->createImage('nobackup.png');
        $payload = $this->validPayload($source->ID);
        $payload['backupOriginal'] = false;

        $response = $this->editImage($payload);

        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody() ?? '', true);
        // The key is always present; null and absent must not be two ways of saying the same thing.
        $this->assertArrayHasKey('backupFilename', $data);
        $this->assertNull($data['backupFilename']);
        $this->assertSame(1, Image::get()->count());
    }

    public function testClientConfigCarriesTheConfiguredBackupDefault(): void
    {
        Config::modify()->set(ImageEditor::class, 'backup_original_by_default', false);
        $config = AssetAdmin::singleton()->getClientConfig();
        // A configured false must arrive at the client as false, not as an absent value.
        $this->assertFalse($config['backupOriginalByDefault']);

        Config::modify()->set(ImageEditor::class, 'backup_original_by_default', true);
        $this->assertTrue(AssetAdmin::singleton()->getClientConfig()['backupOriginalByDefault']);
    }

    public function testRejectsMissingCsrfToken(): void
    {
        $source = $this->createImage('csrf.png');
        $response = $this->editImage($this->validPayload($source->ID), false);
        $this->assertSame(400, $response->getStatusCode());
    }

    public function testRejectsMissingFileId(): void
    {
        $response = $this->editImage([
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ]);
        $this->assertSame(400, $response->getStatusCode());
    }

    public function testRejectsUnknownFile(): void
    {
        $response = $this->editImage($this->validPayload(999999));
        $this->assertSame(404, $response->getStatusCode());
    }

    public function testRejectsNonRasterFile(): void
    {
        $file = new File();
        $file->setFromString('not an image', 'notes.txt');
        $file->write();

        $response = $this->editImage($this->validPayload($file->ID));
        $this->assertSame(422, $response->getStatusCode());
        $this->assertSame(0, Image::get()->exclude('ID', $file->ID)->count());
    }

    public function testRejectsInvalidPayload(): void
    {
        $source = $this->createImage('invalid.png');
        $payload = $this->validPayload($source->ID);
        $payload['rotate'] = 45;

        $response = $this->editImage($payload);
        $this->assertSame(400, $response->getStatusCode());
    }

    public function testEditImageResizesToTheRequestedDimension(): void
    {
        $source = $this->createImage('resizeme.png', 8, 4);
        $payload = $this->validPayload($source->ID);
        // Only the typed dimension is sent; the endpoint derives the other from the crop ratio.
        $payload['resize'] = ['width' => 4];

        $response = $this->editImage($payload);

        $this->assertSame(200, $response->getStatusCode());
        $reloaded = Image::get()->byID($source->ID);
        $this->assertSame(4, (int) $reloaded->getWidth());
        $this->assertSame(2, (int) $reloaded->getHeight());
    }

    public function testRejectsUpsizePostedDirectlyToTheEndpoint(): void
    {
        // A raw request bypasses the UI, so the endpoint refuses an upsize on its own.
        $source = $this->createImage('upsize.png', 8, 4);
        $payload = $this->validPayload($source->ID);
        $payload['resize'] = ['width' => 20];
        $originalHash = $source->getHash();

        $response = $this->editImage($payload);

        $this->assertSame(400, $response->getStatusCode());
        $data = json_decode($response->getBody() ?? '', true);
        $this->assertSame('Cannot be larger than the cropped image (8 x 4)', $data['errors'][0]['value']);
        // Nothing was written - no backup copy, and the original still holds its own bytes.
        $this->assertSame($originalHash, Image::get()->byID($source->ID)->getHash());
        $this->assertSame(1, Image::get()->count());
    }

    public static function provideRejectsInvalidResizePayload(): array
    {
        return [
            'both dimensions at once' => [['width' => 4, 'height' => 2]],
            'zero' => [['width' => 0]],
            'negative' => [['width' => -4]],
            'fractional' => [['width' => 2.5]],
            'non-numeric' => [['width' => 'wide']],
            'boolean' => [['width' => true]],
            'not an object' => ['4'],
        ];
    }

    #[DataProvider('provideRejectsInvalidResizePayload')]
    public function testRejectsInvalidResizePayload(mixed $resize): void
    {
        // A clean 400, never the 500 an unguarded dimension would raise from the image backend.
        $source = $this->createImage('badresize.png', 8, 4);
        $payload = $this->validPayload($source->ID);
        $payload['resize'] = $resize;

        $response = $this->editImage($payload);

        $this->assertSame(400, $response->getStatusCode());
    }

    public function testRejectsDuplicateInFlightSubmit(): void
    {
        $source = $this->createImage('inflight.png');
        $member = Security::getCurrentUser();

        // Director::test runs the nested request against a clone of this injector, hence the shared cache.
        $cache = new Psr16Cache(new ArrayAdapter());
        Injector::inst()->registerService($cache, CacheInterface::class . '.assetAdminImageEditor');
        $cache->set('edit-' . $member->ID . '-' . $source->ID, true, 30);

        $response = $this->editImage($this->validPayload($source->ID));
        $this->assertSame(409, $response->getStatusCode());
    }

    public function testReturnsRenderFailureAsMappedError(): void
    {
        // An over-large source makes guardSourceSize() throw the RuntimeException mapped to 422.
        Config::modify()->set(ImageEditor::class, 'max_source_megapixels', 1);
        $source = $this->createImage('oversize.png', 1200, 1000);

        $response = $this->editImage($this->validPayload($source->ID));

        $this->assertSame(422, $response->getStatusCode());
        $data = json_decode($response->getBody() ?? '', true);
        $this->assertSame('Exceeds 1 megapixel (width x height) limit', $data['errors'][0]['value']);
        // Nothing was written - no backup copy, and the original is untouched.
        $this->assertSame(0, Image::get()->exclude('ID', $source->ID)->count());
    }

    public function testReleasesInFlightLockAfterEdit(): void
    {
        $source = $this->createImage('lockrelease.png');
        $member = Security::getCurrentUser();

        // A shared cache across both nested requests, so an undeleted lock would 409 the second.
        $cache = new Psr16Cache(new ArrayAdapter());
        Injector::inst()->registerService($cache, CacheInterface::class . '.assetAdminImageEditor');

        $first = $this->editImage($this->validPayload($source->ID));
        $this->assertSame(200, $first->getStatusCode());

        $second = $this->editImage($this->validPayload($source->ID));
        $this->assertSame(200, $second->getStatusCode());

        // The lock key was released, not left behind.
        $this->assertFalse((bool) $cache->get('edit-' . $member->ID . '-' . $source->ID));
    }

    public function testRejectsWithoutEditPermission(): void
    {
        // The edit replaces the original's bytes, so canView() is no longer enough.
        $source = $this->createImage('noedit.png');
        $response = $this->editImage($this->validPayload($source->ID));
        $this->assertSame(403, $response->getStatusCode());
    }

    public static function provideCreatePermissionGatedOnTheBackup(): array
    {
        return [
            'backup requested' => ['backupOriginal' => true, 'defaultsToBackup' => true, 'expectedCode' => 403],
            'backup left to a default of on' => ['backupOriginal' => null, 'defaultsToBackup' => true, 'expectedCode' => 403],
            'backup declined' => ['backupOriginal' => false, 'defaultsToBackup' => true, 'expectedCode' => 200],
            'backup left to a default of off' => ['backupOriginal' => null, 'defaultsToBackup' => false, 'expectedCode' => 200],
        ];
    }

    #[DataProvider('provideCreatePermissionGatedOnTheBackup')]
    public function testCreatePermissionGatedOnTheBackup(?bool $backupOriginal, bool $defaultsToBackup, int $expectedCode): void
    {
        Config::modify()->set(ImageEditor::class, 'backup_original_by_default', $defaultsToBackup);
        Folder::find_or_make('noCreateFolder');
        $source = $this->createImage('noCreateFolder/child.png');
        $payload = $this->validPayload($source->ID);
        if ($backupOriginal !== null) {
            $payload['backupOriginal'] = $backupOriginal;
        }

        $response = $this->editImage($payload);

        $this->assertSame($expectedCode, $response->getStatusCode());
    }

    private function validPayload(int $fileId): array
    {
        return [
            'fileId' => $fileId,
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ];
    }

    private function editImage(array $data, bool $withToken = true)
    {
        $headers = ['Content-Type' => 'application/json'];
        if ($withToken) {
            $token = SecurityToken::inst();
            $headers['X-' . $token->getName()] = $token->getSecurityID();
        }
        return $this->mainSession->sendRequest(
            'POST',
            'admin/assets/api/editImage',
            [],
            $headers,
            null,
            json_encode($data)
        );
    }

    private function createImage(string $filename, int $width = 4, int $height = 4): Image
    {
        $gd = imagecreatetruecolor($width, $height);
        imagefilledrectangle($gd, 0, 0, $width - 1, $height - 1, imagecolorallocate($gd, 30, 60, 90));
        $bytes = $this->encode($gd);

        $image = new Image();
        $image->setFromString($bytes, $filename);
        $image->write();
        return $image;
    }

    private function encode(GdImage $gd): string
    {
        ob_start();
        imagepng($gd);
        return (string) ob_get_clean();
    }
}
