<?php

namespace SilverStripe\AssetAdmin\Controller;

use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Shortcodes\FileLink;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\CMS\Model\SiteTreeFileExtension;
use SilverStripe\Control\Director;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\SS_List;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Versioned\DataDifferencer;

/**
 * Update File dataobjects to be editable in this asset admin
 *
 * @skipUpgrade
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
    public function getInsertWidth()
    {
        $size = $this->getInsertDimensions();
        return $size ? $size['width'] : null;
    }

    /**
     * Calculate width to insert into html area
     *
     * @return int
     */
    public function getInsertHeight()
    {
        $size = $this->getInsertDimensions();
        return $size ? $size['height'] : null;
    }

    /**
     * Get dimensions of this image sized within insert_width x insert_height
     *
     * @return array|null
     */
    protected function getInsertDimensions()
    {
        $width = $this->owner->getWidth();
        $height = $this->owner->getHeight();
        if (!$height || !$width) {
            return null;
        }

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
        if (($width * $maxHeight) < ($height * $maxWidth)) {
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

    /**
     * @param int $from
     * @param int $to
     *
     * @return string
     */
    public function humanizedChanges($from, $to)
    {
        if (!$from) {
            return _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.UPLOADEDFILE', "Uploaded file");
        }

        $fromRecord = Versioned::get_version(get_class($this->owner), $this->owner->ID, $from);
        $toRecord = Versioned::get_version(get_class($this->owner), $this->owner->ID, $to);

        $diff = new DataDifferencer($fromRecord, $toRecord);
        $changes = $diff->changedFieldNames();

        $k = array_search('LastEdited', $changes);

        if ($k !== false) {
            unset($changes[$k]);
        }

        $output = array();

        foreach ($changes as $change) {
            $human = $change;

            if ($change == "ParentID") {
                // updated folder ID
                $human = _t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdminFile.MOVEDFOLDER',
                    "Moved file"
                );
            } elseif ($change == 'Title') {
                $human = _t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdminFile.RENAMEDTITLE',
                    "Updated title to "
                ) . $fromRecord->Title;
            } elseif ($change == 'Name') {
                $human = _t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdminFile.RENAMEDFILE',
                    "Renamed file to "
                ) . $fromRecord->Filename;
            } elseif ($change == 'File') {
                // check to make sure the files are actually different
                if ($fromRecord->getHash() != $toRecord->getHash()) {
                    $human = _t(
                        'SilverStripe\\AssetAdmin\\Controller\\AssetAdminFile.RENAMEDFILE',
                        "Replaced file"
                    );
                } else {
                    $human = false;
                }
            } else {
                $human = false;
            }

            if ($human) {
                $output[] = $human;
            }
        }

        return implode(", ", $output);
    }

    /**
     * Get the list of all nested files in use
     *
     * @return SS_List
     */
    public function getFilesInUse()
    {
        $list = ArrayList::create();

        // Check SiteTreeFileExtension
        if ($this->owner instanceof Folder) {
            // Join on tracking table
            $parents = static::nestedFolderIDs($this->owner->ID);
            $linkQuery = FileLink::get()->sql($linkParams);
            $list = File::get()->filter('ParentID', $parents)
                ->innerJoin(
                    "({$linkQuery})",
                    '"File"."ID" = "FileLinkTracking"."LinkedID"',
                    'FileLinkTracking',
                    20,
                    $linkParams
                );
        }

        // Allow extension
        $this->owner->extend('updateFilesInUse', $list);
        return $list;
    }

    /**
     * Get recursive parent IDs
     *
     * @param int $parentID
     * @param int $maxDepth Hard limit of max depth
     * @return array List of parent IDs, including $parentID
     */
    public static function nestedFolderIDs($parentID, $maxDepth = 5)
    {
        $ids = [$parentID];
        if ($maxDepth === 0) {
            return $ids;
        }
        $childIDs = Folder::get()->filter('ParentID', $parentID)->column('ID');
        foreach ($childIDs as $childID) {
            $ids = array_merge($ids, static::nestedFolderIDs($childID, $maxDepth - 1));
        }
        return $ids;
    }
}
