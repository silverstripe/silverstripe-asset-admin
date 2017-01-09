<?php

namespace SilverStripe\AssetAdmin\Forms;

use InvalidArgumentException;
use SilverStripe\Assets\File;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\HeaderField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\TextField;

abstract class AssetFormFactory implements FormFactory
{
    use Extensible;
    use Injectable;
    use Configurable;

    /**
     * Insert into HTML content area
     */
    const TYPE_INSERT = 'insert';

    /**
     * Select file by ID only
     */
    const TYPE_SELECT = 'select';

    /**
     * Edit form: Default
     */
    const TYPE_ADMIN = 'admin';

    public function __construct()
    {
        $this->constructExtensions();
    }

    public function getForm(Controller $controller, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
        // Validate context
        foreach ($this->getRequiredContext() as $required) {
            if (!isset($context[$required])) {
                throw new InvalidArgumentException("Missing required context $required");
            }
        }

        $fields = $this->getFormFields($controller, $name, $context);
        $actions = $this->getFormActions($controller, $name, $context);
        $validator = new RequiredFields('Name');
        $form = Form::create($controller, $name, $fields, $actions, $validator);

        // Extend form
        $this->invokeWithExtensions('updateForm', $form, $controller, $name, $context);

        // Populate form from record
        $form->loadDataFrom($context['Record']);

        return $form;
    }

    /**
     * Get form type from 'type' context
     *
     * @param array $context
     * @return string
     */
    protected function getFormType($context)
    {
        return empty($context['Type']) ? static::TYPE_ADMIN : $context['Type'];
    }

    /**
     * Gets the main tabs for the file edit form
     *
     * @param File $record
     * @return TabSet
     */
    protected function getFormFieldTabs($record, $context = [])
    {
        $tabs = TabSet::create('Editor', $this->getFormFieldDetailsTab($record));

        return $tabs;
    }

    /**
     * @param File $record
     * @return FormAction
     */
    protected function getSaveAction($record)
    {
        if ($record && $record->isInDB() && $record->canEdit()) {
            return FormAction::create('save', _t('CMSMain.SAVE', 'Save'))
                ->setIcon('save');
        }
        return null;
    }

    /**
     * Get delete action, if this record is deletable
     *
     * @param File $record
     * @return FormAction
     */
    protected function getDeleteAction($record)
    {
        // Delete action
        if ($record && $record->isInDB() && $record->canDelete()) {
            $deleteText = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.DELETE_BUTTON', 'Delete');
            return FormAction::create('delete', $deleteText)
                ->setIcon('trash-bin');
        }
        return null;
    }

    protected function getFormActions(Controller $controller, $name, $context = [])
    {
        $record = $context['Record'];

        $actions = new FieldList();
        if ($saveAction = $this->getSaveAction($record)) {
            $actions->push($saveAction);
        }

        $this->invokeWithExtensions('updateFormActions', $actions, $controller, $name, $context);
        return $actions;
    }

    /**
     * Get fields for this form
     *
     * @param Controller $controller
     * @param string $name
     * @param array $context
     * @return FieldList
     */
    protected function getFormFields(Controller $controller, $name, $context = [])
    {
        $record = $context['Record'];

        // Build standard fields for all folders / files
        /** @var File $record */
        $fields = new FieldList(
            HeaderField::create('TitleHeader', $record ? $record->Title : null, 1)
                ->addExtraClass('editor__heading'),
            PreviewImageField::create('PreviewImage')
                ->setRecordID($record->ID)
                ->addExtraClass('editor__file-preview'),
            $this->getFormFieldTabs($record, $context)
        );
        if ($record) {
            $fields->push(HiddenField::create('ID', $record->ID));
        }

        $this->invokeWithExtensions('updateFormFields', $fields, $controller, $name, $context);
        return $fields;
    }

    /**
     * Build "details" formfield tab
     *
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldDetailsTab($record, $context = [])
    {
        return Tab::create(
            'Details',
            TextField::create('Name', File::singleton()->fieldLabel('Filename'))
        );
    }

    public function getRequiredContext()
    {
        return ['Record'];
    }
}
