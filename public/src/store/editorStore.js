import editorDispatcher from '../dispatcher/editorDispatcher';
import editorActions from '../action/editorActions';
import BaseStore from './baseStore';

let _fields = [];

class EditorStore extends BaseStore {

	static getActionSets () {
		return [editorActions]
	}

	onCreate (data) {
		const fieldExists = _fields.some(field => field.name === data.name);

		if (fieldExists) {
			return;
		}

		_fields.push({
			name: data.name,
			value: data.value
		});

		this.emitChange();
	}

	onUpdate (data) {
		for (let i = 0; i < _fields.length; i += 1) {
			if (_fields[i].name === data.name) {
				_fields[i] = data;
				break;
			}
		}

		this.emitChange();
	}

	onClear () {
		_fields = [];

		this.emitChange();
	}
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
	_editorStore.handleAction(payload.action, payload.params);

	return true;
});

export default _editorStore;
