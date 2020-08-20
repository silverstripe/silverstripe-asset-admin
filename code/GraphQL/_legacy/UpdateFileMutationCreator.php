<?php
namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\ResolveInfo;
use SilverStripe\Assets\File;
use GraphQL\Type\Definition\Type;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\Util\CaseInsensitiveFieldAccessor;
use SilverStripe\GraphQL\Manager;

/**
 * Handles create and update
 * @skipUpgrade
 */
class UpdateFileMutationCreator extends MutationCreator implements OperationResolver
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
            'name' => 'updateFile'
        ];
    }

    public function type()
    {
        return $this->manager->getType('File');
    }

    public function args()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
            ],
            'file' => [
                'type' => $this->manager->getType('FileInput')
            ],
        ];
    }

    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        /** @var File $file */
        $file = Versioned::get_by_stage(File::class, Versioned::DRAFT)
            ->byID($args['id']);

        if (!$file) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s not found',
                File::class,
                $args['id']
            ));
        }

        if (!$file->canEdit($context['currentUser'])) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s update not allowed',
                File::class,
                $args['id']
            ));
        }

        // TODO Use input type (and don't allow setting ID)
        foreach ($args['file'] as $name => $val) {
            $this->accessor->setValue($file, $name, $val);
        }
        $file->update($args);
        $file->writeToStage(Versioned::DRAFT);

        return $file;
    }
}
