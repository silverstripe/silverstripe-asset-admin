import $ from 'jquery';
import React from 'react';
import constants from '../constants';
import BaseComponent from './base-component';

class FileComponent extends BaseComponent {
	constructor(props) {
		super(props);

		this.bind('onFileNavigate', 'onFileEdit', 'onFileDelete');
	}

	onFileNavigate(event) {
		if (this.isFolder()) {
			this.props.onFileNavigate(this.props, event)
		}
	}

	onFileEdit(event) {
		this.props.onFileEdit(this.props, event);
	}

	onFileDelete(event) {
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

	isImageLargerThanThumbnail() {
		let dimensions = this.props.attributes.dimensions;

		return dimensions.height > constants.THUMBNAIL_HEIGHT || dimensions.width > constants.THUMBNAIL_WIDTH;
	}

	getItemClassNames() {
		return 'item ' + this.props.category;
	}

	render() {
		return <div className={this.getItemClassNames()} data-id={this.props.id} onClick={this.onFileNavigate}>
			<div className={this.getThumbnailClassNames()} style={this.getThumbnailStyles()}>
				<div className='item__actions'>
					<button
						className='item__actions__action item__actions__action--remove [ font-icon-trash ]'
						type='button'
						onClick={this.onFileDelete}>
					</button>
					<button
						className='item__actions__action item__actions__action--edit [ font-icon-edit ]'
						type='button'
						onClick={this.onFileEdit}>
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
	'onFileDelete': React.PropTypes.func
};

export default FileComponent;
