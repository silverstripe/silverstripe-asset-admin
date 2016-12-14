import i18n from 'i18n';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import FormBuilderLoader from 'containers/FormBuilderLoader/FormBuilderLoader';
import { Collapse } from 'react-bootstrap-ss';

const view = {
  NONE: 'NONE',
  VISIBLE: 'VISIBLE',
  EXPANDED: 'EXPANDED',
};

class Search extends SilverStripeComponent {

  constructor(props) {
    super(props);
    this.expand = this.expand.bind(this);
    this.focus = this.focus.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = { view: view.NONE };
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  handleClick(e) {
    // If clicking outside this element, hide this node
    const node = ReactDOM.findDOMNode(this);
    if (node && !node.contains(e.target)) {
      this.hide();
    }
    /*
         $('.search').removeClass('search--active');
         $('.search__filter-panel').removeClass('collapse in');
         $('.search__filter-trigger').addClass('collapsed');
     */
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
    this.focus();
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
        this.focus();
        break;
      case view.EXPANDED:
        this.show();
        break;
      default:
        // noop
    }
  }

  /**
   * Focus input
   */
  focus() {
    const node = ReactDOM.findDOMNode(this.refs.contentInput);
    node.focus();
    node.select();
  }

  render() {
    const formId = `${this.props.id}_ExtraFields`;

    // Build classes
    const searchClasses = ['search', 'pull-xs-right'];
    const advancedButtonClasses = [
      'btn', 'btn-secondary', 'btn--icon-md', 'btn--no-text', 'font-icon-down-open', 'search__filter-trigger'
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
          title="search"
          aria-owns={this.props.id}
          aria-controls={this.props.id}
          aria-expanded="false"
          onClick={this.show}
        >
        </button>
        <div id={this.props.id} className="search__group">
          <input type="text" ref="contentInput" placeholder="Search" className="form-control search__content-field" />
          <button aria-expanded={expanded} aria-controls={formId} onClick={this.toggle}
            className={advancedButtonClasses.join(' ')}
          >
            <span className="search__filter-trigger-text">
              {i18n._t('SilverStripe\\AssetAdmin\\AssetAdmin.ADVANCED', 'Advanced')}
            </span>
          </button>
          <button
            className="btn btn-primary search__submit font-icon-search btn--icon-large btn--no-text" title="Search"
          />
          <button onClick={this.hide} className="btn font-icon-cancel btn--no-text btn--icon-md search__cancel">
            <span className="sr-only">Close</span>
          </button>

          <Collapse in={expanded}>
            <div id={formId} className="search__filter-panel">
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
};

export default Search;
