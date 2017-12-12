/* global tinymce, window */
/* eslint-disable
  no-param-reassign,
  func-names
*/

import jQuery from 'jquery';
import i18n from 'i18n';
import React from 'react';
import ReactDOM from 'react-dom';
import { loadComponent } from 'lib/Injector';
import InsertMediaModal from 'containers/InsertMediaModal/InsertMediaModal';
import ShortcodeSerialiser from 'lib/ShortcodeSerialiser';

const InjectableInsertMediaModal = loadComponent(InsertMediaModal);

const filter = 'img[data-shortcode="image"]';

(() => {
  const ssmedia = {

    /**
     * Initilise this plugin
     *
     * @param {Object} ed
     */
    init(ed) {
      const title = i18n._t('AssetAdmin.INSERT_FROM_FILES', 'Insert from Files');
      ed.addButton('ssmedia', {
        icon: 'image',
        title,
        cmd: 'ssmedia',
      });
      ed.addMenuItem('ssmedia', {
        icon: 'image',
        text: title,
        cmd: 'ssmedia',
      });


      ed.addCommand('ssmedia', () => {
        // See HtmlEditorField.js
        jQuery(`#${ed.id}`).entwine('ss').openMediaDialog();
      });

      // Replace the mceAdvImage and mceImage commands with the ssmedia command
      ed.on('BeforeExecCommand', (e) => {
        const cmd = e.command;
        const ui = e.ui;
        const val = e.value;
        if (cmd === 'mceAdvImage' || cmd === 'mceImage') {
          e.preventDefault();
          ed.execCommand('ssmedia', ui, val);
        }
      });

      ed.on('SaveContent', (o) => {
        const content = jQuery(o.content);

        // Transform [image] shortcodes
        content.find(filter)
          .add(content.filter(filter))
          .each(function () {
            const el = jQuery(this);
            const properties = {
              // Requires server-side preprocessing of HTML+shortcodes in HTMLValue
              src: el.attr('src'),
              id: el.data('id'),
              width: el.attr('width'),
              height: el.attr('height'),
              class: el.attr('class'),
              // don't save caption, since that's in the containing element
              title: el.attr('title'),
              alt: el.attr('alt'),
            };
            const shortCode = ShortcodeSerialiser.serialise({
              name: 'image',
              properties,
              wrapped: false
            });
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
      ed.on('BeforeSetContent', (o) => {
        let content = o.content;

        // Transform [image] tag
        let match = ShortcodeSerialiser.match('image', false, content);
        while (match) {
          const attrs = match.properties;
          const el = jQuery('<img/>')
            .attr(Object.assign({}, attrs, {
              id: undefined,
              'data-id': attrs.id,
              'data-shortcode': 'image',
            }))
            .addClass('ss-htmleditorfield-file image');
          content = content.replace(match.original, (jQuery('<div/>').append(el).html()));

          // Get next match
          match = ShortcodeSerialiser.match('image', false, content);
        }

        o.content = content;
      });
    },
  };

  // Adds the plugin class to the list of available TinyMCE plugins
  tinymce.PluginManager.add('ssmedia', (editor) => ssmedia.init(editor));
})();

jQuery.entwine('ss', ($) => {
  // this is required because the React version of e.preventDefault() doesn't work
  // this is to stop React Tabs from navigating the page
  $('.insert-media-react__dialog-wrapper .nav-link, ' +
  '.insert-media-react__dialog-wrapper .breadcrumb__container a').entwine({
    onclick: (e) => e.preventDefault(),
  });

  $('#insert-media-react__dialog-wrapper').entwine({
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
      const attrs = this.getOriginalAttributes();
      const selection = tinymce.activeEditor.selection;
      const selectionContent = selection.getContent() || '';
      const tagName = selection.getNode().tagName;
      // Unsupported media insertion will use insert link form instead
      // treat image tag selection as blank content
      const requireLinkText = tagName !== 'A' && (tagName === 'IMG' || selectionContent.trim() === '');

      delete attrs.url;

      // create/update the react component
      ReactDOM.render(
        <InjectableInsertMediaModal
          title={false}
          type="insert-media"
          show={show}
          onInsert={handleInsert}
          onHide={handleHide}
          bodyClassName="modal__dialog"
          className="insert-media-react__dialog-wrapper"
          requireLinkText={requireLinkText}
          fileAttributes={attrs}
        />,
        this[0]
      );
    },

    /**
     * Handles inserting the selected file in the modal
     *
     * @param {object} data
     * @param {object} file
     * @returns {Promise}
     * @private
     */
    _handleInsert(data, file) {
      let result = false;
      this.setData(Object.assign({}, data, file));

      // Sometimes AssetAdmin.js handleSubmitEditor() can't find the file
      // @todo Ensure that we always return a file for any valid ID

      // in case of any errors, better to catch them than let them go silent
      try {
        let category = null;
        if (file) {
          category = file.category;
        } else {
          category = 'image';
        }
        switch (category) {
          case 'image':
            result = this.insertImage();
            break;
          default:
            result = this.insertFile();
        }
      } catch (e) {
        this.statusMessage(e, 'bad');
      }

      if (result) {
        this.close();
      }
      return Promise.resolve();
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

      // Handler for if the selection is a link instead of image media
      const hrefParts = ($node.attr('href') || '').split('#');
      if (hrefParts[0]) {
        // check if file is safe
        const shortcode = ShortcodeSerialiser.match('file_link', false, hrefParts[0]);
        if (shortcode) {
          return {
            ID: shortcode.properties.id ? parseInt(shortcode.properties.id, 10) : 0,
            Anchor: hrefParts[1] || '',
            Description: $node.attr('title'),
            TargetBlank: !!$node.attr('target'),
          };
        }
      }

      const $caption = $node.parent('.captionImage').find('.caption');

      const attr = {
        url: $node.attr('src'),
        AltText: $node.attr('alt'),
        InsertWidth: $node.attr('width'),
        InsertHeight: $node.attr('height'),
        TitleTooltip: $node.attr('title'),
        Alignment: this.findPosition($node.attr('class')),
        Caption: $caption.text(),
        ID: $node.attr('data-id'),
      };

      // parse certain attributes to integer value
      ['InsertWidth', 'InsertHeight', 'ID'].forEach((item) => {
        attr[item] = (typeof attr[item] === 'string') ? parseInt(attr[item], 10) : null;
      });

      return attr;
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
      return alignments.find((alignment) => {
        const expr = new RegExp(`\\b${alignment}\\b`);
        return expr.test(cssClass);
      });
    },

    /**
     * Get html attributes from the Form data
     *
     * @returns {object}
     */
    getAttributes() {
      const data = this.getData();

      return {
        src: data.url,
        alt: data.AltText,
        width: data.InsertWidth,
        height: data.InsertHeight,
        title: data.TitleTooltip,
        class: data.Alignment,
        'data-id': data.ID,
        'data-shortcode': 'image',
      };
    },

    /**
     * Get extra data not part of the actual element we're adding/modifying (e.g. Caption)
     * @returns {object}
     */
    getExtraData() {
      const data = this.getData();
      return {
        CaptionText: data && data.Caption,
      };
    },

    /**
     * Generic handler for inserting a file
     *
     * NOTE: currently not supported
     *
     * @returns {boolean} success
     */
    insertFile() {
      const data = this.getData();

      const editor = this.getElement().getEditor();
      const $node = $(editor.getSelectedNode());

      const shortcode = ShortcodeSerialiser.serialise({
        name: 'file_link',
        properties: { id: data.ID },
      }, true);

      const selection = tinymce.activeEditor.selection;
      const selectionContent = selection.getContent() || '';
      let linkText = selectionContent || data.Text || data.filename;

      // if link was highlighted, then we don't want to place more text inside that text
      if ($node.is('a') && $node.html()) {
        linkText = '';
      }

      const linkAttributes = {
        href: shortcode,
        target: data.TargetBlank ? '_blank' : '',
        title: data.Description,
      };

      // if the selection is an image, then replace it
      if ($node.is('img')) {
        // selectionContent is the image html, so we don't want that
        linkText = data.Text || data.filename;
        const newLink = $('<a />').attr(linkAttributes).text(linkText);
        $node.replaceWith(newLink);
        editor.addUndo();
        editor.repaint();
      } else {
        this.insertLinkInEditor(linkAttributes, linkText);
      }
      return true;
    },

    /**
     * Handler for inserting an image
     *
     * @returns {boolean} success
     */
    insertImage() {
      const $field = this.getElement();
      if (!$field) {
        return false;
      }
      const editor = $field.getEditor();
      if (!editor) {
        return false;
      }
      const node = $(editor.getSelectedNode());
      // Get the attributes & extra data
      const attrs = this.getAttributes();
      const extraData = this.getExtraData();

      // Find the element we are replacing - either the img, it's wrapper parent,
      // or nothing (if creating)
      let replacee = (node && node.is('img,a')) ? node : null;
      if (replacee && replacee.parent().is('.captionImage')) replacee = replacee.parent();

      // Find the img node - either the existing img or a new one, and update it
      const img = (node && node.is('img')) ? node : $('<img />');
      img.attr(attrs)
        .addClass('ss-htmleditorfield-file image');

      // Any existing figure or caption node
      let container = img.parent('.captionImage');
      let caption = container.find('.caption');

      // If we've got caption text, we need a wrapping div.captionImage and sibling p.caption
      if (extraData.CaptionText) {
        if (!container.length) {
          container = $('<div></div>');
        }

        container
          .attr('class', `captionImage ${attrs.class}`)
          .removeAttr('data-mce-style')
          .width(attrs.width);

        if (!caption.length) {
          caption = $('<p class="caption"></p>').appendTo(container);
        }

        caption.attr('class', `caption ${attrs.class}`).text(extraData.CaptionText);
      } else {
        // Otherwise forget they exist
        container = null;
        caption = null;
      }

      // The element we are replacing the replacee with
      const replacer = container || img;

      // If we're replacing something, and it's not with itself, do so
      if (replacee && replacee.not(replacer).length) {
        replacee.replaceWith(replacer);
      }

      // If we have a wrapper element, make sure the img is the first child - img might be the
      // replacee, and the wrapper the replacer, and we can't do this till after the replace has
      // happened
      if (container) {
        container.prepend(img);
      }

      // If we don't have a replacee, then we need to insert the whole HTML
      if (!replacee) {
        // Otherwise insert the whole HTML content
        editor.repaint();
        editor.insertContent($('<div />').append(replacer).html(), { skip_undo: 1 });
      }

      editor.addUndo();
      editor.repaint();
      return true;
    },

    /**
     * Pop up a status message if required to notify the user what is happening
     *
     * @param text
     * @param type
     */
    statusMessage(text, type) {
      const content = $('<div/>').text(text).html(); // Escape HTML entities in text
      $.noticeAdd({
        text: content,
        type,
        stayTime: 5000,
        inEffect: { left: '0', opacity: 'show' },
      });
    },
  });
});
