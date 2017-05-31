/* global tinymce */

import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { provideInjector } from 'lib/Injector';
import InsertEmbedModal from 'components/InsertEmbedModal/InsertEmbedModal';

const InjectableInsertEmbedModal = provideInjector(InsertEmbedModal);
const filter = 'div[data-shortcode="embed"]';

/**
 * Embed shortcodes are split into an outer <div> element and an inner <img>
 * placeholder based on the thumbnail url provided by the oembed shortcode provider.
 */
(() => {
  const ssembed = {
    init: (editor) => {
      editor.addButton('ssembed', {
        icon: 'media',
        title: 'Insert Embedded content',
        cmd: 'ssembed',
      });
      editor.addMenuItem('ssembed', {
        icon: 'media',
        text: 'Insert Embedded content',
        cmd: 'ssembed',
      });

      editor.addCommand('ssembed', () => {
        // See HtmlEditorField.js
        jQuery(`#${editor.id}`).entwine('ss').openEmbedDialog();
      });

      // Replace the tinymce default media commands with the ssembed command
      editor.on('BeforeExecCommand', (e) => {
        const cmd = e.command;
        const ui = e.ui;
        const val = e.value;
        if (cmd === 'mceAdvMedia' || cmd === 'mceAdvMedia') {
          e.preventDefault();
          editor.execCommand('ssembed', ui, val);
        }
      });

      editor.on('SaveContent', (o) => {
        const content = jQuery(`<div>${o.content}</div>`);
        // @todo - replace with `lib/ShortcodeSerialiser` library
        const attrsFn = (attrs) => (
          Object.entries(attrs)
            .map(([name, value]) => ((value)
              ? `${name}="${value}"`
              : null
            ))
            .filter((attr) => attr !== null)
            .join(' ')
        );

        // Transform [embed] shortcodes
        content
          .find(filter)
          .each(function replaceWithShortCode() {
            // Note: embed <div> contains placeholder <img>, and potentially caption <p>
            const embed = jQuery(this);
            // If placeholder has been removed, remove data-* properties and
            // convert to non-shortcode dive
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
            const attrs = {
              url,
              thumbnail: placeholder.prop('src'),
              class: embed.prop('class'),
              width: isNaN(width) ? null : width,
              height: isNaN(height) ? null : height,
              caption,
            };
            // @todo - replace with `lib/ShortcodeSerialiser` library
            const shortCode = `[embed ${attrsFn(attrs)}]${url}[/embed]`;
            embed.replaceWith(shortCode);
          });

        // eslint-disable-next-line no-param-reassign
        o.content = content.html();
      });
      editor.on('BeforeSetContent', (o) => {
        // @todo - replace with `lib/ShortcodeSerialiser` library
        let content = o.content;
        const attrFromStrFn = (str) => (
          str
          // Split on all attributes, quoted or not
            .match(/([^\s\/'"=,]+)\s*=\s*(('([^']+)')|("([^"]+)")|([^\s,\]]+))/g)
            .reduce((coll, val) => {
              const match
                = val.match(/^([^\s\/'"=,]+)\s*=\s*(?:(?:'([^']+)')|(?:"([^"]+)")|(?:[^\s,\]]+))$/);
              const key = match[1];
              const value = match[2] || match[3] || match[4]; // single, double, or unquoted match
              return Object.assign({}, coll, { [key]: value });
            }, {})
        );

        // Transform [embed] tag
        const shortTagEmbegRegex = /\[embed(.*?)](.+?)\[\/\s*embed\s*]/gi;
        let matches = shortTagEmbegRegex.exec(content);
        while (matches) {
          const data = attrFromStrFn(matches[1]);

          // Add base div
          const base = jQuery('<div/>')
            .attr('data-url', data.url || matches[2])
            .attr('data-shortcode', 'embed')
            .addClass(data.class)
            .addClass('ss-htmleditorfield-file embed');

          // Add placeholder
          const placeholder = jQuery('<img />')
            .attr('src', data.thumbnail)
            .addClass('placeholder');

          // Set dimensions
          if (data.width) {
            base.width(data.width);
            placeholder.attr('width', data.width);
          }
          if (data.height) {
            // base.height(data.height);
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
          content = content.replace(matches[0], (jQuery('<div/>').append(base).html()));

          // Search for next match
          matches = shortTagEmbegRegex.exec(content);
        }

        // eslint-disable-next-line no-param-reassign
        o.content = content;
      });
    },
  };

  tinymce.PluginManager.add('ssembed', (editor) => ssembed.init(editor));
})();

jQuery.entwine('ss', ($) => {
  $('#insert-embed-react__dialog-wrapper').entwine({
    Element: null,

    Data: {},

    onunmatch() {
      // solves errors given by ReactDOM "no matched root found" error.
      this._clearModal();
    },

    _clearModal() {
      ReactDOM.unmountComponentAtNode(this[0]);
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
     * @param {boolean} show
     * @private
     */
    _renderModal(show) {
      const handleHide = () => this.close();
      // Inserts embed into page
      const handleInsert = (...args) => this._handleInsert(...args);
      // Create edit form from url
      const handleCreate = (...args) => this._handleCreate(...args);
      const handleLoadingError = (...args) => this._handleLoadingError(...args);
      const store = window.ss.store;
      const client = window.ss.apolloClient;
      const attrs = this.getOriginalAttributes();

      // create/update the react component
      ReactDOM.render(
        <ApolloProvider store={store} client={client}>
          <InjectableInsertEmbedModal
            show={show}
            onCreate={handleCreate}
            onInsert={handleInsert}
            onHide={handleHide}
            onLoadingError={handleLoadingError}
            bodyClassName="modal__dialog fill-height"
            className="insert-embed-react__dialog-wrapper"
            fileAttributes={attrs}
          />
        </ApolloProvider>,
        this[0]
      );
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
        base.width(data.Width);
        placeholder.attr('width', data.Width);
      }
      if (data.Height) {
        // Note: Leave height auto sizing on parent, but set height on inner placeholder
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
