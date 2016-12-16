import i18n from 'i18n';
import React, { PropTypes, Component } from 'react';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import CONSTANTS from 'constants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as previewFieldActions from 'state/previewField/PreviewFieldActions';
import { getFileExtension } from 'lib/DataFormat';

class PreviewImageField extends Component {
  constructor(props) {
    super(props);

    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleCancelUpload = this.handleCancelUpload.bind(this);
    this.handleRemoveErroredUpload = this.handleRemoveErroredUpload.bind(this);
    this.canFileUpload = this.canFileUpload.bind(this);
  }

  componentWillUnmount() {
    this.props.actions.previewField.removeFile(this.props.id);
  }

  getDropzoneProps() {
    const endpoint = this.props.data.uploadFileEndpoint;
    const options = {
      url: endpoint && endpoint.url,
      method: endpoint && endpoint.method,
      paramName: 'Upload',
      clickable: '#preview-replace-button',
      maxFiles: 1,
    };
    const preview = {
      height: CONSTANTS.THUMBNAIL_HEIGHT,
      width: CONSTANTS.THUMBNAIL_WIDTH,
    };
    const securityID = this.props.securityID;

    const classNames = [
      'asset-dropzone--button',
      'preview__container',
      this.props.className,
      this.props.extraClass,
    ];

    return {
      className: classNames.join(' '),
      canUpload: endpoint && this.canEdit(),
      preview,
      folderId: this.props.data.parentid,
      options,
      securityID,
      uploadButton: false,
      handleAddedFile: this.handleAddedFile,
      handleError: this.handleFailedUpload,
      handleSuccess: this.handleSuccessfulUpload,
      handleSending: this.handleSending,
      handleUploadProgress: this.handleUploadProgress,
      canFileUpload: this.canFileUpload,
    };
  }

  /**
   * Defines whether this field can make changes/edits/uploads, looks at readonly, disabled and if
   * the file category is a "folder"
   *
   * @returns {boolean}
   */
  canEdit() {
    return !this.props.readOnly
      && !this.props.disabled
      && this.props.data.category !== 'folder';
  }

  preventDefault(e) {
    e.preventDefault();
  }

  /**
   *
   * @param {File} file
   * @returns {boolean}
   */
  canFileUpload(file) {
    const prevName = this.props.data.initialValues.FileFilename;
    const prevExt = getFileExtension(prevName);
    const nextExt = getFileExtension(file.name);

    if (!prevExt || prevExt === nextExt) {
      return true;
    }

    const message = i18n._t(
      'AssetAdmin.CONFIRM_CHANGE_EXTENSION',
      'Are you sure you want upload a file with a different extension?'
    );

    return this.props.confirm(message);
  }

  /**
   * Handles removing an upload and cancelling the request made to upload
   */
  handleCancelUpload() {
    if (this.props.upload.xhr) {
      this.props.upload.xhr.abort();
    }
    this.handleRemoveErroredUpload();
  }

  /**
   * Handles removing an upload that had errored during/after upload
   */
  handleRemoveErroredUpload() {
    // revert to initial values so errored or replaced replacement doesn't get used
    if (typeof this.props.onAutofill === 'function') {
      const initial = this.props.data.initialValues;

      this.props.onAutofill('FileFilename', initial.FileFilename);
      this.props.onAutofill('FileHash', initial.FileHash);
      this.props.onAutofill('FileVariant', initial.FileVariant);
    }

    this.props.actions.previewField.removeFile(this.props.id);
  }

  /**
   * Handles when a file is added to this field.
   *
   * @param {object} data
   */
  handleAddedFile(data) {
    this.props.actions.previewField.addFile(this.props.id, data);
  }

  handleFailedUpload(file, response) {
    this.props.actions.previewField.failUpload(this.props.id, response);
  }

  /**
   * Update tuple detail fields when upload is successful.
   *
   * @param fileXhr
   */
  handleSuccessfulUpload(fileXhr) {
    const json = JSON.parse(fileXhr.xhr.response);

    if (typeof this.props.onAutofill === 'function') {
      this.props.onAutofill('FileFilename', json.Filename);
      this.props.onAutofill('FileHash', json.Hash);
      this.props.onAutofill('FileVariant', json.Variant);
    }
  }

  /**
   * Started the sending process for a file
   *
   * @param {object} file
   * @param {object} xhr
   */
  handleSending(file, xhr) {
    this.props.actions.previewField.updateFile(this.props.id, { xhr });
  }

  /**
   * Upload progress has changed, set changes to reflect it
   *
   * @param {object} file
   * @param {object} progress
   */
  handleUploadProgress(file, progress) {
    this.props.actions.previewField.updateFile(this.props.id, { progress });
  }

  /**
   * Renders the image markup as normal by LiteralField
   *
   * @returns {XML}
   */
  renderImage() {
    const data = this.props.data;

    if (!data.exists && !this.props.upload.url) {
      return (
        <div className="editor__file-preview-message--file-missing">
          {i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found')}
        </div>
      );
    }

    const category = this.props.upload.category;
    const preview = (category && category !== 'image')
      ? CONSTANTS.DEFAULT_PREVIEW
      : this.props.upload.url || data.preview || data.url;
    const image = <img src={preview} className="editor__thumbnail" />;
    const linkedImage = (data.url) ? (
      <a className="editor__file-preview-link" href={data.url} target="_blank">
        {image}
      </a>
    ) : null;
    const progress = this.props.upload.progress;
    const progressBar = (progress > 0 && progress < 100) ? (
      <div className="preview__progress">
        <div className="preview__progress-bar" style={{ width: `${progress}%` }} />
      </div>
    ) : null;
    const message = this.props.upload.message;
    const messageBox = (message) ? (
      <div className={`preview__message preview__message--${message.type}`}>
        {message.value}
      </div>
    ) : null;

    return (
      <div className="editor__thumbnail-container">
        {linkedImage || image}
        {progressBar}
        {messageBox}
      </div>
    );
  }

  renderToolbar() {
    const canEdit = this.canEdit();
    if (!this.props.data.url && !canEdit) {
      return null;
    }
    return (
      <div className="preview__toolbar fill-height">
        { (this.props.data.url) ? (
            <a
              href={this.props.data.url}
              target="_blank"
              className="preview__toolbar-button--link preview__toolbar-button"
            >Open</a>
          )
          : null }
        { (canEdit) ? (
            <button
              id="preview-replace-button"
              onClick={this.preventDefault}
              className="preview__toolbar-button--replace preview__toolbar-button"
            >Replace</button>
          )
          : null }
        { (this.props.upload.progress || this.props.upload.message) ? (
            <button
              onClick={this.handleCancelUpload}
              className="preview__toolbar-button--remove preview__toolbar-button"
            >Remove</button>
          ) : null }
      </div>
    );
  }

  render() {
    const dropzoneProps = this.getDropzoneProps();

    if (this.canEdit()) {
      return (
        <AssetDropzone {...dropzoneProps}>
          {this.renderImage()}
          {this.renderToolbar()}
        </AssetDropzone>
      );
    }
    const classNames = [
      'preview__container',
      this.props.className,
      this.props.extraClass,
    ];

    return (
      <div className={classNames.join(' ')}>
        {this.renderImage()}
        {this.renderToolbar()}
      </div>
    );
  }
}

PreviewImageField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  extraClass: PropTypes.string,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  onAutofill: PropTypes.func,
  data: PropTypes.shape({
    parentid: PropTypes.number,
    url: PropTypes.string,
    exists: PropTypes.bool,
    preview: PropTypes.string,
    category: PropTypes.string,
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
  }),
  actions: PropTypes.object,
  securityID: PropTypes.string,
  confirm: PropTypes.func,
};

PreviewImageField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
  data: {},
  upload: {},
  confirm: window.confirm,
};

function mapStateToProps(state, ownprops) {
  const securityID = state.config.SecurityID;
  const id = ownprops.id;
  const upload = state.assetAdmin.previewField[id] || {};

  return {
    securityID,
    upload,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      previewField: bindActionCreators(previewFieldActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewImageField);
