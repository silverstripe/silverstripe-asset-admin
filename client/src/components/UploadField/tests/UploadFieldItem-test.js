/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import UploadFieldItem from '../UploadFieldItem';

function makeProps(obj = {}) {
  return {
    name: 'MyFileItem',
    canEdit: true,
    item: {
      category: 'image',
      exists: true,
      uploading: false,
      smallThumbnail: 'images/my-image-thumbnail.jpg',
      url: 'images/my-image.jpg',
      progress: 0,
    },
    ...obj
  };
}

test('UploadFieldItem getThumbnailStyles() should return the thumbnail url', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps()}/>
  );
  const thumbnails = container.querySelectorAll('.uploadfield-item__thumbnail');
  expect(thumbnails.length).toBe(1);
  expect(thumbnails[0].style.backgroundImage).toBe(`url(${makeProps().item.smallThumbnail})`);
});

test('UploadFieldItem getThumbnailStyles() should return the original url when no thumbnail', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        smallThumbnail: null
      }
    })}
    />
  );
  const thumbnails = container.querySelectorAll('.uploadfield-item__thumbnail');
  expect(thumbnails.length).toBe(1);
  expect(thumbnails[0].style.backgroundImage).toBe('');
});

test('UploadFieldItem getThumbnailStyles() should return nothing if it does not exist', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        exists: false
      }
    })}
    />
  );
  const thumbnails = container.querySelectorAll('.uploadfield-item__thumbnail');
  expect(thumbnails.length).toBe(1);
  expect(thumbnails[0].style.backgroundImage).toBe('');
});

test('UploadFieldItem getItemClassNames() should contain file field classes', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps()}/>
  );
  expect(container.querySelector('.uploadfield-item').classList).toContain('uploadfield-item--image');
});

test('UploadFieldItem getItemClassNames() should give a none category class if no category was given', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        category: null
      }
    })}
    />
  );
  expect(container.querySelector('.uploadfield-item').classList).toContain('uploadfield-item--none');
});

test('UploadFieldItem getItemClassNames() should give a missing class when it does not exist and not uploading', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        exists: false,
        queuedId: 23,
        progress: 0,
        id: 1
      }
    })}
    />
  );
  expect(container.querySelector('.uploadfield-item').classList).toContain('uploadfield-item--missing');
});

test('UploadFieldItem getItemClassNames() should give an error class when there is an error message', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        message: {
          type: 'error'
        }
      }
    })}
    />
  );
  expect(container.querySelector('.uploadfield-item').classList).toContain('uploadfield-item--error');
});

test('UploadFieldItem renderProgressBar() displays partial progress correctly', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        queuedId: 123,
        progress: 50
      }
    })}
    />
  );
  const progress = container.querySelector('.uploadfield-item__progress-bar');
  expect(progress).not.toBe(null);
  expect(progress.style.width).toBe('50%');
});

test('UploadFieldItem renderProgressBar() displays complete progress correctly', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        progress: 100,
        id: 10,
        queuedId: 123
      }
    })}
    />
  );
  const progress = container.querySelector('.uploadfield-item__complete-icon');
  expect(progress).not.toBe(null);
});

test('UploadFieldItem renderProgressBar() does not display progress bar for existing files', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        progress: 50,
        id: 10
      }
    })}
    />
  );
  const progress = container.querySelector('.uploadfield-item__progress-bar');
  expect(progress).toBe(null);
});

test('UploadFieldItem renderProgressBar() does not display progress bar for errors', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        progress: 100,
        id: 10,
        message: {
          value: 'Error uploading',
          type: 'error'
        }
      }
    })}
    />
  );
  const progress = container.querySelector('.uploadfield-item__progress-bar');
  expect(progress).toBe(null);
});

test('UploadFieldItem renderErrorMessage() displays error messages', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      item: {
        message: {
          value: 'Error uploading',
          type: 'error'
        }
      }
    })}
    />
  );
  const error = container.querySelector('.uploadfield-item__error-message');
  expect(error).not.toBe(null);
  expect(error.textContent).toBe('Error uploading');
});

test('UploadFieldItem renderErrorMessage() does not display errors for valid files', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps()}/>
  );
  const error = container.querySelector('.uploadfield-item__error-message');
  expect(error).toBe(null);
});

test('UploadFieldItem renderRemoveButton() displays remove button', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      canEdit: true
    })}
    />
  );
  const button = container.querySelector('button.uploadfield-item__remove-btn');
  expect(button).not.toBe(null);
});

test('UploadFieldItem renderRemoveButton() hides remove button when disabled', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      canEdit: false
    })}
    />
  );
  const button = container.querySelector('button.uploadfield-item__remove-btn');
  expect(button).toBe(null);
});

test('UploadFieldItem renderViewButton() displays view button', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      canEdit: true,
      item: {
        id: 25
      }
    })}
    />
  );
  const button = container.querySelector('button.uploadfield-item__view-btn');
  expect(button).not.toBe(null);
});

test('UploadFieldItem renderViewButton() hides view button when disabled', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({
      canEdit: false
    })}
    />
  );
  const button = container.querySelector('button.uploadfield-item__view-btn');
  expect(button).toBe(null);
});

test('UploadFieldItem handleRemove() calls onRemove with the event and item', () => {
  const onRemove = jest.fn();
  const props = makeProps({ onRemove });
  const { container } = render(<UploadFieldItem {...props}/>);
  container.querySelector('button.uploadfield-item__remove-btn').click();
  expect(onRemove).toHaveBeenCalledTimes(1);
  expect(onRemove.mock.calls[0][1]).toBe(props.item);
});

test('UploadFieldItem handleRemove() does not throw without onRemove', () => {
  const { container } = render(<UploadFieldItem {...makeProps()}/>);
  container.querySelector('button.uploadfield-item__remove-btn').click();
  expect(container.querySelector('.uploadfield-item')).not.toBe(null);
});

test('UploadFieldItem handleView() calls onView with the event and item', () => {
  const onView = jest.fn();
  const props = makeProps({ onView });
  props.item.id = 25;
  const { container } = render(<UploadFieldItem {...props}/>);
  container.querySelector('button.uploadfield-item__view-btn').click();
  expect(onView).toHaveBeenCalledTimes(1);
  expect(onView.mock.calls[0][1]).toBe(props.item);
});

test('UploadFieldItem handleItemClick() calls onItemClick with the event and item', () => {
  const onItemClick = jest.fn();
  const props = makeProps({ onItemClick });
  const { container } = render(<UploadFieldItem {...props}/>);
  const thumbnail = container.querySelector('.uploadfield-item__thumbnail');
  expect(thumbnail.getAttribute('tabindex')).toBe('0');
  thumbnail.click();
  expect(onItemClick).toHaveBeenCalledTimes(1);
  expect(onItemClick.mock.calls[0][1]).toBe(props.item);
});

test('UploadFieldItem renderThumbnail() is not focusable without onItemClick', () => {
  const { container } = render(<UploadFieldItem {...makeProps()}/>);
  expect(container.querySelector('.uploadfield-item__thumbnail').getAttribute('tabindex')).toBe('-1');
});

test('UploadFieldItem renderErrorMessage() displays a message for missing files', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({ item: { exists: false, id: 3 } })}/>
  );
  expect(container.querySelector('.uploadfield-item__error-message').textContent).toBe('File cannot be found');
});

test('UploadFieldItem renderStatus() displays draft status', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({ item: { exists: true, draft: true } })}/>
  );
  expect(container.querySelector('.uploadfield-item__status').textContent).toBe('Draft');
});

test('UploadFieldItem renderStatus() displays modified status', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({ item: { exists: true, modified: true } })}/>
  );
  expect(container.querySelector('.uploadfield-item__status').textContent).toBe('Modified');
});

test('UploadFieldItem renderStatus() displays nothing for published files', () => {
  const { container } = render(<UploadFieldItem {...makeProps()}/>);
  expect(container.querySelector('.uploadfield-item__status')).toBe(null);
});

test('UploadFieldItem renderFileDetails() displays title, extension and size', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({ item: { exists: true, title: 'My file', extension: 'jpg', size: 2048 } })}/>
  );
  expect(container.querySelector('.uploadfield-item__title').textContent.trim()).toBe('My file');
  expect(container.querySelector('.uploadfield-item__specs').textContent).toContain('jpg, ');
});

test('UploadFieldItem render() outputs the hidden input with the item id', () => {
  const { container } = render(
    <UploadFieldItem {...makeProps({ item: { exists: true, id: 42 } })}/>
  );
  const input = container.querySelector('input[type="hidden"]');
  expect(input.getAttribute('name')).toBe('MyFileItem[Files][]');
  expect(input.getAttribute('value')).toBe('42');
});
