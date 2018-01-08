/* global jest, describe, it, expect, beforeEach, Event */

jest.mock('griddle-react');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as TableView } from '../TableView';

describe('TableView', () => {
  let props = {};

  beforeEach(() => {
    props = {
      files: [
        { id: 12, parent: { id: 0 } },
        { id: 15, parent: { id: 6 } },
      ],
      onOpenFile: jest.genMockFunction(),
      onOpenFolder: jest.genMockFunction(),
      onSort: jest.genMockFunction(),
      onSetPage: jest.genMockFunction(),
      renderNoItemsNotice: jest.genMockFunction(),
      sort: 'title,asc',
    };
  });

  describe('getColumns()', () => {
    it('should return a list of columns for the table', () => {
      const view = ReactTestUtils.renderIntoDocument(<TableView {...props} />);
      const columns = view.getColumns();

      expect(columns).toContain('thumbnail');
      expect(columns).toContain('title');
    });
  });

  describe('handleActivate()', () => {
    it('should call open folder for folder type', () => {
      const view = ReactTestUtils.renderIntoDocument(<TableView {...props} />);

      view.handleActivate(new Event('click'), { type: 'folder' });

      expect(props.onOpenFolder).toBeCalled();
      expect(props.onOpenFile).not.toBeCalled();
    });

    it('should call open file for non folder type', () => {
      const view = ReactTestUtils.renderIntoDocument(<TableView {...props} />);

      view.handleActivate(new Event('click'), { type: 'image' });

      expect(props.onOpenFolder).not.toBeCalled();
      expect(props.onOpenFile).toBeCalled();
    });
  });

  describe('handleRowClick()', () => {
    const row = {
      props: {
        data: {},
      },
    };
    const event = {
      currentTarget: { classList: { contains: () => null } },
      stopPropagation: () => null,
      preventDefault: () => null,
    };

    it('should call handleActivate', () => {
      const view = ReactTestUtils.renderIntoDocument(<TableView {...props} />);
      view.handleActivate = jest.genMockFunction();

      view.handleRowClick(row, event);

      expect(view.handleActivate).toBeCalledWith(event, row.props.data);
    });

    it('should call the select callback if target contains a particular class', () => {
      event.currentTarget.classList.contains = () => true;
      props.onSelect = jest.genMockFunction();
      const view = ReactTestUtils.renderIntoDocument(<TableView {...props} />);

      view.handleRowClick(row, event);
      expect(props.onSelect).toBeCalledWith(event, row.props.data);
    });
  });

  describe('handleSort()', () => {
    it('should convert direction true to string asc', () => {
      const view = ReactTestUtils.renderIntoDocument(<TableView {...props} />);

      view.handleSort('title', true);
      expect(props.onSort).toBeCalledWith('title,asc');
    });

    it('should convert direction false to string desc', () => {
      const view = ReactTestUtils.renderIntoDocument(<TableView {...props} />);

      view.handleSort('title', false);
      expect(props.onSort).toBeCalledWith('title,desc');
    });
  });
});
