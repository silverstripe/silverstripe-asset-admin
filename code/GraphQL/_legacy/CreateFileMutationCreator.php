<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;
use SilverStripe\GraphQL\Manager;

/**
 * @todo Allow file upload (https://github.com/silverstripe/silverstripe-graphql/issues/19)
 */
class CreateFileMutationCreator extends MutationCreator implements OperationResolver
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
            'name' => 'createFile',
            'description' => 'Creates files and images'
        ];
    }

    public function type()
    {
        return $this->manager->getType('FileInterface');
    }

    public function args()
    {
        return [
            'file' => [
                'type' => $this->manager->getType('FileInput')
            ],
        ];
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        $parentID = isset($args['file']['parentId']) ? intval($args['file']['parentId']) : 0;
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

        $canCreateContext = [];
        foreach ($args['file'] as $name => $val) {
            $canCreateContext[$this->accessor->getObjectFieldName(File::singleton(), $name)] = $val;
        }
        if (!File::singleton()->canCreate($context['currentUser'], $canCreateContext)) {
            throw new \InvalidArgumentException(sprintf(
                '%s# create not allowed',
                File::class
            ));
        }

        $file = File::create();
        foreach ($args['file'] as $name => $val) {
            $this->accessor->setValue($file, $name, $val);
        }

        $file->writeToStage(Versioned::DRAFT);

        return $file;
    }
}
