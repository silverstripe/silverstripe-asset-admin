# Insert Embed Modal Component

Handles creating and inserting an external link embedded item.

## Example
```js
<InsertEmbedModal
    onInsert={this.handleInsert}
    onCreate={this.handleCreate}
    onHide={this.handleHide}
    onLoadingError={this.handleLoadingError}
    show={true}
    targetUrl={mySchemaUrl}
/>
```

## Properties
    Url: PropTypes.string,
    CaptionText: PropTypes.string,
    Placement: PropTypes.string,
    Width: PropTypes.number,
    Height: PropTypes.number,
 * `show` (boolean): Defines whether the Modal is showing
 * `onCreate` (function): Handler for creating a new embed object
 * `onInsert` (function): Handler for inserting the embed object
 * `onHide` (function): Handler for hiding the modal
 * `onLoadingError` (function): Handler for when an error occurs while loading the modal contents
 * `bodyClassName` (string): Classes to apply to the body of the modal
 * `fileAttributes` (object): Data to populate into fields/attributes
   * `Url` (string): Url for the embed link to use
   * `CaptionText` (string): Text which appears below the embed object
   * `Placement` (string): The css class to describe where the embed object is placed
   * `Width` (number): The width of the object
   * `Height` (number): The height of the object

__NOTE__: Many props are passed on to the `FormBuilderModal` container, e.g. show.
