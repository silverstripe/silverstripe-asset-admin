<?php

namespace SilverStripe\AssetAdmin\Tests\Model\ImageEditorTest;

use SilverStripe\Assets\Image;
use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;

/**
 * Records what each of the four hooks was handed, and rewrites the backup's title and the
 * replacement's bytes, so a test can prove an extension's changes are the ones persisted.
 * The unwritten record is the only handle either "before" hook gets on the bytes.
 */
class SaveHookExtension extends Extension implements TestOnly
{
    /**
     * Substituted for the real render. Not a valid image, which is the point: only a byte-for-byte
     * write of what the hook left behind produces it.
     */
    public const REPLACEMENT_BYTES = 'substituted-by-extension';

    public const BACKUP_TITLE = 'Titled by extension';

    public static array $calls = [];

    public static function reset(): void
    {
        SaveHookExtension::$calls = [];
    }

    protected function onBeforeCreateBackup(Image $backup, Image $source): void
    {
        SaveHookExtension::$calls[] = [
            'hook' => 'onBeforeCreateBackup',
            // Unwritten: the de-duplicating rename runs inside the write that follows.
            'backupId' => (int) $backup->ID,
            'backupName' => (string) $backup->Name,
            'sourceId' => (int) $source->ID,
        ];
        $backup->Title = SaveHookExtension::BACKUP_TITLE;
    }

    protected function onAfterCreateBackup(Image $backup, Image $source): void
    {
        SaveHookExtension::$calls[] = [
            'hook' => 'onAfterCreateBackup',
            'backupId' => (int) $backup->ID,
            'backupName' => (string) $backup->Name,
            'sourceId' => (int) $source->ID,
        ];
    }

    protected function onBeforeReplaceOriginal(Image $source, array $transforms): void
    {
        SaveHookExtension::$calls[] = [
            'hook' => 'onBeforeReplaceOriginal',
            'sourceId' => (int) $source->ID,
            'rotate' => $transforms['rotate'],
            // The bytes the render produced, before this extension substitutes its own.
            'renderedBytes' => (string) $source->getString(),
        ];
        $source->setFromString(SaveHookExtension::REPLACEMENT_BYTES, $source->getFilename());
    }

    protected function onAfterReplaceOriginal(Image $source, array $transforms): void
    {
        SaveHookExtension::$calls[] = [
            'hook' => 'onAfterReplaceOriginal',
            'sourceId' => (int) $source->ID,
            'rotate' => $transforms['rotate'],
            // The write has happened, so the record already carries the substituted bytes.
            'storedBytes' => (string) $source->getString(),
        ];
    }
}
