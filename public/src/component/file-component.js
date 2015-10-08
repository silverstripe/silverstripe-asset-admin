import $ from 'jquery';
import React from 'react';
import classNames from 'classnames';
import constants from '../constants';

export default class extends React.Component {
	render() {
		let itemClassNames = this.getItemClassNames();
		let thumbnailStyles = this.getThumbnailStyles();
		let thumbnailClassNames = this.getThumbnailClassNames();

		var onFileNavigate = () => null;

		if (this.props.type === 'folder') {
			onFileNavigate = (event) => {
				this.props.onFileNavigate(this.props, event);
			}
		}

		let onFileDelete = (event) => {
			this.props.onFileDelete(this.props, event);
		};

		let onFileEdit = (event) => {
			this.props.onFileEdit(this.props, event);
		};

		return <div className={itemClassNames} onClick={onFileNavigate}>
			<div className={thumbnailClassNames} style={thumbnailStyles}>
				<div className='item__actions'>
					<button
						className='item__actions__action item__actions__action--remove [ font-icon-trash ]'
						type='button'
						onClick={onFileDelete}>
					</button>
					<button
						className='item__actions__action item__actions__action--edit [ font-icon-edit ]'
						type='button'
						onClick={onFileEdit}>
					</button>
				</div>
			</div>
			<p className='item__title'>{this.props.title}</p>
		</div>;
	}

	getItemClassNames() {
		var itemClassNames = 'item ' + this.props.type;

		if (this.props.type === 'folder') {
			itemClassNames += ' folder';
		}

		return itemClassNames;
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

	getThumbnailStyles() {
		if (this.props.type.toLowerCase().indexOf('image') > -1) {
			return {
				'backgroundImage': 'url(' + this.props.url + ')'
			};
		}

		return {};
	}
}
