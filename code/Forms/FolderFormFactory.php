<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Forms\FieldList;
use SilverStripe\Assets\Folder;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Control\RequestHandler;

/**
 * Empty form factory, because the defaults from AssetFormFactory was enough
 */
class FolderFormFactory extends AssetFormFactory
{

    protected function getFormFields(RequestHandler $controller = null, $name, $context = [])
    {
        /** @var Folder $record */
        $record = $context['Record'] ?? null;

        // Add delete action as top level button before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) use ($record) {
            $preview = $fields->fieldByName('PreviewImage');
            $name = $fields->dataFieldByName('Name');

            if ($name) {
                $name->setTitle(_t(__CLASS__ . '.FOLDERNAME', 'Folder name'));
            }

            if ($preview) {
                $preview->addExtraClass('editor__file-preview--folder');
            }

            // $record will be null when creating a new folder
            if (!is_null($record)) {
                $fields->insertAfter(
                    'TitleHeader',
                    LiteralField::create('FileSpecs', $this->getStatusMarkup($record))
                );

                $fieldGroup = $fields->fieldByName('AssetEditorHeaderFieldGroup');
                if ($fieldGroup) {
                    $fieldGroup->addExtraClass('editor-header-folder');
                }
            }
        });

        return parent::getFormFields($controller, $name, $context);
    }

    /**
     * @param Folder $record
     * @return string
     */
    private function getStatusMarkup(Folder $record): string
    {
        if (!$record->hasRestrictedAccess()) {
            return '';
        }
        $title = _t('SilverStripe\\Admin\\FileStatusIcon.ACCESS_RESTRICTED', 'Restricted access');
        return $this->buildFileStatusIcon($title, 'font-icon-user-lock');
    }
}
