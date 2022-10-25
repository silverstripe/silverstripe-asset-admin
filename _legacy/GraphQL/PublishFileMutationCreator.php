<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Dev\Deprecation;
use SilverStripe\Assets\File;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\Manager;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\Security\Member;

if (!class_exists(PublicationMutationCreator::class)) {
    return;
}

/**
 * @deprecated 1.8.0 Use the latest version of graphql instead
 */
class PublishFileMutationCreator extends PublicationMutationCreator implements OperationResolver
{
    /**
     * @var string
     */
    protected $name = 'publishFiles';

    /**
     * @var string
     */
    protected $description = 'Publishes a list of files';

    /**
     * @return string
     */
    public function __construct(Manager $manager = null)
    {
        Deprecation::notice('1.8.0', 'Use the latest version of graphql instead', Deprecation::SCOPE_CLASS);
        parent::__construct($manager);
    }

    protected function sourceStage()
    {
        return Versioned::DRAFT;
    }

    /**
     * @param File $file
     * @param Member $member
     * @return boolean
     */
    protected function hasPermission(File $file, Member $member)
    {
        return $file->canPublish($member);
    }

    /**
     * @param File $file
     * @param boolean $force
     * @return File|Notice
     */
    protected function mutateFile(File $file, $force = false)
    {
        $file->publishRecursive();

        return $file;
    }
}
