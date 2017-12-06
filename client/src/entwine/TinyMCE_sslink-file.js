/* global tinymce, ss */
import i18n from 'i18n';
import TinyMCEActionRegistrar from 'lib/TinyMCEActionRegistrar';
import React from 'react';
import ReactDOM from 'react-dom';
import jQuery from 'jquery';
import ShortcodeSerialiser from 'lib/ShortcodeSerialiser';
import InsertMediaModal from 'containers/InsertMediaModal/InsertMediaModal';
import { loadComponent } from 'lib/Injector';

const commandName = 'sslinkfile';

// Link to external url
TinyMCEActionRegistrar
  .addAction('sslink', {
    text: i18n._t('AssetAdmin.LINKLABEL_FILE', 'Link to a file'),
    // eslint-disable-next-line no-console
    onclick: (editor) => editor.execCommand(commandName),
  })
  .addCommandWithUrlTest(commandName, /^\[file_link/);

const plugin = {
  init(editor) {
    editor.addCommand(commandName, () => {
      const field = jQuery(`#${editor.id}`).entwine('ss');

      field.openLinkFileDialog();
    });
  },
};

const modalId = 'insert-link__dialog-wrapper--file';
const InjectableInsertMediaModal = loadComponent(InsertMediaModal);

jQuery.entwine('ss', ($) => {
  // this is required because the React version of e.preventDefault() doesn't work
  // this is to stop React Tabs from navigating the page
  $('.insert-link__dialog-wrapper--internal .nav-link, ' +
  '.insert-media-react__dialog-wrapper .breadcrumb__container a').entwine({
    onclick: (e) => e.preventDefault(),
  });

  $('textarea.htmleditor').entwine({
    openLinkFileDialog() {
      let dialog = $(`#${modalId}`);

      if (!dialog.length) {
        dialog = $(`<div id="${modalId}" />`);
        $('body').append(dialog);
      }
      dialog.addClass('insert-link__dialog-wrapper');

      dialog.setElement(this);
      dialog.open();
    },
  });

  /**
   * Assumes that $('.insert-link__dialog-wrapper').entwine({}); is defined for shared functions
   */
  $(`#${modalId}`).entwine({
    renderModal(show) {
      const handleHide = () => this.close();
      const handleInsert = (...args) => this.handleInsert(...args);
      const attrs = this.getOriginalAttributes();
      const selection = tinymce.activeEditor.selection;
      const selectionContent = selection.getContent() || '';
      const tagName = selection.getNode().tagName;
      const requireLinkText = tagName !== 'A' && selectionContent.trim() === '';

      // create/update the react component
      ReactDOM.render(
        <InjectableInsertMediaModal
          show={show}
          type="insert-link"
          onInsert={handleInsert}
          onHide={handleHide}
          title={false}
          bodyClassName="modal__dialog"
          className="insert-link__dialog-wrapper--internal"
          fileAttributes={attrs}
          requireLinkText={requireLinkText}
        />,
        this[0]
      );
    },

    /**
     * @param {Object} data - Posted data
     * @return {Object}
     */
    buildAttributes(data) {
      const shortcode = ShortcodeSerialiser.serialise({
        name: 'file_link',
        properties: { id: data.ID },
      }, true);

      // Add anchor
      const anchor = data.Anchor && data.Anchor.length ? `#${data.Anchor}` : '';
      const href = `${shortcode}${anchor}`;

      return {
        href,
        target: data.TargetBlank ? '_blank' : '',
        title: data.Description,
      };
    },

    getOriginalAttributes() {
      const editor = this.getElement().getEditor();
      const node = $(editor.getSelectedNode());

      // Get href
      const hrefParts = (node.attr('href') || '').split('#');
      if (!hrefParts[0]) {
        return {};
      }

      // check if file is safe
      const shortcode = ShortcodeSerialiser.match('file_link', false, hrefParts[0]);
      if (!shortcode) {
        return {};
      }

      return {
        ID: shortcode.properties.id ? parseInt(shortcode.properties.id, 10) : 0,
        Anchor: hrefParts[1] || '',
        Description: node.attr('title'),
        TargetBlank: !!node.attr('target'),
      };
    },
  });
});

// Adds the plugin class to the list of available TinyMCE plugins
tinymce.PluginManager.add(commandName, (editor) => plugin.init(editor));

export default plugin;
