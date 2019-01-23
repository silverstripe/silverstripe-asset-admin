<?php
namespace SilverStripe\AssetAdmin\Helper;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\ORM\DB;

class ImageThumbnailHelper
{
    use Injectable;

    /**
     * @var int
     */
    private $maxImageFileSize;

    /**
     * @param mixed $maxImageSize Maximum file size for which thumbnails will be generated
     */
    public function __construct($maxImageFileSize = '9M')
    {
        $this->setMaxImageFileSize($maxImageFileSize);
    }

    /**
     * @return int
     */
    public function getMaxImageFileSize()
    {
        return $this->maxImageFileSize;
    }

    /**
     * @param mixed $size
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
        /** @var File[] $files */
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
