import Injector from 'lib/Injector';
import insertAssetModal from 'transforms/AssetAdmin/insertAssetModal';
import ownerAwareUnpublish from 'transforms/FormAction/ownerAwareUnpublish';
import moveTreeDropdownField from 'transforms/TreeDropdownField/moveTreeDropdownField';

const applyTransform = () => {
  Injector.transform(
    'insert-media-modal',
    (updater) => {
      updater.form.alterSchema('AssetAdmin.EditForm.fileInsertForm', insertAssetModal);
    }
  );

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

  // Remove the loader in the search form
  Injector.transform(
    'asset-searchform',
    (updater) => {
      updater.component('Loading.AssetAdmin.SearchForm', () => () => null);
    }
  );
};

export default applyTransform;
