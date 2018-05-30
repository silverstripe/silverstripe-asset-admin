<?php

namespace SilverStripe\AssetAdmin\Model;

use Embed\Adapters\Adapter;
use Embed\Embed;
use SilverStripe\Core\Manifest\ModuleResourceLoader;

/**
 * Encapsulation of an embed tag, linking to an external media source.
 *
 * @see Embed
 */
class EmbedResource implements Embeddable
{
    /**
     * Embed result
     *
     * @var Adapter
     */
    protected $embed;

    public function __construct($url)
    {
        $this->embed = Embed::create($url);
    }

    public function getWidth()
    {
        return $this->embed->getWidth() ?: 100;
    }

    public function getHeight()
    {
        return $this->embed->getHeight() ?: 100;
    }

    public function getPreviewURL()
    {
        // Use thumbnail url
        if ($this->embed->image) {
            return $this->embed->image;
        }

        // Use direct image type
        if ($this->getType() === 'photo' && !empty($this->embed->url)) {
            return $this->embed->url;
        }

        // Default media
        return ModuleResourceLoader::resourceURL(
            'silverstripe/asset-admin:client/dist/images/icon_file.png'
        );
    }

    /**
     * Get human readable name for this resource
     *
     * @return string
     */
    public function getName()
    {
        if ($this->embed->title) {
            return $this->embed->title;
        }

        return preg_replace('/\?.*/', '', basename($this->embed->getUrl()));
    }

    public function getType()
    {
        return $this->embed->type;
    }

    public function validate()
    {
        return !empty($this->embed->code);
    }
}
