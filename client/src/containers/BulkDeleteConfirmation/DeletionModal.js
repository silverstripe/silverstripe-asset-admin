import i18n from 'i18n';
import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const DeletionModal = ({ isOpen, body, onCancel, actions }) => (
  <Modal isOpen={isOpen} toggle={onCancel}>
    <ModalHeader toggle={onCancel}>
      {i18n._t('AssetAdmin.CONFIRM_FILE_DELETION', 'Confirm file deletion')}
    </ModalHeader>
    <ModalBody>{body}</ModalBody>
    <ModalFooter>
      {actions.map(({ label, handler, color }) => (
        <Button key={label} color={color} onClick={handler}>{label}</Button>
        ))}
    </ModalFooter>
  </Modal>
  );

DeletionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  body: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    handler: PropTypes.func,
    color: PropTypes.string
  }))
};

export default DeletionModal;
