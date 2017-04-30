import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const mutation = gql`
  mutation UnpublishFile($id:ID!) {
    unpublishFile(id: $id) {
      ...FileInterfaceFields
      ...FileFields
    }
  }
  ${fileInterface}
  ${file}
`;

const config = {
  props: ({ mutate, ownProps: { actions } }) => {
    const unpublishFile = (id, dataId) => mutate({
      variables: {
        id,
      },
      resultBehaviors: [
        {
          type: 'UNPUBLISH',
          dataId,
        },
      ],
    });

    return {
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          unpublishFile,
        }),
      }),
    };
  },
};

export { mutation, config };

export default graphql(mutation, config);

