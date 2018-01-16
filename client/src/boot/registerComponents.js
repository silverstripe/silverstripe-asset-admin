import Injector from 'lib/Injector';
import UploadField from 'components/UploadField/UploadField';
import UploadFieldItem from 'components/UploadField/UploadFieldItem';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import InsertMediaModal from 'containers/InsertMediaModal/InsertMediaModal';
import PreviewImageField from 'components/PreviewImageField/PreviewImageField';
import ProportionConstraintField from 'components/ProportionConstraintField/ProportionConstraintField';
import HistoryList from 'containers/HistoryList/HistoryList';
import GalleryToolbar from 'components/GalleryToolbar/GalleryToolbar';

const registerComponents = () => {
  Injector.component.registerMany({
    UploadField,
    UploadFieldItem,
    PreviewImageField,
    HistoryList,
    ProportionConstraintField,
    AssetDropzone,
    InsertMediaModal,
    GalleryToolbar,
  });
};

export default registerComponents;
