<?php

namespace SilverStripe\AssetAdmin\Tests;

use AssetStoreTest_SpyStore;
use InvalidArgumentException;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderFormFactory;
use SilverStripe\AssetAdmin\Forms\ImageFormBuilder;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use SilverStripe\Dev\SapphireTest;

class FileFormBuilderTest extends SapphireTest
{
    protected static $fixture_file = 'FileFormBuilderTest.yml';

    public function setUp() {
		parent::setUp();

		// Set backend and base url
		AssetStoreTest_SpyStore::activate('FileFormBuilderTest');

        /** @var File $testfile */
        $testfile = $this->objFromFixture(File::class, 'file1');
        $testfile->setFromLocalFile(__DIR__ .'/fixtures/testfile.txt', 'files/testfile.txt');
        $testfile->write();

        /** @var Image $testimage */
        $testimage = $this->objFromFixture(Image::class, 'image1');
        $testimage->setFromLocalFile(__DIR__.'/fixtures/testimage.png', 'files/testimage.png');
	}

    public function testEditFileForm() {
        $this->logInWithPermission('ADMIN');

        $file = $this->objFromFixture(File::class, 'file1');
        $controller = new AssetAdmin();
        $builder = new FileFormFactory($controller, $file);
        $form = $builder->getForm('EditForm');

        // Verify file form is scaffolded correctly
        $this->assertEquals('EditForm', $form->getName());

        // Test fields exist
        $fileSpecs = $form->Fields()->fieldByName('FileSpecs')->getContent();
        $this->assertEquals(
            '<div class="editor__specs">11 bytes <span class="editor__status-flag">Draft</span></div>',
            $fileSpecs
        );
        $fileURL = $form->Fields()->fieldByName('Editor.Details.ClickableURL')->Value();
        $this->assertEquals(
            '<i class="font-icon-link btn--icon-large form-control-static__icon"></i>'
            . '<a href="/assets/files/6adf67caca/testfile.txt" target="_blank">/assets/files/6adf67caca/testfile.txt</a>',
            $fileURL
        );
        $filePath = $form->Fields()->fieldByName('Editor.Details.Path')->Value();
        $this->assertEquals('files/', $filePath);

        $fileThumbnail = $form->Fields()->fieldByName('IconFull')->getContent();
        $this->assertEquals(
            '<img src="framework/client/dist/images/app_icons/generic_32.png" class="editor__thumbnail" />',
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

    public function testCreateFileForm() {
        $this->logInWithPermission('ADMIN');

        $file = File::singleton();
        $controller = new AssetAdmin();
        $builder = new FileFormFactory($controller, $file);
        $form = $builder->getForm('EditForm');

        // Test fields
        $this->assertEmpty($form->Fields()->fieldByName('FileSpecs')->getContent());
        $this->assertEmpty($form->Fields()->fieldByName('Editor.Details.Path')->dataValue());
        $this->assertEmpty($form->Fields()->fieldByName('Editor.Details.ClickableURL')->dataValue());

        // Test actions
        $this->assertNotNull($form->Actions()->fieldByName('action_save'));
    }

    public function testEditImageForm() {
        $this->logInWithPermission('ADMIN');

        $image = $this->objFromFixture(Image::class, 'image1');
        $controller = new AssetAdmin();
        $builder = new FileFormFactory($controller, $image);
        $form = $builder->getForm('EditForm');

        // Check thumbnail
        // Note: force_resample is turned off for testing
        $fileThumbnail = $form->Fields()->fieldByName('IconFull')->getContent();
        $this->assertContains(
            '/FileFormBuilderTest/files/906835357d/testimage.png',
            $fileThumbnail
        );
    }

    public function testFolderForm() {
        $this->logInWithPermission('ADMIN');

        $folder = $this->objFromFixture(Folder::class, 'parent');
        $controller = new AssetAdmin();
        $builder = new FolderFormFactory($controller, $folder);
        $form = $builder->getForm('EditForm');

        // Check fields
        $this->assertNull($form->Fields()->fieldByName('FileSpecs'));
        $this->assertNull($form->Fields()->fieldByName('Editor.Details.ClickableURL'));
        $this->assertNull($form->Fields()->fieldByName('Editor.Usage'));


        $fileThumbnail = $form->Fields()->fieldByName('IconFull')->getContent();
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

    public function testScaffolderFactory() {
        $controller = new AssetAdmin();
        $this->assertInstanceOf(FileFormFactory::class, $controller->getFormFactory(File::singleton()));
        $this->assertInstanceOf(ImageFormBuilder::class, $controller->getFormFactory(Image::singleton()));
        $this->assertInstanceOf(FolderFormFactory::class, $controller->getFormFactory(Folder::singleton()));
    }


}
