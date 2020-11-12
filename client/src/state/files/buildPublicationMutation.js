import gql from 'graphql-tag';
import { fileInterface, file } from 'lib/fileFragments';

const buildPublicationMutation = (mutationName) => {
  const operationName = mutationName.charAt(0).toUpperCase() + mutationName.slice(1);
  const mutation = gql`
  mutation ${operationName}($ids:[ID]!, $force:Boolean, $quiet:Boolean) {
    ${mutationName}(ids: $ids, force: $force, quiet: $quiet) {
      ...on File {
        __typename
        ...FileInterfaceFields
        ...FileFields
      }
      ...on PublicationNotice {
        __typename
        noticeType
        message
        ids
      }
    }
  }
  ${fileInterface}
  ${file}
`;

  const isProd = process.env.NODE_ENV === 'production';
  const config = {
    props: ({ mutate, ownProps: { actions } }) => {
      const mutationAction = (ids, force = false, quiet = isProd) => mutate({
        variables: {
          ids,
          quiet,
          force
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
