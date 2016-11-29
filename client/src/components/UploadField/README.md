# UploadField Component

Generates a file upload field

## Example

```js
<UploadField />
```

## Properties

* `id` (string) (required): The ID for the component.
* `extraClass` (string): Extra classes the component should have.
* `name` (string) (required): The name for the component.
* `onChange` (function): Event handler for when the component changes.
* `value` (object): UploadField value is an object with a single property 'Files'. This property
  is a list of file IDs assigned to this value.
* `data` List of custom options for this field. Data keys include:
  - `data.createFileEndpoint` (object) Endpoint this field should use to upload new files to
  - `data.multi` (bool) Flag indicating whether this field supports multi-file upload
  - `data.parentid` (int) Parent ID to upload files to

## Unsupported properties

* `readonly`
* `disabled`


# UploadFieldItem Component

Represents a single item in an UploadField

## Example

```js
<UploadFieldItem />
```

## Properties

* `name` (string) (required): The name of the parent component
* `extraClass` (string): Extra classes the component should have.
* `item` (object): File object this record contains. The shape of this object is equivalent to that
  returned by `AssetAdmin::getObjectFromData` with the following extra considerations:
   - `item.uploaded` (boolean): A flag which is set to true if this file was recently added by the user
   - `item.queuedId` (string): A GUID assigned to any in-progress uploads which are yet to be saved to the database.
* `handleRemove` (function): A callback which will be invoked in case the 'remove' button is clicked. This
  callback has these arguments:
    - `event` (object): The event
    - `item` (object): The file record for the UploadFieldItem instance being removed
