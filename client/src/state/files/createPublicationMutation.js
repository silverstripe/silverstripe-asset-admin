import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const createPublicationMutation = (mutationName) => {
  const operationName = mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
  const mutation = gql`
  mutation ${operationName}($IDs:[ID]!) {
    ${mutationName}(IDs: $IDs) {
      ...FileInterfaceFields
      ...FileFields
    }
  }
  ${fileInterface}
  ${file}
`;

  const config = {
    props: ({ mutate, ownProps: { actions } }) => {
      const mutationAction = (IDs) => mutate({
        variables: {
          IDs,
        },
      });

      return {
        actions: {
          ...actions,
          files: {
            ...actions.files,
            [mutationName]: mutationAction,
          },
        },
      };
    },
  };

  return { mutation, config };
};

export default createPublicationMutation;
