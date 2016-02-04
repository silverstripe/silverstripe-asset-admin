import React from 'react';
import SilverStripeComponent from 'silverstripe-component';

export default class TextFieldComponent extends SilverStripeComponent {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }
    render() {
        return <div className='field text'>
            <label className='left' htmlFor={'gallery_' + this.props.name}>{this.props.label}</label>
            <div className='middleColumn'>
                <input
                    id={'gallery_' + this.props.name}
                    className='text'
                    type='text'
                    name={this.props.name}
                    onChange={this.handleChange}
                    value={this.props.value} />
            </div>
        </div>
    }

    handleChange(event) {
        this.props.onChange();
    }
}

TextFieldComponent.propTypes = {
    label: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
};
