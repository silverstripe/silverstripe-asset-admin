<?php

namespace SilverStripe\AssetAdmin\Tests;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderFormFactory;
use SilverStripe\AssetAdmin\Forms\ImageFormFactory;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Tests\Storage\AssetStoreTest\TestAssetStore;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\LiteralField;

class FileFormBuilderTest extends SapphireTest
{
    protected static $fixture_file = 'FileFormBuilderTest.yml';

    public function setUp()
    {
        parent::setUp();

        // Set backend and base url
        TestAssetStore::activate('FileFormBuilderTest');

        /** @var File $testfile */
        $testfile = $this->objFromFixture(File::class, 'file1');
        $testfile->setFromLocalFile(__DIR__ .'/fixtures/testfile.txt', 'files/testfile.txt');
        $testfile->write();

        /** @var Image $testimage */
        $testimage = $this->objFromFixture(Image::class, 'image1');
        $testimage->setFromLocalFile(__DIR__.'/fixtures/testimage.png', 'files/testimage.png');
    }

    public function testEditFileForm()
    {
        $this->logInWithPermission('ADMIN');

        $file = $this->objFromFixture(File::class, 'file1');
        $controller = new AssetAdmin();
        $builder = new FileFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file]);

        // Verify file form is scaffolded correctly
        $this->assertEquals('EditForm', $form->getName());

        // Test fields exist
        /** @var LiteralField $fileSpecsField */
        $fileSpecsField = $form->Fields()->fieldByName('FileSpecs');
        $fileSpecs = $fileSpecsField->getContent();
        $this->assertEquals(
            '<div class="editor__specs">11 bytes <span class="editor__status-flag">Draft</span></div>',
            $fileSpecs
        );
        $filePath = $form->Fields()->fieldByName('Editor.Details.Path')->Value();
        $this->assertEquals('files/', $filePath);

        /** @var LiteralField $iconFullField */
        $iconFullField = $form->Fields()->fieldByName('IconFull');
        $fileThumbnail = $iconFullField->getContent();
        $this->assertEquals(
            '<a class="editor__file-preview-link" href="/assets/files/6adf67caca/testfile.txt" target="_blank">'.
                '<img src="framework/client/dist/images/app_icons/document_32.png" class="editor__thumbnail" />'.
            '</a>',
            $fileThumbnail
        );

        // Usage tab
        $uploaded = $form->Fields()->fieldByName('Editor.Usage.Created');
        $this->assertEquals(
            $file->Created,
            $uploaded->dataValue()
        );

        // Test actions exist
        $this->assertNotNull($form->Actions()->fieldByName('action_save'));
        $this->assertNotNull($form->Actions()->fieldByName('action_publish'));
        $this->assertNotNull($form->Actions()->fieldByName('actionaddtocampaignactiondelete.action_addtocampaign'));
        $this->assertNotNull($form->Actions()->fieldByName('actionaddtocampaignactiondelete.action_delete'));
        $this->assertNull($form->Actions()->fieldByName('actionaddtocampaignactiondelete.action_unpublish'));
    }

    public function testCreateFileForm()
    {
        $this->logInWithPermission('ADMIN');

        $file = $this->objFromFixture(File::class, 'file1');
        $controller = new AssetAdmin();
        $builder = new FileFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file]);

        // Test fields
        /** @var LiteralField $fileSpecsField */
        $fileSpecsField = $form->Fields()->fieldByName('FileSpecs');
        $this->assertEquals(
            '<div class="editor__specs">11 bytes <span class="editor__status-flag">Draft</span></div>',
            $fileSpecsField->getContent()
        );
        $this->assertEquals(
            'files/',
            $form->Fields()->fieldByName('Editor.Details.Path')->dataValue()
        );

        // Test actions
        $this->assertNotNull($form->Actions()->fieldByName('action_save'));
    }

    public function testEditImageForm()
    {
        $this->logInWithPermission('ADMIN');

        $image = $this->objFromFixture(Image::class, 'image1');
        $controller = new AssetAdmin();
        $builder = new ImageFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $image]);

        // Check thumbnail
        // Note: force_resample is turned off for testing
        /** @var LiteralField $iconFullField */
        $iconFullField = $form->Fields()->fieldByName('IconFull');
        $fileThumbnail = $iconFullField->getContent();
        $this->assertContains(
            '/FileFormBuilderTest/files/906835357d/testimage.png',
            $fileThumbnail
        );
    }

    public function testInsertImageForm()
    {
        $this->logInWithPermission('ADMIN');

        $image = $this->objFromFixture(Image::class, 'image1');
        $controller = new AssetAdmin();
        $builder = new ImageFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $image, 'Type' => 'insert']);

        // Check thumbnail
        // Note: force_resample is turned off for testing
        $altTextField = $form->Fields()->dataFieldByName('AltText');
        $this->assertNotNull($altTextField);
    }

    public function testFolderForm()
    {
        $this->logInWithPermission('ADMIN');

        $folder = $this->objFromFixture(Folder::class, 'parent');
        $controller = new AssetAdmin();
        $builder = new FolderFormFactory($controller, $folder);
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $folder]);

        // Check fields
        $this->assertNull($form->Fields()->fieldByName('FileSpecs'));
        $this->assertNull($form->Fields()->fieldByName('Editor.Details.ClickableURL'));
        $this->assertNull($form->Fields()->fieldByName('Editor.Usage'));

        /** @var LiteralField $iconField */
        $iconField = $form->Fields()->fieldByName('IconFull');
        $fileThumbnail = $iconField->getContent();
        $this->assertEquals(
            '<img src="framework/client/dist/images/app_icons/folder_icon_large.png" class="editor__thumbnail" />',
            $fileThumbnail
        );


        // Check actions
        $this->assertNotNull($form->Actions()->fieldByName('action_save'));
        $this->assertNotNull($form->Actions()->fieldByName('action_delete')); // At top level, not in popup
        $this->assertNull($form->Actions()->fieldByName('action_publish'));
        $this->assertNull($form->Actions()->dataFieldByName('action_publish'));
        $this->assertNull($form->Actions()->dataFieldByName('action_unpublish'));
    }

    public function testScaffolderFactory()
    {
        $controller = new AssetAdmin();
        $this->assertInstanceOf(FileFormFactory::class, $controller->getFormFactory(File::singleton()));
        $this->assertInstanceOf(ImageFormFactory::class, $controller->getFormFactory(Image::singleton()));
        $this->assertInstanceOf(FolderFormFactory::class, $controller->getFormFactory(Folder::singleton()));
    }
}
