<?php

use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;

define('ASSET_ADMIN_PATH', __DIR__);
define('ASSET_ADMIN_DIR', basename(__DIR__));

// Re-enable media dialog
TinyMCEConfig::get('cms')
    ->enablePlugins([
        'ssmedia' => ASSET_ADMIN_DIR . '/client/dist/js/TinyMCE_ssmedia.js'
    ])
    ->insertButtonsAfter('table', 'ssmedia');
