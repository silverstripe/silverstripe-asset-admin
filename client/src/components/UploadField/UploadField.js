import i18n from 'i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { inject } from 'lib/Injector';
import CONSTANTS from 'constants/index';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import fileShape from 'lib/fileShape';
import * as uploadFieldActions from 'state/uploadField/UploadFieldActions';
import * as modalActions from 'state/modal/ModalActions';
import PropTypes from 'prop-types';

/**
 * Check if two arrays of file objects have different id keys
 *
 * @param {Array} left
 * @param {Array} right
 */
function compareValues(left, right) {
  // Check length
  if (left.length !== right.length) {
    return true;
  }
  // Check ids appear in the same order
  for (let i = 0; i < left.length; i++) {
    if (left[i].id !== right[i].id) {
      return true;
    }
  }
  return false;
}

class UploadField extends Component {
  constructor(props) {
    super(props);
    this.getMaxFiles = this.getMaxFiles.bind(this);
    this.getFolderId = this.getFolderId.bind(this);
    this.renderChild = this.renderChild.bind(this);
    this.handleAddShow = this.handleAddShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleAddInsert = this.handleAddInsert.bind(this);
    this.handleInsertMany = this.handleInsertMany.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleReplaceShow = this.handleReplaceShow.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleReplace = this.handleReplace.bind(this);
    this.canEdit = this.canEdit.bind(this);
    this.canAttach = this.canAttach.bind(this);
    this.canUpload = this.canUpload.bind(this);

    this.state = {
      selecting: false,
      selectingItem: null,
    };
  }

  componentDidMount() {
    // Copy form schema data into redux and then ignore it
    const { id, data, actions, value, files } = this.props;

    // If the data within the "files" prop already matches the value then we don't need to copy
    // schema data into redux
    if (
      value && value.Files && files && value.Files.length === files.length
      && files.filter(file => !value.Files.includes(file.id)).length === 0
    ) {
      return;
    }

    actions.uploadField.setFiles(id, data.files);
  }

  componentWillReceiveProps(nextProps) {
    // Propegate redux state changes to redux-from value for this field
    const existingFiles = this.props.files || [];
    const newFiles = nextProps.files || [];
    const filesChanged = compareValues(existingFiles, newFiles);

    if (filesChanged) {
      this.handleChange(null, nextProps);
    }
  }

  componentDidUpdate(prevProps) {
    // If the value updates but there's no files entry for the value then we need to perform a "set
    // files" action... This can happen when the value (stored with redux-form) is updated
    const { value: { Files: prevValue } } = prevProps;
    const {
      id,
      data,
      files,
      value: { Files: value },
      actions: { uploadField: { setFiles } }
    } = this.props;

    if (
      // If the lengths match
      value.length === prevValue.length
      // AND there's no difference in the values
      && value.filter(item => !prevValue.includes(item)).length === 0
    ) {
      // Then nothing to do
      return;
    }

    // Now we need to check if the files array that we currently have suits the value
    const fileIds = files.map(file => file.id);

    // This is a similar condition to above, just check the files array rather than the previous
    // value
    if (
      fileIds.length === value.length
      && fileIds.filter(fileId => !value.includes(fileId)).length === 0
    ) {
      return;
    }

    // Run the redux action...
    setFiles(id, data.files);
  }

  /**
   * Returns the max number of files allowed for uploading
   *
   * @return {?Number}
   */
  getMaxFiles() {
    const maxFiles = this.props.data.multi ? this.props.data.maxFiles : 1;
    if (maxFiles === null || typeof maxFiles === 'undefined') {
      return null;
    }

    const filesCount = this.props.files.filter(file =>
      file.id > 0
      && (!file.message || file.message.type !== 'error')
    ).length;

    const allowed = Math.max(maxFiles - filesCount, 0);

    return allowed;
  }

  /**
   * Returns the max allowed filesize (if set)
   *
   * @return {?Number}
   */
  getMaxFilesize() {
    return this.props.data.maxFilesize || null;
  }

  /**
   * Find the ID of the folder to start in.
   * @return {Number}
   */
  getFolderId() {
    const { selectingItem } = this.state;

    if (selectingItem && typeof selectingItem === 'object') {
      // If we are viewing a specific file, return that file's parent folder.
      return selectingItem.parent.id;
    }

    // Otherwise return the default upload folder for the UploadField.
    return this.props.data.parentid || 0;
  }

  handleAddedFile(data) {
    const file = { ...data, uploaded: true };
    this.props.actions.uploadField.addFile(this.props.id, file);
  }

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  handleSending(file, xhr) {
    this.props.actions.uploadField.updateQueuedFile(this.props.id, file._queuedId, { xhr });
  }

  /**
   * Update upload progress status.
   *
   * @param {Object} file
   * @param {Number} progress
   */
  handleUploadProgress(file, progress) {
    this.props.actions.uploadField.updateQueuedFile(this.props.id, file._queuedId, { progress });
  }

  /**
   * Handles successful file uploads.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  handleSuccessfulUpload(file) {
    const json = JSON.parse(file.xhr.response);

    // SilverStripe send back a success code with an error message sometimes...
    if (typeof json[0].error !== 'undefined') {
      this.handleFailedUpload(file);
      return;
    }

    // @todo - Should successful uploads be moved to another state?
    this.props.actions.uploadField.succeedUpload(this.props.id, file._queuedId, json[0]);
  }

  handleFailedUpload(file, response) {
    this.props.actions.uploadField.failUpload(this.props.id, file._queuedId, response);
  }

  /**
   * Handler for removing an uploaded item
   *
   * @param {Object} event
   * @param {Object} item
   */
  handleItemRemove(event, item) {
    this.props.actions.uploadField.removeFile(this.props.id, item);
  }

  /**
   * Handler for clicking on the uploaded item
   *
   * @param {Object} event
   * @param {Object} selectingItem
   */
  handleReplaceShow(event, selectingItem) {
    this.props.actions.modal.initFormStack('select', 'admin');
    this.setState({
      selecting: true,
      selectingItem,
    });
  }

  /**
   * Event called when selected value is updated
   *
   * @param {Event} event
   * @param {Object} props - new props to get files from
   */
  handleChange(event, props = this.props) {
    if (typeof props.onChange === 'function') {
      // Write back list of files to value
      const fileIds = props.files
        .filter((file) => file.id)
        .map((file) => file.id);
      const newValue = { Files: fileIds };
      props.onChange(event, { id: props.id, value: newValue });
    }
  }

  /**
   * Handler for 'upload' dialog.
   *
   * @param {Object} event - Click event
   */
  handleUploadButton(event) {
    event.preventDefault();
  }

  /**
   * Open new 'add from files' dialog
   *
   * @param {Object} event - Click event
   */
  handleAddShow(event) {
    event.preventDefault();
    this.props.actions.modal.initFormStack('select', 'admin');
    this.setState({
      selecting: true,
      selectingItem: null,
    });
  }

  /**
   * Close 'add from files' dialog
   */
  handleHide() {
    this.props.actions.modal.reset();
    this.setState({
      selecting: false,
      selectingItem: null,
    });
  }

  /**
   * Handle file being added by 'add from files' dialog
   *
   * @param {Event} event
   * @param {Object} data - Submitted insert form data
   * @param {Object} file - file record
   */
  handleAddInsert(event, data, file) {
    this.props.actions.uploadField.addFile(this.props.id, file);
    this.handleHide();

    return Promise.resolve({});
  }

  /**
   * Handle many files being inserted
   *
   * @param {Event} event
   * @param {Array} files
   */
  handleInsertMany(event, files) {
    const { selectingItem } = this.state;
    if (selectingItem) {
      this.handleReplace(event, null, files[0]);
      return;
    }
    files.forEach(file => {
      this.handleAddInsert(event, null, file);
    });
  }

  /**
   * Handle file being replaced from the modal
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Object} file
   */
  handleReplace(event, data, file) {
    const { selectingItem } = this.state;
    const {
      id,
      actions: {
        uploadField: {
          addFile,
          removeFile,
        },
      },
    } = this.props;

    if (!selectingItem) {
      throw new Error('Tried to replace a file when none was selected.');
    }
    removeFile(id, selectingItem);
    addFile(id, file);
    this.handleHide();

    return Promise.resolve({});
  }

  /**
   * Check if this field can be modified
   *
   * @return {Boolean}
   */
  canEdit() {
    return !this.props.disabled
      && !this.props.readOnly
      && (this.props.data.canUpload || this.props.data.canAttach);
  }

  /**
   * Check if this field can upload files
   *
   * @return {Boolean}
   */
  canUpload() {
    return this.canEdit() && this.props.data.canUpload;
  }

  /**
   * Check if this field can select files
   *
   * @return {Boolean}
   */
  canAttach() {
    return this.canEdit() && this.props.data.canAttach;
  }

  /**
   * Render "drop file here" area
   *
   * @returns {object}
   */
  renderDropzone() {
    const { AssetDropzone } = this.props;
    if (!this.props.data.createFileEndpoint) {
      return null;
    }
    const dimensions = {
      height: CONSTANTS.SMALL_THUMBNAIL_HEIGHT,
      width: CONSTANTS.SMALL_THUMBNAIL_WIDTH,
    };
    const maxFiles = this.getMaxFiles();
    const maxFilesize = this.getMaxFilesize();

    const dropzoneOptions = {
      url: this.props.data.createFileEndpoint.url,
      method: this.props.data.createFileEndpoint.method,
      paramName: 'Upload',
      maxFiles,
      maxFilesize,
      thumbnailWidth: CONSTANTS.SMALL_THUMBNAIL_WIDTH,
      thumbnailHeight: CONSTANTS.SMALL_THUMBNAIL_HEIGHT,
    };

    // If single upload and there is a file, don't render dropzone
    const classNames = ['uploadfield__dropzone'];
    if (maxFiles === 0) {
      // needs to be hidden instead of removed from the DOM for upload progress on the last item.
      classNames.push('uploadfield__dropzone--hidden');
    }

    // Handle readonly field
    if (!this.canEdit()) {
      if (this.props.files.length) {
        return null;
      }
      return (
        <p>{i18n._t('AssetAdmin.EMPTY', 'No files')}</p>
      );
    }

    const securityID = this.props.securityId;
    const options = [];
    if (this.canUpload()) {
      options.push(
        <button
          key="uploadbutton"
          type="button"
          onClick={this.handleUploadButton}
          className="uploadfield__upload-button"
        >
          {i18n._t('AssetAdmin.UPLOADFIELD_UPLOAD_NEW', 'Upload new')}
        </button>
      );
    }
    if (this.canAttach()) {
      if (options.length) {
        options.push(
          <span key="uploadjoin" className="uploadfield__join">
            {i18n._t('AssetAdmin.OR', 'or')}
          </span>
        );
      }
      options.push(
        <button
          key="attachbutton"
          type="button"
          onClick={this.handleAddShow}
          className="uploadfield__add-button"
        >
          {i18n._t('AssetAdmin.UPLOADFIELD_CHOOSE_EXISTING', 'Choose existing')}
        </button>
      );
    }

    return (
      <AssetDropzone
        name={this.props.name}
        canUpload={this.canUpload()}
        uploadButton={false}
        uploadSelector=".uploadfield__upload-button, .uploadfield__backdrop"
        folderId={this.props.data.parentid}
        onAddedFile={this.handleAddedFile}
        onError={this.handleFailedUpload}
        onSuccess={this.handleSuccessfulUpload}
        onSending={this.handleSending}
        onUploadProgress={this.handleUploadProgress}
        preview={dimensions}
        options={dropzoneOptions}
        securityID={securityID}
        className={classNames.join(' ')}
      >
        <div className="uploadfield__backdrop" />
        <span className="uploadfield__droptext">{options}</span>
      </AssetDropzone>
    );
  }

  renderModal() {
    const { InsertMediaModal } = this.props;
    const { selecting, selectingItem } = this.state;
    const maxFiles = this.getMaxFiles();
    const folderId = this.getFolderId();

    return (
      <InsertMediaModal
        title={false}
        isOpen={selecting}
        onInsert={selectingItem ? this.handleReplace : this.handleAddInsert}
        onClosed={this.handleHide}
        onInsertMany={this.handleInsertMany}
        maxFiles={selectingItem ? 1 : maxFiles}
        type="select"
        bodyClassName="modal__dialog"
        className="insert-media-react__dialog-wrapper"
        fileAttributes={selectingItem ? { ID: selectingItem.id } : null}
        folderId={folderId}
      />
    );
  }

  /**
   *
   * @param {object} item
   * @param {number} index
   * @returns {object}
   */
  renderChild(item, index) {
    const { UploadFieldItem } = this.props;
    const draftProps = {
      // otherwise only one error file is shown and the rest are hidden due to having the same `key`
      key: item.id ? `file-${item.id}` : `queued-${item.queuedId}`,
      item,
      name: this.props.name,
      onRemove: this.handleItemRemove,
      canEdit: this.canEdit(),
      onView: this.handleReplaceShow,
    };
    const itemProps = this.props.getItemProps(draftProps, index, this.props);

    return <UploadFieldItem {...itemProps} />;
  }

  render() {
    return (
      <div className="uploadfield">
        {this.renderDropzone()}
        {this.props.files.map(this.renderChild)}
        {this.renderModal()}
      </div>
    );
  }
}

UploadField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.shape({ // PHP / posted value
    Files: PropTypes.arrayOf(PropTypes.number),
  }),
  files: PropTypes.arrayOf(fileShape), // Authoritative redux state
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  data: PropTypes.shape({
    files: PropTypes.arrayOf(fileShape),
    createFileEndpoint: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string.isRequired,
      payloadFormat: PropTypes.string.isRequired,
    }),
    multi: PropTypes.bool,
    parentid: PropTypes.number,
    canUpload: PropTypes.bool,
    canAttach: PropTypes.bool,
    maxFiles: PropTypes.number,
  }),
  UploadFieldItem: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  AssetDropzone: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  InsertMediaModal: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  getItemProps: PropTypes.func,
};

UploadField.defaultProps = {
  value: { Files: [] },
  className: '',
  getItemProps: props => props,
};

function mapStateToProps(state, ownprops) {
  const id = ownprops.id;
  let files = [];
  if (state.assetAdmin
    && state.assetAdmin.uploadField
    && state.assetAdmin.uploadField.fields
    && state.assetAdmin.uploadField.fields[id]
  ) {
    files = state.assetAdmin.uploadField.fields[id].files || [];
  }
  const securityId = state.config.SecurityID;
  return { files, securityId };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      uploadField: bindActionCreators(uploadFieldActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch)
    },
  };
}

const ConnectedUploadField = connect(mapStateToProps, mapDispatchToProps)(UploadField);

export { UploadField as Component, ConnectedUploadField };

export default compose(
  inject(['UploadFieldItem', 'AssetDropzone', 'InsertMediaModal']),
  fieldHolder,
)(ConnectedUploadField);
