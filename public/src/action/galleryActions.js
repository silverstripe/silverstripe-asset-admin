import galleryDispatcher from '../dispatcher/galleryDispatcher';
import CONSTANTS from '../constants';

let galleryActions = {
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
    }
};

export default galleryActions;
