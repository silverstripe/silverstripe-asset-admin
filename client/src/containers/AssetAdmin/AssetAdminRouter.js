import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import { decodeQuery } from 'lib/DataFormat';
import qs from 'qs';
import CONSTANTS from 'constants/index';
import configShape from 'lib/configShape';

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
    url = `${base}/show/${folderId}/${CONSTANTS.ACTIONS.EDIT_FILE}/${fileId}`;
  } else if (folderId) {
    url = `${base}/show/${folderId}`;
  } else {
    url = `${base}/`;
  }

  if (action === CONSTANTS.ACTIONS.CREATE_FOLDER) {
    url = `${base}/show/${folderId || 0}/${action}`;
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
      base: this.props.sectionConfig.url,
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
    if (this.props.params && this.props.params.folderId) {
      return parseInt(this.props.params.folderId, 10);
    }
    return 0;
  }

  /**
   * @return {Number} File ID being viewed
   */
  getFileId() {
    if (this.props.params && this.props.params.fileId) {
      return parseInt(this.props.params.fileId, 10);
    }
    return 0;
  }

  getViewAction() {
    if (this.props.params && this.props.params.viewAction) {
      return this.props.params.viewAction;
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
    };
  }

  /**
   * Get decoded query object
   *
   * @returns {Object}
   */
  getQuery() {
    return decodeQuery(this.props.location.search);
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

    this.props.router.push(pathname);
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

    this.props.router.replace(pathname);
  }

  render() {
    if (!this.props.sectionConfig) {
      return null;
    }
    return (
      <AssetAdmin {...this.getSectionProps()} />
    );
  }
}

AssetAdminRouter.propTypes = {
  sectionConfig: configShape,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
    search: PropTypes.string,
  }),
  params: PropTypes.object,
  router: PropTypes.object,
};

function mapStateToProps(state) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);

  return {
    sectionConfig,
  };
}

export { AssetAdminRouter as Component, buildUrl };

export default withRouter(connect(mapStateToProps)(AssetAdminRouter));
