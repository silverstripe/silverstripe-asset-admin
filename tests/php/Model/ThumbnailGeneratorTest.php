<?php

namespace SilverStripe\AssetAdmin\Tests\Model;

use SilverStripe\AssetAdmin\Model\ThumbnailGenerator;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Storage\AssetStore;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Core\Config\Config;
use SilverStripe\Dev\SapphireTest;

class ThumbnailGeneratorTest extends SapphireTest
{

    protected $usesDatabase = true;

    public function setUp()
    {
        parent::setUp();
        $this->logInWithPermission('ADMIN');
        TestAssetStore::activate('ThumbnailGeneratorTest');
    }

    public function tearDown()
    {
        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testGenerateThumbnail()
    {
        $generator = new ThumbnailGenerator();
        // Build image
        $image = new Image();
        $image->setFromLocalFile(__DIR__ . '/../Forms/fixtures/testimage.png', 'TestImage.png');
        $image->write();

        // protected image should have inline thumbnail
        $thumbnail = $generator->generateThumbnail($image, 100, 200);
        $this->assertEquals(100, $thumbnail->getWidth());
        $this->assertEquals(50, $thumbnail->getHeight()); // Note: Aspect ratio of original image retained

        // Build non-image
        $file = new File();
        $file->setFromLocalFile(__DIR__ . '/../Forms/fixtures/testfile.txt', 'testfile.txt');
        $file->write();
        $thumbnail = $generator->generateThumbnail($file, 100, 200);
        $this->assertNull($thumbnail);

        // Broken image
        $image = new Image();
        $image->Filename = 'somefile.jpg';
        $image->Hash = sha1('somefile.jpg');
        $image->write();
        $thumbnail = $generator->generateThumbnail($image, 100, 200);
        $this->assertNull($thumbnail);
    }

    public function testGenerateLink()
    {
        $generator = new ThumbnailGenerator();

        ThumbnailGenerator::config()->set('thumbnail_links', [
            AssetStore::VISIBILITY_PROTECTED => ThumbnailGenerator::INLINE,
            AssetStore::VISIBILITY_PUBLIC => ThumbnailGenerator::URL,
        ]);

        // Build image
        $image = new Image();
        $image->setFromLocalFile(__DIR__.'/../Forms/fixtures/testimage.png', 'TestImage.png');
        $image->write();

        // Non-images are ignored
        $file = new File();
        $link = $generator->generateLink($file);
        $this->assertNull($link);

        // original image
        $thumbnail = $generator->generateLink($image);
        $this->assertStringStartsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACW', $thumbnail);

        // protected image should have inline thumbnail
        $thumbnail = $generator->generateThumbnailLink($image, 100, 200);
        $this->assertStringStartsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAy', $thumbnail);

        // but not if it's too big
        Config::nest();
        Config::modify()->set(ThumbnailGenerator::class, 'max_thumbnail_bytes', 1);
        // Without graceful thumbnails, it should come back null
        $thumbnail = $generator->generateThumbnailLink($image, 100, 200);
        $this->assertNull($thumbnail);
        // With graceful thumbnails, it should come back as a URL
        $thumbnail = $generator->generateThumbnailLink($image, 100, 200, true);
        $this->assertRegExp('#/assets/[A-Za-z0-9]+/TestImage__FitMaxWzEwMCwyMDBd\.png$#', $thumbnail);
        Config::unnest();

        // public image should have url
        $image->publishSingle();
        $thumbnail = $generator->generateThumbnailLink($image, 100, 200);
        $this->assertEquals('/assets/ThumbnailGeneratorTest/TestImage__FitMaxWzEwMCwyMDBd.png', $thumbnail);

        // Public assets can be set to inline
        ThumbnailGenerator::config()->merge('thumbnail_links', [
            AssetStore::VISIBILITY_PUBLIC => ThumbnailGenerator::INLINE,
        ]);
        $thumbnail = $generator->generateThumbnailLink($image, 100, 200);
        $this->assertStringStartsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAy', $thumbnail);

        // Protected assets can be set to url
        // This uses protected asset adapter, so not direct asset link
        ThumbnailGenerator::config()->merge('thumbnail_links', [
            AssetStore::VISIBILITY_PROTECTED => ThumbnailGenerator::URL,
        ]);
        $image->doUnpublish();
        $thumbnail = $generator->generateThumbnailLink($image, 100, 200);
        $this->assertEquals('/assets/906835357d/TestImage__FitMaxWzEwMCwyMDBd.png', $thumbnail);
    }
}
