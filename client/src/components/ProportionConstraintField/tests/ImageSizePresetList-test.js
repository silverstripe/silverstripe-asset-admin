/* global jest, jasmine, describe, it, expect, beforeEach */

import React from 'react';
import ImageSizePresetList from '../ImageSizePresetList';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';


Enzyme.configure({ adapter: new Adapter() });

const imageSizePresets = [
  { width: 1234, text: 'default', default: true },
  { width: 4321, text: 'super large' },
  { width: 2, text: 'super small' },
];

/**
 * @param {Object} props
 * @returns {{item: *, calls: }}
 */
const render = (props = {}) => {
  const onSelect = jest.fn();

  const item = mount(
    <ImageSizePresetList
      onSelect={onSelect}
      imageSizePresets={imageSizePresets}
      currentWidth={123}
      originalWidth={321}
      {...props}
    />
  );

  return {
    item,
    calls: onSelect.mock.calls,
    buttons: item ? item.find('Button') : undefined
  };
};

describe('ImageSizePresetList', () => {
  describe('render()', () => {
    it('presets are displayed', () => {
      const { buttons } = render();
      expect(buttons.get(0).props.children[0].props.children).toContain('Set image size to');
      expect(buttons.get(0).props.children[1].props.children).toContain('default');
      expect(buttons.get(1).props.children[0].props.children).toContain('Set image size to');
      expect(buttons.get(1).props.children[1].props.children).toContain('super large');
      expect(buttons.get(2).props.children[0].props.children).toContain('Set image size to');
      expect(buttons.get(2).props.children[1].props.children).toContain('super small');
    });

    it('preset bigger than image are disabled', () => {
      const { buttons } = render();
      expect(buttons.get(0).props.disabled).toBe(true);
      expect(buttons.get(1).props.disabled).toBe(true);
      expect(buttons.get(2).props.disabled).toBe(false);
    });

    it('selected preset is disabled', () => {
      const { buttons } = render({ currentWidth: 2 });
      expect(buttons.get(0).props.disabled).toBe(true);
      expect(buttons.get(1).props.disabled).toBe(true);
      expect(buttons.get(2).props.disabled).toBe(true);
    });
  });

  describe('onSelect()', () => {
    it('clicking a button trigger onSelect()', () => {
      const { buttons, calls } = render();
      buttons.get(2).props.onClick();
      expect(calls.length).toBe(1);
      expect(calls[0][0]).toBe(2);
    });
  });
});
