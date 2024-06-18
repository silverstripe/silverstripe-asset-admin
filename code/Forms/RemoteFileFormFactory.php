<?php

namespace SilverStripe\AssetAdmin\Forms;

use InvalidArgumentException;
use SilverStripe\AssetAdmin\Exceptions\InvalidRemoteUrlException;
use SilverStripe\Control\Director;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\OptionsetField;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\TextField;
use SilverStripe\View\Embed\Embeddable;

class RemoteFileFormFactory implements FormFactory
{
    use Extensible;
    use Configurable;

    /**
     * Force whitelist for resource protocols to the given list.
     *
     * @config
     * @var array
     */
    private static $fileurl_scheme_whitelist = ['http', 'https'];

    /**
     * Blacklist of resources. Takes priority over whitelists if both are provided.
     *
     * @config
     * @var array
     */
    private static $fileurl_scheme_blacklist = [];

    /**
     * Force whitelist for resource domains to the given list
     *
     * @config
     * @var array
     */
    private static $fileurl_domain_whitelist = [];

    /**
     * Blacklist of domains. For example, live sites should probably
     * include 'localhost' and other protected urls.
     * Takes priority over whitelists if both are provided.
     *
     * @config
     * @var array
     */
    private static $fileurl_domain_blacklist = [];

    /**
     * Whitelist of ports allowed.
     *
     * @config
     * @var array
     */
    private static $fileurl_port_whitelist = [80, 443];

    /**
     * Blacklist of ports allowed.
     * Takes priority over whitelists if both are provided.
     *
     * @config
     * @var array
     */
    private static $fileurl_port_blacklist = [];

    /**
     * Allow oembed to be disabled
     *
     * @config
     * @var bool
     */
    private static $enabled = true;

    /**
     * @param RequestHandler $controller
     * @param string $name
     * @param array $context
     * @return Form
     */
    public function getForm(RequestHandler $controller = null, $name = RemoteFileFormFactory::DEFAULT_NAME, $context = [])
    {
        // Allow form to be disabled
        if (!static::config()->get('enabled')) {
            return null;
        }

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
        $form->addExtraClass('form--no-dividers');
        $form->addExtraClass('insert-embed-modal--'. strtolower($context['type'] ?? ''));

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
        $formType = $context['type'];
        switch ($formType) {
            case 'create':
                return $this->getCreateFormFields();
            case 'edit':
                return $this->getEditFormFields($context);
            default:
                throw new InvalidArgumentException("Unknown media form type: {$formType}");
        }
    }

    protected function getFormActions($controller, $name, $context)
    {
        $actions = [];

        if ($context['type'] === 'create') {
            $actions = [
                FormAction::create('addmedia', _t(__CLASS__.'.AddMedia', 'Add media'))
                    ->setSchemaData(['data' => ['buttonStyle' => 'primary']]),
            ];
        }

        if ($context['type'] === 'edit') {
            $actions = [
                FormAction::create('insertmedia', _t(__CLASS__.'.InsertMedia', 'Insert media'))
                    ->setSchemaData(['data' => ['buttonStyle' => 'primary']]),
                FormAction::create('cancel', _t(__CLASS__.'.Cancel', 'Cancel')),
            ];
        }

        return FieldList::create($actions);
    }

    /**
     * @param string $url
     * @return bool
     * @throws InvalidRemoteUrlException
     */
    protected function validateUrl($url)
    {
        $this->validateURLAbsolute($url);
        $this->validateURLScheme($url);
        $this->validateURLHost($url);
        $this->validateURLPort($url);

        return true;
    }

    /**
     * Checks if the embed generated is not just a link
     *
     * @param Embeddable $embed
     * @return bool
     * @throws InvalidRemoteUrlException
     */
    protected function validateEmbed(Embeddable $embed)
    {
        if (!$embed->validate()) {
            throw new InvalidRemoteUrlException(_t(
                __CLASS__.'.ERROR_EMBED',
                'There is currently no embeddable media available from this URL'
            ));
        }
        return true;
    }

    /**
     * Get form fields for create new embed
     *
     * @return FieldList
     */
    protected function getCreateFormFields()
    {
        return FieldList::create([
            TextField::create(
                'Url',
                'Embed URL'
            )
                ->setInputType('url')
                ->addExtraClass('insert-embed-modal__url-create')
                ->setDescription(_t(
                    __CLASS__.'.UrlDescription',
                    'Embed Youtube and Vimeo videos, images and other media directly from the web.'
                )),
        ]);
    }

    /**
     * Get form fields for edit form
     *
     * @param array $context
     * @return FieldList
     * @throws InvalidRemoteUrlException
     */
    protected function getEditFormFields($context)
    {
        // Check if the url is valid
        $url = (isset($context['url'])) ? $context['url'] : null;
        if (empty($url)) {
            return $this->getCreateFormFields();
        }

        $url = trim($url ?? '');

        // Get embed
        $this->validateUrl($url);

        $embed = Injector::inst()->create(Embeddable::class, $url);
        $this->validateEmbed($embed);

        // Build form
        $alignments = array(
            'leftAlone' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentLeftAlone', 'Left'),
            'center' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentCenter', 'Center'),
            'rightAlone' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentRightAlone', 'Right'),
            'left' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentLeft', 'Left wrap'),
            'right' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AlignmentRight', 'Right wrap'),
        );

        $width = $embed->getWidth();
        $height = $embed->getHeight();

        $fields = CompositeField::create([
            LiteralField::create(
                'Preview',
                sprintf(
                    '<img src="%s" class="%s" />',
                    $embed->getPreviewURL(),
                    'insert-embed-modal__preview'
                )
            )->addExtraClass('insert-embed-modal__preview-container'),
            HiddenField::create('PreviewUrl', 'PreviewUrl', $embed->getPreviewURL()),
            CompositeField::create([
                TextField::create('UrlPreview', $embed->getName(), $url)
                    ->setReadonly(true),
                HiddenField::create('Url', false, $url),
                TextField::create(
                    'CaptionText',
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Caption', 'Caption')
                ),
                OptionsetField::create(
                    'Placement',
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Placement', 'Placement'),
                    $alignments
                )
                    ->addExtraClass('insert-embed-modal__placement'),
                $dimensions = FieldGroup::create(
                    _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageSpecs', 'Dimensions'),
                    TextField::create('Width', '', $width)
                        ->setRightTitle(_t(
                            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageWidth',
                            'Width'
                        ))
                        ->setMaxLength(5)
                        ->addExtraClass('flexbox-area-grow'),
                    TextField::create('Height', '', $height)
                        ->setRightTitle(_t(
                            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.ImageHeight',
                            'Height'
                        ))
                        ->setMaxLength(5)
                        ->addExtraClass('flexbox-area-grow')
                )->addExtraClass('fieldgroup--fill-width')
                    ->setName('Dimensions')
            ])->addExtraClass('flexbox-area-grow'),
        ])->addExtraClass('insert-embed-modal__fields--fill-width');

        if ($dimensions && $width && $height) {
            $ratio = $width / $height;

            $dimensions->setSchemaComponent('ProportionConstraintField');
            $dimensions->setSchemaState([
                'data' => [
                    'ratio' => $ratio,
                    'isRemoteFile' => true
                ]
            ]);
        }
        return FieldList::create($fields);
    }

    /**
     * @param string $url
     * @throws InvalidRemoteUrlException
     */
    protected function validateURLScheme($url)
    {
        $scheme = strtolower(parse_url($url ?? '', PHP_URL_SCHEME) ?? '');
        $allowedSchemes = static::config()->get('fileurl_scheme_whitelist');
        $disallowedSchemes = static::config()->get('fileurl_scheme_blacklist');
        if (!$scheme
            || ($allowedSchemes && !in_array($scheme, $allowedSchemes ?? []))
            || ($disallowedSchemes && in_array($scheme, $disallowedSchemes ?? []))
        ) {
            throw new InvalidRemoteUrlException(_t(
                __CLASS__ . '.ERROR_SCHEME',
                'This file scheme is not allowed'
            ));
        }
    }

    /**
     * @param string $url
     * @throws InvalidRemoteUrlException
     */
    protected function validateURLHost($url)
    {
        $domain = strtolower(parse_url($url ?? '', PHP_URL_HOST) ?? '');
        $allowedDomains = static::config()->get('fileurl_domain_whitelist');
        $disallowedDomains = static::config()->get('fileurl_domain_blacklist');
        if (!$domain
            || ($allowedDomains && !in_array($domain, $allowedDomains ?? []))
            || ($disallowedDomains && in_array($domain, $disallowedDomains ?? []))
        ) {
            throw new InvalidRemoteUrlException(_t(
                __CLASS__ . '.ERROR_HOSTNAME',
                'This file hostname is not allowed'
            ));
        }
    }

    /**
     * @param string $url
     * @throws InvalidRemoteUrlException
     */
    protected function validateURLPort($url)
    {
        $port = (int)parse_url($url ?? '', PHP_URL_PORT);
        if (!$port) {
            return;
        }
        $allowedPorts = static::config()->get('fileurl_port_whitelist');
        $disallowedPorts = static::config()->get('fileurl_port_blacklist');
        if (($allowedPorts && !in_array($port, $allowedPorts ?? []))
            || ($disallowedPorts && in_array($port, $disallowedPorts ?? []))
        ) {
            throw new InvalidRemoteUrlException(_t(
                __CLASS__ . '.ERROR_PORT',
                'This file port is not allowed'
            ));
        }
    }

    /**
     * @param string $url
     * @throws InvalidRemoteUrlException
     */
    protected function validateURLAbsolute($url)
    {
        if (!Director::is_absolute_url($url)) {
            throw new InvalidRemoteUrlException(_t(
                __CLASS__ . '.ERROR_ABSOLUTE',
                'Only absolute urls can be embedded'
            ));
        }
    }
}
