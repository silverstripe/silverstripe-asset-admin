<?php

namespace SilverStripe\AssetAdmin\Model;

use SilverStripe\Dev\Deprecation;

/**
 * @deprecated 1.2.0 Use SilverStripe\View\Embed\EmbedResource instead
 */
class EmbedResource extends \SilverStripe\View\Embed\EmbedResource
{
    public function __construct()
    {
        Deprecation::notice('1.2.0', 'Use SilverStripe\View\Embed\EmbedResource instead', Deprecation::SCOPE_CLASS);
    }
}
