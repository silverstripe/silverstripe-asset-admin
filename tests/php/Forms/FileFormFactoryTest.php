<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use GdImage;
use ReflectionMethod;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Tests\Controller\AssetAdminImageEditTest\PermissionExtension;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\FormAction;
use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Covers the getEditImageAction() convenience gate on {@see FileFormFactory}: it offers the
 * "editimage" action only for an editable, creatable raster Image, and returns null otherwise.
 */
class FileFormFactoryTest extends SapphireTest
{
    protected $usesDatabase = true;

    protected function setUp(): void
    {
        parent::setUp();
        TestAssetStore::activate('FileFormFactoryTest');
        $this->logInWithPermission('ADMIN');
        // Reuse the endpoint test's helper so named fixtures can veto edit/create.
        Image::add_extension(PermissionExtension::class);
    }

    protected function tearDown(): void
    {
        Image::remove_extension(PermissionExtension::class);
        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testReturnsEditImageActionForEditableCreatableRasterImage(): void
    {
        $image = $this->createImage('editable.png');

        $action = $this->getEditImageAction($image);

        $this->assertInstanceOf(FormAction::class, $action);
        $this->assertSame('editimage', $action->actionName());
    }

    public static function provideReturnsNull(): array
    {
        return [
            'non-image file' => ['scenario' => 'non-image'],
            'image the member cannot edit' => ['scenario' => 'noedit'],
            'folder the member cannot create in' => ['scenario' => 'nocreate'],
            'record not in the database' => ['scenario' => 'unsaved'],
        ];
    }

    #[DataProvider('provideReturnsNull')]
    public function testReturnsNull(string $scenario): void
    {
        $record = $this->makeRecord($scenario);

        $this->assertNull($this->getEditImageAction($record));
    }

    private function makeRecord(string $scenario): File
    {
        switch ($scenario) {
            case 'non-image':
                $file = new File();
                $file->setFromString('not an image', 'notes.txt');
                $file->write();
                return $file;
            case 'noedit':
                return $this->createImage('noedit.png');
            case 'nocreate':
                Folder::find_or_make('noCreateFolder');
                return $this->createImage('noCreateFolder/child.png');
            case 'unsaved':
            default:
                return new Image();
        }
    }

    private function getEditImageAction(File $record): ?FormAction
    {
        $factory = new FileFormFactory();
        $method = new ReflectionMethod($factory, 'getEditImageAction');
        return $method->invoke($factory, $record);
    }

    private function createImage(string $filename): Image
    {
        $gd = imagecreatetruecolor(4, 4);
        imagefilledrectangle($gd, 0, 0, 3, 3, imagecolorallocate($gd, 30, 60, 90));
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
