import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as schemaActions from 'state/schema/SchemaActions';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

class InsertMediaModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBrowse = this.handleBrowse.bind(this);
    this.getUrl = this.getUrl.bind(this);

    this.state = {
      folderId: 0,
      fileId: props.fileAttributes.ID,
      query: {},
    };
  }

  componentWillMount() {
    this.setOverrides(this.props);
  }

  componentWillReceiveProps(props) {
    if (!props.show && this.props.show) {
      this.setState({
        folderId: 0,
        fileId: null,
        query: {},
      });
    }
    if (props.show && !this.props.show && props.fileAttributes.ID) {
      this.setOverrides(props);

      this.setState({
        folderId: 0,
        fileId: props.fileAttributes.ID,
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
      this.props.actions.schema.setSchemaStateOverrides(props.schemaUrl, null);
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

  /**
   * Generates the properties for the section
   *
   * @returns {object}
   */
  getSectionProps() {
    return {
      dialog: true,
      type: 'insert',
      sectionConfig: this.props.sectionConfig,
      folderId: this.state.folderId,
      fileId: this.state.fileId || this.props.fileId,
      query: this.state.query,
      getUrl: this.getUrl,
      onBrowse: this.handleBrowse,
      onSubmitEditor: this.handleSubmit,
    };
  }

  /**
   * Generates the properties for the modal
   * @returns {object}
   */
  getModalProps() {
    return Object.assign(
      {},
      this.props,
      {
        handleHide: this.props.onHide,
        className: `insert-media-modal ${this.props.className}`,
        bsSize: 'lg',
        onHide: undefined,
        onInsert: undefined,
        sectionConfig: undefined,
        schemaUrl: undefined,
      }
    );
  }

  /**
   * Handles the insert form submission, does not continue the regular form submission within the
   * asset admin section.
   *
   * @param {object} data
   */
  handleSubmit(data, action, submitFn, file) {
    return this.props.onInsert(data, file);
  }

  /**
   * Handle browsing through the asset admin section.
   * To clear the query string, pass in `null` as the parameter, otherwise it will default to the
   * existing query string.
   *
   * @param {number} folderId
   * @param {number} fileId
   * @param {object|null} newQuery
   */
  handleBrowse(folderId, fileId, newQuery) {
    let query = newQuery;

    if (newQuery !== null && !newQuery) {
      query = this.state.query;
    } else {
      query = Object.assign({}, this.state.query, newQuery);
    }

    this.setState({
      folderId,
      fileId,
      query,
    });
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
  onHide: PropTypes.bool,
  className: PropTypes.string,
  actions: PropTypes.object,
};

InsertMediaModal.defaultProps = {
  className: '',
  fileAttributes: {},
};

function mapStateToProps(state, ownProps) {
  const sectionConfig = state.config.sections[sectionConfigKey];

  // get the schemaUrl to use as a key for overrides
  const fileId = ownProps.fileAttributes.ID;
  const section = state.config.sections[sectionConfigKey];
  const schemaUrl = fileId && `${section.form.FileInsertForm.schemaUrl}/${fileId}`;

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
