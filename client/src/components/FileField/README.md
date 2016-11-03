# FileField Component

Generates a file upload field

## Example

```js
<FileField />
```

## Properties

* `id` (string) (required): The ID for the component.
* `extraClass` (string): Extra classes the component should have.
* `name` (string) (required): The name for the component.
* `onChange` (function): Event handler for when the component changes.
* `value` (object): FileField value is an object with a single property 'Files'. This property
  is a list of file IDs assigned to this value.
* `data` List of custom options for this field. Data keys include:
  - `data.createFileEndpoint` (object) Endpoint this field should use to upload new files to
  - `data.multi` (bool) Flag indicating whether this field supports multi-file upload
  - `data.parentid` (int) Parent ID to upload files to
 
## Unsupported properties

* `readonly`
* `disabled`

 _NOTE:_ For other properties, please refer to the [react-bootstrap FormControl](https://react-bootstrap.github.io/components.html#forms-props-form-control) documentation.
