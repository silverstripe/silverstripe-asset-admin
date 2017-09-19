import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import i18n from 'i18n';
import CONSTANTS from 'constants/index';
import {
  deactivateModal,
  setNoticeMessage,
  setErrorMessage,
  setFileBadge,
} from 'state/gallery/GalleryActions';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import configShape from 'lib/configShape';
import moveFilesMutation from 'state/files/moveFilesMutation';

class MoveModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.timeout = null;
  }

  handleSubmit({ FolderID }) {
    const { moveFiles } = this.props.actions.files;
    const { selectedFiles, onSuccess, onHide, setNotice, setError, setBadge } = this.props;
    return moveFiles(FolderID || 0, selectedFiles)
      .then(({ data: { moveFiles: { id, filename } } }) => {
        if (typeof onSuccess === 'function') {
          onSuccess(FolderID, selectedFiles);
        }

        setBadge(id, `${selectedFiles.length}`, 'success', CONSTANTS.MOVE_SUCCESS_DURATION);

        const goToFolder = (e) => {
          e.preventDefault();
          this.props.onOpenFolder(id);
          setNotice(null);
        };

        setNotice({
          react: (
            <span>
              {i18n.sprintf(
                i18n._t('AssetAdmin.MOVED_ITEMS_TO', 'Moved %s item(s) to ')
                , selectedFiles.length
              )}
              <a href="#" onClick={goToFolder}>{filename}</a>
            </span>
          ),
        });
        this.timeout = setTimeout(() => setNotice(null), CONSTANTS.MOVE_SUCCESS_DURATION);
        onHide();
      })
      .catch(() => {
        setError(i18n._t('AssetAdmin.FAILED_MOVE', 'There was an error moving the selected items.'));
      });
  }

  render() {
    const { show, onHide, title, folderId, sectionConfig } = this.props;
    const { schemaUrl } = sectionConfig.form.moveForm;
    return (
      <FormBuilderModal
        title={title}
        show={show}
        onHide={onHide}
        onSubmit={this.handleSubmit}
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
  onHide: React.PropTypes.func,
  setNotice: React.PropTypes.func,
  setBadge: React.PropTypes.func,
  setError: React.PropTypes.func,
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
    title: i18n.sprintf(
      i18n._t('AssetAdmin.MOVE_ITEMS_TO', 'Move %s item(s) to...'),
      selectedFiles.length
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onHide() {
      dispatch(deactivateModal());
    },
    setNotice(msg) {
      dispatch(setNoticeMessage(msg));
    },
    setError(msg) {
      dispatch(setErrorMessage(msg));
    },
    setBadge(...params) {
      dispatch(setFileBadge(...params));
    },
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  moveFilesMutation
)(MoveModal);
