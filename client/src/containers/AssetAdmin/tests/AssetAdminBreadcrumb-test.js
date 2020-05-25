/* global jest, describe, it, pit, expect, beforeEach, jasmine */
import Breadcrumb from '../AssetAdminBreadcrumb';
import ShallowRenderer from 'react-test-renderer/shallow';
import React from 'react';

const folder = {
  id: 3,
  title: 'Three',
  parents: [
    { id: 1, title: 'One' },
    { id: 2, title: 'Two' },
  ]
};

/**
 * Helper method to render our Asset-Admin specific breadcrumb. Because the asset-admin breadcrumb
 * wraps around the regular breadcrumb, we're simply shallow rendering the componentlooking at
 * what get passed to the underlying component.
 * @param {Object} props
 * @returns {Object}
 */
const render = (props) => {
  const renderer = new ShallowRenderer();
  const baseProps = {
    query: { filter: {} },
    getUrl: (...args) => args.join('/'),
    onBrowse: jest.fn(),
    onFolderIcon: jest.fn(),
    ...props
  };
  renderer.render(<Breadcrumb {...baseProps} />);
  return { ...renderer.getRenderOutput(), baseProps };
};

describe('AssetAdmin Breadcrumb', () => {
  it('Root', () => {
    const { props: { multiline, crumbs }, baseProps: { onBrowse } } = render({});

    expect(multiline).toBe(true);
    expect(crumbs).toHaveLength(1);
    expect(crumbs[0]).toHaveProperty('text', 'Files');
    expect(crumbs[0]).toHaveProperty('href', '');
    expect(crumbs[0]).not.toHaveProperty('icon');

    crumbs[0].onClick(new Event('onClick'));
    expect(onBrowse).toHaveBeenCalledWith();
  });

  it('With folders', () => {
    const {
      props: {
        multiline,
        crumbs
      },
      baseProps: {
        onBrowse,
        onFolderIcon
      }
    } = render({ folder });

    expect(multiline).toBe(true);
    expect(crumbs).toHaveLength(4);
    expect(crumbs[0]).toHaveProperty('text', 'Files');
    expect(crumbs[0]).toHaveProperty('href', '');

    expect(crumbs[1]).toHaveProperty('text', 'One');
    expect(crumbs[1]).toHaveProperty('href', '1');
    expect(crumbs[2]).toHaveProperty('text', 'Two');
    expect(crumbs[2]).toHaveProperty('href', '2');
    expect(crumbs[3]).toHaveProperty('text', 'Three');
    expect(crumbs[3]).toHaveProperty('href', '3');
    expect(crumbs[3].icons[0]).toHaveProperty('className', 'icon font-icon-edit-list');

    crumbs[3].onClick(new Event('onClick'));
    expect(onBrowse).toHaveBeenCalledWith(3);

    crumbs[3].icons[0].onClick(new Event('onClick'));
    expect(onFolderIcon).toHaveBeenCalledWith();
  });

  it('With top folder', () => {
    const {
      props: { multiline, crumbs },
      baseProps: { onBrowse }
    } = render({ folder: { ...folder, parents: undefined } });

    expect(multiline).toBe(true);
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0]).toHaveProperty('text', 'Files');
    expect(crumbs[0]).toHaveProperty('href', '');

    expect(crumbs[1]).toHaveProperty('text', 'Three');
    expect(crumbs[1]).toHaveProperty('href', '3');

    crumbs[1].onClick(new Event('onClick'));
    expect(onBrowse).toHaveBeenCalledWith(3);
  });

  it('With search', () => {
    const query = { filter: { filters: { title: 'booya' } } };
    const { props: { multiline, crumbs }, baseProps: { onBrowse } } = render({ query });

    expect(multiline).toBe(true);
    expect(crumbs).toHaveLength(2);
    expect(crumbs[0]).toHaveProperty('text', 'Files');
    expect(crumbs[0]).toHaveProperty('href', '');

    expect(crumbs[1]).toHaveProperty('text', 'Search results');
    expect(crumbs[1]).not.toHaveProperty('href');
    expect(crumbs[1]).not.toHaveProperty('icons');
    expect(crumbs[1]).not.toHaveProperty('onClick');

    crumbs[0].onClick(new Event('onClick'));
    expect(onBrowse).toHaveBeenCalledWith();
  });
});
