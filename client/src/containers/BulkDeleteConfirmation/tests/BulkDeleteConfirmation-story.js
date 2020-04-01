import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { setAddon, storiesOf } from '@storybook/react';
import { Component as BulkDeleteConfirmation } from '../BulkDeleteConfirmation';
import { withKnobs, boolean, select } from '@storybook/addon-knobs/react';
import { JSXAddon } from 'storybook-addon-jsx';
import { mockfiles as files } from './mockfiles';
import LoadingComponent from 'components/Loading/Loading';
import { action } from '@storybook/addon-actions';

setAddon(JSXAddon);

const actions = {
  onCancel: (event) => action('onCancel')(event),
  onConfirm: (event) => action('onConfirm')(event),
  onModalClose: (event) => action('onModalClose')(event)
};

actions.onCancel.toString = () => 'onCancel';
actions.onConfirm.toString = () => 'onConfirm';
actions.onModalClose.toString = () => 'onModalClose';

const propsForState = {
  loading: {
    loading: true,
    LoadingComponent
  },
  'nothing in use': {
    loading: false,
    files: files.filter(({ id }) => id === 3),
    fileUsage: {}
  },
  'single file in use': {
    loading: false,
    files: files.filter(({ id }) => id === 3),
    fileUsage: { 3: 1 }
  },
  'many file in use': {
    loading: false,
    files,
    fileUsage: { 3: 1, 4: 5 }
  },
  'folder in use': {
    loading: false,
    files: files.filter(({ id }) => id === 1),
    fileUsage: { 1: 1 }
  },
};

storiesOf('AssetAdmin/DeleteConfirmation', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const key = select('State', Object.keys(propsForState), 'loading');
    const props = propsForState[key];

    return (<BulkDeleteConfirmation
      transition={boolean('canceling', false) && 'canceling'}
      {...props}
      {...actions}
    />);
  });
