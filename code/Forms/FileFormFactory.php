<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Control\Controller;
use SilverStripe\Forms\DatetimeField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\PopoverField;
use SilverStripe\Forms\ReadonlyField;
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
            $this->getFormFieldUsageTab($record, $context)
        );

        if (isset($context['Type']) && $context['Type'] === 'insert') {
            $tabs->setReadonly(true);

            $tabs->unshift($this->getFormFieldAttributesTab($record, $context));
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
            DatetimeField::create("Created", _t('AssetTableField.CREATED', 'First uploaded'))
                ->setReadonly(true),
            DatetimeField::create("LastEdited", _t('AssetTableField.LASTEDIT', 'Last changed'))
                ->setReadonly(true)
        );
    }

    protected function getFormFieldDetailsTab($record, $context = [])
    {
        // Update details tab
        $tab = Tab::create(
            'Details',
            TextField::create("Title", File::singleton()->fieldLabel('Title')),
            TextField::create('Name', File::singleton()->fieldLabel('Filename')),
            ReadonlyField::create("Path", _t('AssetTableField.PATH', 'Path'), $this->getPath($record))
        );

        if (isset($context['Type']) && $context['Type'] === 'insert') {
            $tab->push(LiteralField::create('EditLink',
                sprintf('<a href="%s" class="%s" target="_blank"><i class="%s" />%s</a>',
                    $record->CMSEditLink(),
                    'btn btn-secondary editor__edit-link',
                    'font-icon-edit',
                    _t('AssetAdmin.EditLink', 'Edit original file')
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
            'Attributes',
            LiteralField::create('AttributesDescription',
                '<p>'. _t(
                    'AssetAdmin.AttributesDescription',
                    'These changes will only affect the attributes of this particular file.'
                ) .'</p>'
            ),
            TextField::create('Caption', _t('AssetAdmin.Caption', 'Caption'))
        );
    }

    protected function getFormFields(Controller $controller, $name, $context = [])
    {
        $record = $context['Record'];

        // Add status flag before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) use ($record) {
            $fields->insertAfter(
                'TitleHeader',
                LiteralField::create('FileSpecs', $this->getSpecsMarkup($record))
            );
        });

        return parent::getFormFields($controller, $name, $context);
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
        return FormAction::create('publish', $publishText)
            ->setIcon('rocket')
            ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);
    }

    protected function getFormActions(Controller $controller, $name, $context = [])
    {
        $record = $context['Record'];

        if (isset($context['Type']) && $context['Type'] === 'insert') {
            $actions = new FieldList(array_filter([
                $this->getInsertAction($record),
            ]));
        } else {
            // Build top level bar
            $actions = new FieldList(array_filter([
                $this->getSaveAction($record),
                $this->getPublishAction($record),
                $this->getPopoverMenu($record),
            ]));
        }

        // Update
        $this->invokeWithExtensions('updateFormActions', $actions, $controller, $name, $context);
        return $actions;
    }

    /**
     * Get raw HTML for image markup
     *
     * @param File $file
     * @return string
     */
    protected function getIconMarkup($file)
    {
        $markup = parent::getIconMarkup($file);
        if (!$markup) {
            return null;
        }
        if (!$file->exists()) {
            return sprintf('<div class="%s">%s</div>',
                'editor__file-preview-message--file-missing',
                _t('AssetAdmin.FILE_MISSING', 'File cannot be found')
            );
        }
        $link = $file->Link();
        $linkedImage = sprintf(
            '<a class="%s" href="%s" target="_blank">%s</a>',
            'editor__file-preview-link',
            $link,
            $markup
        );
        return $linkedImage;
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
     * Get user-visible "Path" for this record
     *
     * @param File $record
     * @return string
     */
    protected function getPath($record)
    {
        if ($record && $record->isInDB()) {
            if ($record->ParentID) {
                return $record->Parent()->getFilename();
            } else {
                return '/';
            }
        }
        return null;
    }

    /**
     * Get action for adding to campaign
     *
     * @param File $record
     * @return FormAction|null
     */
    protected function getAddToCampaignAction($record)
    {
        if ($record && $record->canPublish()) {
            return FormAction::create(
                'addtocampaign',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ADDTOCAMPAIGN', 'Add to campaign')
            );
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
     * Build popup menu
     *
     * @param File $record
     * @return PopoverField
     */
    protected function getPopoverMenu($record)
    {
        // Build popover actions
        $popoverActions = array_filter([
            $this->getAddToCampaignAction($record),
            $this->getUnpublishAction($record),
            $this->getDeleteAction($record)
        ]);
        if ($popoverActions) {
            return PopoverField::create($popoverActions)
                ->setPlacement('top');
        }
        return null;
    }

    /**
     * @param File $record
     * @return FormAction
     */
    protected function getInsertAction($record)
    {
        if ($record && $record->isInDB() && $record->canEdit()) {
            return FormAction::create('insert', _t('CMSMain.INSERT', 'Insert'))
                ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);
        }
        return null;
    }

}
