<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Control\Controller;
use SilverStripe\Forms\FieldList;

class FolderFormFactory extends AssetFormFactory
{

    protected function getFormActions(Controller $controller, $name, $context = [])
    {
        $record = isset($context['Record']) ? $context['Record'] : null;

        // Add delete action as top level button before extensions are triggered
        $this->beforeExtending('updateFormActions', function (FieldList $actions) use ($record) {
            if ($deleteAction = $this->getDeleteAction($record)) {
                $actions->push($deleteAction);
            }
        });

        return parent::getFormActions($controller, $name, $context);
    }
}
