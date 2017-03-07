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
          Object.keys(attrs)
            .map((name) => (attrs[name] ? `${name}="${attrs[name]}"` : null))
            .filter((el) => el !== null)
            .join(' ')
        );

        // Transform [embed] shortcodes
        content.find('.ss-htmleditorfield-file.embed').each(function () {
          const el = jQuery(this);
          const attrs = {
            width: el.attr('width'),
            class: el.attr('cssclass'),
            thumbnail: el.data('thumbnail'),
          };
          const shortCode = `[embed ${attrsFn(attrs)}]${el.data('url')}[/embed]`;
          el.replaceWith(shortCode);
        });

        // Insert outerHTML in order to retain all nodes incl. <script>
        // tags which would've been filtered out with jQuery.html().
        // Note that <script> tags might be sanitized separately based on editor config.
        o.content = '';
        content.each(function () {
          if (this.outerHTML !== undefined) {
            o.content += this.outerHTML;
          }
        });
      });
      editor.on('BeforeSetContent', (o) => {
        let matches = null;
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
        while (matches = shortTagEmbegRegex.exec(content)) {
          const attrs = attrFromStrFn(matches[1]);
          const el = jQuery('<img/>').attr({
            src: attrs.thumbnail,
            width: attrs.width,
            height: attrs.height,
            class: attrs.class,
            'data-url': matches[2],
          }).addClass('ss-htmleditorfield-file embed');
          attrs.cssclass = attrs.class;

          Object.keys(attrs).forEach((key) => el.attr(`data-${key}`, attrs[key]));
          content = content.replace(matches[0], (jQuery('<div/>').append(el).html()));
        }

        o.content = content;
      });
    },
  };

  tinymce.PluginManager.add('ssembed', (editor) => ssembed.init(editor));
})();

jQuery.entwine('ss', function($) {
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
            title={false}
            show={show}
            onInsert={handleInsert}
            onHide={handleHide}
            bodyClassName="modal__dialog"
            className="insert-embed-react__dialog-wrapper"
            attributes={attrs}
          />
        </ApolloProvider>,
        this[0]
      );
    },

    setUrl(url) {
      this.setData(Object.assign({}, this.getData(), { url }));
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
      this.setData(Object.assign({}, data));
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

      const node = $field.getEditor().getSelectedNode();
      if (!node) {
        return {};
      }
      const $node = $(node);
      const data = this.getData();

      return {
        url: $node.data('url') || data.url,
      };
    },
  });
});

/*
 * Insert an Embed object tag into the content.
 * Requires the 'media' plugin for serialization of tags into <img> placeholders.
 *
$('form.htmleditorfield-mediaform .ss-htmleditorfield-file.embed').entwine({
  getAttributes: function() {
    var width = this.find(':input[name=Width]').val(),
      height = this.find(':input[name=Height]').val();
    return {
      'src' : this.find('.thumbnail-preview').attr('src'),
      'width' : width ? parseInt(width, 10) : null,
      'height' : height ? parseInt(height, 10) : null,
      'class' : this.find(':input[name=CSSClass]').val(),
      'alt' : this.find(':input[name=AltText]').val(),
      'title' : this.find(':input[name=Title]').val(),
      'data-fileid' : this.find(':input[name=FileID]').val()
    };
  },
  getExtraData: function() {
    var width = this.find(':input[name=Width]').val(),
      height = this.find(':input[name=Height]').val();
    return {
      'CaptionText': this.find(':input[name=CaptionText]').val(),
      'Url': this.find(':input[name=URL]').val(),
      'thumbnail': this.find('.thumbnail-preview').attr('src'),
      'width' : width ? parseInt(width, 10) : null,
      'height' : height ? parseInt(height, 10) : null,
      'cssclass': this.find(':input[name=CSSClass]').val()
    };
  },
  getHTML: function() {
    var el,
      attrs = this.getAttributes(),
      extraData = this.getExtraData(),
      // imgEl = $('<img id="_ss_tmp_img" />');
      imgEl = $('<img />').attr(attrs).addClass('ss-htmleditorfield-file embed');

    $.each(extraData, function (key, value) {
      imgEl.attr('data-' + key, value);
    });

    if(extraData.CaptionText) {
      el = $('<div style="width: ' + attrs['width'] + 'px;" class="captionImage ' + attrs['class'] + '"><p class="caption">' + extraData.CaptionText + '</p></div>').prepend(imgEl);
    } else {
      el = imgEl;
    }
    return $('<div />').append(el).html(); // Little hack to get outerHTML string
  },
  updateFromNode: function(node) {
    this.find(':input[name=AltText]').val(node.attr('alt'));
    this.find(':input[name=Title]').val(node.attr('title'));
    this.find(':input[name=Width]').val(node.width());
    this.find(':input[name=Height]').val(node.height());
    this.find(':input[name=Title]').val(node.attr('title'));
    this.find(':input[name=CSSClass]').val(node.data('cssclass'));
    this.find(':input[name=FileID]').val(node.data('fileid'));
  }
});

 */
