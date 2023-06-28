/* global jest, test, expect */

import React from 'react';
import IMAGE_STATUS from 'state/imageLoad/ImageLoadStatus';
import { render, fireEvent } from '@testing-library/react';
import { Component as GalleryItem } from '../GalleryItem';

function makeProps(obj = {}) {
  return {
    id: 0,
    selectable: true,
    selected: false,
    onSelect: () => null,
    onActivate: () => null,
    onDelete: () => null,
    onRemoveErroredUpload: () => null,
    onCancelUpload: () => null,
    item: {
      width: 10,
      height: 10,
      exists: true,
      category: 'image',
      id: 1,
      title: 'test',
      canEdit: true,
    },
    sectionConfig: {
      imageRetry: {
        minRetry: 0,
        maxRetry: 0,
        expiry: 0,
      },
    },
    loadState: IMAGE_STATUS.DISABLED,
    ...obj
  };
}

test('GalleryItem handleCancelUpload() should call onRemoveErroredUpload when there was an error', () => {
  const onRemoveErroredUpload = jest.fn();
  const onCancelUpload = jest.fn();
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        message: {
          type: 'error'
        },
        queuedId: 1,
        id: 0
      },
      onRemoveErroredUpload,
      onCancelUpload
    })}
    />
  );
  const label = container.querySelector('.gallery-item__checkbox-label');
  fireEvent.click(label);
  expect(onRemoveErroredUpload).toHaveBeenCalled();
  expect(onCancelUpload).not.toHaveBeenCalled();
});

test('GalleryItem handleCancelUpload() should call onCancelUpload when there was an error', () => {
  const onRemoveErroredUpload = jest.fn();
  const onCancelUpload = jest.fn();
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        message: {
          type: 'not-an-error'
        },
        queuedId: 1,
        id: 0
      },
      onRemoveErroredUpload,
      onCancelUpload
    })}
    />
  );
  const label = container.querySelector('.gallery-item__checkbox-label');
  fireEvent.click(label);
  expect(onRemoveErroredUpload).not.toHaveBeenCalled();
  expect(onCancelUpload).toHaveBeenCalled();
});

test('GalleryItem handleActive() should call props.onActivate', () => {
  const onActivate = jest.fn();
  const { container } = render(
    <GalleryItem {...makeProps({
      onActivate
    })}
    />
  );
  fireEvent.click(container.querySelector('.gallery-item'));
  expect(onActivate).toHaveBeenCalled();
});

test('GalleryItem handleSelect() should call props.onSelect', () => {
  const onSelect = jest.fn();
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        id: 1,
        canEdit: true
      },
      selectable: true,
      onSelect
    })}
    />
  );
  const label = container.querySelector('.gallery-item__checkbox-label');
  fireEvent.click(label);
  expect(onSelect).toHaveBeenCalled();
});

test('GalleryItem getThumbnailStyles() should return backgroundImage with the correct url if the item is a thumbnail', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image',
        url: 'myUrl',
        thumbnail: 'myThumbnailUrl',
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.style.backgroundImage).toBe('url(myThumbnailUrl)');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--small');
});

test('GalleryItem getThumbnailStyles() should return backgroundImage with the correct url with vid if the item is a thumbnail has a version', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image',
        url: 'myUrl',
        thumbnail: 'myThumbnailUrl',
        version: 123
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.style.backgroundImage).toBe('url(myThumbnailUrl?vid=123)');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--small');
});

test('GalleryItem getThumbnailStyles() should return backgroundImage with the correct url without vid when cache busting is off', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      bustCache: false,
      item: {
        ...makeProps().item,
        category: 'image',
        url: 'myUrl',
        thumbnail: 'myThumbnailUrl',
        version: 123,
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.style.backgroundImage).toBe('url(myThumbnailUrl)');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--small');
});

test('GalleryItem getThumbnailStyles() should return backgroundImage with the correct data-url when thumbnail is included in graphql body', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image',
        url: 'myUrl',
        thumbnail: 'data:image/jpeg;base64,0000',
        version: 123
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.style.backgroundImage).toBe('url(data:image/jpeg;base64,0000)');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--small');
});

test('GalleryItem getThumbnailStyles() should not return backgroundImage with no thumbnail can be found', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image',
        url: 'myUrl',
        thumbnail: '',
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.style.backgroundImage).toBe('');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--small');
});

test('GalleryItem getThumbnailStyles() should not return backgroundImage if thumbnail failed to load', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      loadState: IMAGE_STATUS.FAILED,
      item: {
        ...makeProps().item,
        category: 'image',
        url: 'myUrl',
        thumbnail: 'myThumbnailUrl',
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.style.backgroundImage).toBe('');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--small');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--error');
});

test('GalleryItem getThumbnailStyles() should return an empty object if the item is not an image', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'notAnImage',
        url: 'myUrl',
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.style.backgroundImage).toBe('');
});

test('GalleryItem getThumbnailClassNames() should return small classes if the image is smaller than a thumbnail', () => {
  const { container } = render(
    <GalleryItem {...makeProps()}/>
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--small');
});

test('GalleryItem getThumbnailClassNames() should not return small classes if the image is larger than a thumbnail', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        width: 1000,
        height: 1000
      },
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.classList).not.toContain('gallery-item__thumbnail--small');
});

test('GalleryItem getItemClassNames() should return the file\'s category', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image'
      },
    })}
    />
  );
  expect(container.querySelector('.gallery-item').classList).toContain('gallery-item--image');
});

test('GalleryItem getItemClassNames() should return selected if the selected prop is true', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      selectable: true,
      item: {
        ...makeProps().item,
        selected: true
      },
    })}
    />
  );
  expect(container.querySelector('.gallery-item').classList).toContain('gallery-item--selected');
});

test('GalleryItem getItemClassNames() should return not selected if the selected prop is true but not selectable', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      selectable: false,
      item: {
        ...makeProps().item,
        selected: true
      },
    })}
    />
  );
  expect(container.querySelector('.gallery-item').classList).not.toContain('gallery-item--selected');
});

test('GalleryItem getItemClassNames() should return a "dropping" class when the item is marked as hovered over with an item drop', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      isDropping: true
    })}
    />
  );
  expect(container.querySelector('.gallery-item').classList).toContain('gallery-item--dropping');
});

test('GalleryItem handleKeyDown() should trigger onSelect when the space key is pressed', () => {
  const onSelect = jest.fn();
  const onActivate = jest.fn();
  const { container } = render(
    <GalleryItem {...makeProps({
      onSelect,
      onActivate
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  fireEvent.keyDown(item, { keyCode: 32 });
  expect(onSelect).toHaveBeenCalled();
  expect(onActivate).not.toHaveBeenCalled();
});

test('GalleryItem handleKeyDown() should trigger onActivate when the enter key is pressed', () => {
  const onSelect = jest.fn();
  const onActivate = jest.fn();
  const { container } = render(
    <GalleryItem {...makeProps({
      onSelect,
      onActivate
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  fireEvent.keyDown(item, { keyCode: 13 });
  expect(onSelect).not.toHaveBeenCalled();
  expect(onActivate).toHaveBeenCalled();
});
