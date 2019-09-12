import i18n from 'i18n';
import React, { Fragment } from 'react';
import classnames from 'classnames';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {withApollo} from "react-apollo";
import { inject, injectGraphql } from 'lib/Injector';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import DeletionModal from '../../components/DeletionModal/DeletionModal';


const folderInUseMessage = i18n._t(
  'AssetAdmin.BULK_ACTIONS_DELETE_FOLDER',
  'These folders contain files which are currently in use, you must move or delete their contents before you can delete the folder.'
);

/**
 * Detect if there's any folder in use in our current selection
 * @param {Object[]} files
 * @param {Object} fileUsageData
 * @return {boolean}
 */
const foldersInUse = (files, fileUsage) => {
  const folderInUse = files
    .filter(({type}) => (type === 'folder'))
    .filter(({id}) => (fileUsage[id] && fileUsage[id] > 0));
  return folderInUse.length > 0;
}

/**
 * Count the number of files that are currently in use and the nomber of places where they are in use.
 * @param {Object[]} files
 * @param {Object} fileUsageData
 * @return {Object}
 */
const getFileInUseCount = (files, fileUsage) => (
  files.filter( ({type}) => (type !== 'folder'))
    .reduce((accumulator, {id}) => {
      if (fileUsage[id]) {
        accumulator.fileInUseCount++;
        accumulator.inUseCount += fileUsage[id];
      };
      return accumulator;
    }, {fileInUseCount: 0, inUseCount: 0})
);

const confirmationMessage = (fileCount, fileInUseCount, inUseCount) => {
  if (fileInUseCount === 0) {
    return i18n._t('AssetAdmin.BULK_ACTIONS_DELETE_CONFIRM', 'Are you sure you want to delete these files?');
  }

  let msg = '';

  if (fileCount === 1 && fileInUseCount === 1) {
    msg = i18n.sprintf(
      i18n._t(
        'AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_CONFIRM',
        'This file is currently used in %s place(s), are you sure you want to delete it?'
      ),
      inUseCount
    );
  } else {
    msg = i18n.sprintf(
      i18n._t(
        'AssetAdmin.BULK_ACTIONS_DELETE_MULTI_CONFIRM',
        'There are %s files currently in use, are you sure you want to delete these files?'
      ),
      fileInUseCount
    );
  }

  const warning = i18n._t(
    'AssetAdmin.BULK_ACTIONS_DELETE_WARNING',
    'Ensure files are removed from content areas prior to deleting them, otherwise they will appear as broken links.'
  );

  return (
    <Fragment>
      <p>{msg}</p>
      <p>{warning}</p>
    </Fragment>
  );
}

const BulkDeleteConfirmation = ({
  loading, LoadingComponent, transition,
  files, fileUsage,
  actions: {confirmDeletion: {cancel, reset} },
  onConfirm,
  ...props
}) => {
  let body = null;
  let actions = [];

  if (loading) {
    body = <LoadingComponent />;
  } else if (foldersInUse(files, fileUsage)) {
    body = folderInUseMessage;
    actions = [{label: 'Dismiss', handler: cancel, color: 'primary'}];
  } else {
    const {fileInUseCount, inUseCount} = getFileInUseCount(files, fileUsage);
    body = confirmationMessage(files.length, fileInUseCount, inUseCount);
    actions = [
      {label: 'Delete', handler: () => onConfirm(files), color: 'danger'},
      {label: 'Cancel', handler: cancel},
    ];
  }

  const extraProps = {
    isOpen: !['canceling', 'deleting'].includes(transition),
    body
  };

  return <DeletionModal
    {...extraProps }
    actions={ actions }
    onCancel={ cancel }
    onClosed={ reset }
    />
}

const Component = (props) => {
  const {showConfirmation, files} = props;
  return showConfirmation && files.length > 0 ? <ConnectedModal {...props} /> : null ;
}

const ConnectedModal = compose(
  inject(
    ['Loading'],
    (Loading) => ({ LoadingComponent: Loading }),
  ),
  injectGraphql('readFileUsageQuery'),
  withApollo
)(BulkDeleteConfirmation);

const mapStateToProps = ({assetAdmin: {confirmDeletion}}) => confirmDeletion;
const mapDispatchToProps = (dispatch) =>  ({
  actions: {
    confirmDeletion: bindActionCreators(confirmDeletionActions, dispatch)
  },
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(Component);
