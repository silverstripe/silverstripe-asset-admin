/* global tinymce, window */
/* eslint-disable
  no-param-reassign,
  func-names
*/

import jQuery from 'jquery';
import i18n from 'i18n';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Injector, { loadComponent } from 'lib/Injector';
import InsertMediaModal from 'containers/InsertMediaModal/InsertMediaModal';
import ShortcodeSerialiser, { sanitiseShortCodeProperties } from 'lib/ShortcodeSerialiser';
import * as modalActions from 'state/modal/ModalActions';
import { imageSizePresetButtons } from './TinyMCE_ssmedia_sizepressets';

const InjectableInsertMediaModal = loadComponent(InsertMediaModal);

const filter = 'img[data-shortcode="image"]';

(() => {
  const ssmedia = {

    /**
     * Initilise this plugin
     *
     * @param {Object} editor TinyMCE editor object
     */
    init(editor) {
      const insertTitle = i18n._t('AssetAdmin.INSERT_FROM_FILES', 'Insert from Files');
      const editTitle = i18n._t('AssetAdmin.EDIT_IMAGE', 'Edit image');
      const deleteTitle = i18n._t('AssetAdmin.DELETE_IMAGE', 'Delete image');
      const contextTitle = i18n._t('AssetAdmin.FILE', 'File');

      editor.addCommand('ssmedia', () => {
        // See HtmlEditorField.js
        jQuery(`#${editor.id}`).entwine('ss').openMediaDialog();
      });

      editor.addCommand('ssmedia-delete', () => {
        const node = editor.selection.getNode();
        if (editor.dom.is(node, filter)) {
          node.remove();
        } else {
          // eslint-disable-next-line no-console
          console.error({ error: 'Unexpected selection - expected image', selectedNode: node });
        }
      });

      // Button in main toolbar
      editor.ui.registry.addButton('ssmedia', {
        tooltip: insertTitle,
        icon: 'image',
        onAction: () => editor.execCommand('ssmedia'),
        stateSelector: filter
      });

      // Right click context menu item
      editor.ui.registry.addMenuItem('ssmedia', {
        text: contextTitle,
        icon: 'image',
        onAction: () => editor.execCommand('ssmedia'),
      });

      // Context menu when an embed is selected
      // edit button
      editor.ui.registry.addButton('ssmediaedit', {
        tooltip: editTitle,
        icon: 'edit-block',
        onAction: () => editor.execCommand('ssmedia'),
      });
      // delete button
      editor.ui.registry.addButton('ssmediadelete', {
        tooltip: deleteTitle,
        icon: 'remove',
        onAction: () => editor.execCommand('ssmedia-delete'),
      });
      // size presets
      const sizePresets = editor.getParam('image_size_presets');
      let buttonList = [];
      if (sizePresets) {
        buttonList = imageSizePresetButtons(editor, sizePresets);
      }
      // the menu itself
      editor.ui.registry.addContextToolbar('ssmedia', {
        predicate: (node) => editor.dom.is(node, filter),
        position: 'node',
        scope: 'node',
        items: `${buttonList.join(' ')} | ssmediaedit ssmediadelete`
      });

      // Replace the mceAdvImage and mceImage commands with the ssmedia command
      editor.on('BeforeExecCommand', (e) => {
        const cmd = e.command;
        const ui = e.ui;
        const val = e.value;
        if (cmd === 'mceEditImage' || cmd === 'mceImage') {
          e.preventDefault();
          editor.execCommand('ssmedia', ui, val);
        }
      });

      editor.on('GetContent', (o) => {
        const content = jQuery(o.content);

        // Transform [image] shortcodes
        content.find(filter)
          .add(content.filter(filter))
          .each(function () {
            const el = jQuery(this);
            const obj = {
              // Requires server-side preprocessing of HTML+shortcodes in HTMLValue
              src: el.attr('src'),
              id: el.data('id'),
              width: el.attr('width'),
              height: el.attr('height'),
              class: el.attr('class'),
              // don't save caption, since that's in the containing element
              title: el.attr('title'),
              alt: el.attr('alt'),
              loading: el.data('loading')
            };

            const shortCode = ShortcodeSerialiser.serialise({
              name: 'image',
              properties: sanitiseShortCodeProperties(obj),
              wrapped: false,
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
      editor.on('BeforeSetContent', (o) => {
        let content = o.content;

        // Transform [image] tag
        let match = ShortcodeSerialiser.match('image', false, content);
        while (match) {
          const attrs = match.properties;
          const el = jQuery('<img>')
            .attr(Object.assign({}, attrs, {
              id: undefined,
              'data-id': attrs.id,
              'data-shortcode': 'image',
              'data-loading': attrs.loading
            }))
            .addClass('ss-htmleditorfield-file image');
          content = content.replace(match.original, (jQuery('<div></div>').append(el).html()));

          // Get next match
          match = ShortcodeSerialiser.match('image', false, content);
        }

        o.content = content;
      });

      // getMetadata method on a returned object is used by the "help" plugin
      return {
        getMetadata() {
          return {
            name: 'Silverstripe Media',
            url: 'https://docs.silverstripe.org/en/4/developer_guides/forms/field_types/htmleditorfield',
          };
        }
      };
    },
  };

  // Adds the plugin class to the list of available TinyMCE plugins
  tinymce.PluginManager.add('ssmedia', (editor) => ssmedia.init(editor));
})();

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot #insert-media-react__dialog-wrapper').entwine({
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
      // We're updating the redux store from outside react. This is a bit unusual, but it's
      // the best way to initialise our modal setting.
      const { dispatch } = Injector.reducer.store;
      dispatch(modalActions.initFormStack('insert-media', 'admin'));
      const imageSizePresets = tinymce.activeEditor.getParam('image_size_presets');
      dispatch(modalActions.defineImageSizePresets(imageSizePresets));
      this._renderModal(true);
    },

    close() {
      // When closing down the modal, let's reset our modal redux state
      const { dispatch } = Injector.reducer.store;
      dispatch(modalActions.reset());
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
      const handleInsert = (...args) => this._handleInsert(...args);
      const { url, ...attrs } = this.getOriginalAttributes();
      const fileSelected = attrs.hasOwnProperty('ID') && attrs.ID !== null;
      const folderId = this.getFolderId();
      const editor = this.getElement().getEditor();
      const selection = editor.getInstance().selection;
      const selectionContent = editor.getSelection();
      const tagName = selection.getNode().tagName;
      // Unsupported media insertion will use insert link form instead
      // treat image tag selection as blank content
      const requireLinkText = tagName !== 'A' && (tagName === 'IMG' || selectionContent.trim() === '');

      // create/update the react component
      let root = this.getReactRoot();
      if (!root) {
        root = createRoot(this[0]);
      }
      root.render(
        <InjectableInsertMediaModal
          title={false}
          isOpen={isOpen}
          folderId={folderId}
          onInsert={handleInsert}
          onClosed={handleHide}
          bodyClassName="modal__dialog"
          className="insert-media-react__dialog-wrapper"
          requireLinkText={requireLinkText}
          fileAttributes={attrs}
          fileSelected={fileSelected}
        />
      );
      this.setReactRoot(root);
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
     * Get default upload folder
     *
     * @returns {(number|null)}
     */
    getFolderId() {
      const $field = this.getElement();
      if (!$field) {
        return null;
      }

      // Check type safely
      const folderId = Number($field.data('config').upload_folder_id);
      return isNaN(folderId) ? null : folderId;
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
        Width: $node.attr('width'),
        Height: $node.attr('height'),
        Loading: $node.attr('data-loading'),
        TitleTooltip: $node.attr('title'),
        Alignment: this.findPosition($node.attr('class')),
        Caption: $caption.text(),
        ID: $node.attr('data-id'),
      };

      // parse certain attributes to integer value
      ['Width', 'Height', 'ID'].forEach((item) => {
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
      if (typeof cssClass !== 'string') {
        return '';
      }
      const classes = cssClass.split(' ');
      return alignments.find((alignment) => (
        classes.indexOf(alignment) > -1
      ));
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
        width: data.Width,
        height: data.Height,
        title: data.TitleTooltip,
        class: data.Alignment,
        'data-id': data.ID,
        'data-shortcode': 'image',
        'data-loading': data.Loading,
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

      const selectionContent = this.getElement().getSelection();
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
