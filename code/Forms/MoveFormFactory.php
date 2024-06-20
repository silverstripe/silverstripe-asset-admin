<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\Folder;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Extensible;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\TreeDropdownField;

class MoveFormFactory implements FormFactory
{
    use Extensible;

    public function getForm(RequestHandler $controller = null, $name = MoveFormFactory::DEFAULT_NAME, $context = [])
    {
        $form = Form::create(
            $controller,
            $name,
            FieldList::create(
                TreeDropdownField::create(
                    'FolderID',
                    _t(__CLASS__.'.CHOOSEFOLDER', 'Choose a folder'),
                    Folder::class
                )->setValue((int) $context['FolderID'])
                ->setTitleField('Filename')
            ),
            FieldList::create(
                FormAction::create('move', _t(__CLASS__.'.MOVE', 'Move'))
                    ->addExtraClass('btn-primary font-icon-folder-move')
            )
        );

        $form->addExtraClass('form--no-dividers');

        $this->extend('updateForm', $form, $controller, $name, $context);

        return $form;
    }

    public function getRequiredContext()
    {
        return ['FolderID'];
    }
}
