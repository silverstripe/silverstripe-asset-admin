import React from 'react';
import SilverStripeComponent from 'silverstripe-component';

class TextFieldComponent extends SilverStripeComponent {

	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		return (
			<div className='form-group'>
				{this.props.label &&
					<label htmlFor={'gallery_' + this.props.name}>
						{this.props.label}
					</label>
				}
				<input {...this.getInputProps()} />
			</div>
		);
	}

	getInputProps() {
		return {
			className: ['form-control', this.props.extraClass].join(' '),
			id: `gallery_${this.props.name}`,
			name: this.props.name,
			onChange: this.props.onChange,
			type: 'text',
			value: this.props.value
		};
	}

	handleChange(event) {
		if (typeof this.props.onChange === 'undefined') {
			return;
		}

		this.props.onChange();
	}
}

TextFieldComponent.propTypes = {
	label: React.PropTypes.string,
	extraClass: React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func,
	value: React.PropTypes.string
};

export default TextFieldComponent;
