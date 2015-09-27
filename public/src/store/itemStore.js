import galleryDispatcher from '../dispatcher/galleryDispatcher';
import galleryActions from '../action/galleryActions';
import EventEmitter from 'events';
import CONSTANTS from '../constants';

var _items = {};
var _folders = [];
var _currentFolder = null;

/**
 * @func create
 * @private
 * @param {object} itemData
 * @desc Adds a gallery item to the store.
 */
function create(itemData) {
	_items[itemData.id] = itemData;
}

/**
 * @func destroy
 * @private
 * @param {int} id
 * @param {function} callback
 * @desc Removes a gallery item from the store.
 */
function destroy(id, callback) {
	jQuery.ajax({ // @todo fix this junk
		'url': _itemStore.delete_url,
		'data': {
			'id': id
		},
		'dataType': 'json',
		'method': 'GET',
		'success': (data) => {
			delete _items[id];
			callback && callback();
		}
	});
}

/**
 * Navigates to a new folder.
 *
 * @private
 *
 * @param {string} folder
 * @param {function} callback
 */
function navigate(folder, callback) {
	jQuery.ajax({
		'url': _itemStore.data_url,
		'dataType': 'json',
		'data': {
			'folder': folder
		},
		'success': function(data) {
			_items = {};

			if (folder !== _itemStore.initial_folder) {
				_folders.push([folder, _currentFolder || _itemStore.initial_folder]);
			}

			_currentFolder = folder;

			data.files.forEach((item) => {
				galleryActions.create(item, true);
			});

			callback && callback();
		}
	})
}


/**
 * @func destroy
 * @private
 * @param {string} id
 * @param {object} itemData
 * @desc Updates an item in the store.
 */
function update(id, itemData) {
	// TODO:
}

class ItemStore extends EventEmitter {

	/**
	 * Checks if the gallery has been navigated.
	 */
	hasNavigated() {
		return _folders.length > 0;
	}

	/**
	 * Gets the folder stack.
	 */
	popNavigation() {
		return _folders.pop();
	}

	/**
	 * @return {object}
	 * @desc Gets the entire collection of items.
	 */
	getAll() {
		return _items;
	}

	/**
	 * @func getById
	 * @param {string} id
	 * @return {object}
	 */
	getById(id) {
		return _items[id];
	}

	/**
	 * @func emitChange
	 * @desc Triggered when something changes in the store.
	 */
	emitChange() {
		this.emit(CONSTANTS.ITEM_STORE.CHANGE);
	}

	/**
	 * @param {function} callback
	 */
	addChangeListener(callback) {
		this.on(CONSTANTS.ITEM_STORE.CHANGE, callback);
	}

	/**
	 * @param {function} callback
	 */
	removeChangeListener(callback) {
		this.removeListener(CONSTANTS.ITEM_STORE.CHANGE, callback);
	}
}

let _itemStore = new ItemStore(); // Singleton

galleryDispatcher.register(function (payload) {
    switch(payload.action) {
        case CONSTANTS.ITEM_STORE.CREATE:
            create(payload.data);
            if (!payload.silent) {
                _itemStore.emitChange(payload.silent);
            }
            break;

        case CONSTANTS.ITEM_STORE.DESTROY:
            destroy(payload.data.id, () => {
				if (!payload.silent) {
					_itemStore.emitChange(payload.silent);
				}
			});

            break;

		case CONSTANTS.ITEM_STORE.NAVIGATE:
			navigate(payload.data.folder, () => {
				if (!payload.silent) {
					_itemStore.emitChange(payload.silent);
				}
			});

			break;

		case CONSTANTS.ITEM_STORE.UPDATE:
			update(payload.data.id, payload.data.updates);
			if (!payload.silent) {
				_itemStore.emitChange();
			}
			break;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default _itemStore;
