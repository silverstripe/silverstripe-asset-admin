<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use ReflectionMethod;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest\FileOwner;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Image;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Assets\Upload;
use SilverStripe\Assets\Upload_Validator;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Model\List\ArrayList;
use PHPUnit\Framework\Attributes\DataProvider;

class UploadFieldTest extends SapphireTest
{
    protected static $fixture_file = 'FileFormBuilderTest.yml';

    protected static $extra_dataobjects = [
        FileOwner::class,
    ];

    protected function setUp(): void
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

    protected function tearDown(): void
    {
        TestAssetStore::reset();
        parent::tearDown();
    }

    public static function provideGetUploadMaxFileSize(): array
    {
        return [
            [
                'adminMaxFileSize' => null,
                'expected' => 100,
            ],
            [
                'adminMaxFileSize' => 200,
                'expected' => 200,
            ],
        ];
    }

    #[DataProvider('provideGetUploadMaxFileSize')]
    public function testGetUploadMaxFileSize(?int $adminMaxFileSize, int $expected): void
    {
        Upload_Validator::config()->set('default_max_file_size', ['*' => 100]);
        AssetAdmin::config()->set('max_upload_size', $adminMaxFileSize);
        $admin = new AssetAdmin();
        $reflectionGetUpload = new ReflectionMethod($admin, 'getUpload');
        $reflectionGetUpload->setAccessible(true);
        /** @var Upload $upload */
        $upload = $reflectionGetUpload->invoke($admin);
        $this->assertSame($expected, $upload->getValidator()->getAllowedMaxFileSize());
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
        $this->assertSame('entwine-uploadfield uploadfield myfield', $attributes['class']);
        $this->assertSame('file', $attributes['type']);
        $this->assertSame(false, $attributes['multiple']);
        $this->assertSame('Form_MyForm_MyField', $attributes['id']);
    }

    public function testSchemaInRenderedField(): void
    {
        $field = new UploadField('MyField');
        $field->addExtraClass('myfield');
        $field->setIsMultiUpload(false);
        $field->setFolderName('/');
        /** @var Image $image */
        $image = $this->objFromFixture(Image::class, 'image1');
        $field->setItems(new ArrayList([$image]));
        $admin = AssetAdmin::create();
        Form::create($admin, 'MyForm', FieldList::create($field), FieldList::create());

        $schema = [
            'name' => 'MyField',
            'id' => 'Form_MyForm_MyField',
            'type' => 'file',
            'schemaType' => 'Custom',
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
            'customValidationMessage' => '',
            'validation' => [],
            'attributes' => [
                'class' => 'entwine-uploadfield uploadfield myfield',
                'multiple' => false,
            ],
            'autoFocus' => false,
            'data' => [
                'endpoints' => [
                    'createFile' =>  [
                        'url' => 'admin/assets/MyForm/field/MyField/upload',
                        'method' => 'post',
                        'payloadFormat' => 'urlencoded',
                    ],
                ],
                'maxFilesize' => $field->getAllowedMaxFileSize() / 1024 / 1024,
                'maxFiles' => null,
                'multi' => false,
                'parentid' => 0,
                'canUpload' => true,
                'canAttach' => true,
                'maxParallelUploads' => 2
            ],
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

        // Check schema / state are encoded in this field
        $html = $field->Field();
        $this->assertStringContainsString(htmlspecialchars(json_encode($schema)), $html);
        $this->assertStringContainsString(htmlspecialchars(json_encode($state)), $html);
    }
}
