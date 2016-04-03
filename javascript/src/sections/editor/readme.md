# Editor Component

The editor component provides a detail form that can be populated with the contents of a file. The fields displayed
are customisable.

Properties:

  onClose      - Called after cancel is pressed. This can, for example, re-display a gallery view.
  onSave       - Called after the save button is pressed. You should hook it to something that actually
                 saves the content.

  visible      - Show the component
  file         - The file to edit
  editorFields - The fields to show in the edit form
