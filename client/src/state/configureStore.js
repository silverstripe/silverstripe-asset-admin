/**
 * @file Factory for creating a Redux store.
 */

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'; // Used for handling async store updates.
import createLogger from 'redux-logger'; // Logs state changes to the console. Useful for debugging.
import rootReducer from './reducer';

/**
 * @func createStoreWithMiddleware
 * @param function rootReducer
 * @param object initialState
 * @desc Creates a Redux store with some middleware applied.
 * @private
 */
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  createLogger()
)(createStore);

/**
 * @func configureStore
 * @param object initialState
 * @return object - A Redux store that lets you read the state, dispatch actions and subscribe to changes.
 */
export default function configureStore(initialState = {}) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store;
}
