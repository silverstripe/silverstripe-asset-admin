<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\DatetimeField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\TextField;

class FileFormFactory extends AssetFormFactory
{
    protected function getFormFieldTabs($record, $context = [])
    {
        // Add extra tab
        $tabs = TabSet::create(
            'Editor',
            $this->getFormFieldDetailsTab($record, $context),
            $this->getFormFieldSecurityTab($record, $context),
            $this->getFormFieldUsageTab($record, $context),
            $this->getFormFieldHistoryTab($record, $context)
        );

        // All non-admin forms are typically readonly
        switch ($this->getFormType($context)) {
            case static::TYPE_INSERT:
                $tabs->setReadonly(true);
                $tabs->unshift($this->getFormFieldAttributesTab($record, $context));
                break;
            case static::TYPE_SELECT:
                $tabs->setReadonly(true);
                break;
        }

        return $tabs;
    }

    /**
     * Build "Usage" tab
     *
     * @param File $record
     * @param array $context
     * @return Tab
     */
    protected function getFormFieldUsageTab($record, $context = [])
    {
        // Add new tab for usage
        return Tab::create(
            'Usage',
            DatetimeField::create(
                "Created",
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.CREATED', 'First uploaded')
            )
                ->setReadonly(true),
            DatetimeField::create(
                "LastEdited",
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.LASTEDIT', 'Last changed')
            )
                ->setReadonly(true)
        );
    }

    protected function getFormFieldDetailsTab($record, $context = [])
    {
        // Update details tab
        $tab = parent::getFormFieldDetailsTab($record, $context);

        $tab->insertBefore('Name', TextField::create("Title", File::singleton()->fieldLabel('Title')));
        
        if ($this->getFormType($context) !== static::TYPE_ADMIN) {
            $tab->push(LiteralField::create(
                'EditLink',
                sprintf(
                    '<a href="%s" class="%s" target="_blank"><i class="%s" />%s</a>',
                    $record->CMSEditLink(),
                    'btn btn-secondary-outline font-icon-edit editor__edit-link',
                    '',
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.EditLink', 'Edit original file')
                )
            ));
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
            LiteralField::create(
                'AttributesDescription',
                '<p>'. _t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AttributesDescription',
                    'These changes will only affect this particular placement of the file.'
                ) .'</p>'
            ),
            TextField::create('Caption', _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Caption', 'Caption'))
        );
    }

    protected function getFormFieldHistoryTab($record, $context = [])
    {
        return Tab::create(
            'History',
            HistoryListField::create('HistoryList')
                ->setRecord($record)
        );
    }

    protected function getFormFields(RequestHandler $controller = null, $formName, $context = [])
    {
        /** @var File $record */
        $record = $context['Record'];

        // Add status flag before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) use ($record) {
            // @todo move specs to a component/class, so it can update specs when a File is replaced
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
        /** @var FormAction $action */
        $action = FormAction::create('publish', $publishText)
            ->setIcon('rocket')
            ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);

        return $action;
    }

    protected function getFormActions(RequestHandler $controller = null, $formName, $context = [])
    {
        $record = $context['Record'];

        if ($this->getFormType($context) !== static::TYPE_ADMIN) {
            $actionItems = array_filter([
                $this->getInsertAction($record),
            ]);
        } else {
            $actionItems = array_filter([
                $this->getSaveAction($record),
                $this->getPublishAction($record)
            ]);
        }

        // Group all actions
        if (count($actionItems) > 1) {
            $actionItems = [
                FieldGroup::create($actionItems)
                    ->setName('Actions')
                    ->addExtraClass('btn-group')
            ];
        }

        // Add popover
        $popover = $this->getPopoverMenu($record);
        if ($popover) {
            $actionItems[] = $popover;
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
        if ($record && ($statusTitle = $record->getStatusTitle())) {
            return "<span class=\"editor__status-flag\">{$statusTitle}</span>";
        }
        return null;
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
        if (!$record || !$record->isPublished() || !$record->canUnpublish()) {
            return null;
        }

        // Build action
        $unpublishText = _t(
            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.UNPUBLISH_BUTTON',
            'Unpublish'
        );
        return FormAction::create('unpublish', $unpublishText)
            ->setIcon('cancel-circled');
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
            // add the unpublish action to the start of the array
            array_unshift($actions, $this->getUnpublishAction($record));
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
        if ($record && $record->isInDB() && $record->canEdit()) {
            /** @var FormAction $action */
            $action = FormAction::create('insert', _t(__CLASS__.'.INSERT_FILE', 'Insert file'))
                ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);
        }
        return $action;
    }
}
