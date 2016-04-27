<?php

namespace SilverStripe\AssetAdmin\Controller;

/**
 * Update File dataobjects to be editable in this asset admin
 */
class AssetAdminFile extends \DataExtension
{
    public function updateCMSEditLink(&$link) {
        // Update edit link for this file to point to the new asset admin
        $controller = AssetAdmin::singleton();
        $link = \Director::absoluteURL($controller->getFileEditLink($this->owner));
    }
}
