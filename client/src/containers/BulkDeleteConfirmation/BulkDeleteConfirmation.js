import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withApollo } from '@apollo/client/react/hoc';
import { inject, injectGraphql } from 'lib/Injector';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import * as TRANSITIONS from 'state/confirmDeletion/ConfirmDeletionTransitions';
import i18n from 'i18n';
import fileShape from 'lib/fileShape';
import DeletionModal from './DeletionModal';
import BulkDeleteMessage from './BulkDeleteMessage';
import { getFolderDescendantFileTotals, getFileTotalItems } from './helpers';

/**
 * Wires the Redux store and Apollo result set with the DeletionModal.
 */
const BulkDeleteConfirmation = ({
  loading, LoadingComponent, transition,
  files, descendantFileCounts,
  onModalClose, onCancel, onConfirm
}) => {
  let body = null;
  let actions = [
    {
      label: i18n._t('AssetAdmin.DELETE', 'Delete'),
      handler: () => onConfirm(files.map(({ id }) => id)),
      color: 'danger'
    },
    {
      label: i18n._t('AssetAdmin.CANCEL', 'Cancel'),
      handler: onCancel,
    }
  ];

  // Decide what message and action to show users
  if (loading) {
    // We're still waiting for results from GraphQL
    body = <LoadingComponent />;
  } else {
    const folderCount = Object.keys(descendantFileCounts).length;
    const folderDescendantFileTotals = getFolderDescendantFileTotals(files, descendantFileCounts);
    const fileTotalItems = getFileTotalItems(files);

    const bodyProps = { folderCount, folderDescendantFileTotals, fileTotalItems };
    body = <BulkDeleteMessage {...bodyProps} />;

    if (folderDescendantFileTotals.totalItems || fileTotalItems) {
      actions = [
        {
          label: i18n._t('AssetAdmin.CANCEL', 'Cancel'),
          handler: onCancel,
          color: 'primary'
        },
        {
          label: i18n._t('AssetAdmin.DELETE', 'Delete'),
          handler: () => onConfirm(files.map(({ id }) => id)),
          color: 'danger',
        },
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
    actions={actions}
    onCancel={onCancel}
    onClosed={onModalClose}
  />);
};

BulkDeleteConfirmation.propTypes = {
  loading: PropTypes.bool.isRequired,
  LoadingComponent: PropTypes.elementType,
  transition: PropTypes.oneOf(['canceling', 'deleting', false]),
  files: PropTypes.arrayOf(fileShape),
  descendantFileCounts: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

/**
 * Wires the Modal with the the GraphQL File Count Query. Results will be provided via a
 * `fileCount` prop containing a map of file/folder IDs to the number of nested non-folder Files
 * within the folder . e.g.: If you're trying to delete Folder ID 1234 and it has 10 nested Files
 * you will get `['1234': 10]`.
 */
const ConnectedModal = compose(
  inject(
    ['Loading'],
    (Loading) => ({ LoadingComponent: Loading }),
  ),
  injectGraphql('readDescendantFileCountsQuery'),
  withApollo
)(BulkDeleteConfirmation);

/**
 * Decide whether to render the Deletion Modal based on the information in the redux store.
 * This avoid firing off a GraphQL query for nothing.
 */
const ConditionalModal = ({ showConfirmation, files, ...props }) => (
  showConfirmation && files.length > 0 ? <ConnectedModal {...props} files={files} /> : null
);

const mapStateToProps = ({ assetAdmin: { confirmDeletion } }) => confirmDeletion;
const mapDispatchToProps = {
  onCancel: confirmDeletionActions.cancel,
  onModalClose: confirmDeletionActions.modalClose
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(ConditionalModal);

export { BulkDeleteConfirmation as Component };
