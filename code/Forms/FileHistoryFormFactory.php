<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Control\Controller;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\ReadonlyField;

class FileHistoryFormFactory extends FileFormFactory
{

    protected function getFormFields(Controller $controller, $name, $context = [])
    {
        $record = $context['Record'];

        $fields = new FieldList(
            LiteralField::create('Thumbnail', $this->getIconMarkup($record)),
            LiteralField::create('FileSpecs', $this->getSpecsMarkup($record)),
            ReadonlyField::create("Title", File::singleton()->fieldLabel('Title')),
            ReadonlyField::create('Name', File::singleton()->fieldLabel('Filename')),
            ReadonlyField::create("Path", _t('AssetTableField.PATH', 'Path'), $this->getPath($record))
        );

        $this->invokeWithExtensions('updateFormFields', $fields, $controller, $name, $context);

        return $fields;
    }


    protected function getFormActions(Controller $controller, $name, $context = [])
    {
        $record = $context['Record'];

        $actions = new FieldList();

        // Update
        $this->invokeWithExtensions('updateFormActions', $actions, $controller, $name, $context);

        return $actions;
    }
}
