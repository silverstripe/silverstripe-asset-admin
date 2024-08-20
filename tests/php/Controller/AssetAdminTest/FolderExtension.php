<?php

namespace SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\Core\Extension;

class FolderExtension extends Extension implements TestOnly
{
    protected function canView($member = null, $context = array())
    {
        if ($this->owner->Name === 'disallowCanView') {
            return false;
        }
    }

    protected function canEdit($member = null, $context = array())
    {
        if ($this->owner->Name === 'disallowCanEdit') {
            return false;
        }
    }

    protected function canDelete($member = null, $context = array())
    {
        if ($this->owner->Name === 'disallowCanDelete') {
            return false;
        }
    }

    protected function canCreate($member = null, $context = array())
    {
        if (isset($context['Name']) && $context['Name'] === 'disallowCanCreate') {
            return false;
        }
    }
}
