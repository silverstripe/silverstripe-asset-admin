import { hasFilters } from 'components/Search/Search';
import { graphqlTemplates } from 'lib/Injector';

const apolloConfig = {
  options({ fileId }) {
    const rootFilter = {
      id: fileId,
    };

    return {
      variables: {
        rootFilter,
      },
    };
  },
  props(
    {
      data: {
        error,
        refetch,
        readFiles,
        loading: networkLoading,
      },
      ownProps: { actions },
    }
  ) {
    const file = readFiles ? readFiles[0] : null;

    const errors = error && error.graphQLErrors &&
      error.graphQLErrors.map((graphQLError) => graphQLError.message);
    return {
      loading: networkLoading,
      file,
      graphQLErrors: errors,
      actions: Object.assign({}, actions, {
        files: Object.assign({}, actions.files, {
          readFiles: refetch,
        }),
      }),
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
