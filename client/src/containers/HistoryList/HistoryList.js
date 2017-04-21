import React, { Component } from 'react';
import { connect } from 'react-redux';
import backend from 'lib/Backend';
import Config from 'lib/Config';
import HistoryItem from 'containers/HistoryList/HistoryItem';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';

const sectionConfigKey = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

class HistoryList extends Component {

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

    this.api = this.createEndpoint(props.sectionConfig.historyEndpoint);
  }

  componentDidMount() {
    this.refreshHistoryIfNeeded();
  }

  componentWillReceiveProps(nextProps) {
    // TODO race conditions happening, this should have history state shifted to redux
    this.refreshHistoryIfNeeded(nextProps);
  }

  /**
   * @returns {string} class
   */
  getContainerClassName() {
    return (this.state.viewDetails && !this.state.loadedDetails)
      ? 'history-list history-container--loading'
      : 'history-list';
  }

  /**
   * Determine if the history list requires a refresh
   *
   * @param {object} nextProps
   */
  refreshHistoryIfNeeded(nextProps) {
    if (!nextProps
      || (nextProps.data.fileId !== this.props.data.fileId)
      || (nextProps.data.latestVersionId !== this.props.data.latestVersionId)
    ) {
      this.api({
        fileId: (nextProps) ? nextProps.data.fileId : this.props.data.fileId,
      }).then((history) => {
        this.setState({ history });
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
        'history-list__back',
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
        <ul className="list-group list-group-flush history-list__list">
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
  sectionConfig: React.PropTypes.shape({
    form: React.PropTypes.object,
    historyEndpoint: React.PropTypes.shape({
      url: React.PropTypes.string,
      method: React.PropTypes.string,
      responseFormat: React.PropTypes.string,
    }),
  }),
  historySchemaUrl: React.PropTypes.string,
  data: React.PropTypes.object,
};

HistoryList.defaultProps = {
  data: {
    fieldId: 0,
  },
};

function mapStateToProps(state) {
  const sectionConfig = state.config.sections.find((section) => section.name === sectionConfigKey);
  return {
    sectionConfig,
    historySchemaUrl: sectionConfig.form.fileHistoryForm.schemaUrl,
  };
}

export { HistoryList };

export default connect(mapStateToProps)(HistoryList);
