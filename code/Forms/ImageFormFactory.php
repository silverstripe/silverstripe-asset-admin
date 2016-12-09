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
            FieldGroup::create(
                _t('AssetAdmin.ImageSpecs', 'Dimensions'),
                TextField::create(
                    'InsertWidth',
                    _t('AssetAdmin.ImageWidth', 'Width')
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow'),
                TextField::create(
                    'InsertHeight',
                    _t('AssetAdmin.ImageHeight', 'Height')
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow')
            )->addExtraClass('fill-width')
        );

        $tab->insertBefore(
            'Caption',
            TextField::create('AltText', _t('AssetAdmin.AltText', 'Alternative text (alt)'))
                ->setDescription(_t(
                    'AssetAdmin.AltTextDescription',
                    'Shown to screen readers or if image can\'t be displayed'
                ))
        );
        $tab->insertAfter(
            'AltText',
            TextField::create('TitleTooltip', _t('AssetAdmin.TitleTooltip', 'Title text (tooltip)'))
                ->setDescription(_t('AssetAdmin.TitleTooltipDescription', 'For additional information about the image'))
                ->setValue($record->Title)
        );

        return $tab;
    }
}
