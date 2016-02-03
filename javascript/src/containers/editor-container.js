import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import SilverStripeComponent from 'silverstripe-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as galleryActions from '../state/gallery/actions';

class EditorContainer extends SilverStripeComponent {
	constructor(props) {
		super(props);

		this.fields = [
			{
				'label': 'Title',
				'name': 'title',
				'value': this.props.file.title
			},
			{
				'label': 'Filename',
				'name': 'basename',
				'value': this.props.file.basename
			}
		];

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onFileSave = this.onFileSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	componentDidMount() {
		super.componentDidMount();

		this.props.actions.setEditorFields(this.fields);
	}
	
	componentWillUnmount() {
		super.componentWillUnmount();
		
		this.props.actions.setEditorFields();
	}

	onFieldChange(event) {
		this.props.actions.updateEditorField({
			name: event.target.name,
			value: event.target.value
		});
	}

	onFileSave(event) {
		this.props.onFileSave(this.props.file.id, this.props.gallery.editorFields, event);
	}

	onCancel(event) {
		this.props.actions.setEditing(false);
	}

	render() {
		return <div className='editor'>
			<div className='CompositeField composite cms-file-info nolabel'>
				<div className='CompositeField composite cms-file-info-preview nolabel'>
					<img className='thumbnail-preview' src={this.props.file.url} />
				</div>
				<div className='CompositeField composite cms-file-info-data nolabel'>
					<div className='CompositeField composite nolabel'>
						<div className='field readonly'>
							<label className='left'>{i18n._t('AssetGalleryField.TYPE')}:</label>
							<div className='middleColumn'>
								<span className='readonly'>{this.props.file.type}</span>
							</div>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.SIZE')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.size}</span>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.URL')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>
								<a href={this.props.file.url} target='_blank'>{this.props.file.url}</a>
							</span>
						</div>
					</div>
					<div className='field date_disabled readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.CREATED')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.created}</span>
						</div>
					</div>
					<div className='field date_disabled readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.LASTEDIT')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.lastUpdated}</span>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>{i18n._t('AssetGalleryField.DIM')}:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.attributes.dimensions.width} x {this.props.file.attributes.dimensions.height}px</span>
						</div>
					</div>
				</div>
			</div>
			{this.props.gallery.editorFields.map((field, i) => {
				return <div className='field text' key={i}>
					<label className='left' htmlFor={'gallery_' + field.name}>{field.label}</label>
					<div className='middleColumn'>
						<input id={'gallery_' + field.name} className="text" type='text' name={field.name} onChange={this.onFieldChange} value={field.value} />
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

EditorContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
