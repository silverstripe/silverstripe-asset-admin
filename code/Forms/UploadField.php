<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FileHandleField;
use SilverStripe\Forms\FileUploadReceiver;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\Validator;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\SS_List;

/**
 * Represents a file upload field with ReactJS based frontend.
 *
 * Allows writing to a parent record with the following relation types:
 *   - has_one
 *   - has_many
 *   - many_many
 *
 * Additionally supports writing directly to the File table not attached
 * to any parent record.
 *
 */
class UploadField extends FormField implements FileHandleField
{
    use FileUploadReceiver;

    /**
     * @config
     * @var array
     */
    private static $allowed_actions = [
        'upload'
    ];

    /**
     * @config
     * @var int
     */
    private static $thumbnail_width = 60;

    /**
     * @config
     * @var int
     */
    private static $thumbnail_height = 60;

    /**
     * Set if uploading new files is enabled.
     * If false, only existing files can be selected
     *
     * @var bool
     */
    protected $uploadEnabled = true;

    /**
     * Set if selecting existing files is enabled.
     * If false, only new files can be selected.
     *
     * @var bool
     */
    protected $attachEnabled = true;

    /**
     * The number of files allowed for this field
     *
     * @var null|int
     */
    protected $allowedMaxFileNumber = null;

    protected $inputType = 'file';

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_CUSTOM;

    protected $schemaComponent = 'UploadField';

    /**
     * @var bool|null
     */
    protected $multiUpload = null;

    /**
     * Create a new file field.
     *
     * @param string $name The internal field name, passed to forms.
     * @param string $title The field label.
     * @param SS_List $items Items assigned to this field
     */
    public function __construct($name, $title = null, SS_List $items = null)
    {
        $this->constructFileUploadReceiver();

        // When creating new files, rename on conflict
        $this->getUpload()->setReplaceFile(false);

        parent::__construct($name, $title);
        if ($items) {
            $this->setItems($items);
        }
    }

    public function getSchemaDataDefaults()
    {
        $defaults = parent::getSchemaDataDefaults();
        $uploadLink = $this->Link('upload');
        $defaults['data']['createFileEndpoint'] = [
            'url' => $uploadLink,
            'method' => 'post',
            'payloadFormat' => 'urlencoded',
        ];

        $defaults['data']['maxFilesize'] = $this->getAllowedMaxFileSize() / 1024 / 1024;
        $defaults['data']['maxFiles'] = $this->getAllowedMaxFileNumber();
        $defaults['data']['multi'] = $this->getIsMultiUpload();
        $defaults['data']['parentid'] = $this->getFolderID();
        $defaults['data']['canUpload'] = $this->getUploadEnabled();
        $defaults['data']['canAttach'] = $this->getAttachEnabled();

        return $defaults;
    }

    /**
     * Creates a single file based on a form-urlencoded upload.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function upload(HTTPRequest $request)
    {
        if ($this->isDisabled() || $this->isReadonly()) {
            return $this->httpError(403);
        }

        // CSRF check
        $token = $this->getForm()->getSecurityToken();
        if (!$token->checkRequest($request)) {
            return $this->httpError(400);
        }

        $tmpFile = $request->postVar('Upload');
        /** @var File $file */
        $file = $this->saveTemporaryFile($tmpFile, $error);

        // Prepare result
        if ($error) {
            $result = [
                'message' => [
                    'type' => 'error',
                    'value' => $error,
                ]
            ];
            $this->getUpload()->clearErrors();
            return (new HTTPResponse(json_encode($result), 400))
                ->addHeader('Content-Type', 'application/json');
        }

        // We need an ID for getObjectFromData
        if (!$file->isInDB()) {
            $file->write();
        }

        // Return success response
        $result = [
            AssetAdmin::singleton()->getObjectFromData($file)
        ];

        // Don't discard pre-generated client side canvas thumbnail
        if ($result[0]['category'] === 'image') {
            unset($result[0]['thumbnail']);
        }
        $this->getUpload()->clearErrors();
        return (new HTTPResponse(json_encode($result)))
            ->addHeader('Content-Type', 'application/json');
    }

    /**
     * Get ID of target parent folder
     *
     * @return int
     */
    protected function getFolderID()
    {
        $folderName = $this->getFolderName();
        if (!$folderName) {
            return 0;
        }
        $folder = Folder::find_or_make($folderName);
        return $folder ? $folder->ID : 0;
    }

    public function getSchemaStateDefaults()
    {
        $state = parent::getSchemaStateDefaults();
        $state['data']['files'] = $this->getEncodedItems();
        $state['value'] = $this->Value() ?: ['Files' => []];
        return $state;
    }

    /**
     * Encode selected values for react
     *
     * @return array
     */
    protected function getEncodedItems()
    {
        $assetAdmin = AssetAdmin::singleton();
        $fileData = [];
        foreach ($this->getItems() as $file) {
            $fileData[] = $assetAdmin->getMinimalistObjectFromData($file);
        }
        return $fileData;
    }

    /**
     * Check if allowed to upload more than one file
     *
     * @return bool
     */
    public function getIsMultiUpload()
    {
        if (isset($this->multiUpload)) {
            return $this->multiUpload;
        }
        // Guess from record
        $record = $this->getRecord();
        $name = $this->getName();

        // Disabled for has_one components
        if ($record && DataObject::getSchema()->hasOneComponent(get_class($record), $name)) {
            return false;
        }
        return true;
    }

    /**
     * Set upload type to multiple or single
     *
     * @param bool $bool True for multiple, false for single
     * @return $this
     */
    public function setIsMultiUpload($bool)
    {
        $this->multiUpload = $bool;
        return $this;
    }

    /**
     * Gets the number of files allowed for this field
     *
     * @return null|int
     */
    public function getAllowedMaxFileNumber()
    {
        return $this->allowedMaxFileNumber;
    }

    /**
     * Returns the max allowed filesize
     *
     * @return null|int
     */
    public function getAllowedMaxFileSize()
    {
        return $this->getValidator()->getLargestAllowedMaxFileSize();
    }

    /**
     * Sets the number of files allowed for this field
     * @param $count
     * @return $this
     */
    public function setAllowedMaxFileNumber($count)
    {
        $this->allowedMaxFileNumber = $count;

        return $this;
    }

    public function getAttributes()
    {
        $attributes = array(
            'class' => $this->extraClass(),
            'type' => 'file',
            'multiple' => $this->getIsMultiUpload(),
            'id' => $this->ID(),
            'data-schema' => json_encode($this->getSchemaData()),
            'data-state' => json_encode($this->getSchemaState()),
        );

        $attributes = array_merge($attributes, $this->attributes);

        $this->extend('updateAttributes', $attributes);

        return $attributes;
    }

    public function Type()
    {
        return 'entwine-uploadfield uploadfield';
    }

    public function performReadonlyTransformation()
    {
        $clone = clone $this;
        $clone->setReadonly(true);
        return $clone;
    }

    public function performDisabledTransformation()
    {
        $clone = clone $this;
        $clone->setDisabled(true);
        return $clone;
    }

    /**
     * Checks if the number of files attached adheres to the $allowedMaxFileNumber defined
     *
     * @param Validator $validator
     * @return bool
     */
    public function validate($validator)
    {
        $maxFiles = $this->getAllowedMaxFileNumber();
        $count = count($this->getItems() ?? []);

        if ($maxFiles < 1 || $count <= $maxFiles) {
            return $this->extendValidationResult(true, $validator);
        }

        $validator->validationError($this->getName(), _t(
            __CLASS__ . '.ErrorMaxFilesReached',
            'You can only upload {count} file.|You can only upload {count} files.',
            [
                'count' => $maxFiles,
            ]
        ));

        return $this->extendValidationResult(false, $validator);
    }

    /**
     * Check if uploading files is enabled
     *
     * @return bool
     */
    public function getUploadEnabled()
    {
        return $this->uploadEnabled;
    }

    /**
     * Set if uploading files is enabled
     *
     * @param bool $uploadEnabled
     * @return $this
     */
    public function setUploadEnabled($uploadEnabled)
    {
        $this->uploadEnabled = $uploadEnabled;
        return $this;
    }

    /**
     * Check if attaching files is enabled
     *
     * @return bool
     */
    public function getAttachEnabled()
    {
        return $this->attachEnabled;
    }

    /**
     * Set if attaching files is enabled
     *
     * @param bool $attachEnabled
     * @return UploadField
     */
    public function setAttachEnabled($attachEnabled)
    {
        $this->attachEnabled = $attachEnabled;
        return $this;
    }
}
