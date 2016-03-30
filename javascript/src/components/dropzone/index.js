import React from 'react';
import ReactDOM from 'react-dom';
import SilverStripeComponent from 'silverstripe-component';
import i18n from 'i18n';
import Dropzone from 'dropzone';
import $ from 'jQuery';
import CONSTANTS from 'constants';

class DropzoneComponent extends SilverStripeComponent {

    constructor(props) {
        super(props);

        this.dropzone = null;
        this.dragging = false;
    }

    componentDidMount() {
        super.componentDidMount();

        var defaultOptions = this.getDefaultOptions();

        if (this.props.uploadButton === true) {
            defaultOptions.clickable = $(ReactDOM.findDOMNode(this)).find('.dropzone-component__upload-button')[0];
        }

        this.dropzone = new Dropzone(ReactDOM.findDOMNode(this), Object.assign({}, defaultOptions, this.props.options));

        // Set the user warning displayed when a user attempts to remove a file.
        // If the props hasn't been passed there will be no warning when removing files.
        if (typeof this.props.promptOnRemove !== 'undefined') {
            this.setPromptOnRemove(this.props.promptOnRemove);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        // Remove all dropzone event listeners.
        this.dropzone.disable();
    }

    render() {
        var className = ['dropzone-component'];

        if (this.dragging === true) {
            className.push('dragging');
        }

        return (
            <div className={className.join(' ')}>
                {this.props.uploadButton &&
                    <button className='dropzone-component__upload-button [ ss-ui-button font-icon-upload ]' type='button'>{i18n._t("AssetGalleryField.DROPZONE_UPLOAD")}</button>
                }
                {this.props.children}
            </div>
        );
    }

    /**
     * Gets the default optiions to instanciate dropzone with.
     *
     * @return object
     */
    getDefaultOptions() {
        return {
            // We handle the queue processing ourself in the FileReader callback. See `this.handleAddedFile`
            autoProcessQueue: false,

            // By default Dropzone adds markup to the DOM for displaying a thumbnail preview.
            // Here we're relpacing that default behaviour with our own React / Redux implementation.
            addedfile: this.handleAddedFile.bind(this),

            // When the user drags a file into the dropzone.
            dragenter: this.handleDragEnter.bind(this),

            // When the user's cursor leaves the dropzone while dragging a file.
            dragleave: this.handleDragLeave.bind(this),

            // When the user drops a file onto the dropzone.
            drop: this.handleDrop.bind(this),

            // Whenever the file upload progress changes
            uploadprogress: this.handleUploadProgress.bind(this),

            // The text used before any files are dropped
            dictDefaultMessage: i18n._t('AssetGalleryField.DROPZONE_DEFAULT_MESSAGE'),

            // The text that replaces the default message text it the browser is not supported
            dictFallbackMessage: i18n._t('AssetGalleryField.DROPZONE_FALLBACK_MESSAGE'),

            // The text that will be added before the fallback form
            // If null, no text will be added at all.
            dictFallbackText: i18n._t('AssetGalleryField.DROPZONE_FALLBACK_TEXT'),

            // If the file doesn't match the file type.
            dictInvalidFileType: i18n._t('AssetGalleryField.DROPZONE_INVALID_FILE_TYPE'),

            // If the server response was invalid.
            dictResponseError: i18n._t('AssetGalleryField.DROPZONE_RESPONSE_ERROR'),

            // If used, the text to be used for the cancel upload link.
            dictCancelUpload: i18n._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD'),

            // If used, the text to be used for confirmation when cancelling upload.
            dictCancelUploadConfirmation: i18n._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD_CONFIRMATION'),

            // If used, the text to be used to remove a file.
            dictRemoveFile: i18n._t('AssetGalleryField.DROPZONE_REMOVE_FILE'),

            // Displayed when the maxFiles have been exceeded
            // You can use {{maxFiles}} here, which will be replaced by the option.
            dictMaxFilesExceeded: i18n._t('AssetGalleryField.DROPZONE_MAX_FILES_EXCEEDED'),

            // When a file upload fails.
            error: this.handleError.bind(this),

            // When file file is sent to the server.
            sending: this.handleSending.bind(this),

            // When a file upload succeeds.
            success: this.handleSuccess.bind(this),

            thumbnailHeight: 150,

            thumbnailWidth: 200
        };
    }

    /**
     * Gets a file's category based on its type.
     *
     * @param string fileType - For example 'image/jpg'.
     *
     * @return string
     */
    getFileCategory(fileType) {
        return fileType.split('/')[0];
    }

    /**
     * Event handler triggered when the user drags a file into the dropzone.
     *
     * @param object event
     */
    handleDragEnter(event) {
        this.dragging = true;
        this.forceUpdate();

        if (typeof this.props.handleDragEnter === 'function') {
            this.props.handleDragEnter(event);
        }
    }

    /**
     * Event handler triggered when a user's curser leaves the dropzone while dragging a file.
     *
     * @param object event
     */
    handleDragLeave(event) {
        const componentNode = ReactDOM.findDOMNode(this);

        // Event propagation (events bubbling up from decendent elements) means the `dragLeave`
        // event gets triggered on the dropzone. Here we're ignoring events that don't originate from the dropzone node.
        if (event.target !== componentNode) {
            return;
        }

        this.dragging = false;
        this.forceUpdate();

        if (typeof this.props.handleDragLeave === 'function') {
            this.props.handleDragLeave(event, componentNode);
        }
    }

    /**
     * Event handler when a file's upload progress changes.
     *
     * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
     * @param integer progress - the upload progress percentage
     * @param integer bytesSent - total bytesSent
     */
    handleUploadProgress(file, progress, bytesSent) {
        if (typeof this.props.handleUploadProgress === 'function') {
            this.props.handleUploadProgress(file, progress, bytesSent);
        }
    }

    /**
     * Event handler triggered when the user drops a file on the dropzone.
     *
     * @param object event
     */
    handleDrop(event) {
        this.dragging = false;
        this.forceUpdate();

        if (typeof this.props.handleDrop === 'function') {
            this.props.handleDrop(event);
        }
    }

    /**
     * Called just before the file is sent. Gets the `xhr` object as second parameter,
     * so you can modify it (for example to add a CSRF token) and a `formData` object to add additional information.
     *
     * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
     * @param object xhr
     * @param object formData - FormData interface. See https://developer.mozilla.org/en-US/docs/Web/API/FormData
     */
    handleSending(file, xhr, formData) {
        formData.append('SecurityID', this.props.securityID);
        formData.append('folderID', this.props.folderID);

        if (typeof this.props.handleSending === 'function') {
            this.props.handleSending(file, xhr, formData);
        }
    }

    /**
     * Event handler for files being added. Called before the request is made to the server.
     *
     * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
     */
    handleAddedFile(file) {
        var reader = new FileReader();

        // The queuedAtTime is used to uniquely identify file while it's in the queue.
        const queuedAtTime = Date.now();

        reader.onload = function (event) {
            // If the user uploads multiple large images, we could run into memory issues
            // by simply using the `event.target.result` data URI as the thumbnail image.
            //
            // To get avoid this we're creating a canvas, using the dropzone thumbnail dimensions,
            // and using the canvas data URI as the thumbnail image instead.

            var thumbnailURL = '';

            if (this.getFileCategory(file.type) === 'image') {
                let img = document.createElement('img'),
                    canvas = document.createElement('canvas'),
                    ctx = canvas.getContext('2d');

                    img.src = event.target.result;

                    canvas.width = this.dropzone.options.thumbnailWidth;
                    canvas.height = this.dropzone.options.thumbnailHeight;

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    thumbnailURL = canvas.toDataURL();
            }

            this.props.handleAddedFile({
                attributes: {
                    dimensions: {
                        height: this.dropzone.options.thumbnailHeight,
                        width: this.dropzone.options.thumbnailWidth
                    }
                },
                category: this.getFileCategory(file.type),
                filename: file.name,
                queuedAtTime: queuedAtTime,
                size: file.size,
                title: file.name,
                type: file.type,
                url: thumbnailURL
            });

            this.dropzone.processFile(file);
        }.bind(this);

        file._queuedAtTime = queuedAtTime;

        reader.readAsDataURL(file);
    }

    /**
     * Event handler for failed uploads.
     *
     * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
     * @param string errorMessage
     */
    handleError(file, errorMessage) {
        if (typeof this.props.handleSending === 'function') {
            this.props.handleError(file, errorMessage);
        }
    }

    /**
     * Event handler for successfully upload files.
     *
     * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
     */
    handleSuccess(file) {
        this.props.handleSuccess(file);
    }

    /**
     * Set the text displayed when a user tries to remove a file.
     *
     * @param string userPrompt - The message to display.
     */
    setPromptOnRemove(userPrompt) {
        this.dropzone.options.dictRemoveFileConfirmation = userPrompt;
    }

}

DropzoneComponent.propTypes = {
    folderID: React.PropTypes.number.isRequired,
    handleAddedFile: React.PropTypes.func.isRequired,
    handleDragEnter: React.PropTypes.func,
    handleDragLeave: React.PropTypes.func,
    handleDrop: React.PropTypes.func,
    handleError: React.PropTypes.func.isRequired,
    handleSending: React.PropTypes.func,
    handleSuccess: React.PropTypes.func.isRequired,
    options: React.PropTypes.shape({
        url: React.PropTypes.string.isRequired
    }),
    promptOnRemove: React.PropTypes.string,
    securityID: React.PropTypes.string.isRequired,
    uploadButton: React.PropTypes.bool
};

DropzoneComponent.defaultProps = {
    uploadButton: true
};

export default DropzoneComponent;
