<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Core\Extension;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\View\Requirements;

class AssetAdminFieldsExtension extends Extension
{
    public function init()
    {
        $module = ModuleLoader::getModule('silverstripe/asset-admin');
        Requirements::add_i18n_javascript($module->getResourcePath('client/lang'), false, true);
        Requirements::javascript($module->getResourcePath("client/dist/js/bundle.js"));
        Requirements::css($module->getResourcePath("client/dist/styles/bundle.css"));
    }
}
