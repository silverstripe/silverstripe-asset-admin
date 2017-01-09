import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import { decodeQuery } from 'lib/DataFormat';
import qs from 'qs';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

class AssetAdminRouter extends Component {
  constructor(props) {
    super(props);

    this.handleBrowse = this.handleBrowse.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  /**
   * Generates the Url for a given folder and file ID.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object} [query]
   * @returns {string}
   */
  getUrl(folderId = 0, fileId = null, query = {}) {
    let url = this.props.sectionConfig.url;

    if (fileId) {
      url = `${url}/show/${folderId}/edit/${fileId}`;
    } else if (folderId) {
      url = `${url}/show/${folderId}`;
    } else {
      url = `${url}/`;
    }

    const newQuery = Object.assign({}, query);

    // Remove pagination selector if already on first page, or changing folder
    const hasFolderChanged = parseInt(folderId, 10) !== this.getFolderId();
    if (hasFolderChanged || newQuery.page <= 1) {
      delete newQuery.page;
    }

    const hasQuery = (newQuery && Object.keys(newQuery).length > 0);
    if (hasQuery) {
      url = `${url}?${qs.stringify(newQuery)}`;
    }

    return url;
  }

  /**
   * @return {Integer} Folder ID being viewed
   */
  getFolderId() {
    if (this.props.params && this.props.params.folderId) {
      return parseInt(this.props.params.folderId, 10);
    }
    return 0;
  }

  /**
   * @return {Integer} File ID being viewed
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
