import React, { Component } from 'react';
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

class AssetAdminStateRouter extends Component {
  constructor(props) {
    super(props);

    this.handleBrowse = this.handleBrowse.bind(this);
    this.getUrl = this.getUrl.bind(this);

    this.state = Object.assign(
      {},
      initialState,
      { folderId: props.folderId }
    );
  }

  /**
   * Generates the Url to AssetAdmin for a given folder and file ID.
   *
   * Only used by AssetAdmin to build breadcrumbs for a particular folder / file
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
    const oldFolderId = this.getFolderId();

    // Remove pagination selector if already on first page, or changing folder (if folder is known)
    const hasFolderChanged = newFolderId !== oldFolderId && oldFolderId !== null;
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
   * @return {*} Folder ID being viewed, or null if not known
   */
  getFolderId() {
    if (this.state.folderId === null) {
      return null;
    }
    return parseInt(this.state.folderId || 0, 10);
  }

  /**
   * @return {Number} File ID being viewed
   */
  getFileId() {
    return parseInt(this.state.fileId || this.props.fileId || 0, 10);
  }

  getViewAction() {
    return this.state.action || CONSTANTS.ACTIONS.EDIT_FILE;
  }

  getSectionProps() {
    const props = Object.assign({},
      this.props,
      {
        folderId: this.getFolderId(),
        fileId: this.getFileId(),
        viewAction: this.getViewAction(),
        query: this.state.query,
        getUrl: this.getUrl,
        onBrowse: this.handleBrowse,
      }
    );

    delete props.Component;

    return props;
  }

  /**
   * Handle browsing through the asset admin section.
   *
   * @param {number} folderId
   * @param {number} fileId
   * @param {object} query
   * @param {string} action
   */
  handleBrowse(folderId, fileId, query = {}, action = CONSTANTS.ACTIONS.EDIT_FILE) {
    if (action && Object.values(CONSTANTS.ACTIONS).indexOf(action) === -1) {
      throw new Error(`Invalid action provided: ${action}`);
    }

    if (this.state.fileId !== fileId) {
      // When AssetAdmin is displayed in Modal, the insert media and admin form can be displayed.
      // When a different file is selected, we should switch back to displaying the main form.
      this.props.actions.resetFormStack();
    }

    this.setState({
      folderId,
      fileId,
      query,
      action,
    });
  }

  render() {
    const sectionProps = this.getSectionProps();
    const AssetAdmin = this.props.Component;

    return (<AssetAdmin {...sectionProps} />);
  }
}

AssetAdminStateRouter.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
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
