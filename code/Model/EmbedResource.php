<?php

namespace SilverStripe\AssetAdmin\Model;

use Embed\Adapters\Adapter;
use Embed\Embed;
use Embed\Http\DispatcherInterface;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Manifest\ModuleResourceLoader;

/**
 * Encapsulation of an embed tag, linking to an external media source.
 *
 * @see Embed
 */
class EmbedResource
{
    use Configurable;

    /**
     * @config
     *
     * @var array Pass any customised options onto embed
     */
    private static $embed_options = null;

    /**
     * @config
     *
     * @var DispatcherInterface a preconfigured dispatcher object (GuzzleDispatcher, CurlDispatcher)
     */
    private static $dispatcher = null;

    /**
     * Embed result
     *
     * @var Adapter
     */
    protected $embed;

    public function __construct($url)
    {
        $this->embed = Embed::create($url, $this->config()->embed_options, self::$dispatcher);
    }

    /**
     * Set the dispatcher interface to a preconfigured dispatcher object (GuzzleDispatcher, CurlDispatcher etc)
     *
     * @param DispatcherInterface $dispatcher
     */
    public static function setDispatcher(DispatcherInterface $dispatcher){
        self::$dispatcher = $dispatcher;
    }

    /**
     * Get width of this Embed
     *
     * @return int
     */
    public function getWidth()
    {
        return $this->embed->getWidth() ?: 100;
    }

    /**
     * Get height of this Embed
     *
     * @return int
     */
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

    /**
     * Get Embed type
     *
     * @return string
     */
    public function getType()
    {
        return $this->embed->type;
    }
}
