import editorDispatcher from '../dispatcher/editorDispatcher';
import editorActions from '../action/editorActions';
import EventEmitter from 'events';
import CONSTANTS from '../constants';

var _fields = [];

function create(data) {
	if(_fields.some(field => field.name === data.name)) {
		return;
	}

	_fields.push({
		name: data.name,
		value: data.value
	});
}

function update(data) {
	for (let i = 0; i < _fields.length; i += 1) {
		if (_fields[i].name === data.name) {
			_fields[i] = data;
			break;
		}
	}
}

function clear() {
	_fields = [];
}

class EditorStore extends EventEmitter {

	/**
	 * @return {object}
	 * @desc Gets the entire collection of items.
	 */
	getAll() {
		return _fields;
	}

	/**
	 * @func emitChange
	 * @desc Triggered when something changes in the store.
	 */
	emitChange() {
		this.emit(CONSTANTS.EDITOR.CHANGE);
	}

	/**
	 * @param {function} callback
	 */
	addChangeListener(callback) {
		this.on(CONSTANTS.EDITOR.CHANGE, callback);
	}

	/**
	 * @param {function} callback
	 */
	removeChangeListener(callback) {
		this.removeListener(CONSTANTS.EDITOR.CHANGE, callback);
	}

}

let _editorStore = new EditorStore(); // Singleton.

editorDispatcher.register(function (payload) {

	switch(payload.action) {
		case CONSTANTS.EDITOR.CREATE:
			create(payload.data);

			if (!payload.silent) {
				_editorStore.emitChange();
			}

			break;

		case CONSTANTS.EDITOR.UPDATE:
			update(payload.data);

			if (!payload.silent) {
				_editorStore.emitChange();
			}

			break;

		case CONSTANTS.EDITOR.CLEAR:
			clear();

			if (!payload.silent) {
				_editorStore.emitChange();
			}
	}

	return true; // No errors. Needed by promise in Dispatcher.

});

export default _editorStore;
