import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Injector from 'lib/Injector';

const mutation = gql`mutation DeleteFiles($IDs:[ID]!) {
  deleteFiles(IDs: $IDs)
}`;

const config = {
  props: ({ mutate, ownProps }) => {
    const { actions } = ownProps;
    const deleteFiles = (IDs, parentId = null) => mutate({
      variables: {
        IDs,
      },
      update: (store) => {
        const readFilesQuery = Injector.query.get('ReadFilesQuery');
        const readFilesConfig = readFilesQuery.getApolloConfig();
        const variables = readFilesConfig.options(ownProps).variables;
        if (parentId !== null) {
          variables.rootFilter.id = parentId;
          variables.rootFilter.anyChildId = null;
        }
        const query = readFilesQuery.getGraphqlAST();
        const data = store.readQuery({ query, variables });

        // Query returns a deeply nested object. Explicit reconstruction via spreads is too verbose.
        // This is an alternative, relatively efficient way to deep clone
        const newData = JSON.parse(JSON.stringify(data));
        let { nodes } = newData.readFiles.nodes[0].children;
        nodes = nodes.filter(node => !IDs.includes(node.id));
        newData.readFiles.nodes[0].children.nodes = nodes;
        newData.readFiles.nodes[0].children.pageInfo.totalCount = nodes.length;
        store.writeQuery({ query, data: newData, variables });
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
