import i18n from 'i18n';
import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import * as schemaActions from 'state/schema/SchemaActions';
import PropTypes from 'prop-types';
import { joinUrlPaths } from 'lib/urls';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

const InsertEmbedModal = (_props) => {
  const {
    isOpen,
    onInsert,
    onCreate,
    fileAttributes = {},
    onClosed,
    className = '',
    actions,
    schemaUrl,
    targetUrl,
    onLoadingError,
    FormBuilderModalComponent = FormBuilderModal
  } = _props;

  // Create a props object to pass to FormBuilderModal
  const props = {
    ..._props,
    // Use either the passed in prop values or the default values
    fileAttributes,
    className,
    FormBuilderModalComponent,
  };

  /**
   * Clear any overrides that may be in place
   */
  const clearOverrides = () => {
    actions.schema.setSchemaStateOverrides(schemaUrl, null);
  };

  /**
    * Compares the current properties with received properties and determines if overrides need to be
    * cleared or added.
    *
    * @param {object} obj
    */
  const setOverrides = (obj) => {
    if (schemaUrl !== obj.schemaUrl) {
      clearOverrides();
    }
    if (obj.schemaUrl) {
      const attrs = Object.assign({}, obj.fileAttributes);
      delete attrs.ID;

      const overrides = {
        fields: Object.entries(attrs).map((field) => {
          const [name, value] = field;
          return { name, value };
        }),
      };
      // set overrides into redux store, so that it can be accessed by FormBuilder with the same
      // schemaUrl.
      actions.schema.setSchemaStateOverrides(obj.schemaUrl, overrides);
    }
  };

  /**
   * Handler for when loading the form returns an error
   *
   * @param error
   */
  const handleLoadingError = (error) => {
    if (typeof onLoadingError === 'function') {
      onLoadingError(error);
    }
  };

  /**
    * Capture submission in the form and stop the default submit behaviour
    *
    * @param data
    * @param action
    * @returns {Promise}
    */
  const handleSubmit = (data, action) => {
    switch (action) {
      case 'action_addmedia': {
        onCreate(data);
        break;
      }
      case 'action_insertmedia': {
        onInsert(data);
        break;
      }
      case 'action_cancel': {
        onClosed();
        break;
      }
      default: {
        // noop
      }
    }

    return Promise.resolve();
  };

  /**
    * Generates the properties for the modal
    *
    * @returns {object}
    */
  const getModalProps = () => {
    const modalProps = Object.assign(
      {
        onSubmit: handleSubmit,
        onLoadingError: handleLoadingError,
        showErrorMessage: true,
        responseClassBad: 'alert alert-danger',
        identifier: 'AssetAdmin.InsertEmbedModal',
      },
      props,
      {
        className: `insert-embed-modal ${className}`,
        size: 'lg',
        onClosed,
        title: ((targetUrl)
          ? i18n._t('AssetAdmin.EditTitle', 'Media from the web')
          : i18n._t('AssetAdmin.CreateTitle', 'Insert new media from the web')),
      }
    );
    delete modalProps.sectionConfig;
    delete modalProps.onInsert;
    delete modalProps.fileAttributes;

    return modalProps;
  };

  useEffect(() => {
    setOverrides({ schemaUrl, fileAttributes });
    // cleanup function
    return () => clearOverrides();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setOverrides({ schemaUrl, fileAttributes });
    }
  }, [isOpen]);

  return <FormBuilderModalComponent {...getModalProps()} />;
};

InsertEmbedModal.propTypes = {
  sectionConfig: PropTypes.shape({
    url: PropTypes.string,
    form: PropTypes.object,
  }),
  isOpen: PropTypes.bool,
  onInsert: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  fileAttributes: PropTypes.shape({
    Url: PropTypes.string,
    CaptionText: PropTypes.string,
    PreviewUrl: PropTypes.string,
    Placement: PropTypes.string,
    Width: PropTypes.number,
    Height: PropTypes.number,
  }),
  onClosed: PropTypes.func.isRequired,
  className: PropTypes.string,
  actions: PropTypes.object,
  schemaUrl: PropTypes.string.isRequired,
  targetUrl: PropTypes.string,
  onLoadingError: PropTypes.func,
  FormBuilderModalComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

function mapStateToProps(state, ownProps) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);

  // get the schemaUrl to use as a key for overrides
  const targetUrl = ownProps.fileAttributes ? ownProps.fileAttributes.Url : '';
  const baseEditUrl = sectionConfig.form.remoteEditForm.schemaUrl;

  const editUrl = targetUrl && joinUrlPaths(baseEditUrl, `/?embedurl=${encodeURIComponent(targetUrl)}`);
  const createUrl = sectionConfig.form.remoteCreateForm.schemaUrl;

  const schemaUrl = editUrl || createUrl;

  return {
    sectionConfig,
    schemaUrl,
    targetUrl,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
    },
  };
}

export { InsertEmbedModal as Component };

export default connect(mapStateToProps, mapDispatchToProps)(InsertEmbedModal);
