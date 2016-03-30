import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import constants from 'constants';
import SilverStripeComponent from 'silverstripe-component';

class FileComponent extends SilverStripeComponent {
	constructor(props) {
		super(props);

		this.handleToggleSelect = this.handleToggleSelect.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleActivate = this.handleActivate.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleCancelUpload = this.handleCancelUpload.bind(this);
		this.preventFocus = this.preventFocus.bind(this);
	}

	/**
	 * Wrapper around this.props.handleActivate
	 *
	 * @param object event - Event object.
	 */
	handleActivate(event) {
		event.stopPropagation();
		this.props.handleActivate(event, this.props.item);
	}

	/**
	 * Wrapper around this.props.handleToggleSelect
	 *
	 * @param object event - Event object.
	 */
	handleToggleSelect(event) {
		event.stopPropagation();
		this.props.handleToggleSelect(event, this.props.item);
	}

	/**
	 * Wrapper around this.props.handleDelete
	 *
	 * @param object event - Event object.
	 */
	handleDelete(event) {
		this.props.handleDelete(event, this.props.item);
	}

	getThumbnailStyles() {
		if (this.props.item.category === 'image') {
			return {'backgroundImage': 'url(' + this.props.item.url + ')'};
		}

		return {};
	}

	/**
	 * Checks if the component has an error set.
	 *
	 * @return boolean
	 */
	hasError() {
		var hasError = false;

		if (Array.isArray(this.props.messages)) {
			hasError = this.props.messages.filter(message => {
				return message.type === 'error'
			}).length > 0;
		}

		return hasError;
	}

	/**
	 * Returns markup for an error message if one is set.
	 */
	getErrorMessage() {
		if (this.hasError()) {
			return <span className='item__error-message'>{this.props.messages[0].value}</span>;
		}

		return null;
	}

	getThumbnailClassNames() {
		var thumbnailClassNames = ['item__thumbnail'];

		if (this.isImageSmallerThanThumbnail()) {
			thumbnailClassNames.push('item__thumbnail--small');
		}

		return thumbnailClassNames.join(' ');
	}

	getItemClassNames() {
		var itemClassNames = [`item item--${this.props.item.category}`];

		if (this.props.selected) {
			itemClassNames.push('item--selected');
		}

		if (this.hasError()) {
			itemClassNames.push('item--error');
		}

		return itemClassNames.join(' ');
	}

	isImageSmallerThanThumbnail() {
		let dimensions = this.props.item.attributes.dimensions;

		return dimensions.height < constants.THUMBNAIL_HEIGHT && dimensions.width < constants.THUMBNAIL_WIDTH;
	}

	handleKeyDown(event) {
		event.stopPropagation();
		event.preventDefault(); //Stop page scrolling if spaceKey is pressed

		//If space is pressed, select file
		if (this.props.spaceKey === event.keyCode) {
			this.handleToggleSelect(event);
		}

		//If return is pressed, navigate folder
		if (this.props.returnKey === event.keyCode) {
			this.handleActivate(event, this.props.item);
		}
	}

	/**
	 * Avoids the browser's default focus state when selecting an item.
	 *
	 * @param object event - Event object.
	 */
	preventFocus(event) {
		event.preventDefault();
	}

	handleCancelUpload(event) {
		event.stopPropagation();

		if (this.hasError()) {
			this.props.handleRemoveErroredUpload(this.props.item);
		} else {
			this.props.handleCancelUpload(this.props.item);
		}
	}

	getProgressBar() {
		var progressBar;

		const progressBarProps = {
			className: 'item__upload-progress__bar',
			style: {
				width: `${this.props.item.progress}%`
			}
		};

		if (!this.hasError() && this.props.uploading) {
			progressBar = <div className='item__upload-progress'><div {...progressBarProps}></div></div>;
		}

		return progressBar;
	}

	render() {
		var actionButton;

		if (this.props.uploading) {
			actionButton = <button
				className='item__actions__action item__actions__action--cancel [ font-icon-cancel ]'
				type='button'
				title={i18n._t('AssetGalleryField.SELECT')}
				tabIndex='-1'
				onMouseDown={this.preventFocus}
				onClick={this.handleCancelUpload}
				data-dz-remove>
			</button>;
		} else {
			actionButton = <button
				className='item__actions__action item__actions__action--select [ font-icon-tick ]'
				type='button'
				title={i18n._t('AssetGalleryField.SELECT')}
				tabIndex='-1'
				onMouseDown={this.preventFocus}
				onClick={this.handleToggleSelect}>
			</button>;
		}

		return (
			<div
				className={this.getItemClassNames()}
				data-id={this.props.item.id}
				tabIndex='0'
				onKeyDown={this.handleKeyDown}
				onClick={this.handleActivate}>
				<div ref='thumbnail' className={this.getThumbnailClassNames()} style={this.getThumbnailStyles()}>
					<div className='item--overlay [ font-icon-edit ]'>View</div>
				</div>
				{this.getProgressBar()}
				{this.getErrorMessage()}
				<div className='item__title' ref='title'>
					{this.props.item.title}
					{actionButton}
				</div>
			</div>
		);
	}
}

FileComponent.propTypes = {
	item: React.PropTypes.shape({
		attributes: React.PropTypes.shape({
			dimensions: React.PropTypes.object.isRequired
		}),
		category: React.PropTypes.string.isRequired,
		id: React.PropTypes.number.isRequired,
		url: React.PropTypes.string,
		title: React.PropTypes.string.isRequired,
		progress: React.PropTypes.number
	}),
	selected: React.PropTypes.bool.isRequired,
	spaceKey: React.PropTypes.number,
	returnKey: React.PropTypes.number,
	handleActivate: React.PropTypes.func.isRequired,
	handleToggleSelect: React.PropTypes.func.isRequired,
	handleDelete: React.PropTypes.func.isRequired,
	messages: React.PropTypes.array,
	uploading: React.PropTypes.bool
};

FileComponent.defaultProps = {
	returnKey: 13,
	spaceKey: 32
};

export default FileComponent
