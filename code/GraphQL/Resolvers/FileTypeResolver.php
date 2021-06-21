<?php


namespace SilverStripe\AssetAdmin\GraphQL\Resolvers;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Controller\AssetAdminFile;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Model\ThumbnailGenerator;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Assets\Storage\AssetContainer;
use SilverStripe\Core\Injector\Injectable;

class FileTypeResolver
{
    use Injectable;

    private static $dependencies = [
        'ThumbnailGenerator' => '%$SilverStripe\AssetAdmin\Model\ThumbnailGenerator.graphql'
    ];

    /**
     * @var ThumbnailGenerator
     */
    private $thumbnailGenerator;

    /**
     * @param $object
     * @return mixed
     */
    public static function resolveFileType($object)
    {
        return $object->FileType;
    }

    /**
     * @return string
     */
    public static function resolveFolderType(): string
    {
        return 'folder';
    }

    /**
     * @param File $object
     * @return string
     */
    public static function resolveFileCategory($object)
    {
        return $object->appCategory();
    }

    /**
     * @return string
     */
    public static function resolveFolderCategory(): string
    {
        return 'folder';
    }

    public static function resolveFileUrl($object)
    {
        return $object->AbsoluteURL;
    }

    public static function resolveFileSize($object)
    {
        return $object->AbsoluteSize;
    }

    /**
     * @param File $object
     * @return string|null
     */
    public static function resolveFileSmallThumbnail($object)
    {
        // Make small thumbnail
        $width = UploadField::config()->uninherited('thumbnail_width');
        $height = UploadField::config()->uninherited('thumbnail_height');
        return static::singleton()
            ->getThumbnailGenerator()
            ->generateThumbnailLink($object, $width, $height);
    }

    /**
     * @param File $object
     * @return string|null
     */
    public static function resolveFileThumbnail($object)
    {
        // Make large thumbnail
        $width = AssetAdmin::config()->uninherited('thumbnail_width');
        $height = AssetAdmin::config()->uninherited('thumbnail_height');
        return static::singleton()
            ->getThumbnailGenerator()
            ->generateThumbnailLink($object, $width, $height);
    }

    /**
     * @param File $object
     * @return string|null
     */
    public static function resolveFileDraft($object)
    {
        return $object->isOnDraftOnly();
    }

    /**
     * @param File $object
     * @return string|null
     */
    public static function resolveFilePublished($object)
    {
        return $object->isPublished();
    }

    /**
     * @param File $object
     * @return string|null`
     */
    public static function resolveFileModified($object)
    {
        return $object->isModifiedOnDraft();
    }

    /**
     * @param File|AssetAdminFile $object
     * @return int
     */
    public static function resolveFileDescendantFileCount($object)
    {
        return 0;
    }

    /**
     * @param File $object
     * @return int
     */
    public static function resolveFileInUseCount($object)
    {
        return $object->BackLinkTrackingCount();
    }

    /**
     * @param AssetContainer $object
     * @return string|null
     */
    public static function resolveFileThumbnailFieldGraceful(AssetContainer $object): ?string
    {
        $width = AssetAdmin::config()->uninherited('thumbnail_width');
        $height = AssetAdmin::config()->uninherited('thumbnail_height');
        return static::singleton()
            ->getThumbnailGenerator()
            ->generateThumbnailLink($object, $width, $height, true);
    }

    /**
     * @param AssetContainer $object
     * @return string|null
     */
    public static function resolveFileSmallThumbnailFieldGraceful(AssetContainer $object): ?string
    {
        $width = UploadField::config()->uninherited('thumbnail_width');
        $height = UploadField::config()->uninherited('thumbnail_height');
        return static::singleton()
            ->getThumbnailGenerator()
            ->generateThumbnailLink($object, $width, $height, true);
    }

    /**
     * @return ThumbnailGenerator
     */
    public function getThumbnailGenerator()
    {
        return $this->thumbnailGenerator;
    }

    /**
     * @param ThumbnailGenerator $generator
     * @return $this
     */
    public function setThumbnailGenerator(ThumbnailGenerator $generator)
    {
        $this->thumbnailGenerator = $generator;
        return $this;
    }
}
