/* global confirm */
import i18n from 'i18n';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import React, { Component } from 'react';
import CONSTANTS from 'constants/index';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as UnsavedFormsActions from 'state/unsavedForms/UnsavedFormsActions';
import fileShape from 'lib/fileShape';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import * as modalActions from 'state/modal/ModalActions';
import EditorHeader, { buttonStates } from './EditorHeader';
import classnames from 'classnames';
import url from 'url';
import qs from 'qs';

const formIdentifier = 'AssetAdmin.EditForm';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.getFormSchemaUrl = this.getFormSchemaUrl.bind(this);
    this.handleCancelKeyDown = this.handleCancelKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleLoadingSuccess = this.handleLoadingSuccess.bind(this);
    this.handleLoadingError = this.handleLoadingError.bind(this);
    this.handleFetchingSchema = this.handleFetchingSchema.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.createFn = this.createFn.bind(this);
    this.editorHeader = this.editorHeader.bind(this);

    this.state = {
      openModal: false,
      loadingForm: false,
      loadingError: null,
    };
  }

  /**
   * Build the form schema URL to pass to the Form Builder Loader
   * @returns {string}
   */
  getFormSchemaUrl() {
    const { schemaUrlQueries, schemaUrl, targetId } = this.props;

    const parsedURL = url.parse(schemaUrl);
    const parsedQs =
      schemaUrlQueries.reduce(
        (accumulator, { name, value }) => ({ ...accumulator, [name]: value }),
        {}
      );

    return url.format({
      ...parsedURL,
      pathname: `${parsedURL.path}/${targetId}`,
      search: qs.stringify(parsedQs)
    });
  }

  handleAction(event) {
    switch (event.currentTarget.name) {
      // intercept the Add to Campaign submit and open the modal dialog instead
      case 'action_addtocampaign':
        this.openModal();
        event.preventDefault();

        break;
      case 'action_replacefile':
        this.replaceFile();
        event.preventDefault();

        break;
      case 'action_downloadfile':
        this.downloadFile();
        event.preventDefault();

        break;
      case 'action_delete':
        this.props.actions.confirmDeletion.confirm([this.props.file]);
        event.preventDefault();

        break;
      default:
        break;
    }
  }

  /**
   * Trigger handleClose if either the return key or space key is pressed
   * @param {object} event
   */
  handleCancelKeyDown(event) {
    if (event.keyCode === CONSTANTS.SPACE_KEY_CODE || event.keyCode === CONSTANTS.RETURN_KEY_CODE) {
      this.handleClose(event);
    }
  }

  /**
   * Catches the <FormBuilderLoader> event to allow custom handling.
   *
   * @param {Object} data
   * @param {String} action
   * @param {Function} submitFn The original submit function
   * @returns {Promise}
   */
  handleSubmit(data, action, submitFn) {
    const { showingSubForm, actions } = this.props;
    if (typeof this.props.onSubmit === 'function') {
      return this.props.onSubmit(data, action, submitFn).finally(() => {
        // When performing a primary action on a subform, pop to the previous form
        if (showingSubForm && ['action_save', 'action_publish'].indexOf(action) !== -1) {
          actions.modal.popFormStackEntry();
        }
      });
    }

    return submitFn();
  }

  /**
   * Handle the click on the Back or Cancel button on the EditorHeader component.
   * @param {Event|undefined} event
   */
  handleClose(event) {
    const { showingSubForm, onClose, actions } = this.props;

    if (showingSubForm) {
      // When we're showing a sub form, pop back to the parent form
      actions.modal.popFormStackEntry();
    } else {
      // If we're already at the top of the form stack, close the editor form
      onClose();
      this.closeModal();
    }

    if (event) {
      event.preventDefault();
    }
  }

  openModal() {
    this.setState({ openModal: true });
  }

  closeModal() {
    this.setState({ openModal: false });
  }

  replaceFile() {
    const hiddenFileInput = document.querySelector('.dz-input-PreviewImage');

    // Trigger a click on Dropzone's hidden file input in order to upload an image
    if (hiddenFileInput) {
      hiddenFileInput.click();
    }
  }

  downloadFile() {
    function downloadURI(uri, name) {
      const link = document.createElement('a');
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    downloadURI(this.props.file.url, this.props.file.name);
    document.getElementById('Form_fileEditForm_PopoverActions').focus();
  }

  handleLoadingError(exception) {
    this.setState({
      loadingForm: false,
      loadingError: exception.errors[0],
    });
  }

  handleLoadingSuccess() {
    this.setState({
      loadingForm: false,
      loadingError: null,
    });
  }

  handleFetchingSchema() {
    this.setState({
      loadingForm: true,
    });
  }

  /**
   * Wrap the the Header field into an EditorHeader component.
   * @param {Component} SchemaComponent
   * @param {Object} fieldProps
   */
  editorHeader({ SchemaComponent, ...fieldProps }) {
    const { dialog, nextType, showingSubForm, actions, file } = this.props;
    const schemaUrl = this.getFormSchemaUrl();

    let showButton = buttonStates.SWITCH;
    if (dialog && file && file.type !== 'folder') {
      // When editing the details of a file from inside the modal, we always show the back button
      // Otherwise, we only show theb ack button in mobile view to allow deselection of file
      showButton = showingSubForm ? buttonStates.ALWAYS_BACK : buttonStates.ONLY_BACK;
    }

    // If we have a nextType available, wire the Detail button
    const { formid } = fieldProps;
    // When inserting a regular file, we add a Details button to edit the file metadata
    const onDetails = nextType && file && file.type !== 'folder' ?
      () => {
        actions.modal.stashFormValues(formid, schemaUrl);
        actions.modal.pushFormStackEntry(nextType);
      } :
      undefined;

    const props = {
      onCancel: this.handleClose,
      showButton,
      onDetails
    };

    return (
      <EditorHeader {...props}>
        <SchemaComponent {...fieldProps} />
      </EditorHeader>
    );
  }

  /**
   * Overrides the regular FormBuilder logic that creates the fields so we can decorate the
   * Header field with some extra buttons.
   * @param {Component} SchemaComponent Default component use to render the field.
   * @param {Object} componentProps Props to pass to the field component.
   */
  createFn(SchemaComponent, componentProps) {
    if (componentProps.name === 'AssetEditorHeaderFieldGroup') {
      // If we're building the field for our Header Field group.
      const EditorHeaderComponent = this.editorHeader;
      const editorHeaderProps = {
        key: componentProps.id,
        SchemaComponent,
        ...componentProps
      };
      return <EditorHeaderComponent {...editorHeaderProps} />;
    }

    // Fallback to the regular field creation logic
    return <SchemaComponent key={componentProps.id} {...componentProps} />;
  }

  render() {
    const formSchemaUrl = this.getFormSchemaUrl();
    const modalSchemaUrl = `${this.props.addToCampaignSchemaUrl}/${this.props.targetId}`;
    const editorClasses = classnames(
      'panel', 'form--no-dividers', 'editor', {
        'editor--asset-dropzone--disable': !this.props.enableDropzone
      },
      this.props.className
    );

    let error = null;
    if (this.state.loadingError) {
      let message = this.state.loadingError.value;
      if (this.state.loadingError.code === 404) {
        message = i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
      }
      if (!message) {
        message = i18n._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred');
      }
      error = (
        <div className="editor__file-preview-message--file-missing">{message}</div>
      );
    }
    const campaignTitle = i18n._t('Admin.ADD_TO_CAMPAIGN', 'Add to campaign');
    const Loading = this.props.loadingComponent;

    // Most of the the time, the GraphQL data comes back first and the selected file data gets
    // passed down to the Editor in time for the EditorHeader to be rendered correctly.
    // Occasionnaly the FormSchema comes back first and the EditorHeader gets rendered without the
    // necessary file data. Passing `file` to FormBuilderLoader will force a re-render when the
    // GraphQL file data is filled in later on, which will cause a re-render of the EditorHeader.
    const { file } = this.props;

    return (<div className={editorClasses}>
      <div className="editor__details fill-height">
        <FormBuilderLoader
          identifier={formIdentifier}
          schemaUrl={formSchemaUrl}
          onSubmit={this.handleSubmit}
          onAction={this.handleAction}
          onLoadingSuccess={this.handleLoadingSuccess}
          onLoadingError={this.handleLoadingError}
          onFetchingSchema={this.handleFetchingSchema}
          createFn={this.createFn}
          file={file}
        />
        {error}
        <FormBuilderModal
          title={campaignTitle}
          identifier="AssetAdmin.AddToCampaign"
          isOpen={this.state.openModal}
          onClosed={this.closeModal}
          schemaUrl={modalSchemaUrl}
          bodyClassName="modal__dialog"
          responseClassBad="modal__response modal__response--error"
          responseClassGood="modal__response modal__response--good"
        />
        { this.state.loadingForm && <Loading />}
      </div>
    </div>);
  }
}

Editor.propTypes = {
  file: fileShape,
  className: PropTypes.string,
  targetId: PropTypes.number.isRequired,
  enableDropzone: PropTypes.bool,
  dialog: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  // onUnpublish: PropTypes.func.isRequired,
  schemaUrl: PropTypes.string.isRequired,
  schemaUrlQueries: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  })),
  addToCampaignSchemaUrl: PropTypes.string,
  actions: PropTypes.object,
  showingSubForm: PropTypes.bool,
  nextType: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      unsavedForms: bindActionCreators(UnsavedFormsActions, dispatch),
      confirmDeletion: bindActionCreators(confirmDeletionActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  };
}

function mapStateToProps({ assetAdmin: { gallery, modal } }) {
  return {
    enableDropzone: gallery.enableDropzone,
    nextType: modal.formSchema && modal.formSchema.nextType,
    showingSubForm: modal.formSchemaStack && modal.formSchemaStack.length > 1
  };
}

export { Editor as Component };

export default compose(
  inject(
    ['Loading'],
    (Loading) => ({
      loadingComponent: Loading
    }),
    () => 'AssetAdmin.Editor',
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Editor);
