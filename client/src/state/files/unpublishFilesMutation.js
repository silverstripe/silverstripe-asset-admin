import { graphql } from 'react-apollo';
import buildPublicationMutation from './buildPublicationMutation';

const { mutation, config } = buildPublicationMutation('unpublishFiles');

export { mutation, config };
export default graphql(mutation, config);
