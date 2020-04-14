<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\LiteralField;

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
                $name->setTitle(_t(__CLASS__.'.FOLDERNAME', 'Folder name'));
            }

            if ($preview) {
                $preview->addExtraClass('editor__file-preview--folder');
            }

            // $record will be null when creating a new folder
            if ($record) {
                $fields->insertAfter(
                    'TitleHeader',
                    LiteralField::create('FileSpecs', $this->getStatusMarkup($record))
                );
            }
        });
        return parent::getFormFields($controller, $name, $context);
    }

    private function getStatusMarkup($record): string
    {
        if (is_null($record)) {
            return '';
        }

        $store = $record->canViewAnonymous() ? 'public' : 'protected';
        $title = ucfirst($store);
        $html = '<span title="' . $title . '" class="gallery-item--' . $store . '" style="display:inline-block"></span>';

        if ($record->hasChildUserDefinedFormUploads()) {
            $html .= '<span title="UserDefinedForm upload" class="gallery-item--userdefinedform-upload" style="display:inline-block"></span>';
        }

        return $html;
    }
}
