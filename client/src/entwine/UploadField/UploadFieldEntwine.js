import jQuery from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import UploadFieldShiv from 'entwine/UploadField/UploadFieldShiv';

/**
 * Shiv for inserting react UploadField into entwine forms
 */
jQuery.entwine('ss', ($) => {

  /**
   * See boot/index.js for `.react-boot` bootstrap
   */
  $('.react-boot input.entwine-uploadfield').entwine({

    onunmatch() {
      // solves errors given by ReactDOM "no matched root found" error.
      ReactDOM.unmountComponentAtNode(this[0]);
    },

    onmatch() {
      this.refresh();
    },

    refresh() {
      const store = window.ss.store;
      const props = this.getAttributes();
      ReactDOM.render(
        <Provider store={store}>
          <UploadFieldShiv {...props} />
        </Provider>,
        this.parent()[0]
      );
    },

    /**
     * Find the selected node and get attributes associated to attach the data to the form
     *
     * @returns {Object}
     */
    getAttributes() {
      const state = $(this).data('state');
      const schema = $(this).data('schema');
      return { state, schema };
    },
  });
});
