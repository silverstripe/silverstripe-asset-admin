import React, {PropTypes} from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';

class Search extends SilverStripeComponent {
  render() {
    return (
      <div className="search pull-xs-right">
        <button
          className="btn btn--no-text btn-secondary font-icon-search btn--icon-large search__trigger"
          type="button"
          title="search"
          aria-owns="SearchGroup"
          aria-controls="SearchGroup"
          aria-expanded="false"
        >
        </button>

        <div id="SearchGroup" className="search__group">
          <input type="text" placeholder="Search" className="form-control search__content-field" />
          <a
            data-toggle="collapse"
            href="#collapseExample2"
            aria-expanded="false"
            aria-controls="collapseExample2"
            className="btn btn-secondary btn--icon-md btn--no-text font-icon-down-open search__filter-trigger collapsed"
          >
            <span className="search__filter-trigger-text">Advanced</span>
          </a>
          <button className="btn btn-primary search__submit font-icon-search btn--icon-large btn--no-text" title="Search" />
          <a href="" className="btn font-icon-cancel btn--no-text btn--icon-md search__cancel">
            <span className="sr-only">Close</span>
          </a>

          {/* TEMP Filter panel start */}
          <div id="collapseExample2" className="collapse search__filter-panel">
            <form className="form--no-dividers">
              <fieldset>
                <div className="form-group field dropdown">
                  <label className="form__field-label">File type</label>
                  <div className="form__field-holder">
                    <select>
                      <option selected="selected">Any
                      </option>
                      <option>Example
                      </option>
                    </select>
                    <div className="chosen-container chosen-container-single chosen-container-single-nosearch">
                      <a className="chosen-single">
                        <span>Any</span>
                        <div>
                          <b></b>
                        </div>
                      </a>
                      <div className="chosen-drop">
                        <div className="chosen-search">
                          <input type="text"></input>
                        </div>
                        <ul className="chosen-results">
                          <li>Bla</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group field field CompositeField fieldgroup">
                  <label className="form__field-label">Last updated</label>
                  <div className="form__fieldgroup form__field-holder field CompositeField fieldgroup">
                    <div className="form__fieldgroup-item field field--small date text">
                      <label className="form__fieldgroup-label">From</label>
                      <input type="text" className="date text"></input>
                    </div>
                    <div className="form__fieldgroup-item field field--small date text">
                      <label className="form__fieldgroup-label">To</label>
                      <input type="text" className="date text"></input>
                    </div>
                  </div>
                </div>

                <div className="checkbox">
                  <label>
                    <input type="checkbox"/>Limit search to current folder and its sub-folders
                  </label>
                </div>
              </fieldset>
            </form>
          </div>
          {/* TEMP Filter panel end */}
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  id: PropTypes.string,
};

export default Search;
