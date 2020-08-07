import { hasFilters } from 'components/Search/Search';
import { graphqlTemplates } from 'lib/Injector';

const apolloConfig = {
  options({ sectionConfig, folderId, fileId, query: params }) {
    const filter = Object.assign({}, params.filter);
    const childrenFilter = Object.assign(
      {},
      filter,
      {
        // Unset key, taken from rootFilter
        parentId: undefined,
        // Currently all searches are recursive, and only filtered by a ParentID
        recursive: hasFilters(filter),
        // Unset this key since it's not a valid GraphQL argument
        currentFolderOnly: undefined,
      }
    );

    // only populate anyChildId param if no search is applied
    const anyChildId = (hasFilters(filter)) ? null : (fileId || null);
    const id = (anyChildId) ? null : (folderId || 0);

    const rootFilter = {
      // can be 0 (root)
      id,
      // treat 0 as null
      anyChildId,
    };

    // Covers a few variations:
    // - Display the root folder with its direct children
    // - Display the root folder with its recursive children and filters (a full "search")
    // - Display a folder with its direct children, without any filters
    // - Display a folder with its direct children and filters (a "search" in the current folder)
    const [sortField, sortDir] = params.sort ? params.sort.split(',') : ['', ''];
    const limit = params.limit || sectionConfig.limit;
    return {
      variables: {
        rootFilter,
        childrenFilter,
        limit,
        offset: ((params.page || 1) - 1) * limit,
        sortBy: (sortField && sortDir)
          ? [{ field: sortField, direction: sortDir.toUpperCase() }]
          : undefined,
      },
    };
  },
  props(
    {
      data: {
        error,
        refetch,
        readFiles,
        loading: networkLoading,
      },
      ownProps: { actions },
    }
  ) {
    // Uses same query as search and file list to return a single result (the containing folder)
    const folder = (readFiles && readFiles.edges[0])
      ? readFiles.edges[0].node
      : null;
    const files = (folder && folder.children)
      // Filter nodes because the DELETE resultBehaviour doesn't delete the edge, only the node
      ? folder.children.edges.map((edge) => edge.node).filter((file) => file)
      : [];
    const filesTotalCount = (folder && folder.children)
      ? folder.children.pageInfo.totalCount
      : 0;

    const filesLoading = (folder && !folder.children);

    const errors = error && error.graphQLErrors &&
      error.graphQLErrors.map((graphQLError) => graphQLError.message);
    return {
      loading: networkLoading || filesLoading,
      folder,
      files,
      filesTotalCount,
      graphQLErrors: errors,
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          readFiles: refetch,
        }),
      }),
    };
  },
};

const { READ } = graphqlTemplates;
const query = {
  apolloConfig,
  templateName: READ,
  pluralName: 'Files',
  pagination: false,
  params: {
    //limit: 'Int!',
    //offset: 'Int!',
    rootFilter: 'FileFilterInput',
    //childrenFilter: 'FileFilterInput',
    //sortBy: '[ChildrenSortInputType]',
  },
  args: {
    root: {
      filter: 'rootFilter'
    },
    // 'root/edges/node/...on Folder/children': {
    //   limit: 'limit',
    //   offset: 'offset',
    //   filter: 'childrenFilter',
    //   sortBy: 'sortBy',
    // },
  },
  fragments: [
    'FileInterfaceFields',
    'FileFields',
  ],
  fields: [
    'pageInfo', [
      'totalCount',
    ],
    'edges', [
      'node', [
        '...FileInterfaceFields',
        '...FileFields',
        '...on Folder', [
          'children', [
            'pageInfo', [
              'totalCount',
            ],
            'edges', [
              'node', [
                '...FileInterfaceFields',
                '...FileFields',
              ]
            ]
          ],
          'parents', [
            'id',
            'title',
          ]
        ]
      ]
    ],
  ],
};


export default query;
