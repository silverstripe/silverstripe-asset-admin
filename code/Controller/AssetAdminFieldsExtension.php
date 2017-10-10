<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

class AssetAdminFieldsExtension extends Extension
{
    public function init()
    {
        Requirements::add_i18n_javascript('silverstripe/asset-admin:client/lang', false, true);
        Requirements::javascript('silverstripe/asset-admin:client/dist/js/bundle.js');
        Requirements::css('silverstripe/asset-admin:client/dist/styles/bundle.css');
    }
}
