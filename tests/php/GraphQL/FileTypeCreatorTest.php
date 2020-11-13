<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\GraphQL\FileTypeCreator;
use SilverStripe\AssetAdmin\GraphQL\Resolvers\FileTypeResolver;
use SilverStripe\AssetAdmin\Model\ThumbnailGenerator;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Storage\AssetStore;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\GraphQL\Schema\Schema;

class FileTypeCreatorTest extends SapphireTest
{

    protected $usesDatabase = true;

    public function setUp()
    {
        parent::setUp();
        if (!class_exists(Schema::class)) {
            $this->markTestSkipped('GraphQL 4 test ' . __CLASS__ . ' skipped');
        }

        TestAssetStore::activate('FileTypeCreatorTest');
    }

    public function tearDown()
    {
        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testThumbnail()
    {
        $this->logInWithPermission('ADMIN');
        ThumbnailGenerator::config()->set('thumbnail_links', [
            AssetStore::VISIBILITY_PROTECTED => ThumbnailGenerator::INLINE,
            AssetStore::VISIBILITY_PUBLIC => ThumbnailGenerator::URL,
        ]);

        $assetAdmin = AssetAdmin::create();

        // Build image
        $image = new Image();
        $image->setFromLocalFile(__DIR__.'/../Forms/fixtures/largeimage.png', 'TestImage.png');
        $image->write();

        // Image original is unset
        $thumbnail = FileTypeResolver::resolveFileThumbnail($image, [], [], null);
        $this->assertNull($thumbnail);

        // Generate thumbnails by viewing this file's data
        $assetAdmin->getObjectFromData($image, false);

        // protected image should have inline thumbnail
        $thumbnail = FileTypeResolver::resolveFileThumbnail($image, [], [], null);
        $this->assertStringStartsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWAAAADr', $thumbnail);

        // public image should have url
        $image->publishSingle();
        $thumbnail = FileTypeResolver::resolveFileThumbnail($image, [], [], null);
        $this->assertEquals('/assets/FileTypeCreatorTest/TestImage__FitMaxWzM1MiwyNjRd.png', $thumbnail);

        // Public assets can be set to inline
        ThumbnailGenerator::config()->merge('thumbnail_links', [
            AssetStore::VISIBILITY_PUBLIC => ThumbnailGenerator::INLINE,
        ]);
        $thumbnail = FileTypeResolver::resolveFileThumbnail($image, [], [], null);
        $this->assertStringStartsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWAAAADr', $thumbnail);

        // Protected assets can be set to url
        // This uses protected asset adapter, so not direct asset link
        ThumbnailGenerator::config()->merge('thumbnail_links', [
            AssetStore::VISIBILITY_PROTECTED => ThumbnailGenerator::URL,
        ]);
        $image->doUnpublish();
        $thumbnail = FileTypeResolver::resolveFileThumbnail($image, [], [], null);
        $this->assertEquals('/assets/8cf6c65fa7/TestImage__FitMaxWzM1MiwyNjRd.png', $thumbnail);
    }
}
