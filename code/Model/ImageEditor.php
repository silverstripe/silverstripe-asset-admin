<?php

namespace SilverStripe\AssetAdmin\Model;

use Intervention\Image\Interfaces\ImageInterface;
use InvalidArgumentException;
use RuntimeException;
use SilverStripe\Assets\Image;
use SilverStripe\Assets\Image_Backend;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;

/**
 * Renders a basic edit (flip, 90 degree rotate, crop, resize) of a source Image and replaces the
 * source's own bytes with the result as a new draft version, keeping the record's ID.
 *
 * Whether EXIF/IPTC/XMP metadata and the ICC colour profile survive the re-encode is
 * driver-dependent: the default GD driver strips them, Imagick preserves them. Animation is
 * driver-dependent too: the GD driver flattens an animated GIF to its first frame.
 */
class ImageEditor
{
    use Injectable;
    use Configurable;
    use Extensible;

    /**
     * Upper bound on the source size to render. Megapixels rather than megabytes because the memory
     * at risk is the uncompressed bitmap, whose size is width x height. Set to 0 for unlimited.
     */
    private static int $max_source_megapixels = 50;

    /**
     * Whether the editor's "back up the original image" option starts ticked.
     */
    private static bool $backup_original_by_default = true;

    /**
     * Quality (1-100) to encode an edited image at, for formats where quality is meaningful. Null
     * falls back to the image backend's own quality, which resampled images use as well.
     */
    private static ?int $output_quality = null;

    /**
     * Render the edit described by $transforms and write it over $source's own bytes as a new draft
     * version, optionally backing the pre-edit bytes up to a new file in the same folder first.
     *
     * Rotation is clockwise, crop ratios apply to the working image, and an absent backupOriginal
     * falls back to the backup_original_by_default config.
     *
     * @param array{
     *     flip?: array{horizontal?: bool, vertical?: bool},
     *     rotate?: 0|90|180|270,
     *     crop?: array{x: float, y: float, width: float, height: float},
     *     resize?: array{width?: int, height?: int},
     *     backupOriginal?: bool,
     * } $transforms
     * @throws InvalidArgumentException When the transforms payload is malformed or out of range.
     * @throws RuntimeException When the source is too large or cannot be rendered.
     */
    public function editImage(Image $source, array $transforms): ImageEditorResult
    {
        $transforms = $this->normaliseTransforms($transforms);
        $this->guardSourceSize($source);
        $this->guardResizeSize($source, $transforms);
        $bytes = $this->renderImage($source, $transforms);
        if ($bytes === '') {
            throw new RuntimeException('The image could not be rendered');
        }
        // The backup must be taken before the replacement overwrites the bytes it copies.
        $backupFilename = $transforms['backupOriginal'] ? $this->createBackup($source) : null;
        $this->replaceOriginal($source, $bytes, $transforms);
        return ImageEditorResult::create($source, $backupFilename);
    }

    /**
     * Whether a request's optional backupOriginal flag ends up writing a backup copy. Callers that
     * act on the answer before the edit runs - the endpoint gates its create-permission check on
     * it - must not resolve the config fallback a second time.
     */
    public function willBackupOriginal(mixed $backupOriginal): bool
    {
        // Only an absent flag falls back to the config; a sent false is a real choice.
        return $backupOriginal === null
            ? (bool) static::config()->get('backup_original_by_default')
            : (bool) $backupOriginal;
    }

    /**
     * Validate and normalise the raw transforms payload into a predictable structure.
     */
    private function normaliseTransforms(array $transforms): array
    {
        $rotate = $transforms['rotate'] ?? 0;
        if (is_bool($rotate) || !is_numeric($rotate) || (int) $rotate != $rotate) {
            throw new InvalidArgumentException('Rotation must be one of 0, 90, 180 or 270 degrees');
        }
        $rotate = (int) $rotate;
        if (!in_array($rotate, [0, 90, 180, 270], true)) {
            throw new InvalidArgumentException('Rotation must be one of 0, 90, 180 or 270 degrees');
        }

        $flip = $transforms['flip'] ?? [];
        if (!is_array($flip)) {
            throw new InvalidArgumentException('Flip must provide horizontal and vertical flags');
        }
        $flipHorizontal = (bool) ($flip['horizontal'] ?? false);
        $flipVertical = (bool) ($flip['vertical'] ?? false);

        $crop = $transforms['crop'] ?? ['x' => 0.0, 'y' => 0.0, 'width' => 1.0, 'height' => 1.0];
        if (!is_array($crop)) {
            throw new InvalidArgumentException($this->createInvalidCropMessage());
        }
        foreach (['x', 'y', 'width', 'height'] as $key) {
            if (!isset($crop[$key]) || is_bool($crop[$key]) || !is_numeric($crop[$key])) {
                throw new InvalidArgumentException($this->createInvalidCropMessage());
            }
            $crop[$key] = (float) $crop[$key];
        }
        // Epsilon absorbs float rounding on both bounds; calculateCropBox() clamps back inside.
        $epsilon = 0.0001;
        if ($crop['x'] < -$epsilon
            || $crop['y'] < -$epsilon
            || $crop['width'] <= 0
            || $crop['height'] <= 0
            || $crop['x'] + $crop['width'] > 1 + $epsilon
            || $crop['y'] + $crop['height'] > 1 + $epsilon
        ) {
            throw new InvalidArgumentException($this->createInvalidCropMessage());
        }

        $backupOriginal = $this->willBackupOriginal($transforms['backupOriginal'] ?? null);

        // Absent means "no resize", which is distinct from asking for the crop output's own size.
        $resize = ($transforms['resize'] ?? null) === null ? null : $this->normaliseResize($transforms['resize']);

        return [
            'flip' => ['horizontal' => $flipHorizontal, 'vertical' => $flipVertical],
            'rotate' => $rotate,
            'backupOriginal' => $backupOriginal,
            'crop' => [
                'x' => $crop['x'],
                'y' => $crop['y'],
                'width' => $crop['width'],
                'height' => $crop['height'],
            ],
            'resize' => $resize,
        ];
    }

    /**
     * Exactly one dimension: with both there is no aspect ratio on the wire to reconcile them
     * against. A non-positive value is rejected here so it stays a bad request rather than reaching
     * the image backend as a geometry failure.
     *
     * @return array{axis: string, value: int}
     */
    private function normaliseResize(mixed $resize): array
    {
        if (!is_array($resize)) {
            throw new InvalidArgumentException($this->createInvalidResizeMessage());
        }
        $hasWidth = ($resize['width'] ?? null) !== null;
        $hasHeight = ($resize['height'] ?? null) !== null;
        if ($hasWidth === $hasHeight) {
            throw new InvalidArgumentException($this->createInvalidResizeMessage());
        }

        $axis = $hasWidth ? 'width' : 'height';
        $value = $resize[$axis];
        if (is_bool($value) || !is_numeric($value) || (int) $value != $value || (int) $value < 1) {
            throw new InvalidArgumentException('Resize must be a whole number of pixels of at least 1');
        }

        return ['axis' => $axis, 'value' => (int) $value];
    }

    private function createInvalidCropMessage(): string
    {
        return 'Crop must provide x, y, width and height ratios between 0 and 1';
    }

    private function createInvalidResizeMessage(): string
    {
        return 'Resize must provide exactly one of width or height';
    }

    /**
     * Refuse over-large sources from the stored dimensions, before any decode.
     */
    private function guardSourceSize(Image $source): void
    {
        $maxMegapixels = (int) static::config()->get('max_source_megapixels');
        if ($maxMegapixels <= 0) {
            return;
        }
        $pixels = (int) $source->getWidth() * (int) $source->getHeight();
        if ($pixels > $maxMegapixels * 1000000) {
            throw new RuntimeException(_t(
                __CLASS__ . '.SOURCE_TOO_LARGE',
                'Exceeds {limit} megapixel (width x height) limit',
                ['limit' => $maxMegapixels]
            ));
        }
    }

    /**
     * Refuse a resize larger than the crop output. The ceiling is measured against the working
     * image, so this cannot live in the payload-only normaliseTransforms().
     */
    private function guardResizeSize(Image $source, array $transforms): void
    {
        if ($transforms['resize'] === null) {
            return;
        }
        $box = $this->calculateCropBox((int) $source->getWidth(), (int) $source->getHeight(), $transforms);
        [, , $cropWidth, $cropHeight] = $box;
        $ceiling = $transforms['resize']['axis'] === 'width' ? $cropWidth : $cropHeight;
        if ($transforms['resize']['value'] > $ceiling) {
            throw new InvalidArgumentException(_t(
                __CLASS__ . '.RESIZE_TOO_LARGE',
                'Cannot be larger than the cropped image ({width} x {height})',
                ['width' => $cropWidth, 'height' => $cropHeight]
            ));
        }
    }

    /**
     * Apply flip -> rotate -> crop -> resize in canonical order to a clone of the source resource
     * and return the encoded bytes at the configured output quality.
     */
    private function renderImage(Image $source, array $transforms): string
    {
        $backend = $source->getImageBackend();
        if (!$backend instanceof Image_Backend) {
            throw new RuntimeException('The image could not be rendered');
        }
        $resource = $backend->getImageResource();
        if (!$resource instanceof ImageInterface) {
            throw new RuntimeException('The image could not be rendered');
        }

        // The full-resolution decode, plus the clone below, can exceed the default memory_limit.
        Environment::increaseMemoryLimitTo();

        // Clone so the backend's cached resource is never mutated.
        $resource = clone $resource;
        $sourceWidth = $resource->width();
        $sourceHeight = $resource->height();

        if ($transforms['flip']['horizontal']) {
            $resource->flop();
        }
        if ($transforms['flip']['vertical']) {
            $resource->flip();
        }

        // The contract is clockwise but Intervention rotates counter-clockwise for positive angles.
        $angle = (360 - $transforms['rotate']) % 360;
        if ($angle !== 0) {
            $resource->rotate($angle);
        }

        [$left, $top, $width, $height] = $this->calculateCropBox($sourceWidth, $sourceHeight, $transforms);
        $resource->crop($width, $height, $left, $top);

        // Resize last so it only changes the size, never re-frames the box the author drew.
        if ($transforms['resize'] !== null) {
            [$resizeWidth, $resizeHeight] = $this->calculateResizeSize($width, $height, $transforms['resize']);
            $resource->resize($resizeWidth, $resizeHeight);
        }

        return (string) $resource
            ->encodeByExtension($source->getExtension(), quality: $this->getOutputQuality($backend))
            ->toString();
    }

    /**
     * The quality to encode at: the editor's own config where one is set, otherwise the image
     * backend's. Out-of-range values are refused rather than passed on to the driver.
     */
    private function getOutputQuality(Image_Backend $backend): int
    {
        $quality = static::config()->get('output_quality');
        if ($quality === null) {
            return $backend->getQuality();
        }
        $quality = (int) $quality;
        if ($quality < 1 || $quality > 100) {
            throw new InvalidArgumentException('ImageEditor.output_quality must be between 1 and 100');
        }
        return $quality;
    }

    /**
     * Map the crop ratios onto integer crop arguments against the working dimensions, clamped inside
     * the image. Shared by the renderer and the upsize guard, so the guard cannot reject a size that
     * would in fact render.
     *
     * @return array{0: int, 1: int, 2: int, 3: int} [left, top, width, height]
     */
    private function calculateCropBox(int $sourceWidth, int $sourceHeight, array $transforms): array
    {
        // Flip never changes the dimensions; a quarter-turn swaps them.
        $quarterTurn = $transforms['rotate'] === 90 || $transforms['rotate'] === 270;
        $workingWidth = $quarterTurn ? $sourceHeight : $sourceWidth;
        $workingHeight = $quarterTurn ? $sourceWidth : $sourceHeight;
        $crop = $transforms['crop'];

        $left = (int) round($crop['x'] * $workingWidth);
        $top = (int) round($crop['y'] * $workingHeight);
        $width = (int) round($crop['width'] * $workingWidth);
        $height = (int) round($crop['height'] * $workingHeight);

        $left = max(0, min($left, $workingWidth - 1));
        $top = max(0, min($top, $workingHeight - 1));
        $width = max(1, min($width, $workingWidth - $left));
        $height = max(1, min($height, $workingHeight - $top));

        return [$left, $top, $width, $height];
    }

    /**
     * Derive the full output size from the one dimension the author typed, locked to the crop
     * output's ratio. The rounding must stay in step with deriveCounterpart() in
     * ImageEditorModal.js, which previews it: algebraically equal forms differ by a pixel at .5.
     *
     * @param array{axis: string, value: int} $resize
     * @return array{0: int, 1: int} [width, height]
     */
    private function calculateResizeSize(int $cropWidth, int $cropHeight, array $resize): array
    {
        $ratio = $cropWidth / $cropHeight;
        if ($resize['axis'] === 'width') {
            $width = $resize['value'];
            return [$width, max(1, (int) round($width / $ratio))];
        }
        $height = $resize['value'];
        return [max(1, (int) round($height * $ratio)), $height];
    }

    /**
     * Duplicate the source into a new draft file in the same folder holding the pre-edit bytes, and
     * return the generated filename (File::onBeforeWrite() de-duplicates it, so bird.jpg backs up as
     * bird-v2.jpg). The bytes are written into the copy as its own asset because duplicate() alone
     * leaves both records pointing at the same stored asset.
     */
    private function createBackup(Image $source): string
    {
        $bytes = (string) $source->getString();
        $filename = (string) $source->getFilename();

        // Freshly loaded: duplicate() copies field objects, so duplicating $source would share its
        // DBFile instance and the backup's rename would rewrite the filename out from under it.
        $backup = Image::get()->byID($source->ID)->duplicate(false);
        $backup->setFromString($bytes, $filename);
        // Empty so File::onBeforeWrite() re-derives the title from the de-duplicated name.
        $backup->Title = '';
        $this->extend('onBeforeCreateBackup', $backup, $source);
        $backup->write();
        $this->extend('onAfterCreateBackup', $backup, $source);

        return (string) $backup->Name;
    }

    /**
     * Write the rendered bytes over the source's own asset, keeping the record's ID, folder and
     * filename. Under Versioned this lands a new draft version, leaving the published one untouched.
     */
    private function replaceOriginal(Image $source, string $bytes, array $transforms): void
    {
        $source->setFromString($bytes, $source->getFilename());
        // Fires with the rendered bytes on the record but not yet written, so a hook can read them
        // back off it and call setFromString() again to substitute what gets written.
        $this->extend('onBeforeReplaceOriginal', $source, $transforms);
        $source->write();
        $this->extend('onAfterReplaceOriginal', $source, $transforms);
    }
}
