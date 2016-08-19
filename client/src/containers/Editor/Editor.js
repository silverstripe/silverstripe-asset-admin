import i18n from 'i18n';
import React, { Component } from 'react';
import FormBuilder from 'components/FormBuilder/FormBuilder';
import CONSTANTS from 'constants/index';

class Editor extends Component {
  constructor(props) {
    super(props);

    this.handleCancelKeyDown = this.handleCancelKeyDown.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {};
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

  handleClose(event) {
    this.props.onClose();

    event.preventDefault();
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

  handleSubmit(event, fieldValues, submitFn) {
    if (typeof this.props.handleSubmit === 'function') {
      this.props.handleSubmit(event, fieldValues, submitFn);
      return;
    }

    event.preventDefault();
    submitFn();
  }

  render() {
    const schemaUrl = `${this.props.editFileSchemaUrl}/${this.props.fileId}`;

    return (<div className="editor form--no-dividers container-fluid">
      { this.getCancelButton() }

      <div className="editor__details">
        <FormBuilder schemaUrl={schemaUrl} handleSubmit={this.handleSubmit} />
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
};

export default Editor;
