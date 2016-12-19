<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\ReadonlyField;

class FileHistoryFormFactory extends FileFormFactory
{
    public function getForm(Controller $controller, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
        $form = parent::getForm($controller, $name, $context);
        $form->makeReadonly();
        return $form;
    }

    protected function getSpecsMarkup($record)
    {
        if (!$record || !$record->isInDB()) {
            return null;
        }
        /**
         * Can remove .label and .label-info when Bootstrap has been updated to BS4 Beta
         * .label is being replaced with .tag
         */
        $versionTag = sprintf(
            '<span class="label label-info tag tag-info">v.%s</span>',
            $record->Version
        );
        $agoTag = sprintf(
            '%s <time class="relative-time" title="%s">%s</time>',
            $record->WasPublished
                ? _t('SilverStripe\\AssetAdmin\\Forms\\FileHistoryFormFactory.PUBLISHED', 'Published')
                : _t('SilverStripe\\AssetAdmin\\Forms\\FileHistoryFormFactory.SAVED', 'Saved'),
            Convert::raw2att($record->LastEdited),
            Convert::raw2xml($record->dbObject('LastEdited')->Ago())
        );
        return sprintf(
            '<div class="editor__specs">%s %s, %s %s</div>',
            $versionTag,
            $agoTag,
            $record->getSize(),
            $this->getStatusFlagMarkup($record)
        );
    }

    protected function getFormFields(Controller $controller, $name, $context = [])
    {
        $record = $context['Record'];

        $fields = new FieldList(
            PreviewImageField::create('PreviewImage')
                ->setRecordID($record->ID)
                ->addExtraClass('editor__file-preview'),
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
        $actions = new FieldList();
        // Update
        $this->invokeWithExtensions('updateFormActions', $actions, $controller, $name, $context);

        return $actions;
    }
}
