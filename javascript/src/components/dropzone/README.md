# Dropzone

The Dropzone component uses the [Dropzone library](http://www.dropzonejs.com/) to handle file uploads in AssetAdmin.

## Props

### handleAddedFile (required)

An event handler which is called when a file is added. The handler is called _before_ a request is made to the server. This can be used to display a preview of the file, before it has been upload to the server.

#### Arguments

##### file (object)

[File interface](File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File).

#### Example

__container.js__

```js
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SilverStripeComponent from 'silverstripe-component';
import DropzoneComponent from '../components/dropzone';
import * as fileActions from '../state/files/file-actions';

class Container extends SilverStripeComponent {

    ...

    render() {
        const opts = { url: '/some/endpoint' };

        return (
            <DropzoneComponent options={opts} handleAddedFile={this.props.actions.addFile} />

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

### handleError

An event handler which is called when a file fails to upload.

#### Arguments

##### file (object)

[File interface](File interface. See https://developer.mozilla.org/en-US/docs/Web/API/File).

##### errorMessage (string)

The error message returned from the server.

##### xhr (object)

If the error was due to the XMLHttpRequest.

### options

Options passed to Dropzone. See the [Dropzone docs](http://www.dropzonejs.com/#configuration-options).

### promptOnRemove

The message to display when a user tires to remove a file. If no value is provided files are removed without confirmation.
