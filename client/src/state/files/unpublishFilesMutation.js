import { graphql } from '@apollo/client/react/hoc';
import buildPublicationMutation from './buildPublicationMutation';

const { mutation, config } = buildPublicationMutation('unpublishFiles');

export { mutation, config };
export default graphql(mutation, config);
