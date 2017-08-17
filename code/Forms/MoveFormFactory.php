<?php

namespace SilverStripe\AssetAdmin\Forms;

use SilverStripe\Assets\Folder;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\TreeDropdownField;

class MoveFormFactory implements FormFactory
{
    public function getForm(RequestHandler $controller = null, $name = self::DEFAULT_NAME, $context = [])
    {
        $form = Form::create(
            $controller,
            $name,
            FieldList::create(
                TreeDropdownField::create(
                    'FolderID',
                    'Choose a folder',
                    Folder::class
                )->setTreeBaseID($context['FolderID'])
                ->setEmptyString(Folder::singleton()->Filename)
                ->setTitleField('Filename')
            ),
            FieldList::create(
                FormAction::create('move', 'Move')
                    ->addExtraClass('btn-primary')
            )
        );

        return $form;
    }

    public function getRequiredContext()
    {
        return ['FolderID'];
    }

}