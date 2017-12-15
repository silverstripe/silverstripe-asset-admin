/* global jest, describe, it, expect, beforeEach, Event */
// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('components/FormAlert/FormAlert');
jest.mock('components/AssetDropzone/AssetDropzone');
jest.mock('components/BulkActions/BulkActions');
jest.mock('containers/MoveModal/MoveModal');
jest.mock('../Buttons/BackButton');
// mock jquery, as leaving it causes more problems than it solves
jest.mock('jquery', () => {
  const jqueryMock = {
    find: () => jqueryMock,
    change: () => jqueryMock,
    val: () => jqueryMock,
    trigger: () => null,
    chosen: () => null,
    on: () => null,
    off: () => null,
  };
  return () => jqueryMock;
});

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as GalleryToolbar } from '../GalleryToolbar';

describe('GalleryToolbar', () => {
  let props = null;

  beforeEach(() => {
    props = {
      folder: {
        id: 1,
        title: 'container folder',
        parentId: null,
        canView: true,
        canEdit: true,
      },
      sort: '',
      handleMoveFiles: () => {},
      onCreateFolder: () => {},
      onOpenFolder: () => {},
      handleSort: () => {},
      onViewChange: () => {},
      badges: [],
      sectionConfig: {},
      BackButton: () => null
    };
  });

  describe('handleSelectSort()', () => {
    let gallerytoolbar = null;
    let onSort = null;
    const event = {
      currentTarget: {
        value: 'title,desc',
      },
    };

    beforeEach(() => {
      onSort = jest.genMockFunction();
      const localProps = Object.assign({}, props, { handleSort: onSort });
      gallerytoolbar = ReactTestUtils.renderIntoDocument(
        <GalleryToolbar {...localProps} />
      );
    });

    it('should purge the upload queue', () => {
      gallerytoolbar.handleSelectSort(event);
      expect(onSort).toBeCalledWith('title,desc');
    });
  });
});
