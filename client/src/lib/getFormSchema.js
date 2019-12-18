import CONSTANTS from 'constants/index';

const { CREATE_FOLDER, EDIT_FILE } = CONSTANTS.ACTIONS;

/**
 * This method is used to figure out what form schema to display in the Editor component. The
 * Editor is used for to display form to
 * * edit file metadata
 * * insert link to files in WYSIWYG
 * * insert image in WYSIWYG
 * * select files in the UploadField
 *
 * @param { Object } config Asset admin configuration with the schemaUrls to use
 * @param { string } viewAction Current action being performed
 * @param { number } folderId ID of the current folder
 * @param { number } fileId ID of the current file
 * @param { string } type Type of action to perform
 * @returns {{targetId: number, schemaUrl: string}}
 */
export default function getFormSchema({ config: { form }, viewAction, folderId, fileId, type }) {
  let schemaUrl = null;
  let targetId = null;

  if (viewAction === CREATE_FOLDER) {
    schemaUrl = form.folderCreateForm.schemaUrl;
    targetId = folderId;

    return { schemaUrl, targetId };
  }

  if (viewAction === EDIT_FILE && fileId) {
    switch (type) {
      case 'insert-media':
        schemaUrl = form.fileInsertForm.schemaUrl;
        break;
      case 'insert-link':
        schemaUrl = form.fileEditorLinkForm.schemaUrl;
        break;
      case 'select':
        schemaUrl = form.fileSelectForm.schemaUrl;
        break;
      case 'admin':
      default:
        schemaUrl = form.fileEditForm.schemaUrl;
        break;
    }

    targetId = fileId;
    return { schemaUrl, targetId };
  }

  return {};
}
