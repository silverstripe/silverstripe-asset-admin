<?php

namespace SilverStripe\AssetAdmin\Tests\Model;

use GdImage;
use InvalidArgumentException;
use RuntimeException;
use SilverStripe\AssetAdmin\Model\ImageEditor;
use SilverStripe\Assets\Image;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Versioned\Versioned;
use PHPUnit\Framework\Attributes\DataProvider;

class ImageEditorTest extends SapphireTest
{
    protected $usesDatabase = true;

    private const RED = [255, 0, 0];

    private const GREEN = [0, 255, 0];

    private const BLUE = [0, 0, 255];

    private const WHITE = [255, 255, 255];

    protected function setUp(): void
    {
        parent::setUp();
        $this->logInWithPermission('ADMIN');
        TestAssetStore::activate('ImageEditorTest');
    }

    protected function tearDown(): void
    {
        TestAssetStore::reset();
        parent::tearDown();
    }

    public static function provideTransformCorners(): array
    {
        $full = ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0];
        return [
            'no transform' => [
                'transforms' => ['flip' => ['horizontal' => false, 'vertical' => false], 'rotate' => 0, 'crop' => $full],
                'expected' => [ImageEditorTest::RED, ImageEditorTest::GREEN, ImageEditorTest::BLUE, ImageEditorTest::WHITE],
            ],
            'flip horizontal' => [
                'transforms' => ['flip' => ['horizontal' => true, 'vertical' => false], 'rotate' => 0, 'crop' => $full],
                'expected' => [ImageEditorTest::GREEN, ImageEditorTest::RED, ImageEditorTest::WHITE, ImageEditorTest::BLUE],
            ],
            'flip vertical' => [
                'transforms' => ['flip' => ['horizontal' => false, 'vertical' => true], 'rotate' => 0, 'crop' => $full],
                'expected' => [ImageEditorTest::BLUE, ImageEditorTest::WHITE, ImageEditorTest::RED, ImageEditorTest::GREEN],
            ],
            'rotate 90 clockwise' => [
                'transforms' => ['flip' => ['horizontal' => false, 'vertical' => false], 'rotate' => 90, 'crop' => $full],
                'expected' => [ImageEditorTest::BLUE, ImageEditorTest::RED, ImageEditorTest::WHITE, ImageEditorTest::GREEN],
            ],
            'rotate 180' => [
                'transforms' => ['flip' => ['horizontal' => false, 'vertical' => false], 'rotate' => 180, 'crop' => $full],
                'expected' => [ImageEditorTest::WHITE, ImageEditorTest::BLUE, ImageEditorTest::GREEN, ImageEditorTest::RED],
            ],
            'rotate 270 clockwise' => [
                'transforms' => ['flip' => ['horizontal' => false, 'vertical' => false], 'rotate' => 270, 'crop' => $full],
                'expected' => [ImageEditorTest::GREEN, ImageEditorTest::WHITE, ImageEditorTest::RED, ImageEditorTest::BLUE],
            ],
        ];
    }

    #[DataProvider('provideTransformCorners')]
    public function testTransformCorners(array $transforms, array $expected): void
    {
        $source = $this->createCornerImage(2, 2, 'corners.png');
        $result = ImageEditor::create()->editImage($source, $transforms);

        $gd = $this->decode($result->getImage());
        $this->assertSame(2, imagesx($gd));
        $this->assertSame(2, imagesy($gd));
        $this->assertSame($expected[0], $this->colourAt($gd, 0, 0));
        $this->assertSame($expected[1], $this->colourAt($gd, 1, 0));
        $this->assertSame($expected[2], $this->colourAt($gd, 0, 1));
        $this->assertSame($expected[3], $this->colourAt($gd, 1, 1));
    }

    public static function provideRotateSwapsDimensions(): array
    {
        return [
            'rotate 0 keeps dimensions' => ['rotate' => 0, 'width' => 4, 'height' => 2],
            'rotate 90 swaps dimensions' => ['rotate' => 90, 'width' => 2, 'height' => 4],
            'rotate 180 keeps dimensions' => ['rotate' => 180, 'width' => 4, 'height' => 2],
            'rotate 270 swaps dimensions' => ['rotate' => 270, 'width' => 2, 'height' => 4],
        ];
    }

    #[DataProvider('provideRotateSwapsDimensions')]
    public function testRotateSwapsDimensions(int $rotate, int $width, int $height): void
    {
        $source = $this->createCornerImage(4, 2, 'landscape.png');
        $result = ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => $rotate,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ]);

        $gd = $this->decode($result->getImage());
        $this->assertSame($width, imagesx($gd));
        $this->assertSame($height, imagesy($gd));
    }

    public function testCropReducesToSelectedRegion(): void
    {
        $source = $this->createCornerImage(4, 4, 'crop.png');
        $result = ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            // Top-left quarter of the working image.
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 0.5, 'height' => 0.5],
        ]);

        $gd = $this->decode($result->getImage());
        $this->assertSame(2, imagesx($gd));
        $this->assertSame(2, imagesy($gd));
        // The original top-left corner pixel survives at the output top-left.
        $this->assertSame(ImageEditorTest::RED, $this->colourAt($gd, 0, 0));
    }

    public function testAcceptsEdgeFlushCropWithinEpsilon(): void
    {
        $source = $this->createCornerImage(2, 2, 'flush.png');
        $result = ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            // An edge-flush box mirrored client-side can float a hair negative, within the epsilon.
            'crop' => ['x' => -0.00004, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ]);

        $gd = $this->decode($result->getImage());
        $this->assertSame(2, imagesx($gd));
        $this->assertSame(2, imagesy($gd));
        $this->assertSame(ImageEditorTest::RED, $this->colourAt($gd, 0, 0));
    }

    public function testReplacesOriginalInPlace(): void
    {
        $source = $this->createCornerImage(4, 2, 'ImageEditorTest/photo.png');
        $sourceId = $source->ID;
        $originalHash = $source->getHash();

        $result = ImageEditor::create()->editImage($source, $this->quarterTurn());

        // The same record, so every existing reference to it now resolves to the edited pixels.
        $this->assertSame($sourceId, $result->getImage()->ID);

        $reloaded = Image::get()->byID($sourceId);
        $this->assertSame('photo.png', $reloaded->Name);
        $this->assertNotSame($originalHash, $reloaded->getHash());
        // The rotate swapped the axes on the record itself.
        $this->assertSame(2, (int) $reloaded->getWidth());
        $this->assertSame(4, (int) $reloaded->getHeight());
    }

    public function testBackupCarriesItsOwnCopyOfThePreEditBytes(): void
    {
        $source = $this->createCornerImage(4, 2, 'ImageEditorTest/photo.png');
        $originalBytes = (string) $source->getString();

        $result = ImageEditor::create()->editImage($source, $this->quarterTurn());

        // Silverstripe's own name generator supplies "-v2"; the feature has no suffix scheme.
        $this->assertSame('photo-v2.png', $result->getBackupFilename());

        $backup = Image::get()->filter('Name', 'photo-v2.png')->first();
        $this->assertNotNull($backup);
        $this->assertSame((int) $source->ParentID, (int) $backup->ParentID);
        // The title follows the name, so the backup is distinguishable in the CMS file list.
        $this->assertSame('photo v2', $backup->Title);
        // A bare duplicate() would leave the backup pointing at the asset just overwritten.
        $this->assertSame($originalBytes, (string) $backup->getString());
        $this->assertNotSame(Image::get()->byID($source->ID)->getHash(), $backup->getHash());
        // Draft only: the backup is never auto-published.
        $this->assertTrue($backup->isOnDraftOnly());
        $this->assertFalse($backup->isPublished());
    }

    public function testSuccessiveBackupsFollowThePlatformVersionNaming(): void
    {
        $source = $this->createCornerImage(4, 2, 'ImageEditorTest/photo.png');

        $first = ImageEditor::create()->editImage($source, $this->quarterTurn());
        $second = ImageEditor::create()->editImage($source, $this->quarterTurn());

        $this->assertSame('photo-v2.png', $first->getBackupFilename());
        $this->assertSame('photo-v3.png', $second->getBackupFilename());
    }

    public function testDoesNotPublishTheReplacementOrTheBackup(): void
    {
        $source = $this->createCornerImage(4, 2, 'ImageEditorTest/published.png');
        $source->publishSingle();
        $publishedHash = $source->getHash();

        ImageEditor::create()->editImage($source, $this->quarterTurn());

        $draft = Versioned::get_by_stage(Image::class, Versioned::DRAFT)->byID($source->ID);
        $live = Versioned::get_by_stage(Image::class, Versioned::LIVE)->byID($source->ID);
        // The replacement lands as a new draft version; the published version keeps the old pixels.
        $this->assertNotSame($publishedHash, $draft->getHash());
        $this->assertSame($publishedHash, $live->getHash());
        $this->assertTrue($draft->stagesDiffer());

        $backup = Image::get()->filter('Name', 'published-v2.png')->first();
        $this->assertNotNull($backup);
        $this->assertFalse($backup->isPublished());
    }

    public static function provideBackupChoice(): array
    {
        return [
            'flag on writes a backup' => ['backupOriginal' => true, 'configDefault' => false, 'expectBackup' => true],
            'flag off writes none' => ['backupOriginal' => false, 'configDefault' => true, 'expectBackup' => false],
            'absent flag follows a true default' => ['backupOriginal' => null, 'configDefault' => true, 'expectBackup' => true],
            'absent flag follows a false default' => ['backupOriginal' => null, 'configDefault' => false, 'expectBackup' => false],
        ];
    }

    #[DataProvider('provideBackupChoice')]
    public function testBackupChoice(?bool $backupOriginal, bool $configDefault, bool $expectBackup): void
    {
        ImageEditor::config()->set('backup_original_by_default', $configDefault);
        $source = $this->createCornerImage(4, 2, 'ImageEditorTest/choice.png');

        $transforms = $this->quarterTurn();
        if ($backupOriginal !== null) {
            $transforms['backupOriginal'] = $backupOriginal;
        }
        $result = ImageEditor::create()->editImage($source, $transforms);

        if ($expectBackup) {
            $this->assertSame('choice-v2.png', $result->getBackupFilename());
        } else {
            $this->assertNull($result->getBackupFilename());
        }
        $this->assertSame($expectBackup ? 2 : 1, Image::get()->count());
    }

    public function testReplacesRootLevelImageInPlace(): void
    {
        // A source at the assets root has no parent folder, so the backup lands there with ParentID 0.
        $source = $this->createCornerImage(4, 2, 'rootphoto.png');
        $this->assertSame(0, (int) $source->ParentID);
        $this->assertFalse($source->Parent()->exists());

        $result = ImageEditor::create()->editImage($source, $this->quarterTurn());

        $this->assertSame($source->ID, $result->getImage()->ID);
        // Writing the backup must not rename the record it was copied from.
        $this->assertSame('rootphoto.png', Image::get()->byID($source->ID)->Name);
        $this->assertSame('rootphoto-v2.png', $result->getBackupFilename());
        $backup = Image::get()->filter('Name', 'rootphoto-v2.png')->first();
        $this->assertNotNull($backup);
        $this->assertSame(0, (int) $backup->ParentID);
    }

    public function testRefusesOversizeSource(): void
    {
        ImageEditor::config()->set('max_source_megapixels', 1);
        $source = $this->createSolidImage(1200, 1000, 'oversize.png');

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Exceeds 1 megapixel (width x height) limit');
        ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ]);
    }

    public function testAllowsSourceWhenMegapixelLimitDisabled(): void
    {
        ImageEditor::config()->set('max_source_megapixels', 0);
        $source = $this->createSolidImage(1200, 1000, 'unlimited.png');

        $result = ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ]);

        $this->assertTrue($result->getImage()->exists());
    }

    public function testOutputQualityConfigChangesTheEncodedBytes(): void
    {
        ImageEditor::config()->set('output_quality', 10);
        $low = ImageEditor::create()->editImage($this->createNoisyJpeg('lowquality.jpg'), $this->quarterTurn());
        $lowSize = strlen((string) $low->getImage()->getString());

        ImageEditor::config()->set('output_quality', 95);
        $high = ImageEditor::create()->editImage($this->createNoisyJpeg('highquality.jpg'), $this->quarterTurn());

        $this->assertLessThan(strlen((string) $high->getImage()->getString()), $lowSize);
    }

    public static function provideRejectsOutOfRangeOutputQuality(): array
    {
        return [
            'below the floor' => ['quality' => 0],
            'above the ceiling' => ['quality' => 101],
        ];
    }

    #[DataProvider('provideRejectsOutOfRangeOutputQuality')]
    public function testRejectsOutOfRangeOutputQuality(int $quality): void
    {
        ImageEditor::config()->set('output_quality', $quality);
        $source = $this->createCornerImage(2, 2, 'badquality.png');

        $this->expectException(InvalidArgumentException::class);
        ImageEditor::create()->editImage($source, $this->quarterTurn());
    }

    public static function provideResizeDerivesTheCounterpartDimension(): array
    {
        return [
            // The 8x4 source is a 2:1 crop output, so the counterpart follows the locked ratio.
            'width halves the height' => ['resize' => ['width' => 4], 'width' => 4, 'height' => 2],
            'height doubles into the width' => ['resize' => ['height' => 1], 'width' => 2, 'height' => 1],
            // An odd width rounds the derived height half away from zero, matching the frontend.
            'odd width rounds the derived height' => ['resize' => ['width' => 5], 'width' => 5, 'height' => 3],
            // The floor is one pixel, never zero, however aggressive the shrink.
            'derived dimension never falls below 1px' => ['resize' => ['width' => 1], 'width' => 1, 'height' => 1],
            'resize to the crop output is a no-op' => ['resize' => ['width' => 8], 'width' => 8, 'height' => 4],
        ];
    }

    #[DataProvider('provideResizeDerivesTheCounterpartDimension')]
    public function testResizeDerivesTheCounterpartDimension(array $resize, int $width, int $height): void
    {
        $source = $this->createCornerImage(8, 4, 'resize.png');
        $result = ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
            'resize' => $resize,
        ]);

        $gd = $this->decode($result->getImage());
        $this->assertSame($width, imagesx($gd));
        $this->assertSame($height, imagesy($gd));
    }

    public function testResizeAppliesToTheCropOutputNotTheSource(): void
    {
        // Resizing the 4x4 crop of an 8x4 source: run before the crop, the framing would shift.
        $source = $this->createCornerImage(8, 4, 'resizecrop.png');
        $result = ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 0.5, 'height' => 1.0],
            'resize' => ['width' => 2],
        ]);

        $gd = $this->decode($result->getImage());
        $this->assertSame(2, imagesx($gd));
        $this->assertSame(2, imagesy($gd));
    }

    public function testResizeCeilingFollowsTheRotatedAxes(): void
    {
        // A quarter-turn swaps the axes, so the ceiling for a width is the source's *height*.
        $source = $this->createCornerImage(8, 4, 'rotatedceiling.png');
        $transforms = [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 90,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
            'resize' => ['width' => 6],
        ];

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Cannot be larger than the cropped image (4 x 8)');
        ImageEditor::create()->editImage($source, $transforms);
    }

    public function testResizeCeilingIsTheCropOutput(): void
    {
        // The crop yields a 4x4 box, so 5px is an upsize even though the source is 8px wide.
        $source = $this->createCornerImage(8, 4, 'cropceiling.png');

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Cannot be larger than the cropped image (4 x 4)');
        ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 0.5, 'height' => 1.0],
            'resize' => ['width' => 5],
        ]);
    }

    public static function provideRejectsInvalidResize(): array
    {
        return [
            'both dimensions at once' => [['width' => 2, 'height' => 1]],
            'neither dimension' => [[]],
            'not an array' => ['200'],
            'zero' => [['width' => 0]],
            'negative' => [['width' => -2]],
            'fractional' => [['width' => 2.5]],
            'non-numeric' => [['width' => 'wide']],
            'boolean' => [['width' => true]],
            'larger than the crop output' => [['height' => 5]],
        ];
    }

    #[DataProvider('provideRejectsInvalidResize')]
    public function testRejectsInvalidResize(mixed $resize): void
    {
        $source = $this->createCornerImage(8, 4, 'badresize.png');

        // A rejected request, never a value passed through to the image backend's own geometry failure.
        $this->expectException(InvalidArgumentException::class);
        ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
            'resize' => $resize,
        ]);
    }

    public function testAbsentResizeKeepsTheCropOutputSize(): void
    {
        $source = $this->createCornerImage(8, 4, 'noresize.png');
        $result = ImageEditor::create()->editImage($source, [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 0,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 0.5, 'height' => 1.0],
        ]);

        $gd = $this->decode($result->getImage());
        $this->assertSame(4, imagesx($gd));
        $this->assertSame(4, imagesy($gd));
    }

    public static function provideRejectsInvalidTransforms(): array
    {
        $full = ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0];
        $flip = ['horizontal' => false, 'vertical' => false];
        return [
            'rotate not a right angle' => [
                ['flip' => $flip, 'rotate' => 45, 'crop' => $full],
            ],
            'rotate not numeric' => [
                ['flip' => $flip, 'rotate' => 'ninety', 'crop' => $full],
            ],
            'flip not an array' => [
                ['flip' => 'yes', 'rotate' => 0, 'crop' => $full],
            ],
            'crop not an array' => [
                ['flip' => $flip, 'rotate' => 0, 'crop' => 'all'],
            ],
            'crop missing key' => [
                ['flip' => $flip, 'rotate' => 0, 'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0]],
            ],
            'crop zero width' => [
                ['flip' => $flip, 'rotate' => 0, 'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 0.0, 'height' => 0.5]],
            ],
            'crop negative offset' => [
                ['flip' => $flip, 'rotate' => 0, 'crop' => ['x' => -0.1, 'y' => 0.0, 'width' => 0.5, 'height' => 0.5]],
            ],
            'crop overflows frame' => [
                ['flip' => $flip, 'rotate' => 0, 'crop' => ['x' => 0.6, 'y' => 0.0, 'width' => 0.6, 'height' => 0.5]],
            ],
        ];
    }

    #[DataProvider('provideRejectsInvalidTransforms')]
    public function testRejectsInvalidTransforms(array $transforms): void
    {
        $source = $this->createCornerImage(2, 2, 'invalid.png');

        $this->expectException(InvalidArgumentException::class);
        ImageEditor::create()->editImage($source, $transforms);
    }

    /**
     * A transform that genuinely changes the bytes, so a replacement is distinguishable from the
     * pre-edit original.
     */
    private function quarterTurn(): array
    {
        return [
            'flip' => ['horizontal' => false, 'vertical' => false],
            'rotate' => 90,
            'crop' => ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0],
        ];
    }

    /**
     * Build a small image with four distinct corner pixels on a black background, so flips, rotates
     * and crops can be verified by reading the corners back.
     */
    private function createCornerImage(int $width, int $height, string $filename): Image
    {
        $gd = imagecreatetruecolor($width, $height);
        imagefilledrectangle($gd, 0, 0, $width - 1, $height - 1, imagecolorallocate($gd, 0, 0, 0));
        imagesetpixel($gd, 0, 0, imagecolorallocate($gd, 255, 0, 0));
        imagesetpixel($gd, $width - 1, 0, imagecolorallocate($gd, 0, 255, 0));
        imagesetpixel($gd, 0, $height - 1, imagecolorallocate($gd, 0, 0, 255));
        imagesetpixel($gd, $width - 1, $height - 1, imagecolorallocate($gd, 255, 255, 255));
        return $this->writeImage($gd, $filename);
    }

    /**
     * A JPEG of deterministic noise, which compresses very differently at either end of the quality
     * range - a solid or near-solid image barely changes size at all.
     */
    private function createNoisyJpeg(string $filename): Image
    {
        $gd = imagecreatetruecolor(64, 64);
        mt_srand(1);
        for ($x = 0; $x < 64; $x++) {
            for ($y = 0; $y < 64; $y++) {
                $colour = imagecolorallocate($gd, mt_rand(0, 255), mt_rand(0, 255), mt_rand(0, 255));
                imagesetpixel($gd, $x, $y, $colour);
            }
        }

        ob_start();
        imagejpeg($gd, null, 100);
        $bytes = (string) ob_get_clean();

        $image = new Image();
        $image->setFromString($bytes, $filename);
        $image->write();
        return $image;
    }

    private function createSolidImage(int $width, int $height, string $filename): Image
    {
        $gd = imagecreatetruecolor($width, $height);
        imagefilledrectangle($gd, 0, 0, $width - 1, $height - 1, imagecolorallocate($gd, 20, 40, 60));
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

    private function decode(Image $image): GdImage
    {
        return imagecreatefromstring((string) $image->getString());
    }

    /**
     * @return array{0: int, 1: int, 2: int} RGB channels
     */
    private function colourAt(GdImage $gd, int $x, int $y): array
    {
        $rgb = imagecolorat($gd, $x, $y);
        return [($rgb >> 16) & 0xFF, ($rgb >> 8) & 0xFF, $rgb & 0xFF];
    }
}
