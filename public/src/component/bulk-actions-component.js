import $ from 'jquery';
import React from 'react';
import BaseComponent from './base-component';

export default class BulkActionsComponent extends BaseComponent {

	constructor(props) {
		super(props);

		this.bind(
			'onChangeValue'
		);

		this.state = {
			'value': ''
		};
	}

	componentDidMount() {
		var $select = $(React.findDOMNode(this)).find('.dropdown'),
			leftVal = leftVal = $('.cms-content-toolbar:visible').width() + 12,
			backButton = $('.gallery .font-icon-level-up');

		if (backButton.length > 0) {
			leftVal += backButton.width() + 24;
		}

		$(React.findDOMNode(this)).css({
			left: leftVal
		});

		$select.chosen({
			'allow_single_deselect': true,
			'disable_search_threshold': 20
		});

		// Chosen stops the change event from reaching React so we have to simulate a click.
		$select.change(() => React.addons.TestUtils.Simulate.click($select.find(':selected')[0]));
	}

	render() {
		return <div className="gallery__bulk fieldholder-small">
			<select className="dropdown no-change-track no-chzn" data-placeholder={this.props.placeholder} style={{width: '160px'}}>
				<option selected disabled hidden value=''></option>
				{this.props.options.map((option, i) => {
					return <option key={i} onClick={this.onChangeValue} value={option.value}>{option.label}</option>;
				})}
			</select>
		</div>;
	}

	getOptionByValue(value) {
		for (let option of this.props.options) {
			if (option.value === value) {
				return option;
			}
		}

		return null;
	}

	applyAction(value) {
		// Delete the files...
	}

	onChangeValue(event) {
		var option = this.getOptionByValue(event.target.value);

		// Make sure a valid option has been selected.
		if (option === null) {
			return;
		}

		this.setState({ value: option.value });

		if (option.destructive === true) {
			if (confirm(ss.i18n.sprintf(ss.i18n._t('AssetGalleryField.BULK_ACTIONS_CONFIRM'), option.label))) {
				this.applyAction(option.value);
			}
		} else {
			this.applyAction(option.value);
		}
	}
};
