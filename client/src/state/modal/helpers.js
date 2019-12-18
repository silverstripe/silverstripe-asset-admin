/**
 * Recursively search the fieldTree to find a field based on its name.
 * @param fieldName
 * @param fieldTree
 * @returns {false|Object}
 */
export function findField(fieldName, fieldTree) {
  let i;
  for (i = 0; i < fieldTree.length; i++) {
    const field = fieldTree[i];
    if (field.name === fieldName) {
      return field;
    }

    if (field.children) {
      const child = findField(fieldName, field.children);
      if (child) {
        return child;
      }
    }
  }

  return false;
}

/**
 * Determine if the provided field should be stash. We stash a field if:
 * * it's non-structual and
 * * visible and
 * * editable
 * @param {string} fieldName
 * @param {array} fieldTree
 */
export default function isStashableField(fieldName, fieldTree) {
  const field = findField(fieldName, fieldTree);

  return field
    && field.type !== 'hidden'
    && field.schemaType !== 'Structural'
    && !field.readOnly
    && !field.disabled;
}
