import i18n from 'i18n';
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import stateRouter from 'containers/AssetAdmin/stateRouter';
import fileSchemaModalHandler from 'containers/InsertLinkModal/fileSchemaModalHandler';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as modalActions from 'state/modal/ModalActions';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import getFormSchema from 'lib/getFormSchema';

class InsertMediaModal extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const {
      isOpen,
      onBrowse, setOverrides,
      fileAttributes, folderId
    } = this.props;

    if (!isOpen) {
      onBrowse(folderId || 0);
    } else if (
      typeof setOverrides === 'function'
      && fileAttributes.ID
    ) {
      setOverrides(this.props);
      onBrowse(folderId, fileAttributes.ID);
    }
  }

  componentWillReceiveProps(props) {
    if (!props.isOpen && this.props.isOpen) {
      props.onBrowse(props.folderId);
      props.actions.gallery.deselectFiles();
    }
    if (typeof this.props.setOverrides === 'function' &&
      props.isOpen &&
      !this.props.isOpen
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
    const { onHide, onInsert, sectionConfig, schemaUrl, className, ...props } = this.props;
    return {
      ...props,
      className: classnames('insert-media-modal', className),
      size: 'lg',
      showCloseButton: false
    };
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
    if (action === 'action_insert') {
      return this.props.onInsert(data, file);
    }

    // Standard form actions (e.g. publish)
    return submitFn();
  }

  renderToolbarChildren() {
    return (
      <button
        type="button"
        className="close modal__close-button insert-media-modal__close-button"
        onClick={this.props.onClosed}
        aria-label={i18n._t('FormBuilderModal.CLOSE', 'Close')}
      >
        <span aria-hidden="true">×</span>
      </button>
    );
  }

  render() {
    const modalProps = this.getModalProps();
    const sectionProps = this.getSectionProps();

    const assetAdmin = (this.props.isOpen) ? <AssetAdmin {...sectionProps} /> : null;

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
  isOpen: PropTypes.bool,
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
  requireLinkText: PropTypes.bool,
  folderId: PropTypes.number,
  fileId: PropTypes.number,
  viewAction: PropTypes.string,
  query: PropTypes.object,
  getUrl: PropTypes.func,
  onBrowse: PropTypes.func.isRequired,
  onClosed: PropTypes.func,
  className: PropTypes.string,
  actions: PropTypes.object,
  maxFiles: PropTypes.number,
  fileSelected: PropTypes.bool
};

InsertMediaModal.defaultProps = {
  className: '',
  fileAttributes: {},
  type: 'insert-media',
  folderId: 0,
  maxFiles: 1
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

  const formSchema = state.assetAdmin.modal.formSchema;

  const props = {
    config,
    viewAction: ownProps.viewAction,
    folderId,
    type: formSchema && formSchema.type,
    fileId,
  };
  const { schemaUrl, targetId } = getFormSchema(props);

  if (!schemaUrl) {
    return {};
  }

  const requireTextFieldUrl = ownProps.requireLinkText ? '?requireLinkText=true' : '';

  // set schemaUrl for `fileSchemaModalHandler` to load the default form values properly
  // This schema URL is not actually passed down to the Editor, it's just use to set the
  // form schema overrides
  return {
    schemaUrl: `${schemaUrl}/${targetId}${requireTextFieldUrl}`,
    type: formSchema && formSchema.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  };
}

export { InsertMediaModal as Component };

export default compose(
  stateRouter,
  connect(mapStateToProps, mapDispatchToProps),
  fileSchemaModalHandler
)(InsertMediaModal);
