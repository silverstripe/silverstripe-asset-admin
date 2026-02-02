import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import backend from 'lib/Backend';
import Config from 'lib/Config';
import HistoryItem from 'containers/HistoryList/HistoryItem';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import PropTypes from 'prop-types';
import i18n from 'i18n';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

/**
 * Create a new endpoint
 *
 * @param {Object} endpointConfig
 * @param {Boolean} includeToken
 * @returns {Function}
 */
const createEndpoint = (endpointConfig, includeToken = true) => (
  backend.createEndpointFetcher(Object.assign(
    {},
    endpointConfig,
    includeToken ? { defaultData: { SecurityID: Config.get('SecurityID') } } : {}
  ))
);

const HistoryList = ({
  sectionConfig,
  historySchemaUrl,
  data = { fieldId: 0 }
}) => {
  const [history, setHistory] = useState([]);
  const [loadedDetails, setLoadedDetails] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const timerRef = useRef(null);
  const api = useMemo(
    () => createEndpoint(sectionConfig.endpoints.history),
    [sectionConfig.endpoints.history]
  );

  /**
   * Determine if the history list requires a refresh
   *
   * @param {object} prevProps
   */
  const refreshHistoryIfNeeded = () => {
    setLoadedDetails(false);
    const fileId = data.fileId;
    clearTimeout(timerRef.current);

    /*
     * This needs a delay/throttle, so this api request tries to be made last in the stack.
     * We also use this to stop an API call happening if the component is going to
     * unmount soon.
     */
    timerRef.current = setTimeout(() => {
      api({
        fileId,
      }).then((historyParam) => {
        // check that timer wasn't nulled out by unmounting
        if (timerRef.current) {
          setHistory(historyParam);
          setLoadedDetails(true);
        }
      });
    }, 250);
  };

  /**
   * Click into the history fades out the list and loads in the detail form.
   *
   * @param {number} versionId
   */
  const handleClick = (versionId) => {
    setViewDetails(versionId);
  };

  /**
   * @param {Event} event Event object.
   */
  const handleBack = (event) => {
    event.preventDefault();
    setViewDetails(null);
  };

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    refreshHistoryIfNeeded();
  }, [data.fileId, data.latestVersionId]);

  if (!loadedDetails) {
    return (
      <div className="history-list history-list--loading">
        Loading...
      </div>
    );
  }

  if (viewDetails) {
    const schemaUrl = [
      historySchemaUrl,
      data.fileId,
      viewDetails,
    ].join('/');

    const backButtonClasses = [
      'btn',
      'btn-secondary',
      'btn--icon-xl',
      'btn--no-text',
      'history-list__back',
    ].join(' ');

    const backButtonText = i18n._t('AssetAdmin.BACK_TO_HISTORY', 'Back to history list');
    return (
      <div className="history-list">
        <a href="#" className={backButtonClasses} onClick={handleBack} title={backButtonText} aria-label={backButtonText}>
          <span className="font-icon-left-open-big" aria-hidden="true" />
        </a>
        <FormBuilderLoader
          identifier="AssetAdmin.HistoryList"
          schemaUrl={schemaUrl}
          formTag="div"
        />
      </div>
    );
  }

  const historyList = history || [];
  return (
    <div className="history-list">
      <ul className="list-group list-group-flush history-list__list">
        {historyList.map((historyParam) => (
          <HistoryItem
            key={historyParam.versionid}
            {...historyParam}
            onClick={handleClick}
          />
        ))}
      </ul>
    </div>
  );
};

HistoryList.propTypes = {
  sectionConfig: PropTypes.shape({
    form: PropTypes.object,
    historyEndpoint: PropTypes.shape({
      url: PropTypes.string,
      method: PropTypes.string,
      responseFormat: PropTypes.string,
    }),
  }),
  historySchemaUrl: PropTypes.string,
  data: PropTypes.object,
};

function mapStateToProps(state) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);
  return {
    sectionConfig,
    historySchemaUrl: sectionConfig.form.fileHistoryForm.schemaUrl,
  };
}

export { HistoryList as Component };

export default connect(mapStateToProps)(HistoryList);
