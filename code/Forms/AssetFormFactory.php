<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HeaderField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\DefaultFormFactory;
use SilverStripe\Forms\TextField;

abstract class AssetFormFactory extends DefaultFormFactory
{

    /**
     * Get raw HTML for image markup
     *
     * @return string
     */
    protected function getIconMarkup()
    {
        /** @var File $file */
        $file = $this->getRecord();
        $previewLink = Convert::raw2att($file->PreviewLink());
        return "<img src=\"{$previewLink}\" class=\"editor__thumbnail\" />";
    }

    /**
     * Gets the main tabs for the file edit form
     *
     * @return TabSet
     */
    protected function getFormFieldTabs()
    {
        $tabs = TabSet::create('Editor', $this->getFormFieldDetailsTab());
        $this->extendAll('updateFormFieldTabs', $tabs);
        return $tabs;
    }

    /**
     * @return FormAction
     */
    protected function getSaveAction()
    {
        $record = $this->getRecord();
        $editing = $record->isInDB();
        $canSave = $editing ? $record->canEdit() : $record->canCreate();
        if ($canSave) {
            return FormAction::create('save', _t('CMSMain.SAVE', 'Save'))->setIcon('save');
        }
        return null;
    }

    /**
     * Get delete action, if this record is deletable
     *
     * @return FormAction
     */
    protected function getDeleteAction()
    {
        // Delete action
        $record = $this->getRecord();
        if ($record->isInDB() && $record->canDelete()) {
            $deleteText = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.DELETE_BUTTON', 'Delete');
            return FormAction::create('delete', $deleteText)->setIcon('trash-bin');
        }
        return null;
    }

    /**
     * Build basic actions
     *
     * @return FieldList
     */
    protected function getFormActions()
    {
        $actions = new FieldList();
        if ($saveAction = $this->getSaveAction()) {
            $actions->push($saveAction);
        }

        $this->extendAll('updateFormActions', $actions);
        return $actions;
    }

    protected function getFormFields()
    {
        // Build standard fields for all folders / files
        /** @var File $record */
        $record = $this->getRecord();
        $fields = new FieldList(
            HeaderField::create('TitleHeader', $record->Title, 1)
                ->addExtraClass('editor__heading'),
            LiteralField::create("IconFull", $this->getIconMarkup())
                ->addExtraClass('editor__file-preview'),
            $this->getFormFieldTabs(),
            HiddenField::create('ID', $record->ID)
        );

        $this->extendAll('updateFormFields', $fields);
        return $fields;
    }

    /**
     * Build "details" formfield tab
     *
     * @return Tab
     */
    protected function getFormFieldDetailsTab()
    {
        return Tab::create(
            'Details',
            TextField::create('Name', $this->getRecord()->fieldLabel('Filename'))
        );
    }
}
