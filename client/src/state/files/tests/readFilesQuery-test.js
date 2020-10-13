/* global jest, describe, it, pit, expect, beforeEach, jasmine */

import query from '../readFilesQuery';

describe('readFilesQuery', () => {
  const config = query.apolloConfig;
  let graphqlData = null;
  let child1 = null;
  let child2 = null;
  let folder = null;

  beforeEach(() => {
    child1 = { id: 2 };
    child2 = { id: 3 };
    folder = {
      id: 1,
      children: {
        pageInfo: { totalCount: 2 },
        nodes: [child1, child2],
      },
    };
    graphqlData = {
      data: {
        refetch: jest.fn(),
        readFiles: [folder],
      },
      ownProps: {
        actions: {},
      },
    };
  });

  it('should map the readFiles data to props', () => {
    const newProps = config.props(graphqlData);

    expect(newProps.files).toContain(child1);
    expect(newProps.files).toContain(child2);
    expect(newProps.filesTotalCount).toBe(2);
    expect(typeof newProps.actions.files.readFiles).toBe('function');

    newProps.actions.files.readFiles();
    expect(graphqlData.data.refetch).toBeCalled();
  });

  it('should calculate pagination info in options', () => {
    const ownProps = {
      sectionConfig: {},
      folderId: 1,
      query: {
        limit: 10,
        page: 3,
        sort: 'title desc',
      },
    };

    const newOptions = config.options(ownProps);

    expect(newOptions.variables.limit).toBe(10);
    expect(newOptions.variables.offset).toBe(20);
  });

  it('should calculate pagination info on defaults in options', () => {
    const ownProps = {
      sectionConfig: {
        limit: 10,
      },
      folderId: 1,
      query: {
        limit: null,
        page: 4,
        sort: 'title desc',
      },
    };
    const newOptions = config.options(ownProps);

    expect(newOptions.variables.limit).toBe(10);
    expect(newOptions.variables.offset).toBe(30);
  });
});
