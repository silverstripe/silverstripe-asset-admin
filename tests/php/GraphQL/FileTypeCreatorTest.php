<?php

namespace SilverStripe\AssetAdmin\Tests\GraphQL;

use SilverStripe\AssetAdmin\GraphQL\FileTypeCreator;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Tests\Storage\AssetStoreTest\TestAssetStore;
use SilverStripe\Dev\SapphireTest;

class FileTypeCreatorTest extends SapphireTest
{
    public function setUp()
    {
        parent::setUp();
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
        $type = new FileTypeCreator();

        // Build image
        $image = new Image();
        $image->setFromLocalFile(__DIR__.'/../Forms/fixtures/testimage.png', 'TestImage.png');
        $image->write();

        // protected image should have inline thumbnail
        $thumbnail = $type->resolveThumbnailField($image, [], [], null);
        $this->assertStringStartsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACW', $thumbnail);

        // public image should have url
        $image->publishSingle();
        $thumbnail = $type->resolveThumbnailField($image, [], [], null);
        $this->assertEquals('/assets/FileTypeCreatorTest/906835357d/TestImage.png', $thumbnail);
    }
}
