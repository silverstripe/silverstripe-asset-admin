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
  decorators: [
    (storyFn) => (
            <SelectGalleryItemTracker>{storyFn()}</SelectGalleryItemTracker>
    ),
  ],
};

export const FileItem = () => <GalleryItem {...props} />;

FileItem.story = {
  name: 'File item',
};

export const FileItemHighlighted = () => {
  const modProps = {
    ...props,
    item: {
      ...props.item,
      highlighted: true,
    },
  };

  return <GalleryItem {...modProps} />;
};

FileItemHighlighted.story = {
  name: 'File item - highlighted',
};

export const FileItemDraft = () => {
  const modProps = {
    ...props,
    item: {
      ...props.item,
      draft: true,
    },
  };

  return <GalleryItem {...modProps} />;
};

FileItemDraft.story = {
  name: 'File item - draft',
};

export const FileItemModified = () => {
  const modProps = {
    ...props,
    item: {
      ...props.item,
      modified: true,
    },
  };

  return <GalleryItem {...modProps} />;
};

FileItemModified.story = {
  name: 'File item - modified',
};

export const FileItemUploadInProgress = () => {
  const modProps = {
    ...props,
    item: {
      ...props.item,
      id: 0,
      uploading: true,
      progress: 35,
    },
  };

  return <GalleryItem {...modProps} />;
};

FileItemUploadInProgress.story = {
  name: 'File item - upload in progress',
};

export const FolderItem = () => {
  const modProps = {
    ...props,
    item: {
      ...props.item,
      title: 'My folder',
      category: 'folder',
    },
  };

  return <GalleryItem {...modProps} />;
};

FolderItem.story = {
  name: 'Folder item',
};

export const FolderItemHighlighted = () => {
  const modProps = {
    ...props,
    item: {
      ...props.item,
      title: 'My folder',
      category: 'folder',
      highlighted: true,
    },
  };

  return <GalleryItem {...modProps} />;
};

FolderItemHighlighted.story = {
  name: 'Folder item highlighted',
};

export const FolderItemHoveredWithDroppableItems = () => {
  const modProps = {
    ...props,
    item: {
      ...props.item,
      title: 'My folder',
      category: 'folder',
    },
    enlarged: true,
  };

  return <GalleryItem {...modProps} />;
};

FolderItemHoveredWithDroppableItems.story = {
  name: 'Folder item hovered with droppable items',
};
