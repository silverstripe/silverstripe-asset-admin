/* global jest, describe, it, pit, expect, beforeEach, jasmine */

// mock sub-components, as they could rely on a Redux store context and not necessary for unit test
jest.mock('containers/AssetAdmin/AssetAdmin');

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as AssetAdminRouter } from '../AssetAdminRouter';

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
        search: '',
      },
      match: {
        params: {
          fileId: '0',
          folderId: '0',
        },
      },
      history: {
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
      const newUrl = component.getUrl(props.match.params.folderId, null, { page: 2 });
      expect(newUrl).toContain('page=2');
    });

    it('should remove page query parameter when changing folders', () => {
      const newFolderId = '99';
      const newUrl = component.getUrl(newFolderId, null, { page: 2 });
      expect(newUrl).not.toContain('page=2');
    });
  });
});
