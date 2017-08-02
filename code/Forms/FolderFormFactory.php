<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\FieldList;

/**
 * Empty form factory, because the defaults from AssetFormFactory was enough
 */
class FolderFormFactory extends AssetFormFactory
{
    protected function getFormFields(RequestHandler $controller = null, $name, $context = [])
    {
        // Add delete action as top level button before extensions are triggered
        $this->beforeExtending('updateFormFields', function (FieldList $fields) {
            $preview = $fields->fieldByName('PreviewImage');

            if ($preview) {
                $preview->addExtraClass('editor__file-preview--folder');
            }
        });

        return parent::getFormFields($controller, $name, $context);
    }
}
