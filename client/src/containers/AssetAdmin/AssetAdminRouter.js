import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import { urlQuery } from 'lib/DataFormat';

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
   * @param {object|null} [newQuery]
   * @returns {string}
   */
  getUrl(folderId = 0, fileId, newQuery) {
    const base = this.props.sectionConfig.url;
    let url = `${base}/show/${folderId}`;

    if (fileId) {
      url = `${url}/edit/${fileId}`;
    }

    const search = urlQuery(this.props.location, newQuery);
    if (search) {
      url = `${url}${search}`;
    }
    return url;
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
      folderId: parseInt(this.props.params.folderId, 10),
      fileId: parseInt(this.props.params.fileId, 10),
      query: this.props.location.query,
      getUrl: this.getUrl,
      onBrowse: this.handleBrowse,
    };
  }

  /**
   * Handle browsing with the router.
   * To clear the query string, pass in `null` as the parameter, otherwise it will default to the
   * existing query string.
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object|null} [query]
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
  }),
  params: PropTypes.shape({
    fileId: PropTypes.string,
    folderId: PropTypes.string,
  }),
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
