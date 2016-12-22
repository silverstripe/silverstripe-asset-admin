/* global jest */

const redux = jest.genMockFromModule('redux');

export function compose() {
  return (Component) => Component;
}

export default redux;
