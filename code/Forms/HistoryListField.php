<?php


namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Forms\FormField;
use SilverStripe\ORM\DataObject;
use SilverStripe\Versioned\Versioned;

/**
 * History view for file editor form
 */
class HistoryListField extends FormField
{
    /**
     * @var DataObject
     */
    protected $record = null;

    protected $schemaComponent = 'HistoryList';

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_CUSTOM;

    public function getSchemaStateDefaults()
    {
        $state = parent::getSchemaStateDefaults();
        if ($record = $this->getRecord()) {
            $latest = Versioned::get_latest_version($record->baseClass(), $record->ID);
            if ($latest) {
                $state['data']['fileId'] = (int) $latest->ID;
                $state['data']['latestVersionId'] = (int) $latest->Version;
            }
        }

        return $state;
    }

    /**
     * @return DataObject
     */
    public function getRecord()
    {
        return $this->record;
    }

    /**
     * @param DataObject $record
     * @return $this
     */
    public function setRecord(DataObject $record)
    {
        $this->record = $record;
        return $this;
    }
}
