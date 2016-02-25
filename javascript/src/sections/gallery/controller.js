import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTestUtils from 'react-addons-test-utils';
import FileComponent from '../../components/file/index';
import BulkActionsComponent from '../../components/bulk-actions/index';
import SilverStripeComponent from 'silverstripe-component';
import CONSTANTS from '../../constants';
import * as galleryActions from '../../state/gallery/actions';

function getComparator(field, direction) {
	return (a, b) => {
		const fieldA = a[field].toLowerCase();
		const fieldB = b[field].toLowerCase();

		if (direction === 'asc') {
			if (fieldA < fieldB) {
				return -1;
			}

			if (fieldA > fieldB) {
				return 1;
			}
		} else {
			if (fieldA > fieldB) {
				return -1;
			}

			if (fieldA < fieldB) {
				return 1;
			}
		}

		return 0;
	};
}

class GalleryContainer extends SilverStripeComponent {

	constructor(props) {
		super(props);

		this.sort = 'name';
		this.direction = 'asc';

		this.sorters = [
			{
				field: 'title',
				direction: 'asc',
				label: i18n._t('AssetGalleryField.FILTER_TITLE_ASC')
			},
			{
				field: 'title',
				direction: 'desc',
				label: i18n._t('AssetGalleryField.FILTER_TITLE_DESC')
			},
			{
				field: 'created',
				direction: 'desc',
				label: i18n._t('AssetGalleryField.FILTER_DATE_DESC')
			},
			{
				field: 'created',
				direction: 'asc',
				label: i18n._t('AssetGalleryField.FILTER_DATE_ASC')
			}
		];

		this.handleFolderActivate = this.handleFolderActivate.bind(this);
		this.handleFileActivate = this.handleFileActivate.bind(this);
		this.handleToggleSelect = this.handleToggleSelect.bind(this);

		this.handleItemDelete = this.handleItemDelete.bind(this);
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleMoreClick = this.handleMoreClick.bind(this);
		this.handleSort = this.handleSort.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();

		let $select = $(ReactDOM.findDOMNode(this)).find('.gallery__sort .dropdown');

		// We opt-out of letting the CMS handle Chosen because it doesn't re-apply the behaviour correctly.
		// So after the gallery has been rendered we apply Chosen.
		$select.chosen({
			'allow_single_deselect': true,
			'disable_search_threshold': 20
		});

		//Chosen stops the change event from reaching React so we have to simulate a click.
		$select.change(() => ReactTestUtils.Simulate.click($select.find(':selected')[0]));
	}

	/**
	 * Handler for when the user changes the sort order.
	 *
	 * @param object event - Click event.
	 */
	handleSort(event) {
		const data = event.target.dataset;
		this.props.actions.sortFiles(getComparator(data.field, data.direction));
	}

	getNoItemsNotice() {
		if (this.props.gallery.count < 1) {
			return <p className="gallery__no-item-notice">{i18n._t('AssetGalleryField.NOITEMSFOUND')}</p>;
		}
		
		return null;
	}

	getBackButton() {
		if (this.props.gallery.parentFolderID !== null) {
			return <button
				className='gallery__back ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up no-text'
				onClick={this.handleBackClick}
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
				onClick={this.handleMoreClick}>{i18n._t('AssetGalleryField.LOADMORE')}</button>;
		}

		return null;
	}

	render() {
		return <div>
			{this.getBackButton()}
			{this.getBulkActionsComponent()}
			<div className="gallery__sort fieldholder-small">
				<select className="dropdown no-change-track no-chzn" tabIndex="0" style={{width: '160px'}}>
					{this.sorters.map((sorter, i) => {
						return <option
								key={i}
								onClick={this.handleSort}
								data-field={sorter.field}
								data-direction={sorter.direction}>{sorter.label}</option>;
					})}
				</select>
			</div>
			<div className='gallery__folders'>
				{this.props.gallery.files.map((file, i) => {
					if (file.type === 'folder') {
						return <FileComponent
							key={i}
							item={file}
							selected={this.itemIsSelected(file.id)}
							spaceKey={CONSTANTS.SPACE_KEY_CODE}
							returnKey={CONSTANTS.RETURN_KEY_CODE}
							handleDelete={this.handleItemDelete}
							handleToggleSelect={this.handleToggleSelect}
							handleActivate={this.handleFolderActivate} />;
					}})}
			</div>
			<div className='gallery__files'>
				{this.props.gallery.files.map((file, i) => {
					if (file.type !== 'folder') {
						return <FileComponent
							key={i}
							item={file}
							selected={this.itemIsSelected(file.id)}
							spaceKey={CONSTANTS.SPACE_KEY_CODE}
							returnKey={CONSTANTS.RETURN_KEY_CODE}
							handleDelete={this.handleItemDelete}
							handleToggleSelect={this.handleToggleSelect}
							handleActivate={this.handleFileActivate} />;
					}})}
			</div>
			{this.getNoItemsNotice()}
			<div className="gallery__load">
				{this.getMoreButton()}
			</div>
		</div>;
	}

	handleEnterRoute(ctx, next) {
		var viewingFolder = false;

		if (ctx.params.action === 'show' && typeof ctx.params.id !== 'undefined') {
			viewingFolder = true;
		}

		this.props.actions.setViewingFolder(viewingFolder);

		next();
	}

	/**
	 * Handles deleting a file or folder.
	 *
	 * @param object item - The file or folder to delete.
	 */
	handleItemDelete(event, item) {
		if (confirm(i18n._t('AssetGalleryField.CONFIRMDELETE'))) {
			this.props.backend.delete(item.id);
		}
	}

	/**
	 * Checks if a file or folder is currently selected.
	 *
	 * @param number id - The id of the file or folder to check.
	 * @return boolean
	 */
	itemIsSelected(id) {
		return this.props.gallery.selectedFiles.indexOf(id) > -1;
	}

	/**
	 * Handles a user drilling down into a folder.
	 *
	 * @param object event - Event object.
	 * @param object folder - The folder that's being activated.
	 */
	handleFolderActivate(event, folder) {
		this.props.actions.deselectFiles();
		this.props.actions.removeFiles();
		this.props.actions.setPath(CONSTANTS.FOLDER_ROUTE + '/' + folder.id);
		window.ss.router.show(CONSTANTS.FOLDER_ROUTE + '/' + folder.id);
		this.props.backend.getFilesByParentID(folder.id)
	}

	/**
	 * Handles a user activating the file editor.
	 *
	 * @param object event - Event object.
	 * @param object file - The file that's being activated.
	 */
	handleFileActivate(event, file) {
		this.props.actions.setEditing(file);
		window.ss.router.show(CONSTANTS.EDITING_ROUTE.replace(':id', file.id));
	}

	/**
	 * Handles the user toggling the selected/deselected state of a file or folder.
	 *
	 * @param object event - Event object.
	 * @param object item - The item being selected/deselected
	 */
	handleToggleSelect(event, item) {
		if (this.props.gallery.selectedFiles.indexOf(item.id) === -1) {
			this.props.actions.selectFiles([item.id]);
		} else {
			this.props.actions.deselectFiles([item.id]);
		}
	}

	handleMoreClick(event) {
		event.stopPropagation();
		event.preventDefault();
		this.props.backend.more();
	}

	handleBackClick(event) {
		event.preventDefault();
		this.props.actions.deselectFiles();
		this.props.actions.removeFiles();
		this.props.actions.setPath(CONSTANTS.FOLDER_ROUTE + '/' + this.props.gallery.parentFolderID);
		window.ss.router.show(CONSTANTS.FOLDER_ROUTE + '/' + this.props.gallery.parentFolderID);
		this.props.backend.getFilesByParentID(this.props.gallery.parentFolderID);
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
