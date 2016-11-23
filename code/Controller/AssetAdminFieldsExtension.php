<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

class AssetAdminFieldsExtension extends Extension {
    public function init() {
        Requirements::add_i18n_javascript(ASSET_ADMIN_DIR . '/client/lang', false, true);
        Requirements::javascript(ASSET_ADMIN_DIR . "/client/dist/js/bundle.js");
        Requirements::css(ASSET_ADMIN_DIR . "/client/dist/styles/bundle.css");
    }
}