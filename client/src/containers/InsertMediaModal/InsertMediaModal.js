import React, { useLayoutEffect, useRef } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import AssetAdmin from 'containers/AssetAdmin/AssetAdmin';
import stateRouter from 'containers/AssetAdmin/stateRouter';
import fileSchemaModalHandler from 'containers/InsertLinkModal/fileSchemaModalHandler';
import * as galleryActions from 'state/gallery/GalleryActions';
import * as modalActions from 'state/modal/ModalActions';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import ModalCloseButton from 'components/Modal/ModalCloseButton';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import getFormSchema from 'lib/getFormSchema';
import qs from 'qs';

const InsertMediaModal = (_props) => {
  const defaultProps = {
    className: '',
    fileAttributes: {},
    type: 'insert-media',
    folderId: 0,
    maxFiles: 1
  };
  const props = {
    ...defaultProps,
    // React class defaultProps also apply when a prop is explicitly undefined (e.g. `type` from connect())
    ...Object.fromEntries(Object.entries(_props).filter(([, value]) => value !== undefined)),
  };
  // Persist the previous props to simulate the `prevProps` argument of componentDidUpdate
  const prevPropsRef = useRef(null);

  // Layout effects keep the class's lifecycle timing (componentDidMount/componentDidUpdate run before parent effects)
  useLayoutEffect(() => {
    const {
      isOpen,
      onBrowse, setOverrides,
      fileAttributes, folderId
    } = props;

    if (!isOpen) {
      onBrowse(folderId || 0);
    } else if (
      typeof setOverrides === 'function'
      && fileAttributes.ID
    ) {
      setOverrides(props);
      onBrowse(folderId, fileAttributes.ID);
    }
  }, []);

  useLayoutEffect(() => {
    const prevProps = prevPropsRef.current;
    prevPropsRef.current = props;
    if (!prevProps) {
      return;
    }
    if (!props.isOpen && prevProps.isOpen) {
      props.onBrowse(props.folderId);
      props.actions.gallery.deselectFiles();
    }
    if (typeof prevProps.setOverrides === 'function' &&
      props.isOpen &&
      !prevProps.isOpen
    ) {
      prevProps.setOverrides(props);
      props.onBrowse(props.folderId, props.fileAttributes ? props.fileAttributes.ID : null);
    }
  });

  /**
   * Generates the properties for the modal
   * @returns {object}
   */
  const getModalProps = () => {
    const { onHide, onInsert, sectionConfig, schemaUrl, className, ...rest } = props;
    return {
      ...rest,
      className: classnames('insert-media-modal', className),
      size: 'lg',
      showCloseButton: false
    };
  };

  /**
   * Handles the insert form submission, does not continue the regular form submission within the
   * asset admin section.
   *
   * @param {object} data
   * @param {string} action
   * @param {function} submitFn
   * @param {object} file
   */
  const handleSubmit = (data, action, submitFn, file) => {
    if (action === 'action_insert') {
      return props.onInsert(data, file);
    }

    // Standard form actions (e.g. publish)
    return submitFn();
  };

  const renderToolbarChildren = () => (
    <ModalCloseButton
      classNames="close insert-media-modal__close-button"
      onClosed={props.onClosed}
    />
  );

  /**
   * Generates the properties for the section
   *
   * @returns {object}
   */
  const getSectionProps = () => ({
    ...props,
    dialog: true,
    toolbarChildren: renderToolbarChildren(),
    onSubmitEditor: handleSubmit,
    onReplaceUrl: props.onBrowse,
  });

  const modalProps = getModalProps();
  const sectionProps = getSectionProps();

  const assetAdmin = (props.isOpen) ? <AssetAdmin {...sectionProps} /> : null;

  return (
    <FormBuilderModal {...modalProps} >
      {assetAdmin}
    </FormBuilderModal>
  );
};

InsertMediaModal.propTypes = {
  sectionConfig: PropTypes.shape({
    url: PropTypes.string,
    form: PropTypes.object,
  }),
  type: PropTypes.oneOf(['insert-media', 'insert-link', 'select', 'admin']),
  schemaUrl: PropTypes.string,
  isOpen: PropTypes.bool,
  setOverrides: PropTypes.func,
  onInsert: PropTypes.func.isRequired,
  fileAttributes: PropTypes.shape({
    ID: PropTypes.number,
    AltText: PropTypes.string,
    Width: PropTypes.number,
    Height: PropTypes.number,
    Loading: PropTypes.string,
    TitleTooltip: PropTypes.string,
    Alignment: PropTypes.string,
    Description: PropTypes.string,
    TargetBlank: PropTypes.bool,
  }),
  requireLinkText: PropTypes.bool,
  folderId: PropTypes.number,
  fileId: PropTypes.number,
  viewAction: PropTypes.string,
  query: PropTypes.object,
  getUrl: PropTypes.func,
  onBrowse: PropTypes.func.isRequired,
  onClosed: PropTypes.func,
  className: PropTypes.string,
  actions: PropTypes.object,
  maxFiles: PropTypes.number,
  fileSelected: PropTypes.bool
};

function mapStateToProps(state, ownProps) {
  const config = ownProps.sectionConfig;

  if (!config) {
    return {};
  }

  let folderId = 0;
  if (ownProps.folderId !== null) {
    folderId = ownProps.folderId;
  } else if (ownProps.folder) {
    folderId = ownProps.folder.id;
  }
  const fileId = (ownProps.fileAttributes) ? ownProps.fileAttributes.ID : ownProps.fileId;

  const formSchema = state.assetAdmin.modal.formSchema;

  const props = {
    config,
    viewAction: ownProps.viewAction,
    folderId,
    type: formSchema && formSchema.type,
    fileId,
  };
  const { schemaUrl, targetId } = getFormSchema(props);

  if (!schemaUrl) {
    return {};
  }

  const queryMap = {};
  if (ownProps.requireLinkText) {
    queryMap.requireLinkText = true;
  }
  if (ownProps.fileSelected) {
    queryMap.fileSelected = true;
  }
  let query = qs.stringify(queryMap);
  query = query ? `?${query}` : '';

  // set schemaUrl for `fileSchemaModalHandler` to load the default form values properly
  // This schema URL is not actually passed down to the Editor, it's just use to set the
  // form schema overrides
  return {
    schemaUrl: `${schemaUrl}/${targetId}${query}`,
    type: formSchema && formSchema.type
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      gallery: bindActionCreators(galleryActions, dispatch),
      modal: bindActionCreators(modalActions, dispatch),
    },
  };
}

export { InsertMediaModal as Component };

export default compose(
  stateRouter,
  connect(mapStateToProps, mapDispatchToProps),
  fileSchemaModalHandler
)(InsertMediaModal);
