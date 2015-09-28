import galleryDispatcher from '../dispatcher/galleryDispatcher';
import galleryActions from '../action/galleryActions';
import EventEmitter from 'events';
import CONSTANTS from '../constants';

var _items = [];
var _folders = [];
var _currentFolder = null;

var _filters = {
	'page': 1,
	'limit': 10
};

/**
 * @func create
 * @private
 * @param {object} itemData
 * @desc Adds a gallery item to the store.
 */
function create(itemData) {
	_items.push(itemData);
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
			var itemIndex = -1;

			// Get the index of the item we have deleted
			// so it can be removed from the store.
			for (let i = 0; i < _items.length; i += 1) {
				if (_items[i].id === id) {
					itemIndex = i;
					break;
				}
			}

			if (itemIndex === -1) {
				return;
			}

			_items.splice(itemIndex, 1);

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
	_filters.page = 1;
	_filters.folder = folder;

	jQuery.ajax({
		'url': _itemStore.data_url,
		'dataType': 'json',
		'data': {
			'folder': _filters.folder,
			'page': _filters.page++,
			'limit': _itemStore.limit
		},
		'success': function(data) {
			_items = [];

			_filters.count = data.count;

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

function page(callback) {
	if (_items.length < _filters.count) {
		jQuery.ajax({
			'url': _itemStore.data_url,
			'dataType': 'json',
			'data': {
				'folder': _filters.folder,
				'page': _filters.page++,
				'limit': _itemStore.limit
			},
			'success': function(data) {
				data.files.forEach((item) => {
					galleryActions.create(item, true);
				});

				callback && callback();
			}
		});
	}
}


/**
 * @func update
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
		var item = null;

		for (let i = 0; i < _items.length; i += 1) {
			if (_items[i].id === id) {
				item = _items[i];
				break;
			}
		}

		return item;
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

		case CONSTANTS.ITEM_STORE.PAGE:
			page(() => {
				if (!payload.silent) {
					_itemStore.emitChange();
				}
			});

			break;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default _itemStore;
