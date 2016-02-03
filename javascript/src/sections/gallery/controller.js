import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTestUtils from 'react-addons-test-utils';
import FileComponent from '../../components/file/index';
import EditorContainer from '../editor/controller.js';
import BulkActionsComponent from '../../components/bulk-actions/index';
import SilverStripeComponent from 'silverstripe-component';
import CONSTANTS from '../../constants';
import * as galleryActions from '../../state/gallery/actions';

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
		let folders = this.props.gallery.files.filter(file => file.type === 'folder');
		let files = this.props.gallery.files.filter(file => file.type !== 'folder');

		this.props.actions.addFile(folders.sort(comparator).concat(files.sort(comparator)));
	}
}

class GalleryContainer extends SilverStripeComponent {

	constructor(props) {
		super(props);

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

		// Backend event listeners
		this.onFetchData = this.onFetchData.bind(this);
		this.onSaveData = this.onSaveData.bind(this);
		this.onDeleteData = this.onDeleteData.bind(this);
		this.onNavigateData = this.onNavigateData.bind(this);
		this.onMoreData = this.onMoreData.bind(this);
		this.onSearchData = this.onSearchData.bind(this);

		// User event listeners
		this.onFileSave = this.onFileSave.bind(this);
		this.onFileNavigate = this.onFileNavigate.bind(this);
		this.onFileDelete = this.onFileDelete.bind(this);
		this.onBackClick = this.onBackClick.bind(this);
		this.onMoreClick = this.onMoreClick.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();

		if (this.props.initial_folder !== this.props.current_folder) {
			this.onNavigate(this.props.current_folder);
		} else {
			this.props.backend.search();
		}

		this.props.backend.on('onFetchData', this.onFetchData);
		this.props.backend.on('onSaveData', this.onSaveData);
		this.props.backend.on('onDeleteData', this.onDeleteData);
		this.props.backend.on('onNavigateData', this.onNavigateData);
		this.props.backend.on('onMoreData', this.onMoreData);
		this.props.backend.on('onSearchData', this.onSearchData);
	}

	componentWillUnmount() {
		super.componentWillUnmount();

		this.props.backend.removeListener('onFetchData', this.onFetchData);
		this.props.backend.removeListener('onSaveData', this.onSaveData);
		this.props.backend.removeListener('onDeleteData', this.onDeleteData);
		this.props.backend.removeListener('onNavigateData', this.onNavigateData);
		this.props.backend.removeListener('onMoreData', this.onMoreData);
		this.props.backend.removeListener('onSearchData', this.onSearchData);
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

		for (let i = 0; i < this.props.gallery.files.length; i += 1) {
			if (this.props.gallery.files[i].id === id) {
				folder = this.props.gallery.files[i];
				break;
			}
		}

		return folder;
	}
	
	getNoItemsNotice() {
		if (this.props.gallery.count < 1) {
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
		if (this.props.gallery.selectedFiles.length > 0 && this.props.backend.bulkActions) {
			return <BulkActionsComponent
				backend={this.props.backend} />;
		}

		return null;
	}

	getMoreButton() {
		if (this.props.gallery.count > this.props.gallery.files.length) {
			return <button
				className="gallery__load__more"
				onClick={this.onMoreClick}>{i18n._t('AssetGalleryField.LOADMORE')}</button>;
		}

		return null;
	}

	render() {
		if (this.props.gallery.editing !== false) {
			return <div className='gallery'>
				<EditorContainer
					file={this.props.gallery.editing}
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
				{this.props.gallery.files.map((file, i) => {
					return <FileComponent key={i} {...file}
						spaceKey={CONSTANTS.SPACE_KEY_CODE}
						returnKey={CONSTANTS.RETURN_KEY_CODE}
						onFileDelete={this.onFileDelete}
						onFileNavigate={this.onFileNavigate} />;
				})}
			</div>
			{this.getNoItemsNotice()}
			<div className="gallery__load">
				{this.getMoreButton()}
			</div>
		</div>;
	}

	onFetchData(data) {
		this.props.actions.addFile(data.files, data.count);
	}

	onSaveData(id, values) {
		this.props.actions.setEditing(false);
		this.props.actions.updateFile(id, { title: values.title, basename: values.basename });
	}

	onDeleteData(data) {
		const files = this.props.gallery.files.filter((file) => {
			return data !== file.id;
		});

		this.props.actions.addFile(files, this.props.gallery.count - 1);
	}

	onNavigateData(data) {
		this.props.actions.addFile(data.files, data.count);
	}

	onMoreData(data) {
		this.props.actions.addFile(this.props.gallery.files.concat(data.files), data.count);
	}

	onSearchData(data) {
		this.props.actions.addFile(data.files, data.count);
	}

	onFileDelete(file, event) {
		if (confirm(i18n._t('AssetGalleryField.CONFIRMDELETE'))) {
			this.props.backend.delete(file.id);
			this.emitFileDeletedCmsEvent();
		}

		event.stopPropagation();
	}

	onFileNavigate(file) {
		this.folders.push(file.filename);
		this.props.backend.navigate(file.filename);

		this.props.actions.deselectFiles();

		this.emitFolderChangedCmsEvent();
	}

	emitFolderChangedCmsEvent() {
		var folder = {
			parentId: 0,
			id: 0
		};

		// The current folder is stored by it's name in our component.
		// We need to get it's id because that's how Entwine components (GridField) reference it.
		for (let i = 0; i < this.props.gallery.files.length; i += 1) {
			if (this.props.gallery.files[i].filename === this.props.backend.folder) {
				folder.parentId = this.props.gallery.files[i].parent.id;
				folder.id = this.props.gallery.files[i].id;
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

	onNavigate(folder, silent = false) {
		// Don't the folder if it exists already.
		if (this.folders.indexOf(folder) === -1) {
			this.folders.push(folder);
		}

		this.props.backend.navigate(folder);

		if (!silent) {
			this.emitFolderChangedCmsEvent();
		}
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

		this.props.actions.deselectFiles();

		this.emitFolderChangedCmsEvent();

		event.preventDefault();
	}

	onFileSave(id, state, event) {
		this.props.backend.save(id, state);

		event.stopPropagation();
		event.preventDefault();
	}
}

GalleryContainer.propTypes = {
	backend: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		gallery: state.assetAdmin.gallery
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(galleryActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(GalleryContainer);
