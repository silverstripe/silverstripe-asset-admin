/* global confirm */
import i18n from 'i18n';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { PropTypes, Component } from 'react';
import CONSTANTS from 'constants/index';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as UnsavedFormsActions from 'state/unsavedForms/UnsavedFormsActions';
import fileShape from 'lib/fileShape';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleCancelKeyDown = this.handleCancelKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleLoadingSuccess = this.handleLoadingSuccess.bind(this);
    this.handleLoadingError = this.handleLoadingError.bind(this);
    this.handleFetchingSchema = this.handleFetchingSchema.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);

    this.state = {
      openModal: false,
      loadingForm: false,
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
      const message = i18n._t('AssetAdmin.CONFIRMUNPUBLISH', 'Are you sure you want to unpublish this record?');
      // eslint-disable-next-line no-alert
      if (!confirm(message)) {
        // @todo go back to using graphql when form schema state consistency can be achieved
        // this.props.onUnpublish(data.ID);
        event.preventDefault();
      }
      return;
    }

    if (name === 'action_delete') {
      // Customise message based on usage
      let message = i18n._t('AssetAdmin.CONFIRMDELETE', 'Are you sure you want to delete this record?');
      if (this.props.file && this.props.file.inUseCount > 0) {
        message = i18n.sprintf(
          i18n._t(
            'AssetAdmin.BULK_ACTIONS_DELETE_SINGLE_CONFIRM',
            'This file is currently used in %s place(s), are you sure you want to delete it?'
          ),
          this.props.file.inUseCount
        );
        message += '\n\n';
        message += i18n._t(
          'AssetAdmin.BULK_ACTIONS_DELETE_WARNING',
          'Ensure files are removed from content areas prior to deleting them,'
          + ' otherwise they will appear as broken links.'
        );
      }
      // eslint-disable-next-line no-alert
      if (confirm(message)) {
        this.props.actions.unsavedForms.removeFormChanged('AssetAdmin.EditForm');
        this.props.onDelete([data.ID]);
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
    this.setState({
      loadingForm: false,
      loadingError: exception.errors[0],
    });
  }

  handleLoadingSuccess() {
    this.setState({
      loadingForm: false,
      loadingError: null,
    });
  }

  handleFetchingSchema() {
    this.setState({
      loadingForm: true,
    });
  }

  renderCancelButton() {
    return (<a
      role="button"
      tabIndex={0}
      className="btn btn--close-panel btn--no-text font-icon-cancel btn--icon-xl"
      onClick={this.handleClose}
      onKeyDown={this.handleCancelKeyDown}
      type="button"
      aria-label={i18n._t('AssetAdmin.CANCEL')}
    />);
  }

  render() {
    let urlQueryString = this.props.schemaUrlQueries
      .map(query => `${query.name}=${query.value}`)
      .join('&')
      .trim();
    urlQueryString = urlQueryString ? `?${urlQueryString}` : '';
    const formSchemaUrl = `${this.props.schemaUrl}/${this.props.targetId}${urlQueryString}`;
    const modalSchemaUrl = `${this.props.addToCampaignSchemaUrl}/${this.props.targetId}`;
    const editorClasses = [
      'panel', 'form--no-dividers', 'editor',
    ];
    if (this.props.className) {
      editorClasses.push(this.props.className);
    }

    let error = null;
    if (this.state.loadingError) {
      let message = this.state.loadingError.value;
      if (this.state.loadingError.code === 404) {
        message = i18n._t('AssetAdmin.FILE_MISSING', 'File cannot be found');
      }
      if (!message) {
        message = i18n._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred');
      }
      error = (
        <div className="editor__file-preview-message--file-missing">{message}</div>
      );
    }
    const campaignTitle = i18n._t('Admin.ADD_TO_CAMPAIGN', 'Add to campaign');

    return (<div className={editorClasses.join(' ')}>
      <div className="editor__details fill-height">
        <FormBuilderLoader
          identifier="AssetAdmin.EditForm"
          schemaUrl={formSchemaUrl}
          afterMessages={this.renderCancelButton()}
          onSubmit={this.handleSubmit}
          onAction={this.handleAction}
          onLoadingSuccess={this.handleLoadingSuccess}
          onLoadingError={this.handleLoadingError}
          onFetchingSchema={this.handleFetchingSchema}
        />
        {error}
        <FormBuilderModal
          title={campaignTitle}
          identifier="AssetAdmin.AddToCampaign"
          show={this.state.openModal}
          onHide={this.closeModal}
          schemaUrl={modalSchemaUrl}
          bodyClassName="modal__dialog"
          responseClassBad="modal__response modal__response--error"
          responseClassGood="modal__response modal__response--good"
        />
        { this.state.loadingForm && [
          <div key="overlay" className="cms-content-loading-overlay ui-widget-overlay-light" />,
          <div key="spinner" className="cms-content-loading-spinner" />,
        ]}
      </div>

    </div>);
  }
}

Editor.propTypes = {
  file: fileShape,
  className: PropTypes.string,
  targetId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  // onUnpublish: PropTypes.func.isRequired,
  schemaUrl: PropTypes.string.isRequired,
  schemaUrlQueries: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.any,
  })),
  addToCampaignSchemaUrl: PropTypes.string,
  actions: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      unsavedForms: bindActionCreators(UnsavedFormsActions, dispatch),
    },
  };
}

export { Editor as Component };

export default connect(() => ({}), mapDispatchToProps)(Editor);
