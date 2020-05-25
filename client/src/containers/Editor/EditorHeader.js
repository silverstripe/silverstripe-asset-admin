/* global confirm */
import React from 'react';
import i18n from 'i18n';
import Button from 'components/Button/Button';
import BackButton from 'components/Button/BackButton';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const handle = handler => (e => {
  e.preventDefault();
  if (handler) {
    handler();
  }
});

/** Always display the back button */
const ALWAYS_BACK = 'ALWAYS_BACK';

/** Always display the cancel button */
const ALWAYS_CANCEL = 'ALWAYS_CANCEL';

/** Switch between the back and close button based on media queries */
const SWITCH = 'SWITCH';

/** Display the back button, but only under a certain width */
const ONLY_BACK = 'ONLY_BACK';

/** Display the cancel button, but only above a certain width */
const ONLY_CANCEL = 'ONLY_CANCEL';

/** Never display the back or cancel button */
const NONE = 'NONE';

/**
 * List of acceptable values for `showButton`.
 */
export const buttonStates = {
  ALWAYS_BACK,
  ALWAYS_CANCEL,
  SWITCH,
  ONLY_BACK,
  ONLY_CANCEL,
  NONE
};

/**
 * Wraps the form headers with some buttons to switch between different form.
 */
const EditorHeader = ({ onCancel, onDetails, showButton, children }) => {
    const cancelHandler = handle(onCancel);

    const showBack = [
      ALWAYS_BACK,
      SWITCH,
      ONLY_BACK
    ].indexOf(showButton) >= 0;
    const showCancel = [
      ALWAYS_CANCEL,
      SWITCH,
      ONLY_CANCEL
    ].indexOf(showButton) >= 0;

    const backClassName = classnames(
      'editor-header__back-button',
      'btn--icon-xl',
      {
        'editor-header__back-button--md-below': [SWITCH, ONLY_BACK].indexOf(showButton) >= 0
      }
    );

    const cancelClassName = classnames(
      'editor-header__cancel-button',
      'btn--icon-xl',
      {
        'editor-header__cancel-button--lg-above': [SWITCH, ONLY_CANCEL].indexOf(showButton) >= 0
      }
    );

    return (
      <div className="editor-header">
        {showBack && <BackButton className={backClassName} onClick={cancelHandler} />}
        <div className="editor-header__field">
          {children}
        </div>
        {onDetails &&
        <Button onClick={handle(onDetails)} icon="edit-list" className="editor-header__edit" outline>
          {i18n._t('AssetAdmin.DETAILS', 'Details')}
        </Button>
      }
        {showCancel &&
        <div>
          <Button icon="cancel" className={cancelClassName} noText onClick={cancelHandler} >
            {i18n._t('AssetAdmin.CANCEL')}
          </Button>
        </div>
      }
      </div>
  );
};

EditorHeader.propTypes = {
  onCancel: PropTypes.func,
  onDetails: PropTypes.func,
  showButton: PropTypes.oneOf(Object.keys(buttonStates).map(state => buttonStates[state])),
  children: PropTypes.node
};

export default EditorHeader;
