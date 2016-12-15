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
   * Note: Leaving newQuery empty will default to the current querystring.
   * Setting it to an empty object will clear it.
   * Setting it to a non-empty object will replace it
   *
   * @param {number} [folderId]
   * @param {number} [fileId]
   * @param {object|null} [newQuery]
   * @returns {string}
   */
  getUrl(folderId = 0, fileId = null, newQuery = null) {
    let url = this.props.sectionConfig.url;

    if (fileId) {
      url = `${url}/show/${folderId}/edit/${fileId}`;
    } else if (folderId) {
      url = `${url}/show/${folderId}`;
    } else {
      url = `${url}/`;
    }

    const search = urlQuery(this.getQuery(), newQuery);
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

  getQuery() {
    // @TODO: De-serialise query as PHP would
    // I.e. nested { q : {key: val }} not { q[key]: val }
    return this.props.location.query;
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
