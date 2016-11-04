import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

class AssetAdminRouter extends Component {
  constructor(props) {
    super(props);

    this.handleBrowse = this.handleBrowse.bind(this);
    this.getUrl = this.getUrl.bind(this);
  }

  /**
   * Handle browsing with the router.
   * To clear the query string, pass in `null` as the parameter, otherwise it will default to the
   * existing query string.
   *
   * @param {number} folderId
   * @param {number} fileId
   * @param {object|null} newQuery
   */
  handleBrowse(folderId, fileId, newQuery) {

    const pathname = this.getUrl(folderId, fileId);

    let query = newQuery;

    if (newQuery !== null && !newQuery) {
      query = this.props.location.query;
    }

    this.props.router.push(Object.assign({},
      this.props.location,
      {
        pathname,
        query,
      }
    ));
  }

  /**
   * Generates the Url for a given folder and file ID.
   *
   * @param {number} folderId
   * @param {number} fileId
   * @returns {string}
   */
  getUrl(folderId, fileId) {
    const base = this.props.sectionConfig.url;
    let url = `${base}/show/${folderId || 0}`;

    if (fileId) {
      url = `${url}/edit/${fileId}`;
    }
    return url;
  }

  render() {
    if (!this.props.sectionConfig) {
      return null;
    }
    const fileId = parseInt(this.props.params.fileId, 10);
    const folderId = parseInt(this.props.params.folderId, 10);
    const query = this.props.location.query;

    const sectionProps = {
      sectionConfig: this.props.sectionConfig,
      fileId,
      folderId,
      query,
      getUrl: this.getUrl,
      onBrowse: this.handleBrowse,
    };

    return (
      <AssetAdmin {...sectionProps} />
    );
  }
}

AssetAdminRouter.propTypes = {
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

export default withRouter(connect(mapStateToProps)(AssetAdminRouter));
