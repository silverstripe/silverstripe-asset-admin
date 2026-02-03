import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import withRouter, { routerPropTypes } from 'lib/withRouter';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import { decodeQuery } from 'lib/DataFormat';
import qs from 'qs';
import CONSTANTS from 'constants/index';
import configShape from 'lib/configShape';
import { joinUrlPaths } from 'lib/urls';
import PropTypes from 'prop-types';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

const actions = Object.keys(CONSTANTS.ACTIONS).map((key) => CONSTANTS.ACTIONS[key]);

/**
 * Build URL from raw components
 *
 * @param {String} base
 * @param {Number} folderId
 * @param {Number} fileId
 * @param {Object} query
 * @param {String} action
 * @return {String}
 */
function buildUrl({ base, folderId, fileId, query, action }) {
  if (action && actions.indexOf(action) === -1) {
    throw new Error(`Invalid action provided: ${action}`);
  }

  let url = null;
  if (fileId) {
    url = joinUrlPaths(base, `show/${folderId}/${CONSTANTS.ACTIONS.EDIT_FILE}/${fileId}`);
  } else if (folderId) {
    url = joinUrlPaths(base, `show/${folderId}`);
  } else {
    url = base;
  }

  if (action === CONSTANTS.ACTIONS.CREATE_FOLDER) {
    url = joinUrlPaths(base, `show/${folderId || 0}/${action}`);
  }

  const hasQuery = query && Object.keys(query).length > 0;
  if (hasQuery) {
    url = `${url}?${qs.stringify(query)}`;
  }

  return url;
}

const AssetAdminRouter = ({
  sectionConfig,
  router,
  AssetAdminComponent = AssetAdmin,
}) => {
  /**
   * @return {Number} Folder ID being viewed
   */
  const getFolderId = () => {
    if (router.params && router.params.folderId) {
      return parseInt(router.params.folderId, 10);
    }
    return 0;
  };

  /**
   * Generates the Url for a given folder and file ID.
   *
   * @param {Number} folderId
   * @param {Number} fileId
   * @param {Object} query
   * @param {String} action
   * @returns {String}
   */
  const getUrl = (folderId = 0, fileId = null, query = {}, action = CONSTANTS.ACTIONS.EDIT_FILE) => {
    const newFolderId = parseInt(folderId || 0, 10);
    const newFileId = parseInt(fileId || 0, 10);

    // Remove pagination selector if already on first page, or changing folder
    const hasFolderChanged = newFolderId !== getFolderId();
    const newQuery = Object.assign({}, query);
    if (hasFolderChanged || newQuery.page <= 1) {
      delete newQuery.page;
    }

    return buildUrl({
      base: `/${sectionConfig.reactRoutePath}`,
      folderId: newFolderId,
      fileId: newFileId,
      query: newQuery,
      action,
    });
  };

  /**
   * @return {Number} File ID being viewed
   */
  const getFileId = () => {
    if (router.params && router.params.fileId) {
      return parseInt(router.params.fileId, 10);
    }
    return 0;
  };

  const getViewAction = () => {
    if (router.params && router.params.viewAction) {
      return router.params.viewAction;
    }
    return CONSTANTS.ACTIONS.EDIT_FILE;
  };

  /**
   * Get decoded query object
   *
   * @returns {Object}
   */
  const getQuery = () => decodeQuery(router.location.search);

  /**
   * Handle browsing with the router.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object} [query]
   * @param {string} [action]
   */
  const handleBrowse = (folderId, fileId, query, action) => {
    const pathname = getUrl(folderId, fileId, query, action);

    router.navigate(pathname);
  };

  /**
   * Handle browsing with the router but does not add to history, useful for
   * cases when the user is redirected to a correct url.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object} [query]
   * @param {string} [action]
   */
  const handleReplaceUrl = (folderId, fileId, query, action) => {
    const pathname = getUrl(folderId, fileId, query, action);

    router.navigate(pathname, { replace: true });
  };

  /**
   * Reset the details screen for a file.
   * This requires replacing the current navigation to the folder without the details open,
   * then replacing it again with it open again.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object} [query]
   */
  const handleResetDetails = (folderId, fileId, query) => {
    const currentPathname = getUrl(folderId, fileId, query);
    const clearPathname = getUrl(folderId, null, query);
    router.navigate(
      clearPathname,
      {
        replace: true,
        state: { reset: true, resetPath: currentPathname }
      }
    );
  };

  /**
   * Generates the properties for this section
   *
   * @returns {object}
   */
  const getSectionProps = () => ({
    sectionConfig,
    type: 'admin',
    folderId: getFolderId(),
    viewAction: getViewAction(),
    fileId: getFileId(),
    query: getQuery(),
    getUrl,
    onBrowse: handleBrowse,
    onReplaceUrl: handleReplaceUrl,
    resetFileDetails: handleResetDetails,
  });

  // If rendering during a details reset, navigate back to the appropriate location
  const locationState = router.location.state;
  if (locationState && locationState && locationState.reset) {
    return (
      <Navigate to={locationState.resetPath} replace />
    );
  }
  // If there's no section config we have nothing to render
  if (!sectionConfig) {
    return null;
  }
  // Render the asset admin
  return (
    <AssetAdminComponent {...getSectionProps()} />
  );
};

AssetAdminRouter.propTypes = {
  sectionConfig: configShape,
  router: routerPropTypes,
  AssetAdminComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

function mapStateToProps(state) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);

  return {
    sectionConfig,
  };
}

export { AssetAdminRouter as Component, buildUrl };

export default withRouter(connect(mapStateToProps)(AssetAdminRouter));
