import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const buildPublicationMutation = (mutationName) => {
  const operationName = mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
  const mutation = gql`
  mutation ${operationName}($IDs:[ID]!, $Force:Boolean, $Quiet:Boolean) {
    ${mutationName}(IDs: $IDs, Force: $Force, Quiet: $Quiet) {
      ...on File {
        __typename
        ...FileInterfaceFields
        ...FileFields
      }
      ...on PublicationNotice {
        __typename
        Type
        Message
        IDs
      }
    }
  }
  ${fileInterface}
  ${file}
`;

  const isProd = process.env.NODE_ENV === 'production';
  const config = {
    props: ({ mutate, ownProps: { actions } }) => {
      const mutationAction = (IDs, Force = false, Quiet = isProd) => mutate({
        variables: {
          IDs,
          Quiet,
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

export default buildPublicationMutation;
