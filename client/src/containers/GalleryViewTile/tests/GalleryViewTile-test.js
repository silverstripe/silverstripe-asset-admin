/* global jest, describe, it, expect, beforeEach */

jest.unmock('react');
jest.unmock('../GalleryViewTile');
// mock GriddlePagination because it gives mutation warnings all over the place!
jest.mock('griddle-react', () => null);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import GalleryViewTile from '../GalleryViewTile';

describe('GalleryViewTile', () => {

});
