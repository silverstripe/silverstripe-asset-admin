# AssetDropzone

The Dropzone component uses the [Dropzone library](http://www.dropzonejs.com/) to handle file uploads in AssetAdmin.

## Props

### folderID (number - required)

The ID of the folder to upload files to.

### className (string)

Extra CSS class

### handleAddedFile (function - required)

An event handler which is called when a file is added. The handler is called _before_ a request is made to the server. This can be used to display a preview of the file, before it has been upload to the server.

#### Arguments

##### file (object)

File interface. See [https://developer.mozilla.org/en-US/docs/Web/API/File](https://developer.mozilla.org/en-US/docs/Web/API/File).

#### Example

__container.js__

```js
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import Dropzone from '../components/Dropzone/Dropzone';
import * as fileActions from '../state/files/file-actions';

class Container extends SilverStripeComponent {

    ...

    render() {
        const opts = { url: '/some/endpoint' };

        return (
            <Dropzone
                options={opts}
                handleAddedFile={this.props.actions.handleAddFile}
                handleError={this.props.actions.handleUploadError}
                handleSuccess={this.props.actions.handleUploadSuccess}
                folderID={this.props.folderID}
                securityID={this.props.securityID} />

            <div className='thumbnails'>
                {this.props.files.map((file) => {
                    return <img alt={file.name} src={file._thumbnail} />
                })}
            </div>
        );
    }

    ...
}

Container.propTypes = {
    actions: React.PropTypes.object.isRequired,
    files: React.PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        files: state.files
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(fileActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container);
```

__file-actions.js__

```js
export function addFile(file) {
    return (dispatch, getState) => {
        return dispatch ({
            type: 'ADD_FILE',
            payload: { file }
        });
    }
}
```

### handleDragEnter (function)

Event handler triggered when the user drags a file into the dropzone.

#### Arguments

##### event (object)

The drag event object.

### handleDragLeave (function)

Event handler triggered when the user's cursor leaves the dropzone while dragging a file.

#### Arguments

##### event (object)

The drag event object.

### handleDrop (function)

Event handler triggered when the user drops a file onto the dropzone.

#### Arguments

##### event (object)

The drag event object.

### handleSending (function)

Event handler called just before the file is sent.

#### Arguments

##### file (object)

File interface. See [https://developer.mozilla.org/en-US/docs/Web/API/File](https://developer.mozilla.org/en-US/docs/Web/API/File).

##### xhr (object)

##### formData (object)

FormData interface. See https://developer.mozilla.org/en-US/docs/Web/API/FormData

### handleError (function - required)

An event handler which is called when a file fails to upload.

#### Arguments

##### file (object)

File interface. See [https://developer.mozilla.org/en-US/docs/Web/API/File](https://developer.mozilla.org/en-US/docs/Web/API/File).

##### errorMessage (string)

The error message returned from the server.

##### xhr (object)

If the error was due to the XMLHttpRequest.

### handleSuccess (required)

An event handler which is call on successfully uploading a file.

#### Arguments

##### file (object)

File interface. See [https://developer.mozilla.org/en-US/docs/Web/API/File](https://developer.mozilla.org/en-US/docs/Web/API/File).

### options (object - required)

Options passed to Dropzone. See the [Dropzone docs](http://www.dropzonejs.com/#configuration-options).

### promptOnRemove (string)

The message to display when a user tires to remove a file. If no value is provided files are removed without confirmation.

### securityID (string -required)

The CSRF token to use with the request.

### uploadButton (boolean)

If an upload button should be displayed. Default `true`
