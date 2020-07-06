import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import i18n from 'i18n';
import CONSTANTS from 'constants/index';
import PropTypes from 'prop-types';
import {
  deactivateModal,
  setFileBadge,
} from 'state/gallery/GalleryActions';
import { display as displayToast } from 'state/toasts/ToastsActions';
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
    const { selectedFiles, onSuccess, onClosed, setNotice, setError, setBadge } = this.props;
    return moveFiles(FolderID || 0, selectedFiles)
      .then(({ data: { moveFiles: { id, filename } } }) => {
        if (typeof onSuccess === 'function') {
          onSuccess(FolderID, selectedFiles);
        }

        setBadge(id, `${selectedFiles.length}`, 'success', CONSTANTS.MOVE_SUCCESS_DURATION);

        setNotice(
          i18n.sprintf(
            i18n._t('AssetAdmin.MOVED_ITEMS_TO', 'Moved %s item(s) to %s'),
            selectedFiles.length,
            filename
          ),
          [{
            label: i18n._t('AssetAdmin.GO_TO_FOLDER', 'Go to folder'),
            onClick: () => this.props.onOpenFolder(id)
          }]
        );

        onClosed();
      })
      .catch(() => {
        setError(i18n._t('AssetAdmin.FAILED_MOVE', 'There was an error moving the selected items.'));
      });
  }

  render() {
    const { isOpen, onClosed, title, folderId, sectionConfig } = this.props;
    const { schemaUrl } = sectionConfig.form.moveForm;
    return (
      <FormBuilderModal
        title={title}
        isOpen={isOpen}
        onClosed={onClosed}
        onSubmit={this.handleSubmit}
        identifier="AssetAdmin.MoveForm"
        schemaUrl={`${schemaUrl}/${folderId}`}
      />
    );
  }
}

MoveModal.propTypes = {
  sectionConfig: configShape,
  folderId: PropTypes.number.isRequired,
  isOpen: PropTypes.bool,
  onClosed: PropTypes.func,
  setNotice: PropTypes.func,
  setBadge: PropTypes.func,
  setError: PropTypes.func,
  title: PropTypes.string,
  onSuccess: PropTypes.func,
  onOpenFolder: PropTypes.func.isRequired,
  selectedFiles: PropTypes.array.isRequired,
  actions: PropTypes.shape({
    files: PropTypes.shape({
      moveFiles: PropTypes.func,
    }),
  }).isRequired,
};

MoveModal.defaultProps = {
  isOpen: false,
};

function mapStateToProps(state) {
  const { modal, selectedFiles } = state.assetAdmin.gallery;
  return {
    isOpen: modal === CONSTANTS.MODAL_MOVE,
    selectedFiles,
    title: i18n.sprintf(
      i18n._t('AssetAdmin.MOVE_ITEMS_TO', 'Move %s item(s) to...'),
      selectedFiles.length
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClosed() {
      dispatch(deactivateModal());
    },
    setNotice(msg, actions = []) {
      dispatch(displayToast({ text: msg, type: 'success', actions }));
    },
    setError(msg) {
      dispatch(displayToast({ text: msg, type: 'error' }));
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
