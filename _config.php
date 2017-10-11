<?php

use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;

// Avoid creating global variables
call_user_func(function () {
    $module = ModuleLoader::inst()->getManifest()->getModule('silverstripe/asset-admin');

    // Re-enable media dialog
    $config = TinyMCEConfig::get('cms');
    $config->enablePlugins([
        'ssmedia' => $module
            ->getResource('client/dist/js/TinyMCE_ssmedia.js'),
        'ssembed' => $module
            ->getResource('client/dist/js/TinyMCE_ssembed.js'),
        'sslinkfile' => $module
            ->getResource('client/dist/js/TinyMCE_sslink-file.js'),
    ]);
    $config->insertButtonsAfter('table', 'ssmedia');
    $config->insertButtonsAfter('ssmedia', 'ssembed');
});
