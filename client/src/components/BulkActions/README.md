# Bulk Actions

A panel which contains options to apply to one or more items.
It presents options as buttons based on the items being passed in.
For example, you can pass in items from a multiselect collection
managed in a different view component.

Since actions are described through props, this component becomes
independant of the `items` payload being handled.

## Example

```
const actions = [
    { value: "edit", label: "Edit", callback: (items) => myEditFn(items) },
    { value: "delete", label: "Delete", callback: (items) => myDeleteFn(items) },
<BulkActions
    items=[{title: "foo"}, {title: "bar}]
    actions={actions}
/>
```

## Properties

 * `items` (array): Generic objects, the component does not inspect its contents
   and passes through the payload to actions
 * `actions` (array): Objects describing presentation and behaviour of actions
   which can be applied to `items`
    * `value` (string): Unique identifier for the action (used on buttons)
    * `label` (string): Button label shown to the user
    * `callback` (function): Executes the action with an `items` argument.
      Can return a Promise for success handling within the component.
    * `canApply` (bool): Callback to determine if the action should be shown
      based on the current items
    * `confirm` (function): An optional callback which can ask the user for confirmation
      on the action, e.g. by a custom prompt. Should return a Promise.
      The `callback` action will only execute once this Promise is resolved.
