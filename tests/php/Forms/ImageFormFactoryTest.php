<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\AssetFormFactory;
use SilverStripe\AssetAdmin\Forms\ImageFormFactory;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest\FileOwner;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Image;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;
use SilverStripe\ORM\ArrayList;

/**
 * @skipUpgrade
 */
class ImageFormFactoryTest extends SapphireTest
{
    /** @var Image */
    private $img;

    protected $usesDatabase = true;

    protected function setUp()
    {
        parent::setUp();

        // Set backend and base url
        TestAssetStore::activate('ImageFormFactoryTest');

        $img = Image::create();
        $img->setFromLocalFile(__DIR__ . '/fixtures/largeimage.png', 'files/largeimage.png');
        $img->write();

        $this->img = $img;
    }

    public function tearDown()
    {
        TestAssetStore::reset();
        parent::tearDown();
    }

    /**
     * @param int $insertWidth
     * @param int $insertHeight
     * @param int $expectedWidth
     * @param int $expectedHeight
     */
    public function testInsertImageSize()
    {
        $form = ImageFormFactory::create()->getForm(
            null,
            'fileInsertForm',
            ['Type' => AssetFormFactory::TYPE_INSERT_MEDIA , 'Record' => $this->img, 'RequireLinkText' => true]
        );
        $data = $form->getData();
        $this->assertEmpty($data['Width']);
        $this->assertEmpty($data['Height']);
    }
}
