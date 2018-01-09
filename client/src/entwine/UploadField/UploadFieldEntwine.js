/* global window */
import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { schemaMerge } from 'lib/schemaFieldValues';
import { loadComponent } from 'lib/Injector';

const UploadField = loadComponent('UploadField');

/**
 * Shiv for inserting react UploadField into entwine forms
 */
jQuery.entwine('ss', ($) => {
  /**
   * See boot/index.js for `.react-boot` bootstrap
   */
  $('.js-react-boot input.entwine-uploadfield').entwine({
    getContainer() {
      let container = this.siblings('.uploadfield-holder')[0];
      if (!container) {
        const newContainer = $('<div class="uploadfield-holder"></div>');
        this.before(newContainer);

        container = newContainer[0];
      }
      return container;
    },

    onunmatch() {
      this._super();
      // solves errors given by ReactDOM "no matched root found" error.
      ReactDOM.unmountComponentAtNode(this.getContainer());
    },

    onmatch() {
      this._super();
      this.hide();
      this.refresh();
    },

    onclick(e) {
      // we don't want the native upload dialog to show up
      e.preventDefault();
    },

    refresh() {
      const props = this.getAttributes();
      const form = $(this).closest('form');
      const onChange = () => {
        // Trigger change detection (see jquery.changetracker.js)
        setTimeout(() => {
          form.trigger('change');
        }, 0);
      };

      // TODO: rework entwine so that react has control of holder
      ReactDOM.render(
        <UploadField
          {...props}
          onChange={onChange}
          noHolder
        />,
        this.getContainer()
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
      return schemaMerge(schema, state);
    },
  });
});
