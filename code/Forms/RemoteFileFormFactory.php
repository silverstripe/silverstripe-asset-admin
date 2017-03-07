<?php

namespace SilverStripe\AssetAdmin\Forms;

use InvalidArgumentException;
use SilverStripe\Control\Controller;
use SilverStripe\Core\Extensible;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormFactory;
use SilverStripe\Forms\RequiredFields;
use SilverStripe\Forms\TextField;

class RemoteFileFormFactory implements FormFactory
{
    use Extensible;
    
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
        $fields = FieldList::create([
            TextField::create('')
        ]);
        
        return $fields;
    }
    
    protected function getFormActions($controller, $name, $context)
    {
        $actions = FieldList::create([]);
    
        return $actions;
    }
}
