import React, { PropTypes, Component, Children, cloneElement } from 'react';
import { inject } from 'lib/Injector';

class ProportionConstraintField extends Component {
  constructor(props) {
    super(props);
    const childrenArray = Children.toArray(props.children);

    if (childrenArray.length !== 2) {
      throw new Error('ProportionConstraintField must be passed two children -- one field for each value');
    }
  }

  /**
   * The overloading function for change handlers provided to the children
   *
   * @param {Number} childIndex
   * @param {Event} e
   */
  handleChange(childIndex, e) {
    const { children, active, onAutofill, data: { ratio } } = this.props;
    const value = e.target.value;
    const peerIndex = (childIndex === 0) ? 1 : 0;
    const currentName = children[childIndex].props.name;
    const peerName = children[peerIndex].props.name;
    const multiplier = childIndex === 0 ? 1 / ratio : ratio;
    const { round } = Math;

    onAutofill(currentName, value);
    // retain aspect ratio only when this field is active
    if (active) {
      onAutofill(peerName, round(value * multiplier));
    }
  }

  render() {
    const { FieldGroup } = this.props;
    return (
      <FieldGroup {...this.props}>
        {this.props.children.map((child, key) => (
          cloneElement(child, {
            // overload the children change handler
            onChange: (e) => this.handleChange(key, e),
            key,
          }, child.props.children)
        ))}
      </FieldGroup>
    );
  }
}

ProportionConstraintField.propTypes = {
  children: PropTypes.array,
  onAutofill: PropTypes.func,
  active: PropTypes.bool,
  data: PropTypes.shape({
    ratio: PropTypes.number.isRequired,
  }),
  FieldGroup: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};

ProportionConstraintField.defaultProps = {
  active: true,
};

export { ProportionConstraintField as Component };

export default inject(['FieldGroup'])(ProportionConstraintField);
