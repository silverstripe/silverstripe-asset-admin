import i18n from 'i18n';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import * as editorActions from 'state/editor/EditorActions';
import FormBuilder from 'components/FormBuilder/FormBuilder';
import CONSTANTS from 'constants/index';
import AddToCampaignModal from 'components/AddToCampaignModal/AddToCampaignModal';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleCancelKeyDown = this.handleCancelKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmitFile = this.handleSubmitFile.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.closeModals = this.closeModals.bind(this);
  }

  getCancelButton() {
    return (<a
      tabIndex="0"
      className="btn btn--top-right btn--no-text font-icon-cancel btn--icon-xl"
      onClick={this.handleClose}
      onKeyDown={this.handleCancelKeyDown}
      type="button"
      aria-label={i18n._t('AssetAdmin.CANCEL')}
    />);
  }

  handleAction(event, name) {
    // intercept the Add to Campaign submit and open the modal dialog instead
    if (name === 'action_addtocampaign') {
      this.props.actions.updateAddToCampaignModal(true);
      event.preventDefault();
    }
  }

  /**
   * Trigger handleClose if either the return key or space key is pressed
   * @param {object} event
   */
  handleCancelKeyDown(event) {
    if (event.keyCode === CONSTANTS.SPACE_KEY_CODE || event.keyCode === CONSTANTS.RETURN_KEY_CODE) {
      this.handleClose(event);
    }
  }

  handleSubmitFile(event, fieldValues, submitFn) {
    if (typeof this.props.handleSubmit === 'function') {
      return this.props.handleSubmit(event, fieldValues, submitFn);
    }

    event.preventDefault();
    return submitFn();
  }

  closeModals() {
    this.props.actions.updateAddToCampaignModal(false);
  }

  handleClose(event) {
    this.props.onClose();
    this.closeModals();

    if (event) {
      event.preventDefault();
    }
  }

  render() {
    const schemaUrl = `${this.props.editFileSchemaUrl}/${this.props.fileId}`;

    return (<div className="editor form--no-dividers container-fluid">
      { this.getCancelButton() }

      <div className="editor__details">
        <FormBuilder
          schemaUrl={schemaUrl}
          handleSubmit={this.handleSubmitFile}
          handleAction={this.handleAction}
        />
        <AddToCampaignModal
          fileId={this.props.fileId}
          show={this.props.openAddCampaignModal}
          handleHide={this.closeModals}
          schemaUrl={this.props.addToCampaignSchemaUrl}
        />
      </div>

    </div>);
  }

}

Editor.propTypes = {
  fileId: React.PropTypes.number.isRequired,
  actions: React.PropTypes.object,
  onClose: React.PropTypes.func.isRequired,
  handleSubmit: React.PropTypes.func,
  editFileSchemaUrl: React.PropTypes.string.isRequired,
  addToCampaignSchemaUrl: React.PropTypes.string,
  openAddCampaignModal: React.PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    openAddCampaignModal: state.assetAdmin.editor.openAddCampaignModal,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(editorActions, dispatch),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Editor));

