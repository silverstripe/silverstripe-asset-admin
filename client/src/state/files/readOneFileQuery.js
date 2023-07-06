import { graphqlTemplates } from 'lib/Injector';

/**
 * Query to fetch a single file by its ID. The resulting file will be pass to your component
 * under a `file` prop. `null` will be pass if the specified ID does not exist.
 */
const apolloConfig = {
  options({ fileId }) {
    return {
      variables: {
        rootFilter: {
          id: fileId
        },
      },
    };
  },
  props({ data: { error, readFiles, loading: networkLoading } }) {
    const file = readFiles ? readFiles[0] : null;
    const errors = error && error.graphQLErrors &&
      error.graphQLErrors.map((graphQLError) => graphQLError.message);
    return {
      loading: networkLoading,
      file,
      graphQLErrors: errors,
    };
  },
};

const { READ } = graphqlTemplates;
const query = {
  apolloConfig,
  templateName: READ,
  pluralName: 'Files',
  pagination: false,
  params: {
    rootFilter: 'FileFilterInput',
  },
  args: {
    root: {
      filter: 'rootFilter'
    }
  },
  fragments: [
    'FileInterfaceFields',
    'FileFields',
  ],
  fields: [
    '...FileInterfaceFields',
    '...FileFields',
  ],
};

export default query;
