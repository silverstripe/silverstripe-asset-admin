/* global jest */

const graphql = jest.genMockFunction().mockImplementation(() => (Component) => Component);

export { graphql };
