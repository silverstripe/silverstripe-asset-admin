import $ from 'jquery';
import i18n from 'i18n';
import React from 'react';
import constants from '../constants';
import BaseComponent from './base-component';

class FileComponent extends BaseComponent {
	constructor(props) {
		super(props);

		this.state = {
			'focussed': false,
			'buttonTabIndex': -1
		};

		this.bind(
			'onFileNavigate',
			'onFileEdit',
			'onFileDelete',
			'onFileSelect',
			'handleDoubleClick',
			'handleKeyDown',
			'handleFocus',
			'handleBlur',
			'preventFocus'
		);
	}

	handleDoubleClick(event) {
		if (event.target !== this.refs.title.getDOMNode() && event.target !== this.refs.thumbnail.getDOMNode()) {
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
		this.props.onFileSelect(this.props, event);
	}

	onFileEdit(event) {
		event.stopPropagation(); //stop triggering click on root element
		this.props.onFileEdit(this.props, event);
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
			thumbnailClassNames += ' large';
		}

		return thumbnailClassNames;
	}

	getItemClassNames() {
		var itemClassNames = 'item ' + this.props.category;

		if (this.state.focussed) {
			itemClassNames += ' focussed';
		}

		if (this.props.selected) {
			itemClassNames += ' selected';
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
		if (event.target !== React.findDOMNode(this.refs.thumbnail)) {
			return;
		}

		//If space is pressed, allow focus on buttons
		if (this.props.spaceKey === event.keyCode) {
			event.preventDefault(); //Stop page from scrolling
			this.setState({
				'buttonTabIndex': 0
			});
			$(React.findDOMNode(this)).find('.item__actions__action').first().focus();
		}

		//If return is pressed, navigate folder
		if (this.props.returnKey === event.keyCode) {
			this.onFileNavigate();
		}
	}

	handleFocus() {
		this.setState({
			'focussed': true,
			'buttonTabIndex': 0
		});
	}

	handleBlur() {
		this.setState({
			'focussed': false,
			'buttonTabIndex': -1
		});
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
						tabIndex={this.state.buttonTabIndex}
						onClick={this.onFileSelect}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}>
					</button>
					<button
						className='item__actions__action item__actions__action--remove [ font-icon-trash ]'
						type='button'
						title={i18n._t('AssetGalleryField.DELETE')}
						tabIndex={this.state.buttonTabIndex}
						onClick={this.onFileDelete}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}>
					</button>
					<button
						className='item__actions__action item__actions__action--edit [ font-icon-edit ]'
						type='button'
						title={i18n._t('AssetGalleryField.EDIT')}
						tabIndex={this.state.buttonTabIndex}
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
	'id': React.PropTypes.number,
	'title': React.PropTypes.string,
	'category': React.PropTypes.string,
	'url': React.PropTypes.string,
	'dimensions': React.PropTypes.shape({
		'width': React.PropTypes.number.isRequired,
		'height': React.PropTypes.number.isRequired
	}),
	'onFileNavigate': React.PropTypes.func,
	'onFileEdit': React.PropTypes.func,
	'onFileDelete': React.PropTypes.func,
	'spaceKey': React.PropTypes.number,
	'returnKey': React.PropTypes.number,
	'onFileSelect': React.PropTypes.func,
	'selected': React.PropTypes.bool
};

export default FileComponent;
