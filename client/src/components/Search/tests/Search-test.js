/* global jest, jasmine, describe, it, expect, beforeEach */

jest.mock('containers/FormBuilderLoader/FormBuilderLoader', () => null);
jest.unmock('react');
jest.unmock('../Search.js');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Search, { hasSearch } from '../Search.js';

describe('Search', () => {
  let props = null;

  beforeEach(() => {
    props = {
      searchFormSchemaUrl: 'someUrl',
      id: 'MyForm',
      onSearch: jest.fn(),
      query: {},
      formData: {},
      actions: {
        schema: {
          setSchemaStateOverrides: jest.fn(),
        },
      },
    };
  });

  describe('doSearch()', () => {

    it('includes searchText', () => {
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.doSearch();
      const data = props.onSearch.mock.calls[0][0];
      expect(data.Name).toEqual('foo');
    });

    it('filters out empty values', () => {
      props.formData = { isEmpty: '' };
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.doSearch();
      const data = props.onSearch.mock.calls[0][0];
      expect(data.isEmpty).not.toBeDefined();
    });

    it('inverts falsy CurrentFolderOnly flag', () => {
      props.formData = { CurrentFolderOnly: false };
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setState({ searchText: 'foo' });
      component.doSearch();
      const data = props.onSearch.mock.calls[0][0];
      expect(data.AllFolders).toEqual(1);
    });
  });

  describe('setOverrides()', () => {
    it('sets CurrentFolderOnly when AllFolders is not present', () => {
      props.query = { q: { foo: 'bar', AllFolders: false, }, };
      const component = ReactTestUtils.renderIntoDocument(
        <Search {...props} />
      );
      component.setOverrides(props);
      const data = props.actions.schema.setSchemaStateOverrides.mock.calls[0][1];
      expect(data.fields.map(field => field.name)).toContain('CurrentFolderOnly');
      expect(data.fields.find(field => field.name === 'CurrentFolderOnly'))
        .toEqual({ name: 'CurrentFolderOnly', value: '1' });
    });
  });

  describe('hasSearch', () => {
    it('returns false with missing "q" param', () => {
      expect(hasSearch({})).toBeFalsy();
    });
    it('returns false when only AllFolders key is present', () => {
      expect(hasSearch({ q: { AllFolders: true } })).toBeFalsy();
    });
    it('returns false when other empty keys is present', () => {
      expect(hasSearch({ q: { foo: '', AllFolders: true } })).toBeFalsy();
    });
    it('returns true when other non-empty keys is present', () => {
      expect(hasSearch({ q: { foo: 'bar', AllFolders: true } })).toBeTruthy();
    });
  });
});
