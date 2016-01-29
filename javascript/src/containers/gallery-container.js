import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTestUtils from 'react-addons-test-utils';
import FileComponent from './file-container';
import EditorComponent from '../components/editor-component';
import BulkActionsComponent from '../components/bulk-actions-component';
import BaseComponent from '../components/base-component';
import CONSTANTS from '../constants';

function getComparator(field, direction) {
	return (a, b) => {
		if (direction === 'asc') {
			if (a[field] < b[field]) {
				return -1;
			}

			if (a[field] > b[field]) {
				return 1;
			}
		} else {
			if (a[field] > b[field]) {
				return -1;
			}

			if (a[field] < b[field]) {
				return 1;
			}
		}

		return 0;
	};
}

function getSort(field, direction) {
	let comparator = getComparator(field, direction);

	return () => {
		let folders = this.state.files.filter(file => file.type === 'folder');
		let files = this.state.files.filter(file => file.type !== 'folder');

		this.setState({
			'files': folders.sort(comparator).concat(files.sort(comparator))
		});
	}
}

class GalleryComponent extends BaseComponent {
	constructor(props) {
		super(props);

		this.state = {
			'count': 0, // The number of files in the current view
			'files': [],
			'selectedFiles': [],
			'editing': null
		};

		this.folders = [props.initial_folder];

		this.sort = 'name';
		this.direction = 'asc';

		this.sorters = [
			{
				'field': 'title',
				'direction': 'asc',
				'label': i18n._t('AssetGalleryField.FILTER_TITLE_ASC'),
				'onSort': getSort.call(this, 'title', 'asc')
			},
			{
				'field': 'title',
				'direction': 'desc',
				'label': i18n._t('AssetGalleryField.FILTER_TITLE_DESC'),
				'onSort': getSort.call(this, 'title', 'desc')
			},
			{
				'field': 'created',
				'direction': 'desc',
				'label': i18n._t('AssetGalleryField.FILTER_DATE_DESC'),
				'onSort': getSort.call(this, 'created', 'desc')
			},
			{
				'field': 'created',
				'direction': 'asc',
				'label': i18n._t('AssetGalleryField.FILTER_DATE_ASC'),
				'onSort': getSort.call(this, 'created', 'asc')
			}
		];

		this.listeners = {
			'onSearchData': (data) => {
				this.setState({
					'count': data.count,
					'files': data.files
				});
			},
			'onMoreData': (data) => {
				this.setState({
					'count': data.count,
					'files': this.state.files.concat(data.files)
				});
			},
			'onNavigateData': (data) => {
				this.setState({
					'count': data.count,
					'files': data.files
				});
			},
			'onDeleteData': (data) => {
				this.setState({
					'count': this.state.count - 1,
					'files': this.state.files.filter((file) => {
						return data !== file.id;
					})
				});
			},
			'onSaveData': (id, values) => {
				let files = this.state.files;

				files.forEach((file) => {
					if (file.id == id) {
						file.title = values.title;
						file.basename = values.basename;
					}
				});

				this.setState({
					'files': files,
					'editing': null
				});
			},
			'onFetchData': (data) => {
				this.setState({
					'count': data.count,
					'files': data.files
				});
			}
		};

		this.bind(
			'onFileSave',
			'onFileNavigate',
			'onFileEdit',
			'onFileDelete',
			'onBackClick',
			'onMoreClick',
			'onNavigate',
			'onCancel',
			'getSelectedFiles'
		);
	}

	componentDidMount() {
		super.componentDidMount();

		for (let event in this.listeners) {
			this.props.backend.on(event, this.listeners[event]);
		}

		if (this.props.initial_folder !== this.props.current_folder) {
			this.onNavigate(this.props.current_folder);
		} else {
			this.props.backend.search();
		}
	}

	componentWillUnmount() {
		super.componentWillUnmount();

		for (let event in this.listeners) {
			this.props.backend.removeListener(event, this.listeners[event]);
		}
	}

	componentDidUpdate() {
		var $select = $(ReactDOM.findDOMNode(this)).find('.gallery__sort .dropdown');

		// We opt-out of letting the CMS handle Chosen because it doesn't re-apply the behaviour correctly.
		// So after the gallery has been rendered we apply Chosen.
		$select.chosen({
			'allow_single_deselect': true,
			'disable_search_threshold': 20
		});

		// Chosen stops the change event from reaching React so we have to simulate a click.
		$select.change(() => ReactTestUtils.Simulate.click($select.find(':selected')[0]));
	}

	getFileById(id) {
		var folder = null;

		for (let i = 0; i < this.state.files.length; i += 1) {
			if (this.state.files[i].id === id) {
				folder = this.state.files[i];
				break;
			}
		}

		return folder;
	}
	
	getNoItemsNotice() {
		if (this.state.count < 1) {
			return <p className="no-item-notice">{i18n._t('AssetGalleryField.NOITEMSFOUND')}</p>;
		}
		
		return null;
	}

	getBackButton() {
		if (this.folders.length > 1) {
			return <button
				className='gallery__back ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up no-text'
				onClick={this.onBackClick}
				ref="backButton"></button>;
		}

		return null;
	}

	getBulkActionsComponent() {
		if (this.state.selectedFiles.length > 0 && this.props.backend.bulkActions) {
			return <BulkActionsComponent
				options={CONSTANTS.BULK_ACTIONS}
				placeholder={ss.i18n._t('AssetGalleryField.BULK_ACTIONS_PLACEHOLDER')}
				backend={this.props.backend}
				getSelectedFiles={this.getSelectedFiles} />;
		}

		return null;
	}

	getMoreButton() {
		if (this.state.count > this.state.files.length) {
			return <button
				className="gallery__load__more"
				onClick={this.onMoreClick}>{i18n._t('AssetGalleryField.LOADMORE')}</button>;
		}

		return null;
	}

	getSelectedFiles() {
		return this.state.selectedFiles;
	}

	render() {
		if (this.state.editing !== null) {
			return <div className='gallery'>
				<EditorComponent
					file={this.state.editing}
					onFileSave={this.onFileSave}
					onCancel={this.onCancel} />
			</div>;
		}

		return <div className='gallery'>
			{this.getBackButton()}
			{this.getBulkActionsComponent()}
			<div className="gallery__sort fieldholder-small">
				<select className="dropdown no-change-track no-chzn" tabIndex="0" style={{width: '160px'}}>
					{this.sorters.map((sorter, i) => {
						return <option key={i} onClick={sorter.onSort}>{sorter.label}</option>;
					})}
				</select>
			</div>
			<div className='gallery__items'>
				{this.state.files.map((file, i) => {
					return <FileComponent key={i} {...file}
						spaceKey={CONSTANTS.SPACE_KEY_CODE}
						returnKey={CONSTANTS.RETURN_KEY_CODE}
						onFileDelete={this.onFileDelete}
						onFileEdit={this.onFileEdit}
						onFileNavigate={this.onFileNavigate}
						selected={this.state.selectedFiles.indexOf(file.id) > -1} />;
				})}
			</div>
			{this.getNoItemsNotice()}
			<div className="gallery__load">
				{this.getMoreButton()}
			</div>
		</div>;
	}

	onCancel() {
		this.setState({
			'editing': null
		});

		this.emitExitFileViewCmsEvent();
	}

	onFileDelete(file, event) {
		if (confirm(i18n._t('AssetGalleryField.CONFIRMDELETE'))) {
			this.props.backend.delete(file.id);
			this.emitFileDeletedCmsEvent();
		}

		event.stopPropagation();
	}

	onFileEdit(file, event) {
		// Allow component users to inject behaviour.
		// Temporary solution until the CMS is fully React based,
		// at which point we can work with ES6 subclasses.
		var cb = this.props._onFileEditCallback;
		if(!cb || cb(file, event) !== false) {
			this.setState({
				'editing': file
			});
		}

		this.emitEnterFileViewCmsEvent(file);

		event.stopPropagation();
	}

	onFileNavigate(file) {
		this.folders.push(file.filename);
		this.props.backend.navigate(file.filename);

		this.setState({
			'selectedFiles': []
		});

		this.emitFolderChangedCmsEvent();
		// this.saveFolderNameInSession();
	}

	emitFolderChangedCmsEvent() {
		var folder = {
			parentId: 0,
			id: 0
		};

		// The current folder is stored by it's name in our component.
		// We need to get it's id because that's how Entwine components (GridField) reference it.
		for (let i = 0; i < this.state.files.length; i += 1) {
			if (this.state.files[i].filename === this.props.backend.folder) {
				folder.parentId = this.state.files[i].parent.id;
				folder.id = this.state.files[i].id;
				break;
			}
		}

		this._emitCmsEvent('folder-changed.asset-gallery-field', folder);
	}

	emitFileDeletedCmsEvent() {
		this._emitCmsEvent('file-deleted.asset-gallery-field');
	}

	emitEnterFileViewCmsEvent(file) {
		var id = 0;

		this._emitCmsEvent('enter-file-view.asset-gallery-field', file.id);
	}

	emitExitFileViewCmsEvent() {
		this._emitCmsEvent('exit-file-view.asset-gallery-field');
	}

	// saveFolderNameInSession() {
	// 	if (this.props.hasSessionStorage()) {
	// 		window.sessionStorage.setItem($(ReactDOM.findDOMNode(this)).closest('.asset-gallery')[0].id, this.props.backend.folder);
	// 	}
	// }

	onNavigate(folder, silent = false) {
		// Don't the folder if it exists already.
		if (this.folders.indexOf(folder) === -1) {
			this.folders.push(folder);
		}

		this.props.backend.navigate(folder);

		if (!silent) {
			this.emitFolderChangedCmsEvent();
		}

		// this.saveFolderNameInSession();
	}

	onMoreClick(event) {
		event.stopPropagation();

		this.props.backend.more();

		event.preventDefault();
	}

	onBackClick(event) {
		if (this.folders.length > 1) {
			this.folders.pop();
			this.props.backend.navigate(this.folders[this.folders.length - 1]);
		}

		this.setState({
			'selectedFiles': []
		});

		this.emitFolderChangedCmsEvent();
		// this.saveFolderNameInSession();

		event.preventDefault();
	}

	onFileSave(id, state, event) {
		this.props.backend.save(id, state);

		this.emitExitFileViewCmsEvent();

		event.stopPropagation();
		event.preventDefault();
	}
}

GalleryComponent.propTypes = {
	// 'hasSessionStorage': React.PropTypes.func.isRequired,
	'backend': React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(GalleryComponent);
