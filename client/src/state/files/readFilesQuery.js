import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { NetworkStatus } from 'apollo-client/queries/store';
import { fileInterface, file as fileFragment, folder as folderFragment } from 'lib/fileFragments';
import { hasFilters } from 'components/Search/Search';

// GraphQL Query
const query = gql`
  query ReadFiles($limit:Int!, $offset:Int!, $rootFilter: FileFilterInput, 
    $childrenFilter: FileFilterInput, $sortBy:[ChildrenSortInputType]
  ) {
    readFiles(filter: $rootFilter) {
      pageInfo {
        totalCount
      }
      edges {
        node {
          ...FileInterfaceFields
          ...FileFields
          ...on Folder {
            children(limit:$limit, offset:$offset, filter: $childrenFilter, sortBy:$sortBy) {
              pageInfo {
                totalCount
              }
              edges {
                node {
                  ...FileInterfaceFields
                  ...FileFields
                  ...FolderFields
                }
              }
            }
            parents {
              id
              title
            }
          }
        }
      }
    }
  }
  ${fileInterface}
  ${fileFragment}
  ${folderFragment}
`;

const config = {
  options({ sectionConfig, folderId, fileId, query: params }) {
    const rootFilter = {
      id: folderId, // can be 0 (root)
      anyChildId: fileId || null, // treat 0 as null
    };

    // Covers a few variations:
    // - Display the root folder with its direct children
    // - Display the root folder with its recursive children and filters (a full "search")
    // - Display a folder with its direct children, without any filters
    // - Display a folder with its direct children and filters (a "search" in the current folder)
    const [sortField, sortDir] = params.sort ? params.sort.split(',') : ['', ''];
    const filterWithDefault = params.filter || {};
    const limit = params.limit || sectionConfig.limit;
    return {
      variables: {
        rootFilter,
        childrenFilter: Object.assign(
          filterWithDefault,
          {
            // Unset key, taken from rootFilter
            parentId: undefined,
            // Currently all searches are recursive, and only filtered by a ParentID
            recursive: hasFilters(filterWithDefault),
            // Unset this key since it's not a valid GraphQL argument
            currentFolderOnly: undefined,
          }
        ),
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
        networkStatus: currentNetworkStatus,
        refetch,
        readFiles,
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

    // Only set to loading if a network request is in progress.
    // TODO Use built-in 'loading' indicator once it's set to true on setVariables() calls.
    // TODO Respect optimistic loading results. We can't check for presence of readFiles object,
    // since Apollo sends through the previous result before optimistically setting the new result.
    const loading =
      currentNetworkStatus !== NetworkStatus.ready
      && currentNetworkStatus !== NetworkStatus.error;

    return {
      loading,
      folder,
      files,
      filesTotalCount,
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          readFiles: refetch,
        }),
      }),
    };
  },
};

export { query, config };

export default graphql(query, config);
