import React from 'react';
import editorActions from '../action/editorActions';

class InputField extends React.Component {

	render() {
		return (
			<input className='text' type='text' value={this.props.value} onChange={this.handleChange.bind(this)} />
		);
	}

	/**
	 * @func handleChange
	 * @param {object} event
	 * @desc Handles the change events on input fields.
	 */
	handleChange(event) {
		editorActions.update({ name: this.props.name, value: event.target.value });
	}

}

export default InputField;
