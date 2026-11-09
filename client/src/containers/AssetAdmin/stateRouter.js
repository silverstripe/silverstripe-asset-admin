import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { buildUrl } from 'containers/AssetAdmin/AssetAdminRouter';
import CONSTANTS from 'constants/index';
import { resetFormStack } from 'state/modal/ModalActions';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

const initialState = {
  folderId: null,
  fileId: null,
  query: {},
  action: CONSTANTS.ACTIONS.EDIT_FILE,
};

const AssetAdminStateRouter = (props) => {
  const [folderId, setFolderId] = useState(props.folderId);
  const [fileId, setFileId] = useState(initialState.fileId);
  const [query, setQuery] = useState(initialState.query);
  const [action, setAction] = useState(initialState.action);
  // Holds the file ID to reopen once handleResetDetails has cleared it
  const pendingFileId = useRef(null);

  useEffect(() => {
    if (pendingFileId.current) {
      const { fileId: newFileId } = pendingFileId.current;
      pendingFileId.current = null;
      setFileId(newFileId);
    }
  });

  /**
   * @return {*} Folder ID being viewed, or null if not known
   */
  const getFolderId = () => {
    if (folderId === null) {
      return null;
    }
    return parseInt(folderId || 0, 10);
  };

  /**
   * Generates the Url to AssetAdmin for a given folder and file ID.
   *
   * Only used by AssetAdmin to build breadcrumbs for a particular folder / file
   *
   * @param {Number} newFolderIdArg
   * @param {Number} newFileIdArg
   * @param {Object} newQueryArg
   * @param {String} newAction
   * @returns {String}
   */
  const getUrl = (
    newFolderIdArg = 0,
    newFileIdArg = null,
    newQueryArg = {},
    newAction = CONSTANTS.ACTIONS.EDIT_FILE
  ) => {
    const newFolderId = parseInt(newFolderIdArg || 0, 10);
    const newFileId = parseInt(newFileIdArg || 0, 10);
    const oldFolderId = getFolderId();

    // Remove pagination selector if already on first page, or changing folder (if folder is known)
    const hasFolderChanged = newFolderId !== oldFolderId && oldFolderId !== null;
    const newQuery = Object.assign({}, newQueryArg);
    if (hasFolderChanged || newQuery.page <= 1) {
      delete newQuery.page;
    }

    return buildUrl({
      base: props.sectionConfig.reactRoutePath,
      folderId: newFolderId,
      fileId: newFileId,
      query: newQuery,
      action: newAction,
    });
  };

  /**
   * @return {Number} File ID being viewed
   */
  const getFileId = () => parseInt(fileId || props.fileId || 0, 10);

  const getViewAction = () => action || CONSTANTS.ACTIONS.EDIT_FILE;

  /**
   * Handle browsing through the asset admin section.
   *
   * @param {number} newFolderId
   * @param {number} newFileId
   * @param {object} newQuery
   * @param {string} newAction
   */
  const handleBrowse = (newFolderId, newFileId, newQuery = {}, newAction = CONSTANTS.ACTIONS.EDIT_FILE) => {
    if (newAction && Object.values(CONSTANTS.ACTIONS).indexOf(newAction) === -1) {
      throw new Error(`Invalid action provided: ${newAction}`);
    }

    if (fileId !== newFileId) {
      // When AssetAdmin is displayed in Modal, the insert media and admin form can be displayed.
      // When a different file is selected, we should switch back to displaying the main form.
      props.actions.resetFormStack();
    }

    setFolderId(newFolderId);
    setFileId(newFileId);
    setQuery(newQuery);
    setAction(newAction);
  };

  /**
   * Reset the details screen for a file, the state-based equivalent of
   * AssetAdminRouter.handleResetDetails, i.e. unmount the file's Editor panel and remount it so
   * the panel refetches the file's form schema and record.
   *
   * @param {number} [newFolderId]
   * @param {number} [newFileId]
   * @param {object} [newQuery]
   */
  const handleResetDetails = (newFolderId, newFileId, newQuery = {}) => {
    // The editor unmounts on the first render, so the effect above remounts it with fresh data
    pendingFileId.current = { fileId: newFileId };
    setFolderId(newFolderId);
    setFileId(null);
    setQuery(newQuery);
  };

  const getSectionProps = () => {
    const newProps = Object.assign({},
      props,
      {
        folderId: getFolderId(),
        fileId: getFileId(),
        viewAction: getViewAction(),
        query,
        getUrl,
        onBrowse: handleBrowse,
        resetFileDetails: handleResetDetails,
      }
    );

    delete newProps.Component;

    return newProps;
  };

  const sectionProps = getSectionProps();
  const AssetAdmin = props.Component;

  return (<AssetAdmin {...sectionProps} />);
};

AssetAdminStateRouter.propTypes = {
  Component: PropTypes.elementType,
  sectionConfig: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  fileId: PropTypes.number,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      resetFormStack: () => dispatch(resetFormStack())
    },
  };
}

function stateRouter(AssetAdmin) {
  function mapStateToProps(state) {
    const sectionConfig = state.config.sections
      .find((section) => section.name === sectionConfigKey);

    return {
      Component: AssetAdmin,
      sectionConfig,
    };
  }

  return connect(mapStateToProps, mapDispatchToProps)(AssetAdminStateRouter);
}

export { AssetAdminStateRouter };

export default stateRouter;
