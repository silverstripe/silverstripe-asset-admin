import $ from 'jquery';
import React from 'react';

export default class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'title': this.props.file.title,
			'basename': this.props.file.basename
		};
	}
	render() {
		let textInputs = this.getTextInputs();

		return <div className='editor'>
			<div className='CompositeField composite cms-file-info nolabel'>
				<div className='CompositeField composite cms-file-info-preview nolabel'>
					<img className='thumbnail-preview' src={this.props.file.url} />
				</div>
				<div className='CompositeField composite cms-file-info-data nolabel'>
					<div className='CompositeField composite nolabel'>
						<div className='field readonly'>
							<label className='left'>File type:</label>
							<div className='middleColumn'>
								<span className='readonly'>{this.props.file.type}</span>
							</div>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>File size:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.size}</span>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>URL:</label>
						<div className='middleColumn'>
							<span className='readonly'>
								<a href={this.props.file.url} target='_blank'>{this.props.file.url}</a>
							</span>
						</div>
					</div>
					<div className='field date_disabled readonly'>
						<label className='left'>First uploaded:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.created}</span>
						</div>
					</div>
					<div className='field date_disabled readonly'>
						<label className='left'>Last changed:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.lastUpdated}</span>
						</div>
					</div>
					<div className='field readonly'>
						<label className='left'>Dimensions:</label>
						<div className='middleColumn'>
							<span className='readonly'>{this.props.file.attributes.dimensions.width} x {this.props.file.attributes.dimensions.height}px</span>
						</div>
					</div>
				</div>
			</div>

			{textInputs}

			<div>
				<button type='submit' className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-check-mark" onClick={this.onFileSave.bind(this)}>Save</button>
				<button type='button' className="ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-cancel-circled" onClick={this.props.onListClick}>Cancel</button>
			</div>
		</div>;
	}

	getTextInputs() {
		let fields = [
			{'name': 'title', 'value': this.props.file.title},
			{'name': 'basename', 'value': this.props.file.basename}
		];

		return fields.map((field) => {
			let handler = (event) => {
				this.onFieldChange.call(this, event, field.name);
			};

			return <div className='field text'>
				<label className='left'>{field.name}</label>
				<div className='middleColumn'>
					<input type='text' onChange={handler} value={this.state[field.name]} />
				</div>
			</div>
		});
	}

	onFieldChange(event, name) {
		this.setState({
			[name]: event.target.value
		});
	}

	onFileSave(event) {
		this.props.onFileSave(this.props.file.id, this.state, event);
	}
}
