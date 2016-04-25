import ACTION_TYPES from './SchemaActionTypes';

/**
 * Sets the schema being used to generate the curent layout.
 *
 * @param string schema - JSON schema for the layout.
 */
export function setSchema(schema) {
  return (dispatch) =>
    dispatch({
      type: ACTION_TYPES.SET_SCHEMA,
      payload: schema,
    });
}
