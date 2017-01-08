/* global jest, describe, it, pit, expect, beforeEach, jasmine */

jest.unmock('react');
jest.unmock('react-dom');
jest.unmock('react-redux');
jest.unmock('react-addons-test-utils');
jest.unmock('../AssetAdminRouter');
jest.unmock('lib/DataFormat');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { AssetAdminRouter } from '../AssetAdminRouter';

describe('AssetAdminRouter', () => {
  let props = null;

  beforeEach(() => {
    props = {
      sectionConfig: {
        url: '',
        limit: 10,
        form: {},
      },
      location: {
        pathname: '',
        query: {},
      },
      params: {
        fileId: '0',
        folderId: '0',
      },
      router: {
        push: jest.fn(),
      },
    };
  });

  describe('getUrl', () => {
    let component = null;

    beforeEach(() => {
      component = ReactTestUtils.renderIntoDocument(<AssetAdminRouter {...props} />);
    });

    it('should retain page query parameter when not changing folders', () => {
      const newUrl = component.getUrl(props.params.folderId, null, { page: 2 });
      expect(newUrl).toContain('page=2');
    });

    it('should remove page query parameter when changing folders', () => {
      const newFolderId = '99';
      const newUrl = component.getUrl(newFolderId, null, { page: 2 });
      expect(newUrl).not.toContain('page=2');
    });
  });
});
