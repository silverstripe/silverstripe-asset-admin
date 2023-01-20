<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DateField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldGroup;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;

/**
 * Scaffolds a form for searching files
 */
class FileSearchFormFactory implements FormFactory
{
    use Extensible;
    use Injectable;

    /**
     * Generates the form
     *
     * @param RequestHandler $controller Parent controller
     * @param string $name
     * @param array $context List of properties which may influence form scaffolding.
     * E.g. 'Record' if building a form for a record.
     * Custom factories may support more advanced parameters.
     * @return Form
     */
    public function getForm(RequestHandler $controller = null, $name = FormFactory::DEFAULT_NAME, $context = [])
    {
        $fields = $this->getFormFields($controller, $name, $context);
        $actions = FieldList::create();
        $form = Form::create($controller, $name, $fields, $actions);
        $form->disableSecurityToken(); // not posted back, so unnecessary
        $form->addExtraClass('form--no-dividers');
        $this->invokeWithExtensions('updateForm', $form, $controller, $name, $context);
        return $form;
    }

    /**
     *
     * @param RequestHandler $controller
     * @param $name
     * @param array $context
     * @return FieldList
     */
    protected function getFormFields(RequestHandler $controller = null, $name, $context = [])
    {
        // Note: "Name" field is excluded as it is baked directly into the Search.js react component

        // File type field
        $appCategories = array(
            'ARCHIVE' => _t(
                'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryArchive',
                'Archive'
            ),
            'AUDIO' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryAudio', 'Audio'),
            'DOCUMENT' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryDocument', 'Document'),
            'IMAGE' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryImage', 'Image'),
            'VIDEO' => _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.AppCategoryVideo', 'Video'),
        );
        $typeDropdown = DropdownField::create(
            'appCategory',
            _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.Filetype', 'File type'),
            $appCategories
        )->setEmptyString(_t('SilverStripe\\ORM\\FieldType\\DBEnum.ANY', 'Any'));

        // Limit to current folder
        $limitCheckbox = CheckboxField::create('currentFolderOnly', _t(
            'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.CurrentFolderOnly',
            'Limit to current folder and its sub-folders?'
        ));

        // Last updated range field
        $dateFrom = DateField::create('lastEditedFrom', _t('SilverStripe\\CMS\\Search\\SearchForm.FILTERDATEFROM', 'From'));
        $dateTo = DateField::create('lastEditedTo', _t('SilverStripe\\CMS\\Search\\SearchForm.FILTERDATETO', 'To'));
        $dateGroup = FieldGroup::create(
            _t('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin.LASTEDIT', 'Last changed'),
            [$dateFrom, $dateTo]
        )->setName('LastChanged');

        // Build form with these fields
        $fields = FieldList::create($typeDropdown, $dateGroup, $limitCheckbox);

        $this->invokeWithExtensions('updateFormFields', $fields, $controller, $name, $context);
        return $fields;
    }


    /**
     * Return list of mandatory context keys
     *
     * @return mixed
     */
    public function getRequiredContext()
    {
        return [];
    }
}
