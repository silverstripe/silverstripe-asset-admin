import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import constants from '../../constants';
import SilverStripeComponent from 'silverstripe-component';

class FileComponent extends SilverStripeComponent {

	constructor(props) {
		super(props);

		this.handleToggleSelect = this.handleToggleSelect.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleActivate = this.handleActivate.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
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

	getThumbnailClassNames() {
		var thumbnailClassNames = 'item__thumbnail';

		if (this.isImageLargerThanThumbnail()) {
			thumbnailClassNames += ' item__thumbnail--large';
		}

		return thumbnailClassNames;
	}

	getItemClassNames() {
		var itemClassNames = 'item item--' + this.props.item.category;

		if (this.props.selected) {
			itemClassNames += ' item--selected';
		}

		return itemClassNames;
	}

	isImageLargerThanThumbnail() {
		let dimensions = this.props.item.attributes.dimensions;

		return dimensions.height > constants.THUMBNAIL_HEIGHT || dimensions.width > constants.THUMBNAIL_WIDTH;
	}

	handleKeyDown(event) {
		event.stopPropagation();

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

	render() {
		var selectButton;

		selectButton = <button
			className='item__actions__action--select [ font-icon-tick ]'
			type='button'
			title={i18n._t('AssetGalleryField.SELECT')}
			tabIndex='-1'
			onMouseDown={this.preventFocus}
			onClick={this.handleToggleSelect}>
		</button>;

		return (
			<div
				className={this.getItemClassNames()}
				data-id={this.props.item.id}
				tabIndex="0"
				onKeyDown={this.handleKeyDown}
				onClick={this.handleActivate}>
				<div ref="thumbnail" className={this.getThumbnailClassNames()} style={this.getThumbnailStyles()}>
					<div className='item--overlay [ font-icon-edit ]'>View</div>
				</div>
				<div className='item__title' ref="title">
					{this.props.item.title}
					{selectButton}
				</div>
			</div>
		);
	}
}

FileComponent.propTypes = {
	item: React.PropTypes.object.isRequired,
	selected: React.PropTypes.bool.isRequired,
	spaceKey: React.PropTypes.number,
	returnKey: React.PropTypes.number,
	handleActivate: React.PropTypes.func.isRequired,
	handleToggleSelect: React.PropTypes.func.isRequired,
	handleDelete: React.PropTypes.func.isRequired
};

export default FileComponent
