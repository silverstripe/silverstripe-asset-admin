/* global jest, jasmine, describe, it, expect, beforeEach, FormData */

import getFormSchema from '../getFormSchema';
import CONSTANTS from 'constants/index';

const { CREATE_FOLDER, EDIT_FILE } = CONSTANTS.ACTIONS;

const config = {
  form: {
    folderCreateForm: { schemaUrl: 'folder/create' },
    fileInsertForm: { schemaUrl: 'file/insert' },
    fileEditorLinkForm: { schemaUrl: 'file/link' },
    fileSelectForm: { schemaUrl: 'file/select' },
    fileEditForm: { schemaUrl: 'file/edit' },
  }
};

function expectSchema(actual, schemaUrl, targetId) {
  expect(actual).toHaveProperty('schemaUrl', schemaUrl);
  expect(actual).toHaveProperty('targetId', targetId);
}

describe('getFormSchema', () => {
  describe('folder', () => {
    it('create', () => {
      expectSchema(
        getFormSchema({ config, viewAction: CREATE_FOLDER, folderId: 123 }),
        'folder/create',
        123
      );
    });
  });

  describe('file', () => {
    const types = [
      ['insert-media', 'file/insert'],
      ['insert-link', 'file/link'],
      ['select', 'file/select'],
      ['admin', 'file/edit'],
      ['default', 'file/edit'],
    ];

    types.forEach(
      ([type, expectedSchemaUrl]) => {
        it(type, () => {
          expectSchema(
            getFormSchema({ config, viewAction: EDIT_FILE, fileId: 321, type }),
            expectedSchemaUrl,
            321
          );
        });
      }
    );
  });

  describe('invalid inputs', () => {
    it('bad action', () => {
      expect(getFormSchema({ config, viewAction: 'nonsense', folderId: 123 })).toMatchObject({});
    });

    it('file action without fileId', () => {
      expect(getFormSchema({ config, viewAction: EDIT_FILE, folderId: 123 })).toMatchObject({});
    });
  });
});
