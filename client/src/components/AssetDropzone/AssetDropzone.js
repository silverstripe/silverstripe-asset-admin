/* global FileReader, Image, document, FormData */
/* eslint-disable no-use-before-define */
import React, { useEffect, useRef, useState } from 'react';
import i18n from 'i18n';
import DropzoneLib from '@deltablot/dropzone';
import $ from 'jquery';
import { getFileExtension } from 'lib/DataFormat';
import PropTypes from 'prop-types';

let idCounter = 0;

const AssetDropzone = (_props) => {
  const defaultProps = {
    uploadButton: true,
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  const dropzone = useRef(null);
  const dropzoneRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const prevOptions = useRef(props.options);

  // Persist the latest props to simulate class component `this.props` behavior
  // and prevent stale closures in the handlers passed to dropzone
  const propsRef = useRef(props);
  // Update current props on each render before running any effects or callbacks
  propsRef.current = props;

  useEffect(() => {
    dropzone.current = new DropzoneLib(
      dropzoneRef.current,
      Object.assign({},
        getDefaultOptions(),
        props.options
      ));

    // attach the name as a class to the hidden input for easier identification
    const { name } = props;
    if (name && dropzone.current.hiddenFileInput) {
      dropzone.current.hiddenFileInput.classList.add(`dz-input-${name}`);
    }

    // Set the user warning displayed when a user attempts to remove a file.
    // If the props hasn't been passed there will be no warning when removing files.
    if (typeof props.promptOnRemove !== 'undefined') {
      setPromptOnRemove(props.promptOnRemove);
    }

    return () => {
      // Remove all dropzone event listeners.
      dropzone.current.files = [];
      dropzone.current.destroy();
    };
  }, []);

  useEffect(() => {
    // Reattach name to hiddenFileInput as dropzone recreates this element after each upload
    const { name } = props;

    if (name && dropzone.current.hiddenFileInput) {
      dropzone.current.hiddenFileInput.classList.add(`dz-input-${name}`);
    }
    // add listeners when necessary
    if (props.canUpload && prevOptions.current !== props.options) {
      if (dropzone.current) {
        dropzone.current.enable();

        dropzone.current.options = Object.assign({},
          getDefaultOptions(),
          dropzone.current.options,
          props.options
        );
      }
    }
    prevOptions.current = props.options;
  });

  /**
   * Gets the default options to instantiate dropzone with.
   *
   * @return object
   */
  const getDefaultOptions = () => {
    let clickable = null;
    let uploadSelector = propsRef.current.uploadSelector;
    if (!uploadSelector && propsRef.current.uploadButton) {
      uploadSelector = '.asset-dropzone__upload-button';
    }

    if (uploadSelector) {
      const found = $(dropzoneRef.current).find(uploadSelector);
      if (found && found.length) {
        clickable = found.toArray();
      }
    }

    return {
      // Custom validation handler
      accept: handleAccept,

      // By default Dropzone adds markup to the DOM for displaying a thumbnail preview.
      // Here we're relpacing that default behaviour with our own React / Redux implementation.
      addedfile: handleAddedFile,

      // When the user drags a file into the dropzone.
      dragenter: handleDragEnter,

      // When the user's cursor leaves the dropzone while dragging a file.
      dragleave: handleDragLeave,

      // When the user drops a file onto the dropzone.
      drop: handleDrop,

      // When the queue size exceeds the limit
      maxfilesexceeded: handleMaxFilesExceeded,

      // Whenever the file upload progress changes
      uploadprogress: handleUploadProgress,

      // When the file upload complete
      complete: handleUploadComplete,

      // The text used before any files are dropped
      dictDefaultMessage: i18n._t('AssetAdmin.DROPZONE_DEFAULT_MESSAGE', 'Drop files here to upload'),

      // The text that replaces the default message text it the browser is not supported
      dictFallbackMessage: i18n._t(
        'AssetAdmin.DROPZONE_FALLBACK_MESSAGE',
        'Your browser does not support drag\'n\'drop file uploads.'
      ),

      // The text that will be added before the fallback form
      // If null, no text will be added at all.
      dictFallbackText: i18n._t(
        'AssetAdmin.DROPZONE_FALLBACK_TEXT',
        'Please use the fallback form below to upload your files like in the olden days.'
      ),

      // If the file doesn't match the file type.
      dictInvalidFileType: i18n._t('AssetAdmin.DROPZONE_INVALID_FILE_TYPE', 'You can\'t upload files of this type.'),

      // If the server response was invalid.
      dictResponseError: i18n._t('AssetAdmin.DROPZONE_RESPONSE_ERROR', 'Server responded with an error.'),

      // If used, the text to be used for the cancel upload link.
      dictCancelUpload: i18n._t('AssetAdmin.DROPZONE_CANCEL_UPLOAD', 'Cancel upload'),

      // If used, the text to be used for confirmation when cancelling upload.
      dictCancelUploadConfirmation: i18n._t(
        'AssetAdmin.DROPZONE_CANCEL_UPLOAD_CONFIRMATION',
        'Are you sure you want to cancel this upload?'
      ),

      // If used, the text to be used to remove a file.
      dictRemoveFile: i18n._t('AssetAdmin.DROPZONE_REMOVE_FILE', 'Remove file'),

      // Displayed when the maxFiles have been exceeded
      // You can use {{maxFiles}} here, which will be replaced by the option.
      dictMaxFilesExceeded: i18n._t('AssetAdmin.DROPZONE_MAX_FILES_EXCEEDED', 'You can not upload any more files.'),

      // When a file upload fails.
      error: handleError,

      // When file file is sent to the server.
      sending: handleSending,

      // When a file upload succeeds.
      success: handleSuccess,

      queuecomplete: handleQueueComplete,

      thumbnailHeight: 150,

      thumbnailWidth: 200,

      /**
       * The (client-side) timeout for the XHR requests in milliseconds. Note that
       * 0 = unlimited, so should ensure we only ever encounter a server-side timeout
       * See - {@link https://www.dropzonejs.com/#config-timeout}
       */
      timeout: 0,

      clickable,
    };
  };

  /**
   * Gets a file's category based on its type.
   *
   * @param {string} fileType - For example 'image/jpg'.
   *
   * @return string
   */
  const getFileCategory = (fileType) => fileType.split('/')[0];

  const getLoadPreview = (file) => new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      // If the user uploads multiple large images, we could run into memory issues
      // by simply using the `event.target.result` data URI as the thumbnail image.
      //
      // To get avoid this we're creating a canvas, using the dropzone thumbnail dimensions,
      // and using the canvas data URI as the thumbnail image instead.

      if (getFileCategory(file.type) === 'image') {
        const img = new Image();

        resolve(loadImage(img, event.target.result));
      } else {
        resolve({});
      }
    };

    reader.readAsDataURL(file);
  });

  /**
   * JS Synonym for File::setName()
   *
   * @param {String} filename
   * @returns {String}
   */
  const getFileTitle = (filename) => filename
    .replace(/[.][^.]+$/, '')
    .replace(/-_/, ' ');

  /**
   * Set the text displayed when a user tries to remove a file.
   *
   * @param {string} userPrompt - The message to display.
   */
  const setPromptOnRemove = (userPrompt) => {
    dropzone.current.options.dictRemoveFileConfirmation = userPrompt;
  };

  /**
   * Event handler triggered when the user drags a file into the dropzone.
   *
   * @param {Event} event
   */
  const handleDragEnter = (event) => {
    if (!propsRef.current.canUpload) {
      return;
    }

    setDragging(true);

    if (typeof propsRef.current.onDragEnter === 'function') {
      propsRef.current.onDragEnter(event);
    }
  };

  /**
   * Event handler triggered when a user's curser leaves the dropzone while dragging a file.
   *
   * @param {Event} event
   */
  const handleDragLeave = (event) => {
    const componentNode = dropzoneRef.current;

    if (!propsRef.current.canUpload) {
      return;
    }

    // Event propagation (events bubbling up from decendent elements) means the `dragLeave`
    // event gets triggered on the dropzone.
    // Here we're ignoring events that don't originate from the dropzone node.
    if (event.target !== componentNode) {
      return;
    }

    setDragging(false);

    if (typeof propsRef.current.onDragLeave === 'function') {
      propsRef.current.onDragLeave(event, componentNode);
    }
  };

  /**
   * Event handler when a file's upload progress changes.
   *
   * @param {object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {number} progress - the upload progress percentage
   * @param {number} bytesSent - total bytesSent
   */
  const handleUploadProgress = (file, progress, bytesSent) => {
    if (typeof propsRef.current.onUploadProgress === 'function') {
      propsRef.current.onUploadProgress(file, progress, bytesSent);
    }
  };

  /**
   * Event handler when a file's upload complete.
   *
   * @param {object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  const handleUploadComplete = (file) => {
    if (typeof propsRef.current.onUploadComplete === 'function') {
      propsRef.current.onUploadComplete(file.status);
    }
  };

  /**
   * Event handler triggered when the user drops a file on the dropzone.
   *
   * @param {Event} event
   */
  const handleDrop = (event) => {
    setDragging(false);

    if (typeof propsRef.current.onDrop === 'function') {
      propsRef.current.onDrop(event);
    }
  };

  /**
   * Called just before the file is sent. Gets the `xhr` object as second parameter,
   * so you can modify it (for example to add a CSRF token)
   * and a `formData` object to add additional information.
   *
   * @param {object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {object} xhr
   * @param {FormData} formData - FormData interface. See https://developer.mozilla.org/en-US/docs/Web/API/FormData
   */
  const handleSending = (file, xhr, formData) => {
    // Allow submitted data to be decorated
    if (typeof propsRef.current.updateFormData === 'function') {
      propsRef.current.updateFormData(formData);
    }
    formData.append('SecurityID', propsRef.current.securityID);
    formData.append('ParentID', propsRef.current.folderId);

    const newXhr = Object.assign({}, xhr, {
      abort: () => {
        dropzone.current.cancelUpload(file);
        xhr.abort();
      },
    });
    if (typeof propsRef.current.onSending === 'function') {
      propsRef.current.onSending(file, newXhr, formData);
    }
  };

  /**
   * Invoked when validation fails for max files
   * @param file
   * @returns {boolean}
   */
  const handleMaxFilesExceeded = (file) => {
    if (typeof propsRef.current.onMaxFilesExceeded === 'function') {
      return propsRef.current.onMaxFilesExceeded(file);
    }

    return true;
  };

  /**
   * Generate unique ID
   *
   * @returns {number}
   */
  const generateQueuedId = () => {
    idCounter += 1;
    return idCounter;
  };

  /**
   * Custom validation hook for the Dropzone library. Invoking the done() callback
   * invalidates the upload.
   *
   * @param {object} file
   * @param {function} done
   * @returns {*}
   */
  const handleAccept = (file, done) => {
    // check with parent if there are other forms of validation to be done
    if (typeof propsRef.current.canFileUpload === 'function' && !propsRef.current.canFileUpload(file)) {
      return done(i18n._t(
        'AssetAdmin.DROPZONE_CANNOT_UPLOAD',
        'Uploading not permitted.'
      ));
    }

    if (!propsRef.current.canUpload) {
      return done(i18n._t(
        'AssetAdmin.DROPZONE_CANNOT_UPLOAD',
        'Uploading not permitted.'
      ));
    }

    return done();
  };

  /**
   * Event handler for files being added. Called before the request is made to the server.
   *
   * @param file (object) - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  const handleAddedFile = (file) => {
    // The queuedId is used to uniquely identify file while it's in the queue.
    // eslint-disable-next-line no-param-reassign
    file._queuedId = generateQueuedId();
    const details = {
      category: getFileCategory(file.type),
      filename: file.name,
      queuedId: file._queuedId,
      size: file.size,
      title: getFileTitle(file.name),
      extension: getFileExtension(file.name),
      type: file.type,
      uploadedToFolderId: propsRef.current.folderId,
    };
    // Add the file optimistically.
    propsRef.current.onAddedFile(details);

    const loadPreview = getLoadPreview(file);

    // JS Synonym for AssetAdmin::getObjectFromData()
    return loadPreview.then((preview) => {
      const previewDetails = {
        height: preview.height,
        width: preview.width,
        url: preview.thumbnailURL,
        thumbnail: preview.thumbnailURL,
        smallThumbnail: preview.thumbnailURL,
      };
      if (typeof propsRef.current.onPreviewLoaded === 'function') {
        propsRef.current.onPreviewLoaded(details, previewDetails);
      }

      return {
        ...details,
        ...previewDetails,
      };
    });
  };

  /**
   * Returns a promise for loading an image to get the dataURL for previewing.
   *
   * @param img (image)
   * @param newSource (string)
   * @returns {Promise}
   */
  const loadImage = (img, newSource) => new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // eslint-disable-next-line no-param-reassign
    img.onload = () => {
      // two times for retina
      const previewWidth = propsRef.current.preview.width * 2;
      const previewHeight = propsRef.current.preview.height * 2;
      const ratio = img.naturalWidth / img.naturalHeight;

      if (img.naturalWidth < previewWidth
        || img.naturalHeight < previewHeight) {
        // image is smaller than preview, do not need to scale it down
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      } else if (ratio < 1) {
        // width is less than height, so use width as smallest value
        canvas.width = previewWidth;
        canvas.height = previewWidth / ratio;
      } else {
        // height is less than width, so use height as smallest value
        canvas.width = previewHeight * ratio;
        canvas.height = previewHeight;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const thumbnailURL = canvas.toDataURL('image/png');

      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        thumbnailURL,
      });
    };
    // eslint-disable-next-line no-param-reassign
    img.src = newSource;
  });

  /**
   * Event handler for failed uploads.
   *
   * @param {object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   * @param {string} message
   */
  const handleError = (file, message) => {
    // remove files list, as they are no longer needed
    dropzone.current.removeFile(file);

    propsRef.current.onError(file, message);
  };

  /**
   * Event handler for successfully upload files.
   *
   * @param {object} file - File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  const handleSuccess = (file) => {
    // remove files list, as they are no longer needed
    dropzone.current.removeFile(file);

    propsRef.current.onSuccess(file);
  };

  /**
   * Called when the entire queue is done uploading
   */
  const handleQueueComplete = () => {
    if (propsRef.current.onQueueComplete) {
      propsRef.current.onQueueComplete();
    }
  };

  const className = ['asset-dropzone'];

  if (props.className) {
    className.push(props.className);
  }

  const buttonProps = {
    className: 'asset-dropzone__upload-button ss-ui-button',
    type: 'button',
  };

  if (!props.canUpload) {
    buttonProps.disabled = true;
  }

  if (dragging === true) {
    className.push('dragging');
  }

  return (
    <div className={className.join(' ')} ref={dropzoneRef}>
      {props.uploadButton &&
      <button {...buttonProps}>
        <span className="font-icon-upload" aria-hidden="true" />
        {i18n._t('AssetAdmin.DROPZONE_UPLOAD')}
      </button>
      }
      {props.children}
    </div>
  );
};

AssetDropzone.propTypes = {
  folderId: PropTypes.number.isRequired,
  onAccept: PropTypes.func,
  onAddedFile: PropTypes.func.isRequired,
  onDragEnter: PropTypes.func,
  onDragLeave: PropTypes.func,
  onDrop: PropTypes.func,
  onError: PropTypes.func.isRequired,
  onPreviewLoaded: PropTypes.func,
  onSending: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
  onMaxFilesExceeded: PropTypes.func,
  updateFormData: PropTypes.func,
  canFileUpload: PropTypes.func,
  onQueueComplete: PropTypes.func,
  options: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }),
  promptOnRemove: PropTypes.string,
  securityID: PropTypes.string.isRequired,
  uploadButton: PropTypes.bool,
  uploadSelector: PropTypes.string,
  canUpload: PropTypes.bool.isRequired,
  preview: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  className: PropTypes.string,
};

export default AssetDropzone;
