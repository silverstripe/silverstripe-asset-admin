import galleryDispatcher from '../dispatcher/galleryDispatcher';
import CONSTANTS from '../constants';

var galleryActions = {

	/**
	 * @func setStoreProps
	 * @desc Initialises the store
	 */
	setStoreProps(data, silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.INIT,
			data: data,
			silent: silent
		});
	},

	/**
	 * @func create
	 * @param {object} data
	 * @desc Creates a gallery item.
	 */
	create(data, silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.CREATE,
			data: data,
			silent: silent
		});
	},

	/**
	 * @func destroy
	 * @param {string} id
	 * @param {string} delete_url
	 * @param {bool} silent
	 * @desc destroys a gallery item.
	 */
	destroy(id, silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.DESTROY,
			data: {
				id: id
			},
			silent: silent
		});
	},

	/**
	 * @func update
	 * @param {string} id
	 * @param {string} key
	 * @desc Updates a gallery item.
	 */
	update(id, updates, silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.UPDATE,
			data: {
				id: id,
				updates: updates
			},
			silent: silent
		});
	},

	/**
	 * Navigates to a new folder.
	 *
	 * @param {string} folder
	 * @param {bool} silent
	 */
	navigate(folder, silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.NAVIGATE,
			data: {
				'folder': folder
			},
			silent: silent
		});
	},

	/**
	 * Loads another page of items into the gallery.
	 *
	 * @param {bool} silent
	 */
	page(silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.PAGE,
			silent: silent
		});
	}
};

export default galleryActions;
