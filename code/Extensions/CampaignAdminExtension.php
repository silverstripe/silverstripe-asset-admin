<?php

namespace SilverStripe\AssetAdmin\Extensions;

use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\Assets\File;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\FormAction;
use SilverStripe\Security\Permission;

/**
 * Extension that updates the Popover menu of `FileFormFactory`.
 * This extension will only be applied if the `campaign-admin` module is installed.
 *
 * @extends Extension<FileFormFactory>
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
        if (!Permission::check('CMS_ACCESS_CampaignAdmin')) {
            return;
        }

        if ($record && $record->canPublish()) {
            $action = FormAction::create(
                'addtocampaign',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ADDTOCAMPAIGN', 'Add to campaign')
            )->setIcon('page-multiple');
            array_unshift($actions, $action);
        }
    }
}
