import $ from 'jquery';
import i18n from 'i18n';
import React from 'react';
import BaseComponent from './base-component';

export default class BulkActionsComponent extends BaseComponent {

	constructor(props) {
		super(props);

		this.bind(
			'onChangeValue'
		);
	}

	componentDidMount() {
		var $select = $(React.findDOMNode(this)).find('.dropdown');

		$select.chosen({
			'allow_single_deselect': true,
			'disable_search_threshold': 20
		});

		// Chosen stops the change event from reaching React so we have to simulate a click.
		$select.change(() => React.addons.TestUtils.Simulate.click($select.find(':selected')[0]));
	}

	render() {
		return <div className="gallery__bulk fieldholder-small">
			<select className="dropdown no-change-track no-chzn" tabIndex="0" data-placeholder={this.props.placeholder} style={{width: '160px'}}>
				<option selected disabled hidden value=''></option>
				{this.props.options.map((option, i) => {
					return <option key={i} onClick={this.onChangeValue} value={option.value}>{option.label}</option>;
				})}
			</select>
		</div>;
	}

	getOptionByValue(value) {
		// Using for loop cos IE10 doesn't handle 'for of',
		// which gets transcompiled into a function which uses Symbol,
		// the thing IE10 dies on.
		for (let i = 0; i < this.props.options.length; i += 1) {
			if (this.props.options[i].value === value) {
				return this.props.options[i];
			}
		}

		return null;
	}

	applyAction(value) {
		// We only have 'delete' right now...
		switch (value) {
			case 'delete':
				this.props.backend.delete(this.props.getSelectedFiles());
			default:
				return false;
		}
	}

	onChangeValue(event) {
		var option = this.getOptionByValue(event.target.value);

		// Make sure a valid option has been selected.
		if (option === null) {
			return;
		}
		
		this.setState({ value: option.value });

		if (option.destructive === true) {
			if (confirm(i18n.sprintf(i18n._t('AssetGalleryField.BULK_ACTIONS_CONFIRM'), option.label))) {
				this.applyAction(option.value);
			}
		} else {
			this.applyAction(option.value);
		}

		// Reset the dropdown to it's placeholder value.
		$(React.findDOMNode(this)).find('.dropdown').val('').trigger('liszt:updated');
	}
};
