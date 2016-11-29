<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\Folder;
use SilverStripe\Forms\FileUploadReceiver;
use SilverStripe\Forms\FormField;
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
 */
class UploadField extends FormField
{
    use FileUploadReceiver;

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
        parent::__construct($name, $title);
        if($items) {
            $this->setItems($items);
        }
    }

    public function getSchemaDataDefaults()
    {
        $defaults = parent::getSchemaDataDefaults();
        $uploadLink = AssetAdmin::singleton()->Link('api/createFile');
        $defaults['data']['createFileEndpoint'] = [
            'url' => $uploadLink,
            'method' => 'post',
            'payloadFormat' => 'urlencoded',
        ];
        $defaults['data']['multi'] = $this->getIsMultiUpload();
        $defaults['data']['parentid'] = $this->getFolderID();
        return $defaults;
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
            $fileData[] = $assetAdmin->getObjectFromData($file);
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
     * Set upload type to multi / single
     *
     * @param $multi
     * @return $this
     */
    public function setIsMultiUpload($multi)
    {
        $this->multiUpload = $multi;
        return $this;
    }
}
