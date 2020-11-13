import { graphqlTemplates } from 'lib/Injector';

const apolloConfig = {
  options({ files }) {
    return {
      variables: {
        ids: files.map((file) => file.id)
      },
    };
  },
  props(
    props
  ) {
    const {
      data: {
        error,
        readFileUsage,
        loading: networkLoading,
      },
    } = props;
    const errors = error && error.graphQLErrors &&
      error.graphQLErrors.map((graphQLError) => graphQLError.message);

    const fileUsage = readFileUsage ?
      readFileUsage.reduce((accumulator, { id, inUseCount }) => (
        { ...accumulator, [id]: inUseCount }
      ), {}) :
      {};

    return {
      loading: networkLoading,
      fileUsage,
      graphQLErrors: errors,
    };
  },
};

const { READ } = graphqlTemplates;
const query = {
  apolloConfig,
  templateName: READ,
  pluralName: 'FileUsage',
  pagination: false,
  params: {
    ids: '[ID]!'
  },
  args: {
    root: {
      ids: 'ids'
    }
  },
  fields: ['id', 'inUseCount'],
};
export default query;
