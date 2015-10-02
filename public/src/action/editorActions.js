import editorDispatcher from '../dispatcher/editorDispatcher';
import ActionSet from './ActionSet';
import API from '../api/API';

const editorActions = new ActionSet (
	'editorActions', 
	editorDispatcher
);

editorActions.addAction('create');

editorActions.addAction('update');

editorActions.addAction('clear');

export default editorActions;