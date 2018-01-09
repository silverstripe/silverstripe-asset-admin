<?php

namespace SilverStripe\AssetAdmin\Extensions;

use SilverStripe\Assets\File;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\FormAction;

/**
 * Extension that updates the Popover menu of `FileFormFactory`.
 * This extension will only be applied if the `campaign-admin` module is installed.
 * @package SilverStripe\AssetAdmin\Extensions
 */
class CampaignAdminExtension extends Extension
{
    /**
     * Update the Popover menu of `FileFormFactory` with the "Add to campaign" button.
     *
     * @param array $actions
     * @param File $record
     */
    public function updatePopoverActions(&$actions, $record)
    {
        if ($record && $record->canPublish()) {
            $action = FormAction::create(
                'addtocampaign',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ADDTOCAMPAIGN', 'Add to campaign')
            )->setIcon('page-multiple');
            array_unshift($actions, $action);
        }
    }
}
