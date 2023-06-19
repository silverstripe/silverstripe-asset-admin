import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { Component as GalleryItem } from 'components/GalleryItem/GalleryItem';
import IMAGE_STATUS from 'state/imageLoad/ImageLoadStatus';
import SelectGalleryItemTracker from 'components/GalleryItem/tests/SelectGalleryItemTracker';
import thumbnail from './images/thumbnail.png';

const triggerActivate = action('opened');
const triggerCancelUpload = action('cancel upload');
const props = {
  item: {
    title: 'My gallery item',
    thumbnail,
    id: 1,
    selected: false,
    category: 'image',
    canEdit: true,
    exists: true,
  },
  onActivate: (event, item) => triggerActivate(item.title),
  onCancelUpload: (item) => triggerCancelUpload(item.title),
  selectable: true,
  loadState: IMAGE_STATUS.SUCCESS,
};

export default {
  title: 'AssetAdmin/GalleryItem',
  component: GalleryItem,
  decorators: [
    (storyFn) => (
      <SelectGalleryItemTracker>{storyFn()}</SelectGalleryItemTracker>
    ),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Displays a file/folder as a thumbnail with relevant actions.'
      },
      canvas: {
        sourceState: 'shown',
      },
    },
  },
  argTypes: {
    item: {
      description: 'File details to display for.',
      table: {
        type: { summary: 'object' },
      },
    },
    highlights: {
      description: 'Defines whether the item is highlighted (from being open).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    selected: {
      description: 'Defines whether the item is actively selected.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    enlarged: {
      description: 'Whether the item should apply the enlarged class (e.g. when hovered over).',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    message: {
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      },
    },
    value: {
      description: 'message.value: The message to display over the preview area.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: null },
      },
    },
    type: {
      description: 'message.type: The type of message.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: null },
      },
    },
    selectable: {
      description: 'Defines whether the item can be selected.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      },
    },
    onActivate: {
      description: 'Callback for when the item is activated (normally by Click).',
      table: {
        type: { summary: 'function' },
      },
    },
    onSelect: {
      description: 'Callback for when the item is selected.',
      table: {
        type: { summary: 'function' },
      },
    },
    onCancelUpload: {
      description: 'Callback for when the item is cancelled from uploading.',
      table: {
        type: { summary: 'function' },
      },
    },
    onRemoveErroredUpload: {
      description: 'Callback for when the item should be removed, can be called after it errors during upload.',
      table: {
        type: { summary: 'function' },
      },
    },
  }
};

export const _GalleryItem = (args) => <GalleryItem {...args} />;
_GalleryItem.args = {
  selectable: true
};

export const FileItem = (args) => <GalleryItem {...args} />;
FileItem.args = {
  selectable: true
};

export const FileItemWithWrongID = (args) => <GalleryItem {...args} />;
FileItemWithWrongID.args = {
  item: {
    id: 2
  },
  selectable: true
};

export const FileItemHighlighted = (args) => <GalleryItem {...args} />;
FileItemHighlighted.args = {
  ...props,
  item: {
    ...props.item,
    highlighted: true,
  },
};

export const FileItemDraft = (args) => <GalleryItem {...args} />;
FileItemDraft.args = {
  ...props,
  item: {
    ...props.item,
    draft: true,
  },
};

export const FileItemModified = (args) => <GalleryItem {...args} />;
FileItemModified.args = {
  ...props,
  item: {
    ...props.item,
    modified: true,
  },
};

export const FileItemUploadInProgress = (args) => <GalleryItem {...args} />;
FileItemUploadInProgress.args = {
  ...props,
  item: {
    ...props.item,
    id: 0,
    uploading: true,
    progress: 35,
  },
};

export const FolderItem = (args) => <GalleryItem {...args} />;
FolderItem.args = {
  ...props,
  item: {
    ...props.item,
    title: 'My folder',
    category: 'folder',
  },
};

export const FolderItemHighlighted = (args) => <GalleryItem {...args} />;
FolderItemHighlighted.args = {
  ...props,
  item: {
    ...props.item,
    title: 'My folder',
    category: 'folder',
    highlighted: true,
  },
};

export const FolderItemHoveredWithDroppableItems = (args) => <GalleryItem {...args} />;
FolderItemHoveredWithDroppableItems.args = {
  ...props,
  item: {
    ...props.item,
    title: 'My folder',
    category: 'folder',
  },
  enlarged: true,
};
