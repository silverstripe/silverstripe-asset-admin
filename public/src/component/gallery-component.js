import $ from 'jquery';
import i18n from 'i18n';
import React from 'react';
import FileComponent from './file-component';
import EditorComponent from './editor-component';
import BulkActionsComponent from './bulk-actions-component';
import BaseComponent from './base-component';
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

export default class extends BaseComponent {
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
					'editing': false
				});
			}
		};

		this.bind(
			'onFileSave',
			'onFileNavigate',
			'onFileSelect',
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
		var $select = $(React.findDOMNode(this)).find('.gallery__sort .dropdown'),
			leftVal = $('.AssetAdmin .cms-content-toolbar:visible').width() + 12;

		if (this.folders.length > 1) {
			let backButton = this.refs.backButton.getDOMNode();

			$(backButton).css({
				left: leftVal
			});
		}

		// We opt-out of letting the CMS handle Chosen because it doesn't re-apply the behaviour correctly.
		// So after the gallery has been rendered we apply Chosen.
		$select.chosen({
			'allow_single_deselect': true,
			'disable_search_threshold': 20
		});

		// Chosen stops the change event from reaching React so we have to simulate a click.
		$select.change(() => React.addons.TestUtils.Simulate.click($select.find(':selected')[0]));
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

	getBackButton() {
		if (this.folders.length > 1) {
			return <button
				className='ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up'
				onClick={this.onBackClick}
				ref="backButton">{i18n._t('AssetGalleryField.BACK')}</button>;
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
		if (this.state.editing) {
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
						onFileSelect={this.onFileSelect}
						selectKeys={CONSTANTS.FILE_SELECT_KEYS}
						onFileSelect={this.onFileSelect}
						selectKeys={CONSTANTS.FILE_SELECT_KEYS}
						onFileDelete={this.onFileDelete}
						onFileEdit={this.onFileEdit}
						onFileNavigate={this.onFileNavigate}
						selected={this.state.selectedFiles.indexOf(file.id) > -1} />;
				})}
			</div>
			<div className="gallery__load">
				{this.getMoreButton()}
			</div>
		</div>;
	}

	onCancel() {
		this.setState({
			'editing': null
		});
	}

	onFileSelect(file, event) {
		event.stopPropagation();

		var currentlySelected = this.state.selectedFiles,
			fileIndex = currentlySelected.indexOf(file.id);

		if (fileIndex > -1) {
			currentlySelected.splice(fileIndex, 1);
		} else {
			currentlySelected.push(file.id);
		}

		this.setState({
			'selectedFiles': currentlySelected
		});
		
		this._emitCmsEvent('gallery-component.file-select', file);
	}

	onFileDelete(file, event) {
		if (confirm(i18n._t('AssetGalleryField.CONFIRMDELETE'))) {
			this.props.backend.delete(file.id);
		}

		event.stopPropagation();
	}

	onFileEdit(file, event) {
		this.setState({
			'editing': file
		});

		event.stopPropagation();
	}

	onFileNavigate(file) {
		this.folders.push(file.filename);
		this.props.backend.navigate(file.filename);

		this.setState({
			'selectedFiles': []
		});
		
		this._emitCmsEvent('gallery-component.navigate');
	}

	onNavigate(folder) {
		this.folders.push(folder);
		this.props.backend.navigate(folder);
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
		})

		event.preventDefault();
		
		this._emitCmsEvent('gallery-component.navigate');
	}

	onFileSave(id, state, event) {
		this.props.backend.save(id, state);

		event.stopPropagation();
		event.preventDefault();
	}
}
