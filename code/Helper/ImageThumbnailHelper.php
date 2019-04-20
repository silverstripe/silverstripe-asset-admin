<?php
namespace SilverStripe\AssetAdmin\Helper;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\ORM\DB;
use SilverStripe\ORM\SS_List;

class ImageThumbnailHelper
{
    use Injectable;

    /**
     * @var int
     */
    private $maxImageFileSize;

    /**
     * @param int|string $maxImageSize Maximum file size for which thumbnails will be generated. Set to `0` to disable the
     * limit.
     */
    public function __construct($maxImageFileSize = '9M')
    {
        $this->setMaxImageFileSize($maxImageFileSize);
    }

    /**
     * Get the maximum file size for which thumbnails will be generated. Set to `0` to disable the limit.
     * @return int
     */
    public function getMaxImageFileSize()
    {
        return $this->maxImageFileSize;
    }

    /**
     * Set the maximum file size for which thumbnails will be generated. Set to `0` to disable the limit.
     * @param int|string $size
     * @return $this
     */
    public function setMaxImageFileSize($size)
    {
        $this->maxImageFileSize = Convert::memstring2bytes($size);
        return $this;
    }

    public function run()
    {
        $assetAdmin = AssetAdmin::singleton();
        /** @var File[]|SS_List $files */
        $files = File::get();

        set_time_limit(0);

        $maxSize = $this->getMaxImageFileSize();
        foreach ($files as $file) {
            if ($maxSize == 0 || $file->getAbsoluteSize() < $maxSize) {
                $assetAdmin->generateThumbnails($file, true);
            }
        }
    }
}
