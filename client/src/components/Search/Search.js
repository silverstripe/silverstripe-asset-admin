import i18n from 'i18n';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse } from 'react-bootstrap-ss';
import * as schemaActions from 'state/schema/SchemaActions';
import { reset, initialize } from 'redux-form';
import { hasSearch } from 'lib/search';

const view = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED',
};

class Search extends SilverStripeComponent {

  constructor(props) {
    super(props);
    this.expand = this.expand.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.doSearch = this.doSearch.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.focusFirstFormField = this.focusFirstFormField.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.open = this.open.bind(this);
    this.state = {
      view: view.NONE,
      searchText: this.props.query && this.props.query.Name || '',
    };
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClick, false);
    this.setOverrides(this.props);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
    this.setOverrides();
  }

  componentWillReceiveProps(props) {
    if (!hasSearch(props.query) && hasSearch(this.props.query)) {
      this.clearFormData(props);
    } else if (JSON.stringify(props.query) !== JSON.stringify(this.props.query)) {
      this.setOverrides(props);
    }
  }

  focusInput() {
    if (this.state.view !== view.NONE) {
      const node = ReactDOM.findDOMNode(this.refs.contentInput);
      // check that it doesn't already have focus
      if (node !== document.activeElement) {
        node.focus();
        node.select();
      }
    }
  }

  focusFirstFormField() {
    if (this.state.view === view.EXPANDED) {
      const form = ReactDOM.findDOMNode(this.refs.contentForm);
      const node = form && form.querySelector('input, textarea, select');
      if (node) {
        node.focus();
        if (node.select) {
          node.select();
        }
      }
    }
  }

  clearFormData(props) {
    this.setState({ searchText: '' });

    const schemaUrl = props && props.searchFormSchemaUrl || this.props.searchFormSchemaUrl;
    if (schemaUrl) {
      this.props.actions.reduxForm.initialize(schemaUrl, {}, Object.keys(this.props.formData));
      this.props.actions.reduxForm.reset(schemaUrl);

      this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
    }
  }

  /**
   * Populate search form with search in case a pre-existing search has been queried
   *
   * @param {Object} props
   */
  setOverrides(props) {
    const search = hasSearch(props.query);
    if (!search || this.props.searchFormSchemaUrl !== props.searchFormSchemaUrl) {
      // clear any overrides that may be in place
      const schemaUrl = props && props.searchFormSchemaUrl || this.props.searchFormSchemaUrl;
      if (schemaUrl) {
        this.props.actions.schema.setSchemaStateOverrides(schemaUrl, null);
      }
    }
    if (search && props.searchFormSchemaUrl) {
      const query = props.query || {};

      const overrides = {
        fields: Object
          .keys(query)
          .filter((name) => (name !== 'AllFolders'))
          .map((name) => {
            const value = query[name];
            return { name, value };
          }),
      };

      // If search is performed and AllFolders is NOT set, flag the "limit to current folder" box
      if (!query.AllFolders) {
        overrides.fields.push({
          name: 'CurrentFolderOnly',
          value: '1',
        });
      }

      // set overrides into redux store, so that it can be accessed by FormBuilder with the same
      // schemaUrl.
      this.props.actions.schema.setSchemaStateOverrides(props.searchFormSchemaUrl, overrides);
    }
  }

  handleClick(event) {
    // If clicking outside this element, hide this node
    const node = ReactDOM.findDOMNode(this);
    if (node && !node.contains(event.target)) {
      this.hide();
    }
  }

  handleChange(event) {
    this.setState({ searchText: event.target.value });
  }

  /**
   * Handle enter key submission in search box
   *
   * @param {Object} event
   */
  handleKeyUp(event) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }

  open() {
    this.show();
    setTimeout(this.focusInput, 50);
  }

  /**
   * Hide this field.
   * When clicking the "X" button
   */
  hide() {
    this.setState({ view: view.NONE });
  }

  /**
   * Show this field.
   * When clicking the green activate "magnifying glass" button
   */
  show() {
    this.setState({ view: view.VISIBLE });
  }

  /**
   * Expand fully form
   */
  expand() {
    this.setState({ view: view.EXPANDED });
  }

  /**
   * When toggling the advanced button
   */
  toggle() {
    switch (this.state.view) {
      case view.VISIBLE:
        this.expand();
        setTimeout(this.focusFirstFormField, 50);
        break;
      case view.EXPANDED:
        this.show();
        break;
      default:
        // noop
    }
  }

  doSearch() {
    const data = {};

    // Merge data from redux-forms with text field
    if (this.state.searchText) {
      data.Name = this.state.searchText;
    }
    // Filter empty values
    Object.keys(this.props.formData).forEach((key) => {
      const value = this.props.formData[key];
      if (!value) {
        return;
      }
      switch (key) {
        case 'SecurityID':
        case 'CurrentFolderOnly':
          break;
        default:
          // Store non-falsey values
          data[key] = value;
          break;
      }
    });

    // Invert "CurrentFolderOnly" into "deep" flag
    if (!this.props.formData.CurrentFolderOnly) {
      data.AllFolders = 1;
    }

    this.props.onSearch(data);
  }

  render() {
    const formId = `${this.props.id}_ExtraFields`;
    const triggerId = `${this.props.id}_Trigger`;
    const searchText = this.state.searchText;

    // Build classes
    const searchClasses = ['search', 'pull-xs-right'];
    const advancedButtonClasses = [
      'btn', 'btn-secondary', 'btn--icon-md', 'btn--no-text',
      'font-icon-down-open', 'search__filter-trigger',
    ];
    let expanded = false;
    switch (this.state.view) {
      case view.EXPANDED:
        expanded = true;
        searchClasses.push('search--active');
        break;
      case view.VISIBLE:
        advancedButtonClasses.push('collapsed');
        searchClasses.push('search--active');
        break;
      case view.NONE:
        advancedButtonClasses.push('collapsed');
        break;
      default:
        // noop
    }

    return (
      <div className={searchClasses.join(' ')}>
        <button
          className="btn btn--no-text btn-secondary font-icon-search btn--icon-large search__trigger"
          type="button"
          title={i18n._t('AssetAdmin.SEARCH', 'Search')}
          aria-owns={this.props.id}
          aria-controls={this.props.id}
          aria-expanded="false"
          onClick={this.open}
          id={triggerId}
        >
        </button>
        <div id={this.props.id} className="search__group">
          <input
            aria-labelledby={triggerId}
            type="text"
            name="Name"
            ref="contentInput"
            placeholder={i18n._t('AssetAdmin.SEARCH', 'Search')}
            className="form-control search__content-field"
            onKeyUp={this.handleKeyUp}
            onChange={this.handleChange}
            value={searchText}
            autoFocus
          />
          <button
            aria-expanded={expanded}
            aria-controls={formId}
            onClick={this.toggle}
            className={advancedButtonClasses.join(' ')}
            title={i18n._t('AssetAdmin.ADVANCED', 'Advanced')}
          >
            <span className="search__filter-trigger-text">{i18n._t('AssetAdmin.ADVANCED', 'Advanced')}</span>
          </button>
          <button
            className="btn btn-primary search__submit font-icon-search btn--icon-large btn--no-text"
            title={i18n._t('AssetAdmin.SEARCH', 'Search')}
            onClick={this.doSearch}
          />
          <button
            onClick={this.hide}
            title={i18n._t('AssetAdmin.CLOSE', 'Close')}
            className="btn font-icon-cancel btn--no-text btn--icon-md search__cancel"
            aria-controls={this.props.id}
            aria-expanded="true"
          >
          </button>

          <Collapse in={expanded}>
            <div id={formId} className="search__filter-panel" ref="contentForm">
              <FormBuilderLoader schemaUrl={this.props.searchFormSchemaUrl} />
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  searchFormSchemaUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  data: PropTypes.object,
  folderId: PropTypes.number,
  onSearch: PropTypes.func.isRequired,
  query: PropTypes.object,
  formData: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  let formData = {};
  const form = state.form[ownProps.searchFormSchemaUrl];
  if (form && form.values) {
    formData = form.values;
  }
  return { formData };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(schemaActions, dispatch),
      reduxForm: bindActionCreators({ reset, initialize }, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
