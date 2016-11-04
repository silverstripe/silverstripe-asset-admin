import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';

class InsertMediaModal extends Component {

  render() {
    return <AssetAdmin />;
  }
}

InsertMediaModal.propTypes = {
  onClose: PropTypes.func,
};

export default InsertMediaModal;
