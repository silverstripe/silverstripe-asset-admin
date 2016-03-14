import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import SilverStripeComponent from 'silverstripe-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as galleryActions from '../../state/gallery/actions';
import TextFieldComponent from '../../components/text-field/index';
import CONSTANTS from '../../constants';

export class EditorContainer extends SilverStripeComponent {
	constructor(props) {
		super(props);

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onFileSave = this.onFileSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
	}

	onFieldChange(event) {
		this.props.actions.updateEditorField({
			name: event.target.name,
			value: event.target.value
		});
	}

	onFileSave(event) {
		this.props.backend.save(this.props.file.id, this.props.editorFields).done(() => {
			window.ss.router.show(CONSTANTS.HOME_ROUTE);
		});
	}

	onCancel(event) {
		window.ss.router.show(CONSTANTS.HOME_ROUTE);
	}

	handleEnterRoute(ctx, next) {
		// If there is no file to edit set the editing file
		// by matching a file id against the id in the URL.
		if (this.props.file === null) {
			this.props.actions.setEditing(this.props.files.filter((file) => file.id === parseInt(ctx.params.id, 10))[0]);
		}
	}

	handleExitRoute(ctx, next) {
		this.props.actions.setEditorFields();
		this.props.actions.setEditing(null);
	}

	render() {
		if (this.props.file === null) {
			return null;
		}

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
			{this.props.editorFields.map((field, i) => {
				return <TextFieldComponent
						key={i}
						label={field.label}
						name={field.name}
						value={field.value}
						onChange={this.onFieldChange} />
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
	file: React.PropTypes.shape({
		id: React.PropTypes.number,
		title: React.PropTypes.string,
		basename: React.PropTypes.string,
		url: React.PropTypes.string,
		size: React.PropTypes.string,
		created: React.PropTypes.string,
		lastUpdated: React.PropTypes.string,
		dimensions: React.PropTypes.shape({
			width: React.PropTypes.number,
			height: React.PropTypes.number
		})
	}),
	backend: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
	return {
		editorFields: state.assetAdmin.gallery.editorFields, // The inputs for editing the file.
		file: state.assetAdmin.gallery.editing, // The file to edit.
		files: state.assetAdmin.gallery.files,
		path: state.assetAdmin.gallery.path // The current location path
	}
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(galleryActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
