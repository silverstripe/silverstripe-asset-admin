/* global jest, test, expect */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Breadcrumb from '../AssetAdminBreadcrumb';

const folder = {
  id: 3,
  title: 'Three',
  parents: [
    { id: 1, title: 'One' },
    { id: 2, title: 'Two' },
  ]
};

function makeProps(obj = {}) {
  return {
    query: { filter: {} },
    getUrl: (folderId) => (folderId ? folderId.toString() : ''),
    onBrowse: () => null,
    onFolderIcon: () => null,
    PlainBreadcrumbComponent: ({ multiline, crumbs }) => (
      <div data-testid="test-plain-breadcrumb-component" data-multiline={multiline}>
        {crumbs.map(crumb => <div data-testid="test-breadcrumb" key={crumb.text} onClick={crumb.onClick} data-href={crumb.href}>
          {crumb.icons && crumb.icons.map(icon => <div data-testid="test-icon" key={icon.className} onClick={icon.onClick} />)}
          {crumb.text}
        </div>)}
      </div>
    ),
    ...obj
  };
}

test('AssetAdminBreadcrumb Root', async () => {
  const onBrowse = jest.fn();
  render(
    <Breadcrumb {...makeProps({
      onBrowse
    })}
    />
  );
  const crumbs = await screen.findAllByTestId('test-breadcrumb');
  expect(crumbs.length).toBe(1);
  expect(crumbs[0].textContent).toBe('Files');
  fireEvent.click(crumbs[0]);
  expect(onBrowse.mock.calls.length).toBe(1);
  expect(onBrowse.mock.calls[0]).toEqual([0, null, { filter: {} }]);
});

test('AssetAdminBreadcrumb With folders', async () => {
  const onBrowse = jest.fn();
  const onFolderIcon = jest.fn();
  render(
    <Breadcrumb {...makeProps({
      folder,
      onBrowse,
      onFolderIcon
    })}
    />
  );
  const crumbs = await screen.findAllByTestId('test-breadcrumb');
  expect(crumbs.length).toBe(4);
  expect(crumbs[0].textContent).toBe('Files');
  expect(crumbs[1].textContent).toBe('One');
  expect(crumbs[2].textContent).toBe('Two');
  expect(crumbs[3].textContent).toBe('Three');
  fireEvent.click(crumbs[3]);
  expect(onBrowse.mock.calls.length).toBe(1);
  expect(onBrowse.mock.calls[0]).toEqual([3, null, { filter: {} }]);
  const icons = await screen.findAllByTestId('test-icon');
  expect(icons.length).toBe(1);
  expect(icons[0].parentNode.textContent).toBe('Three');
  fireEvent.click(icons[0]);
  expect(onFolderIcon.mock.calls.length).toBe(1);
});

test('AssetAdminBreadcrumb With top folder', async () => {
  const onBrowse = jest.fn();
  render(
    <Breadcrumb {...makeProps({
      folder: { ...folder, parents: undefined },
      onBrowse
    })}
    />
  );
  const crumbs = await screen.findAllByTestId('test-breadcrumb');
  expect(crumbs.length).toBe(2);
  expect(crumbs[0].textContent).toBe('Files');
  expect(crumbs[1].textContent).toBe('Three');
  fireEvent.click(crumbs[1]);
  expect(onBrowse.mock.calls.length).toBe(1);
  expect(onBrowse.mock.calls[0]).toEqual([3, null, { filter: {} }]);
});

test('AssetAdminBreadcrumb With search', async () => {
  const onBrowse = jest.fn();
  render(
    <Breadcrumb {...makeProps({
      query: { filter: { filters: { title: 'booya' } } },
      onBrowse
    })}
    />
  );
  const crumbs = await screen.findAllByTestId('test-breadcrumb');
  expect(crumbs.length).toBe(2);
  expect(crumbs[0].textContent).toBe('Files');
  expect(crumbs[1].textContent).toBe('Search results');
  expect(crumbs[1].getAttribute('data-href')).toBe(null);
  expect(crumbs[1].getAttribute('data-testid')).toBe('test-breadcrumb');
  fireEvent.click(crumbs[0]);
  expect(onBrowse.mock.calls.length).toBe(1);
  expect(onBrowse.mock.calls[0]).toEqual([0, null, { filter: { filters: { title: 'booya' } } }]);
});
