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
    protected $name = 'publishFiles';

    /**
     * @var string
     */
    protected $description = 'Publishes a list of files';

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
     * @param array $args
     * @return File|OperationError
     */
    protected function mutateFile(File $file, $args = [])
    {
        $file->publishRecursive();

        return $file;
    }
}
