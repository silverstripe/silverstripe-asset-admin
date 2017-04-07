<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Control\Controller;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TextField;

/**
 * Empty form factory, because the defaults from AssetFormFactory was enough
 *
 * Class FolderFormFactory
 * @package SilverStripe\AssetAdmin\Forms
 */
class FolderFormFactory extends AssetFormFactory
{
    
    protected function getFormFieldDetailsTab($record, $context = [])
    {
        return Tab::create(
            'Details',
            TextField::create('Name', _t('SilverStripe\\Assets\\Folder.Filename', 'Folder name'))
        );
    }
    
    protected function getFormFields(Controller $controller, $name, $context = [])
    {
        // Add delete action as top level button before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) {
            $preview = $fields->fieldByName('PreviewImage');
            
            if ($preview) {
                $preview->addExtraClass('editor__file-preview--folder');
            }
        });
    
        return parent::getFormFields($controller, $name, $context);
    }
}
