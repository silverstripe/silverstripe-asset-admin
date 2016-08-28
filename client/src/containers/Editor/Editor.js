import i18n from 'i18n';
import React, { Component } from 'react';
import FormBuilder from 'components/FormBuilder/FormBuilder';
import CONSTANTS from 'constants/index';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleCancelKeyDown = this.handleCancelKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmitFile = this.handleSubmitFile.bind(this);
    this.handleActionFile = this.handleActionFile.bind(this);
    this.handleSubmitModal = this.handleSubmitModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);

    this.state = {
      openModal: false,
    };
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

  handleActionFile(event, name) {
    // intercept the Add to Campaign submit and open the modal dialog instead
    if (name === 'action_addtocampaign') {
      this.openModal();
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

  handleSubmitModal(event, fieldValues, submitFn) {
    event.preventDefault();

    if (!fieldValues.Campaign) {
      // TODO invisible submit disable, remove this when validation is implemented
      // eslint-disable-next-line no-alert
      alert(i18n._t(
        'AddToCampaigns.ErrorCampaignNotSelected',
        'There was no campaign selected to be added to'
      ));
      return null;
    }
    return submitFn();
  }

  openModal() {
    this.setState({
      openModal: true,
    });
  }

  closeModal() {
    this.setState({
      openModal: false,
    });
  }

  handleClose(event) {
    this.props.onClose();
    this.closeModal();

    if (event) {
      event.preventDefault();
    }
  }

  render() {
    const formSchemaUrl = `${this.props.editFileSchemaUrl}/${this.props.fileId}`;
    const modalSchemaUrl = `${this.props.addToCampaignSchemaUrl}/${this.props.fileId}`;


    return (<div className="editor form--no-dividers container-fluid">
      { this.getCancelButton() }

      <div className="editor__details">
        <FormBuilder
          schemaUrl={formSchemaUrl}
          handleSubmit={this.handleSubmitFile}
          handleAction={this.handleActionFile}
        />
        <FormBuilderModal
          show={this.state.openModal}
          handleHide={this.closeModal}
          handleSubmit={this.handleSubmitModal}
          schemaUrl={modalSchemaUrl}
          bodyClassName="add-to-campaign__dialog"
          responseClassBad="add-to-campaign__response add-to-campaign__response--error"
          responseClassGood="add-to-campaign__response add-to-campaign__response--good"
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

export default Editor;
