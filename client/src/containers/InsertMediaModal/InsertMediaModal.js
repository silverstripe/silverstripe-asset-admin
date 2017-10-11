import i18n from 'i18n';
import React, { Component, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import AssetAdmin, { getFormSchema } from 'containers/AssetAdmin/AssetAdmin';
import stateRouter from 'containers/AssetAdmin/stateRouter';
import fileSchemaModalHandler from 'containers/InsertLinkModal/fileSchemaModalHandler';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';


class InsertMediaModal extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { show, onBrowse, setOverrides, fileAttributes, folderId } = this.props;

    if (!show) {
      onBrowse(0);
    }
    if (typeof setOverrides === 'function'
      && show
      && fileAttributes.ID
    ) {
      setOverrides(this.props);
      onBrowse(folderId, fileAttributes.ID);
    }
  }

  componentWillReceiveProps(props) {
    if (!props.show && this.props.show) {
      props.onBrowse(0);
    }
    if (typeof this.props.setOverrides === 'function' &&
      props.show &&
      !this.props.show
    ) {
      this.props.setOverrides(props);
      props.onBrowse(props.folderId, props.fileAttributes ? props.fileAttributes.ID : null);
    }
  }

  /**
   * Generates the properties for the section
   *
   * @returns {object}
   */
  getSectionProps() {
    return {
      ...this.props,
      dialog: true,
      toolbarChildren: this.renderToolbarChildren(),
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
  type: PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
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
    Description: PropTypes.string,
    TargetBlank: PropTypes.bool,
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
  type: 'insert-media',
  folderId: 0,
};

function mapStateToProps(state, ownProps) {
  const config = ownProps.sectionConfig;

  if (!config) {
    return {};
  }

  let folderId = 0;
  if (ownProps.folderId !== null) {
    folderId = ownProps.folderId;
  } else if (ownProps.folder) {
    folderId = ownProps.folder.id;
  }
  const fileId = (ownProps.fileAttributes) ? ownProps.fileAttributes.ID : ownProps.fileId;

  const props = {
    config,
    viewAction: ownProps.viewAction,
    folderId,
    type: ownProps.type,
    fileId,
  };
  const { schemaUrl, targetId } = getFormSchema(props);

  if (!schemaUrl) {
    return {};
  }

  // set schemaUrl for `fileSchemaModalHandler` to load the default form values properly
  return {
    schemaUrl: `${schemaUrl}/${targetId}`,
  };
}

export { InsertMediaModal as Component };

export default compose(
  stateRouter,
  connect(mapStateToProps),
  fileSchemaModalHandler
)(InsertMediaModal);
