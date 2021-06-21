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
        readDescendantFileCounts,
        loading: networkLoading,
      },
    } = props;
    const errors = error && error.graphQLErrors &&
      error.graphQLErrors.map((graphQLError) => graphQLError.message);

    const descendantFileCounts = readDescendantFileCounts ?
      readDescendantFileCounts.reduce((accumulator, { id, count }) => (
        { ...accumulator, [id]: count }
      ), {}) :
      {};

    return {
      loading: networkLoading,
      descendantFileCounts,
      graphQLErrors: errors,
    };
  },
};

const { READ } = graphqlTemplates;
const query = {
  apolloConfig,
  templateName: READ,
  pluralName: 'DescendantFileCounts',
  pagination: false,
  params: {
    ids: '[ID]!'
  },
  args: {
    root: {
      ids: 'ids'
    }
  },
  fields: ['id', 'count'],
};
export default query;
