import { graphql } from 'react-apollo';
import createPublicationMutation from './createPublicationMutation';

const { mutation, config } = createPublicationMutation('publishFile', 'PUBLISH');

export { mutation, config };
export default graphql(mutation, config);
