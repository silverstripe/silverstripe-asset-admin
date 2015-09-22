import galleryDispatcher from '../dispatcher/galleryDispatcher';
import CONSTANTS from '../constants';

let galleryActions = {
    /**
     * @func create
     * @param {object} data
     * @desc Creates a gallery item.
     */
    create: function (data) {
        galleryDispatcher.dispatch({
            action: CONSTANTS.ITEM_STORE.CREATE,
            data: data
        });
    },

    /**
     * @func destroy
     * @param {string} id
     * @desc destroys a gallery item.
     */
    destroy: function (id) {
        galleryDispatcher.dispatch({
            action: CONSTANTS.ITEM_STORE.DESTROY,
            data: {
                id: id
            }
        });
    },

    /**
     * @func update
     * @param {string} id
     * @param {string} key
     * @desc Updates a gallery item.
     */
    update: function (id, updates) {
        galleryDispatcher.dispatch({
            action: CONSTANTS.ITEM_STORE.UPDATE,
            data: {
                id: id,
                updates: updates
            }
        });
    }
};

export default galleryActions;
