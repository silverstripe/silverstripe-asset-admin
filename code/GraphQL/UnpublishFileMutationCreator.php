<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\File;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Security\Member;

class UnpublishFileMutationCreator extends PublicationMutationCreator
{
    /**
     * @var string
     */
    protected $name = 'unpublishFiles';

    /**
     * @var string
     */
    protected $description = 'Unpublishes a list of files';

    /**
     * @return string
     */
    protected function sourceStage()
    {
        return Versioned::LIVE;
    }

    /**
     * @param File $file
     * @param Member $member
     * @return boolean
     */
    protected function hasPermission(File $file, Member $member)
    {
        return $file->canUnpublish($member);
    }

    /**
     * @param File $file
     */
    protected function mutateFile(File $file)
    {
        $file->doUnpublish();
    }
}
