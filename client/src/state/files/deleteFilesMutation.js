import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const mutation = gql`mutation DeleteFiles($IDs:[ID]!) {
  deleteFiles(IDs: $IDs)
}`;

const config = {
  props: ({ mutate, ownProps: { actions } }) => {
    const deleteFiles = (IDs, dataIds) => mutate({
      variables: {
        IDs,
      },
      resultBehaviors: dataIds.map(dataId => ({
        type: 'DELETE',
        dataId,
      })),
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
