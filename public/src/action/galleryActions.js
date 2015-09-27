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
	 * Updates a gallery item.
	 *
	 * @param {object} props
	 */
	update: function (props, silent) {
		galleryDispatcher.dispatch({
			action: CONSTANTS.ITEM_STORE.UPDATE,
			data: props,
			silent: silent
		});
	}
};

export default galleryActions;
