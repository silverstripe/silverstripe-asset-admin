import EventEmitter from 'events';
import CONSTANTS from '../constants';

export default class Store extends EventEmitter {

	constructor () {
		super();
		this.customListeners = {};		
	}

	static getActionSets () {
		return [];
	}

	listenTo (actionSet, action, callback) {
		this.customListeners[`${actionSet.identifier}.${action}`] = callback;
	}


	handleAction (action, params) {
		let method = this.customListeners[action];

		if(!method) {
			let name = action.split('.').pop();
			let capName = name.charAt(0).toUpperCase() + name.slice(1);				
			method = this[`on${capName}`];
		}

		if(method) {
			method.call(this, ...params);
		}
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