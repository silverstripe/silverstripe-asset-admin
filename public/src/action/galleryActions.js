import galleryDispatcher from '../dispatcher/galleryDispatcher';
import ActionSet from './ActionSet';
import API from '../api/API';

const galleryActions = new ActionSet (
	'galleryActions', 
	galleryDispatcher
);

galleryActions.addAction('setStoreProps');

galleryActions.addAction('create');

galleryActions.addAsyncAction('destroy', id => {
	API.destroyItem(id, galleryActions.destroy.completed)
});

galleryActions.addAsyncAction('update', () => {
	console.log('todo');
});

galleryActions.addAsyncAction('navigate', folder => {
	API.getFolderData({folder}, galleryActions.navigate.completed);
});

galleryActions.addAsyncAction('page', params => {
	API.getFolderData(params, galleryActions.page.completed);
});

export default galleryActions;
