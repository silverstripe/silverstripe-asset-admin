import i18n from 'i18n';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CONSTANTS from 'constants/index';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import UploadFieldItem from 'components/UploadField/UploadFieldItem';
import AssetDropzone from 'components/AssetDropzone/AssetDropzone';
import InsertMediaModal from 'containers/InsertMediaModal/InsertMediaModal';
import fileShape from 'lib/fileShape';
import * as uploadFieldActions from 'state/uploadField/UploadFieldActions';

class UploadField extends SilverStripeComponent {

  constructor(props) {
    super(props);
    this.renderChild = this.renderChild.bind(this);
    this.handleAddShow = this.handleAddShow.bind(this);
    this.handleAddHide = this.handleAddHide.bind(this);
    this.handleAddInsert = this.handleAddInsert.bind(this);
    this.handleAddedFile = this.handleAddedFile.bind(this);
    this.handleSending = this.handleSending.bind(this);
    this.handleUploadProgress = this.handleUploadProgress.bind(this);
    this.handleFailedUpload = this.handleFailedUpload.bind(this);
    this.handleSuccessfulUpload = this.handleSuccessfulUpload.bind(this);
    this.handleItemRemove = this.handleItemRemove.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = { selecting: false };
  }

  componentDidMount() {
    // Copy form schema data into redux and then ignore it
    this.props.actions.uploadField.setFiles(this.props.id, this.props.data.files);
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

  handleItemRemove(event, item) {
    this.props.actions.uploadField.removeFile(this.props.id, item);
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

  /**
   * Handler for 'upload' dialog.
   *
   * @param {Object} event - Click event
   */
  handleSelect(event) {
    event.preventDefault();
    return false;
  }

  /**
   * Open new 'add from files' dialog
   *
   * @param {Object} event - Click event
   */
  handleAddShow(event) {
    event.preventDefault();
    this.setState({ selecting: true });
    return false;
  }

  /**
   * Close 'add from files' dialog
   */
  handleAddHide() {
    this.setState({ selecting: false });
  }

  /**
   * Handle file being added by 'add from files' dialog
   *
   * @param {Object} data - Submitted insert form data
   * @param {Object} file - file record
   */
  handleAddInsert(data, file) {
    this.props.actions.uploadField.addFile(this.props.id, file);
    this.handleAddHide();
  }

  render() {
    return (
      <div className="uploadfield">
        {this.renderDropzone()}
        {this.props.files.map(this.renderChild)}
        {this.renderDialog()}
      </div>
    );
  }

  /**
   * Render "drop file here" area
   *
   * @returns {XML}
   */
  renderDropzone() {
    if (!this.props.data.createFileEndpoint) {
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
    if (!this.props.data.multi) {
      dropzoneOptions.maxFiles = 1;
    }

    // If single upload and there is a file, don't render dropzone
    const classNames = ['uploadfield__dropzone'];
    if (this.props.files.length && !this.props.data.multi) {
      classNames.push('uploadfield__dropzone--hidden');
    }

    const securityID = this.props.securityId;

    // @todo add ` or <a>add from files</a>` once we implement file dialog
    return (
      <AssetDropzone
        canUpload
        uploadButton={false}
        uploadSelector=".uploadfield__upload-button, .uploadfield__backdrop"
        folderId={this.props.data.parentid}
        handleAddedFile={this.handleAddedFile}
        handleError={this.handleFailedUpload}
        handleSuccess={this.handleSuccessfulUpload}
        handleSending={this.handleSending}
        handleUploadProgress={this.handleUploadProgress}
        preview={dimensions}
        options={dropzoneOptions}
        securityID={securityID}
        className={classNames.join(' ')}
      >
        <div className="uploadfield__backdrop"></div>
        <span className="uploadfield__droptext">
          <button onClick={this.handleSelect} className="uploadfield__upload-button">
            {i18n._t('AssetAdminUploadField.BROWSE', 'Browse')}
          </button>
          {' '}
          {i18n._t('AssetAdminUploadField.OR', 'or')}
          {' '}
          <button onClick={this.handleAddShow} className="uploadfield__add-button">
            {i18n._t('AssetAdminUploadField.ADD_FILES', 'Add from files')}
          </button>
        </span>
      </AssetDropzone>
    );
  }

  renderDialog() {
    return (
      <InsertMediaModal
        title={false}
        show={this.state.selecting}
        onInsert={this.handleAddInsert}
        onHide={this.handleAddHide}
        bodyClassName="modal__dialog"
        className="insert-media-react__dialog-wrapper"
        type="select"
      />
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
    return <UploadFieldItem {...itemProps} />;
  }
}

UploadField.propTypes = {
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

UploadField.defaultProps = {
  value: { Files: [] },
  extraClass: '',
  className: '',
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
    },
  };
}

const ConnectedUploadField = connect(mapStateToProps, mapDispatchToProps)(UploadField);

export { UploadField, ConnectedUploadField };

export default fieldHolder(connect(mapStateToProps, mapDispatchToProps)(UploadField));
