/* global jest, jasmine, describe, it, expect, beforeEach */

jest.unmock('../FileFieldItem.js');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import FileFieldItem from '../FileFieldItem.js';

describe('FileFieldItem', () => {
  let props = {};
  let file = null;

  beforeEach(() => {
    props = {
      name: 'MyFileItem',
      item: {
        category: 'image',
        exists: true,
        uploading: false,
        smallThumbnail: 'images/my-image-thumbnail.jpg',
        url: 'images/my-image.jpg',
        progress: 0,
      },
    };
  });

  describe('getThumbnailStyles()', () => {
    it('should return the thumbnail url', () => {
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const styles = file.getThumbnailStyles();

      expect(styles.backgroundImage).toBe(`url(${props.item.smallThumbnail})`);
    });

    it('should return the original url when no thumbnail', () => {
      props.item.smallThumbnail = null;
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const styles = file.getThumbnailStyles();

      expect(styles.backgroundImage).toBe(`url(${props.item.url})`);
    });

    it('should return nothing if it does not exist', () => {
      props.item.exists = false;
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const styles = file.getThumbnailStyles();

      expect(Object.keys(styles).length).toBe(0);
    });
  });

  describe('getItemClassNames()', () => {
    it('should contain file field classes', () => {
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('file-field-item--image');
    });

    it('should give a none category class if no category was given', () => {
      props.item.category = null;
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('file-field-item--none');
    });

    it('should give a missing class when it does not exist and not uploading', () => {
      props.item.exists = false;
      props.item.uploading = false;
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('file-field-item--missing');
    });

    it('should give an error class when there is an error message', () => {
      props.item.message = { type: 'error' };
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('file-field-item--error');
    });
  });

  describe('getProgressBar()', () => {
    it('displays partial progress correctly', () => {
      props.item.progress = 50;
      props.item.uploaded = true;
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const progress = file.getProgressBar();
      expect(progress.type).toBe('div');
      expect(progress.props.className).toBe('file-field-item__upload-progress');
      expect(progress.props.children.props.style.width).toBe('50%');
    });

    it('displays complete progress correctly', () => {
      props.item.progress = 100;
      props.item.id = 10;
      props.item.uploaded = true;
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const progress = file.getProgressBar();
      expect(progress.type).toBe('div');
      expect(progress.props.className).toBe('file-field-item__complete-icon');
    });

    it('does not display progress bar for existing files', () => {
      props.item.progress = 50; // Ignored if uploaded isn't set
      props.item.id = 10;
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const progress = file.getProgressBar();
      expect(progress).toBe(null);
    });


    it('does not display progress bar for errors', () => {
      props.item.progress = 100;
      props.item.id = 10;
      props.item.uploaded = true;
      props.item.message = {
        value: 'Error uploading',
        type: 'error',
      };
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const progress = file.getProgressBar();
      expect(progress).toBe(null);
    });
  });

  describe('getErrorMessage()', () => {
    it('displays error messages', () => {
      props.item.message = {
        value: 'Error uploading',
        type: 'error',
      };
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const error = file.getErrorMessage();
      expect(error.type).toBe('div');
      expect(error.props.className).toBe('file-field-item__error-message');
      expect(error.props.children).toBe('Error uploading');
    });

    it('does not display errors for valid files', () => {
      file = ReactTestUtils.renderIntoDocument(
        <FileFieldItem {...props} />
      );
      const error = file.getErrorMessage();
      expect(error).toBe(null);
    });
  });
});
