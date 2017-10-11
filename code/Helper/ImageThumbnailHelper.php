<?php
namespace SilverStripe\AssetAdmin\Helper;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Assets\ImageBackendFactory;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Core\Injector\InjectionCreator;
use SilverStripe\Core\Injector\Injector;

class ImageThumbnailHelper
{
    use Injectable;

    public function run()
    {
        $assetAdmin = AssetAdmin::singleton();
        $creator = new InjectionCreator();
        Injector::inst()->registerService(
            $creator,
            ImageBackendFactory::class
        );
        $files = File::get();

        set_time_limit(0);
        foreach ($files as $file) {
            $assetAdmin->generateThumbnails($file, true);
        }
    }
}
