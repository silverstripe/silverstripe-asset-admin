import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { query as readFilesQuery, config as readFilesConfig } from './readFilesQuery';

const mutation = gql`mutation DeleteFiles($IDs:[ID]!) {
  deleteFiles(IDs: $IDs)
}`;

const config = {
  props: ({ mutate, ownProps }) => {
    const { actions } = ownProps;
    const deleteFiles = (IDs) => mutate({
      variables: {
        IDs,
      },
      update: (store, { data: { deleteFiles } }) => {
        const variables = readFilesConfig.options(ownProps).variables;
        const data = store.readQuery({ query: readFilesQuery, variables });
        const newData = {
          ...data,
          readFiles: {
            ...data.readFiles,
            edges: [
              {
                ...data.readFiles.edges[0],
                node: {
                  ...data.readFiles.edges[0].node,
                  children: {
                    ...data.readFiles.edges[0].node.children,
                    edges: data.readFiles.edges[0].node.children.edges.filter(edge => !IDs.includes(edge.node.id))
                  }
                },
              },
            ]
          }
        };
        store.writeQuery({ query: readFilesQuery, data: newData, variables });
      }
    });

    return {
      actions: {
        ...actions,
        files: {
          ...actions.files,
          deleteFiles,
        },
      },
    };
  },
};

export { mutation, config };

export default graphql(mutation, config);
