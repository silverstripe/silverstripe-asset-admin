<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Core\Extension;
use SilverStripe\Dev\Deprecation;
use SilverStripe\View\Requirements;

/**
 * @extends Extension<LeftAndMain>
 * @deprecated 5.3.0 Will be replaced with YAML configuration in a future major release
 */
class AssetAdminFieldsExtension extends Extension
{
    public function __construct()
    {
        Deprecation::withSuppressedNotice(
            fn () => Deprecation::notice('5.3.0', 'Will be replaced with YAML configuration in a future major release', Deprecation::SCOPE_CLASS)
        );
        parent::__construct();
    }

    public function init()
    {
        Requirements::add_i18n_javascript('silverstripe/asset-admin:client/lang', false);
        Requirements::javascript('silverstripe/asset-admin:client/dist/js/bundle.js');
        Requirements::css('silverstripe/asset-admin:client/dist/styles/bundle.css');
    }
}
