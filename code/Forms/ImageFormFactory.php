<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TextField;
use SilverStripe\Control\Controller;

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
        $tab = parent::getFormFieldAttributesTab($record, $context);

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
            )
            ->addExtraClass('fieldgroup--fill-width')
            ->setName('Dimensions')
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

    /**
     * @param Controller $controller
     * @param string $name
     * @param array $context
     * @return Form
     */
    public function getForm(Controller $controller, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
    	$form = parent::getForm($controller, $name, $context);
    	$dimensions = $form->Fields()->fieldByName('Editor.Placement.Dimensions');
		$widthField = $form->Fields()->dataFieldByName('InsertWidth');
		$heightField = $form->Fields()->dataFieldByName('InsertHeight');
        if ($dimensions && $widthField && $heightField) {
    		$dimensions->setSchemaComponent('ProportionConstraintField');
    		$dimensions->setSchemaState([
    			'data' => [
    				'ratio' => $widthField->dataValue() / $heightField->dataValue()
    			]
    		]);
    	}

    	return $form;
    }

}
