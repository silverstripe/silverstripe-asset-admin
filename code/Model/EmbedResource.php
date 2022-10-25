<?php

namespace SilverStripe\AssetAdmin\Model;

use SilverStripe\Dev\Deprecation;

/**
 * @deprecated 1.2.0 Use SilverStripe\View\Embed\EmbedResource instead
 */
class EmbedResource extends \SilverStripe\View\Embed\EmbedResource
{
    /**
     * @param string $url
     */
    public function __construct($url)
    {
        Deprecation::notice('1.2.0', 'Use SilverStripe\View\Embed\EmbedResource instead', Deprecation::SCOPE_CLASS);
        parent::__construct($url);
    }
}
