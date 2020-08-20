import { graphql } from 'react-apollo';
import buildPublicationMutation from './buildPublicationMutation';
import buildPublicationMutationLegacy from './_legacy/buildPublicationMutation';

// Backward compatibility hack. Remove when GraphQL 4 is in core
const isLegacy = !!document.body.getAttribute('data-graphql-legacy');

const builder = isLegacy ? buildPublicationMutationLegacy : buildPublicationMutation;
const { mutation, config } = builder('publishFiles');

export { mutation, config };
export default graphql(mutation, config);
