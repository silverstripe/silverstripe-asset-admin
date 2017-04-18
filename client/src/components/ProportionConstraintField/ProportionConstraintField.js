import React, { PropTypes, Component, Children, cloneElement } from 'react';
import { connect } from 'react-redux';
import Injector from 'lib/Injector';
import { autofill } from 'redux-form';

class ProportionConstraintField extends Component {
  
  componentDidMount() {
  	const childrenArray = Children.toArray(this.props.children);

  	if(childrenArray.length !== 2) {
  		console.error('ProportionConstraintField must be passed two children -- one field for each value');
  	}
  }

  handleChange(childIndex = 0, e) {
  	const {formid, children, data: {ratio}} = this.props;
  	const val = e.target.value;  	
  	const peerIndex = Number(childIndex === 0);
  	const currentName = children[childIndex].props.name;
  	const peerName = children[peerIndex].props.name;
  	const multiplier = childIndex === 0 ? 1/ratio : ratio;
  	const { round } = Math;

  	this.props.onAutofill(currentName, val);
  	this.props.onAutofill(peerName, round(val * multiplier));
  }

  render() {
  	const FieldGroup = Injector.getComponentByName('FieldGroup');
  	const [child1, child2] = Children.toArray(this.props.children);

  	return (
  		<FieldGroup {...this.props}>
  			{this.props.children.map((c, i) => (
  				cloneElement(c, {
  					onChange: this.handleChange.bind(this, i)
  				}, c.props.children)
  			))}
  		</FieldGroup>
  	);
  }
}

ProportionConstraintField.propTypes = {
	ratio: PropTypes.number.isRequired
};

export default ProportionConstraintField;