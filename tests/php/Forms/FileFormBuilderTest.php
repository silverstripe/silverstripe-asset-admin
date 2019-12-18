<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Extensions\CampaignAdminExtension;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderFormFactory;
use SilverStripe\AssetAdmin\Forms\ImageFormFactory;
use SilverStripe\AssetAdmin\Tests\Forms\FileFormBuilderTest\FileExtension;
use Silverstripe\Assets\Dev\TestAssetStore;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Image;
use SilverStripe\Core\Config\Config;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\LiteralField;

class FileFormBuilderTest extends SapphireTest
{
    protected static $fixture_file = 'FileFormBuilderTest.yml';

    protected static $extra_dataobjects = [
        FileFormBuilderTest\FileOwner::class,
    ];

    public function setUp()
    {
        parent::setUp();

        // Dynamically assign fileowner as owner (otherwise it pollutes other tests)
        FileFormBuilderTest\FileOwner::config()->set('owns', ['OwnedFile']);

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

    public function testEditFileForm()
    {
        // Ensure campaign-admin extension is not applied!
        Config::modify()->remove(FileFormFactory::class, 'extensions');

        $this->logInWithPermission('ADMIN');

        $file = $this->objFromFixture(File::class, 'file1');
        $controller = new AssetAdmin();
        $builder = new FileFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file, 'RequireLinkText' => false]);

        // Verify file form is scaffolded correctly
        $this->assertEquals('EditForm', $form->getName());

        // Test fields exist
        /** @var LiteralField $fileSpecsField */
        $fileSpecsField = $form->Fields()->fieldByName('AssetEditorHeaderFieldGroup.FileSpecs');
        $fileSpecs = $fileSpecsField->getContent();
        $this->assertEquals(
            '<div class="editor__specs">11 bytes <span class="editor__status-flag">Draft</span></div>',
            $fileSpecs
        );

        /** @var LiteralField $iconFullField */
        $iconFullField = $form->Fields()->fieldByName('PreviewImage');
        $state = $iconFullField->getSchemaStateDefaults();
        $this->assertEquals($file->Parent()->ID, $state['data']['parentid']);
        $this->assertContains('testfile.txt', $state['data']['url']);
        $this->assertTrue($state['data']['exists']);
        $this->assertContains('document_92.png', $state['data']['preview']);
        $this->assertEquals('document', $state['data']['category']);

        $uploaded = $form->Fields()->fieldByName('Editor.Details.Created');
        $this->assertEquals(
            $file->Created,
            $uploaded->dataValue()
        );

        // Test actions exist
        $this->assertNotNull($form->Actions()->fieldByName('Actions.action_save'));
        $this->assertNotNull($form->Actions()->fieldByName('Actions.action_publish'));
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_replacefile'));
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_delete'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_unpublish'));

        // Add to campaign should not be there by default
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_addtocampaign'));

        // Add extension for campaign-admin
        Config::modify()->merge(
            FileFormFactory::class,
            'extensions',
            [CampaignAdminExtension::class]
        );

        $builder = new FileFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file, 'RequireLinkText' => false]);

        // Add to campaign should now be available
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_addtocampaign'));
    }

    public function testEditFileFormWithPermissions()
    {
        // Add extension for campaign-admin
        FileFormFactory::add_extension(CampaignAdminExtension::class);
        // Add extension to simulate different permissions
        File::add_extension(FileExtension::class);

        $this->logInWithPermission('ADMIN');

        /** @var File $file */
        $file = $this->objFromFixture(File::class, 'file1');
        $controller = new AssetAdmin();
        $builder = new FileFormFactory();

        FileExtension::$canDelete = false;
        FileExtension::$canPublish = false;
        FileExtension::$canEdit = false;
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file, 'RequireLinkText' => false]);
        $this->assertNull($form->Actions()->fieldByName('PopoverActions'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_delete'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_replacefile'));

        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_addtocampaign'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_unpublish'));

        FileExtension::$canDelete = false;
        FileExtension::$canPublish = true;
        FileExtension::$canEdit = false;
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file, 'RequireLinkText' => false]);
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_delete'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_replacefile'));
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_addtocampaign'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_unpublish'));

        FileExtension::$canDelete = true;
        FileExtension::$canPublish = false;
        FileExtension::$canEdit = false;
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file]);
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_delete'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_replacefile'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_addtocampaign'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_unpublish'));

        FileExtension::$canDelete = false;
        FileExtension::$canPublish = false;
        FileExtension::$canEdit = true;
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file]);
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_delete'));
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_replacefile'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_addtocampaign'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_unpublish'));

        FileExtension::$canDelete = true;
        FileExtension::$canPublish = true;
        FileExtension::$canUnpublish = true;
        FileExtension::$canEdit = true;
        $file->publishSingle();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file, 'RequireLinkText' => false]);
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_delete'));
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_replacefile'));
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_addtocampaign'));
        $this->assertNotNull($form->Actions()->fieldByName('PopoverActions.action_unpublish'));

        FileFormFactory::remove_extension(CampaignAdminExtension::class);
        File::remove_extension(FileExtension::class);
    }

    /**
     * Ensure unpublish has owner count
     */
    public function testUnpublishOwners()
    {
        $this->logInWithPermission('ADMIN');

        // Publish one of the owners
        /** @var FileFormBuilderTest\FileOwner $owner1 */
        $owner1 = $this->objFromFixture(FileFormBuilderTest\FileOwner::class, 'owner1');
        $owner1->publishSingle();

        /** @var File $file */
        $file = $this->objFromFixture(File::class, 'file1');
        $file->publishSingle();

        // Build new form
        $controller = new AssetAdmin();
        $builder = new FileFormFactory();

        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file, 'RequireLinkText' => false]);
        $unpublishAction = $form->Actions()->fieldByName('PopoverActions.action_unpublish');
        $this->assertNotNull($unpublishAction);
        $this->assertEquals(1, $unpublishAction->getSchemaData()['data']['owners']);
    }

    public function testCreateFileForm()
    {
        $this->logInWithPermission('ADMIN');

        $file = $this->objFromFixture(File::class, 'file1');
        $controller = new AssetAdmin();
        $builder = new FileFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $file, 'RequireLinkText' => false]);

        // Test fields
        /** @var LiteralField $fileSpecsField */
        $fileSpecsField = $form->Fields()->fieldByName('AssetEditorHeaderFieldGroup.FileSpecs');
        $this->assertEquals(
            '<div class="editor__specs">11 bytes <span class="editor__status-flag">Draft</span></div>',
            $fileSpecsField->getContent()
        );

        // Test actions
        $this->assertNotNull($form->Actions()->fieldByName('Actions.action_save'));
    }

    public function testEditImageForm()
    {
        $this->logInWithPermission('ADMIN');

        $image = $this->objFromFixture(Image::class, 'image1');
        // write so that PreviewImageField could load this later on
        $image->write();
        $controller = new AssetAdmin();
        $builder = new ImageFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $image]);

        // Check thumbnail
        // Note: force_resample is turned off for testing
        /** @var LiteralField $iconFullField */
        $iconFullField = $form->Fields()->fieldByName('PreviewImage');
        $state = $iconFullField->getSchemaStateDefaults();
        $this->assertEquals($image->Parent()->ID, $state['data']['parentid']);
        $this->assertContains('testimage.png', $state['data']['url']);
        $this->assertTrue($state['data']['exists']);
        $this->assertRegexp('#testimage__.*\.png$#', $state['data']['preview']);
        $this->assertEquals('image', $state['data']['category']);
    }

    public function testInsertImageForm()
    {
        $this->logInWithPermission('CMS_ACCESS');

        $image = $this->objFromFixture(Image::class, 'image1');
        $controller = new AssetAdmin();
        $builder = new ImageFormFactory();
        $form = $builder->getForm(
            $controller,
            'EditForm',
            ['Record' => $image, 'Type' => FileFormFactory::TYPE_INSERT_MEDIA]
        );

        // Check thumbnail
        // Note: force_resample is turned off for testing
        $altTextField = $form->Fields()->dataFieldByName('AltText');
        $this->assertNotNull($altTextField);

        // Ensure "insert" button exists
        $this->assertTrue($image->canView());
        $this->assertNotNull($form->Actions()->fieldByName('action_insert'));
    }

    public function testInsertImageFormDenied()
    {
        $this->logInWithPermission('SOME_PERMISSION');

        $image = $this->objFromFixture(Image::class, 'image1');
        $controller = new AssetAdmin();
        $builder = new ImageFormFactory();
        $form = $builder->getForm(
            $controller,
            'EditForm',
            ['Record' => $image, 'Type' => FileFormFactory::TYPE_INSERT_MEDIA]
        );

        // Ensure "insert" button does not exist
        $this->assertFalse($image->canView());
        $this->assertNull($form->Actions()->fieldByName('action_insert'));
    }

    public function testInsertFileForm()
    {
        $this->logInWithPermission('CMS_ACCESS');

        $image = $this->objFromFixture(Image::class, 'image1');
        $controller = new AssetAdmin();
        $builder = new ImageFormFactory();
        $form = $builder->getForm(
            $controller,
            'EditForm',
            ['Record' => $image, 'Type' => FileFormFactory::TYPE_INSERT_LINK, 'RequireLinkText' => false]
        );

        // Ensure form contains correct fields
        $this->assertNotNull($form->Fields()->dataFieldByName('Description'));
        $this->assertNotNull($form->Fields()->dataFieldByName('TargetBlank'));

        // Don't show dimension tags
        $this->assertNull($form->Fields()->dataFieldByName('InsertWidth'));
    }

    public function testFolderForm()
    {
        $this->logInWithPermission('ADMIN');

        $folder = $this->objFromFixture(Folder::class, 'parent');
        $controller = new AssetAdmin();
        $builder = new FolderFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['Record' => $folder]);

        // Check fields
        $this->assertNull($form->Fields()->fieldByName('FileSpecs'));
        $this->assertNull($form->Fields()->fieldByName('Editor.Details.ClickableURL'));
        $this->assertNull($form->Fields()->fieldByName('Editor.Usage'));

        /** @var LiteralField $iconFullField */
        $iconFullField = $form->Fields()->fieldByName('PreviewImage');
        $state = $iconFullField->getSchemaStateDefaults();
        $this->assertEquals($folder->Parent()->ID, $state['data']['parentid']);
        $this->assertTrue($state['data']['exists']);
        $this->assertContains('folder_icon_large.png', $state['data']['preview']);
        $this->assertEquals('folder', $state['data']['category']);

        // Check actions
        $this->assertNotNull($form->Actions()->fieldByName('action_save'));
        $this->assertNotNull($form->Actions()->dataFieldByName('action_delete'));
        $this->assertNull($form->Actions()->fieldByName('action_publish'));
        $this->assertNull($form->Actions()->dataFieldByName('action_publish'));
        $this->assertNull($form->Actions()->dataFieldByName('action_unpublish'));
        $this->assertNull($form->Actions()->fieldByName('PopoverActions.action_replacefile'));
    }

    public function testScaffolderFactory()
    {
        $controller = new AssetAdmin();
        $this->assertInstanceOf(FileFormFactory::class, $controller->getFormFactory(File::singleton()));
        $this->assertInstanceOf(ImageFormFactory::class, $controller->getFormFactory(Image::singleton()));
        $this->assertInstanceOf(FolderFormFactory::class, $controller->getFormFactory(Folder::singleton()));
    }
}
