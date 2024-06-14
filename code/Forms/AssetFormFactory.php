<?php

namespace SilverStripe\AssetAdmin\Forms;

use InvalidArgumentException;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\HeaderField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\ListboxField;
use SilverStripe\Forms\OptionsetField;
use SilverStripe\Forms\PopoverField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\TreeDropdownField;
use SilverStripe\Forms\TreeMultiselectField;
use SilverStripe\Security\InheritedPermissions;
use SilverStripe\Security\Member;
use SilverStripe\VersionedAdmin\Extensions\FileArchiveExtension;
use SilverStripe\Forms\SearchableMultiDropdownField;

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
            if ($this->getFormType($context) === AssetFormFactory::TYPE_ADMIN && !$record->canEdit()) {
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
            $action = FormAction::create('save', _t(__CLASS__ . '.SAVE', 'Save'))
                ->setIcon('save')
                ->setSchemaState([
                    'data' => [
                        'pristineTitle' => _t(__CLASS__ . '.SAVED', 'Saved'),
                        'pristineIcon' => 'tick',
                        'dirtyTitle' => _t(__CLASS__ . '.SAVE', 'Save'),
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
        $archiveFiles = class_exists(FileArchiveExtension::class) && File::singleton()->isArchiveFieldEnabled();
        if ($record && $record->isInDB() && $record->canDelete()) {
            if ($archiveFiles) {
                $deleteText = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ARCHIVE_BUTTON', 'Archive');
            } else {
                $deleteText = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.DELETE_BUTTON', 'Delete');
            }
            return FormAction::create('delete', $deleteText)
                ->setIcon($archiveFiles ? 'box' : 'trash-bin');
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
        /** @var File $record */
        $record = isset($context['Record']) ? $context['Record'] : null;

        // Build standard fields for all folders / files
        $fields = new FieldList(
            FieldGroup::create(
                HeaderField::create('TitleHeader', $record ? $record->Title : null, 1)
                    ->addExtraClass('editor__heading')
            )->setName('AssetEditorHeaderFieldGroup'),
            $this->getFormFieldTabs($record, $context)
        );
        if ($record) {
            $previewField = PreviewImageField::create('PreviewImage')
                ->setRecordID($record->ID)
                ->addExtraClass('editor__file-preview');

            if ($this->getFormType($context) !== AssetFormFactory::TYPE_ADMIN) {
                $previewField->performReadonlyTransformation();
            }

            $fields->push(HiddenField::create('ID', $record->ID));
            $fields->insertAfter('AssetEditorHeaderFieldGroup', $previewField);
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
        return array_filter($actions ?? []);
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
        $tab = Tab::create(
            'Details',
            TextField::create('Name', _t(__CLASS__ . '.FILENAME', 'Filename')),
            $location = TreeDropdownField::create(
                'ParentID',
                _t(__CLASS__ . '.FOLDERLOCATION', 'Location'),
                Folder::class
            )
                ->setShowSelectedPath(true)
        );


        if (!$record instanceof Folder) {
            $tab->push(
                CheckboxField::create(
                    'ShowInSearch',
                    _t(__CLASS__ . '.SHOWINSEARRCH', 'Show in search?')
                )
            );
        }


        $location
            ->setEmptyString(_t(__CLASS__ . '.ROOTNAME', '(Top level)'))
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
            InheritedPermissions::INHERIT => _t(__CLASS__ . '.INHERIT', 'Inherit from parent folder'),
            InheritedPermissions::ANYONE => _t(__CLASS__ . '.ANYONE', 'Anyone'),
            InheritedPermissions::LOGGED_IN_USERS => _t(__CLASS__ . '.LOGGED_IN', 'Logged-in users'),
            InheritedPermissions::ONLY_THESE_USERS => _t(__CLASS__ . '.ONLY_GROUPS', 'Only these groups (choose from list)'),
            InheritedPermissions::ONLY_THESE_MEMBERS => _t(__CLASS__ . '.ONLY_MEMBERS', 'Only these users (choose from list)'),
        ];

        // No "Anyone" editors option
        $editorsOptionsField = $viewersOptionsField;
        unset($editorsOptionsField[InheritedPermissions::ANYONE]);

        $tab = Tab::create(
            'Permissions',
            OptionsetField::create(
                'CanViewType',
                _t(__CLASS__ . '.ACCESSHEADER', 'Who can view this file?')
            )
                ->setSource($viewersOptionsField),
            TreeMultiselectField::create(
                'ViewerGroups',
                _t(__CLASS__ . '.VIEWERGROUPS', 'Viewer Groups')
            ),
            SearchableMultiDropdownField::create(
                'ViewerMembers',
                _t(__CLASS__ . '.VIEWERMEMBERS', 'Viewer Users'),
                Member::get()
            )
                ->setIsLazyLoaded(true)
                ->setUseSearchContext(true),
            OptionsetField::create(
                "CanEditType",
                _t(__CLASS__ . '.EDITHEADER', 'Who can edit this file?')
            )
                ->setSource($editorsOptionsField),
            TreeMultiselectField::create(
                'EditorGroups',
                _t(__CLASS__ . '.EDITORGROUPS', 'Editor Groups')
            ),
            SearchableMultiDropdownField::create(
                'EditorMembers',
                _t(__CLASS__ . '.EDITORMEMBERS', 'Editor Users'),
                Member::get()
            )
                ->setIsLazyLoaded(true)
                ->setUseSearchContext(true)
        );

        return $tab;
    }

    public function getRequiredContext()
    {
        return ['Record'];
    }

    /**
     * @param string $title
     * @param string $fontClass
     * @return string
     */
    protected function buildFileStatusIcon(string $title, string $fontClass): string
    {
        // https://getbootstrap.com/docs/4.4/components/tooltips/
        // Specifying data-delay as an html attribute means that show and hide must be the same value unfortunately
        // Cannot data-delay="{show: 300, hide: 0}" as it will be interpreted as a string, not (number|object)
        return <<<EOT
            <div class="file-status-icon">
                <span title="$title"
                      class="icon file-status-icon__icon $fontClass"
                      data-toggle="tooltip"
                      data-placement="top"
                      data-delay="150"
                      data-animation="false">
                </span>
            </div>
EOT;
    }
}
