import Injector from 'lib/Injector';
import ownerAwareUnpublish from 'transforms/FormAction/ownerAwareUnpublish';
import moveTreeDropdownField from 'transforms/TreeDropdownField/moveTreeDropdownField';

const applyTransform = () => {
  Injector.transform(
    'move-form-disabled',
    (updater) => {
      updater.component('TreeDropdownField.AssetAdmin.MoveForm', moveTreeDropdownField);
    }
  );

  Injector.transform(
    'owner-unpublishing',
    (updater) => {
      updater.component('FormAction.AssetAdmin.EditForm.action_unpublish', ownerAwareUnpublish);
    }
  );
};

export default applyTransform;
