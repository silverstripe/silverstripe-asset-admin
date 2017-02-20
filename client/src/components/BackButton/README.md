# BackButton Component

For handling the Back button in the asset-admin section, has the droppable HOC applied, so that users may move files up a folder.

Also displays a badge when given the property.

## Example

```js
    const props = {
      onClick: handleClick,
      badge: {
        status: 'success',
        message: '+1',
      },
    };
```

## Properties
* `onClick` (function): Handler for when the back button is clicked on.
* `badge` (object): Properties for the Badge to appear for this button. Please refer to the Badge component for property details.
