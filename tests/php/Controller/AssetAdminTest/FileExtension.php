<?php

namespace SilverStripe\AssetAdmin\Tests\Controller\AssetAdminTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataExtension;

class FileExtension extends DataExtension implements TestOnly
{
    public function canView($member = null)
    {
        if ($this->owner->Name === 'disallowCanView.txt') {
            return false;
        }
    }

    public function canEdit($member = null)
    {
        if ($this->owner->Name === 'disallowCanEdit.txt') {
            return false;
        }
    }

    public function canDelete($member = null)
    {
        if ($this->owner->Name === 'disallowCanDelete.txt') {
            return false;
        }
    }


    public function canCreate($member = null, $context = [])
    {
        if (isset($context['Parent']) && $context['Parent']->Name === 'disallowCanAddChildren') {
            return false;
        }
        if (isset($context['Upload']['name']) && $context['Upload']['name'] === 'disallowCanCreate.txt') {
            return false;
        }
    }
}
