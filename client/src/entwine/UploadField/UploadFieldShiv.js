import React from 'react';
import { connect } from 'react-redux';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import { ConnectedUploadField } from 'components/UploadField/UploadField';

/**
 * Container shiv designed to encapsulate an upload field rendered within an entwine form.
 * Acts as a substitute FormBuilder for a single field type
 */
class UploadFieldShiv extends SilverStripeComponent {
  render() {
    const props = this.getUploadProps();
    return <ConnectedUploadField {...props} />;
  }

  /**
   * Get props to use for this object
   *
   * @returns {*}
   */
  getUploadProps() {
    return Object.assign(
      {},
      this.props.schema,
      this.props.state,
      { data: Object.assign({}, this.props.schema.data || {}, this.props.state.data || {}) }
    );
  }
}

UploadFieldShiv.propTypes = {
  state: React.PropTypes.object,
  schema: React.PropTypes.object,
};

export default connect()(UploadFieldShiv);
