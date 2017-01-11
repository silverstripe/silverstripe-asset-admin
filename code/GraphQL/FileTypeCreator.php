<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\AssetAdmin\Forms\UploadField;
use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\TypeCreator;
use SilverStripe\GraphQL\Manager;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;

class FileTypeCreator extends TypeCreator
{
    /**
     * @var CaseInsensitiveFieldAccessor
     */
    protected $accessor;

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
        if (!$object->getIsImage()) {
            return null;
        }

        // Small thumbnail
        $smallWidth = UploadField::config()->get('thumbnail_width');
        $smallHeight = UploadField::config()->get('thumbnail_height');
        $smallThumbnail = $object->FitMax($smallWidth, $smallHeight);
        if ($smallThumbnail && $smallThumbnail->exists()) {
            return $smallThumbnail->getAbsoluteURL();
        }

        return null;
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
        if (!$object->getIsImage()) {
            return null;
        }

        // Large thumbnail
        $width = AssetAdmin::config()->get('thumbnail_width');
        $height = AssetAdmin::config()->get('thumbnail_height');
        $thumbnail = $object->FitMax($width, $height);
        if ($thumbnail && $thumbnail->exists()) {
            return $thumbnail->getAbsoluteURL();
        }
        return null;
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

    public function resolveField($object, array $args, $context, $info)
    {
        return $this->accessor->getValue($object, $info->fieldName);
    }

    public function resolveInUseCountField($object, array $args, $context, $info) {
        if ($object->hasMethod('BackLinkTrackingCount')) {
            return $object->BackLinkTrackingCount();
        }
        return 0;
    }
}
