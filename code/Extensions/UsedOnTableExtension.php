<?php

namespace SilverStripe\AssetAdmin\Extensions;

use SilverStripe\Assets\Shortcodes\FileLink;
use SilverStripe\Core\Extension;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;

/**
 * Hides File Links on the "Used On" tab when viewing files
 */
class UsedOnTableExtension extends Extension
{
    public function updateUsage(ArrayList &$usage, DataObject &$record)
    {
        $usage = $usage->exclude('ClassName', FileLink::class);
    }
}
