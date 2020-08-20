<?php

namespace SilverStripe\AssetAdmin\GraphQL;

use SilverStripe\Assets\File;
use SilverStripe\i18n\i18nEntityProvider;
use SilverStripe\Versioned\RecursivePublishable;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Security\Member;

class UnpublishFileMutationCreator extends PublicationMutationCreator implements i18nEntityProvider
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
        // If not forcing, make sure we aren't interfering with any owners
        if (!$force) {
            $ownersCount = $this->countLiveOwners($file);
            if ($ownersCount) {
                return new Notice(
                    _t(
                        __CLASS__ . '.OWNER_WARNING',
                        'File "{file}" is used in {count} place|File "{file}" is used in {count} places.',
                        [
                            'file' => $file->Title,
                            'count' => $ownersCount
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

    public function provideI18nEntities()
    {
        return [
            __CLASS__ . '.OWNER_WARNING' => [
                'one' => 'File "{file}" is used in {count} place.',
                'other' => 'File "{file}" is used in {count} places.',
            ],
        ];
    }

    /**
     * Count number of live owners this file uses
     *
     * @param File $file
     * @return int Number of live owners
     */
    protected function countLiveOwners(File $file)
    {
        // In case no versioning
        if (!$file->hasExtension(RecursivePublishable::class)) {
            return 0;
        }

        // Query live record
        /** @var Versioned|RecursivePublishable $liveRecord */
        $liveRecord = Versioned::get_by_stage(File::class, Versioned::LIVE)->byID($file->ID);
        if ($liveRecord) {
            return $liveRecord
                ->findOwners(false)
                ->count();
        }

        // No live record, no live owners
        return 0;
    }
}
