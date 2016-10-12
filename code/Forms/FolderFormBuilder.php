<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Forms\FieldList;

class FolderFormFactory extends AssetFormFactory
{

    /**
     * Build basic actions
     *
     * @return FieldList
     */
    protected function getFormActions()
    {
        // Add delete action as top level button before extensions are triggered
        $this->beforeExtending('updateFormActions', function (FieldList $actions) {
            if ($deleteAction = $this->getDeleteAction()) {
                $actions->push($deleteAction);
            }
        });
        return parent::getFormActions();
    }
}
