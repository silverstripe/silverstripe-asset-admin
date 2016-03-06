import React from 'react';
import SilverStripeComponent from 'silverstripe-component';
import i18n from 'i18n';
import Dropzone from 'dropzone';

class DropzoneComponent extends SilverStripeComponent {

    constructor(props) {
        super(props);

        // By default Dropzone adds markup to the DOM for displaying a thumbnail preview.
        // Here we're relpacing that default behaviour with our own React / Redux implementation.
        Dropzone.prototype.defaultOptions.addedfile = this.handleAddedFile.bind(this);

        this.dropzone = null;
        this.translateDefaultMessages();
    }

    componentDidMount() {
        super.componentDidMount();

        this.dropzone = new Dropzone(React.findDOMNode(this), Object.assign({}, Dropzone.prototype.defaultOptions, this.props.options));

        if (typeof this.props.promptOnRemove !== 'undefined') {
            this.setPromptOnRemove(this.props.setPromptOnRemove);
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        // Remove all dropzone event listeners.
        this.dropzone.off();
    }

    render() {
        return (
            <button type='button'>Upload files</button>
        );
    }

    /**
     * Event handler for files being added. Called before the request is made to the server.
     *
     * @param object file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
     */
    handleAddedFile(file) {
        const reader = new FileReader();

        reader.onload = (event) => {
            this.props.handleAddedFile(Object.assign({}, file, {
                _thumbnail: event.target.result
            }));
        };

        reader.readAsDataURL(file);
    }

    /**
     * Set the text displayed when a user tries to remove a file.
     *
     * @param string userPrompt - The message to display.
     */
    setPromptOnRemove(userPrompt) {
        this.dropzone.options.dictRemoveFileConfirmation = userPrompt;
    }

    /**
     * Translates the various messages displayed by Dropzone.
     */
    translateDefaultMessages() {
        // The text used before any files are dropped
        Dropzone.prototype.defaultOptions.dictDefaultMessage = i18n._t('AssetGalleryField.DROPZONE_DEFAULT_MESSAGE');

        // The text that replaces the default message text it the browser is not supported
        Dropzone.prototype.defaultOptions.dictFallbackMessage = i18n._t('AssetGalleryField.DROPZONE_FALLBACK_MESSAGE');

        // The text that will be added before the fallback form
        // If null, no text will be added at all.
        Dropzone.prototype.defaultOptions.dictFallbackText = i18n._t('AssetGalleryField.DROPZONE_FALLBACK_TEXT');

        // If the filesize is too big.
        Dropzone.prototype.defaultOptions.dictFileTooBig = i18n.sprintf(i18n._t('AssetGalleryField.DROPZONE_FILE_TOO_BIG'), Dropzone.prototype.defaultOptions.maxFilesize);

        // If the file doesn't match the file type.
        Dropzone.prototype.defaultOptions.dictInvalidFileType = i18n._t('AssetGalleryField.DROPZONE_INVALID_FILE_TYPE');

        // If the server response was invalid.
        Dropzone.prototype.defaultOptions.dictResponseError = i18n._t('AssetGalleryField.DROPZONE_RESPONSE_ERROR');

        // If used, the text to be used for the cancel upload link.
        Dropzone.prototype.defaultOptions.dictCancelUpload = i18n._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD');

        // If used, the text to be used for confirmation when cancelling upload.
        Dropzone.prototype.defaultOptions.dictCancelUploadConfirmation = i18n._t('AssetGalleryField.DROPZONE_CANCEL_UPLOAD_CONFIRMATION');

        // If used, the text to be used to remove a file.
        Dropzone.prototype.defaultOptions.dictRemoveFile = i18n._t('AssetGalleryField.DROPZONE_REMOVE_FILE');

        // Displayed when the maxFiles have been exceeded
        // You can use {{maxFiles}} here, which will be replaced by the option.
        Dropzone.prototype.defaultOptions.dictMaxFilesExceeded = i18n._t('AssetGalleryField.DROPZONE_MAX_FILES_EXCEEDED');
    }

}

DropzoneComponent.propTypes = {
    handleAddedFile: React.PropTypes.func, 
    options: React.PropTypes.object,
    promptOnRemove: React.PropTypes.string
};

export default DropzoneComponent;
