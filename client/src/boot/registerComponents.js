import Injector from 'lib/Injector';
import UploadField from 'components/UploadField/UploadField';
import PreviewImageField from 'components/PreviewImageField/PreviewImageField';
import ProportionConstraintField from 'components/ProportionConstraintField/ProportionConstraintField';
import HistoryList from 'containers/HistoryList/HistoryList';
import GalleryToolbar from 'components/GalleryToolbar/GalleryToolbar';

const registerComponents = () => {
  Injector.component.register('UploadField', UploadField);
  Injector.component.register('PreviewImageField', PreviewImageField);
  Injector.component.register('HistoryList', HistoryList);
  Injector.component.register('ProportionConstraintField', ProportionConstraintField);
  Injector.component.register('GalleryToolbar', GalleryToolbar);
};

export default registerComponents;
