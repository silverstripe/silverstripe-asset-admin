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
