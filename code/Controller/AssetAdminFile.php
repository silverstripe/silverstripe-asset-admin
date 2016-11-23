<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Assets\File;
use SilverStripe\Control\Director;
use SilverStripe\ORM\DataExtension;

/**
 * Update File dataobjects to be editable in this asset admin
 *
 * @property File $owner
 */
class AssetAdminFile extends DataExtension
{
    /**
     * Max width for inserted images
     *
     * @config
     * @var int
     */
    private static $insert_width = 600;

    /**
     * Max height for inserted images
     *
     * @config
     * @var int
     */
    private static $insert_height = 400;

    public function updateCMSEditLink(&$link)
    {
        // Update edit link for this file to point to the new asset admin
        $controller = AssetAdmin::singleton();
        $link = Director::absoluteURL($controller->getFileEditLink($this->owner));
    }

    /**
     * Calculate width to insert into html area
     *
     * @return int|null
     */
    public function getInsertWidth() {
        $size = $this->getInsertDimensions();
        return $size ? $size['width'] : null;
    }

    /**
     * Calculate width to insert into html area
     *
     * @return int
     */
    public function getInsertHeight() {
        $size = $this->getInsertDimensions();
        return $size ? $size['height'] : null;
    }

    /**
     * Get dimensions of this image sized within insert_width x insert_height
     *
     * @return array|null
     */
    protected function getInsertDimensions() {
        $dimensions = $this->owner->getDimensions('array');
        if (!$dimensions) {
            return null;
        }

        list ($width, $height) = $dimensions;
        $maxWidth = $this->owner->config()->get('insert_width');
        $maxHeight = $this->owner->config()->get('insert_height');

        // Within bounds
        if ($width < $maxWidth && $height < $maxHeight) {
            return [
                'width' => $width,
                'height' => $height,
            ];
        }

        // Check if sizing by height or width
		if( ($width * $maxHeight) < ($height * $maxWidth) ) {
			// Size by height
            return [
                'width' => intval(($width * $maxHeight) / $height + 0.5),
                'height' => $maxHeight,
            ];

		} else {
			// Size by width
            return [
                'width' => $maxWidth,
                'height' => intval(($height * $maxWidth) / $width + 0.5),
            ];
		}
    }
}
