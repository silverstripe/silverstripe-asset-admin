<?php

namespace SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\Core\Extension;

class FileExtension extends Extension implements TestOnly
{
    protected function canView($member = null)
    {
        if ($this->owner->Name === 'disallowCanView.txt') {
            return false;
        }
    }

    protected function canEdit($member = null)
    {
        if ($this->owner->Name === 'disallowCanEdit.txt') {
            return false;
        }
    }

    protected function canDelete($member = null)
    {
        if ($this->owner->Name === 'disallowCanDelete.txt') {
            return false;
        }
    }

    protected function canCreate($member = null, $context = [])
    {
        if (isset($context['Parent']) && $context['Parent']->Name === 'disallowCanAddChildren') {
            return false;
        }
        if (isset($context['Upload']['name']) && $context['Upload']['name'] === 'disallowCanCreate.txt') {
            return false;
        }
    }
}
