import i18n from 'i18n';
import React, {useState} from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';


const Component = ({isOpen, body, onCancel, onConfirm, actions, ...props}) => {
  return (
    <Modal isOpen={isOpen} toggle={ onCancel }>
      <ModalHeader toggle={ onCancel }>Delete me some files</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        {actions.map(({label, handler, color}) => (
          <Button key={label} color={color} onClick={ handler }>{label}</Button>
        ))}
      </ModalFooter>
    </Modal>
  );
}

export default Component;
