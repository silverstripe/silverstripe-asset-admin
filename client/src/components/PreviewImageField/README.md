# PreviewImageField Component

A field for displaying a preview image to a given file, this opens the ability to upload a replacement file if desired and handles calling an API and replacing file data to be saved on Submit of the form.
This gives a warning if the replacement file changes file extension.

Properties:
 * `id` (string) (required): A unique identifier for the field
 * `name` (string): Identifier for the form to use
 * `className` (string): Any classes that should be applied to this component
 * `extraClass` (string): Any extra classes provided by the schema
 * `readOnly` (boolean): Defines whether this field is readonly
 * `disabled` (boolean): Defines whether this field is disabled
 * `onAutofill` (function): Callback to be used when an upload has finished and passing back values for other fields on the form to be filled out with
 * `data` (object): Extra data that helps define this field uniquely
    * `parentid` (number): The folder id which the replacement upload will go into
    * `url` (string): The url for the current file
    * `exists` (boolean): Defines whether the file in question exists on the filesystem
    * `preview` (string): The url for a preview image of the file
    * `category` (string): The category the current file belongs to
    * `uploadFileEndpoint` (object): Data defining the endpoint to use for uploading a replacement file
        * `url` (string) (required): The url for the endpoint to call
        * `method` (string) (required): The method to use to call the endpoint with
        * `payloadFormat` (string): The type of encoding to use when calling the endpoint
    * `initialValues` (object): The initial values for the fields that autofill were going to autofill with, the fields are:
        * `FileFilename`
        * `FileHash`
        * `FileVariant`
    * `upload` (object): The upload data if a replacement file is being sent
        * `url` (string): The url or embedded data uri string for displaying a preview for
        * `progress` (number): The percentage of the upload is complete
        * `xhr` (object): The request call object made, used to `abort()` if upload is cancelled
        * `category` (string): Describes the category the uploading file belongs to
        * `message` (object): A message object with regards to the upload
            * `type` (string) (required): The type of message this can be `error`, `success`, etc...
            * `value` (string) (required): The message to be shown to the user
    * `actions` (object): A list of actions to be used for e.g. `redux`
    * `securityID` (string): The security ID to be used for uploading
