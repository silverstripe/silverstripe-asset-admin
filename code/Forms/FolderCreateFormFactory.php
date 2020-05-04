<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;

class FolderCreateFormFactory extends FolderFormFactory
{
    public function getRequiredContext()
    {
        return ['ParentID'];
    }

    public function getFormFields(RequestHandler $controller = null, $name, $context = [])
    {
        // Add status flag before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) use ($context) {
            $record = Folder::create();
            $fields->insertAfter(
                'TitleHeader',
                PreviewImageField::create('PreviewImage')
                    ->setSchemaState([
                        'data' => [
                            'mock' => true,
                            'preview' => $record->PreviewLink(),
                            'category' => $record instanceof Folder ? 'folder' : $record->appCategory(),
                        ]
                    ])
                    ->addExtraClass('editor__file-preview')
                    ->addExtraClass('editor__file-preview--folder')
            );
            $fields->push(HiddenField::create('ParentID', null, $context['ParentID']));

            $title = $fields->fieldByName('AssetEditorHeaderFieldGroup.TitleHeader');
            $titleNew = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.NewFile', 'New {file}', [
                'file' => Folder::singleton()->i18n_singular_name()
            ]);
            $title->setTitle($titleNew);
        });

        return parent::getFormFields($controller, $name, $context);
    }

    /**
     * @param File $record
     * @return FormAction
     */
    protected function getSaveAction($record)
    {
        return FormAction::create('createfolder', _t(__CLASS__.'.CREATE', 'Create'))
            ->setIcon('plus-circled')
            ->setSchemaData(['data' => ['buttonStyle' => 'primary']]);
    }

    /**
     * @param File $record
     * @return null
     */
    protected function getDeleteAction($record)
    {
        return null;
    }
}
