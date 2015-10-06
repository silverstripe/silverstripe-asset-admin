import galleryDispatcher from '../dispatcher/galleryDispatcher';
import galleryActions from '../action/galleryActions';
import EventEmitter from 'events';
import $ from 'jquery';
import CONSTANTS from '../constants';

var _items = [];
var _folders = [];
var _currentFolder = null;

/**
 * @func init
 * @private
 * @param {object} data
 * @desc Sets properties on the store.
 */
function init(data) {
	_itemStore.page = 1;
	_itemStore.limit = 10;
	_itemStore.sort = 'title';
	_itemStore.direction = 'asc';

	if (data.filter_folder && data.initial_folder && data.filter_folder !== data.initial_folder) {
		_folders.push([data.filter_folder, data.initial_folder]);
	}

	Object.keys(data).map((key) => {
		_itemStore[key] = data[key];
	});
}

function sort(name, callback) {
	if (_itemStore.sort.toLowerCase() == name.toLowerCase()) {
		if (_itemStore.direction.toLowerCase() == 'asc') {
			_itemStore.direction = 'desc';
		} else {
			_itemStore.direction = 'asc';
		}
	} else {
		_itemStore.sort = name.toLowerCase();
		_itemStore.direction = 'asc';
	}

	callback && callback();
}

/**
 * @func create
 * @private
 * @param {object} itemData
 * @desc Adds a gallery item to the store.
 */
function create(itemData) {
	var itemExists = _items.filter((item) => { return item.id === itemData.id; }).length > 0;

	if (itemExists) {
		return;
	}

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
	$.ajax({ // @todo fix this junk
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
	_itemStore.page = 1;
	_itemStore.filter_folder = folder;

	let data = {
		'page': _itemStore.page++,
		'limit': _itemStore.limit,
	};

	['filter_folder', 'filter_name', 'filter_type', 'filter_created_from', 'filter_created_to'].forEach((type) => {
		if (_itemStore[type]) {
			data[type] = _itemStore[type];
		}
	});

	$.ajax({
		'url': _itemStore.data_url,
		'dataType': 'json',
		'data': data,
		'success': function(data) {
			_items = [];

			_itemStore.count = data.count;

			let $search = $('.cms-search-form');

			if ($search.find('[type=hidden][name="q[Folder]"]').length == 0) {
				$search.append('<input type="hidden" name="q[Folder]" />');
			}

			if(folder.substr(-1) === '/') {
				folder = folder.substr(0, folder.length - 1);
			}

			$search.find('[type=hidden][name="q[Folder]"]').val(encodeURIComponent(folder));

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
	if (_items.length < _itemStore.count) {
		let data = {
			'page': _itemStore.page++,
			'limit': _itemStore.limit,
		};

		['filter_folder', 'filter_name', 'filter_type', 'filter_created_from', 'filter_created_to'].forEach((type) => {
			if (_itemStore[type]) {
				data[type] = _itemStore[type];
			}
		});

		$.ajax({
			'url': _itemStore.data_url,
			'dataType': 'json',
			'data': data,
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
		return _items.sort(function(a, b) {
			let sort = _itemStore.sort.toLowerCase();
			let direction = _itemStore.direction.toLowerCase();

			if (direction == 'asc') {
				if (a[sort] < b[sort]) {
					return -1;
				}

				if (a[sort] > b[sort]) {
					return 1;
				}

				return 0
			}

			if (a[sort] > b[sort]) {
				return -1;
			}

			if (a[sort] < b[sort]) {
				return 1;
			}

			return 0
		});
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
		case CONSTANTS.ITEM_STORE.INIT:
			init(payload.data);

			if (!payload.silent) {
				_itemStore.emitChange();
			}

			break;

		case CONSTANTS.ITEM_STORE.CREATE:
			create(payload.data);

			if (!payload.silent) {
				_itemStore.emitChange();
			}

			break;

		case CONSTANTS.ITEM_STORE.DESTROY:
			destroy(payload.data.id, () => {
				if (!payload.silent) {
					_itemStore.emitChange();
				}
			});

			break;

		case CONSTANTS.ITEM_STORE.NAVIGATE:
			navigate(payload.data.folder, () => {
				if (!payload.silent) {
					_itemStore.emitChange();
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

		case CONSTANTS.ITEM_STORE.SORT:
			sort(payload.data.name, () => {
				if (!payload.silent) {
					_itemStore.emitChange();
				}
			});

			break;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default _itemStore;
