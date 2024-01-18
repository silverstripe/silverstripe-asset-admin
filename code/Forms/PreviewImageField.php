<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\AssetAdmin\Controller\AssetAdmin;
use SilverStripe\Assets\File;
use SilverStripe\Assets\Folder;
use SilverStripe\Forms\FormField;
use SilverStripe\ORM\DataObject;

/**
 * For providing schema data to the client side to build a preview field with upload replacement feature
 */
class PreviewImageField extends FormField
{

    /**
     * @var int
     */
    protected $recordID = null;

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_CUSTOM;

    protected $schemaComponent = 'PreviewImageField';

    public function getSchemaDataDefaults()
    {
        $defaults = parent::getSchemaDataDefaults();
        $defaults['data']['uploadFileEndpoint'] = [
            'url' => AssetAdmin::singleton()->Link('api/uploadFile'),
            'method' => 'post',
            'payloadFormat' => 'urlencoded',
        ];
        return $defaults;
    }

    public function getSchemaStateDefaults()
    {
        $defaults = parent::getSchemaStateDefaults();

        if ($record = $this->getRecord()) {
            $parent = $record->Parent();

            $defaults['data'] = array_merge_recursive($defaults['data'], [
                'id' => $record->ID,
                'parentid' => ($parent) ? (int) $parent->ID : 0,
                'url' => $record->Link(),
                'version' => (int) $record->Version,
                'exists' => $record->exists(),
                'preview' => $record->PreviewLink(),
                'category' => $record instanceof Folder ? 'folder' : $record->appCategory(),
                'initialValues' => [
                    'FileFilename' => $record->FileFilename,
                    'FileHash' => $record->FileHash,
                    'FileVariant' => $record->FileVariant,
                ],
                'nameField' => 'Name',
            ]);
        }
        return $defaults;
    }

    public function performReadonlyTransformation()
    {
        $this->setReadonly(true);

        return $this;
    }

    /**
     * @return File|null
     */
    public function getRecord()
    {
        if ($this->recordID) {
            return DataObject::get_by_id(File::class, $this->recordID);
        }
        return null;
    }

    /**
     * @param Integer $recordID
     * @return $this
     */
    public function setRecordID($recordID)
    {
        $this->recordID = $recordID;
        return $this;
    }
}
