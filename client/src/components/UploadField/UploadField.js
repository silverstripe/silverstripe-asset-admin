import i18n from 'i18n';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { inject } from 'lib/Injector';
import CONSTANTS from 'constants/index';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import fileShape from 'lib/fileShape';
import getStatusCodeMessage from 'lib/getStatusCodeMessage';
import * as uploadFieldActions from 'state/uploadField/UploadFieldActions';
import * as modalActions from 'state/modal/ModalActions';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';

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

const UploadField = (_props) => {
  const defaultProps = {
    value: { Files: [] },
    className: '',
    getItemProps: itemProps => itemProps,
  };
  const props = {
    ...defaultProps,
    ..._props,
  };
  const [selecting, setSelecting] = useState(false);
  const [selectingItem, setSelectingItem] = useState(null);
  // Persist the previous props to simulate the `prevProps` argument of componentDidUpdate
  const prevPropsRef = useRef(null);

  useEffect(() => {
    const { id, formSchemaFilesHash, data, value, actions, files } = props;

    // This tracks changes to the underlying schema data for this field. It may be desirable in
    // future to remove this and instead reset redux state whenever a "legacy" form triggers a
    // PJAX load. See https://github.com/silverstripe/silverstripe-asset-admin/issues/960
    const newFormSchemaFilesHash = md5(JSON.stringify(value.Files)).toString();

    // If this is the first time this field has mounted, or the schema data has changed (typically
    // caused by a PJAX load from saving a legacy non-react form), load the list of files from the
    // schema data (data.files)
    if (formSchemaFilesHash !== newFormSchemaFilesHash) {
      actions.uploadField.setFormSchemaFilesHash(id, newFormSchemaFilesHash);
      actions.uploadField.setFiles(id, data.files);
      return;
    }

    // Otherwise, we're safe to load from redux state
    actions.uploadField.setFiles(id, files);
  }, []);

  useEffect(() => {
    const prevProps = prevPropsRef.current;
    prevPropsRef.current = props;
    // Only runs on updates, not on the initial mount
    if (prevProps === null) {
      return;
    }
    const {
      id,
      formSchemaFilesHash,
      data,
      files,
      value: { Files: value },
      actions: { uploadField: { setFormSchemaFilesHash, setFiles } }
    } = props;

    // Propegate redux state changes to redux-from value for this field
    const existingFiles = prevProps.files || [];
    const newFiles = files || [];
    const filesChanged = compareValues(existingFiles, newFiles);

    if (filesChanged) {
      // eslint-disable-next-line no-use-before-define
      handleChange(null, props);
    }

    const newFormSchemaFilesHash = md5(JSON.stringify(value.Files)).toString();

    // If the schema data has changed (typically caused by a PJAX load from saving a legacy
    // non-react form), load the list of files from the schema data (data.files)
    if (formSchemaFilesHash !== newFormSchemaFilesHash) {
      setFormSchemaFilesHash(id, newFormSchemaFilesHash);
      setFiles(id, data.files);
      return;
    }

    // If the value updates but there's no files entry for the value then we need to perform a "set
    // files" action... This can happen when the value (stored with redux-form) is updated
    const { value: { Files: prevValue } } = prevProps;

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
  });

  /**
   * Returns the max number of files allowed for uploading
   *
   * @return {?Number}
   */
  const getMaxFiles = () => {
    const maxFiles = props.data.multi ? props.data.maxFiles : 1;
    if (maxFiles === null || typeof maxFiles === 'undefined') {
      return null;
    }

    const filesCount = props.files.filter(file =>
      file.id > 0
      && (!file.message || file.message.type !== 'error')
    ).length;

    const allowed = Math.max(maxFiles - filesCount, 0);

    return allowed;
  };

  /**
   * Returns the max allowed filesize (if set)
   *
   * @return {?Number}
   */
  const getMaxFilesize = () => props.data.maxFilesize || null;

  /**
   * Find the ID of the folder to start in.
   * @return {Number}
   */
  const getFolderId = () => {
    if (selectingItem && typeof selectingItem === 'object') {
      // If we are viewing a specific file, return that file's parent folder.
      return selectingItem.parent.id;
    }

    // Otherwise return the default upload folder for the UploadField.
    return props.data.parentid || 0;
  };

  const handleAddedFile = (data) => {
    const file = { ...data, uploaded: true };
    props.actions.uploadField.addFile(props.id, file);
  };

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  const handleSending = (file, xhr) => {
    props.actions.uploadField.updateQueuedFile(props.id, file._queuedId, { xhr });
  };

  /**
   * Update upload progress status.
   *
   * @param {Object} file
   * @param {Number} progress
   */
  const handleUploadProgress = (file, progress) => {
    props.actions.uploadField.updateQueuedFile(props.id, file._queuedId, { progress });
  };

  /**
   * Handles successful file uploads.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  const handleSuccessfulUpload = (file) => {
    const json = JSON.parse(file.xhr.response);

    // SilverStripe send back a success code with an error message sometimes...
    if (typeof json[0].error !== 'undefined') {
      // eslint-disable-next-line no-use-before-define
      handleFailedUpload(file);
      return;
    }

    props.actions.uploadField.succeedUpload(props.id, file._queuedId, json[0]);
  };

  const handleFailedUpload = (file, response) => {
    const statusCodeMessage = file.xhr && file.xhr.status
      ? getStatusCodeMessage(file.xhr.status, file.xhr)
      : '';
    props.actions.uploadField.failUpload(
      props.id,
      file._queuedId,
      response,
      statusCodeMessage
    );
  };

  /**
   * Handler for removing an uploaded item
   *
   * @param {Object} event
   * @param {Object} item
   */
  const handleItemRemove = (event, item) => {
    props.actions.uploadField.removeFile(props.id, item);
  };

  /**
   * Handler for clicking on the uploaded item
   *
   * @param {Object} event
   * @param {Object} item
   */
  const handleReplaceShow = (event, item) => {
    props.actions.modal.initFormStack('select', 'admin');
    setSelecting(true);
    setSelectingItem(item);
  };

  /**
   * Event called when selected value is updated
   *
   * @param {Event} event
   * @param {Object} changeProps - new props to get files from
   */
  const handleChange = (event, changeProps = props) => {
    if (typeof changeProps.onChange === 'function') {
      // Write back list of files to value
      const fileIds = changeProps.files
        .filter((file) => file.id)
        .map((file) => file.id);
      const newValue = { Files: fileIds };
      changeProps.onChange(event, { id: changeProps.id, value: newValue });
    }
  };

  /**
   * Handler for 'upload' dialog.
   *
   * @param {Object} event - Click event
   */
  const handleUploadButton = (event) => {
    event.preventDefault();
  };

  /**
   * Open new 'add from files' dialog
   *
   * @param {Object} event - Click event
   */
  const handleAddShow = (event) => {
    event.preventDefault();
    props.actions.modal.initFormStack('select', 'admin');
    setSelecting(true);
    setSelectingItem(null);
  };

  /**
   * Close 'add from files' dialog
   */
  const handleHide = () => {
    props.actions.modal.reset();
    setSelecting(false);
    setSelectingItem(null);
  };

  /**
   * Handle file being added by 'add from files' dialog
   *
   * @param {Event} event
   * @param {Object} data - Submitted insert form data
   * @param {Object} file - file record
   */
  const handleAddInsert = (event, data, file) => {
    props.actions.uploadField.addFile(props.id, file);
    handleHide();

    return Promise.resolve({});
  };

  /**
   * Handle many files being inserted
   *
   * @param {Event} event
   * @param {Array} files
   */
  const handleInsertMany = (event, files) => {
    if (selectingItem) {
      // eslint-disable-next-line no-use-before-define
      handleReplace(event, null, files[0]);
      return;
    }
    files.forEach(file => {
      handleAddInsert(event, null, file);
    });
  };

  /**
   * Handle file being replaced from the modal
   *
   * @param {Event} event
   * @param {Object} data
   * @param {Object} file
   */
  const handleReplace = (event, data, file) => {
    const {
      id,
      actions: {
        uploadField: {
          addFile,
          removeFile,
        },
      },
    } = props;

    if (!selectingItem) {
      throw new Error('Tried to replace a file when none was selected.');
    }
    removeFile(id, selectingItem);
    addFile(id, file);
    handleHide();

    return Promise.resolve({});
  };

  /**
   * Check if this field can be modified
   *
   * @return {Boolean}
   */
  const canEdit = () => !props.disabled
    && !props.readOnly
    && (props.data.canUpload || props.data.canAttach);

  /**
   * Check if this field can upload files
   *
   * @return {Boolean}
   */
  const canUpload = () => canEdit() && props.data.canUpload;

  /**
   * Check if this field can select files
   *
   * @return {Boolean}
   */
  const canAttach = () => canEdit() && props.data.canAttach;

  /**
   * Render "drop file here" area
   *
   * @returns {object}
   */
  const renderDropzone = () => {
    const { AssetDropzone } = props;
    if (!props.data.endpoints.createFile) {
      return null;
    }
    const dimensions = {
      height: CONSTANTS.SMALL_THUMBNAIL_HEIGHT,
      width: CONSTANTS.SMALL_THUMBNAIL_WIDTH,
    };
    const maxFiles = getMaxFiles();
    const maxFilesize = getMaxFilesize();

    const dropzoneOptions = {
      url: props.data.endpoints.createFile.url,
      method: props.data.endpoints.createFile.method,
      paramName: 'Upload',
      parallelUploads: props.data.maxParallelUploads,
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
    if (!canEdit()) {
      if (props.files.length) {
        return null;
      }
      return (
        <p>{i18n._t('AssetAdmin.EMPTY', 'No files')}</p>
      );
    }

    const securityID = props.securityId;
    const options = [];
    if (canUpload()) {
      options.push(
        <button
          key="uploadbutton"
          type="button"
          onClick={handleUploadButton}
          className="uploadfield__upload-button"
        >
          {i18n._t('AssetAdmin.UPLOADFIELD_UPLOAD_NEW', 'Upload new')}
        </button>
      );
    }
    if (canAttach()) {
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
          onClick={handleAddShow}
          className="uploadfield__add-button"
        >
          {i18n._t('AssetAdmin.UPLOADFIELD_CHOOSE_EXISTING', 'Choose existing')}
        </button>
      );
    }

    return (
      <AssetDropzone
        name={props.name}
        canUpload={canUpload()}
        uploadButton={false}
        uploadSelector=".uploadfield__upload-button, .uploadfield__backdrop"
        folderId={props.data.parentid}
        onAddedFile={handleAddedFile}
        onError={handleFailedUpload}
        onSuccess={handleSuccessfulUpload}
        onSending={handleSending}
        onUploadProgress={handleUploadProgress}
        preview={dimensions}
        options={dropzoneOptions}
        securityID={securityID}
        className={classNames.join(' ')}
      >
        <div className="uploadfield__backdrop" />
        <span className="uploadfield__droptext">
          <span className="uploadfield__dropicon font-icon-picture" aria-hidden="true"/>
          {options}
        </span>
      </AssetDropzone>
    );
  };

  const renderModal = () => {
    const { InsertMediaModal } = props;
    const maxFiles = getMaxFiles();
    const folderId = getFolderId();

    return (
      <InsertMediaModal
        title={false}
        isOpen={selecting}
        onInsert={selectingItem ? handleReplace : handleAddInsert}
        onClosed={handleHide}
        onInsertMany={handleInsertMany}
        maxFiles={selectingItem ? 1 : maxFiles}
        type="select"
        bodyClassName="modal__dialog"
        className="insert-media-react__dialog-wrapper"
        fileAttributes={selectingItem ? { ID: selectingItem.id } : null}
        folderId={folderId}
      />
    );
  };

  /**
   *
   * @param {object} item
   * @param {number} index
   * @returns {object}
   */
  const renderChild = (item, index) => {
    const { UploadFieldItem } = props;
    const draftProps = {
      // otherwise only one error file is shown and the rest are hidden due to having the same `key`
      key: item.id ? `file-${item.id}` : `queued-${item.queuedId}`,
      item,
      name: props.name,
      onRemove: handleItemRemove,
      canEdit: canEdit(),
      onView: handleReplaceShow,
    };
    const itemProps = props.getItemProps(draftProps, index, props);

    return <UploadFieldItem {...itemProps} />;
  };

  return (
    <div className="uploadfield">
      {renderDropzone()}
      {props.files.map(renderChild)}
      {renderModal()}
    </div>
  );
};

UploadField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.shape({ // PHP / posted value
    Files: PropTypes.arrayOf(PropTypes.number),
  }),
  files: PropTypes.arrayOf(fileShape), // Authoritative redux state
  formSchemaFilesHash: PropTypes.string, // Hash of initial schema data, see componentDidMount()
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  data: PropTypes.shape({
    files: PropTypes.arrayOf(fileShape),
    multi: PropTypes.bool,
    parentid: PropTypes.number,
    canUpload: PropTypes.bool,
    canAttach: PropTypes.bool,
    maxFiles: PropTypes.number,
    endpoints: PropTypes.object,
  }),
  UploadFieldItem: PropTypes.elementType,
  AssetDropzone: PropTypes.elementType,
  InsertMediaModal: PropTypes.elementType,
  getItemProps: PropTypes.func,
};

function mapStateToProps(state, ownprops) {
  const id = ownprops.id;
  let files = [];
  let formSchemaFilesHash = null;
  if (state.assetAdmin
    && state.assetAdmin.uploadField
    && state.assetAdmin.uploadField.fields
    && state.assetAdmin.uploadField.fields[id]
  ) {
    files = state.assetAdmin.uploadField.fields[id].files || [];
    formSchemaFilesHash = state.assetAdmin.uploadField.fields[id].formSchemaFilesHash || null;
  }
  const securityId = state.config.SecurityID;
  return { files, securityId, formSchemaFilesHash };
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
