<?php
namespace SilverStripe\AssetAdmin\Helper;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Core\Injector\Injectable;

class ImageThumbnailHelper
{
    use Injectable;

    public function run()
    {
        $assetAdmin = AssetAdmin::singleton();
        $files = File::get();

        set_time_limit(0);
        foreach ($files as $file) {
            $assetAdmin->generateThumbnails($file, true);
        }
    }
}
