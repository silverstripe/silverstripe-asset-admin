<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\AssetAdmin\Model\ThumbnailGenerator;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\TypeCreator;
use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;

/**
 * @skipUpgrade
 */
class FileTypeCreator extends TypeCreator
{
    /**
     * @var CaseInsensitiveFieldAccessor
     */
    protected $accessor;

    /**
     * @var ThumbnailGenerator
     */
    protected $thumbnailGenerator;

    public function __construct(Manager $manager = null)
    {
        $this->accessor = new CaseInsensitiveFieldAccessor();

        parent::__construct($manager);
    }

    public function attributes()
    {
        return [
            'name' => 'File',
            'description' => 'Type for files and images',
            'isTypeOf' => function ($obj) {
                return ($obj instanceof File && !($obj instanceof Folder));
            }
        ];
    }

    public function interfaces()
    {
        return function () {
            return [$this->manager->getType('FileInterface')];
        };
    }

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
            ],
            'created' => [
                'type' => Type::string(),
            ],
            'lastEdited' => [
                'type' => Type::string(),
            ],
            'owner' => [
                'type' => Type::string(),
            ],
            'parentId' => [
                'type' => Type::int(),
            ],
            'title' => [
                'type' => Type::string(),
            ],
            'exists' => [
                'type' => Type::boolean(),
            ],
            'type' => [
                'type' => Type::string(),
            ],
            'category' => [
                'type' => Type::string(),
            ],
            'name' => [
                'type' => Type::string(),
            ],
            'filename' => [
                'type' => Type::string(),
            ],
            'extension' => [
                'type' => Type::string(),
            ],
            'size' => [
                'type' => Type::int(),
            ],
            'url' => [
                'type' => Type::string(),
            ],
            'thumbnail' => [
                'type' => Type::string(),
            ],
            'smallThumbnail' => [
                'type' => Type::string(),
            ],
            'width' => [
                'type' => Type::int(),
            ],
            'height' => [
                'type' => Type::int(),
            ],
            'canView' => [
                'type' => Type::boolean(),
            ],
            'canEdit' => [
                'type' => Type::boolean(),
            ],
            'canDelete' => [
                'type' => Type::boolean(),
            ],
            'draft' => [
                'type' => Type::boolean(),
            ],
            'published' => [
                'type' => Type::boolean(),
            ],
            'modified' => [
                'type' => Type::boolean(),
            ],
            'inUseCount' => [
                'type' => Type::int(),
            ],
        ];
    }

    public function resolveTypeField($object, array $args, $context, $info)
    {
        return $object instanceof Folder ? 'folder' : $object->FileType;
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return string
     */
    public function resolveCategoryField($object, array $args, $context, $info)
    {
        return $object instanceof Folder ? 'folder' : $object->appCategory();
    }

    public function resolveUrlField($object, array $args, $context, $info)
    {
        return $object->AbsoluteURL;
    }

    public function resolveSizeField($object, array $args, $context, $info)
    {
        return $object->AbsoluteSize;
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return string|null
     */
    public function resolveSmallThumbnailField($object, array $args, $context, $info)
    {
        // Make small thumbnail
        $width = UploadField::config()->uninherited('thumbnail_width');
        $height = UploadField::config()->uninherited('thumbnail_height');
        return $this->getThumbnailGenerator()->generateThumbnailLink($object, $width, $height);
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return string|null
     */
    public function resolveThumbnailField($object, array $args, $context, $info)
    {
        // Make large thumbnail
        $width = AssetAdmin::config()->uninherited('thumbnail_width');
        $height = AssetAdmin::config()->uninherited('thumbnail_height');
        return $this->getThumbnailGenerator()->generateThumbnailLink($object, $width, $height);
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return string|null
     */
    public function resolveDraftField($object, array $args, $context, $info)
    {
        return $object->isOnDraftOnly();
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return string|null
     */
    public function resolvePublishedField($object, array $args, $context, $info)
    {
        return $object->isPublished();
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return string|null`
     */
    public function resolveModifiedField($object, array $args, $context, $info)
    {
        return $object->isModifiedOnDraft();
    }

    public function resolveField($object, array $args, $context, $info)
    {
        return $this->accessor->getValue($object, $info->fieldName);
    }

    /**
     * @param File $object
     * @param array $args
     * @param array $context
     * @param ResolveInfo $info
     * @return int
     */
    public function resolveInUseCountField($object, array $args, $context, $info)
    {
        return $object->BackLinkTrackingCount();
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
