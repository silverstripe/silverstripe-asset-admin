<?php

namespace SilverStripe\AssetAdmin\Tests\Controller\AssetAdminImageEditTest;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;

/**
 * Denies edit/create permissions for specifically named fixtures so the endpoint's permission
 * rejection paths can be exercised.
 */
class PermissionExtension extends Extension implements TestOnly
{
    protected function canEdit($member = null)
    {
        if ($this->owner->Name === 'noedit.png') {
            return false;
        }
    }

    protected function canCreate($member = null, $context = [])
    {
        if (isset($context['Parent']) && $context['Parent'] && $context['Parent']->Name === 'noCreateFolder') {
            return false;
        }
    }
}
