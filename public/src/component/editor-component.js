import $ from 'jquery';
import React from 'react';

export default class extends React.Component {
	render() {
		let textInputs = this.getTextInputs();

		return <div className='editor'>
			<form>
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
					<button type='submit' className="ss-ui-button ui-corner-all font-icon-check-mark">Save</button>
					<button type='button' className="ss-ui-button ui-corner-all font-icon-cancel-circled" onClick={this.props.onListClick}>Cancel</button>
				</div>
			</form>
		</div>;
	}

	getTextInputs() {
		let fields = [
			{'name': 'title', 'value': this.props.file.title},
			{'name': 'filename', 'value': this.props.file.filename}
		];

		return fields.map((field) => {
			return <div className='field text'>
				<label className='left'>{field.name}</label>
				<div className='middleColumn'>
					<input type="text" name={field.name} value={field.value} />
				</div>
			</div>
		});
	}
}
