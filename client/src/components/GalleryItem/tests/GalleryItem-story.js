import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
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

storiesOf('AssetAdmin/GalleryItem', module)
  .addDecorator((storyFn) => (
    <SelectGalleryItemTracker>{storyFn()}</SelectGalleryItemTracker>
  ))
  .add('File item', () => (
    <GalleryItem {...props} />
  ))
  .add('File item - highlighted', () => {
    const modProps = {
      ...props,
      item: {
        ...props.item,
        highlighted: true,
      },
    };

    return <GalleryItem {...modProps} />;
  })
  .add('File item - draft', () => {
    const modProps = {
      ...props,
      item: {
        ...props.item,
        draft: true,
      },
    };

    return <GalleryItem {...modProps} />;
  })
  .add('File item - modified', () => {
    const modProps = {
      ...props,
      item: {
        ...props.item,
        modified: true,
      },
    };

    return <GalleryItem {...modProps} />;
  })
  .add('File item - upload in progress', () => {
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
  })
  .add('Folder item', () => {
    const modProps = {
      ...props,
      item: {
        ...props.item,
        title: 'My folder',
        category: 'folder',
      },
    };

    return <GalleryItem {...modProps} />;
  })
  .add('Folder item highlighted', () => {
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
  })
  .add('Folder item hovered with droppable items', () => {
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
  });
