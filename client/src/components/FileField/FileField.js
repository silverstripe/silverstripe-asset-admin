import i18n from 'i18n';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CONSTANTS from 'constants/index';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import FileFieldItem from 'components/FileField/FileFieldItem';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import fileShape from 'lib/fileShape';
import * as fileFieldActions from 'state/fileField/FileFieldActions';

class FileField extends SilverStripeComponent {

  constructor(props) {
    super(props);
    this.renderChild = this.renderChild.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Copy form schema data into redux and then ignore it
    this.props.actions.fileField.setFiles(this.props.id, this.props.data.files);
  }

  componentWillReceiveProps(nextProps) {
    // Propegate redux state changes to redux-from value for this field
    const existingFiles = this.props.files || [];
    const newFiles = nextProps.files || [];
    const filesChanged = this.compareValues(existingFiles, newFiles);

    if (filesChanged) {
      this.handleChange(nextProps);
    }
  }

  /**
   * Check if two arrays of file objects have different id keys
   *
   * @param {Array} left
   * @param {Array} right
     */
  compareValues(left, right) {
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

  handleAddedFile(data) {
    const file = Object.assign({}, data, { uploaded: true });
    this.props.actions.fileField.addFile(this.props.id, file);
  }

  /**
   * Triggered just before the xhr request is sent.
   *
   * @param {Object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {Object} xhr
   */
  handleSending(file, xhr) {
    this.props.actions.fileField.updateQueuedFile(this.props.id, file._queuedId, { xhr });
  }

  /**
   * Update upload progress status.
   *
   * @param {Object} file
   * @param {Number} progress
   */
  handleUploadProgress(file, progress) {
    this.props.actions.fileField.updateQueuedFile(this.props.id, file._queuedId, { progress });
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
    this.props.actions.fileField.succeedUpload(this.props.id, file._queuedId, json[0]);
  }

  handleFailedUpload(file, response) {
    this.props.actions.fileField.failUpload(this.props.id, file._queuedId, response);
  }

  handleItemRemove(event, item) {
    this.props.actions.fileField.removeFile(this.props.id, item);
  }

  /**
   * Event called when selected value is updated
   *
   * @param {Object} props - new props to get files from
   */
  handleChange(props) {
    if (typeof props.onChange === 'function') {
      // Write back list of files to value
      const fileIds = props.files
        .filter((file) => file.id)
        .map((file) => file.id);
      const newValue = { Files: fileIds };
      props.onChange(newValue);
    }
  }

  render() {
    return (
      <div className="file-field">
        {this.renderDropzone()}
        {this.props.files.map(this.renderChild)}
      </div>
    );
  }

  /**
   * Render "drop file here" area
   *
   * @todo i18n
   * @returns {XML}
   */
  renderDropzone() {
    // If single upload and there is a file, don't render dropzone
    if (this.props.files.length && !this.props.data.multi) {
      return null;
    }
    const dimensions = {
      height: CONSTANTS.SMALL_THUMBNAIL_HEIGHT,
      width: CONSTANTS.SMALL_THUMBNAIL_WIDTH,
    };
    const dropzoneOptions = {
      url: this.props.data.createFileEndpoint.url,
      method: this.props.data.createFileEndpoint.method,
      paramName: 'Upload',
      thumbnailWidth: CONSTANTS.SMALL_THUMBNAIL_WIDTH,
      thumbnailHeight: CONSTANTS.SMALL_THUMBNAIL_HEIGHT,
    };

    const securityID = this.props.securityId;

    // @todo add ` or <a>add from files</a>` once we implement file dialog
    return (
      <AssetDropzone
        canUpload
        uploadButton={false}
        uploadSelector=".file-field__dropzone-area"
        folderId={this.props.data.parentid}
        handleAddedFile={this.handleAddedFile}
        handleError={this.handleFailedUpload}
        handleSuccess={this.handleSuccessfulUpload}
        handleSending={this.handleSending}
        handleUploadProgress={this.handleUploadProgress}
        preview={dimensions}
        options={dropzoneOptions}
        securityID={securityID}
        className="file-field__dropzone"
      >
        <div className="file-field__dropzone-area">
          <span className="file-field__droptext">
            <a className="file-field__upload-button">{i18n._t('AssetAdminFileField.BROWSE', 'Browse')}</a>
          </span>
        </div>
      </AssetDropzone>
    );
  }

  /**
   *
   * @param {Object} item
   * @param {Object} extraProps
   * @returns {XML}
   */
  renderChild(item, index) {
    const itemProps = {
      key: index,
      item,
      name: this.props.name,
      handleRemove: this.handleItemRemove,
    };
    return <FileFieldItem {...itemProps} />;
  }
}

FileField.propTypes = {
  extraClass: React.PropTypes.string,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func,
  value: React.PropTypes.shape({ // PHP / posted value
    Files: React.PropTypes.arrayOf(React.PropTypes.number),
  }),
  files: React.PropTypes.arrayOf(fileShape), // Authoritative redux state
  readOnly: React.PropTypes.bool, // Not yet supported
  disabled: React.PropTypes.bool, // Not yet supported
  data: React.PropTypes.shape({
    createFileEndpoint: React.PropTypes.shape({
      url: React.PropTypes.string.isRequired,
      method: React.PropTypes.string.isRequired,
      payloadFormat: React.PropTypes.string.isRequired,
    }),
    multi: React.PropTypes.bool,
    parentid: React.PropTypes.number,
  }),
};

FileField.defaultProps = {
  value: { Files: [] },
  extraClass: '',
  className: '',
};

function mapStateToProps(state, ownprops) {
  const id = ownprops.id;
  let files = [];
  if (state.assetAdmin && state.assetAdmin.fileField && state.assetAdmin.fileField.fields) {
    files = state.assetAdmin.fileField.fields[id] || [];
  }
  const securityId = state.config.SecurityID;
  return { files, securityId };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      fileField: bindActionCreators(fileFieldActions, dispatch),
    },
  };
}

export { FileField };

export default fieldHolder(connect(mapStateToProps, mapDispatchToProps)(FileField));
