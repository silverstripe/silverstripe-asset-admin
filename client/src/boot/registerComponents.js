import Injector from 'lib/Injector';
import UploadField from 'components/UploadField/UploadField';
import PreviewImageField from 'components/PreviewImageField/PreviewImageField';
import ProportionConstraintField from 'components/ProportionConstraintField/ProportionConstraintField';
import HistoryList from 'containers/HistoryList/HistoryList';
import GalleryToolbar from 'components/GalleryToolbar/GalleryToolbar';
import { File, Folder } from 'components/GalleryItem/GalleryItem';

const registerComponents = () => {
  Injector.component.register('UploadField', UploadField);
  Injector.component.register('PreviewImageField', PreviewImageField);
  Injector.component.register('HistoryList', HistoryList);
  Injector.component.register('ProportionConstraintField', ProportionConstraintField);
  Injector.component.register('GalleryToolbar', GalleryToolbar);
  Injector.component.register('GalleryItemFile', File);
  Injector.component.register('GalleryItemFolder', Folder);
};

export default registerComponents;
