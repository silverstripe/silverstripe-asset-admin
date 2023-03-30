/* global tinymce, window */
import jQuery from 'jquery';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { loadComponent } from 'lib/Injector';
import ShortcodeSerialiser, { sanitiseShortCodeProperties } from 'lib/ShortcodeSerialiser';
import InsertEmbedModal from 'components/InsertEmbedModal/InsertEmbedModal';
import i18n from 'i18n';

const InjectableInsertEmbedModal = loadComponent(InsertEmbedModal);
const filter = 'div[data-shortcode="embed"]';

/**
 * Embed shortcodes are split into an outer <div> element and an inner <img>
 * placeholder based on the thumbnail url provided by the oembed shortcode provider.
 */
(() => {
  const ssembed = {
    init: (editor) => {
      const insertTitle = i18n._t('AssetAdmin.INSERT_VIA_URL', 'Insert media via URL');
      const editTitle = i18n._t('AssetAdmin.EDIT_MEDIA', 'Edit media');
      const deleteTitle = i18n._t('AssetAdmin.DELETE_MEDIA', 'Delete media');
      const contextTitle = i18n._t('AssetAdmin.MEDIA', 'Media');

      editor.addCommand('ssembed', () => {
        // See HtmlEditorField.js
        jQuery(`#${editor.id}`).entwine('ss').openEmbedDialog();
      });

      editor.addCommand('ssembed-delete', () => {
        const node = editor.selection.getNode();
        // selecting the div correctly
        if (editor.dom.is(node, filter)) {
          node.remove();
        // selecting the image inside the div
        } else if (editor.dom.is(node.parentNode, filter)) {
          node.parentNode.remove();
        // anything else
        } else {
          // eslint-disable-next-line no-console
          console.error({ error: 'Unexpected selection - expected embed', selectedNode: node });
        }
      });

      // Button in main toolbar
      editor.ui.registry.addButton('ssembed', {
        tooltip: insertTitle,
        icon: 'embed',
        onAction: () => editor.execCommand('ssembed'),
        stateSelector: filter
      });

      // Right click context menu item
      editor.ui.registry.addMenuItem('ssembed', {
        text: contextTitle,
        icon: 'embed',
        onAction: () => editor.execCommand('ssembed'),
      });

      // Context menu when an embed is selected
      // edit button
      editor.ui.registry.addButton('ssembededit', {
        tooltip: editTitle,
        icon: 'edit-block',
        onAction: () => editor.execCommand('ssembed'),
      });
      // delete button
      editor.ui.registry.addButton('ssembeddelete', {
        tooltip: deleteTitle,
        icon: 'remove',
        onAction: () => editor.execCommand('ssembed-delete'),
      });
      // actual menu
      editor.ui.registry.addContextToolbar('ssembed', {
        predicate: (node) => editor.dom.is(node, filter),
        position: 'node',
        scope: 'node',
        items: 'alignleft aligncenter alignright | ssembededit ssembeddelete'
      });

      // Replace the tinymce default media commands with the ssembed command
      editor.on('BeforeExecCommand', (e) => {
        const cmd = e.command;
        const ui = e.ui;
        const val = e.value;
        if (cmd === 'mceMedia') {
          e.preventDefault();
          editor.execCommand('ssembed', ui, val);
        }
      });

      editor.on('GetContent', (o) => {
        const content = jQuery(`<div>${o.content}</div>`);

        // Transform [embed] shortcodes
        content
          .find(filter)
          .each(function replaceWithShortCode() {
            // Note: embed <div> contains placeholder <img>, and potentially caption <p>
            const embed = jQuery(this);
            // If placeholder has been removed, remove data-* properties and
            // convert to non-shortcode div
            const placeholder = embed.find('img.placeholder');
            if (placeholder.length === 0) {
              embed.removeAttr('data-url');
              embed.removeAttr('data-shortcode');
              return;
            }

            // Find nested element data
            const caption = embed.find('.caption').text();
            const width = parseInt(placeholder.attr('width'), 10);
            const height = parseInt(placeholder.attr('height'), 10);
            const url = embed.data('url');
            const properties = sanitiseShortCodeProperties({
              url,
              thumbnail: placeholder.prop('src'),
              class: embed.prop('class'),
              width: isNaN(width) ? null : width,
              height: isNaN(height) ? null : height,
              caption,
            });
            const shortCode = ShortcodeSerialiser.serialise({
              name: 'embed',
              properties,
              wrapped: true,
              content: properties.url
            });
            embed.replaceWith(shortCode);
          });

        // eslint-disable-next-line no-param-reassign
        o.content = content.html();
      });
      editor.on('BeforeSetContent', (o) => {
        let content = o.content;

        // Transform [embed] tag
        let match = ShortcodeSerialiser.match('embed', true, content);
        while (match) {
          const data = match.properties;

          // Add base div
          const base = jQuery('<div/>')
            .attr('data-url', data.url || match.content)
            .attr('data-shortcode', 'embed')
            .addClass(data.class)
            .addClass('ss-htmleditorfield-file embed');

          // Add placeholder
          const placeholder = jQuery('<img />')
            .attr('src', data.thumbnail)
            .addClass('placeholder');

          // Set dimensions
          if (data.width) {
            placeholder.attr('width', data.width);
          }
          if (data.height) {
            placeholder.attr('height', data.height);
          }

          base.append(placeholder);

          // Add caption p tag
          if (data.caption) {
            const caption = jQuery('<p />')
              .addClass('caption')
              .text(data.caption);
            base.append(caption);
          }

          // Inject into code
          content = content.replace(match.original, (jQuery('<div/>').append(base).html()));

          // Search for next match
          match = ShortcodeSerialiser.match('embed', true, content);
        }

        // eslint-disable-next-line no-param-reassign
        o.content = content;
      });

      // getMetadata method on a returned object is used by the "help" plugin
      return {
        getMetadata() {
          return {
            name: 'Silverstripe Embed',
            url: 'https://docs.silverstripe.org/en/4/developer_guides/forms/field_types/htmleditorfield',
          };
        }
      };
    },
  };

  tinymce.PluginManager.add('ssembed', (editor) => ssembed.init(editor));
})();

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot #insert-embed-react__dialog-wrapper').entwine({
    Element: null,

    Data: {},

    ReactRoot: null,

    onunmatch() {
      // solves errors given by ReactDOM "no matched root found" error.
      this._clearModal();
    },

    _clearModal() {
      const root = this.getReactRoot();
      if (root) {
        root.unmount();
        this.setReactRoot(null);
      }
      // this.empty();
    },

    open() {
      this._renderModal(true);
    },

    close() {
      this.setData({});
      this._renderModal(false);
    },

    /**
     * Renders the react modal component
     *
     * @param {boolean} isOpen
     * @private
     */
    _renderModal(isOpen) {
      const handleHide = () => this.close();
      // Inserts embed into page
      const handleInsert = (...args) => this._handleInsert(...args);
      // Create edit form from url
      const handleCreate = (...args) => this._handleCreate(...args);
      const handleLoadingError = (...args) => this._handleLoadingError(...args);
      const attrs = this.getOriginalAttributes();

      // create/update the react component
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
      }
      root.render(
        <InjectableInsertEmbedModal
          isOpen={isOpen}
          onCreate={handleCreate}
          onInsert={handleInsert}
          onClosed={handleHide}
          onLoadingError={handleLoadingError}
          bodyClassName="modal__dialog"
          className="insert-embed-react__dialog-wrapper"
          fileAttributes={attrs}
        />
      );
      this.setReactRoot(root);
    },

    _handleLoadingError() {
      this.setData({});
      this.open();
    },

    /**
     * Handles inserting the selected file in the modal
     *
     * @param {object} data
     * @returns {Promise}
     * @private
     */
    _handleInsert(data) {
      const oldData = this.getData();
      this.setData(Object.assign({ Url: oldData.Url }, data));
      this.insertRemote();
      this.close();
    },

    _handleCreate(data) {
      this.setData(Object.assign({}, this.getData(), data));
      this.open();
    },

    /**
     * Find the selected node and get attributes associated to attach the data to the form
     *
     * @returns {object}
     */
    getOriginalAttributes() {
      const data = this.getData();
      const $field = this.getElement();
      if (!$field) {
        return data;
      }

      const node = $($field.getEditor().getSelectedNode());
      if (!node.length) {
        return data;
      }

      // Find root embed shortcode
      const element = node.closest(filter).add(node.filter(filter));
      if (!element.length) {
        return data;
      }
      const image = element.find('img.placeholder');
      // If image has been removed then this shortcode is invalid
      if (image.length === 0) {
        return data;
      }

      const caption = element.find('.caption').text();
      const width = parseInt(image.width(), 10);
      const height = parseInt(image.height(), 10);

      return {
        Url: element.data('url') || data.Url,
        CaptionText: caption,
        PreviewUrl: image.attr('src'),
        Width: isNaN(width) ? null : width,
        Height: isNaN(height) ? null : height,
        Placement: this.findPosition(element.prop('class')),
      };
    },

    /**
     * Calculate placement from css class
     */
    findPosition(cssClass) {
      const alignments = [
        'leftAlone',
        'center',
        'rightAlone',
        'left',
        'right',
      ];
      if (typeof cssClass !== 'string') {
        return '';
      }
      const classes = cssClass.split(' ');
      return alignments.find((alignment) => (
        classes.indexOf(alignment) > -1
      ));
    },

    insertRemote() {
      const $field = this.getElement();
      if (!$field) {
        return false;
      }
      const editor = $field.getEditor();
      if (!editor) {
        return false;
      }

      const data = this.getData();

      // Add base div
      const base = jQuery('<div/>')
        .attr('data-url', data.Url)
        .attr('data-shortcode', 'embed')
        .addClass(data.Placement)
        .addClass('ss-htmleditorfield-file embed');

      // Add placeholder image
      const placeholder = jQuery('<img />')
        .attr('src', data.PreviewUrl)
        .addClass('placeholder');

      // Set dimensions
      if (data.Width) {
        placeholder.attr('width', data.Width);
      }
      if (data.Height) {
        placeholder.attr('height', data.Height);
      }

      // Add to base
      base.append(placeholder);

      // Add caption p tag
      if (data.CaptionText) {
        const caption = jQuery('<p />')
          .addClass('caption')
          .text(data.CaptionText);
        base.append(caption);
      }

      // Find best place to put this embed
      const node = $(editor.getSelectedNode());
      let replacee = $(null);
      if (node.length) {
        replacee = node.filter(filter);

        // Find find closest existing embed
        if (replacee.length === 0) {
          replacee = node.closest(filter);
        }

        // Fail over to check if the node is an image
        if (replacee.length === 0) {
          replacee = node.filter('img.placeholder');
        }
      }

      // Inject
      if (replacee.length) {
        replacee.replaceWith(base);
      } else {
        // Otherwise insert the whole HTML content
        editor.repaint();
        editor.insertContent($('<div />').append(base.clone()).html(), { skip_undo: 1 });
      }

      editor.addUndo();
      editor.repaint();

      return true;
    },
  });
});
