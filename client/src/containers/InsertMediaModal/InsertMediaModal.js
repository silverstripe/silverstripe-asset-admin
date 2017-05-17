import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { buildUrl } from 'containers/AssetAdmin/AssetAdminRouter';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as schemaActions from 'state/schema/SchemaActions';
import CONSTANTS from 'constants/index';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

const initialState = {
  folderId: null,
  fileId: null,
  query: {},
  action: CONSTANTS.ACTIONS.EDIT_FILE,
};

class InsertMediaModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBrowse = this.handleBrowse.bind(this);
    this.getUrl = this.getUrl.bind(this);

    this.state = Object.assign({}, initialState, { fileId: props.fileAttributes.ID });
  }

  componentWillMount() {
    this.setOverrides(this.props);
  }

  componentWillReceiveProps(props) {
    if (!props.show && this.props.show) {
      this.setState(initialState);
    }
    if (props.show && !this.props.show && props.fileAttributes.ID) {
      this.setOverrides(props);

      this.setState({
        folderId: null,
        fileId: props.fileAttributes.ID,
        action: CONSTANTS.ACTIONS.EDIT_FILE,
      });
    }
  }

  componentWillUnmount() {
    this.setOverrides();
  }

  /**
   * Compares the current properties with received properties and determines if overrides need to be
   * cleared or added.
   *
   * @param {object} props
   */
  setOverrides(props) {
    if (!props || this.props.schemaUrl !== props.schemaUrl) {
      // clear any overrides that may be in place
      const schemaUrl = props && props.schemaUrl || this.props.schemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    }
    if (props && props.schemaUrl) {
      const attrs = Object.assign({}, props.fileAttributes);

      delete attrs.ID;

      const overrides = {
        fields: Object.entries(attrs).map((field) => {
          const [name, value] = field;
          return { name, value };
        }),
      };
      // set overrides into redux store, so that it can be accessed by FormBuilder with the same
      // schemaUrl.
      this.props.actions.schema.setSchemaStateOverrides(props.schemaUrl, overrides);
    }
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

    // Remove pagination selector if already on first page, or changing folder (if folder is known)
    const hasFolderChanged = newFolderId !== this.getFolderId() && this.getFolderId() !== null;
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

  /**
   * Generates the properties for the section
   *
   * @returns {object}
   */
  getSectionProps() {
    return {
      dialog: true,
      type: this.props.type,
      toolbarChildren: this.renderToolbarChildren(),
      sectionConfig: this.props.sectionConfig,
      folderId: this.getFolderId(),
      fileId: this.getFileId(),
      viewAction: this.getViewAction(),
      query: this.state.query,
      getUrl: this.getUrl,
      onBrowse: this.handleBrowse,
      onSubmitEditor: this.handleSubmit,
      onReplaceUrl: this.handleBrowse,
    };
  }

  /**
   * Generates the properties for the modal
   * @returns {object}
   */
  getModalProps() {
    const props = Object.assign(
      {},
      this.props,
      {
        className: `insert-media-modal ${this.props.className}`,
        bsSize: 'lg',
      }
    );
    delete props.onHide;
    delete props.onInsert;
    delete props.sectionConfig;
    delete props.schemaUrl;

    return props;
  }

  /**
   * Handles the insert form submission, does not continue the regular form submission within the
   * asset admin section.
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @param {object} file
   */
  handleSubmit(data, action, submitFn, file) {
    if (action === 'action_createfolder') {
      return submitFn();
    }
    return this.props.onInsert(data, file);
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

    this.setState({
      folderId,
      fileId,
      query,
      action,
    });
  }

  renderToolbarChildren() {
    return (
      <button
        type="button"
        className="close insert-media-modal__close-button"
        onClick={this.props.onHide}
        aria-label={i18n._t('FormBuilderModal.CLOSE', 'Close')}
      >
        <span aria-hidden="true">×</span>
      </button>
    );
  }

  render() {
    const modalProps = this.getModalProps();
    const sectionProps = this.getSectionProps();
    const assetAdmin = (this.props.show) ? <AssetAdmin {...sectionProps} /> : null;

    return (
      <FormBuilderModal {...modalProps} >
        {assetAdmin}
      </FormBuilderModal>
    );
  }
}

InsertMediaModal.propTypes = {
  sectionConfig: PropTypes.shape({
    url: PropTypes.string,
    form: PropTypes.object,
  }),
  type: PropTypes.oneOf(['insert', 'select', 'admin']),
  schemaUrl: PropTypes.string,
  show: PropTypes.bool,
  onInsert: PropTypes.func.isRequired,
  fileAttributes: PropTypes.shape({
    ID: PropTypes.number,
    AltText: PropTypes.string,
    Width: PropTypes.number,
    Height: PropTypes.number,
    TitleTooltip: PropTypes.string,
    Alignment: PropTypes.string,
  }),
  fileId: PropTypes.number,
  onHide: PropTypes.func,
  className: PropTypes.string,
  actions: PropTypes.object,
};

InsertMediaModal.defaultProps = {
  className: '',
  fileAttributes: {},
  type: 'insert',
};

function mapStateToProps(state, ownProps) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);

  // get the schemaUrl to use as a key for overrides
  const fileId = ownProps.fileAttributes ? ownProps.fileAttributes.ID : null;
  const schemaUrl = fileId && `${sectionConfig.form.fileInsertForm.schemaUrl}/${fileId}`;

  return {
    sectionConfig,
    schemaUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

export { InsertMediaModal };

export default connect(mapStateToProps, mapDispatchToProps)(InsertMediaModal);
