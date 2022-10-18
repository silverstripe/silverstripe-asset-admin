<?php

namespace SilverStripe\AssetAdmin\BatchAction;

use SilverStripe\Admin\CMSBatchAction;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Convert;
use SilverStripe\ORM\SS_List;

/**
 * Delete multiple {@link Folder} records (and the associated filesystem nodes).
 * Usually used through the {@link AssetAdmin} interface.
 */
class DeleteAssets extends CMSBatchAction
{
    public function getActionTitle()
    {
        return _t(__CLASS__.'.TITLE', 'Delete folders');
    }

    public function run(SS_List $records): HTTPResponse
    {
        $status = array(
            'modified'=>array(),
            'deleted'=>array()
        );

        foreach ($records as $record) {
            $id = $record->ID;

            // Perform the action
            if ($record->canDelete()) {
                $record->delete();
            }

            $status['deleted'][$id] = array();

            $record->destroy();
            unset($record);
        }

        return HTTPResponse::create()
            ->setBody(json_encode($status))
            ->addHeader('Content-type', 'application/json');
    }
}
