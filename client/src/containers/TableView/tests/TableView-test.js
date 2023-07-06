/* global jest, expect, test */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as TableView } from '../TableView';

jest.mock('griddle-react', () => ({
  __esModule: true,
  default: (props) => {
    const q = (k, v) => {
      if (Array.isArray(v)) {
        return <div key={k} data-name={k}>{v.map((v2, i) => q(i, v2))}</div>;
      } else if (typeof v === 'object') {
        return <div key={k} data-name={k}>{Object.keys(v).map((k2) => q(k2, v[k2]))}</div>;
      } else if (v instanceof Function) {
        return <div key={k} data-name={k} onClick={() => v()}/>;
      }
      if (Object.is(v, NaN)) {
        v = 'NaN';
      }
      return <div key={k} data-name={k} data-value={v}/>;
    };
    return (
      <div data-testid="test-griddle">
        {Object.keys(props).map((k) => q(k, props[k]))}
      </div>
    );
  }
}));

let consoleWarnFn;
beforeEach(() => {
  // Surpress warning
  // Warning: componentWillReceiveProps has been renamed, and is not recommended for use
  consoleWarnFn = jest.spyOn(console, 'warn').mockImplementation(() => null);
});
afterEach(() => {
  consoleWarnFn.mockRestore();
});

function makeProps(obj = {}) {
  return {
    files: [
      { id: 12, parent: { id: 0 } },
      { id: 15, parent: { id: 6 } },
    ],
    onOpenFile: jest.fn(),
    onOpenFolder: jest.fn(),
    onSort: jest.fn(),
    onSetPage: jest.fn(),
    renderNoItemsNotice: jest.fn(),
    sort: 'title,asc',
    ...obj
  };
}

test('TableView getColumns() should return a list of columns for the table', async () => {
  const { container } = render(
    <TableView {...makeProps()}/>
  );
  expect(container.querySelector('[data-name="columns"] [data-name="0"]').getAttribute('data-value')).toBe('thumbnail');
  expect(container.querySelector('[data-name="columns"] [data-name="1"]').getAttribute('data-value')).toBe('title');
});
