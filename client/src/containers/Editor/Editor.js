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
    this.handleLoadingError = this.handleLoadingError.bind(this);
    this.handleFetchingSchema = this.handleFetchingSchema.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);

    this.state = {
      openModal: false,
      loadingError: null,
    };
  }

  handleAction(event, data) {
    const name = event.currentTarget.name;

    // intercept the Add to Campaign submit and open the modal dialog instead
    if (name === 'action_addtocampaign') {
      this.openModal();
      event.preventDefault();
      return;
    }

    if (name === 'action_unpublish') {
      // eslint-disable-next-line no-alert
      if (confirm(i18n._t('AssetAdmin.CONFIRMUNPUBLISH'))) {
        this.props.onUnpublish(data.ID);
      }
      event.preventDefault();
      return;
    }

    if (name === 'action_delete') {
      // eslint-disable-next-line no-alert
      if (confirm(i18n._t('AssetAdmin.CONFIRMDELETE'))) {
        this.props.onDelete(data.ID);
      }
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

  handleClose(event) {
    this.props.onClose();
    this.closeModal();

    if (event) {
      event.preventDefault();
    }
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

  handleLoadingError(exception) {
    this.setState({ loadingError: exception.errors[0] });
  }

  handleFetchingSchema() {
    this.setState({ loadingError: null });
  }

  renderCancelButton() {
    return (<a
      tabIndex="0"
      className="btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl"
      onClick={this.handleClose}
      onKeyDown={this.handleCancelKeyDown}
      type="button"
      aria-label={i18n._t('AssetAdmin.CANCEL')}
    />);
  }

  render() {
    const formSchemaUrl = `${this.props.schemaUrl}/${this.props.targetId}`;
    const modalSchemaUrl = `${this.props.addToCampaignSchemaUrl}/${this.props.targetId}`;
    const editorClasses = [
      'panel', 'form--no-dividers', 'editor',
    ];
    if (this.props.className) {
      editorClasses.push(this.props.className);
    }

    let error = null;
    if (this.state.loadingError) {
      const message = this.state.loadingError.value;
      error = (
        <div className="editor__file-preview-message--file-missing">
          {(message.includes('Unexpected token < in JSON'))
            ? i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found')
            : message
          }
        </div>
      );
    }

    return (<div className={editorClasses.join(' ')}>
      <div className="editor__details fill-height">
        <FormBuilderLoader
          identifier="AssetAdmin.EditForm"
          schemaUrl={formSchemaUrl}
          afterMessages={this.renderCancelButton()}
          handleSubmit={this.handleSubmit}
          handleAction={this.handleAction}
          onLoadingError={this.handleLoadingError}
          onFetchingSchema={this.handleFetchingSchema}
        />
        {error}
        <FormBuilderModal
          identifier="AssetAdmin.AddToCampaign"
          show={this.state.openModal}
          handleHide={this.closeModal}
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
  dialog: React.PropTypes.bool,
  className: React.PropTypes.string,
  targetId: React.PropTypes.number.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onDelete: React.PropTypes.func.isRequired,
  onUnpublish: React.PropTypes.func.isRequired,
  schemaUrl: React.PropTypes.string.isRequired,
  addToCampaignSchemaUrl: React.PropTypes.string,
  openAddCampaignModal: React.PropTypes.bool,
};

export default Editor;
