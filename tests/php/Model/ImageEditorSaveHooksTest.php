<?php

namespace SilverStripe\AssetAdmin\Tests\Model;

use GdImage;
use SilverStripe\AssetAdmin\Model\ImageEditor;
use SilverStripe\AssetAdmin\Tests\Model\ImageEditorTest\SaveHookExtension;
use SilverStripe\Assets\Image;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Dev\SapphireTest;

/**
 * The four extension hooks bracketing the pipeline's two writes. Apart from ImageEditorTest because
 * the extension substitutes the written bytes, which every test in that class needs to be the render.
 */
class ImageEditorSaveHooksTest extends SapphireTest
{
    protected $usesDatabase = true;

    protected static $required_extensions = [
        ImageEditor::class => [SaveHookExtension::class],
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->logInWithPermission('ADMIN');
        TestAssetStore::activate('ImageEditorSaveHooksTest');
        SaveHookExtension::reset();
    }

    protected function tearDown(): void
    {
        SaveHookExtension::reset();
        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testHooksFireInPipelineOrderAroundTheirWrites(): void
    {
        $source = $this->createImage('ImageEditorSaveHooksTest/photo.png');
        $sourceId = $source->ID;

        ImageEditor::create()->editImage($source, $this->quarterTurn(true));

        $calls = SaveHookExtension::$calls;
        // The backup is written first, so its pair runs first, and each pair brackets its own write.
        $this->assertSame([
            'onBeforeCreateBackup',
            'onAfterCreateBackup',
            'onBeforeReplaceOriginal',
            'onAfterReplaceOriginal',
        ], array_column($calls, 'hook'));
        foreach ($calls as $call) {
            $this->assertSame($sourceId, $call['sourceId']);
        }
        // The transforms reach both halves normalised, as the render used them.
        $this->assertSame(90, $calls[2]['rotate']);
        $this->assertSame(90, $calls[3]['rotate']);
    }

    public function testOnlyTheAfterHookSeesTheSettledBackupRecord(): void
    {
        $source = $this->createImage('ImageEditorSaveHooksTest/photo.png');

        ImageEditor::create()->editImage($source, $this->quarterTurn(true));

        [$before, $after] = SaveHookExtension::$calls;
        // The de-duplicating rename runs inside File::onBeforeWrite(), so nothing has settled yet.
        $this->assertSame(0, $before['backupId']);
        $this->assertSame('photo.png', $before['backupName']);
        // Only afterwards is the name the author will actually see readable.
        $this->assertNotSame(0, $after['backupId']);
        $this->assertSame('photo-v2.png', $after['backupName']);
    }

    public function testTheBeforeHookReadsTheRenderedBytesOffTheUnwrittenRecord(): void
    {
        $source = $this->createImage('ImageEditorSaveHooksTest/photo.png');
        $preEditBytes = (string) $source->getString();

        ImageEditor::create()->editImage($source, $this->quarterTurn(true));

        [, , $before, $after] = SaveHookExtension::$calls;
        // The record carries the real render before it is written, not the pre-edit bytes.
        $this->assertStringStartsWith("\x89PNG", $before['renderedBytes']);
        $this->assertNotSame($preEditBytes, $before['renderedBytes']);
        // By the after hook the write has happened, so the record carries what the before hook left.
        $this->assertSame(SaveHookExtension::REPLACEMENT_BYTES, $after['storedBytes']);
    }

    public function testExtensionCanSubstituteTheBytesThatGetWritten(): void
    {
        $source = $this->createImage('ImageEditorSaveHooksTest/photo.png');

        ImageEditor::create()->editImage($source, $this->quarterTurn(true));

        // Whatever the hook leaves behind is what lands on the record.
        $reloaded = Image::get()->byID($source->ID);
        $this->assertSame(SaveHookExtension::REPLACEMENT_BYTES, (string) $reloaded->getString());
    }

    public function testExtensionCanChangeTheBackupBeforeItIsWritten(): void
    {
        $source = $this->createImage('ImageEditorSaveHooksTest/photo.png');

        $result = ImageEditor::create()->editImage($source, $this->quarterTurn(true));

        $backup = Image::get()->filter('Name', $result->getBackupFilename())->first();
        $this->assertNotNull($backup);
        $this->assertSame(SaveHookExtension::BACKUP_TITLE, $backup->Title);
    }

    public function testBackupHooksDoNotFireWhenTheBackupIsDeclined(): void
    {
        $source = $this->createImage('ImageEditorSaveHooksTest/photo.png');

        ImageEditor::create()->editImage($source, $this->quarterTurn(false));

        // Declining the backup means there is no write for the pair to bracket, so neither is
        // called at all rather than called with a flag saying "no backup".
        $this->assertSame(
            ['onBeforeReplaceOriginal', 'onAfterReplaceOriginal'],
            array_column(SaveHookExtension::$calls, 'hook')
        );
    }

    private function quarterTurn(bool $backupOriginal): array
    {
        return [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 90,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
            'backupOriginal' => $backupOriginal,
        ];
    }

    private function createImage(string $filename): Image
    {
        $gd = imagecreatetruecolor(4, 2);
        imagefilledrectangle($gd, 0, 0, 3, 1, imagecolorallocate($gd, 20, 40, 60));
        return $this->writeImage($gd, $filename);
    }

    private function writeImage(GdImage $gd, string $filename): Image
    {
        ob_start();
        imagepng($gd);
        $bytes = (string) ob_get_clean();

        $image = new Image();
        $image->setFromString($bytes, $filename);
        $image->write();
        return $image;
    }
}
