import galleryDispatcher from '../dispatcher/galleryDispatcher';
import CONSTANTS from '../constants';

var galleryActions = {
	/**
	 * @func create
	 * @param {object} data
	 * @desc Creates a gallery item.
	 */
	create: function (data, silent) {
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
	destroy: function (id, silent) {
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
    update: function (id, updates, silent) {
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
	navigate: function (folder, silent) {
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
	page: function (silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.PAGE,
			silent: silent
		});
	}
};

export default galleryActions;
