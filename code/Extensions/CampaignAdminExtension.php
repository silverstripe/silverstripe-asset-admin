<?php

namespace SilverStripe\AssetAdmin\Extensions;

use SilverStripe\AssetAdmin\Forms\FileFormFactory;
use SilverStripe\Assets\File;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\FormAction;
use SilverStripe\Security\Permission;
use SilverStripe\Dev\Deprecation;

/**
 * Extension that updates the Popover menu of `FileFormFactory`.
 * This extension will only be applied if the `campaign-admin` module is installed.
 *
 * @extends Extension<FileFormFactory>
 * @deprecated 2.4.0 Will be replaced by SilverStripe\CampaignAdmin\Extensions\FileFormFactoryExtension in a future major release
 */
class CampaignAdminExtension extends Extension
{
    public function __construct()
    {
        Deprecation::noticeWithNoReplacment(
            '2.4.0',
            'Will be replaced by SilverStripe\CampaignAdmin\Extensions\FileFormFactoryExtension in a future major release',
            Deprecation::SCOPE_CLASS
        );
        parent::__construct();
    }

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
