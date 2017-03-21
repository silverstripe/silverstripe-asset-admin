<?php

namespace SilverStripe\AssetAdmin\Forms;

use Embed\Exceptions\InvalidUrlException;
use InvalidArgumentException;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Extensible;
use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\HTMLEditor\HTMLEditorField_Embed;
use SilverStripe\Forms\LabelField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\OptionsetField;
use SilverStripe\Forms\ReadonlyField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\TextField;

class RemoteFileFormFactory implements FormFactory
{
    use Extensible;
    use Configurable;
    
    private static $fileurl_scheme_whitelist = ['http', 'https'];
    
    private static $fileurl_domain_whitelist = [];
    
    /**
     * @param Controller $controller
     * @param string $name
     * @param array $context
     * @return Form
     */
    public function getForm(Controller $controller, $name = self::DEFAULT_NAME, $context = [])
    {
        // Validate context
        foreach ($this->getRequiredContext() as $required) {
            if (!isset($context[$required])) {
                throw new InvalidArgumentException("Missing required context $required");
            }
        }
    
        $fields = $this->getFormFields($controller, $name, $context);
        $actions = $this->getFormActions($controller, $name, $context);
        
        $validator = new RequiredFields();
        $form = Form::create($controller, $name, $fields, $actions, $validator);
        $form->addExtraClass('form--fill-height');
        $form->addExtraClass('insert-embed-modal--'. strtolower($context['type']));
    
        // Extend form
        $this->invokeWithExtensions('updateForm', $form, $controller, $name, $context);
    
        return $form;
    }
    
    public function getRequiredContext()
    {
        return ['type'];
    }
    
    protected function getFormFields($controller, $name, $context)
    {
        $fields = [];
        $url = (isset($context['url'])) ? $context['url'] : null;
        
        if ($context['type'] === 'create') {
            $fields = [
                LabelField::create('UrlDescription', _t(
                    'RemoteFileForm.UrlDescription',
                    'Embed Youtube and Vimeo videos, images and other media directly from the web.'
                )),
                TextField::create('Url', ''),
            ];
        }
        
        if ($context['type'] === 'edit' && $url && $this->validateUrl($url)) {
            $embed = $this->getEmbed($url);
            $alignments = array(
                'leftAlone' => _t('AssetAdmin.AlignmentLeftAlone', 'On the left, on its own.'),
                'center' => _t('AssetAdmin.AlignmentCenter', 'Centered, on its own.'),
                'rightAlone' => _t('AssetAdmin.AlignmentRightAlone', 'On the right, on its own.'),
                'left' => _t('AssetAdmin.AlignmentLeft', 'On the left, with text wrapping around.'),
                'right' => _t('AssetAdmin.AlignmentRight', 'On the right, with text wrapping around.'),
            );
            
            $fields = CompositeField::create([
                LiteralField::create('Preview', sprintf('<img src="%s" class="%s" />',
                    $embed->getPreviewURL(),
                    'insert-embed-modal__preview'
                ))->addExtraClass('insert-embed-modal__preview-container'),
                HiddenField::create('PreviewUrl', 'PreviewUrl', $embed->getPreviewURL()),
                CompositeField::create([
                    ReadonlyField::create('Url', $embed->getName(), $url),
                    TextField::create('CaptionText', _t('AssetAdmin.Caption', 'Caption')),
                    OptionsetField::create(
                        'Placement',
                        _t('AssetAdmin.Placement', 'Placement'),
                        $alignments
                    )
                        ->addExtraClass('insert-embed-modal__placement'),
                    FieldGroup::create(
                        _t('AssetAdmin.ImageSpecs', 'Dimensions'),
                        TextField::create(
                            'Width',
                            _t('AssetAdmin.ImageWidth', 'Width'),
                            $embed->getWidth()
                        )
                            ->setMaxLength(5)
                            ->addExtraClass('flexbox-area-grow'),
                        TextField::create(
                            'Height',
                            _t('AssetAdmin.ImageHeight', 'Height'),
                            $embed->getHeight()
                        )
                            ->setMaxLength(5)
                            ->addExtraClass('flexbox-area-grow')
                    )->addExtraClass('fieldgroup--fill-width')
                ])->addExtraClass('flexbox-area-grow'),
            ])->addExtraClass('insert-embed-modal__fields--fill-width');
        }
        
        return FieldList::create($fields);
    }
    
    protected function getFormActions($controller, $name, $context)
    {
        $actions = [];
        
        if ($context['type'] === 'create') {
            $actions = [
                FormAction::create('addmedia', _t('RemoteFileForm.AddMedia', 'Add media'))
                    ->setSchemaData(['data' => ['buttonStyle' => 'primary']]),
            ];
        }
        
        if ($context['type'] === 'edit') {
            $actions = [
                FormAction::create('insertmedia', _t('RemoteFileForm.InsertMedia', 'Insert media'))
                    ->setSchemaData(['data' => ['buttonStyle' => 'primary']]),
                FormAction::create('cancel', _t('RemoteFileForm.Cancel', 'Cancel')),
            ];
        }
    
        return FieldList::create($actions);
    }
    
    /**
     * @param $url
     * @return bool
     * @throws InvalidUrlException
     */
    protected function validateUrl($url)
    {
        if (!Director::is_absolute_url($url)) {
            throw new InvalidUrlException(_t(
                "HTMLEditorField_Toolbar.ERROR_ABSOLUTE",
                "Only absolute urls can be embedded"
            ));
        }
        $scheme = strtolower(parse_url($url, PHP_URL_SCHEME));
        $allowed_schemes = self::config()->get('fileurl_scheme_whitelist');
        if (!$scheme || ($allowed_schemes && !in_array($scheme, $allowed_schemes))) {
            throw new InvalidUrlException(_t(
                "HTMLEditorField_Toolbar.ERROR_SCHEME",
                "This file scheme is not included in the whitelist"
            ));
        }
        $domain = strtolower(parse_url($url, PHP_URL_HOST));
        $allowed_domains = self::config()->get('fileurl_domain_whitelist');
        if (!$domain || ($allowed_domains && !in_array($domain, $allowed_domains))) {
            throw new InvalidUrlException(_t(
                "HTMLEditorField_Toolbar.ERROR_HOSTNAME",
                "This file hostname is not included in the whitelist"
            ));
        }
        return true;
    }
    
    protected function getEmbed($url)
    {
        $embed = new HTMLEditorField_Embed($url);
        
        return $embed;
    }
}
