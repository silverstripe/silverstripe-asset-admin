<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\File;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\MutationCreator;
use SilverStripe\GraphQL\OperationResolver;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use SilverStripe\Security\Member;
use InvalidArgumentException;

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
     * @var array
     */
    protected $warningMessages = [];

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
        return Type::listOf($this->manager->getType('PublicationResult'));
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
            'Force' => [
                'type' => Type::boolean(),
                'description' => 'If true, proceed with the mutation, regardless of notices',
                'defaultValue' => false
            ],
            'Quiet' => [
                'type' => Type::boolean(),
                'description' => 'If true, suppress warnings'
            ]
        ];
    }

    /**
     * @param mixed $object
     * @param array $args
     * @param mixed $context
     * @param ResolveInfo $info
     * @return array
     */
    public function resolve($object, array $args, $context, ResolveInfo $info)
    {
        if (!isset($args['IDs']) || !is_array($args['IDs'])) {
            throw new InvalidArgumentException('IDs must be an array');
        }
        $force = isset($args['Force']) && $args['Force'];
        $quiet = isset($args['Quiet']) && $args['Quiet'];
        $result = [];
        $idList = $args['IDs'];
        $files = Versioned::get_by_stage(File::class, $this->sourceStage())
            ->byIds($idList);

        // If warning suppression is not on, bundle up all the warnings into a single exception
        if (!$quiet && $files->count() < count($idList)) {
            $missingIds = array_diff($idList, $files->column('ID'));
            foreach ($missingIds as $id) {
                $this->addWarningMessage(sprintf(
                    'File #%s either does not exist or is not on stage %s.',
                    $id,
                    $this->sourceStage()
                ));
            }
        }
        $allowedFiles = [];
        // Check permissions
        foreach ($files as $file) {
            if ($this->hasPermission($file, $context['currentUser'])) {
                $allowedFiles[] = $file;
            } elseif (!$quiet) {
                $this->addWarningMessage(sprintf(
                    'User does not have permission to perform this operation on file "%s"',
                    $file->Title
                ));
            }
        }

        if (!empty($this->warningMessages)) {
            throw new InvalidArgumentException(implode('\n', $this->warningMessages));
        }

        foreach ($allowedFiles as $file) {
            $result[] = $this->mutateFile($file, $force);
        }

        return $result;
    }

    /**
     * @param $msg
     */
    protected function addWarningMessage($msg)
    {
        $this->warningMessages[] = $msg;
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
     * @param boolean $force
     * @return File|Notice
     */
    abstract protected function mutateFile(File $file, $force = false);

    /**
     * Return true if the member has permission to do the mutation
     *
     * @param File $file
     * @param Member $member
     * @return boolean
     */
    abstract protected function hasPermission(File $file, Member $member);
}
