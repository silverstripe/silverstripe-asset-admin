<?php

namespace SilverStripe\AssetAdmin\Model;

use SilverStripe\Assets\Image;
use SilverStripe\Core\Injector\Injectable;

/**
 * The outcome of an image edit: the updated original (the same record that was edited, now holding
 * the rendered bytes) and the filename of the backup copy, when one was written.
 */
class ImageEditorResult
{
    use Injectable;

    private Image $image;

    private ?string $backupFilename;

    public function __construct(Image $image, ?string $backupFilename)
    {
        $this->image = $image;
        $this->backupFilename = $backupFilename;
    }

    public function getImage(): Image
    {
        return $this->image;
    }

    public function getBackupFilename(): ?string
    {
        return $this->backupFilename;
    }
}
