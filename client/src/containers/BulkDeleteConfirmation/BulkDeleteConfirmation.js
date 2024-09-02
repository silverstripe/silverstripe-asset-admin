import React, { useState, useEffect } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import * as TRANSITIONS from 'state/confirmDeletion/ConfirmDeletionTransitions';
import * as toastsActions from 'state/toasts/ToastsActions';
import i18n from 'i18n';
import fileShape from 'lib/fileShape';
import backend from 'lib/Backend';
import Config from 'lib/Config';
import getJsonErrorMessage from 'lib/getJsonErrorMessage';
import DeletionModal from './DeletionModal';
import BulkDeleteMessage from './BulkDeleteMessage';

/**
 * Wires the Redux store set with the DeletionModal component.
 */
const BulkDeleteConfirmation = ({
  LoadingComponent,
  transition,
  files,
  onModalClose,
  onCancel,
  onConfirm,
  filesAreVersioned,
  archiveFiles,
  actions,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileCounts, setFileCounts] = useState({});

  useEffect(() => {
    const sectionKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';
    const config = Config.getSection(sectionKey);
    const fileIDs = files.map(fild => fild.id);
    const qs = fileIDs.map(id => `ids[]=${id}`).join('&');
    const url = `${config.endpoints.readDescendantCounts.url}?${qs}`;
    setIsLoading(true);
    backend.get(url)
      .then(async (response) => {
        const responseJson = await response.json();
        setIsLoading(false);
        setFileCounts(responseJson);
      })
      .catch(async (err) => {
        const message = await getJsonErrorMessage(err);
        actions.toasts.error(message);
      });
  }, [files]);

  let body = null;
  const transKey = filesAreVersioned && archiveFiles ? 'AssetAdmin.ARCHIVE' : 'AssetAdmin.DELETE';
  const transDefault = filesAreVersioned && archiveFiles ? 'Archive' : 'Delete';
  let deleteModalActions = [
    {
      label: i18n._t(transKey, transDefault),
      handler: () => onConfirm(files.map(({ id }) => id)),
      color: 'danger'
    },
    {
      label: i18n._t('AssetAdmin.CANCEL', 'Cancel'),
      handler: onCancel,
    }
  ];

  // Decide what message and action to show users
  if (isLoading) {
    body = <LoadingComponent />;
  } else {
    const topLevelFolderCount = fileCounts.filter(r => r.type === 'folder').length;
    const topLevelFileCount = fileCounts.filter(r => r.type === 'file').length;
    const descendantFileCount = fileCounts.reduce((t, r) => t + r.count, 0);

    const bodyProps = { topLevelFolderCount, topLevelFileCount, descendantFileCount, filesAreVersioned, archiveFiles };
    body = <BulkDeleteMessage {...bodyProps} />;

    if (topLevelFileCount + descendantFileCount > 0) {
      deleteModalActions = [
        {
          label: i18n._t('AssetAdmin.CANCEL', 'Cancel'),
          handler: onCancel,
          color: 'primary'
        },
        {
          label: i18n._t(transKey, transDefault),
          handler: () => onConfirm(files.map(({ id }) => id)),
          color: 'danger',
        }
      ];
    }
  }

  // If we're in the process of canceling/deleting results, we set isOpen to false.
  // This allows the modal to smoothly transition out.
  // We tell the modal to call the `reset` action when it's done closing.
  const isOpen = ![TRANSITIONS.CANCELING, TRANSITIONS.DELETING].includes(transition);

  return (<DeletionModal
    body={body}
    isOpen={isOpen}
    actions={deleteModalActions}
    onCancel={onCancel}
    onClosed={onModalClose}
    filesAreVersioned={filesAreVersioned}
    archiveFiles={archiveFiles}
  />);
};

BulkDeleteConfirmation.propTypes = {
  LoadingComponent: PropTypes.elementType,
  transition: PropTypes.oneOf(['canceling', 'deleting', false]),
  files: PropTypes.arrayOf(fileShape),
  descendantFileCounts: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  filesAreVersioned: PropTypes.bool.isRequired,
  archiveFiles: PropTypes.bool.isRequired,
  actions: PropTypes.object.isRequired,
};

/**
 * Wires the Modal with the the XHR File Count Query. Results will be provided via a
 * `fileCount` prop containing a map of file/folder IDs to the number of nested non-folder Files
 * within the folder . e.g.: If you're trying to delete Folder ID 1234 and it has 10 nested Files
 * you will get `['1234': 10]`.
 */
const ConnectedModal = compose(
  inject(
    ['Loading'],
    (Loading) => ({ LoadingComponent: Loading }),
  ),
)(BulkDeleteConfirmation);

/**
 * Decide whether to render the Deletion Modal based on the information in the redux store.
 * This avoid firing off an XHR request for nothing.
 */
const ConditionalModal = ({ showConfirmation, files, ...props }) => (
  showConfirmation && files.length > 0 ? <ConnectedModal {...props} files={files} /> : null
);

const mapStateToProps = ({ assetAdmin: { confirmDeletion } }) => confirmDeletion;
const mapDispatchToProps = (dispatch) => ({
  onCancel: () => dispatch(confirmDeletionActions.cancel()),
  onModalClose: () => dispatch(confirmDeletionActions.modalClose()),
  actions: {
    toasts: bindActionCreators(toastsActions, dispatch),
    confirmation: bindActionCreators(confirmDeletionActions, dispatch),
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ConditionalModal);

export { BulkDeleteConfirmation as Component };
