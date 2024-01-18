<?php
namespace SilverStripe\AssetAdmin\Helper;

use Psr\Log\LoggerInterface;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Storage\AssetStore;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\DB;
use SilverStripe\ORM\SS_List;

class ImageThumbnailHelper
{
    use Injectable;

    private static $dependencies = [
        'logger' => '%$' . LoggerInterface::class . '.quiet',
    ];

    /**
     * @var LoggerInterface|null
     */
    private $logger;

    /**
     * @var int
     */
    private $maxImageFileSize;

    private $processedBatchSize = 100;

    /**
     * @param LoggerInterface $logger
     * @return $this
     */
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;

        return $this;
    }

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

    /**
     * @return int Number of thumbnails processed
     */
    public function run()
    {
        $files = File::get();
        $totalCount = $files->count();
        if (!$totalCount) {
            return 0;
        }

        $this->logger->debug(sprintf('Inspecting %d files', $totalCount));

        set_time_limit(0);

        $maxSize = $this->getMaxImageFileSize();
        $inspectedCount = 0;
        $generatedCount = 0;
        foreach ($files as $file) {
            // Skip if file is not an image
            if (!$file->getIsImage()) {
                $this->logger->debug(sprintf('File is not an image: %s', $file->Filename));
                continue;
            }
            // Skip if file is too large
            if ($maxSize > 0 && $file->getAbsoluteSize() > $maxSize) {
                $this->logger->warning(sprintf(
                    'File too large for generating its thumbnail: %s',
                    $file->Filename
                ));
                continue;
            }

            $generated = $this->generateThumbnails($file);
            if (count($generated ?? []) > 0) {
                $generatedCount++;
                $this->logger->debug(sprintf('Generated thumbnail for %s', $file->Filename));
            }

            $inspectedCount++;

            if ($inspectedCount % $this->processedBatchSize == 0) {
                $this->logger->debug(sprintf(
                    '[%d / %d, %d%% complete]',
                    $inspectedCount,
                    $totalCount,
                    floor(($inspectedCount / $totalCount) * 100)
                ));
            }
        }

        return $generatedCount;
    }

    /**
     * Similar to AssetAdmin->generateThumbnails(),
     * but with the ability to tell if a file actually required to be generated.
     * This speeds up the process, and removes some noise when thumbnails
     * have already been generated.
     *
     * @param File $file
     * @return AssetContainer[] All generated files
     */
    protected function generateThumbnails(File $file)
    {
        $generated = [];

        if ($file->config()->resample_images === false) {
            return $generated;
        }

        $store = Injector::inst()->get(AssetStore::class);
        $assetAdmin = AssetAdmin::singleton();
        $generator = $assetAdmin->getThumbnailGenerator();
        $method = $generator->config()->get('method');

        $dimensions = [
            [
                UploadField::config()->uninherited('thumbnail_width'),
                UploadField::config()->uninherited('thumbnail_height')
            ],
            [
                $assetAdmin->config()->get('thumbnail_width'),
                $assetAdmin->config()->get('thumbnail_height')
            ]
        ];

        foreach ($dimensions as $dimension) {
            $variant = $file->variantName($method, $dimension[0], $dimension[1]);
            if ($store->exists($file->getFilename(), $file->getHash(), $variant)) {
                continue;
            }

            $thumb = $generator->generateThumbnail($file, $dimension[0], $dimension[1]);

            // Not all file formats support thumbnail generation
            if ($thumb) {
                $generated[] = $thumb;
            }
        }

        return $generated;
    }
}
