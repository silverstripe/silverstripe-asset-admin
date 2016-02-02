import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import SilverStripeComponent from 'silverstripe-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as galleryActions from '../state/gallery/actions';

class EditorComponent extends SilverStripeComponent {
	constructor(props) {
		super(props);

		this.state = {
			'title': this.props.gallery.editing.title,
			'basename': this.props.gallery.editing.basename
		};

		this.fields = [
			{
				'label': 'Title',
				'name': 'title',
				'value': this.props.gallery.editing.title,
				'onChange': (event) => this.onFieldChange('title', event)
			},
			{
				'label': 'Filename',
				'name': 'basename',
				'value': this.props.gallery.editing.basename,
				'onChange': (event) => this.onFieldChange('basename', event)
			}
		];

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onFileSave = this.onFileSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	onFieldChange(name, event) {
		this.setState({
			[name]: event.target.value
		});
	}

	onFileSave(event) {
		this.props.onFileSave(this.props.gallery.editing.id, this.state, event);
	}

	onCancel(event) {
		this.props.actions.setEditing(false);
	}

	render() {
		return <div className='editor'>
			<div className='CompositeField composite cms-file-info nolabel'>
				<div className='CompositeField composite cms-file-info-preview nolabel'>
					<img className='thumbnail-preview' src={this.props.gallery.editing.url} />
				</div>
				<div className='CompositeField composite cms-file-info-data nolabel'>
					<div className='CompositeField composite nolabel'>
						<div className='field readonly'>
							<label className='left'>{i18n._t('AssetGalleryField.TYPE')}:</label>
							<div className='middleColumn'>
								<span className='readonly'>{this.props.gallery.editing.type}</span>
							</div>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.SIZE')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.gallery.editing.size}</span>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.URL')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>
								<a href={this.props.gallery.editing.url} target='_blank'>{this.props.gallery.editing.url}</a>
							</span>
						</div>
					</div>
					<div className='field date_disabled readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.CREATED')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.gallery.editing.created}</span>
						</div>
					</div>
					<div className='field date_disabled readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.LASTEDIT')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.gallery.editing.lastUpdated}</span>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.DIM')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.gallery.editing.attributes.dimensions.width} x {this.props.gallery.editing.attributes.dimensions.height}px</span>
						</div>
					</div>
				</div>
			</div>
			{this.fields.map((field, i) => {
				return <div className='field text' key={i}>
					<label className='left' htmlFor={'gallery_' + field.name}>{field.label}</label>
					<div className='middleColumn'>
						<input id={'gallery_' + field.name} className="text" type='text' onChange={field.onChange} value={this.state[field.name]} />
					</div>
				</div>
			})}
			<div>
				<button
					type='submit'
					className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-check-mark"
					onClick={this.onFileSave}>
					{i18n._t('AssetGalleryField.SAVE')}
				</button>
				<button
					type='button'
					className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-cancel-circled"
					onClick={this.onCancel}>
					{i18n._t('AssetGalleryField.CANCEL')}
				</button>
			</div>
		</div>;
	}
}

EditorComponent.propTypes = {
	'file': React.PropTypes.shape({
		'id': React.PropTypes.number,
		'title': React.PropTypes.string,
		'basename': React.PropTypes.string,
		'url': React.PropTypes.string,
		'size': React.PropTypes.string,
		'created': React.PropTypes.string,
		'lastUpdated': React.PropTypes.string,
		'dimensions': React.PropTypes.shape({
			'width': React.PropTypes.number,
			'height': React.PropTypes.number
		})
	}),
	'onFileSave': React.PropTypes.func,
	'onCancel':React.PropTypes.func
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorComponent);
