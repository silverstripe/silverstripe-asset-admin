/* global window, FormData */
import i18n from 'i18n';
import React, { useEffect, useRef } from 'react';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import CONSTANTS from 'constants/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formValueSelector } from 'redux-form';
import * as previewFieldActions from 'state/previewField/PreviewFieldActions';
import { getFileExtension } from 'lib/DataFormat';
import getFormState from 'lib/getFormState';
import PropTypes from 'prop-types';
import urlLib from 'url';
import qs from 'qs';

const PreviewImageField = ({
  id,
  name,
  className = '',
  extraClass = '',
  readOnly,
  disabled,
  bustCache = true,
  onAutofill,
  nameValue,
  data = {},
  upload = {},
  actions,
  securityID,
  // eslint-disable-next-line no-alert
  confirm = (msg) => window.confirm(msg),
  AssetDropzoneComponent = AssetDropzone,
}) => {
  const prevDataRef = useRef({
    url: data.url,
    version: data.version,
    isInitial: true
  });
  const prevIdRef = useRef(id);

  useEffect(() => {
    const prevData = prevDataRef.current;
    // Check latest version to detect file save actions
    if (
      (prevData.url && data.url !== prevData.url)
      || (prevData.version && data.version !== prevData.version)
    ) {
      actions.previewField.removeFile(prevIdRef.current);
    }
    prevDataRef.current = {
      url: data.url,
      version: data.version,
      isInitial: false
    };
    // This must be set after it is used - do not move this into its own separate effect.
    prevIdRef.current = id;
  }, [id, data.url, data.version]);

  // Cleanup on unmount
  useEffect(() => () => {
    actions.previewField.removeFile(id);
  }, []);

  /**
   * Invoked by AssetDropZone to decorate additional form data fields
   * posted to the AssetAdmin::apiUploadFile endpoint.
   *
   * @param {FormData} formData
   */
  const updateFormData = (formData) => {
    formData.append('ID', data.id);
    formData.append('Name', nameValue);
  };

  /**
   * Started the sending process for a file
   *
   * @param {object} file
   * @param {object} xhr
   */
  const handleSending = (file, xhr) => {
    actions.previewField.updateFile(id, { xhr });
  };

  /**
   * Update tuple detail fields when upload is successful.
   *
   * @param fileXhr
   */
  const handleSuccessfulUpload = (fileXhr) => {
    const json = JSON.parse(fileXhr.xhr.response);

    if (typeof onAutofill === 'function') {
      onAutofill('FileFilename', json.Filename);
      onAutofill('FileHash', json.Hash);
      onAutofill('FileVariant', json.Variant);

      // Note: This Name was posted back from the current form field value,
      // and may have been modified on the server. If so, update the form value
      if (json.Name) {
        onAutofill(data.nameField, json.Name);
      }
    }
  };

  const handleFailedUpload = (file, response) => {
    actions.previewField.failUpload(id, response);
  };

  /**
   * Handles when a file is added to this field.
   *
   * @param {object} dataParam
   */
  const handleAddedFile = (dataParam) => {
    actions.previewField.addFile(id, dataParam);
  };

  /**
   * Handles removing an upload that had errored during/after upload
   */
  const handleRemoveErroredUpload = () => {
    // revert to initial values so errored or replaced replacement doesn't get used
    if (typeof onAutofill === 'function') {
      const initial = data.initialValues;

      onAutofill('FileFilename', initial.FileFilename);
      onAutofill('FileHash', initial.FileHash);
      onAutofill('FileVariant', initial.FileVariant);
    }

    actions.previewField.removeFile(id);
  };

  /**
   * Handles removing an upload and cancelling the request made to upload
   */
  const handleCancelUpload = () => {
    if (upload.xhr) {
      upload.xhr.abort();
    }
    handleRemoveErroredUpload();
  };

  /**
   *
   * @param {File} file
   * @returns {boolean}
   */
  const canFileUpload = (file) => {
    const prevName = data.initialValues.FileFilename;
    const prevExt = getFileExtension(prevName);
    const nextExt = getFileExtension(file.name);

    if (!prevExt || prevExt === nextExt) {
      return true;
    }

    const message = i18n._t(
      'AssetAdmin.CONFIRM_CHANGE_EXTENSION',
      'Are you sure you want upload a file with a different extension?'
    );

    return confirm(message);
  };

  /**
   * Defines whether this field can make changes/edits/uploads, looks at readonly, disabled and if
   * the file category is a "folder"
   *
   * @returns {boolean}
   */
  const canEdit = () => !readOnly
      && !disabled
      && data.category !== 'folder';

  /**
   * Upload progress has changed, set changes to reflect it
   *
   * @param {object} file
   * @param {object} progress
   */
  const handleUploadProgress = (file, progress) => {
    actions.previewField.updateFile(id, { progress });
  };

  /**
   * Upload was complete, set status changes to reflect it
   *
   * @param {object} file
   */
  const handleUploadComplete = (status) => {
    actions.previewField.updateStatus(id, { status });
  };

  /**
   * Append a vid parameter to the URL to bust the cache
   * @param {string} url
   * @param {string} versionId
   * @return string
   */
  const cacheBustUrl = (url, versionId = '') => {
    const vid = versionId || data.version;
    if (bustCache === false || !vid) {
      return url;
    }

    const parsedUrl = urlLib.parse(url);
    const parsedQs = { ...qs.parse(parsedUrl.query), vid };
    return urlLib.format({ ...parsedUrl, search: qs.stringify(parsedQs) });
  };

  /**
   * Build the preview URL
   * @param {string} category
   * @param {object} uploadParam
   * @param {object} dataParam
   * @returns {string}
   */
  const preview = (category, uploadParam, dataParam) => {
    if (category && category !== 'image') {
      return CONSTANTS.DEFAULT_PREVIEW;
    }
    const url = uploadParam.url || dataParam.preview || dataParam.url;
    if (url) {
      const plainUrl = url.startsWith('data:image/');
      return plainUrl ? url : cacheBustUrl(url, dataParam.version);
    }
    return null;
  };

  /**
   * Renders the image markup as normal by LiteralField
   *
   * @returns {object}
   */
  const renderImage = () => {
    // if not mocking the preview image (with icon), doesn't exist and no upload url...
    if (!data.mock && !data.exists && !upload.url) {
      return (
        <div className="editor__file-preview-message--file-missing">
          {i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found')}
        </div>
      );
    }

    const { category, progress, message } = upload;
    const errors = upload.errors ? upload.errors[0] : null;
    const status = upload.status ? upload.status : null;
    const previewUrl = preview(category, upload, data);
    const image = <img alt="preview" src={previewUrl} className="editor__thumbnail" />;
    const linkedImage = (data.url && !progress) ? (
      <a
        className="editor__file-preview-link"
        href={cacheBustUrl(data.url)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="editor__file-preview-icon font-icon-icon-enlarge" aria-hidden="true" />
        {image}
      </a>
    ) : null;
    const progressBar = (progress > 0 && progress < 100) ? (
      <div className="preview-image-field__progress">
        <div className="preview-image-field__progress-bar" style={{ width: `${progress}%` }} />
      </div>
    ) : null;
    let messageBox = null;

    if (errors || status === 'error') {
      const errorMessage = errors && errors.value
        ? errors.value
        : i18n._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.');

      const errorType = errors && errors.type ? errors.type : 'error';

      messageBox = (
        <div className={`preview-image-field__message preview-image-field__message--${errorType}`}>
          {errorMessage}
        </div>
      );
    } else if (message) {
      messageBox = (
        <div className={`preview-image-field__message preview-image-field__message--${message.type}`}>
          {message.value}
        </div>
      );
    } else if (progress === 100 && status === 'success') {
      messageBox = (
        <div className="preview-image-field__message preview-image-field__message--success">
          {i18n._t(
            'AssetAdmin.REPlACE_FILE_SUCCESS',
            'Upload successful, the file will be replaced when you Save.'
          )}
          {(progress || message) && (
            <button
              onClick={handleCancelUpload}
              className="preview-image-field__message-button btn btn-outline-light"
              type="button"
            >{i18n._t('AssetAdmin.REPLACE_FILE_UNDO', 'Undo')}</button>
          )}
        </div>
      );
    }

    return (
      <div className="editor__thumbnail-container">
        {linkedImage || image}
        {progressBar}
        {messageBox}
      </div>
    );
  };

  const getDropzoneProps = () => {
    const endpoint = data.uploadFileEndpoint;
    const options = {
      url: endpoint && endpoint.url,
      method: endpoint && endpoint.method,
      paramName: 'Upload',
      clickable: true,
      maxFiles: 1,
    };
    const previewObj = {
      height: CONSTANTS.THUMBNAIL_HEIGHT,
      width: CONSTANTS.THUMBNAIL_WIDTH,
    };

    const classNames = [
      'asset-dropzone--button',
      'preview-image-field__container',
      className,
      extraClass,
    ];

    return {
      name,
      className: classNames.join(' '),
      canUpload: endpoint && canEdit(),
      preview: previewObj,
      folderId: data.parentid,
      options,
      securityID,
      uploadButton: false,
      onAddedFile: handleAddedFile,
      onError: handleFailedUpload,
      onSuccess: handleSuccessfulUpload,
      onSending: handleSending,
      onUploadProgress: handleUploadProgress,
      onUploadComplete: handleUploadComplete,
      canFileUpload,
      updateFormData,
    };
  };

  const dropzoneProps = getDropzoneProps();

  if (canEdit()) {
    return (
      <AssetDropzoneComponent {...dropzoneProps}>
        {renderImage()}
      </AssetDropzoneComponent>
    );
  }
  const classNames = [
    'preview-image-field__container',
    className,
    extraClass,
  ];

  return (
    <div className={classNames.join(' ')}>
      {renderImage()}
    </div>
  );
};

PreviewImageField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  extraClass: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  bustCache: PropTypes.bool,
  onAutofill: PropTypes.func,
  formid: PropTypes.string,
  nameValue: PropTypes.string,
  data: PropTypes.shape({
    id: PropTypes.number,
    parentid: PropTypes.number,
    version: PropTypes.number,
    url: PropTypes.string,
    mock: PropTypes.bool,
    exists: PropTypes.bool,
    preview: PropTypes.string,
    category: PropTypes.string,
    nameField: PropTypes.string,
    uploadFileEndpoint: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      payloadFormat: PropTypes.string,
    }),
    initialValues: PropTypes.object,
  }).isRequired,
  upload: PropTypes.shape({
    url: PropTypes.string,
    progress: PropTypes.number,
    xhr: PropTypes.object,
    category: PropTypes.string,
    message: PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
    status: PropTypes.string,
  }),
  actions: PropTypes.object,
  securityID: PropTypes.string,
  confirm: PropTypes.func,
  AssetDropzoneComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

function mapStateToProps(state, ownProps) {
  const securityID = state.config.SecurityID;
  const id = ownProps.id;
  const upload = state.assetAdmin.previewField[id] || {};
  const selector = formValueSelector(ownProps.formid, getFormState);
  const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';
  const { bustCache } = state.config.sections.find((section) => section.name === sectionConfigKey);

  return {
    securityID,
    upload,
    nameValue: selector(state, 'Name'),
    bustCache
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      previewField: bindActionCreators(previewFieldActions, dispatch),
    },
  };
}

export { PreviewImageField as Component };

export default connect(mapStateToProps, mapDispatchToProps)(PreviewImageField);
