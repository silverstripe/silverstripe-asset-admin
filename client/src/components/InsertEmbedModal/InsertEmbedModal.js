import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as schemaActions from 'state/schema/SchemaActions';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

class InsertEmbedModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setOverrides(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.show && !this.props.show) {
      this.setOverrides(props);
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

  handleSubmit() {

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
        bodyClassName: 'fill-height',
        className: `insert-embed-modal ${this.props.className}`,
        bsSize: 'lg',
        handleHide: this.props.onHide,
        title: this.props.targetUrl
          ? `Edit details for ${this.props.targetUrl}`
          : 'Insert new Embedded content',
      }
    );
    delete props.onHide;
    delete props.sectionConfig;
    delete props.onInsert;
    delete props.attributes;

    return props;
  }

  render() {
    return <FormBuilderModal {...this.getModalProps()} />;
  }
}

InsertEmbedModal.propTypes = {
  sectionConfig: PropTypes.shape({
    url: PropTypes.string,
    form: PropTypes.object,
  }),
  show: PropTypes.bool,
  onInsert: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    ID: PropTypes.number,
    AltText: PropTypes.string,
    Width: PropTypes.number,
    Height: PropTypes.number,
    TitleTooltip: PropTypes.string,
    Alignment: PropTypes.string,
  }),
  onHide: PropTypes.func,
  className: PropTypes.string,
  actions: PropTypes.object,
};

InsertEmbedModal.defaultProps = {
  className: '',
  attributes: {},
};

function mapStateToProps(state, ownProps) {
  const sectionConfig = state.config.sections[sectionConfigKey];

  // get the schemaUrl to use as a key for overrides
  const targetUrl = ownProps.attributes ? ownProps.attributes.url : '';
  const baseEditUrl = sectionConfig.form.remoteEditForm.schemaUrl;

  const editUrl = targetUrl && `${baseEditUrl}/?url=${encodeURIComponent(targetUrl)}`;
  const createUrl = sectionConfig.form.remoteCreateForm.schemaUrl;

  const schemaUrl = editUrl || createUrl;

  return {
    sectionConfig,
    schemaUrl,
    targetUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

export { InsertEmbedModal };

export default connect(mapStateToProps, mapDispatchToProps)(InsertEmbedModal);
