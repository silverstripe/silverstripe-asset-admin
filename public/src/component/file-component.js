import $ from 'jquery';
import React from 'react';
import constants from '../constants';
import BaseComponent from './base-component';

class FileComponent extends BaseComponent {
	constructor(props) {
		super(props);

		this.state = {
			'focussed': false
		};

		this.bind(
			'onFileNavigate',
			'onFileEdit',
			'onFileDelete',
			'handleKeyDown',
			'handleFocus',
			'handleBlur'
		);
	}

	onFileNavigate(event) {
		if (this.isFolder()) {
			this.props.onFileNavigate(this.props, event)
		}
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

		return itemClassNames;
	}

	isImageLargerThanThumbnail() {
		let dimensions = this.props.attributes.dimensions;

		return dimensions.height > constants.THUMBNAIL_HEIGHT || dimensions.width > constants.THUMBNAIL_WIDTH;
	}

	handleKeyDown(event) {
		event.stopPropagation();

		//if event doesn't come from the root element, do nothing
		if (event.target !== React.findDOMNode(this)) {
			return;
		}

		//If space or enter is pressed
		if (this.props.selectKeys.indexOf(event.keyCode) > -1) {
			event.preventDefault(); //Stop page from scrolling when space is clicked
			this.onFileNavigate();
		}
	}

	handleFocus() {
		this.setState({
			'focussed': true
		})
	}

	handleBlur() {
		this.setState({
			'focussed': false
		})
	}

	render() {
		return <div className={this.getItemClassNames()} data-id={this.props.id} tabIndex="0" onClick={this.onFileNavigate} onKeyDown={this.handleKeyDown}>
			<div className={this.getThumbnailClassNames()} style={this.getThumbnailStyles()}>
				<div className='item__actions'>
					<button
						className='item__actions__action item__actions__action--remove [ font-icon-trash ]'
						type='button'
						onClick={this.onFileDelete}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}>
					</button>
					<button
						className='item__actions__action item__actions__action--edit [ font-icon-edit ]'
						type='button'
						onClick={this.onFileEdit}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}>
					</button>
				</div>
			</div>
			<p className='item__title'>{this.props.title}</p>
		</div>;
	}
}

FileComponent.propTypes = {
	'id': React.PropTypes.number,
	'title': React.PropTypes.string,
	'category': React.PropTypes.string,
	'url': React.PropTypes.string,
	'dimensions': React.PropTypes.shape({
		'width': React.PropTypes.number,
		'height': React.PropTypes.number
	}),
	'onFileNavigate': React.PropTypes.func,
	'onFileEdit': React.PropTypes.func,
	'onFileDelete': React.PropTypes.func,
	'selectKeys': React.PropTypes.array
};

export default FileComponent;
