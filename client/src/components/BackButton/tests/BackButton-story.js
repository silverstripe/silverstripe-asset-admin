import React from 'react';
import { Component as BackButton } from 'components/BackButton/BackButton';

export default {
  title: 'AssetAdmin/BackButton',
  tags: ['autodocs'],
  component: BackButton,
  parameters: {
    docs: {
      description: {
        component: `For handling the Back button in the asset-admin section, has the droppable HOC applied, so that users may move files up a folder.
        Also displays a badge when given the property.`
      },
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  argTypes: {
    onClick: {
      description: 'Handler for when the back button is clicked on.',
      table: {
        type: { summary: 'function' },
        defaultValue: { summary: null },
      },
    },
    isDropping: {
      description: 'The font icon font name.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    badge: {
      description: 'Properties for the Badge to appear for this button. Please refer to the Badge component for property details.',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
  }
};

export const _BackButton = (args) => (<BackButton {...args} />);
_BackButton.args = {};

export const WithBadge = (args) => (<BackButton {...args} badge={{ message: '+3', status: 'success' }} />);
export const Enlarged = () => <BackButton enlarged />;
