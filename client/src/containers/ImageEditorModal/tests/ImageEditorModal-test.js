/* global jest, test, expect, beforeEach, afterEach */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Component as ImageEditorModal } from '../ImageEditorModal';

// jsdom has no canvas 2d and getContext logs a noisy notice; null takes composePreview's fallback.
HTMLCanvasElement.prototype.getContext = () => null;

// Mock react-image-crop: buttons that fire onChange with known crops, plus the aspect helpers.
jest.mock('react-image-crop', () => ({
  __esModule: true,
  default: ({ children, onChange, crop, aspect, disabled }) => (
    <div
      data-testid="react-crop"
      data-aspect={aspect === undefined ? '' : String(aspect)}
      data-disabled={String(!!disabled)}
      data-crop={JSON.stringify(crop)}
    >
      {children}
      <button
        type="button"
        data-testid="crop-change"
        onClick={() => onChange({ unit: 'px' }, { unit: '%', x: 10, y: 20, width: 30, height: 40 })}
      >
        change crop
      </button>
      <button
        type="button"
        data-testid="crop-zero"
        onClick={() => onChange({ unit: 'px' }, { unit: '%', x: 0, y: 0, width: 0, height: 0 })}
      >
        zero crop
      </button>
      <button
        type="button"
        data-testid="crop-flush"
        onClick={() => onChange(
          { unit: 'px' },
          // Right edge flush against the frame, floated past 100 the way ReactCrop's percent can.
          { unit: '%', x: 33.333338, y: 0, width: 66.666666, height: 50 }
        )}
      >
        flush crop
      </button>
    </div>
  ),
  clamp: (num, min, max) => Math.min(Math.max(num, min), max),
}));

let resolveBackendPost;
let rejectBackendPost;
let lastBackendPostEndpoint;
let lastBackendPostData;
let lastBackendPostHeaders;

jest.mock('lib/Backend', () => ({
  post: (endpoint, data, headers) => new Promise((resolve, reject) => {
    resolveBackendPost = resolve;
    rejectBackendPost = reject;
    lastBackendPostEndpoint = endpoint;
    lastBackendPostData = data;
    lastBackendPostHeaders = headers;
  }),
}));

let mockConfigSection;

jest.mock('lib/Config', () => ({
  getSection: () => mockConfigSection,
  get: (key) => (key === 'SecurityID' ? 'test-security-id' : undefined),
}));

jest.mock('i18n', () => ({
  sprintf: (template, ...args) => template.replace(/%s/g, () => args.shift()),
  _t: (key, defaultValue) => defaultValue || key,
}));

beforeEach(() => {
  // No backupOriginalByDefault key: the install has not configured one.
  mockConfigSection = {
    endpoints: {
      editImage: { url: '/admin/assets/api/editImage' },
    },
  };
  resolveBackendPost = undefined;
  rejectBackendPost = undefined;
  lastBackendPostEndpoint = undefined;
  lastBackendPostData = undefined;
  lastBackendPostHeaders = undefined;
});

function makeProps(obj = {}) {
  return {
    fileId: 123,
    file: { name: 'photo.jpg', url: '/assets/photo.jpg', extension: 'jpg' },
    isOpen: true,
    onClosed: jest.fn(),
    onImageEdited: jest.fn(),
    setSuccess: jest.fn(),
    ...obj,
  };
}

function getButton(name) {
  return screen.getByRole('button', { name });
}

// Apply is gated on there being something to apply, and a full-frame crop box is not - a rotate is
// the smallest edit that arms it, and the one least entangled with the crop and resize state.
function armApply() {
  fireEvent.click(getButton('Rotate'));
}

// The readouts and resize fields stay empty and disabled until the source reports its dimensions.
function loadSource(width, height) {
  const source = document.querySelector('.image-editor-modal__source');
  Object.defineProperty(source, 'naturalWidth', { value: width, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: height, configurable: true });
  fireEvent.load(source);
  return source;
}

test('ImageEditorModal renders the transform toolbar as a single labelled toolbar', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const toolbar = screen.getByRole('toolbar', { name: 'Image transform tools' });
  expect(toolbar).not.toBeNull();
});

test('ImageEditorModal Apply posts a full-frame crop payload when no box is drawn', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  // A flip-only edit: nothing has been cropped, so the payload's crop is the whole working image.
  fireEvent.click(getButton('Flip horizontal'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostEndpoint).toBe('/admin/assets/api/editImage');
  expect(lastBackendPostData).toEqual({
    fileId: 123,
    flip: { horizontal: true, vertical: false },
    rotate: 0,
    crop: { x: 0, y: 0, width: 1, height: 1 },
    backupOriginal: true,
  });
  expect(lastBackendPostHeaders).toEqual({ 'X-SecurityID': 'test-security-id' });
});

test('ImageEditorModal pointer-activating Crop enables the surface with no selection to drag out', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const cropEl = screen.getByTestId('react-crop');
  // The mock renders no data-crop attribute while the crop prop is undefined.
  expect(cropEl.getAttribute('data-crop')).toBeNull();
  expect(cropEl.getAttribute('data-disabled')).toBe('true');
  // A mouse click (detail 1) enables the crosshair but seeds no box - the author drags one out.
  fireEvent.click(getButton('Crop'), { detail: 1 });
  expect(cropEl.getAttribute('data-disabled')).toBe('false');
  expect(cropEl.getAttribute('data-crop')).toBeNull();
});

test('ImageEditorModal keyboard-activating Crop seeds an adjustable selection', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const cropEl = screen.getByTestId('react-crop');
  expect(cropEl.getAttribute('data-crop')).toBeNull();
  // Enter/Space fires a click with detail 0 (no pointer); keyboard users can't drag, so seed a box.
  fireEvent.click(getButton('Crop'), { detail: 0 });
  expect(cropEl.getAttribute('data-disabled')).toBe('false');
  expect(cropEl.getAttribute('data-crop')).not.toBeNull();
});

test('ImageEditorModal blocks the native drag on the preview image', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const image = document.querySelector('.image-editor-modal__image');
  // Without this, dragging before arming Crop drags the picture itself, as though it were moving.
  expect(fireEvent.dragStart(image)).toBe(false);
});

test('ImageEditorModal Crop tool toggles pressed state and clears the selection when turned off', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const cropEl = screen.getByTestId('react-crop');
  expect(getButton('Crop').getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(getButton('Crop'), { detail: 1 });
  expect(getButton('Crop').getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(getButton('Crop'), { detail: 1 });
  expect(getButton('Crop').getAttribute('aria-pressed')).toBe('false');
  expect(cropEl.getAttribute('data-crop')).toBeNull();
});

test('ImageEditorModal Crop button carries the active class only while the tool is on', () => {
  render(<ImageEditorModal {...makeProps()} />);
  // The active class drives the persistent "activated" background, whether or not a box was drawn.
  expect(getButton('Crop').classList.contains('active')).toBe(false);
  fireEvent.click(getButton('Crop'), { detail: 1 });
  expect(getButton('Crop').classList.contains('active')).toBe(true);
  fireEvent.click(getButton('Crop'), { detail: 1 });
  expect(getButton('Crop').classList.contains('active')).toBe(false);
});

test('ImageEditorModal choosing a preset ratio while the Crop tool is off turns it on and seeds the box', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  Object.defineProperty(source, 'naturalWidth', { value: 4000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  const select = screen.getByLabelText('Aspect ratio');
  const cropEl = screen.getByTestId('react-crop');
  // The dropdown is enabled from the start - the ratio can be picked before turning Crop on.
  expect(select.disabled).toBe(false);
  expect(getButton('Crop').classList.contains('active')).toBe(false);
  fireEvent.change(select, { target: { value: '1:1' } });
  // The tool comes on and the named shape is seeded: a centred square, half the 2:1 frame's width.
  expect(getButton('Crop').classList.contains('active')).toBe(true);
  expect(cropEl.getAttribute('data-aspect')).toBe('1');
  expect(cropEl.getAttribute('data-disabled')).toBe('false');
  expect(JSON.parse(cropEl.getAttribute('data-crop'))).toEqual({
    unit: '%', x: 25, y: 0, width: 50, height: 100,
  });
  expect(screen.getByText('Crop tool on')).not.toBeNull();
});

test('ImageEditorModal choosing Freeform while the Crop tool is off turns it on but seeds no box', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  Object.defineProperty(source, 'naturalWidth', { value: 4000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  const select = screen.getByLabelText('Aspect ratio');
  const cropEl = screen.getByTestId('react-crop');
  fireEvent.change(select, { target: { value: '1:1' } });
  fireEvent.click(getButton('Crop'), { detail: 1 });
  expect(getButton('Crop').classList.contains('active')).toBe(false);
  // Freeform names no shape, so it arms the crosshair and leaves the canvas clear to drag out of.
  fireEvent.change(select, { target: { value: 'free' } });
  expect(getButton('Crop').classList.contains('active')).toBe(true);
  expect(cropEl.getAttribute('data-aspect')).toBe('');
  expect(cropEl.getAttribute('data-disabled')).toBe('false');
  expect(cropEl.getAttribute('data-crop')).toBeNull();
});

test('ImageEditorModal Apply sends the drawn crop as ratios', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(screen.getByTestId('crop-change'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.crop).toEqual({ x: 0.1, y: 0.2, width: 0.3, height: 0.4 });
});

test('ImageEditorModal rotate sets rotate to 90 in the payload', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.rotate).toBe(90);
});

test('ImageEditorModal three rotations wrap to 270', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.rotate).toBe(270);
});

test('ImageEditorModal flip horizontal toggles the horizontal flag at 0 degrees', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Flip horizontal'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.flip).toEqual({ horizontal: true, vertical: false });
});

test('ImageEditorModal announces the resulting flip state, distinct for on and off', () => {
  render(<ImageEditorModal {...makeProps()} />);
  // Distinct messages, so the live region re-announces rather than misreporting an un-flip as a flip.
  fireEvent.click(getButton('Flip horizontal'));
  expect(screen.getByText('Flipped horizontally')).not.toBeNull();
  fireEvent.click(getButton('Flip horizontal'));
  expect(screen.getByText('Horizontal flip removed')).not.toBeNull();
});

test('ImageEditorModal flip axis remaps to vertical flag when rotated 90 degrees', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Flip horizontal'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // At 90 degrees a visible horizontal flip is recorded against the vertical payload flag.
  expect(lastBackendPostData.flip).toEqual({ horizontal: false, vertical: true });
});

test('ImageEditorModal flip vertical remaps to horizontal flag when rotated 270 degrees', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Rotate')); // 90
  fireEvent.click(getButton('Rotate')); // 180
  fireEvent.click(getButton('Rotate')); // 270
  fireEvent.click(getButton('Flip vertical'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.flip).toEqual({ horizontal: true, vertical: false });
});

test('ImageEditorModal flip button exposes aria-pressed reflecting what the user sees', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const flipH = getButton('Flip horizontal');
  expect(flipH.getAttribute('aria-pressed')).toBe('false');
  fireEvent.click(flipH);
  expect(getButton('Flip horizontal').getAttribute('aria-pressed')).toBe('true');
});

test('ImageEditorModal mirrors the crop selection when flipping horizontally', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Crop'));
  // The mock reports a box at { x: 10, y: 20, width: 30, height: 40 } (percent).
  fireEvent.click(screen.getByTestId('crop-change'));
  fireEvent.click(getButton('Flip horizontal'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // Mirror x within the frame (100 - 10 - 30 = 60), so the box keeps framing the same subject.
  expect(lastBackendPostData.crop).toEqual({ x: 0.6, y: 0.2, width: 0.3, height: 0.4 });
});

test('ImageEditorModal mirrors the crop selection when flipping vertically', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Crop'));
  fireEvent.click(screen.getByTestId('crop-change'));
  fireEvent.click(getButton('Flip vertical'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // Mirror y within the frame (100 - 20 - 40 = 40); x and size unchanged.
  expect(lastBackendPostData.crop).toEqual({ x: 0.1, y: 0.4, width: 0.3, height: 0.4 });
});

test('ImageEditorModal rotates the crop selection with the image when rotating', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Crop'));
  fireEvent.click(screen.getByTestId('crop-change'));
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.rotate).toBe(90);
  // Clockwise: x = 100 - y - h = 40, y = x = 10, width = h = 40, height = w = 30.
  expect(lastBackendPostData.crop).toEqual({ x: 0.4, y: 0.1, width: 0.4, height: 0.3 });
});

test('ImageEditorModal releases a locked non-square ratio to Freeform on a quarter-turn but keeps the box', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  const select = screen.getByLabelText('Aspect ratio');
  fireEvent.click(getButton('Crop'));
  fireEvent.change(select, { target: { value: '4:3' } });
  // Pin a deterministic box regardless of the ratio-reshape maths.
  fireEvent.click(screen.getByTestId('crop-change'));
  expect(select.value).toBe('4:3');
  fireEvent.click(getButton('Rotate'));
  // The rotated 4:3 box is 3:4 - not a preset - so the lock releases to Freeform.
  expect(screen.getByLabelText('Aspect ratio').value).toBe('free');
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.rotate).toBe(90);
  // The box is preserved (rotated with the image), not discarded when the lock is released.
  expect(lastBackendPostData.crop).toEqual({ x: 0.4, y: 0.1, width: 0.4, height: 0.3 });
});

test('ImageEditorModal keeps a 1:1 lock through a quarter-turn', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const select = screen.getByLabelText('Aspect ratio');
  fireEvent.click(getButton('Crop'));
  fireEvent.change(select, { target: { value: '1:1' } });
  fireEvent.click(getButton('Rotate'));
  // A square stays a square after a quarter-turn, so the lock is not released.
  expect(screen.getByLabelText('Aspect ratio').value).toBe('1:1');
});

test('ImageEditorModal picking a ratio while armed with no box only sets the constraint', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  Object.defineProperty(source, 'naturalWidth', { value: 4000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  const cropEl = screen.getByTestId('react-crop');
  // Pointer-activate: armed, crosshair, no box.
  fireEvent.click(getButton('Crop'), { detail: 1 });
  expect(cropEl.getAttribute('data-crop')).toBeNull();
  fireEvent.change(screen.getByLabelText('Aspect ratio'), { target: { value: '1:1' } });
  // The ratio constrains the next drag, but does not conjure a box - the author drags their own.
  expect(cropEl.getAttribute('data-aspect')).toBe('1');
  expect(cropEl.getAttribute('data-crop')).toBeNull();
});

test('ImageEditorModal reshapes an existing box to a new ratio in place, not to full-frame', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  Object.defineProperty(source, 'naturalWidth', { value: 4000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  // Pointer-activate and draw a small Freeform box at { x: 10, y: 20, width: 30, height: 40 }.
  fireEvent.click(getButton('Crop'), { detail: 1 });
  fireEvent.click(screen.getByTestId('crop-change'));
  // Picking 4:3 keeps the box on its own centre (25, 40) rather than blowing it out to the canvas.
  fireEvent.change(screen.getByLabelText('Aspect ratio'), { target: { value: '4:3' } });
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // Width kept (30%), height derived for 4:3 in pixels (1200x900px = 45%), re-centred on (25, 40).
  expect(lastBackendPostData.crop).toEqual({ x: 0.1, y: 0.175, width: 0.3, height: 0.45 });
});

test('ImageEditorModal keeps the box height when the reshaped width would overflow the frame', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  // Ultra-wide 4:1 frame: a 1:1 box keeping the 30% width would need 120% height, so it cannot.
  Object.defineProperty(source, 'naturalWidth', { value: 8000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  fireEvent.click(getButton('Crop'), { detail: 1 });
  fireEvent.click(screen.getByTestId('crop-change')); // box { x: 10, y: 20, width: 30, height: 40 }
  fireEvent.change(screen.getByLabelText('Aspect ratio'), { target: { value: '1:1' } });
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // Height kept (40%), width derived square (800px -> 10% of 8000px), re-centred on (25, 40).
  expect(lastBackendPostData.crop).toEqual({ x: 0.2, y: 0.2, width: 0.1, height: 0.4 });
});

test('ImageEditorModal picking Freeform keeps the existing box, dropping only the constraint', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  Object.defineProperty(source, 'naturalWidth', { value: 4000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  const cropEl = screen.getByTestId('react-crop');
  fireEvent.click(getButton('Crop'), { detail: 1 });
  fireEvent.click(screen.getByTestId('crop-change'));
  // Locking 4:3 reshapes the box; releasing to Freeform must drop only the constraint.
  fireEvent.change(screen.getByLabelText('Aspect ratio'), { target: { value: '4:3' } });
  const reshaped = cropEl.getAttribute('data-crop');
  fireEvent.change(screen.getByLabelText('Aspect ratio'), { target: { value: 'free' } });
  expect(cropEl.getAttribute('data-aspect')).toBe('');
  expect(cropEl.getAttribute('data-crop')).toBe(reshaped);
});

test('ImageEditorModal re-fits a pre-load seeded box to the selected ratio once dimensions arrive', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  // With the frame still 0x0, seedCropFor cannot compute the ratio's box and seeds full-frame.
  fireEvent.click(getButton('Crop'), { detail: 0 });
  fireEvent.change(screen.getByLabelText('Aspect ratio'), { target: { value: '3:2' } });
  const cropEl = screen.getByTestId('react-crop');
  expect(JSON.parse(cropEl.getAttribute('data-crop'))).toEqual({ unit: '%', x: 0, y: 0, width: 100, height: 100 });
  // The real dimensions arrive (landscape 2:1), so the full-frame seed must re-fit to 3:2 in place.
  Object.defineProperty(source, 'naturalWidth', { value: 4000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // 3:2 keeping the 100% width needs 150% height, so the height is kept and the width derived (75%).
  expect(lastBackendPostData.crop).toEqual({ x: 0.125, y: 0, width: 0.75, height: 1 });
});

test('ImageEditorModal clamps a mirrored edge-flush crop so no negative coordinate reaches the server', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Crop'));
  // The flush far edge floats past 100, so an unclamped mirror is a tiny negative the server rejects.
  fireEvent.click(screen.getByTestId('crop-flush'));
  fireEvent.click(getButton('Flip horizontal'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // Mirrored x clamps to 0 rather than the raw -0.000004%; y and size are unchanged.
  expect(lastBackendPostData.crop.x).toBe(0);
});

// Regression: a fixed aspect computed against an unrotated frame describes the wrong shape.
test('ImageEditorModal maps a rotate 90 + 1:1 crop to a square in the working frame', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  // Landscape source; a 90 degree rotate swaps it to a 2000x4000 portrait working frame.
  Object.defineProperty(source, 'naturalWidth', { value: 4000, configurable: true });
  Object.defineProperty(source, 'naturalHeight', { value: 2000, configurable: true });
  fireEvent.load(source);
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Crop'));
  fireEvent.change(screen.getByLabelText('Aspect ratio'), { target: { value: '1:1' } });
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.rotate).toBe(90);
  const workingWidth = 2000;
  const workingHeight = 4000;
  const { crop } = lastBackendPostData;
  expect(crop.width).toBeGreaterThan(0);
  expect(crop.height).toBeGreaterThan(0);
  // A 1:1 crop is a square in working pixels even though the ratios differ (100% wide, 50% tall).
  expect(crop.width * workingWidth).toBeCloseTo(crop.height * workingHeight, 5);
});

test('ImageEditorModal disables Apply when the crop has zero area', () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(screen.getByTestId('crop-change'));
  expect(getButton('Apply').disabled).toBe(false);
  fireEvent.click(screen.getByTestId('crop-zero'));
  expect(getButton('Apply').disabled).toBe(true);
});

test('ImageEditorModal disables Apply until an edit has been made', () => {
  render(<ImageEditorModal {...makeProps()} />);
  // A no-op Apply would still re-encode the image and write a backup copy of it.
  expect(getButton('Apply').disabled).toBe(true);
  fireEvent.click(getButton('Rotate'));
  expect(getButton('Apply').disabled).toBe(false);
  fireEvent.click(getButton('Reset'));
  expect(getButton('Apply').disabled).toBe(true);
});

test('ImageEditorModal a crop box framing the whole image does not arm Apply', () => {
  render(<ImageEditorModal {...makeProps()} />);
  // Keyboard activation seeds a full-frame box: a crop that trims nothing is not an edit to send.
  fireEvent.click(getButton('Crop'), { detail: 0 });
  expect(getButton('Apply').disabled).toBe(true);
  // Reset is gated separately - there is a box and a tool state to clear.
  expect(getButton('Reset').disabled).toBe(false);
  // Pulling the box in to 30% x 40% trims the frame, so now there is something to render.
  fireEvent.click(screen.getByTestId('crop-change'));
  expect(getButton('Apply').disabled).toBe(false);
});

test('ImageEditorModal a full-frame crop still arms Apply alongside another transform', () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Crop'), { detail: 0 });
  fireEvent.click(getButton('Rotate'));
  // The rotate is the edit; the full-frame box just rides along as the payload's crop.
  expect(getButton('Apply').disabled).toBe(false);
});

test('ImageEditorModal backup checkbox alone does not arm Apply', () => {
  render(<ImageEditorModal {...makeProps()} />);
  // The backup choice is a separate concern: on its own there is still no edit to apply.
  fireEvent.click(screen.getByRole('checkbox', { name: 'Back up the original image' }));
  expect(getButton('Apply').disabled).toBe(true);
});

test('ImageEditorModal disables Reset until a transform is applied', () => {
  render(<ImageEditorModal {...makeProps()} />);
  expect(getButton('Reset').disabled).toBe(true);
  fireEvent.click(getButton('Rotate'));
  expect(getButton('Reset').disabled).toBe(false);
});

test('ImageEditorModal Reset returns to a clean slate without a request', () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(getButton('Rotate'));
  fireEvent.click(getButton('Flip horizontal'));
  fireEvent.click(getButton('Reset'));
  expect(getButton('Reset').disabled).toBe(true);
  expect(getButton('Flip horizontal').getAttribute('aria-pressed')).toBe('false');
  expect(lastBackendPostData).toBeUndefined();
});

test('ImageEditorModal blocks all controls while an Apply is in flight', () => {
  render(<ImageEditorModal {...makeProps()} />);
  armApply();
  fireEvent.click(getButton('Apply'));
  expect(getButton('Apply').disabled).toBe(true);
  expect(getButton('Cancel').disabled).toBe(true);
  expect(getButton('Rotate').disabled).toBe(true);
  expect(getButton('Flip horizontal').disabled).toBe(true);
});

test('ImageEditorModal Cancel closes without a request', () => {
  const onClosed = jest.fn();
  render(<ImageEditorModal {...makeProps({ onClosed })} />);
  fireEvent.click(getButton('Cancel'));
  expect(onClosed).toHaveBeenCalled();
  expect(lastBackendPostData).toBeUndefined();
});

test('ImageEditorModal shows a success toast naming the backup and closes on success', async () => {
  const onClosed = jest.fn();
  const setSuccess = jest.fn();
  render(<ImageEditorModal {...makeProps({ onClosed, setSuccess })} />);
  armApply();
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(resolveBackendPost).toBeDefined());
  resolveBackendPost({ json: () => Promise.resolve({ id: 123, name: 'photo.jpg', backupFilename: 'photo-v2.jpg' }) });
  await waitFor(() => expect(setSuccess).toHaveBeenCalled());
  // The backup's name is generated server-side, so this is the only place the author learns it.
  expect(setSuccess).toHaveBeenCalledWith('Image updated. Original backed up as "photo-v2.jpg".');
  expect(onClosed).toHaveBeenCalled();
});

test('ImageEditorModal success message does not imply a backup when none was written', async () => {
  const setSuccess = jest.fn();
  render(<ImageEditorModal {...makeProps({ setSuccess })} />);
  armApply();
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(resolveBackendPost).toBeDefined());
  resolveBackendPost({ json: () => Promise.resolve({ id: 123, name: 'photo.jpg', backupFilename: null }) });
  await waitFor(() => expect(setSuccess).toHaveBeenCalled());
  expect(setSuccess).toHaveBeenCalledWith('Image updated.');
});

test('ImageEditorModal asks the shell to refresh the current record without naming another file', async () => {
  const onImageEdited = jest.fn();
  render(<ImageEditorModal {...makeProps({ onImageEdited })} />);
  armApply();
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(resolveBackendPost).toBeDefined());
  resolveBackendPost({ json: () => Promise.resolve({ id: 123, name: 'photo.jpg', backupFilename: 'photo-v2.jpg' }) });
  await waitFor(() => expect(onImageEdited).toHaveBeenCalled());
  // There is no new file to navigate to - the edited pixels are on the record already open.
  expect(onImageEdited).toHaveBeenCalledWith();
});

test('ImageEditorModal backup checkbox starts ticked when the install configures no default', () => {
  render(<ImageEditorModal {...makeProps()} />);
  expect(screen.getByRole('checkbox', { name: 'Back up the original image' }).checked).toBe(true);
});

test('ImageEditorModal backup checkbox starts unticked when the install configures false', () => {
  mockConfigSection.backupOriginalByDefault = false;
  render(<ImageEditorModal {...makeProps()} />);
  // A configured false must survive the JSON hop as false, not be read as "not set".
  expect(screen.getByRole('checkbox', { name: 'Back up the original image' }).checked).toBe(false);
});

test('ImageEditorModal sends the backup choice in the payload', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  fireEvent.click(screen.getByRole('checkbox', { name: 'Back up the original image' }));
  armApply();
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.backupOriginal).toBe(false);
});

test('ImageEditorModal shows an inline error and stays open on failure', async () => {
  const onClosed = jest.fn();
  render(<ImageEditorModal {...makeProps({ onClosed })} />);
  armApply();
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(rejectBackendPost).toBeDefined());
  rejectBackendPost(new Error('Render failed'));
  await waitFor(() => expect(screen.getAllByText('Render failed').length).toBeGreaterThan(0));
  const errorAlert = document.querySelector('.image-editor-modal__error');
  expect(errorAlert).not.toBeNull();
  expect(errorAlert.textContent).toContain('Render failed');
  expect(onClosed).not.toHaveBeenCalled();
  expect(getButton('Apply').disabled).toBe(false);
});

test('ImageEditorModal surfaces the server error message from the response body', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  armApply();
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(rejectBackendPost).toBeDefined());
  // lib/Backend throws an Error whose message is only the HTTP status text, with the failed
  // Response attached as `.response`; the endpoint's JSON body carries the real message as `value`.
  const err = new Error('Internal Server Error');
  err.response = { json: () => Promise.resolve({ value: 'That image is too large to edit' }) };
  rejectBackendPost(err);
  await waitFor(() => expect(screen.getAllByText('That image is too large to edit').length).toBeGreaterThan(0));
  const errorAlert = document.querySelector('.image-editor-modal__error');
  expect(errorAlert.textContent).toContain('That image is too large to edit');
  // The generic HTTP status text is not surfaced when a server message is present.
  expect(errorAlert.textContent).not.toContain('Internal Server Error');
});

test('ImageEditorModal busts the browser cache with the file version on the preview URL', () => {
  const file = { name: 'photo.jpg', url: '/assets/photo.jpg', extension: 'jpg', version: 7 };
  render(<ImageEditorModal {...makeProps({ file })} />);
  const source = document.querySelector('.image-editor-modal__source');
  expect(source.getAttribute('src')).toBe('/assets/photo.jpg?vid=7');
});

test('ImageEditorModal leaves the preview URL untouched when the file has no version', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const source = document.querySelector('.image-editor-modal__source');
  expect(source.getAttribute('src')).toBe('/assets/photo.jpg');
});

test('ImageEditorModal always shows the publish-required notice', () => {
  render(<ImageEditorModal {...makeProps()} />);
  expect(screen.getByText(/publish the image to update it on the live site/)).not.toBeNull();
});

test('ImageEditorModal shows the stored original dimensions and file size', () => {
  // The file-detail payload's own shape: a size the server has already formatted.
  const file = {
    name: 'photo.jpg', url: '/assets/photo.jpg', extension: 'jpg', width: 4000, height: 2000, size: '96 KB',
  };
  render(<ImageEditorModal {...makeProps({ file })} />);
  // The record's own values, so the readout is there before the preview has loaded.
  expect(screen.getByText('Original: 4000 x 2000')).not.toBeNull();
  expect(screen.getByText('File size: 96 KB')).not.toBeNull();
  // The file size reads to the right of the dimensions it belongs with.
  const readouts = screen.getByText('Original: 4000 x 2000').parentNode.textContent;
  expect(readouts.indexOf('File size:')).toBeGreaterThan(readouts.indexOf('Original:'));
});

test('ImageEditorModal formats a file size given as raw bytes', () => {
  const file = {
    name: 'photo.jpg', url: '/assets/photo.jpg', extension: 'jpg', width: 4000, height: 2000, size: 3355443,
  };
  render(<ImageEditorModal {...makeProps({ file })} />);
  expect(screen.getByText('File size: 3.2 MB')).not.toBeNull();
});

test('ImageEditorModal omits the file size readout when the record reports none', () => {
  // File::getSize() returns false for a file with no size on disk.
  const file = {
    name: 'photo.jpg', url: '/assets/photo.jpg', extension: 'jpg', width: 4000, height: 2000, size: false,
  };
  render(<ImageEditorModal {...makeProps({ file })} />);
  expect(screen.getByText('Original: 4000 x 2000')).not.toBeNull();
  expect(screen.queryByText(/File size:/)).toBeNull();
});

test('ImageEditorModal crop output readout follows the crop box', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.click(getButton('Crop'));
  expect(screen.getByText('Cropped: 4000 x 2000')).not.toBeNull();
  // The mock reports a box 30% x 40% of the frame, so the readout updates to 1200 x 800.
  fireEvent.click(screen.getByTestId('crop-change'));
  expect(screen.getByText('Cropped: 1200 x 800')).not.toBeNull();
});

test('ImageEditorModal shows the crop output readout only while the Crop tool is on', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  // Nothing is being cropped, so a "cropped" size would just restate the original.
  expect(screen.queryByText(/^Cropped:/)).toBeNull();
  fireEvent.click(getButton('Crop'));
  expect(screen.queryByText(/^Cropped:/)).not.toBeNull();
  fireEvent.click(getButton('Crop'));
  expect(screen.queryByText(/^Cropped:/)).toBeNull();
});

test('ImageEditorModal reports the output size only once a resize is targeted', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  // With no resize the output is the crop output, so a second identical readout would be noise.
  expect(screen.queryByText(/^Output:/)).toBeNull();
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '800' } });
  // The same two values the fields hold, derived counterpart included.
  expect(screen.getByText('Output: 800 x 400')).not.toBeNull();
});

test('ImageEditorModal drops the output readout while a dimension is invalid', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '800' } });
  expect(screen.getByText('Output: 800 x 400')).not.toBeNull();
  // Half of an invalid pair is not an output, so the readout must go rather than mislead.
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '5000' } });
  expect(screen.queryByText(/^Output:/)).toBeNull();
});

test('ImageEditorModal seeds both resize fields from the crop output and sends no resize', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  // Nothing typed means no resize, but the fields still show the size the author will get.
  expect(screen.getByLabelText('Width').value).toBe('4000');
  expect(screen.getByLabelText('Height').value).toBe('2000');
  armApply();
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.resize).toBeUndefined();
});

test('ImageEditorModal a resize target back at the crop output un-arms Apply', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  const width = screen.getByLabelText('Width');
  // A pixel off the full size is an edit worth rendering.
  fireEvent.change(width, { target: { value: '3999' } });
  expect(getButton('Apply').disabled).toBe(false);
  // Typed back to the size it already is, on both axes, the render would be identical.
  fireEvent.change(width, { target: { value: '4000' } });
  expect(screen.getByLabelText('Height').value).toBe('2000');
  expect(getButton('Apply').disabled).toBe(true);
  // The field is still a tracked target, so there is something for Reset to clear.
  expect(getButton('Reset').disabled).toBe(false);
});

test('ImageEditorModal leaves a resize target equal to the crop output off the payload', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  // Down and back up again: the field is seeded at 4000, so it has to move to be typed back to it.
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '3999' } });
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '4000' } });
  // A flip leaves the crop output's dimensions alone, so the target survives it as the edit's own.
  // The flip is the edit; resizing 4000 to 4000 would only re-sample the image for no change.
  fireEvent.click(getButton('Flip horizontal'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.resize).toBeUndefined();
});

test('ImageEditorModal derives the height from a typed width and sends only the typed dimension', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '800' } });
  // Locked to the crop output's 2:1 ratio, and derived in the same render as the typed value.
  expect(screen.getByLabelText('Height').value).toBe('400');
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  // Only the dimension the author typed crosses the wire - the backend derives the other.
  expect(lastBackendPostData.resize).toEqual({ width: 800 });
});

test('ImageEditorModal keeps the pair in sync through a run of spinner steps', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  const width = screen.getByLabelText('Width');
  // A held spinner fires a change per auto-repeat step, each of which must leave the height correct.
  [800, 799, 798, 797].forEach((value) => {
    fireEvent.change(width, { target: { value: String(value) } });
    expect(screen.getByLabelText('Height').value).toBe(String(Math.round(value / 2)));
  });
});

test('ImageEditorModal lets the last field typed into win the authoritative axis', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '800' } });
  await waitFor(() => expect(screen.getByLabelText('Height').value).toBe('400'));
  fireEvent.change(screen.getByLabelText('Height'), { target: { value: '300' } });
  await waitFor(() => expect(screen.getByLabelText('Width').value).toBe('600'));
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.resize).toEqual({ height: 300 });
});

test('ImageEditorModal leaves the other field alone when a dimension is emptied', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '800' } });
  await waitFor(() => expect(screen.getByLabelText('Height').value).toBe('400'));
  fireEvent.change(screen.getByLabelText('Height'), { target: { value: '' } });
  // The emptied field is flagged, but the width the author typed is not rewritten.
  expect(screen.getByLabelText('Width').value).toBe('800');
  // Inline on the field, and also announced through the polite live region.
  expect(screen.getAllByText('Enter a whole number of pixels, 1 or more').length).toBe(2);
  expect(getButton('Apply').disabled).toBe(true);
});

test('ImageEditorModal clears the announced resize error once the fields are valid again', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  const liveRegion = document.querySelector('[aria-live="polite"]');
  fireEvent.change(screen.getByLabelText('Height'), { target: { value: '' } });
  expect(liveRegion.textContent).toBe('Enter a whole number of pixels, 1 or more');
  // Left sitting in the live region, a fixed message is read out again on the next announcement.
  fireEvent.change(screen.getByLabelText('Height'), { target: { value: '400' } });
  await waitFor(() => expect(liveRegion.textContent).toBe(''));
});

test('ImageEditorModal keeps a transform announcement when a resize error clears with it', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '' } });
  // Rotating re-seeds the fields, so the error clears - but the rotation is what must be announced.
  fireEvent.click(getButton('Rotate'));
  expect(document.querySelector('[aria-live="polite"]').textContent).toBe('Rotated to 90 degrees');
});

test('ImageEditorModal refuses an upsize inline, naming the ceiling, without clamping the value', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '5000' } });
  // Nothing has been cropped, so the ceiling is named as the original.
  expect(screen.getAllByText('Cannot be larger than the original image (4000 x 2000)').length).toBeGreaterThan(0);
  expect(getButton('Apply').disabled).toBe(true);
  // Rewriting the author's number teaches them nothing, so it is left exactly as typed.
  expect(screen.getByLabelText('Width').value).toBe('5000');
});

test('ImageEditorModal names the ceiling as the crop output while the Crop tool is on', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.click(getButton('Crop'));
  fireEvent.click(screen.getByTestId('crop-change'));
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '5000' } });
  // The box is 30% x 40% of the frame, so the ceiling is the 1200 x 800 the crop yields.
  expect(screen.getAllByText('Cannot be larger than the cropped image (1200 x 800)').length).toBeGreaterThan(0);
});

test('ImageEditorModal re-seeds the resize fields and drops the axis when the crop changes', async () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.change(screen.getByLabelText('Width'), { target: { value: '800' } });
  await waitFor(() => expect(screen.getByLabelText('Height').value).toBe('400'));
  // A target expressed against a crop that no longer exists reverts to "no resize".
  fireEvent.click(getButton('Crop'));
  fireEvent.click(screen.getByTestId('crop-change'));
  await waitFor(() => expect(screen.getByLabelText('Width').value).toBe('1200'));
  expect(screen.getByLabelText('Height').value).toBe('800');
  fireEvent.click(getButton('Apply'));
  await waitFor(() => expect(lastBackendPostData).toBeDefined());
  expect(lastBackendPostData.resize).toBeUndefined();
});

test('ImageEditorModal toolbar group separators are presentational only', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const separators = document.querySelectorAll('.image-editor-modal__toolbar-separator');
  // Four visual groups - crop and aspect, the resize fields, rotate, the flips - so three rules.
  expect(separators.length).toBe(3);
  separators.forEach((separator) => {
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('tabindex')).toBeNull();
    // Decoration with no meaning: nothing for assistive tech to read, and no role to announce.
    expect(separator.getAttribute('role')).toBeNull();
    expect(separator.textContent).toBe('');
  });
});

test('ImageEditorModal separates the crop, rotate and flip groups in the toolbar', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const toolbar = screen.getByRole('toolbar', { name: 'Image transform tools' });
  const separatorAfter = (control) => {
    const sibling = control.nextElementSibling;
    return sibling !== null && sibling.classList.contains('image-editor-modal__toolbar-separator');
  };
  // A rule closes the crop group, the resize fields and rotate; none inside a group or before Reset.
  expect(separatorAfter(screen.getByLabelText('Aspect ratio'))).toBe(true);
  expect(separatorAfter(document.querySelector('.image-editor-modal__resize'))).toBe(true);
  expect(separatorAfter(getButton('Rotate'))).toBe(true);
  expect(separatorAfter(getButton('Crop'))).toBe(false);
  expect(separatorAfter(getButton('Flip horizontal'))).toBe(false);
  expect(separatorAfter(getButton('Flip vertical'))).toBe(false);
  // Children of the toolbar itself, so the grouping does not subdivide it into nested containers.
  document.querySelectorAll('.image-editor-modal__toolbar-separator').forEach((separator) => {
    expect(separator.parentElement).toBe(toolbar);
  });
});

test('ImageEditorModal includes the resize fields in the roving group', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  const toolbar = screen.getByRole('toolbar', { name: 'Image transform tools' });
  // Crop (0) -> Aspect (1) -> Width (2) -> Height (3) -> Rotate (4).
  expect(screen.getByLabelText('Width').getAttribute('tabindex')).toBe('-1');
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  expect(screen.getByLabelText('Width').getAttribute('tabindex')).toBe('0');
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  expect(screen.getByLabelText('Height').getAttribute('tabindex')).toBe('0');
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  expect(getButton('Rotate').getAttribute('tabindex')).toBe('0');
});

test('ImageEditorModal leaves the vertical arrow keys to a resize field spinner', () => {
  render(<ImageEditorModal {...makeProps()} />);
  loadSource(4000, 2000);
  fireEvent.keyDown(screen.getByLabelText('Width'), { key: 'ArrowUp' });
  // Up/Down step the number field's own spinner, so the toolbar must not treat them as navigation.
  expect(screen.getByLabelText('Width').getAttribute('tabindex')).toBe('-1');
  expect(getButton('Crop').getAttribute('tabindex')).toBe('0');
});

test('ImageEditorModal skips the resize fields in the roving group while they are disabled', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const toolbar = screen.getByRole('toolbar', { name: 'Image transform tools' });
  // The source has not loaded, so both fields are disabled and the arrows must step over them.
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  expect(getButton('Rotate').getAttribute('tabindex')).toBe('0');
});

test('ImageEditorModal moves toolbar focus with ArrowLeft and Home across the visual groups', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const toolbar = screen.getByRole('toolbar', { name: 'Image transform tools' });
  // Rotate makes Reset reachable; the unloaded source leaves the two resize fields disabled.
  fireEvent.click(getButton('Rotate'));
  fireEvent.keyDown(toolbar, { key: 'End' });
  expect(getButton('Reset').getAttribute('tabindex')).toBe('0');
  // Reset (7) -> Flip vertical (6) -> Flip horizontal (5) -> Rotate (4), separators notwithstanding.
  fireEvent.keyDown(toolbar, { key: 'ArrowLeft' });
  expect(getButton('Flip vertical').getAttribute('tabindex')).toBe('0');
  fireEvent.keyDown(toolbar, { key: 'ArrowLeft' });
  expect(getButton('Flip horizontal').getAttribute('tabindex')).toBe('0');
  fireEvent.keyDown(toolbar, { key: 'ArrowLeft' });
  expect(getButton('Rotate').getAttribute('tabindex')).toBe('0');
  fireEvent.keyDown(toolbar, { key: 'ArrowLeft' });
  expect(screen.getByLabelText('Aspect ratio').getAttribute('tabindex')).toBe('0');
  // Home returns to the first control of the first group from anywhere in the row.
  fireEvent.keyDown(toolbar, { key: 'Home' });
  expect(getButton('Crop').getAttribute('tabindex')).toBe('0');
  expect(getButton('Reset').getAttribute('tabindex')).toBe('-1');
});

test('ImageEditorModal moves toolbar focus with the ArrowRight key (roving tabindex)', () => {
  render(<ImageEditorModal {...makeProps()} />);
  const toolbar = screen.getByRole('toolbar', { name: 'Image transform tools' });
  // Crop leads, so it is the single initial tab stop; the others leave the sequence until arrowed to.
  expect(getButton('Crop').getAttribute('tabindex')).toBe('0');
  expect(getButton('Rotate').getAttribute('tabindex')).toBe('-1');
  // Reset shares the roving group too, so it carries a managed tabindex rather than a native stop.
  expect(getButton('Reset').getAttribute('tabindex')).toBe('-1');
  // Crop (0) -> Aspect (1) -> Width (2) -> Height (3) -> Rotate (4), the disabled fields stepped over.
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
  expect(getButton('Rotate').getAttribute('tabindex')).toBe('0');
  // End jumps to the last *enabled* member, so it skips the still-disabled Reset.
  fireEvent.keyDown(toolbar, { key: 'End' });
  expect(getButton('Flip vertical').getAttribute('tabindex')).toBe('0');
  expect(getButton('Reset').getAttribute('tabindex')).toBe('-1');
  // Once a transform enables Reset, End reaches it.
  fireEvent.click(getButton('Rotate'));
  fireEvent.keyDown(toolbar, { key: 'End' });
  expect(getButton('Reset').getAttribute('tabindex')).toBe('0');
});
