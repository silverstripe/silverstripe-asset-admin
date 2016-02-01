import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import { bindActionCreators } from 'redux';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as selectedFilesActions from '../state/selected-files/actions'
import * as filesActions from '../state/files/actions'
import constants from '../constants';
import SilverStripeComponent from 'silverstripe-component';

class FileComponent extends SilverStripeComponent {
	constructor(props) {
		super(props);

		this.state = {
			'focussed': false,
			'buttonTabIndex': -1
		};

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
	
	componentDidMount() {
		this.props.actions.addFile(this);
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
		this.props.actions.selectFile({
			id: this.props.id,
			selected: !this.props.selected
		});
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
	
	isSelected() {
		return this.props.selectedFiles.indexOf(this.props.id) > -1;
	}

	getItemClassNames() {
		var itemClassNames = 'item ' + this.props.category;

		if (this.state.focussed) {
			itemClassNames += ' focussed';
		}

		if (this.isSelected()) {
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
		if (event.target !== ReactDOM.findDOMNode(this.refs.thumbnail)) {
			return;
		}
		
		//If space is pressed, allow focus on buttons
		if (this.props.spaceKey === event.keyCode) {
			event.preventDefault(); //Stop page from scrolling
			this.setState({
				'buttonTabIndex': 0
			});
			$(ReactDOM.findDOMNode(this)).find('.item__actions__action').first().focus();
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
		'width': React.PropTypes.number,
		'height': React.PropTypes.number
	}),
	'onFileNavigate': React.PropTypes.func,
	'onFileEdit': React.PropTypes.func,
	'onFileDelete': React.PropTypes.func,
	'spaceKey': React.PropTypes.number,
	'returnKey': React.PropTypes.number,
	'onFileSelect': React.PropTypes.func,
	'selected': React.PropTypes.bool
};

function mapStateToProps(state) {
	return {
		selectedFiles: state.selectedFiles.selectedFiles
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(Object.assign(filesActions, selectedFilesActions), dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FileComponent);
