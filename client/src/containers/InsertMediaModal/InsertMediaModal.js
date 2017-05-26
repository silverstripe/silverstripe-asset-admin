import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import stateRouter from 'containers/AssetAdmin/stateRouter';
import fileSchemaModalHandler from 'containers/InsertLinkModal/fileSchemaModalHandler';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';


class InsertMediaModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(props) {
    if (!props.show && this.props.show) {
      props.onBrowse(0);
    }
    if (typeof this.props.setOverrides === 'function' &&
      props.show && !this.props.show &&
      props.fileAttributes.ID) {
      this.props.setOverrides(props);

      props.onBrowse(null, props.fileAttributes.ID);
    }
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
      folderId: this.props.folderId,
      fileId: this.props.fileId,
      viewAction: this.props.viewAction,
      query: this.props.query,
      getUrl: this.props.getUrl,
      onBrowse: this.props.onBrowse,
      onSubmitEditor: this.handleSubmit,
      onReplaceUrl: this.props.onBrowse,
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
  setOverrides: PropTypes.func,
  onInsert: PropTypes.func.isRequired,
  fileAttributes: PropTypes.shape({
    ID: PropTypes.number,
    AltText: PropTypes.string,
    Width: PropTypes.number,
    Height: PropTypes.number,
    TitleTooltip: PropTypes.string,
    Alignment: PropTypes.string,
  }),
  folderId: PropTypes.number,
  fileId: PropTypes.number,
  viewAction: PropTypes.string,
  query: PropTypes.object,
  getUrl: PropTypes.func,
  onBrowse: PropTypes.func.isRequired,
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
  const sectionConfig = ownProps.sectionConfig;

  // get the schemaUrl to use as a key for overrides
  const fileId = ownProps.fileAttributes ? ownProps.fileAttributes.ID : null;
  const schemaUrl = (sectionConfig && fileId)
    ? `${sectionConfig.form.fileInsertForm.schemaUrl}/${fileId}`
    : null;

  return {
    schemaUrl,
  };
}

export { InsertMediaModal };

export default compose(
  stateRouter,
  connect(mapStateToProps),
  fileSchemaModalHandler
)(InsertMediaModal);
