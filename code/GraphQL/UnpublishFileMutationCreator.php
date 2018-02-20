<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use GraphQL\Type\Definition\Type;
use Psr\Log\LogLevel;
use SilverStripe\Assets\File;
use SilverStripe\Versioned\RecursivePublishable;
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
     * @param File|RecursivePublishable $file
     * @param array $args
     * @return OperationError|File
     */
    protected function mutateFile(File $file, $args = [])
    {
        if (!isset($args['Force']) || !$args['Force'] && $file->hasExtension(RecursivePublishable::class)) {
            $owners = $file->findOwners();
            if ($owners->exists()) {
                return new OperationError(
                    sprintf('File "%s" is used in %s places.', $file->Title, $owners->count()),
                    'HAS_OWNERS',
                    LogLevel::WARNING,
                    [$file->ID]
                );
            }
        }

        $file->doUnpublish();

        return $file;
    }
}
