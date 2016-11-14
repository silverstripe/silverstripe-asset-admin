<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\File;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TextField;

class ImageFormFactory extends FileFormFactory
{
    use Configurable;

    /**
     * Default insertion width for Images and Media
     *
     * @config
     * @var int
     */
    private static $insert_width = 600;

    /**
     * Default insert height for images and media
     *
     * @config
     * @var int
     */
    private static $insert_height = 360;

    protected function getSpecsMarkup($record)
    {
        if (!$record || !$record->exists()) {
            return null;
        }
        // Add dimensions to specs
        $dimensions = $record->getDimensions() ? $record->getDimensions() . 'px,' : '';
        return sprintf(
            '<div class="editor__specs">%s %s %s</div>',
            $dimensions,
            $record->getSize(),
            $this->getStatusFlagMarkup($record)
        );
    }

    protected function getFormFieldAttributesTab($record, $context = [])
    {
        /** @var Tab $tab */
        $tab = parent::getFormFieldAttributesTab($record);

        $alignments = array(
            'leftAlone' => _t('AssetAdmin.AlignmentLeftAlone', 'On the left, on its own.'),
            'center' => _t('AssetAdmin.AlignmentCenter', 'Centered, on its own.'),
            'left' => _t('AssetAdmin.AlignmentLeft', 'On the left, with text wrapping around.'),
            'right' => _t('AssetAdmin.AlignmentRight', 'On the right, with text wrapping around.'),
        );

        $tab->push(
            DropdownField::create('Alignment', _t('AssetAdmin.Alignment', 'Alignment'), $alignments)
        );
        $tab->push(
            FieldGroup::create(_t('AssetAdmin.ImageSpecs', 'Dimensions'),
                TextField::create(
                    'Width',
                    _t('AssetAdmin.ImageWidth', 'Width'),
                    $this->getInsertWidth($record)
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow'),
                TextField::create(
                    'Height',
                    _t('AssetAdmin.ImageHeight', 'Height'),
                    $this->getInsertHeight($record)
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow')
            )->addExtraClass('fill-width')
        );

        $tab->insertBefore(
            'Caption',
            TextField::create('AltText', _t('AssetAdmin.AltText', 'Alternative text (alt)'))
                ->setDescription(_t('AssetAdmin.AltTextDescription', 'Shown to screen readers or if image can\'t be displayed'))
        );
        $tab->insertAfter(
            'AltText',
            TextField::create('TitleTooltip', _t('AssetAdmin.TitleTooltip', 'Title text (tooltip)'))
                ->setDescription(_t('AssetAdmin.TitleTooltipDescription', 'For additional information about the image'))
                ->setValue($record->Title)
        );

        return $tab;
    }

    /**
     * Provide an initial width for inserted media, restricted based on $embed_width
     *
     * @param File $file
     * @return int
     */
    protected function getInsertWidth($file)
    {
        $maxWidth = $this->config()->insert_width;

        $width = max($file->getWidth(), $maxWidth);

        return min($width, $maxWidth);
    }

    /**
     * Provide an initial height for inserted media, scaled proportionally to the initial width
     *
     * @param File $file
     * @return int
     */
    protected function getInsertHeight($file)
    {
        $maxWidth = $this->config()->insert_width;
        $maxHeight = $this->config()->insert_height;

        $width = max($file->getWidth(), $maxWidth);
        $height = max($file->getHeight(), $maxHeight);

        return ($width <= $maxWidth) ? $height : round($height * ($maxWidth / $width));
    }

}
