/* global jest, jasmine, describe, it, expect, beforeEach */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import UploadFieldItem from '../UploadFieldItem';

describe('UploadFieldItem', () => {
  let props = {};
  let file = null;

  beforeEach(() => {
    props = {
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
    };
  });

  describe('getThumbnailStyles()', () => {
    it('should return the thumbnail url', () => {
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const styles = file.getThumbnailStyles();

      expect(styles.backgroundImage).toBe(`url(${props.item.smallThumbnail})`);
    });

    it('should return the original url when no thumbnail', () => {
      props.item.smallThumbnail = null;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const styles = file.getThumbnailStyles();

      expect(styles.backgroundImage).toBe(`url(${props.item.url})`);
    });

    it('should return nothing if it does not exist', () => {
      props.item.exists = false;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const styles = file.getThumbnailStyles();

      expect(Object.keys(styles).length).toBe(0);
    });
  });

  describe('getItemClassNames()', () => {
    it('should contain file field classes', () => {
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('uploadfield-item--image');
    });

    it('should give a none category class if no category was given', () => {
      props.item.category = null;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('uploadfield-item--none');
    });

    it('should give a missing class when it does not exist and not uploading', () => {
      props.item.exists = false;
      props.item.uploading = false;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('uploadfield-item--missing');
    });

    it('should give an error class when there is an error message', () => {
      props.item.message = { type: 'error' };
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const classNames = file.getItemClassNames().split(' ');

      expect(classNames).toContain('uploadfield-item--error');
    });
  });

  describe('renderProgressBar()', () => {
    it('displays partial progress correctly', () => {
      props.item.progress = 50;
      props.item.uploaded = true;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const progress = file.renderProgressBar();
      expect(progress.type).toBe('div');
      expect(progress.props.className).toBe('uploadfield-item__upload-progress');
      expect(progress.props.children.props.style.width).toBe('50%');
    });

    it('displays complete progress correctly', () => {
      props.item.progress = 100;
      props.item.id = 10;
      props.item.uploaded = true;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const progress = file.renderProgressBar();
      expect(progress.type).toBe('div');
      expect(progress.props.className).toBe('uploadfield-item__complete-icon');
    });

    it('does not display progress bar for existing files', () => {
      props.item.progress = 50; // Ignored if uploaded isn't set
      props.item.id = 10;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const progress = file.renderProgressBar();
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
        <UploadFieldItem {...props} />
      );
      const progress = file.renderProgressBar();
      expect(progress).toBe(null);
    });
  });

  describe('renderErrorMessage()', () => {
    it('displays error messages', () => {
      props.item.message = {
        value: 'Error uploading',
        type: 'error',
      };
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const error = file.renderErrorMessage();
      expect(error.type).toBe('div');
      expect(error.props.className).toBe('uploadfield-item__error-message');
      expect(error.props.children).toBe('Error uploading');
    });

    it('does not display errors for valid files', () => {
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const error = file.renderErrorMessage();
      expect(error).toBe(null);
    });
  });

  describe('renderRemoveButton()', () => {
    it('displays remove button', () => {
      props.canEdit = true;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const button = file.renderRemoveButton();
      expect(button.type).toBe('button');
    });
    it('hides remove button when disabled', () => {
      props.canEdit = false;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const button = file.renderRemoveButton();
      expect(button).toBe(null);
    });
  });

  describe('renderViewButton()', () => {
    it('displays view button', () => {
      props.canEdit = true;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const button = file.renderViewButton();
      expect(button.type).toBe('button');
    });
    it('hides view button when disabled', () => {
      props.canEdit = false;
      file = ReactTestUtils.renderIntoDocument(
        <UploadFieldItem {...props} />
      );
      const button = file.renderViewButton();
      expect(button).toBe(null);
    });
  });
});
