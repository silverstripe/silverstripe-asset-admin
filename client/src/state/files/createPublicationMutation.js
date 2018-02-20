import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const createPublicationMutation = (mutationName) => {
  const operationName = mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
  const mutation = gql`
  mutation ${operationName}($IDs:[ID]!, $Force:Boolean) {
    ${mutationName}(IDs: $IDs, Force: $Force) {
      ...on File {
        __typename
        ...FileInterfaceFields
        ...FileFields
      }
      ...on PublicationError {
        __typename
        Type
        Level
        Message
        IDs
      }
    }
  }
  ${fileInterface}
  ${file}
`;

  const config = {
    props: ({ mutate, ownProps: { actions } }) => {
      const mutationAction = (IDs, Force = false) => mutate({
        variables: {
          IDs,
          Force
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
