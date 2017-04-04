# GalleryItem Component

Displays a file/folder as a thumbnail with relevant actions.

## Example
```js
<GalleryItem item={{id: 2}} selectable={true} />
```

## Properties

* `item` (object): File details to display for.
* `highlights` (boolean): Defines whether the item is highlighted (from being open)
* `selected` (boolean): Defines whether the item is actively selected.
* `enlarged` (boolean): Whether the item should apply the enlarged class (e.g. when hovered over)
* `message` (object):
    * `value` (string): The message to display over the preview area.
    * `type` (string): The type of message.
* `selectable` (boolean): Defines whether the item can be selected.
* `onActivate` (function): Callback for when the item is activated (normally by Click)
* `onSelect` (function): Callback for when the item is selected.
* `onCancelUpload` (function): Callback for when the item is cancelled from uploading.
* `onRemoveErroredUpload` (function): Callback for when the item should be removed, can be called after it errors during upload.

# draggable HOC

Helps apply react-dnd to Files, so that the file can interact with dragging.

## Example

```js
const draggableComponent = draggable('Item')(Component);
```

## Properties
* `item` (object) (required): File details to display for.
* `onDrag` (function): Callback for when the item is starting or ending being dragged.
* `selectedFiles` (array): A list of ids that have been selected.

# droppable HOC

Helps apply react-dnd to Folders, so that a file could be dragged on it with the proper interactive response.

## Example

```js
const droppableComponent = droppable('Item')(Component);
```

## Properties

* `item` (object) (required): File details to display for.

# GalleryItemDragLayer Component

The custom preview item to show instead of the HTML5 default preview.

__NOTE__: This does lose some nice functionality, like the "slingshot back" to place effect when dropping onto nothing droppable.

## Example

```js
<GalleryItemDragLayer />
```

## Properties
* `item` (object): File details to display for.
* `offset` (object): Co-ordinates for the item's offset.
* `isDragging` (boolean): Is an item currently being dragged.
