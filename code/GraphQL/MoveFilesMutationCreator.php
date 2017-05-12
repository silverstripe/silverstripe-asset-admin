<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;
use SilverStripe\GraphQL\Manager;

class MoveFilesMutationCreator extends MutationCreator implements OperationResolver
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
            'name' => 'moveFiles',
        ];
    }

    public function type()
    {
        return $this->manager->getType('FileInterface');
    }

    public function args()
    {
        return [
            'folderId' => [
                'type' => Type::nonNull(Type::id())
            ],
            'fileIds' => [
                'type' => Type::listOf(Type::id())
            ],
        ];
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        $folderId = (isset($args['folderId'])) ? $args['folderId'] : 0;

        if ($folderId) {
            /** @var Folder $folder */
            $folder = Versioned::get_by_stage(Folder::class, Versioned::DRAFT)
                ->byID($folderId);
            if (!$folder) {
                throw new \InvalidArgumentException(sprintf(
                    '%s#%s not found',
                    Folder::class,
                    $folderId
                ));
            }

            // Check permission
            if (!$folder->canEdit($context['currentUser'])) {
                throw new \InvalidArgumentException(sprintf(
                    '%s edit not allowed',
                    Folder::class
                ));
            }
        }
        $files = Versioned::get_by_stage(File::class, Versioned::DRAFT)
            ->byIDs($args['fileIds']);
        $errorFiles = [];

        /** @var File $file */
        foreach ($files as $file) {
            if ($file->canEdit($context['currentUser'])) {
                $this->accessor->setValue($file, 'ParentID', $folderId);
                $file->writeToStage(Versioned::DRAFT);
            } else {
                $errorFiles[] = $file->ID;
            }
        }

        if ($errorFiles) {
            throw new \InvalidArgumentException(sprintf(
                '%s (%s) edit not allowed',
                File::class,
                implode(', ', $errorFiles)
            ));
        }

        if (!isset($folder)) {
            return Folder::singleton();
        }
        return $folder;
    }
}
