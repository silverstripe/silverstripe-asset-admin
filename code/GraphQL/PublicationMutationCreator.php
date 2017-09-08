<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\File;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\Security\Member;

abstract class PublicationMutationCreator extends MutationCreator implements OperationResolver
{
    /**
     * @var string The name of the mutation
     */
    protected $name;

    /**
     * @var string The description of the mutation
     */
    protected $description;

    /**
     * @return array
     */
    public function attributes()
    {
        return [
            'name '=> $this->name,
            'description' => $this->description,
        ];
    }

    /**
     * @return Type
     */
    public function type()
    {
        return Type::listOf(
            $this->manager->getType('FileInterface')
        );
    }

    /**
     * @return array
     */
    public function args()
    {
        return [
            'IDs' => [
                'type' => Type::nonNull(Type::listOf(Type::id())),
            ],
        ];
    }

    /**
     * @param mixed $object
     * @param array $args
     * @param mixed $context
     * @param ResolveInfo $info
     * @return \SilverStripe\ORM\DataObject
     */
    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        if (!isset($args['IDs']) || !is_array($args['IDs'])) {
            throw new \InvalidArgumentException('IDs must be an array');
        }

        $idList = $args['IDs'];
        $files = Versioned::get_by_stage(File::class, $this->sourceStage())
            ->byIds($idList);

        if ($files->count() < count($idList)) {
            // Find out which files count not be found
            $missingIds = array_diff($idList, $files->column('ID'));
            throw new \InvalidArgumentException(sprintf(
                '%s#%s items are not published or don\'t exist',
                File::class,
                implode(', ', $missingIds)
            ));
        }

        $writtenFiles = [];
        foreach ($files as $file) {
            if ($this->hasPermission($file, $context['currentUser'])) {
                $this->mutateFile($file);
                $writtenFiles[] = $file;
            }
        }

        return $writtenFiles;
    }

    /**
     * The stage that the file should be fetched from before mutation
     *
     * @return string
     */
    abstract protected function sourceStage();

    /**
     * Apply the mutation
     *
     * @param File $file
     */
    abstract protected function mutateFile(File $file);

    /**
     * Return true if the member has permission to do the mutation
     *
     * @param File $file
     * @param Member $member
     * @return boolean
     */
    abstract protected function hasPermission(File $file, Member $member);
}
