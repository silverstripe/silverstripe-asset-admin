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

        this.getButtonTabIndex = this.getButtonTabIndex.bind(this);
		this.onFileNavigate = this.onFileNavigate.bind(this);
		this.onFileEdit = this.onFileEdit.bind(this);
		this.onFileDelete = this.onFileDelete.bind(this);
		this.handleDoubleClick = this.handleDoubleClick.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.preventFocus = this.preventFocus.bind(this);
		this.onFileSelect = this.onFileSelect.bind(this);
	}

	handleDoubleClick(event) {
		if (event.target !== ReactDOM.findDOMNode(this.refs.title) && event.target !== ReactDOM.findDOMNode(this.refs.thumbnail)) {
			return;
		}

		this.onFileNavigate(event);
	}

	onFileNavigate(event) {
		if (this.isFolder()) {
			this.props.onFileNavigate(this.props, event)
			return;
		}

		this.onFileEdit(event);
	}

	onFileSelect(event) {
		event.stopPropagation(); //stop triggering click on root element

		if (this.props.gallery.selectedFiles.indexOf(this.props.id) === -1) {
			this.props.actions.selectFiles(this.props.id);
		} else {
			this.props.actions.deselectFiles(this.props.id);
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
    
    isFocussed() {
        return this.props.gallery.focus === this.props.id;
    }
    
    getButtonTabIndex() {
        if (this.isFocussed()) {
            return 0;
        } else {
            return -1;
        }
    }

	getItemClassNames() {
		var itemClassNames = 'item item--' + this.props.category;

		if (this.isFocussed()) {
			itemClassNames += ' item--focussed';
		}

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

		//if event doesn't come from the root element, do nothing
		if (event.target !== ReactDOM.findDOMNode(this.refs.thumbnail)) {
			return;
		}
		
		//If space is pressed, allow focus on buttons
		if (this.props.spaceKey === event.keyCode) {
			event.preventDefault(); //Stop page from scrolling
			$(ReactDOM.findDOMNode(this)).find('.item__actions__action').first().focus();
		}

		//If return is pressed, navigate folder
		if (this.props.returnKey === event.keyCode) {
			this.onFileNavigate(event);
		}
	}

	handleFocus() {
        this.props.actions.setFocus(this.props.id);
	}

	handleBlur() {
        this.props.actions.setFocus(false);
	}
	
	preventFocus(event) {
		//To avoid browser's default focus state when selecting an item
		event.preventDefault();
	}

	render() {
		return <div className={this.getItemClassNames()} data-id={this.props.id} onDoubleClick={this.handleDoubleClick}>
			<div ref="thumbnail" className={this.getThumbnailClassNames()} tabIndex="0" onKeyDown={this.handleKeyDown} style={this.getThumbnailStyles()} onClick={this.onFileSelect} onMouseDown={this.preventFocus}>
				<div className='item__actions'>
					<button
						className='item__actions__action item__actions__action--select [ font-icon-tick ]'
						type='button'
						title={i18n._t('AssetGalleryField.SELECT')}
						tabIndex={this.getButtonTabIndex()}
						onClick={this.onFileSelect}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}>
					</button>
					<button
						className='item__actions__action item__actions__action--remove [ font-icon-trash ]'
						type='button'
						title={i18n._t('AssetGalleryField.DELETE')}
						tabIndex={this.getButtonTabIndex()}
						onClick={this.onFileDelete}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}>
					</button>
					<button
						className='item__actions__action item__actions__action--edit [ font-icon-edit ]'
						type='button'
						title={i18n._t('AssetGalleryField.EDIT')}
						tabIndex={this.getButtonTabIndex()}
						onClick={this.onFileEdit}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}>
					</button>
				</div>
			</div>
			<p className='item__title' ref="title">{this.props.title}</p>
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
	selected: React.PropTypes.bool
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
