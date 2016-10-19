import i18n from 'i18n';
import React, { Component } from 'react';
import CONSTANTS from 'constants/index';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleCancelKeyDown = this.handleCancelKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAction = this.handleAction.bind(this);
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

  handleAction(event, data) {
    const name = event.currentTarget.name;

    // intercept the Add to Campaign submit and open the modal dialog instead
    if (name === 'action_addtocampaign') {
      this.openModal();
      event.preventDefault();
      return;
    }

    if (name === 'action_delete') {
      this.props.onDelete(data.ID);
      event.preventDefault();
      return;
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

  /**
   * Catches the <FormBuilderLoader> event to allow custom handling.
   *
   * @param {Object} data
   * @param {String} action
   * @param {Function} submitFn The original submit function
   * @returns {Promise}
   */
  handleSubmit(data, action, submitFn) {
    if (typeof this.props.onSubmit === 'function') {
      return this.props.onSubmit(data, action, submitFn);
    }

    return submitFn();
  }

  handleSubmitModal(data, action, submitFn) {
    if (!data.Campaign) {
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


    return (<div className="panel panel--padded panel--scrollable form--no-dividers editor">
      { this.getCancelButton() }

      <div className="editor__details">
        <FormBuilderLoader
          schemaUrl={formSchemaUrl}
          handleSubmit={this.handleSubmit}
          handleAction={this.handleAction}
        />
        <FormBuilderModal
          show={this.state.openModal}
          handleHide={this.closeModal}
          handleSubmit={this.handleSubmitModal}
          schemaUrl={modalSchemaUrl}
          bodyClassName="modal__dialog"
          responseClassBad="modal__response modal__response--error"
          responseClassGood="modal__response modal__response--good"
        />
      </div>

    </div>);
  }

}

Editor.propTypes = {
  fileId: React.PropTypes.number.isRequired,
  actions: React.PropTypes.object,
  onClose: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  editFileSchemaUrl: React.PropTypes.string.isRequired,
  addToCampaignSchemaUrl: React.PropTypes.string,
  openAddCampaignModal: React.PropTypes.bool,
};

export default Editor;
