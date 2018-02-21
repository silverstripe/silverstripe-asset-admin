<?php

namespace SilverStripe\AssetAdmin\GraphQL;

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
     * @param boolean $force
     * @return Notice|File
     */
    protected function mutateFile(File $file, $force = false)
    {
        if (!$force && $file->hasExtension(RecursivePublishable::class)) {
            $owners = $file->findOwners(false);
            if ($owners->exists()) {
                return new Notice(
                    _t(
                        __CLASS__ . 'OWNER_WARNING',
                        'File "{file}" is used in {count} place|File {file} is used in {count} places.',
                        [
                            'file' => $file->Title,
                            'count' => $owners->count()
                        ]
                    ),
                    'HAS_OWNERS',
                    [$file->ID]
                );
            }
        }

        $file->doUnpublish();

        return $file;
    }
}
