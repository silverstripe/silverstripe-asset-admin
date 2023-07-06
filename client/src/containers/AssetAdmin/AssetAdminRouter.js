import React, { Component } from 'react';
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

class AssetAdminRouter extends Component {
  constructor(props) {
    super(props);

    this.handleBrowse = this.handleBrowse.bind(this);
    this.handleReplaceUrl = this.handleReplaceUrl.bind(this);
    this.handleResetDetails = this.handleResetDetails.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  /**
   * Generates the Url for a given folder and file ID.
   *
   * @param {Number} folderId
   * @param {Number} fileId
   * @param {Object} query
   * @param {String} action
   * @returns {String}
   */
  getUrl(folderId = 0, fileId = null, query = {}, action = CONSTANTS.ACTIONS.EDIT_FILE) {
    const newFolderId = parseInt(folderId || 0, 10);
    const newFileId = parseInt(fileId || 0, 10);

    // Remove pagination selector if already on first page, or changing folder
    const hasFolderChanged = newFolderId !== this.getFolderId();
    const newQuery = Object.assign({}, query);
    if (hasFolderChanged || newQuery.page <= 1) {
      delete newQuery.page;
    }

    return buildUrl({
      base: `/${this.props.sectionConfig.reactRoutePath}`,
      folderId: newFolderId,
      fileId: newFileId,
      query: newQuery,
      action,
    });
  }

  /**
   * @return {Number} Folder ID being viewed
   */
  getFolderId() {
    if (this.props.router.params && this.props.router.params.folderId) {
      return parseInt(this.props.router.params.folderId, 10);
    }
    return 0;
  }

  /**
   * @return {Number} File ID being viewed
   */
  getFileId() {
    if (this.props.router.params && this.props.router.params.fileId) {
      return parseInt(this.props.router.params.fileId, 10);
    }
    return 0;
  }

  getViewAction() {
    if (this.props.router.params && this.props.router.params.viewAction) {
      return this.props.router.params.viewAction;
    }
    return CONSTANTS.ACTIONS.EDIT_FILE;
  }

  /**
   * Generates the properties for this section
   *
   * @returns {object}
   */
  getSectionProps() {
    return {
      sectionConfig: this.props.sectionConfig,
      type: 'admin',
      folderId: this.getFolderId(),
      viewAction: this.getViewAction(),
      fileId: this.getFileId(),
      query: this.getQuery(),
      getUrl: this.getUrl,
      onBrowse: this.handleBrowse,
      onReplaceUrl: this.handleReplaceUrl,
      resetFileDetails: this.handleResetDetails,
    };
  }

  /**
   * Get decoded query object
   *
   * @returns {Object}
   */
  getQuery() {
    return decodeQuery(this.props.router.location.search);
  }

  /**
   * Handle browsing with the router.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object} [query]
   * @param {string} [action]
   */
  handleBrowse(folderId, fileId, query, action) {
    const pathname = this.getUrl(folderId, fileId, query, action);

    this.props.router.navigate(pathname);
  }

  /**
   * Handle browsing with the router but does not add to history, useful for
   * cases when the user is redirected to a correct url.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object} [query]
   * @param {string} [action]
   */
  handleReplaceUrl(folderId, fileId, query, action) {
    const pathname = this.getUrl(folderId, fileId, query, action);

    this.props.router.navigate(pathname, { replace: true });
  }

  /**
   * Reset the details screen for a file.
   * This requires replacing the current navigation to the folder without the details open,
   * then replacing it again with it open again.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object} [query]
   */
  handleResetDetails(folderId, fileId, query) {
    const currentPathname = this.getUrl(folderId, fileId, query);
    const clearPathname = this.getUrl(folderId, null, query);
    this.props.router.navigate(
      clearPathname,
      {
        replace: true,
        state: { reset: true, resetPath: currentPathname }
      }
    );
  }

  render() {
    // If rendering during a details reset, navigate back to the appropriate location
    const { AssetAdminComponent } = this.props;
    const locationState = this.props.router.location.state;
    if (locationState && locationState && locationState.reset) {
      return (
        <Navigate to={locationState.resetPath} replace />
      );
    }
    // If there's no section config we have nothing to render
    if (!this.props.sectionConfig) {
      return null;
    }
    // Render the asset admin
    return (
      <AssetAdminComponent {...this.getSectionProps()} />
    );
  }
}

AssetAdminRouter.propTypes = {
  sectionConfig: configShape,
  router: routerPropTypes,
  AssetAdminComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

AssetAdminRouter.defaultProps = {
  AssetAdminComponent: AssetAdmin
};

function mapStateToProps(state) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);

  return {
    sectionConfig,
  };
}

export { AssetAdminRouter as Component, buildUrl };

export default withRouter(connect(mapStateToProps)(AssetAdminRouter));
