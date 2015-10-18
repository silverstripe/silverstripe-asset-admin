# Architecture

If you're reading this, I have died.

No, just kidding. But you're probably interested in how this module is put together. Perhaps you're looking for tips on how to structure your own React-based SilverStripe module, or you want to make improvements to this one. You've come to the right place. Unless I'm actually dead when you're reading this. Sorry about that...

## This is not Flux

That's probably the first question you were going to ask. This version does not use Flux. We decided not to as the scope of features and volume of moving parts is relatively low. That said, we are following many of the important concepts of Flux. Data flows in a single direction, and is treated as immutable. The code is clean and easy to reason about.

## Some details...

There are two main modes to the Gallery component. The first is a list of files for the current folder or the current filter. It's possible to filter files in a specific folder, too. That Gallery component talks to a single backend. This backend takes the place of a store. It serves as an Ajax proxy to the CMS field JSON backend. Through this backend, the Gallery component can search for files (top-level, by sub-folder, or by filter).

The Gallery component composes an Editor component. When a file is edited, then the Gallery component switches to edit mode. The Editor is a place where file and folder details can be modified. These are persisted through the backend.

When the Gallery component is mounted, it requests a list of files relative to the path set on the CMS field. Each file is rendered in a list of File components. Each File component instance has details about the individual file, and presents UI for entering edit mode, deleting the file/folder or navigating into folders. File components may also be selected (which allows for inserting file objects through TinyMCE).

The Gallery component sends event handlers down to the components it composes. Editor and File component instances have no knowledge of the backend. They decide when to call special event properties (like `onFileSave` or `onFileDelete`), and the Gallery decides what to do with that event. This way the data being rendered travels from the Gallery component down to File and Editor components. Events are triggered by the Gallery component, via property-methods in the File and Editor components.

## For example

When the Gallery component is mounted, it requests file data:

1. `ReactDOM.render(el, <GalleryComponent backend={backend} />);`
2. `GalleryComponent.componentWillMount` → `this.props.backend.search()`
3. `GalleryComponent.componentWillMount` → `this.props.backend.on('onSearchData', data => this.setState(data))`
4. `GalleryComponent.render` → `this.state.files.map(file => <File file={file} onFileEdit={this.onFileEdit} ... />)`

When a File component wants to enter edit mode:

1. `FileComponent.render` → `<button onClick={this.onFileEdit} />`
2. `FileComponent.onFileEdit` → `this.props.onFileEdit(this.props, event)`
3. `GalleryComponent.onFileEdit` → `this.setState({'editing': file})`
4. `GalleryComponent.render` → `if (this.state.editing) return <EditorComponent file={this.state.editing} ... />`
