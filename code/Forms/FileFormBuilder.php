<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\DatetimeField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HTMLReadonlyField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\PopoverField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Forms\TextField;

class FileFormFactory extends AssetFormFactory
{

    /**
     * Get markdown for clickable link
     *
     * @return string HTML markdown for link
     */
    protected function getClickableLinkMarkdown()
    {
        /** @var File $record */
        $record = $this->getRecord();
        if (!$record->isInDB()) {
            return null;
        }
        $link = $record->Link();
        $clickableLink = sprintf(
            '<i class="%1$s"></i><a href="%2$s" target="_blank">%2$s</a>',
            'font-icon-link btn--icon-large form-control-static__icon',
            Convert::raw2xml($link)
        );
        return $clickableLink;
    }

    protected function getFormFieldTabs()
    {
        // Add extra tab
        $tabs = TabSet::create(
            'Editor',
            $this->getFormFieldDetailsTab(),
            $this->getFormFieldUsageTab()
        );
        $this->extendAll('updateFormFieldTabs', $tabs);
        return $tabs;
    }

    /**
     * Build "Usage" tab
     *
     * @return Tab
     */
    protected function getFormFieldUsageTab()
    {
        // Add new tab for usage
        return Tab::create(
            'Usage',
            DatetimeField::create("Created", _t('AssetTableField.CREATED', 'First uploaded'))
                ->setReadonly(true),
            DatetimeField::create("LastEdited", _t('AssetTableField.LASTEDIT', 'Last changed'))
                ->setReadonly(true)
        );
    }

    protected function getFormFieldDetailsTab()
    {
        // Update details tab
        return Tab::create(
            'Details',
            TextField::create("Title", $this->record->fieldLabel('Title')),
            TextField::create('Name', $this->getRecord()->fieldLabel('Filename')),
            ReadonlyField::create("Path", _t('AssetTableField.PATH', 'Path'), $this->getPath()),
            HTMLReadonlyField::create(
                'ClickableURL',
                _t('AssetTableField.URL', 'URL'),
                $this->getClickableLinkMarkdown()
            )
        );
    }

    protected function getFormFields()
    {
        // Add status flag before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) {
            $fields->insertAfter(
                'TitleHeader',
                LiteralField::create('FileSpecs', $this->getSpecsMarkup())
            );
        });
        return parent::getFormFields();
    }

    /**
     * Get publish action
     *
     * @return FormAction
     */
    protected function getPublishAction()
    {
        /** @var File $record */
        $record = $this->getRecord();
        if (!$record->canPublish()) {
            return null;
        }

        // Build action
        $publishText = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.PUBLISH_BUTTON', 'Publish');
        return FormAction::create('publish', $publishText)
            ->setIcon('rocket')
            ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);
    }

    protected function getFormActions()
    {
        // Build top level bar
        $actions = new FieldList(array_filter([
            $this->getSaveAction(),
            $this->getPublishAction(),
            $this->getPopoverMenu()
        ]));

        // Update
        $this->extendAll('updateFormActions', $actions);
        return $actions;
    }

    /**
     * get HTML for status icon
     *
     * @return string|null
     */
    protected function getSpecsMarkup()
    {
        /** @var File $record */
        $record = $this->getRecord();
        if (!$record->isInDB()) {
            return null;
        }
        return sprintf(
            '<div class="editor__specs">%s %s</div>',
            $record->getSize(),
            $this->getStatusFlagMarkup()
        );
    }

    /**
     * Get published status flag
     *
     * @return null|string
     */
    protected function getStatusFlagMarkup()
    {
        /** @var File $record */
        $record = $this->getRecord();
        $statusTitle = $record->getStatusTitle();
        if ($statusTitle) {
            return "<span class=\"editor__status-flag\">{$statusTitle}</span>";
        }
        return null;
    }

    /**
     * Get user-visible "Path" for this record
     *
     * @return string
     */
    protected function getPath()
    {
        /** @var File $record */
        $record = $this->getRecord();
        if (!$record->isInDB()) {
            return null;
        }
        $path = $record->ParentID ? $record->Parent()->getFilename() : '/';
        return $path;
    }

    /**
     * Get action for adding to campaign
     *
     * @return FormAction
     */
    protected function getAddToCampaignAction()
    {
        return FormAction::create(
            'addtocampaign',
            _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ADDTOCAMPAIGN', 'Add to campaign')
        );
    }

    /**
     * Get action for publishing
     *
     * @return FormAction
     */
    protected function getUnpublishAction()
    {
        // Check if record is unpublishable
        /** @var File $record */
        $record = $this->getRecord();
        if (!$record->isPublished() || !$record->canUnpublish()) {
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
     * Build popup menu
     *
     * @return PopoverField
     */
    protected function getPopoverMenu()
    {
        // Build popover actions
        $popoverActions = array_filter([
            $this->getAddToCampaignAction(),
            $this->getUnpublishAction(),
            $this->getDeleteAction()
        ]);
        if ($popoverActions) {
            return PopoverField::create($popoverActions)
                ->setPlacement('top');
        }
        return null;
    }
}
