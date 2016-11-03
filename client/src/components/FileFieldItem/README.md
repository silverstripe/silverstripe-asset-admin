# FileFieldItem Component

Represents a single item in a FileField

## Example

```js
<FileFieldItem />
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
    - `item` (object): The file record for the FileFieldItem instance being removed

 _NOTE:_ For other properties, please refer to the [react-bootstrap FormControl](https://react-bootstrap.github.io/components.html#forms-props-form-control) documentation.
