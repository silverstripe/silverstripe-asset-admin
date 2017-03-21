/* global tinymce */

import jQuery from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';

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
        const content = jQuery(o.content);
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
        content.find('.ss-htmleditorfield-file.embed')
          .add(content.filter('.ss-htmleditorfield-file.embed'))
          .each(function replaceWithShortCode() {
            const image = jQuery(this);
            const width = parseInt(image.attr('width'), 10);
            const height = parseInt(image.attr('height'), 10);
            const attrs = {
              Url: image.data('url'),
              PreviewUrl: image.attr('src'),
              Width: isNaN(width) ? 0 : width,
              Height: isNaN(height) ? 0 : height,
              Placement: image.data('cssclass'),
              thumbnail: image.attr('src'),
              class: image.attr('class'),
            };
            const shortCode = `[embed ${attrsFn(attrs)}]${image.data('url')}[/embed]`;
            image.replaceWith(shortCode);
          });

        // Insert outerHTML in order to retain all nodes incl. <script>
        // tags which would've been filtered out with jQuery.html().
        // Note that <script> tags might be sanitized separately based on editor config.
        // eslint-disable-next-line no-param-reassign
        o.content = '';
        content.each(function appendToContent() {
          if (this.outerHTML !== undefined) {
            // eslint-disable-next-line no-param-reassign
            o.content += this.outerHTML;
          }
        });
      });
      editor.on('BeforeSetContent', (o) => {
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
          const attrs = {
            src: data.PreviewUrl || data.thumbnail,
            width: data.Width || data.width,
            height: data.Height || data.height,
            class: data.class,
            'data-url': data.Url || matches[2],
            'data-cssclass': data.Placement || data.class,
          };
          const el = jQuery('<img/>').attr(attrs).addClass('ss-htmleditorfield-file embed');
          el.addClass(data.Placement);

          content = content.replace(matches[0], (jQuery('<div/>').append(el).html()));
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
      const handleInsert = (...args) => this._handleInsert(...args);
      const handleCreate = (...args) => this._handleCreate(...args);
      const handleLoadingError = (...args) => this._handleLoadingError(...args);
      const store = window.ss.store;
      const client = window.ss.apolloClient;
      const attrs = this.getOriginalAttributes();
      const InsertEmbedModal = window.InsertEmbedModal.default;

      if (!InsertEmbedModal) {
        throw new Error('Invalid Insert embed modal component found');
      }

      // create/update the react component
      ReactDOM.render(
        <ApolloProvider store={store} client={client}>
          <InsertEmbedModal
            show={show}
            onCreate={handleCreate}
            onInsert={handleInsert}
            onHide={handleHide}
            onLoadingError={handleLoadingError}
            bodyClassName="modal__dialog"
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
     * @param {object} file
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
      const $field = this.getElement();
      if (!$field) {
        return {};
      }

      const node = $($field.getEditor().getSelectedNode());
      if (!node.length) {
        return {};
      }
      const data = this.getData();

      const nodeParent = node.parent('.captionImage');
      let element = $(null);
      let image = $(null);

      if (node.hasClass('captionImage')) {
        if (node.children('img').length
          && node.children('.caption').length) {
          element = node;
          image = element.children('img');
        }
      } else if (nodeParent.length) {
        if (nodeParent.children('img').length
          && nodeParent.children('.caption').length) {
          element = nodeParent;
          image = element.children('img');
        }
      } else if (node.is('img')) {
        image = node;
      }

      const caption = element.children('.caption').text();
      const width = parseInt(image.width(), 10);
      const height = parseInt(image.height(), 10);

      const attrs = {
        Url: image.data('url') || data.Url,
        CaptionText: caption,
        PreviewUrl: image.attr('src'),
        Width: isNaN(width) ? 0 : width,
        Height: isNaN(height) ? 0 : height,
        Placement: image.data('cssclass'),
      };

      return attrs;
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
      const node = $(editor.getSelectedNode());

      const data = this.getData();
      const attrs = {
        src: data.PreviewUrl,
        width: data.Width,
        height: data.Height,
        'data-url': data.Url,
        'data-cssclass': data.Placement,
      };

      const nodeParent = node.parent('.captionImage');
      let element = $('<div class="captionImage"><p class="caption"></p></div>');
      let image = $(null);
      let replacee = $(null);

      if (node.hasClass('captionImage')) {
        if (node.children('img').length
          && node.children('.caption').length) {
          element = node;
          image = element.children('img');
        }
        replacee = node;
      } else if (nodeParent.length) {
        if (nodeParent.children('img').length
          && nodeParent.children('.caption').length) {
          element = nodeParent;
          image = element.children('img');
        }
        replacee = nodeParent;
      } else if (node.is('img')) {
        image = replacee = node;
      }

      if (!image.length) {
        image = $('<img />');
      }

      image
        .attr(attrs)
        // cleans up class, removes previously set Placement value
        .attr('class', `${data.Placement} ss-htmleditorfield-file embed`);

      if (data.CaptionText) {
        element
          .prepend(image)
          .attr('class', `${data.Placement} captionImage`)
          .attr('width', data.Width)
          .children('.caption').text(data.CaptionText);
      } else {
        element = image;
      }

      if (replacee.length) {
        if (replacee.not(element).length) {
          replacee.replaceWith(element);
        }
      } else {
        // Otherwise insert the whole HTML content
        editor.repaint();
        editor.insertContent($('<div/>').append(element.clone()).html(), { skip_undo: 1 });
      }

      editor.addUndo();
      editor.repaint();

      return true;
    },
  });
});
