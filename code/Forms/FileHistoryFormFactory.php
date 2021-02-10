<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\ReadonlyField;

class FileHistoryFormFactory extends FileFormFactory
{
    public function getForm(RequestHandler $controller = null, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
        $context['RequireLinkText'] = false;
        $form = parent::getForm($controller, $name, $context);
        $form->makeReadonly();
        return $form;
    }

    protected function getSpecsMarkup($record)
    {
        if (!$record || !$record->isInDB()) {
            return null;
        }

        $versionTag = sprintf(
            '<span class="badge badge-info">v.%s</span>',
            $record->Version
        );
        $agoTag = sprintf(
            '%s <time class="relative-time" title="%s">%s</time>',
            $record->WasPublished
                ? _t(__CLASS__ . '.PUBLISHED', 'Published')
                : _t(__CLASS__ . '.SAVED', 'Saved'),
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

    protected function getFormFields(RequestHandler $controller = null, $name, $context = [])
    {
        $record = $context['Record'];

        $fields = new FieldList(
            LiteralField::create('FileSpecs', $this->getSpecsMarkup($record)),
            ReadonlyField::create("Title", File::singleton()->fieldLabel('Title')),
            ReadonlyField::create('Name', File::singleton()->fieldLabel('Filename')),
            ReadonlyField::create(
                "Path",
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.PATH', 'Path'),
                $this->getPath($record)
            )
        );

        $this->invokeWithExtensions('updateFormFields', $fields, $controller, $name, $context);

        return $fields;
    }


    protected function getFormActions(RequestHandler $controller = null, $formName, $context = [])
    {
        $actions = new FieldList();
        // Update
        $this->invokeWithExtensions('updateFormActions', $actions, $controller, $formName, $context);

        return $actions;
    }

    public function getRequiredContext()
    {
        return ['Record'];
    }
}
