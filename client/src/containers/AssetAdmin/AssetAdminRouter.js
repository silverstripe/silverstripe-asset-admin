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

    const hasFolderChanged = (parseInt(folderId, 10) !== parseInt(this.props.params.folderId, 10));
    const newQuery = Object.assign({}, query);

    if (hasFolderChanged) {
      newQuery.page = 0;
    }

    const hasQuery = (newQuery && Object.keys(newQuery).length > 0);
    if (hasQuery) {
      url = `${url}?${qs.stringify(newQuery)}`;
    }

    return url;
  }

  /**
   * Generates the properties for this section
   *
   * @returns {object}
   */
  getSectionProps() {
    let folderId = 0;
    if (this.props.params && this.props.params.folderId) {
      folderId = parseInt(this.props.params.folderId, 10);
    }
    let fileId = 0;
    if (this.props.params && this.props.params.fileId) {
      fileId = parseInt(this.props.params.fileId, 10);
    }
    return {
      sectionConfig: this.props.sectionConfig,
      type: 'admin',
      folderId,
      fileId,
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
