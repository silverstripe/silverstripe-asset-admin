<?php

namespace SilverStripe\AssetAdmin\Extensions;

use Embed\Http\NetworkException;
use Embed\Http\RequestException;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Admin\ModalController;
use SilverStripe\AssetAdmin\Forms\RemoteFileFormFactory;
use SilverStripe\AssetAdmin\Exceptions\InvalidRemoteUrlException;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Extension;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\Schema\FormSchema;
use SilverStripe\ORM\ValidationResult;

/**
 * Decorates ModalController with an insert-oembed modal
 *
 * @extends Extension<ModalController>
 */
class RemoteFileModalExtension extends Extension
{
    private static $allowed_actions = array(
        'remoteCreateForm',
        'remoteEditForm',
        'remoteEditFormSchema',
    );

    /**
     * @return HTTPRequest
     */
    protected function getRequest()
    {
        return $this->getOwner()->getController()->getRequest();
    }

    /**
     * @return FormSchema
     */
    protected function getFormSchema()
    {
        return FormSchema::singleton();
    }

    /**
     * Form for creating a new OEmbed object in the WYSIWYG, used by the InsertEmbedModal component
     *
     * @return Form
     */
    public function remoteCreateForm()
    {
        return Injector::inst()->get(RemoteFileFormFactory::class)
            ->getForm(
                $this->getOwner(),
                'remoteCreateForm',
                ['type' => 'create']
            );
    }

    /**
     * Form for editing a OEmbed object in the WYSIWYG, used by the InsertEmbedModal component
     *
     * @return Form
     */
    public function remoteEditForm()
    {
        $url = $this->getRequest()->requestVar('embedurl');
        $form = null;
        $form = Injector::inst()->get(RemoteFileFormFactory::class)
            ->getForm(
                $this->getOwner(),
                'remoteEditForm',
                ['type' => 'edit', 'url' => $url]
            );
        return $form;
    }

    /**
     * Capture the schema handling process, as there is validation done to the URL provided before form is generated
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function remoteEditFormSchema(HTTPRequest $request)
    {
        $schemaID = $request->getURL();
        try {
            $form = $this->remoteEditForm();
            return $this->getSchemaResponse($schemaID, $form);
        } catch (NetworkException | RequestException | InvalidRemoteUrlException $exception) {
            $errors = ValidationResult::create()
                ->addError($exception->getMessage());
            $form = Form::create(null, 'Form', FieldList::create(), FieldList::create());
            $code = $exception->getCode();

            if ($code < 300) {
                $code = 500;
            }

            return $this
                ->getSchemaResponse($schemaID, $form, $errors)
                ->setStatusCode($code);
        }
    }

    /**
     * Generate schema for the given form based on the X-Formschema-Request header value
     *
     * @param string $schemaID ID for this schema. Required.
     * @param Form $form Required for 'state' or 'schema' response
     * @param ValidationResult $errors Required for 'error' response
     * @param array $extraData Any extra data to be merged with the schema response
     * @return HTTPResponse
     */
    protected function getSchemaResponse($schemaID, $form = null, ValidationResult $errors = null, $extraData = [])
    {
        $parts = $this->getRequest()->getHeader(LeftAndMain::SCHEMA_HEADER);
        $data = $this
            ->getFormSchema()
            ->getMultipartSchema($parts, $schemaID, $form, $errors);

        if ($extraData) {
            $data = array_merge($data, $extraData);
        }

        $response = new HTTPResponse(json_encode($data));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
    }
}
