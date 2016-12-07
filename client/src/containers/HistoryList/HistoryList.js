import React, { Component } from 'react';
import backend from 'lib/Backend';
import Config from 'lib/Config';
import HistoryItem from 'containers/HistoryList/HistoryItem';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';

export class HistoryList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      detailView: null,
      history: [],
      /* TODO loading */
      loadedDetails: true,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleBack = this.handleBack.bind(this);


    const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin');
    this.props.historySchemaUrl = sectionConfig.form.FileHistoryForm.schemaUrl;

    this.api = this.createEndpoint(sectionConfig.historyEndpoint);
  }

  componentDidMount() {
    this.refreshHistoryIfNeeded();
  }

  componentDidUpdate(prevProps) {
    this.refreshHistoryIfNeeded(prevProps);
  }

  /**
   * @returns {string} class
   */
  getContainerClassName() {
    return (this.state.viewDetails && !this.state.loadedDetails)
      ? 'file-history history-container--loading'
      : 'file-history';
  }

  /**
   * Determine if the history list requires a refresh
   *
   * @param {object} prevProps
   */
  refreshHistoryIfNeeded(prevProps) {
    if (!prevProps
      || (prevProps.data.fileId !== this.props.data.fileId)
      || !this.state.history
      || (prevProps.data.latestVersionId !== this.props.data.latestVersionId)
    ) {
      this.api({ fileId: this.props.data.fileId }).then((json) => {
        this.setState({
          history: json,
        });
      });
    }
  }

  /**
   * Click into the history fades out the list and loads in the detail form.
   *
   * @param {number} versionId
   */
  handleClick(versionId) {
    this.setState({
      viewDetails: versionId,
    });
  }

  /**
   * @param {Event} event Event object.
   */
  handleBack(event) {
    event.preventDefault();

    this.setState({
      viewDetails: null,
    });
  }

  /**
   * Create a new endpoint
   *
   * @todo duplication with assetadmin.
   *
   * @param {Object} endpointConfig
   * @param {Boolean} includeToken
   * @returns {Function}
   */
  createEndpoint(endpointConfig, includeToken = true) {
    return backend.createEndpointFetcher(Object.assign(
      {},
      endpointConfig,
      includeToken ? { defaultData: { SecurityID: Config.get('SecurityID') } } : {}
    ));
  }

  render() {
    const containerClassName = this.getContainerClassName();
    if (!this.state.history) {
      return (
        <div className={containerClassName} />
      );
    }

    if (this.state.viewDetails) {
      let schemaUrl = [
        this.props.historySchemaUrl,
        this.props.data.fileId,
        this.state.viewDetails,
      ].join('/');

      let className = [
        'btn btn-secondary',
        'btn--icon-xl btn--no-text',
        'font-icon-left-open-big',
        'file-history__back',
      ].join(' ');

      return (
        <div className={containerClassName}>
          <a className={className} onClick={this.handleBack} />
          <FormBuilderLoader schemaUrl={schemaUrl} />
        </div>
      );
    }

    return (
      <div className={containerClassName}>
        <ul className="list-group list-group-flush file-history__list">
          {this.state.history.map((history) => (
            <HistoryItem
              key={history.versionid}
              {...history}
              onClick={this.handleClick}
            />
          ))}
        </ul>
      </div>
    );
  }
}

HistoryList.propTypes = {
  historySchemaUrl: React.PropTypes.String,
  data: React.PropTypes.object,
};

HistoryList.defaultProps = {
  data: {
    fieldId: 0,
  },
};

export default HistoryList;
