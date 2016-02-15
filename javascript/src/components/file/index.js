import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as galleryActions from '../../state/gallery/actions';
import constants from '../../constants';
import SilverStripeComponent from 'silverstripe-component';

class FileComponent extends SilverStripeComponent {
	constructor(props) {
		super(props);

		this.onFileNavigate = this.onFileNavigate.bind(this);
		this.onFileEdit = this.onFileEdit.bind(this);
		this.onFileDelete = this.onFileDelete.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.preventFocus = this.preventFocus.bind(this);
		this.onFileSelect = this.onFileSelect.bind(this);
	}

	handleClick(event) {
		this.onFileNavigate(event);
	}

	onFileNavigate(event) {
		if (this.isFolder()) {
			this.props.onFileNavigate(this.props, event)
			return;
		}

		if (this.props.canEdit) {
			this.onFileEdit(event);
		}
	}

	onFileSelect(event) {
		event.stopPropagation(); //stop triggering click on root element

		if (this.props.gallery.selectedFiles.indexOf(this.props.id) === -1) {
			this.props.actions.selectFiles([this.props.id]);
		} else {
			this.props.actions.deselectFiles([this.props.id]);
		}
	}

	onFileEdit(event) {
		event.stopPropagation(); //stop triggering click on root element
		this.props.actions.setEditing(this.props.gallery.files.find(file => file.id === this.props.id));
	}

	onFileDelete(event) {
		event.stopPropagation(); //stop triggering click on root element
		this.props.onFileDelete(this.props, event)
	}

	isFolder() {
		return this.props.category === 'folder';
	}

	getThumbnailStyles() {
		if (this.props.category === 'image') {
			return {'backgroundImage': 'url(' + this.props.url + ')'};
		}

		return {};
	}

	getThumbnailClassNames() {
		var thumbnailClassNames = 'item__thumbnail';

		if (this.isImageLargerThanThumbnail()) {
			thumbnailClassNames += ' item__thumbnail--large';
		}

		return thumbnailClassNames;
	}
	
	isSelected() {
		return this.props.gallery.selectedFiles.indexOf(this.props.id) > -1;
	}

	getItemClassNames() {
		var itemClassNames = 'item item--' + this.props.category;

		if (this.isSelected()) {
			itemClassNames += ' item--selected';
		}

		return itemClassNames;
	}

	isImageLargerThanThumbnail() {
		let dimensions = this.props.attributes.dimensions;

		return dimensions.height > constants.THUMBNAIL_HEIGHT || dimensions.width > constants.THUMBNAIL_WIDTH;
	}

	handleKeyDown(event) {
		event.stopPropagation();

		//If space is pressed, select file
		if (this.props.spaceKey === event.keyCode) {
			event.preventDefault(); //Stop page from scrolling
			this.onFileSelect(event);
		}

		//If return is pressed, navigate folder
		if (this.props.returnKey === event.keyCode) {
			this.onFileNavigate(event);
		}
	}

	preventFocus(event) {
		//To avoid browser's default focus state when selecting an item
		event.preventDefault();
	}

	render() {
		var selectButton;

		selectButton = <button
			className='item__actions__action--select [ font-icon-tick ]'
			type='button'
			title={i18n._t('AssetGalleryField.SELECT')}
			tabIndex='-1'
			onMouseDown={this.preventFocus}
			onClick={this.onFileSelect}>
		</button>;

		return <div className={this.getItemClassNames()} data-id={this.props.id} tabIndex="0" onKeyDown={this.handleKeyDown} onClick={this.handleClick} >
			<div ref="thumbnail" className={this.getThumbnailClassNames()} style={this.getThumbnailStyles()}>
				<div className='item--overlay [ font-icon-edit ]'> View
				</div>
			</div>
			<div className='item__title' ref="title">{this.props.title}
				{selectButton}
			</div>
		</div>;
	}
}

FileComponent.propTypes = {
	id: React.PropTypes.number,
	title: React.PropTypes.string,
	category: React.PropTypes.string,
	url: React.PropTypes.string,
	dimensions: React.PropTypes.shape({
		width: React.PropTypes.number,
		height: React.PropTypes.number
	}),
	onFileNavigate: React.PropTypes.func,
	onFileEdit: React.PropTypes.func,
	onFileDelete: React.PropTypes.func,
	spaceKey: React.PropTypes.number,
	returnKey: React.PropTypes.number,
	onFileSelect: React.PropTypes.func,
	selected: React.PropTypes.bool,
	canEdit: React.PropTypes.bool,
	canDelete: React.PropTypes.bool
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

export default connect(mapStateToProps, mapDispatchToProps)(FileComponent);
