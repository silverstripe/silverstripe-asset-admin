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
    actions: {
      imageLoad: () => null,
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

test('GalleryItem getThumbnailStyles() should return backgroundImage with the correct data-url when thumbnail is included in json response', () => {
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

test('GalleryItem should render error message when item has an error', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        message: {
          type: 'error',
          value: 'Upload failed'
        }
      }
    })}
    />
  );
  const errorMessage = container.querySelector('.gallery-item__error-message');
  expect(errorMessage).not.toBeNull();
  expect(errorMessage.textContent).toBe('Upload failed');
});

test('GalleryItem should not render error message when item has no error', () => {
  const { container } = render(
    <GalleryItem {...makeProps()}/>
  );
  const errorMessage = container.querySelector('.gallery-item__error-message');
  expect(errorMessage).toBeNull();
});

test('GalleryItem should display file missing error when file does not exist but is saved', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        exists: false,
        id: 1
      }
    })}
    />
  );
  const errorMessage = container.querySelector('.gallery-item__error-message');
  expect(errorMessage).not.toBeNull();
  expect(errorMessage.textContent).toContain('File cannot be found');
});

test('GalleryItem should render progress bar when uploading', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        queuedId: 1,
        id: 0,
        progress: 50
      }
    })}
    />
  );
  const progressBar = container.querySelector('.gallery-item__progress-bar');
  expect(progressBar).not.toBeNull();
  expect(progressBar.style.width).toBe('50%');
});

test('GalleryItem should not render progress bar when upload is complete', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        queuedId: 1,
        id: 1,
        progress: 100
      }
    })}
    />
  );
  const progressBar = container.querySelector('.gallery-item__progress-bar');
  expect(progressBar).toBeNull();
});

test('GalleryItem should render status flags for draft items', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        draft: true,
        type: 'file'
      }
    })}
    />
  );
  const statusFlags = container.querySelector('.gallery-item__status-flags');
  expect(statusFlags).not.toBeNull();
  const spans = statusFlags.querySelectorAll('span');
  expect(spans.length).toBeGreaterThan(0);
  const draftFlag = Array.from(spans).find(span => span.classList.contains('gallery-item--draft'));
  expect(draftFlag).not.toBeNull();
});

test('GalleryItem should render status flags for modified items', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        modified: true,
        type: 'file'
      }
    })}
    />
  );
  const statusFlags = container.querySelector('.gallery-item__status-flags');
  expect(statusFlags).not.toBeNull();
  const spans = statusFlags.querySelectorAll('span');
  expect(spans.length).toBeGreaterThan(0);
  const modifiedFlag = Array.from(spans).find(span => span.classList.contains('gallery-item--modified'));
  expect(modifiedFlag).not.toBeNull();
});

test('GalleryItem should not render status flags for folder type', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        draft: true,
        type: 'folder'
      }
    })}
    />
  );
  const statusFlags = container.querySelector('.gallery-item__status-flags');
  const draftFlag = statusFlags.querySelector('[key="status-draft"]');
  expect(draftFlag).toBeNull();
});

test('GalleryItem should render status icons for restricted access', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        hasRestrictedAccess: true
      }
    })}
    />
  );
  const statusIcons = container.querySelector('.gallery-item__status-icons');
  expect(statusIcons).not.toBeNull();
  expect(statusIcons.children.length).toBeGreaterThan(0);
});

test('GalleryItem should render badge when provided', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      badge: {
        status: 'warning',
        message: 'Test badge'
      }
    })}
    />
  );
  const badge = container.querySelector('.gallery-item__badge');
  expect(badge).not.toBeNull();
});

test('GalleryItem should not render badge when not provided', () => {
  const { container } = render(
    <GalleryItem {...makeProps()}/>
  );
  const badge = container.querySelector('.gallery-item__badge');
  expect(badge).toBeNull();
});

test('GalleryItem should apply folder class for folder type', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        type: 'folder'
      }
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--folder');
});

test('GalleryItem should apply no-preview class for images without thumbnail', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image',
        thumbnail: ''
      }
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--no-preview');
});

test('GalleryItem should apply missing class when file is missing', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        exists: false,
        id: 1
      }
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.classList).toContain('gallery-item--missing');
});

test('GalleryItem should apply selectable class when selectable', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      selectable: true
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.classList).toContain('gallery-item--selectable');
});

test('GalleryItem should apply highlighted class when highlighted', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        highlighted: true
      }
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.classList).toContain('gallery-item--highlighted');
});

test('GalleryItem should apply error class when item has error', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        message: {
          type: 'error'
        }
      }
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.classList).toContain('gallery-item--error');
});

test('GalleryItem should apply dragging class when dragging', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      isDragging: true
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.classList).toContain('gallery-item--dragging');
});

test('GalleryItem should apply selected class when dragging even if not explicitly selected', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      selectable: true,
      isDragging: true,
      item: {
        ...makeProps().item,
        selected: false
      }
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.classList).toContain('gallery-item--selected');
});

test('GalleryItem should apply max-selected class when maxSelected and not selected', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      maxSelected: true,
      selectable: true,
      item: {
        ...makeProps().item,
        selected: false
      }
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.classList).toContain('gallery-item--max-selected');
});

test('GalleryItem should disable checkbox when canEdit is false', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      selectable: true,
      item: {
        ...makeProps().item,
        canEdit: false
      }
    })}
    />
  );
  const checkbox = container.querySelector('.gallery-item__checkbox');
  expect(checkbox.disabled).toBe(true);
  const label = container.querySelector('.gallery-item__checkbox-label');
  expect(label.classList).toContain('gallery-item__checkbox-label--disabled');
});

test('GalleryItem should not call onActivate if item is not saved', () => {
  const onActivate = jest.fn();
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        id: 0,
        queuedId: 1
      },
      onActivate
    })}
    />
  );
  fireEvent.click(container.querySelector('.gallery-item'));
  expect(onActivate).not.toHaveBeenCalled();
});

test('GalleryItem should show overlay for existing files', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        exists: true
      }
    })}
    />
  );
  const overlay = container.querySelector('.gallery-item--overlay');
  expect(overlay).not.toBeNull();
  const eyeIcon = overlay.querySelector('.font-icon-eye');
  expect(eyeIcon).not.toBeNull();
});

test('GalleryItem should not show overlay for uploading files', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        queuedId: 1,
        id: 0,
        exists: false
      }
    })}
    />
  );
  const overlay = container.querySelector('.gallery-item--overlay');
  expect(overlay).toBeNull();
});

test('GalleryItem should call updateStatusFlags if provided as item function', () => {
  const updateStatusFlags = jest.fn(flags => flags);
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        updateStatusFlags,
        draft: true,
        type: 'file'
      },
      updateStatusFlags: (flags) => flags
    })}
    />
  );
  expect(updateStatusFlags).toHaveBeenCalled();
  const statusFlags = container.querySelector('.gallery-item__status-flags');
  expect(statusFlags).not.toBeNull();
});

test('GalleryItem should call updateProgressBar if provided', () => {
  const updateProgressBar = jest.fn(progressBar => progressBar);
  render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        queuedId: 1,
        id: 0,
        progress: 75
      },
      updateProgressBar
    })}
    />
  );
  expect(updateProgressBar).toHaveBeenCalled();
});

test('GalleryItem should call updateErrorMessage if provided', () => {
  const updateErrorMessage = jest.fn(message => message);
  render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        message: {
          type: 'error',
          value: 'Test error'
        }
      },
      updateErrorMessage
    })}
    />
  );
  expect(updateErrorMessage).toHaveBeenCalled();
});

test('GalleryItem should apply loading class when loadState is LOADING', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image'
      },
      loadState: IMAGE_STATUS.LOADING
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--loading');
});

test('GalleryItem should apply loading class when loadState is WAITING', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        category: 'image'
      },
      loadState: IMAGE_STATUS.WAITING
    })}
    />
  );
  const thumbnail = container.querySelector('.gallery-item__thumbnail');
  expect(thumbnail.classList).toContain('gallery-item__thumbnail--loading');
});

test('GalleryItem should render item id in data-id attribute', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        id: 42
      }
    })}
    />
  );
  const item = container.querySelector('.gallery-item');
  expect(item.getAttribute('data-id')).toBe('42');
});

test('GalleryItem should render title text', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        title: 'My Test File'
      }
    })}
    />
  );
  const title = container.querySelector('.gallery-item__title');
  expect(title.textContent).toContain('My Test File');
});

test('GalleryItem should render checkbox with correct id for saved item', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        id: 99
      }
    })}
    />
  );
  const checkbox = container.querySelector('.gallery-item__checkbox');
  expect(checkbox.id).toBe('item-99');
});

test('GalleryItem should render checkbox with queued id for unsaved item', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        id: 0,
        queuedId: 5
      }
    })}
    />
  );
  const checkbox = container.querySelector('.gallery-item__checkbox');
  expect(checkbox.id).toBe('queued-5');
});

test('GalleryItem should not show action button when not selectable and not uploading', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      selectable: false
    })}
    />
  );
  const label = container.querySelector('.gallery-item__checkbox-label');
  expect(label.getAttribute('onClick')).toBeNull();
});

test('GalleryItem should show cancel icon when uploading without error', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      item: {
        ...makeProps().item,
        queuedId: 1,
        id: 0,
        progress: 50
      }
    })}
    />
  );
  const icon = container.querySelector('.font-icon-cancel');
  expect(icon).not.toBeNull();
});

test('GalleryItem should show tick icon when selectable and can batch select', () => {
  const { container } = render(
    <GalleryItem {...makeProps({
      selectable: true,
      item: {
        ...makeProps().item,
        canEdit: true
      }
    })}
    />
  );
  const icon = container.querySelector('.font-icon-tick');
  expect(icon).not.toBeNull();
});
