<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest\FileOwner;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Image;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\ORM\ArrayList;

/**
 * @skipUpgrade
 */
class UploadFieldTest extends SapphireTest
{
    protected static $fixture_file = 'FileFormBuilderTest.yml';

    protected static $extra_dataobjects = [
        FileOwner::class,
    ];

    protected function setUp()
    {
        parent::setUp();

        // Set backend and base url
        TestAssetStore::activate('FileFormBuilderTest');

        /** @var File $testfile */
        $testfile = $this->objFromFixture(File::class, 'file1');
        $testfile->setFromLocalFile(__DIR__ . '/fixtures/testfile.txt', 'files/testfile.txt');
        $testfile->write();

        /** @var Image $testimage */
        $testimage = $this->objFromFixture(Image::class, 'image1');
        $testimage->setFromLocalFile(__DIR__ . '/fixtures/testimage.png', 'files/testimage.png');
    }

    public function tearDown()
    {
        TestAssetStore::reset();
        parent::tearDown();
    }

    public function testGetAttributes()
    {
        $field = UploadField::create('MyField');
        $field->addExtraClass('myfield');
        $field->setIsMultiUpload(false);
        $field->setFolderName('/');
        /** @var Image $image */
        $image = $this->objFromFixture(Image::class, 'image1');
        $field->setItems(new ArrayList([$image]));
        $admin = AssetAdmin::create();
        Form::create($admin, 'MyForm', FieldList::create($field), FieldList::create());

        $attributes = $field->getAttributes();
        $schema = [
            'name' => 'MyField',
            'id' => 'Form_MyForm_MyField',
            'type' => 'file',
            'component' => 'UploadField',
            'holderId' => 'Form_MyForm_MyField_Holder',
            'title' => 'My field',
            'source' => null,
            'extraClass' => 'entwine-uploadfield uploadfield myfield',
            'description' => null,
            'rightTitle' => null,
            'leftTitle' => null,
            'readOnly' => false,
            'disabled' => false,
            'autoFocus' => false,
            'customValidationMessage' => '',
            'validation' => [],
            'attributes' => [],
            'data' => [
                'createFileEndpoint' => [
                    'url' => 'admin/assets/MyForm/field/MyField/upload',
                    'method' => 'post',
                    'payloadFormat' => 'urlencoded',
                ],
                'multi' => false,
                'parentid' => 0,
                'maxFilesize' => $field->getAllowedMaxFileSize() / 1024 / 1024,
                'maxFiles' => null,
                'canUpload' => true,
                'canAttach' => true,
            ],
            'schemaType' => 'Custom'
        ];
        $state = [
            'name' => 'MyField',
            'id' => 'Form_MyForm_MyField',
            'value' => [ 'Files' => [$image->ID] ],
            'message' => null,
            'data' => [
                'files' => [ $admin->getMinimalistObjectFromData($image) ],
            ],
        ];
        $this->assertArraySubset(
            [
                'class' => 'entwine-uploadfield uploadfield myfield',
                'type' => 'file',
                'multiple' => false,
                'id' => 'Form_MyForm_MyField'
            ],
            $attributes
        );

        // Check schema / state are encoded in this field
        $this->assertEquals($schema, json_decode($attributes['data-schema'], true));
        $this->assertEquals($state, json_decode($attributes['data-state'], true));
    }
}
