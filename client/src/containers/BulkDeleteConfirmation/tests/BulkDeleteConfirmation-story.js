// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
import LoadingComponent from 'components/Loading/Loading';
import { action } from '@storybook/addon-actions';
import { mockfiles as files } from './mockfiles';
import { Component as BulkDeleteConfirmation } from '../BulkDeleteConfirmation';

const actions = {
  onCancel: (event) => action('onCancel')(event),
  onConfirm: (event) => action('onConfirm')(event),
  onModalClose: (event) => action('onModalClose')(event),
};

actions.onCancel.toString = () => 'onCancel';
actions.onConfirm.toString = () => 'onConfirm';
actions.onModalClose.toString = () => 'onModalClose';

export default {
  title: 'AssetAdmin/DeleteConfirmation',
  decorators: [jsxDecorator],
  component: BulkDeleteConfirmation,
};

export const Default = {
  args: {
    loading: true,
    LoadingComponent,
    ...actions,
  }
};

export const NothingInUse = {
  args: {
    ...Default.args,
    loading: false,
    files: files.filter(({ id }) => id === 3),
    descendantFileCounts: {},
  }
};

export const SingleFileInUse = {
  args: {
    ...Default.args,
    loading: false,
    files: files.filter(({ id }) => id === 3),
    descendantFileCounts: { 3: 1 },
  }
};

export const ManyFilesInUse = {
  args: {
    ...Default.args,
    loading: false,
    files,
    descendantFileCounts: { 3: 1, 4: 5 },
  }
};

export const FolderInUse = {
  args: {
    ...Default.args,
    loading: false,
    files: files.filter(({ id }) => id === 1),
    descendantFileCounts: { 1: 1 },
  }
};
