import editorDispatcher from '../dispatcher/editorDispatcher';
import CONSTANTS from '../constants';

var editorActions = {

	create(data, silent) {
		editorDispatcher.dispatch({
			action: CONSTANTS.EDITOR.CREATE,
			data: data,
			silent: silent
		});
	},

	update(data, silent) {
		editorDispatcher.dispatch({
			action: CONSTANTS.EDITOR.UPDATE,
			data: data,
			silent: silent
		});
	},

	clear(silent) {
		editorDispatcher.dispatch({
			action: CONSTANTS.EDITOR.CLEAR,
			silent: silent
		});
	}

}

export default editorActions;