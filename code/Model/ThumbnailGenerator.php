<?php

namespace SilverStripe\AssetAdmin\Model;

use LogicException;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Storage\AssetContainer;
use SilverStripe\Assets\Storage\AssetStore;
use SilverStripe\Assets\Storage\DBFile;
use SilverStripe\Core\Config\Configurable;

/**
 * Generate thumbnails and thumbnail links
 */
class ThumbnailGenerator
{
    use Configurable;

    /**
     * Set to false to not generate
     *
     * @var bool
     */
    protected $generates = true;

    /**
     * Thumbnails are inline
     */
    const INLINE = 'inline';

    /**
     * Thumbnails are linked by url
     */
    const URL = 'url';

    /**
     * Safely limit max inline thumbnail size to 200kb.
     * Images larger than this will never be rendered.
     *
     * @config
     * @var int
     */
    private static $max_thumbnail_bytes = 200000;

    /**
     * Determine how thumbnails are serialised
     * List of visibility to either 'inline' or 'url' form.
     * 'inline' behaviour will use base64 encoded inline strings, and should not
     * be used for large images.
     * 'url' will use a direct url to assets.
     *
     * Note: Thumbnails that exceed max_thumbnail_bytes are never shown
     *
     * @config
     * @var array
     */
    private static $thumbnail_links = [
        AssetStore::VISIBILITY_PROTECTED => self::INLINE,
        AssetStore::VISIBILITY_PUBLIC => self::URL,
    ];

    /**
     * Generate thumbnail and return the "src" property for this thumbnail
     *
     * @param AssetContainer|DBFile|File $file
     * @param int $width
     * @param int $height
     * @return string
     */
    public function generateThumbnailLink(AssetContainer $file, $width, $height)
    {
        $thumbnail = $this->generateThumbnail($file, $width, $height);

        return $this->generateLink($thumbnail);
    }

    /**
     * Generate thumbnail object
     *
     * @param AssetContainer|DBFile|File $file
     * @param int $width
     * @param int $height
     * @return AssetContainer|DBFile|File
     */
    public function generateThumbnail(AssetContainer $file, $width, $height)
    {
        if (!$file->getIsImage() || !$file->exists()) {
            return null;
        }

        // Disable generation if only querying existing files
        if (!$this->getGenerates()) {
            $file = $file->existingOnly();
        }

        // Make large thumbnail
        return $file->FitMax($width, $height);
    }

    /**
     * Generate "src" property for this thumbnail.
     * This can be either a url or base64 encoded data
     *
     * @param AssetContainer $thumbnail
     * @return string
     */
    public function generateLink(AssetContainer $thumbnail = null)
    {
        // Check if thumbnail can be found
        if (!$thumbnail || !$thumbnail->exists() || !$thumbnail->getIsImage()) {
            return null;
        }

        // Ensure thumbnail doesn't exceed safe bounds
        $maxSize = $this->config()->get('max_thumbnail_bytes');
        if (!$thumbnail->getAbsoluteSize() > $maxSize) {
            return null;
        }

        // Determine best method to encode this thumbnail
        $urlRules = $this->config()->get('thumbnail_links');
        $visibility = $thumbnail->getVisibility();
        $urlRule = $urlRules[$visibility];
        if (!isset($urlRule)) {
            throw new LogicException("Invalid visibility {$visibility}");
        }

        // Build thumbnail
        switch ($urlRule) {
            case self::URL:
                return $thumbnail->getURL();
            case self::INLINE:
                // Generate inline content
                $base64 = base64_encode($thumbnail->getString());
                return sprintf(
                    'data:%s;base64,%s',
                    $thumbnail->getMimeType(),
                    $base64
                );
            default:
                throw new LogicException("Invalid url rule {$urlRule}");
        }
    }

    /**
     * @return bool
     */
    public function getGenerates()
    {
        return $this->generates;
    }

    /**
     * @param bool $generates
     * @return $this
     */
    public function setGenerates($generates)
    {
        $this->generates = $generates;
        return $this;
    }
}
