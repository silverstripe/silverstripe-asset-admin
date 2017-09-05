<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\File;
use SilverStripe\Versioned\Versioned;
use SilverStripe\GraphQL\OperationResolver;
use SilverStripe\Security\Member;

class PublishFileMutationCreator extends PublicationMutationCreator implements OperationResolver
{
    /**
     * @var string
     */
    protected $name = 'publishFile';

    /**
     * @var string
     */
    protected $description = 'Publishes a file';

    /**
     * @return string
     */
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
     */
    protected function mutateFile(File $file)
    {
        $file->publishRecursive();
    }
}
