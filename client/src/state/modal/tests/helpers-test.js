/* global jest, describe, it, pit, expect, beforeEach, jasmine */
import isStashableField, { findField } from '../helpers';

const stashable = {
  name: 'Stashable',
  schemaType: 'Text',
  type: 'text',
  readOnly: false,
  disabled: false
};

const stashableChild = {
  ...stashable,
  name: 'StashableChild'
};

const nonStashableChild = {
  ...stashable,
  name: 'NonStashableChild',
  readOnly: true
};

const hidden = {
  ...stashable,
  name: 'Hidden',
  type: 'hidden'
};

const readOnly = {
  ...stashable,
  name: 'Readonly',
  readOnly: true,
};

const disabled = {
  ...stashable,
  name: 'Disabled',
  disabled: true,
};

const structural = {
  name: 'StructuralField',
  schemaType: 'Structural',
  children: [stashableChild, nonStashableChild]
};


export const fields = [
  stashable,
  structural,
  hidden,
  readOnly,
  disabled
];

describe('Modal Store helpers', () => {
  describe('findField', () => {
    const cases = [
      ['Top level field', 'Stashable', stashable],
      ['Child field', 'StashableChild', stashableChild],
      ['Missing field', 'missing', false],
    ];

    cases.forEach(([caseName, fieldName, expected]) =>
      it(caseName, () => {
        const field = findField(fieldName, fields);
        expect(field).toBe(expected);
      })
    );
  });

  describe('isStashableField', () => {
    const cases = [
      ['Stashable field', 'Stashable', true],
      ['Stashable child field', 'StashableChild', true],
      ['Missing field', 'missing', false],
      ['Non Stashable child field', 'NonStashableChild', false],
      ['Structural Field', 'StructuralField', false],
      ['Hidden Field', 'Hidden', false],
      ['Readonly Field', 'ReadOnly', false],
      ['Disabled Field', 'Disabled', false],
    ];

    cases.forEach(([caseName, fieldName, expected]) =>
      it(caseName, () => {
        const isStashable = isStashableField(fieldName, fields);
        expect(isStashable).toBe(expected);
      })
    );
  });
});

