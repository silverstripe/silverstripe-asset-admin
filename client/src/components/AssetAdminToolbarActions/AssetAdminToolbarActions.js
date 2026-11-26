/**
 * A place for extra actions in the asset admin toolbar, next to the search button.
 * It renders nothing. Use an Injector transformation to add actions.
 *
 * It gets these props:
 * - type: How the asset admin is used, e.g. "admin" in the CMS section or "insert-media" in a modal
 * - folderId: The ID of the current folder. This is 0 for the root folder, and while the folder is loading.
 * - fileId: The ID of the file that is open in the editor, if there is one
 */
const AssetAdminToolbarActions = () => null;

export default AssetAdminToolbarActions;
