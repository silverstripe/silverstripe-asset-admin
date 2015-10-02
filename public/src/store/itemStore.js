import galleryDispatcher from '../dispatcher/galleryDispatcher';
import galleryActions from '../action/galleryActions';
import BaseStore from './baseStore';
import $ from 'jquery';

let _items = [];
let _folders = [];
let _currentFolder = null;

const _filters = {
	'page': 1,
	'limit': 10
};

class ItemStore extends BaseStore {

	static getActionSets () {
		return [galleryActions];
	}

	onSetStoreProps (data) {
		Object.keys(data).map((key) => {
			this[key] = data[key];
		});		
	}

	/**
	 * @func onCreate
	 * @param {object} itemData
	 * @desc Adds a gallery item to the store.
	 */
	onCreate (itemData) {
		const itemExists = _items.some(item => { item.id === itemData.id; });

		if (itemExists) {
			return;
		}

		_items.push(itemData);

		this.emitChange();
	}

	onNavigate (folder) {
		// Could find a cached copy here and trigger a change ahead of the XHR


		if (folder !== _itemStore.initial_folder) {
			_folders.push([folder, _currentFolder || _itemStore.initial_folder]);
		}

		_currentFolder = folder;
	}

	onNavigateCompleted (data) {
		_items = data.files;
		_filters.count = data.count;

		this.emitChange();
	}

	onDestroy (id) {
		// optimistically destroy
		_items = _items.filter(item => item.id !== id);
		this.emitChange();
	}

	onDestroyCompleted (data) {
		// this could be used to replace the item if the server data doesn't look right.
	}

	onPageCompleted (data) {
		_items = _items.concat(data.files);

		this.emitChange();
	}

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

}

const _itemStore = new ItemStore(); // Singleton

galleryDispatcher.register(function (payload) {
	_itemStore.handleAction(payload.action, payload.params);

	return true;
});

export default _itemStore;
