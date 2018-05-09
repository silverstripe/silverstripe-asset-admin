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
      update: (store) => {
        const variables = readFilesConfig.options(ownProps).variables;
        const data = store.readQuery({ query: readFilesQuery, variables });
        // Query returns a deeply nested object. Explicit reconstruction via spreads is too verbose.
        // This is an alternative, relatively efficient way to deep clone
        const newData = JSON.parse(JSON.stringify(data));

        let { edges } = newData.readFiles.edges[0].node.children;
        edges = edges.filter(edge => !IDs.includes(edge.node.id));
        newData.readFiles.edges[0].node.children.edges = edges;
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
