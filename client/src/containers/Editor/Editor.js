/* global confirm */
import i18n from 'i18n';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import React, { useState, useEffect } from 'react';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as UnsavedFormsActions from 'state/unsavedForms/UnsavedFormsActions';
import PropTypes from 'prop-types';
import { inject } from 'lib/Injector';
import Config from 'lib/Config';
import backend from 'lib/Backend';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';
import * as modalActions from 'state/modal/ModalActions';
import classnames from 'classnames';
import url from 'url';
import qs from 'qs';
import EditorHeader, { buttonStates } from './EditorHeader';

const formIdentifier = 'AssetAdmin.EditForm';

const Editor = ({
  className,
  fileId,
  enableDropzone,
  dialog,
  onClose,
  onSubmit,
  schemaUrl,
  schemaUrlQueries,
  addToCampaignSchemaUrl,
  actions,
  showingSubForm,
  nextType,
  EditorHeaderComponent = EditorHeader,
  FormBuilderLoaderComponent = FormBuilderLoader,
  FormBuilderModalComponent = FormBuilderModal,
  loadingComponent
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingError, setLoadingError] = useState(null);
  const [file, setFile] = useState(null);

  // Refetch data about the file on mount and if the file ID changes
  useEffect(() => {
    const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdminOpen');
    const endpointUrl = `${sectionConfig.endpoints.read.url}/${fileId}`;
    backend.get(endpointUrl)
      .then(response => response.json())
      .then(responseJson => {
        setFile(responseJson);
      });
  }, [fileId]);

  /**
   * Build the form schema URL to pass to the Form Builder Loader
   * @returns {string}
   */
  const getFormSchemaUrl = () => {
    const parsedURL = url.parse(schemaUrl);
    const parsedQs =
      schemaUrlQueries.reduce(
        (accumulator, { name, value }) => ({ ...accumulator, [name]: value }),
        {}
      );

    return url.format({
      ...parsedURL,
      pathname: `${parsedURL.path}/${fileId}`,
      search: qs.stringify(parsedQs)
    });
  };

  /**
   * Handle the click on the Back or Cancel button on the EditorHeader component.
   * @param {Event|undefined} event
   */
  const handleClose = (event) => {
    if (showingSubForm) {
      // When we're showing a sub form, pop back to the parent form
      actions.modal.popFormStackEntry();
    } else {
      // If we're already at the top of the form stack, close the editor form
      onClose();
      setOpenModal(false);
    }

    if (event) {
      event.preventDefault();
    }
  };

  /**
   * Catches the <FormBuilderLoader> event to allow custom handling.
   *
   * @param {Object} data
   * @param {String} action
   * @param {Function} submitFn The original submit function
   * @returns {Promise}
   */
  const handleSubmit = (data, action, submitFn) => {
    if (typeof onSubmit === 'function') {
      return onSubmit(data, action, submitFn).finally(() => {
        // When performing a primary action on a subform, pop to the previous form
        if (showingSubForm && ['action_save', 'action_publish'].indexOf(action) !== -1) {
          actions.modal.popFormStackEntry();
        }
      });
    }

    return submitFn();
  };

  const replaceFile = () => {
    const hiddenFileInput = document.querySelector('.dz-input-PreviewImage');

    // Trigger a click on Dropzone's hidden file input in order to upload an image
    if (hiddenFileInput) {
      hiddenFileInput.click();
    }
  };

  const downloadFile = () => {
    function downloadURI(uri, name) {
      const link = document.createElement('a');
      link.download = name;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    downloadURI(file.url, file.name);
    document.getElementById('Form_fileEditForm_PopoverActions').focus();
  };

  const handleAction = (event) => {
    switch (event.currentTarget.name) {
      // intercept the Add to Campaign submit and open the modal dialog instead
      case 'action_addtocampaign':
        setOpenModal(true);
        event.preventDefault();

        break;
      case 'action_replacefile':
        replaceFile();
        event.preventDefault();

        break;
      case 'action_downloadfile':
        downloadFile();
        event.preventDefault();

        break;
      case 'action_delete':
        actions.confirmDeletion.confirm([file]);
        event.preventDefault();

        break;
      default:
        break;
    }
  };

  const handleLoadingError = (exception) => {
    setLoadingForm(false);
    setLoadingError(exception.errors[0]);
  };

  const handleLoadingSuccess = () => {
    setLoadingForm(false);
    setLoadingError(null);
  };

  const handleFetchingSchema = () => {
    setLoadingForm(true);
  };

  /**
   * Wrap the the Header field into an EditorHeader component.
   * @param {Component} SchemaComponent
   * @param {Object} fieldProps
   */
  const editorHeader = ({ SchemaComponent, ...fieldProps }) => {
    const schemaUrlValue = getFormSchemaUrl();

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
        actions.modal.stashFormValues(formid, schemaUrlValue);
        actions.modal.pushFormStackEntry(nextType);
      } :
      undefined;

    const props = {
      onCancel: handleClose,
      showButton,
      onDetails
    };

    return (
      <EditorHeaderComponent {...props}>
        <SchemaComponent {...fieldProps} />
      </EditorHeaderComponent>
    );
  };

  /**
   * Overrides the regular FormBuilder logic that creates the fields so we can decorate the
   * Header field with some extra buttons.
   * @param {Component} SchemaComponent Default component use to render the field.
   * @param {Object} componentProps Props to pass to the field component.
   */
  const createFn = (SchemaComponent, componentProps) => {
    if (componentProps.name === 'AssetEditorHeaderFieldGroup') {
      // If we're building the field for our Header Field group.
      const editorHeaderProps = {
        key: componentProps.id,
        SchemaComponent,
        ...componentProps
      };
      return editorHeader(editorHeaderProps);
    }

    // Fallback to the regular field creation logic
    return <SchemaComponent key={componentProps.id} {...componentProps} />;
  };

  if (!file) {
    return null;
  }
  const formSchemaUrl = getFormSchemaUrl();
  const modalSchemaUrl = `${addToCampaignSchemaUrl}/${fileId}`;
  const editorClasses = classnames(
    'panel', 'form--no-dividers', 'editor', {
      'editor--asset-dropzone--disable': !enableDropzone
    },
    className
  );
  let error = null;
  if (loadingError) {
    let message = loadingError.value;
    if (loadingError.code === 404) {
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
  const Loading = loadingComponent;

  return (<div className={editorClasses}>
    <div className="editor__details fill-height">
      <FormBuilderLoaderComponent
        identifier={formIdentifier}
        schemaUrl={formSchemaUrl}
        onSubmit={handleSubmit}
        onAction={handleAction}
        onLoadingSuccess={handleLoadingSuccess}
        onLoadingError={handleLoadingError}
        onFetchingSchema={handleFetchingSchema}
        createFn={createFn}
        file={file}
        autoFocus
      />
      {error}
      <FormBuilderModalComponent
        title={campaignTitle}
        identifier="AssetAdmin.AddToCampaign"
        isOpen={openModal}
        onClosed={() => setOpenModal(false)}
        schemaUrl={modalSchemaUrl}
        bodyClassName="modal__dialog"
        responseClassBad="modal__response modal__response--error"
        responseClassGood="modal__response modal__response--good"
      />
      { loadingForm && <Loading />}
    </div>
  </div>);
};

Editor.propTypes = {
  className: PropTypes.string,
  fileId: PropTypes.number.isRequired,
  enableDropzone: PropTypes.bool,
  dialog: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  schemaUrl: PropTypes.string.isRequired,
  schemaUrlQueries: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  })),
  addToCampaignSchemaUrl: PropTypes.string,
  actions: PropTypes.object,
  showingSubForm: PropTypes.bool,
  nextType: PropTypes.string,
  EditorHeaderComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  FormBuilderLoaderComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  FormBuilderModalComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
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
  connect(mapStateToProps, mapDispatchToProps),
)(Editor);
