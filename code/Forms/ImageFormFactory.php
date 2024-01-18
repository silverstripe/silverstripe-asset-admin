<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\Image;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\OptionsetField;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\Tip;
use SilverStripe\Forms\TippableFieldInterface;

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
        $tab = parent::getFormFieldAttributesTab($record, $context);

        $alignments = [
            'leftAlone' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentLeftAlone', 'Left'),
            'center' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentCenter', 'Center'),
            'rightAlone' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentRightAlone', 'Right'),
            'left' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentLeft', 'Left wrap'),
            'right' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentRight', 'Right wrap'),
        ];

        $tab->insertBefore(
            'Caption',
            OptionsetField::create(
                'Alignment',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Alignment', 'Alignment'),
                $alignments
            )
                ->addExtraClass('insert-embed-modal__placement')
        );

        $tab->insertAfter(
            'Alignment',
            FieldGroup::create(
                NumericField::create(
                    'Width',
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageWidth', 'Width')
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow'),
                NumericField::create(
                    'Height',
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageHeight', 'Height')
                )
                    ->setMaxLength(5)
                    ->addExtraClass('flexbox-area-grow')
            )
                ->addExtraClass('fieldgroup--fill-width')
                ->setName('Dimensions')
        );
        if (Image::getLazyLoadingEnabled()) {
            $str = 'Lazy loading can increase perceived page performance by slightly delaying media loading. ' .
            'Eager loading will load files as soon as possible and can be used if the image is in view as the page ' .
            'loads (above or near the fold).';
            $titleTipContent = _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.LoadingTitleTip', $str);
            $field = DropdownField::create(
                'Loading',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Loading', 'Loading'),
                [
                    '' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.LazyDefault', 'Lazy (default)'),
                    'eager' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Eager', 'Eager'),
                ]
            )
                ->setTitleTip(new Tip($titleTipContent));
            $tab->insertAfter('Dimensions', $field);
        }

        $tab->insertAfter(
            'Caption',
            $altTextField = TextField::create(
                'AltText',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AltText', 'Alternative text (alt)')
            )
        );

        $altTextDescription = _t(
            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AltTextTip',
            'Description for visitors who are unable to view the image (using screenreaders or ' .
            'image blockers). Recommended for images which provide unique context to the content.'
        );

        $tab->insertAfter(
            'AltText',
            $titleField = TextField::create(
                'TitleTooltip',
                _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.TitleTooltip', 'Title text (tooltip)')
            )
        );

        $titleDescription = _t(
            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.TitleTooltipTip',
            'Provides a long form explanation if required. Shown on hover.'
        );

        if ($altTextField instanceof TippableFieldInterface) {
            $altTextField->setTip(new Tip($altTextDescription, Tip::IMPORTANCE_LEVELS['HIGH']));
            $titleField->setTip(new Tip($titleDescription, Tip::IMPORTANCE_LEVELS['NORMAL']));
        } else {
            $altTextField->setDescription($altTextDescription);
            $titleField->setDescription($titleDescription);
        }

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
        $this->beforeExtending('updateForm', function (Form $form) use ($context) {
            $record = null;
            if (isset($context['Record'])) {
                $record = $context['Record'];
            }

            if (!$record) {
                return;
            }
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
                        'ratio' => $ratio,
                        'originalWidth' => $record->getWidth(),
                        'originalHeight' => $record->getHeight(),
                    ]
                ]);
            }
        });

        $form = parent::getForm($controller, $name, $context);
        // Unset the width and height value and let the front end decide the default insert size.

        $form->loadDataFrom([ 'Width' => '', 'Height' => '']);

        return $form;
    }
}
