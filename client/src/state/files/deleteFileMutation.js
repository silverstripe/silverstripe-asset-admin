import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const mutation = gql`mutation DeleteFile($id:ID!) {
  deleteFile(id: $id)
}`;

const config = {
  props: ({ mutate, ownProps: { actions } }) => {
    const deleteFile = (id, dataId) => mutate({
      variables: {
        id,
      },
      resultBehaviors: [
        {
          type: 'DELETE',
          dataId,
        },
      ],
    });

    return {
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          deleteFile,
        }),
      }),
    };
  },
};

export { mutation, config };

export default graphql(mutation, config);
