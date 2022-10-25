<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;
use SilverStripe\GraphQL\Manager;

if (!class_exists(MutationCreator::class)) {
    return;
}

/**
 * API available but currently not used, as create folder uses FormBuilder
 *
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class CreateFolderMutationCreator extends MutationCreator implements OperationResolver
{
    /**
     * @var CaseInsensitiveFieldAccessor
     */
    protected $accessor;

    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        $this->accessor = new CaseInsensitiveFieldAccessor();

        parent::__construct($manager);
    }

    public function attributes()
    {
        return [
            'name' => 'createFolder',
        ];
    }

    public function type()
    {
        return $this->manager->getType('FileInterface');
    }

    public function args()
    {
        return [
            'folder' => [
                'type' => $this->manager->getType('FolderInput')
            ],
        ];
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        $parentID = isset($args['folder']['parentId']) ? intval($args['folder']['parentId']) : 0;
        if ($parentID) {
            $parent = Versioned::get_by_stage(Folder::class, Versioned::DRAFT)->byID($parentID);
            if (!$parent) {
                throw new \InvalidArgumentException(sprintf(
                    '%s#%s not found',
                    Folder::class,
                    $parentID
                ));
            }
        }

        // Check permission
        $canCreateContext = [];
        foreach ($args['folder'] as $name => $val) {
            $canCreateContext[$this->accessor->getObjectFieldName(Folder::singleton(), $name)] = $val;
        }
        if (!Folder::singleton()->canCreate($context['currentUser'] ?? null, $canCreateContext)) {
            throw new \InvalidArgumentException(sprintf(
                '%s create not allowed',
                Folder::class
            ));
        }

        $folder = Folder::create();
        foreach ($args['folder'] as $name => $val) {
            $this->accessor->setValue($folder, $name, $val);
        }

        $folder->writeToStage(Versioned::DRAFT);

        return $folder;
    }
}
