import { graphqlTemplates } from 'lib/Injector';

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
  props({ data: { error, readFiles, loading } }) {
    const file = (readFiles && readFiles.nodes[0]) ? readFiles.nodes[0] : null;
    const errors = error && error.graphQLErrors &&
      error.graphQLErrors.map((graphQLError) => graphQLError.message);
    return {
      loading,
      file,
      graphQLErrors: errors
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
    rootFilter: 'FileFilterInput'
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
    'nodes', [
      '...FileInterfaceFields',
      '...FileFields'
    ],
  ],
};

export default query;
