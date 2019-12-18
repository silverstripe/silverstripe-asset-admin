<?php

namespace SilverStripe\AssetAdmin\Tests\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\AssetAdmin\Forms\FolderCreateFormFactory;
use SilverStripe\Core\Config\Config;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\HeaderField;

class FolderCreateFormFactoryTest extends SapphireTest
{
    public function testEditFileForm()
    {
        // Ensure campaign-admin extension is not applied!
        Config::modify()->remove(FileFormFactory::class, 'extensions');

        $this->logInWithPermission('ADMIN');

        $controller = new AssetAdmin();
        $builder = new FolderCreateFormFactory();
        $form = $builder->getForm($controller, 'EditForm', ['ParentID' => 0]);

        // Verify file form is scaffolded correctly
        $this->assertEquals('EditForm', $form->getName());

        // Test fields exist
        /** @var HeaderField $header */
        $header = $form->Fields()->fieldByName('AssetEditorHeaderFieldGroup.TitleHeader');

        $this->assertEquals('New Folder', $header->Title());
    }
}
