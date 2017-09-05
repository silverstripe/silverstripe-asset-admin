import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const createPublicationMutation = (mutationName, behaviourType) => {
  const operationName = mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
  const mutation = gql`
  mutation ${operationName}($id:ID!) {
    ${mutationName}(id: $id) {
      ...FileInterfaceFields
      ...FileFields
    }
  }
  ${fileInterface}
  ${file}
`;

  const config = {
    props: ({ mutate, ownProps: { actions } }) => {
      const mutationAction = (id, dataId) => mutate({
        variables: {
          id,
        },
        resultBehaviors: [
          {
            type: behaviourType,
            dataId,
          },
        ],
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
