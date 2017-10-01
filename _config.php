<?php

use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;

// Avoid creating global variables
call_user_func(function () {
    $module = ModuleLoader::inst()->getManifest()->getModule('silverstripe/asset-admin');

    // Re-enable media dialog
    $config = TinyMCEConfig::get('cms');
    $config->enablePlugins([
        'ssmedia' => $module->getResource('client/dist/js/TinyMCE_ssmedia.js')->getURL(),
        'ssembed' => $module->getResource('client/dist/js/TinyMCE_ssembed.js')->getURL(),
        'sslinkfile' => $module->getResource('client/dist/js/TinyMCE_sslink-file.js')->getURL()
    ]);
    $config->insertButtonsAfter('table', 'ssmedia');
    $config->insertButtonsAfter('ssmedia', 'ssembed');
});
