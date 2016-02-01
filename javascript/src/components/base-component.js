import React from 'react';
import SilverStripeComponent from 'silverstripe-component';

export default class extends SilverStripeComponent {
	bind(...methods) {
		methods.forEach((method) => this[method] = this[method].bind(this));
	}
}
