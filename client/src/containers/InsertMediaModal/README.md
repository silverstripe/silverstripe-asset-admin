# Insert media modal

Properties:
 * `sectionConfig` (object): Defines the configuration for the section this component is in.
 Properties include:
    * `url` (string): The base url for this section
    * `form` (object): Contains urls for specific schemas required
 * `schemaUrl` (string): The schemaUrl extracted from the sectionConfig
 * `show` (boolean): Tells whether the modal should be showing or not
 * `onInsert` (function) (required): The callback used for when an item is selected and submitted in the modal
 * `fileAttributes` (object): The properties for the items that are already defined.
 Properties include:
    * `ID` (number): The ID for the item
    * `AltText` (string): The alternative text for images
    * `Width` (number): The width for the image in pixels
    * `Height` (number): The height for the image in pixels
    * `TitleTooltip` (string): The title property for the item
    * `Alignment` (string): A class string defining the alignment of the image in content
 * `fileId` (number): The ID for the file to be open
 * `onHide` (function): The callback used when the modal is requesting to be hidden
 * `className` (string): Additional class names for the modal
