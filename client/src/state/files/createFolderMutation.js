import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const mutation = gql`
  mutation CreateFolder($folder:FolderInput!) {
    createFolder(folder: $folder) {
      ...FileInterfaceFields
      ...FileFields
    }
  }
  ${fileInterface}
  ${file}
`;

const config = {
  props: ({ mutate, ownProps: { errors, actions, errorMessage } }) => {
    const createFolder = (parentId, name) => mutate({
      variables: {
        folder: {
          parentId,
          name,
        },
      },
    });

    return {
      errorMessage: errorMessage || (errors && errors[0].message),
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          createFolder,
        }),
      }),
    };
  },
};

export { mutation, config };

export default graphql(mutation, config);
