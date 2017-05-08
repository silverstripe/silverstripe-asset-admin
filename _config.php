<?php

use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;

// Avoid creating global variables
call_user_func(function () {
    if (strcasecmp(__DIR__, BASE_PATH) === 0) {
        // Admin is root
        $clientPath = 'client';
    } else {
        // Asset-admin is subdir
        $clientPath = basename(__DIR__) . '/client';
    }

    // Re-enable media dialog
    $config = TinyMCEConfig::get('cms');
    $config->enablePlugins([
        'ssmedia' => "{$clientPath}/dist/js/TinyMCE_ssmedia.js",
        'ssembed' => "{$clientPath}/dist/js/TinyMCE_ssembed.js",
    ]);
    $config->insertButtonsAfter('table', 'ssmedia');
    $config->insertButtonsAfter('ssmedia', 'ssembed');
});
