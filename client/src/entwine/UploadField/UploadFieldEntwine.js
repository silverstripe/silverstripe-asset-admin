/* global window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { schemaMerge } from 'lib/schemaFieldValues';
import { loadComponent } from 'lib/Injector';

/**
 * Shiv for inserting react UploadField into entwine forms
 */
jQuery.entwine('ss', ($) => {
  /**
   * See boot/index.js for `.react-boot` bootstrap
   */
  $('.js-injector-boot input.entwine-uploadfield').entwine({
    Component: null,
    ReactRoot: null,

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
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
    },

    onmatch() {
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      const UploadField = loadComponent('UploadField', context);
      this.setComponent(UploadField);

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

      const UploadField = this.getComponent();

      // TODO: rework entwine so that react has control of holder
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this.getContainer());
        this.setReactRoot(root);
      }
      root.render(
        <UploadField
          {...props}
          onChange={onChange}
          noHolder
        />
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
