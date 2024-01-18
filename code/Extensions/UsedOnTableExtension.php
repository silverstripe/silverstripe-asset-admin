<?php

namespace SilverStripe\AssetAdmin\Extensions;

use SilverStripe\Admin\Forms\UsedOnTable;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Shortcodes\FileLink;
use SilverStripe\Core\Extension;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;

/**
 * Hides several types of DataObjects on the "Used On" tab when viewing files
 *
 * @extends Extension<UsedOnTable>
 */
class UsedOnTableExtension extends Extension
{
    /**
     * @var array $excludedClasses
     */
    public function updateUsageExcludedClasses(array &$excludedClasses)
    {
        $excludedClasses[] = FileLink::class;
        $excludedClasses[] = Member::class;
    }

    /**
     * @param DataObject $dataObject|null
     */
    public function updateUsageDataObject(?DataObject &$dataObject)
    {
        if ($dataObject instanceof Folder) {
            $dataObject = null;
        }
    }
}
