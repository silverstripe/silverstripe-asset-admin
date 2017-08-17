import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import CONSTANTS from 'constants/index';
import { deactivateModal, setNoticeMessage } from '../../state/gallery/GalleryActions';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import configShape from 'lib/configShape';
import moveFilesMutation from '../../state/files/moveFilesMutation';

class MoveModal extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit({ FolderID }) {
    const { moveFiles } = this.props.actions.files;
    const { selectedFiles, onSuccess, hide, setNotice } = this.props;
    return moveFiles(FolderID || 0, selectedFiles)
      .then(({ data: { moveFiles: { id, filename } } }) => {
        if (typeof onSuccess === 'function') {
          onSuccess(FolderID, selectedFiles);
        }

        const goToFolder = (e) => {
          e.preventDefault();
          this.props.onOpenFolder(id);
          setNotice(null);
        };

        setNotice({
          react: (
            <span>
              Moved {selectedFiles.length} item(s) to <a href="#" onClick={goToFolder}>{filename}</a>
            </span>
          ),
        });
        setTimeout(() => setNotice(null), 3000);
        hide();
      });
  }

  render() {
    const { show, hide, title, folderId, sectionConfig } = this.props;
    const { schemaUrl } = sectionConfig.form.moveForm;
    return (
      <FormBuilderModal
        title={title}
        show={show}
        handleHide={hide}
        handleSubmit={this.handleSubmit}
        identifier="AssetAdmin.MoveForm"
        schemaUrl={`${schemaUrl}/${folderId}`}
      />
    );
  }
}

MoveModal.propTypes = {
  sectionConfig: configShape,
  folderId: React.PropTypes.number.isRequired,
  show: React.PropTypes.bool,
  hide: React.PropTypes.func,
  setNotice: React.PropTypes.func,
  title: React.PropTypes.string,
  onSuccess: React.PropTypes.func,
  onOpenFolder: React.PropTypes.func.isRequired,
  selectedFiles: React.PropTypes.array.isRequired,
  actions: React.PropTypes.shape({
    files: React.PropTypes.shape({
      moveFiles: React.PropTypes.func,
    }),
  }).isRequired,
};

MoveModal.defaultProps = {
  show: false,
};

function mapStateToProps(state) {
  const { modal, selectedFiles } = state.assetAdmin.gallery;
  return {
    show: modal === CONSTANTS.MODAL_MOVE,
    selectedFiles,
    title: `Move ${selectedFiles.length} items to...`,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hide() {
      dispatch(deactivateModal());
    },
    setNotice(msg) {
      dispatch(setNoticeMessage(msg));
    },
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  moveFilesMutation
)(MoveModal);
