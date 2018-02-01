<?php

namespace SilverStripe\AssetAdmin\Forms;

use InvalidArgumentException;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\HeaderField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\OptionsetField;
use SilverStripe\Forms\PopoverField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\Forms\TreeMultiselectField;

/**
 * @skipUpgrade
 */
abstract class AssetFormFactory implements FormFactory
{
    use Extensible;
    use Injectable;
    use Configurable;

    /**
     * Insert into HTML content area as a media object
     */
    const TYPE_INSERT_MEDIA = 'insert-media';

    /**
     * Insert into HTML content area as a link
     */
    const TYPE_INSERT_LINK = 'insert-link';

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
    }

    /**
     * @param RequestHandler $controller
     * @param string $name
     * @param array $context
     * @return Form
     */
    public function getForm(RequestHandler $controller = null, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
        // Validate context
        foreach ($this->getRequiredContext() as $required) {
            if (!isset($context[$required])) {
                throw new InvalidArgumentException("Missing required context $required");
            }
        }

        $fields = $this->getFormFields($controller, $name, $context);
        $actions = $this->getFormActions($controller, $name, $context);
        $validator = $this->getValidator($controller, $name, $context);
        $form = Form::create($controller, $name, $fields, $actions, $validator);

        // Extend form
        $this->invokeWithExtensions('updateForm', $form, $controller, $name, $context);

        // Populate form from record
        if (isset($context['Record'])) {
            /** @var File $record */
            $record = $context['Record'];
            $form->loadDataFrom($record);

            // Mark as readonly for some types
            if ($this->getFormType($context) === self::TYPE_ADMIN && !$record->canEdit()) {
                $form->makeReadonly();
            }
        }

        $form->addExtraClass('form--fill-height form--padded');

        return $form;
    }

    /**
     * Get the validator for the form to be built
     *
     * @param RequestHandler $controller
     * @param $formName
     * @param $context
     * @return RequiredFields
     */
    protected function getValidator(RequestHandler $controller = null, $formName, $context = [])
    {
        $validator = new RequiredFields('Name');

        return $validator;
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
     * @param array $context
     * @return TabSet
     */
    protected function getFormFieldTabs($record, $context = [])
    {
        return TabSet::create(
            'Editor',
            [
                $this->getFormFieldDetailsTab($record, $context),
                $this->getFormFieldSecurityTab($record, $context),
            ]
        );
    }

    /**
     * @param File $record
     * @return FormAction
     */
    protected function getSaveAction($record)
    {
        if ($record && $record->isInDB() && $record->canEdit()) {
            /** @var FormAction $action */
            $action = FormAction::create('save', _t(__CLASS__.'.SAVE', 'Save'))
                ->setIcon('save')
                ->setSchemaState([
                    'data' => [
                        'pristineTitle' => _t(__CLASS__.'SAVED', 'Saved'),
                        'pristineIcon' => 'tick',
                        'dirtyTitle' => _t(__CLASS__.'SAVE', 'Save'),
                        'dirtyIcon' => 'save',
                        'pristineClass' => 'btn-outline-primary',
                        'dirtyClass' => '',
                    ],
                ]);

            return $action;
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

    /**
     * @param RequestHandler $controller
     * @param string $formName
     * @param array $context
     * @return FieldList
     */
    protected function getFormActions(RequestHandler $controller = null, $formName, $context = [])
    {
        $record = isset($context['Record']) ? $context['Record'] : null;

        $actions = new FieldList();
        if ($saveAction = $this->getSaveAction($record)) {
            $actions->push($saveAction);
        }
        $menu = $this->getPopoverMenu($record);
        if ($menu && $menu->FieldList()->count()) {
            $actions->push($menu);
        }

        $this->invokeWithExtensions('updateFormActions', $actions, $controller, $formName, $context);
        return $actions;
    }

    /**
     * Get fields for this form
     *
     * @param RequestHandler $controller
     * @param string $formName
     * @param array $context
     * @return FieldList
     */
    protected function getFormFields(RequestHandler $controller = null, $formName, $context = [])
    {
        $record = isset($context['Record']) ? $context['Record'] : null;

        // Build standard fields for all folders / files
        /** @var File $record */
        $fields = new FieldList(
            HeaderField::create('TitleHeader', $record ? $record->Title : null, 1)
                ->addExtraClass('editor__heading'),
            $this->getFormFieldTabs($record, $context)
        );
        if ($record) {
            $fields->push(HiddenField::create('ID', $record->ID));
            $fields->insertAfter(
                'TitleHeader',
                PreviewImageField::create('PreviewImage')
                    ->setRecordID($record->ID)
                    ->addExtraClass('editor__file-preview')
            );
        }

        $this->invokeWithExtensions('updateFormFields', $fields, $controller, $formName, $context);
        return $fields;
    }

    /**
     * Build popup menu
     *
     * @param File $record
     * @return PopoverField
     */
    protected function getPopoverMenu($record)
    {
        // Build popover actions
        $popoverActions = $this->getPopoverActions($record);
        if ($popoverActions) {
            return PopoverField::create($popoverActions)
                ->setPlacement('top')
                ->setName('PopoverActions')
                ->setButtonTooltip(_t(
                    'SilverStripe\\AssetAdmin\\Forms\\FileFormFactory.OTHER_ACTIONS',
                    'Other actions'
                ));
        }
        return null;
    }

    /**
     * Get actions that go into the Popover menu
     *
     * @param File $record
     * @return array
     */
    protected function getPopoverActions($record)
    {
        $actions = [
            $this->getDeleteAction($record)
        ];

        $this->invokeWithExtensions('updatePopoverActions', $actions, $record);
        return array_filter($actions);
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
        /** @var Tab $tab */
        $tab = Tab::create(
            'Details',
            TextField::create('Name', _t(__CLASS__.'.FILENAME', 'Filename')),
            $location = TreeDropdownField::create(
                'ParentID',
                _t(__CLASS__.'.FOLDERLOCATION', 'Location'),
                Folder::class
            )
                ->setShowSelectedPath(true)
        );

        $location
            ->setEmptyString(_t(__CLASS__.'.ROOTNAME', '(Top level)'))
            ->setShowSearch(true);
        return $tab;
    }

    /**
     * Get user-visible "Path" for this record
     *
     * @param File $record
     * @param array $context
     * @return string
     */
    protected function getPath($record, $context = [])
    {
        if ($record && $record->isInDB()) {
            if ($record->ParentID) {
                return $record->Parent()->getFilename();
            } else {
                return '/';
            }
        }
        if (isset($context['ParentID'])) {
            if ($context['ParentID'] === 0) {
                return '/';
            }
            /** @var File $file */
            $file = File::get()->byID($context['ParentID']);
            if ($file) {
                return $file->getFilename();
            }
        }
        return null;
    }

    /**
     * Build security tab
     *
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldSecurityTab($record, $context = [])
    {
        // Get permissions
        $viewersOptionsField = [
            'Inherit' => _t(__CLASS__.'.INHERIT', 'Inherit from parent folder'),
            'Anyone' => _t(__CLASS__.'.ANYONE', 'Anyone'),
            'LoggedInUsers' => _t(__CLASS__.'.LOGGED_IN', 'Logged-in users'),
            'OnlyTheseUsers' => _t(__CLASS__.'.ONLY_GROUPS', 'Only these groups (choose from list)')
        ];

        // No "Anyone" editors option
        $editorsOptionsField = $viewersOptionsField;
        unset($editorsOptionsField['Anyone']);

        return Tab::create(
            'Permissions',
            OptionsetField::create(
                'CanViewType',
                _t(__CLASS__.'.ACCESSHEADER', 'Who can view this file?')
            )
                ->setSource($viewersOptionsField),
            TreeMultiselectField::create(
                'ViewerGroups',
                _t(__CLASS__.'.VIEWERGROUPS', 'Viewer Groups')
            ),
            OptionsetField::create(
                "CanEditType",
                _t(__CLASS__.'.EDITHEADER', 'Who can edit this file?')
            )
                ->setSource($editorsOptionsField),
            TreeMultiselectField::create(
                'EditorGroups',
                _t(__CLASS__.'.EDITORGROUPS', 'Editor Groups')
            )
        );
    }

    public function getRequiredContext()
    {
        return ['Record'];
    }
}
