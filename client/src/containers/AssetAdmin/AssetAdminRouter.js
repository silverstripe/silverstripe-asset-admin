import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import { decodeQuery } from 'lib/DataFormat';
import qs from 'qs';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

/**
 * Build URL from raw components
 *
 * @param {String} base
 * @param {Number} folderId
 * @param {Number} fileId
 * @param {Object} query
 * @return {String}
 */
export function buildUrl(base, folderId, fileId, query) {
  let url = null;
  if (fileId) {
    url = `${base}/show/${folderId}/edit/${fileId}`;
  } else if (folderId) {
    url = `${base}/show/${folderId}`;
  } else {
    url = `${base}/`;
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
    this.getUrl = this.getUrl.bind(this);
  }

  /**
   * Generates the Url for a given folder and file ID.
   *
   * @param {Number} folderId
   * @param {Number} fileId
   * @param {Object} query
   * @returns {String}
   */
  getUrl(folderId = 0, fileId = null, query = {}) {
    const newFolderId = parseInt(folderId || 0, 10);
    const newFileId = parseInt(fileId || 0, 10);

    // Remove pagination selector if already on first page, or changing folder
    const hasFolderChanged = newFolderId !== this.getFolderId();
    const newQuery = Object.assign({}, query);
    if (hasFolderChanged || newQuery.page <= 1) {
      delete newQuery.page;
    }

    return buildUrl(this.props.sectionConfig.url, newFolderId, newFileId, newQuery);
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
      fileId: this.getFileId(),
      query: this.getQuery(),
      getUrl: this.getUrl,
      onBrowse: this.handleBrowse,
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
   */
  handleBrowse(folderId, fileId, query) {
    const pathname = this.getUrl(folderId, fileId, query);

    this.props.router.push(pathname);
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
  sectionConfig: PropTypes.shape({
    url: PropTypes.string,
    limit: PropTypes.number,
    form: PropTypes.object,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
    search: PropTypes.string,
  }),
  params: PropTypes.object,
  router: PropTypes.object,
};

function mapStateToProps(state) {
  const sectionConfig = state.config.sections[sectionConfigKey];

  return {
    sectionConfig,
  };
}

export { AssetAdminRouter };

export default withRouter(connect(mapStateToProps)(AssetAdminRouter));
