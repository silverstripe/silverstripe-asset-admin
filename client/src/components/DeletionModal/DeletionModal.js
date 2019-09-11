import i18n from 'i18n';
import React from 'react';
import classnames from 'classnames';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import {withApollo} from "react-apollo";
import { inject, injectGraphql } from 'lib/Injector';
import * as confirmDeletionActions from 'state/confirmDeletion/ConfirmDeletionActions';

const Component = ({showConfirmation, actions: {ok, cancel}}) =>
  <Modal isOpen={showConfirmation} toggle={cancel}>
    <ModalHeader toggle={cancel}>Delete me some files</ModalHeader>}
    <ModalBody>
      Let's delete me some files!!!!
    </ModalBody>
    <ModalFooter>
      <Button onClick={ok}>Delete</Button>
      <Button onClick={cancel}>Cancel</Button>
    </ModalFooter>
  </Modal>
;

const mapStateToProps = ({assetAdmin: {confirmDeletion}}) => confirmDeletion;

const mapDispatchToProps = (dispatch) =>  ({
  actions: {
    confirmDeletion: bindActionCreators(confirmDeletionActions, dispatch)
  },
});

export default compose(
  inject(
    ['Loading'],
    (Loading) => ({
      LoadingComponent: Loading
    }),
  ),
  connect(mapStateToProps, mapDispatchToProps),
  // injectGraphql('ReadFilesQuery'),
  (component) => withApollo(component)
)(Component);
