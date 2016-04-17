/* global jQuery, ss */

/**
 * File: AssetAdmin.js
 */

((jQuery) => {
  jQuery.entwine('ss', ($) => {
    /**
     * Load folder detail view via controller methods
     * rather than built-in GridField view (which is only geared towards showing files).
     */
    $('.AssetAdmin.cms-edit-form .ss-gridfield-item').entwine({
      onclick: (e) => {
        // Let actions do their own thing
        if ($(e.target).closest('.action').length) {
          this._super(e);
          return undefined;
        }

        const grid = this.closest('.ss-gridfield');
        if (this.data('class') === 'Folder') {
          const url = grid.data('urlFolderTemplate').replace('%s', this.data('id'));
          $('.cms-container').loadPanel(url);
          return false;
        }

        this._super(e);
        return undefined;
      },
    });

    const selector = '.AssetAdmin.cms-edit-form .ss-gridfield .col-buttons .action.gridfield-button-delete, '
      + '.AssetAdmin.cms-edit-form .Actions button.action.action-delete';
    $(selector).entwine({
      onclick: (e) => {
        let msg;
        if (this.closest('.ss-gridfield-item').data('class') === 'Folder') {
          msg = ss.i18n._t('AssetAdmin.ConfirmDelete');
        } else {
          msg = ss.i18n._t('TABLEFIELD.DELETECONFIRMMESSAGE');
        }

        // eslint-disable-next-line no-alert
        if (!confirm(msg)) return false;

        this.getGridField().reload({ data: [{ name: this.attr('name'), value: this.val() }] });
        e.preventDefault();
        return false;
      },
    });

    $('.AssetAdmin.cms-edit-form :submit[name=action_delete]').entwine({
      onclick: (e) => {
        // eslint-disable-next-line no-alert
        if (!confirm(ss.i18n._t('AssetAdmin.ConfirmDelete'))) return false;
        this._super(e);
        return undefined;
      },
    });

    /**
     * Prompt for a new foldername, rather than using dedicated form.
     * Better usability, but less flexibility in terms of inputs and validation.
     * Mainly necessary because AssetAdmin->AddForm() returns don't play nicely
     * with the nested AssetAdmin->EditForm() DOM structures.
     */
    $('.AssetAdmin .cms-add-folder-link').entwine({
      onclick: () => {
        // eslint-disable-next-line no-alert
        const name = prompt(ss.i18n._t('Folder.Name'));
        if (!name) return false;

        this.closest('.cms-container').loadPanel(`${this.data('url')}&Name${name}`);
        return false;
      },
    });

    $('.AssetAdmin .gallery__back').entwine({
      onmatch: () => {
        $('.cms-add-folder-link').css('margin-left', 32);
      },
      onunmatch: () => {
        $('.cms-add-folder-link').css('margin-left', 0);
      },
    });
  });
})(jQuery);
