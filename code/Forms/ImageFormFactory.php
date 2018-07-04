<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\OptionsetField;
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
        $width = $record->getWidth();
        $height = $record->getHeight();
        $dimensions = $width && $height ? sprintf('%dx%dpx', $width, $height) : '';
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

        $alignments = [
            'leftAlone' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentLeftAlone', 'Left'),
            'center' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentCenter', 'Center'),
            'rightAlone' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentRightAlone', 'Right'),
            'left' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentLeft', 'Left wrap'),
            'right' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentRight', 'Right wrap'),
        ];

        $tab->push(
            OptionsetField::create(
                'Alignment',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Alignment', 'Alignment'),
                $alignments
            )
                ->addExtraClass('insert-embed-modal__placement')
        );
        $tab->push(
            FieldGroup::create(
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageSpecs', 'Dimensions'),
                TextField::create(
                    'Width',
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageWidth', 'Width')
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow'),
                TextField::create(
                    'Height',
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageHeight', 'Height')
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow')
            )
            ->addExtraClass('fieldgroup--fill-width')
            ->setName('Dimensions')
        );

        $tab->insertBefore(
            'Caption',
            TextField::create('AltText', _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AltText', 'Alternative text (alt)'))
                ->setDescription(_t(
                    'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AltTextDescription',
                    'Shown to screen readers or if image can\'t be displayed'
                ))
        );
        $tab->insertAfter(
            'AltText',
            TextField::create('TitleTooltip', _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.TitleTooltip', 'Title text (tooltip)'))
                ->setDescription(_t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.TitleTooltipDescription', 'For additional information about the image'))
                ->setValue($record->Title)
        );

        return $tab;
    }

    /**
     * @param RequestHandler $controller
     * @param string $name
     * @param array $context
     * @return Form
     */
    public function getForm(RequestHandler $controller = null, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
        $this->beforeExtending('updateForm', function ($form) use ($context) {
            $record = null;
            if (isset($context['Record'])) {
                $record = $context['Record'];
            }

            if (!$record) {
                return;
            }
            /** @var FieldList $fields */
            $fields = $form->Fields();

            $dimensions = $fields->fieldByName('Editor.Placement.Dimensions');
            $width = null;
            $height = null;

            if ($dimensions) {
                $width = $record->getWidth();
                $height = $record->getHeight();
            }

            if ($width && $height) {
                $ratio = $width / $height;

                $dimensions->setSchemaComponent('ProportionConstraintField');
                $dimensions->setSchemaState([
                    'data' => [
                        'ratio' => $ratio
                    ]
                ]);
            }
        });

        return parent::getForm($controller, $name, $context);
    }
}
