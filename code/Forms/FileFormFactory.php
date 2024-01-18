<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Admin\Forms\UsedOnTable;
use SilverStripe\Assets\File;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DatetimeField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HeaderField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\TextField;
use SilverStripe\Versioned\RecursivePublishable;
use SilverStripe\Versioned\Versioned;

class FileFormFactory extends AssetFormFactory
{

    /**
     * History tab/form to be shown to the user or not
     *
     * @var bool
     */
    private static $show_history = false;

    /**
     * @param File $record
     * @param array $context
     * @return TabSet
     */
    protected function getFormFieldTabs($record, $context = [])
    {
        // Add extra tab
        $tabs = TabSet::create('Editor');
        $type = $this->getFormType($context);

        // Unsupported media insertion will use insert link form instead
        if ($type === static::TYPE_INSERT_MEDIA) {
            if ($record->appCategory() !== 'image') {
                $type = static::TYPE_INSERT_LINK;
            }
        }

        switch ($type) {
            case static::TYPE_INSERT_MEDIA:
                $tabs->unshift($this->getFormFieldAttributesTab($record, $context));
                break;
            case static::TYPE_INSERT_LINK:
                $tabs->unshift($this->getFormFieldLinkOptionsTab($record, $context));
                break;
            case static::TYPE_SELECT:
            default:
                $tabs->push($this->getFormFieldDetailsTab($record, $context));
                $tabs->push($this->getFormFieldSecurityTab($record, $context));
                $tabs->push($this->getFormFieldUsageTab($record, $context));

                if ($this->config()->get('show_history')) {
                    $tabs->push($this->getFormFieldHistoryTab($record, $context));
                }

                if ($type === static::TYPE_SELECT) {
                    $tabs->setReadonly(true);
                }

                break;
        }

        return $tabs;
    }

    /**
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldDetailsTab($record, $context = [])
    {
        // Update details tab
        $tab = parent::getFormFieldDetailsTab($record, $context);

        $tab->insertBefore('Name', TextField::create("Title", File::singleton()->fieldLabel('Title')));

        $tab->push(
            DatetimeField::create(
                "Created",
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.CREATED', 'First uploaded')
            )
                ->setReadonly(true)
        );
        $tab->push(
            DatetimeField::create(
                "LastEdited",
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.LASTEDIT', 'Last changed')
            )
                ->setReadonly(true)
        );

        return $tab;
    }

    /**
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldUsageTab($record, $context = [])
    {
        $usedOnField = UsedOnTable::create('UsedOnTable');

        $tab = Tab::create(
            'Usage',
            _t(__CLASS__ . '.USAGE', 'Used on'),
            $usedOnField
        );

        return $tab;
    }

    /**
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldLinkOptionsTab($record, $context = [])
    {
        $tab = Tab::create(
            'LinkOptions',
            _t(__CLASS__ . '.LINKOPTIONS', 'Link options'),
            TextField::create(
                'Description',
                _t(__CLASS__ . '.LINKDESCR', 'Link description')
            ),
            CheckboxField::create(
                'TargetBlank',
                _t(__CLASS__ . '.LINKOPENNEWWIN', 'Open in new window/tab')
            )
        );

        if ($context['RequireLinkText']) {
            $tab->insertBefore('Description', TextField::create('Text', _t(__CLASS__ . '.LINKTEXT', 'Link text')));
        }

        return $tab;
    }

    /**
     * Create tab for file attributes
     *
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldAttributesTab($record, $context = [])
    {
        return Tab::create(
            'Placement',
            HeaderField::create(_t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Placement',
                'Placement'
            )),
            LiteralField::create(
                'AttributesDescription',
                '<p>' . _t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AttributesDescription',
                    'These changes will only affect this particular placement of the file.'
                ) . '</p>'
            ),
            TextField::create('Caption', _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Caption', 'Caption'))
        );
    }

    /**
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldHistoryTab($record, $context = [])
    {
        return Tab::create(
            'History',
            HistoryListField::create('HistoryList')
                ->setRecord($record)
        );
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
        $record = $context['Record'];

        // Add status flag before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) use ($record, $context) {
            if ($this->getFormType($context) === static::TYPE_INSERT_MEDIA) {
                if ($record->appCategory() !== 'image') {
                    $unembedableMsg = _t(
                        __CLASS__ . '.UNEMEDABLE_MESSAGE',
                        '<p class="alert alert-info alert--no-border editor__top-message">' .
                        'This file type can only be inserted as a link. You can edit the link once it is inserted.' .
                        '</p>'
                    );
                    $fields->unshift(LiteralField::create('UnembedableMessage', $unembedableMsg));
                }
            }
            $fields->insertAfter(
                'TitleHeader',
                LiteralField::create('FileSpecs', $this->getSpecsMarkup($record))
            );
            $fields->push(HiddenField::create('FileFilename'));
            $fields->push(HiddenField::create('FileHash'));
            $fields->push(HiddenField::create('FileVariant'));
        });

        return parent::getFormFields($controller, $formName, $context);
    }

    /**
     * Get publish action
     *
     * @param File $record
     * @return FormAction
     */
    protected function getPublishAction($record)
    {
        if (!$record || !$record->canPublish()) {
            return null;
        }

        // Build action
        $publishText = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.PUBLISH_BUTTON', 'Publish');
        $action = FormAction::create('publish', $publishText)
            ->setIcon('rocket')
            ->setSchemaState([
                'data' => [
                    'isPublished' => $record->isPublished(),
                    'isModified' => $record->isModifiedOnDraft(),
                    'pristineTitle' => _t(__CLASS__ . '.PUBLISHED', 'Published'),
                    'pristineIcon' => 'tick',
                    'dirtyTitle' => _t(__CLASS__ . '.PUBLISH', 'Publish'),
                    'dirtyIcon' => 'rocket',
                    'pristineClass' => 'btn-outline-primary',
                    'dirtyClass' => 'btn-primary',
                ],
            ]);

        return $action;
    }

    /**
     * @param RequestHandler|null $controller
     * @param string $formName
     * @param array $context
     * @return FieldList
     */
    protected function getFormActions(RequestHandler $controller = null, $formName, $context = [])
    {
        $record = $context['Record'];
        $fileSelected = $context['FileSelected'] ?? false;
        $type = $this->getFormType($context);

        $actionItems = [];
        if ($type === static::TYPE_INSERT_MEDIA || $type === static::TYPE_SELECT) {
            $action = $this->getInsertAction($record);
            if ($action) {
                $actionLabel = $fileSelected
                    ? _t('AssetAdmin.UPDATE_FILE', 'Update file')
                    : _t('AssetAdmin.INSERT_FILE', 'Insert file');
                $action->setTitle($actionLabel);
                $actionItems[] = $action;
            }
        } elseif ($type === static::TYPE_INSERT_LINK) {
            $actionItems = array_filter([
                $this->getInsertLinkAction($record),
            ]);
        } else {
            $actionItems = array_filter([
                $this->getSaveAction($record),
                $this->getPublishAction($record)
            ]);
        }

        // Group all actions
        if (count($actionItems ?? []) > 1) {
            $actionItems = [
                FieldGroup::create($actionItems)
                    ->setName('Actions')
                    ->addExtraClass('btn-group')
            ];
        }

        if ($type === static::TYPE_ADMIN) {
            // Add popover
            $popover = $this->getPopoverMenu($record);
            if ($popover) {
                $actionItems[] = $popover;
            }
        }

        // Build
        $actions = new FieldList($actionItems);

        // Update
        $this->invokeWithExtensions('updateFormActions', $actions, $controller, $formName, $context);
        return $actions;
    }

    /**
     * get HTML for status icon
     *
     * @param File $record
     * @return null|string
     */
    protected function getSpecsMarkup($record)
    {
        if (!$record || !$record->exists()) {
            return null;
        }
        return sprintf(
            '<div class="editor__specs">%s %s</div>',
            $record->getSize(),
            $this->getStatusFlagMarkup($record)
        );
    }

    /**
     * Get published status flag
     *
     * @param File $record
     * @return null|string
     */
    protected function getStatusFlagMarkup($record)
    {
        if (is_null($record)) {
            return null;
        }

        $html = '';
        $hasRestrictedAccess = $record->hasRestrictedAccess();

        if ($hasRestrictedAccess) {
            $title = _t('SilverStripe\\Admin\\FileStatusIcon.ACCESS_RESTRICTED', 'Restricted access');
            $html .= $this->buildFileStatusIcon($title, 'font-icon-user-lock');
        }

        if ($record->isTrackedFormUpload()) {
            $title = $hasRestrictedAccess
                ? _t('SilverStripe\\Admin\\FileStatusIcon.TRACKED_FORM_UPLOAD_RESTRICTED', 'Form submission')
                : _t(
                    'SilverStripe\\Admin\\FileStatusIcon.TRACKED_FORM_UPLOAD_UNRESTRICTED',
                    'Form submission, unrestricted access'
                );
            $fontClass = $hasRestrictedAccess ? 'font-icon-address-card' : 'font-icon-address-card-warning';
            $html .= $this->buildFileStatusIcon($title, $fontClass);
        }

        if ($statusTitle = $record->getStatusTitle()) {
            $html .= sprintf('<span class="editor__status-flag">%s</span>', $statusTitle);
        }

        return $html;
    }

    /**
     * Get action for publishing
     *
     * @param File $record
     * @return FormAction
     */
    protected function getUnpublishAction($record)
    {
        // Check if record is unpublishable
        if (!$record || !$record->isInDB() || !$record->isPublished() || !$record->canUnpublish()) {
            return null;
        }

        // Count live owners
        /** @var Versioned|RecursivePublishable $liveRecord */
        $liveRecord = Versioned::get_by_stage($record->baseClass(), Versioned::LIVE)
            ->byID($record->ID);
        $liveOwners = $liveRecord->findOwners(false)->count();

        // Build action
        $unpublishText = _t(
            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.UNPUBLISH_BUTTON',
            'Unpublish'
        );
        $action = FormAction::create('unpublish', $unpublishText)
            ->setIcon('cancel-circled')
            ->setSchemaData(['data' => ['owners' => $liveOwners]]);
        return $action;
    }

    /**
     * Get Replace file action
     *
     * @param File $record
     * @return FormAction
     */
    protected function getReplaceFileAction($record)
    {
        // Check if record exists and user has correct permissions
        if (!$record || !$record->isInDB() || !$record->canEdit()) {
            return null;
        }

        $action = FormAction::create('replacefile', _t(__CLASS__ . '.REPLACE_FILE', 'Replace file'))
            ->setIcon('upload');

        return $action;
    }

    /**
     * Get Download file action
     *
     * @param File $record
     * @return FormAction
     */
    protected function getDownloadFileAction($record)
    {
        // Check if record exists and user has correct permissions
        if (!$record || !$record->isInDB() || !$record->canEdit()) {
            return null;
        }

        $action = FormAction::create('downloadfile', _t(__CLASS__ . '.DOWNLOAD_FILE', 'Download file'))
            ->setIcon('down-circled');

        return $action;
    }

    /**
     * Get actions that go into the Popover menu
     *
     * @param $record
     * @return array
     */
    protected function getPopoverActions($record)
    {
        $this->beforeExtending('updatePopoverActions', function (&$actions, $record) {
            // add the unpublish and replace file actions to the start of the array
            array_unshift($actions, $this->getUnpublishAction($record));
            array_unshift($actions, $this->getDownloadFileAction($record));
            array_unshift($actions, $this->getReplaceFileAction($record));
        });

        return parent::getPopoverActions($record);
    }

    /**
     * @param File $record
     * @return FormAction
     */
    protected function getInsertAction($record)
    {
        $action = null;
        if ($record && $record->isInDB() && $record->canView()) {
            $action = FormAction::create('insert', 'Insert')
                ->setIcon('plus-circled')
                ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);
        }
        return $action;
    }

    /**
     * @param File $record
     * @return FormAction
     */
    protected function getInsertLinkAction($record)
    {
        $action = null;
        if ($record && $record->isInDB() && $record->canView()) {
            $action = FormAction::create('insert', _t(__CLASS__ . '.INSERT_LINK', 'Link to file'))
                ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);
        }
        return $action;
    }

    /**
     * @return array
     */
    public function getRequiredContext()
    {
        return parent::getRequiredContext() + ['RequireLinkText'];
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
        $validator = parent::getValidator($controller, $formName, $context);

        if (isset($context['RequireLinkText']) && $context['RequireLinkText']) {
            $validator->addRequiredField('Text');
        }

        return $validator;
    }
}
