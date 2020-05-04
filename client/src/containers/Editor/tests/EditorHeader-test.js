/* global jest, jasmine, describe, it, expect, beforeEach, FormData */
jest.mock('containers/FormBuilderLoader/FormBuilderLoader');
jest.mock('components/FormBuilderModal/FormBuilderModal');

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';
import EditorHeader, { buttonStates } from '../EditorHeader';

Enzyme.configure({ adapter: new Adapter() });

/**
 *
 * @param props
 * @returns {{baseProps: {showButton: string}, wrapper: ReactWrapper}}
 */
const render = (props) => {
  const baseProps = {
    showButton: buttonStates.NONE,
    ...props
  };
  const wrapper = shallow(<EditorHeader {...baseProps}>Title field</EditorHeader>);
  return { wrapper, baseProps };
};

const BACK_SELECTOR = '.editor-header__back-button';
const BACK_MEDIA_QUERY_SELECTOR = `${BACK_SELECTOR}--md-below`;
const CANCEL_SELECTOR = '.editor-header__cancel-button';
const CANCEL_MEDIA_QUERY_SELECTOR = `${CANCEL_SELECTOR}--lg-above`;
const EDIT_SELECTOR = '.editor-header__edit';

describe('EditorHeader', () => {
  describe('render', () => {
    it('No button at all', () => {
      const { wrapper } = render({});
      expect(wrapper.text().includes('Title field')).toBeTruthy();
      expect(wrapper.find(BACK_SELECTOR).exists()).toBeFalsy();
      expect(wrapper.find(CANCEL_SELECTOR).exists()).toBeFalsy();
      expect(wrapper.find(EDIT_SELECTOR).exists()).toBeFalsy();
    });

    it('Details button', () => {
      const onDetails = jest.fn();
      const { wrapper } = render({ onDetails });
      expect(wrapper.text().includes('Title field')).toBeTruthy();
      expect(wrapper.find(BACK_SELECTOR).exists()).toBeFalsy();
      expect(wrapper.find(CANCEL_SELECTOR).exists()).toBeFalsy();

      const btnDetails = wrapper.find(EDIT_SELECTOR);
      expect(btnDetails.exists()).toBeTruthy();

      btnDetails.simulate('click', new MouseEvent('click'));
      expect(onDetails).toBeCalled();
    });

    it('Back button always displayed', () => {
      const onCancel = jest.fn();
      const { wrapper } = render({ onCancel, showButton: buttonStates.ALWAYS_BACK });
      expect(wrapper.text().includes('Title field')).toBeTruthy();
      expect(wrapper.find(CANCEL_SELECTOR).exists()).toBeFalsy();
      expect(wrapper.find(EDIT_SELECTOR).exists()).toBeFalsy();

      const btnBack = wrapper.find(BACK_SELECTOR);
      expect(btnBack.exists()).toBeTruthy();
      expect(btnBack.is(BACK_MEDIA_QUERY_SELECTOR)).toBeFalsy();

      btnBack.simulate('click', new MouseEvent('click'));
      expect(onCancel).toBeCalled();
    });

    it('Back button sometimes displayed', () => {
      const onCancel = jest.fn();
      const { wrapper } = render({ onCancel, showButton: buttonStates.ONLY_BACK });
      expect(wrapper.text().includes('Title field')).toBeTruthy();
      expect(wrapper.find(CANCEL_SELECTOR).exists()).toBeFalsy();
      expect(wrapper.find(EDIT_SELECTOR).exists()).toBeFalsy();

      const btnBack = wrapper.find(BACK_SELECTOR);
      expect(btnBack.exists()).toBeTruthy();
      expect(btnBack.is(BACK_MEDIA_QUERY_SELECTOR)).toBeTruthy();

      btnBack.simulate('click', new MouseEvent('click'));
      expect(onCancel).toBeCalled();
    });

    it('Cancel button always displayed', () => {
      const onCancel = jest.fn();
      const { wrapper } = render({ onCancel, showButton: buttonStates.ALWAYS_CANCEL });

      expect(wrapper.text().includes('Title field')).toBeTruthy();
      expect(wrapper.find(BACK_SELECTOR).exists()).toBeFalsy();
      expect(wrapper.find(EDIT_SELECTOR).exists()).toBeFalsy();

      const btnCancel = wrapper.find(CANCEL_SELECTOR);
      expect(btnCancel.exists()).toBeTruthy();
      expect(btnCancel.is(CANCEL_MEDIA_QUERY_SELECTOR)).toBeFalsy();

      btnCancel.simulate('click', new MouseEvent('click'));
      expect(onCancel).toBeCalled();
    });


    it('Cancel button sometimes displayed', () => {
      const onCancel = jest.fn();
      const { wrapper } = render({ onCancel, showButton: buttonStates.ONLY_CANCEL });

      expect(wrapper.text().includes('Title field')).toBeTruthy();
      expect(wrapper.find(BACK_SELECTOR).exists()).toBeFalsy();
      expect(wrapper.find(EDIT_SELECTOR).exists()).toBeFalsy();

      const btnCancel = wrapper.find(CANCEL_SELECTOR);
      expect(btnCancel.exists()).toBeTruthy();
      expect(btnCancel.is(CANCEL_MEDIA_QUERY_SELECTOR)).toBeTruthy();

      btnCancel.simulate('click', new MouseEvent('click'));
      expect(onCancel).toBeCalled();
    });

    it('Switch between cancel and back', () => {
      const { wrapper } = render({ showButton: buttonStates.SWITCH });

      const btnCancel = wrapper.find(CANCEL_SELECTOR);
      expect(btnCancel.exists()).toBeTruthy();
      expect(btnCancel.is(CANCEL_MEDIA_QUERY_SELECTOR)).toBeTruthy();

      const btnBack = wrapper.find(BACK_SELECTOR);
      expect(btnBack.exists()).toBeTruthy();
      expect(btnBack.is(BACK_MEDIA_QUERY_SELECTOR)).toBeTruthy();
    });
  });
});
