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
        return $this->manager->getType('FileInterface');
    }

    /**
     * @return array
     */
    public function args()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
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
        if (!isset($args['id']) || !ctype_digit($args['id'])) {
            throw new \InvalidArgumentException('Invalid id');
        }

        $file = Versioned::get_by_stage(File::class, $this->sourceStage())
            ->byId($args['id']);

        if (!$file) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s not published or doesn\'t exist',
                File::class,
                $args['id']
            ));
        }

        if (!$this->hasPermission($file, $context['currentUser'])) {
            throw new \InvalidArgumentException(sprintf(
                '%s#%s %s not allowed',
                File::class,
                $args['id'],
                $this->name
            ));
        }

        $this->mutateFile($file);

        return $file;
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
