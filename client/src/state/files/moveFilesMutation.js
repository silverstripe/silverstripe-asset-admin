import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const mutation = gql`
  mutation MoveFiles($folderId:ID!, $fileIds:[ID]!) {
    moveFiles(folderId: $folderId, fileIds: $fileIds) {
      ...FileInterfaceFields
      ...FileFields
    }
  }
  ${fileInterface}
  ${file}
`;

const config = {
  props: ({ mutate, ownProps: { actions = {} } }) => ({
    actions: Object.assign({}, actions, {
      files: Object.assign({}, actions.files, {
        moveFiles: (folderId, fileIds) => mutate({
          variables: {
            folderId,
            fileIds,
          },
          update: () => {
            // todo:
            // Refactor this once Apollo GraphQL adds support
            // for invalidating specific queries in the cache.
            // Context: https://github.com/silverstripe/silverstripe-asset-admin/issues/809
            window.ss.apolloClient.resetStore();
          }
        }),
      }),
    }),
  }),
};

export { mutation, config };

export default graphql(mutation, config);
