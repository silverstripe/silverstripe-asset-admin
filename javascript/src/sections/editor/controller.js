import $ from 'jQuery';
import i18n from 'i18n';
import React from 'react';
import SilverStripeComponent from 'silverstripe-component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as galleryActions from '../../state/gallery/actions';
import TextFieldComponent from '../../components/text-field/index';
import CONSTANTS from '../../constants';
import FormAction from 'components/form-action';

class EditorContainer extends SilverStripeComponent {
	constructor(props) {
		super(props);

		const file = this.props.file;

		this.fields = [
			{
				'label': 'Title',
				'name': 'title',
				'value': file === null ? file : file.title
			},
			{
				'label': 'Filename',
				'name': 'basename',
				'value': file === null ? file : file.basename
			}
		];

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onFileSave = this.onFileSave.bind(this);
		this.onFilePublish = this.onFilePublish.bind(this);
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
		this.props.onFileSave(this.props.file.id, this.props.editorFields);

		event.stopPropagation();
		event.preventDefault();
	}

	onFilePublish(event) {
		// Publish
	}

	onCancel(event) {
		this.props.actions.setEditing(null);
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
		this.props.actions.setEditing(null);
	}

	render() {
		if (this.props.file === null || typeof this.props.file === 'undefined') {
			return null;
		}

		return <div className='editor-component'>

			<a 
				className="font-icon-cancel no-text btn btn--close"
				onClick={this.onCancel}
			/>

			<div className='file-details'>
				
				<h2 className="">{this.props.file.title}</h2>
				<p className='header-extra'><small>{this.props.file.attributes.dimensions.width} x {this.props.file.attributes.dimensions.height}px, {this.props.file.size}</small></p>

				<div className='file-preview'>
					<img className='file-preview-thumbnail' src={this.props.file.url} />
					<a href={this.props.file.url} target="_blank" className='file-enlarge font-icon-search no-text'></a>
				</div>

				<ul className="nav nav-tabs" role="tablist">
					<li className="nav-item">
						<a className="nav-link active" data-toggle="tab" href="#details" role="tab">Details</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" data-toggle="tab" href="#usage" role="tab">Usage</a>
					</li>
				</ul>

				<div className="tab-content">
					<div className="tab-pane active" id="details" role="tabpanel">

						{this.props.editorFields.map((field, i) => {
							return <TextFieldComponent
								key={i}
								label={field.label}
								name={field.name}
								value={this.props.file[field.name]}
								onChange={this.onFieldChange} />
						})}

						<div className="form-group">
							<label for="folderLocation">Folder location</label>
							<input type="text" className="form-control" id="folderLocation" placeholder="uploads/folder name/" />
						</div>

						<div className="media form-group break-string">
							<div className="media-left">
								<i className="font-icon-link"></i>
							</div>
							<div className="media-body">
								<a href={this.props.file.url} target='_blank'>{this.props.file.url}</a>
							</div>
						</div>


						<div className="btn-toolbar">
							<div className="btn-group" role="group" aria-label="">
								<FormAction
									type='submit'
									icon='save'
									style='success'
									handleClick={this.onFileSave}
									label={i18n._t('AssetGalleryField.SAVE')}
								/>
								<FormAction
									type='submit'
									icon='rocket'
									style='success'
									handleClick={this.onFilePublish}
									label='Publish'
								/>
							</div>
							<button type="button" data-container="body" className="btn btn-link no-text" data-toggle="popover" title="Page actions" data-placement="top" data-content="<a href=''>Add to campaign</a><a href=''>Remove from campaign</a>"><i className='dot-3'></i></button>
						</div>
					</div>

					<div className="tab-pane" id="usage" role="tabpanel">

						<table className="table table-sm">
							<tbody>
								<tr>
									<td scope="row">{i18n._t('AssetGalleryField.CREATED')} </td>
									<td>{this.props.file.created} by <a href="">Michael</a></td>
								</tr>
								<tr>
									<td scope="row">{i18n._t('AssetGalleryField.LASTEDIT')} </td>
									<td>{this.props.file.lastUpdated} by <a href="">Jack</a></td>
								</tr>
							</tbody>
						</table>

						<table className="table">
						  <thead>
							<tr>
							  <th>#</th>
							  <th>Used on</th>
							  <th>State</th>
							</tr>
						  </thead>
						  <tbody>
							<tr className="bg-primary">
							  <th scope="row">1</th>
							  <td>About us<small className="additional-info">Page</small></td>
							  <td><span className="label label-info">Draft</span></td>
							</tr>
							<tr>
							  <th scope="row">2</th>
							  <td><a href="">My great blog post</a><small className="additional-info">Blog post</small></td>
							  <td><span className="label label-success">Published</span></td>
							</tr>
							<tr>
							  <th scope="row">3</th>
							  <td><a href="">Our services</a><small className="additional-info">Services Page</small></td>
							  <td><span className="label label-success">Published</span></td>
							</tr>
							<tr>
							  <th scope="row">4</th>
							  <td><a href="">June release</a><small className="additional-info">Campaign</small></td>
							  <td></td>
							</tr>
							<tr>
							  <th scope="row">5</th>
							  <td><a href="">Marketing</a><small className="additional-info">Campaign</small></td>
							  <td><span className="label label-warning">Scheduled</span></td>
							</tr>
							<tr>
							  <th scope="row">6</th>
							  <td><a href="">Services section</a><small className="additional-info">Campaign</small></td>
							  <td><span className="label label-success">Published</span></td>
							</tr>
						  </tbody>
						</table>

					</div>
				</div>
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
