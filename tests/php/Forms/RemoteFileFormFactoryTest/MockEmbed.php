<?php

namespace SilverStripe\AssetAdmin\Tests\Forms\RemoteFileFormFactoryTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\View\Embed\Embeddable;

class MockEmbed implements Embeddable, TestOnly
{
    protected $url;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function getWidth()
    {
        return 100;
    }

    public function getHeight()
    {
        return 100;
    }

    public function getPreviewURL()
    {
        return $this->url;
    }

    /**
     * Get human readable name for this resource
     *
     * @return string
     */
    public function getName()
    {
        return 'image';
    }

    /**
     * Get Embed type
     *
     * @return string
     */
    public function getType()
    {
        return 'image';
    }

    /**
     * Validate this resource
     *
     * @return bool
     */
    public function validate()
    {
        return true;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        return [];
    }

    /**
     * @param array $options
     * @return MockEmbed
     */
    public function setOptions(array $options)
    {
        return $this;
    }
}
