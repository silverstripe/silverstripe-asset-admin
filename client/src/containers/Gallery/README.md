# Gallery Component

A wrapper component for defining the toolbars and views that the gallery would display to the end user.
Callbacks for browsing between files and folders are required, as the handling for router is abstracted away from this component.

Properties:
 * `type` (string): Defines what kind of context the gallery is opened under, for example bulk actions are not rendered if not under the `'admin'` type.
 Available types include:
    * insert
    * admin
 * `view` (string): Defines what kind of view the gallery should show.
 Available types include:
    * tile
    * table
 * `onViewChange` (function): The callback used when the view changes.
 * `fileId` (number): The active file that is open, for opening the Editor
 * `folderId` (number): The active folder that should be open, this determines which folder to load.
 * `folder` (object): The details of the active folder, this is loaded in the Gallery component.
 Properties include:
    * `id` (number): Identifier for folder.
    * `parentID` (number): Identifier for the parent folder.
    * `canView` (boolean): Flag for if the folder is viewable.
    * `canEdit` (boolean): Flag for if the folder is editable.
 * `queuedFiles` (object): An object containing a list of items that are currently in the transfer queue.
 Properties include:
    * `items` (array): The list of objects in the current queue.
 * `selectedFiles` (array): A list of files that were selected by the user. 
 * `errorMessage` (string): An errors to show the user if something went wrong, this will prevent the gallery from displaying.
 * `actions` (object): An object containing actions that can be made through the redux store.
 * `securityId` (string): The security ID to be used when making an API call.
 * `createFileApiUrl` (string): The url that the API calls when it needs to create a new file.
 * `createFileApiMethod` (string): The method that the API uses when it needs to create a new file.
 * `createFolderApi` (function): The callback for when a new folder needs to be created.
 * `readFolderApi` (function): The callback for when a folder is read for properties and contents.
 * `deleteApi` (function): The callback for when a file or folder is deleted.

Shared properties:
 * `loading` (boolean): Defines if loading is still happening for the gallery.
 * `sort` (string): Describes the sorting applied to the files list. follows the format `{field},{direction}`.
 * `files` (array) (required): The files that is to be displayed in the gallery.
    * `id` (number): Identifier for the file.
    * `parent` (object): Parent object for the file.
 * `count` (number): The number of files available in the active folder.
 * `page` (number): The pagination number the gallery is currently viewing.
 * `limit` (number): The number of items to display in the gallery.
 * `onOpenFile` (function) (required): Callback for when a file is activated and to be opened.
 * `onOpenFolder` (function) (required): Callback for when a folder is activated and to be opened to show contents in the gallery.
 * `onSort` (function) (required): Callback for when the sorting is updated.
 * `onSetPage` (function) (required): Callback for when the pagination number is updated, to show a different set of items in the gallery.

Gallery view properties:
 * `selectableItems` (boolean): Defines if items in the view are selectable (display checkbox).
 * `onSelect` (function): Callback for when an item is added or removed from selection.
 * `onCancelUpload` (function): Callback for when an upload is cancelled before it completes.
 * `onRemoveErroredUpload` (function): Callback to remove an upload that had encountered an error.
