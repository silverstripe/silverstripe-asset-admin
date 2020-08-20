import { graphql } from 'react-apollo';
import buildPublicationMutation from './buildPublicationMutation';
import buildPublicationMutationLegacy from './_legacy/buildPublicationMutation';
import Config from 'lib/Config';

const isLegacy = Config.get('graphqlLegacy');
const builder = isLegacy ? buildPublicationMutationLegacy : buildPublicationMutation;
const { mutation, config } = builder('publishFiles');

export { mutation, config };
export default graphql(mutation, config);
