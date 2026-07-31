import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Alert, Input, Label } from 'reactstrap';
import ModalCloseButton from 'components/Modal/ModalCloseButton';
import ReactCrop, { clamp } from 'react-image-crop';
import i18n from 'i18n';
import Config from 'lib/Config';
import { fileSize } from 'lib/DataFormat';
import backend from 'lib/Backend';
import urlLib from 'url';
import qs from 'qs';
import { display as displayToast } from 'state/toasts/ToastsActions';

const SECTION_KEY = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

const FULL_FRAME_CROP = { unit: '%', x: 0, y: 0, width: 100, height: 100 };

/**
 * Aspect-ratio presets for the crop box. A `null` ratio means Freeform (unconstrained); the
 * string 'original' resolves to the working image's own aspect ratio, so it follows a rotate.
 */
const ASPECT_OPTIONS = [
  { key: 'free', ratio: null },
  { key: '1:1', ratio: 1 },
  { key: '4:3', ratio: 4 / 3 },
  { key: '3:2', ratio: 3 / 2 },
  { key: '16:9', ratio: 16 / 9 },
  { key: 'original', ratio: 'original' },
];

const isRotatedQuarter = (rotate) => rotate === 90 || rotate === 270;

/**
 * Mirror a percent crop box in an on-screen axis, so a flip keeps it framing the same subject.
 */
const mirrorCrop = (crop, axis) => {
  if (!crop) {
    return crop;
  }
  // ReactCrop percent output can float a hair past 100, leaving a negative origin the server rejects.
  if (axis === 'horizontal') {
    return { ...crop, x: clamp(100 - crop.x - crop.width, 0, 100 - crop.width) };
  }
  return { ...crop, y: clamp(100 - crop.y - crop.height, 0, 100 - crop.height) };
};

/**
 * Rotate a percent crop box with the image by one 90 degree clockwise step; the box swaps with the
 * frame so it keeps framing the same subject.
 */
const rotateCropQuarter = (crop) => {
  if (!crop) {
    return crop;
  }
  const { x, y, width, height } = crop;
  // ReactCrop percent output can float a hair past 100, leaving a negative origin the server rejects.
  return {
    ...crop,
    x: clamp(100 - y - height, 0, 100 - height),
    y: clamp(x, 0, 100 - width),
    width: height,
    height: width,
  };
};

/**
 * True when a preset's rotated ratio is not itself a preset, so it must release to Freeform on a
 * quarter-turn. 1:1 and Original survive.
 */
const shouldReleaseAspectOnQuarterTurn = (key) => {
  const option = ASPECT_OPTIONS.find((opt) => opt.key === key);
  return !!option && typeof option.ratio === 'number' && option.ratio !== 1;
};

/**
 * Reshape an existing crop box to a new aspect ratio in place, keeping its centre. `ratio` is
 * width/height in pixel space, so `size` converts it against the percent box.
 */
const reshapeCropToAspect = (crop, ratio, size) => {
  if (!crop || !ratio || !size.width || !size.height) {
    return crop;
  }
  const centreX = crop.x + crop.width / 2;
  const centreY = crop.y + crop.height / 2;
  // A box is `ratio`:1 in pixels when width * size.width = ratio * height * size.height.
  let width = crop.width;
  let height = (width * size.width) / (ratio * size.height);
  if (height > 100) {
    height = crop.height;
    width = (height * ratio * size.height) / size.width;
  }
  // Only the width can overrun the frame at this point, so scaling it to fit settles both axes.
  if (width > 100) {
    height *= 100 / width;
    width = 100;
  }
  const x = clamp(centreX - width / 2, 0, 100 - width);
  const y = clamp(centreY - height / 2, 0, 100 - height);
  return { unit: '%', x, y, width, height };
};

/**
 * How far short of the full frame a crop box must fall to count as trimming it. ReactCrop's
 * percent output floats a hair either side of 100, and a fraction of a percent is under a pixel
 * on any plausible image - the server's own rounding would drop it.
 */
const FULL_FRAME_TOLERANCE = 0.01;

/**
 * True when a crop box actually trims the frame. A full-frame box renders the image back
 * unchanged, so it is a crop the author has drawn but not an edit to send.
 */
const cropTrimsFrame = (box) => !!box
  && (box.width < 100 - FULL_FRAME_TOLERANCE || box.height < 100 - FULL_FRAME_TOLERANCE);

/**
 * Pull the server's message out of a failed request, or null. lib/Backend attaches the raw Response
 * as `.response`, and the endpoint answers a non-2xx with a JSON body shaped `{ value }`.
 */
const extractServerMessage = async (err) => {
  const response = err && err.response;
  if (!response || typeof response.json !== 'function') {
    return null;
  }
  try {
    const body = await response.json();
    if (body && typeof body.value === 'string' && body.value) {
      return body.value;
    }
  } catch (e) {
    // Body was absent or not JSON - fall back to the caller's other messages.
  }
  return null;
};

/**
 * The working dimensions: the natural ones, swapped for a 90/270 rotate (flip never changes them).
 */
const workingSizeFor = (rotate, size) => (isRotatedQuarter(rotate)
  ? { width: size.height, height: size.width }
  : { width: size.width, height: size.height });

/**
 * The crop output's pixel dimensions, mapped the way calculateCropBox() in ImageEditor.php maps
 * them. Zero on both axes until the source's own dimensions are known.
 */
const cropOutputFor = (box, size) => {
  if (!size.width || !size.height) {
    return { width: 0, height: 0 };
  }
  return {
    width: clamp(Math.round((box.width / 100) * size.width), 1, size.width),
    height: clamp(Math.round((box.height / 100) * size.height), 1, size.height),
  };
};

/**
 * Parse a typed resize dimension; anything but a whole number of pixels of at least one is null.
 */
const parseDimension = (text) => {
  if (!/^\s*\d+\s*$/.test(String(text))) {
    return null;
  }
  const value = parseInt(String(text).trim(), 10);
  return value >= 1 ? value : null;
};

/**
 * Derive the counterpart dimension from the one the author typed, locked to the crop output's ratio.
 * Must stay in step with calculateResizeSize() in ImageEditor.php, which is authoritative: equal
 * forms differ by a pixel at .5.
 */
const deriveCounterpart = (axis, value, cropOutput) => {
  const ratio = cropOutput.width / cropOutput.height;
  return axis === 'width'
    ? Math.max(1, Math.round(value / ratio))
    : Math.max(1, Math.round(value * ratio));
};

/**
 * Compose the source after flip -> rotate onto an offscreen canvas and return it as a data URL, so
 * ReactCrop overlays its box against what the backend will render. Null (never throws) when the
 * source has not loaded or there is no 2d context (e.g. jsdom under test).
 */
const composePreview = (img, rotate, flip) => {
  const { naturalWidth, naturalHeight } = img;
  if (!naturalWidth || !naturalHeight) {
    return null;
  }
  try {
    const canvas = document.createElement('canvas');
    const swap = isRotatedQuarter(rotate);
    canvas.width = swap ? naturalHeight : naturalWidth;
    canvas.height = swap ? naturalWidth : naturalHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }
    // Canvas applies the last-set transform first, so rotate-then-scale composes flip -> rotate.
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((rotate * Math.PI) / 180);
    context.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    context.drawImage(img, -naturalWidth / 2, -naturalHeight / 2, naturalWidth, naturalHeight);
    return canvas.toDataURL();
  } catch (e) {
    return null;
  }
};

/**
 * Append a `vid` query param so a replaced file (same URL, bumped version) busts the browser cache,
 * as PreviewImageField and GalleryItem do.
 */
const createCacheBustUrl = (url, version, bustCache) => {
  if (!url || bustCache === false || !version || url.startsWith('data:')) {
    return url;
  }
  const parsedUrl = urlLib.parse(url);
  const parsedQs = { ...qs.parse(parsedUrl.query), vid: version };
  return urlLib.format({ ...parsedUrl, search: qs.stringify(parsedQs) });
};

/**
 * The file size as text, or null when there is none to report. Both payload shapes reach here: the
 * file-detail one carries a size the server has already formatted ('96 KB'), an upload raw bytes.
 */
const formatFileSize = (size) => {
  if (typeof size === 'number') {
    return size > 0 ? fileSize(size) : null;
  }
  return typeof size === 'string' && size.trim() !== '' ? size : null;
};

/**
 * The configured default for the backup checkbox; absent means "not configured", so ticked.
 */
const readBackupDefault = () => Config.getSection(SECTION_KEY).backupOriginalByDefault !== false;

/**
 * The basic image editor modal: crop, 90 degree rotate, flip and resize. Sends intent only - crop
 * ratios, rotation, flip flags, one resize dimension - which the server renders.
 */
const ImageEditorModal = ({ fileId, file, isOpen = false, onClosed, onImageEdited, setSuccess }) => {
  const [rotate, setRotate] = useState(0);
  const [flip, setFlip] = useState({ horizontal: false, vertical: false });
  // An undefined `crop` means "the whole image"; `cropActive` gates dragging a box out at all.
  const [crop, setCrop] = useState();
  const [cropActive, setCropActive] = useState(false);
  const [aspectKey, setAspectKey] = useState('free');
  const [sourceImg, setSourceImg] = useState(null);
  // A reload keeps the same <img> reference, so setSourceImg alone would not re-render; this forces
  // composedSrc to recompute against the freshly loaded pixels.
  const [loadNonce, setLoadNonce] = useState(0);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [announcement, setAnnouncement] = useState('');
  const [toolbarIndex, setToolbarIndex] = useState(0);
  const [backupOriginal, setBackupOriginal] = useState(readBackupDefault);
  // The axis the author last typed on, plus its value; a null axis omits `resize` from the payload.
  const [resize, setResize] = useState({ axis: null, value: 0 });
  const [widthField, setWidthField] = useState('');
  const [heightField, setHeightField] = useState('');

  const toolbarRefs = useRef([]);
  const errorRef = useRef(null);
  // The last resize validation message announced, so only that one is cleared once it is fixed.
  const lastValidationMessage = useRef('');

  // Take a keyboard/AT user to the message rather than leaving them stranded on <body>.
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  // Declared before handleReset, which calls it to move focus off Reset before Reset disables itself.
  const focusToolbar = (index) => {
    const target = toolbarRefs.current[index];
    if (target) {
      target.focus();
    }
  };

  const fileName = (file && file.name) || '';

  // `file` is refetched when the editor opens, so its version is current for the cache bust.
  const bustCache = Config.getSection(SECTION_KEY).bustCache;
  const sourceUrl = useMemo(
    () => createCacheBustUrl((file && file.url) || '', file && file.version, bustCache),
    [file, bustCache]
  );

  const workingSize = useMemo(
    () => workingSizeFor(rotate, naturalSize),
    [rotate, naturalSize]
  );

  // Falls back to the raw source until it has loaded, or where there is no canvas (jsdom under test).
  const composedSrc = useMemo(() => {
    if (sourceImg) {
      const src = composePreview(sourceImg, rotate, flip);
      if (src) {
        return src;
      }
    }
    return sourceUrl;
  }, [sourceImg, loadNonce, rotate, flip.horizontal, flip.vertical, sourceUrl]);

  /**
   * Resolve an aspect key into a numeric ratio. `size` is already the working size, so 'original'
   * is the working aspect directly - no re-swap.
   */
  const resolveAspect = (key, size) => {
    const option = ASPECT_OPTIONS.find((opt) => opt.key === key);
    if (!option || option.ratio === null) {
      return null;
    }
    if (option.ratio === 'original') {
      if (!size.width || !size.height) {
        return null;
      }
      return size.width / size.height;
    }
    return option.ratio;
  };

  /**
   * A centred-aspect crop in percent units, or `undefined` for Freeform / before the image loads.
   */
  const computeCrop = (key, size) => {
    const ratio = resolveAspect(key, size);
    if (!ratio || !size.width || !size.height) {
      return undefined;
    }
    // Fitted from the full frame, so a ratio taller than the frame settles on the height rather
    // than overflowing it: makeAspectCrop() derives the height from a 100% width unconditionally.
    return reshapeCropToAspect(FULL_FRAME_CROP, ratio, size);
  };

  /**
   * A guaranteed starting box for keyboard activation, which cannot drag one out.
   */
  const seedCropFor = (key, size) => computeCrop(key, size) || FULL_FRAME_CROP;

  // An undefined crop is a valid Apply (the whole image); a drawn crop must have area.
  const cropSelected = !!crop && crop.width > 0 && crop.height > 0;

  // Also the resize target's ceiling and the ratio it is locked to.
  const cropOutput = useMemo(
    () => cropOutputFor(cropSelected ? crop : FULL_FRAME_CROP, workingSize),
    [crop, cropSelected, workingSize]
  );
  const dimensionsKnown = cropOutput.width > 0 && cropOutput.height > 0;

  // Show the crop output in both fields and revert to "no resize".
  const seedResizeFields = (output) => {
    setResize({ axis: null, value: 0 });
    setWidthField(output.width ? String(output.width) : '');
    setHeightField(output.height ? String(output.height) : '');
  };

  // A target typed against a crop that no longer exists cannot be reinterpreted against the new one.
  // Reseeded during render rather than in an effect: an effect lands after the browser has painted,
  // so a rotate flashes the pre-turn target against the post-turn ceiling as an upsize error.
  const [seededFor, setSeededFor] = useState(cropOutput);
  if (seededFor.width !== cropOutput.width || seededFor.height !== cropOutput.height) {
    setSeededFor(cropOutput);
    seedResizeFields(cropOutput);
  }

  /**
   * Typing into a field makes it the authoritative axis and derives the other - the last field typed
   * into wins. Derived in the handler rather than an effect so the counterpart lands in the same
   * render, which keeps the pair in lockstep while a native spinner is held down.
   */
  const handleDimensionChange = (axis) => (event) => {
    const text = event.target.value;
    if (axis === 'width') {
      setWidthField(text);
    } else {
      setHeightField(text);
    }
    const value = parseDimension(text);
    const ceiling = axis === 'width' ? cropOutput.width : cropOutput.height;
    if (value === null || (dimensionsKnown && value > ceiling)) {
      return;
    }
    setResize({ axis, value });
    // Never write into the field under the cursor: it jumps the caret mid-edit.
    if (!dimensionsKnown) {
      return;
    }
    const derived = String(deriveCounterpart(axis, value, cropOutput));
    if (axis === 'width') {
      setHeightField(derived);
    } else {
      setWidthField(derived);
    }
  };

  // The ceiling is the crop output either way; with the Crop tool off there is no crop to name.
  const upsizeMessage = i18n.sprintf(
    cropActive
      ? i18n._t('AssetAdmin.IMAGE_EDITOR_RESIZE_TOO_LARGE', 'Cannot be larger than the cropped image (%s x %s)')
      : i18n._t(
        'AssetAdmin.IMAGE_EDITOR_RESIZE_TOO_LARGE_ORIGINAL',
        'Cannot be larger than the original image (%s x %s)'
      ),
    cropOutput.width,
    cropOutput.height
  );

  /**
   * The inline validation message for a field, or null when it is valid. Resize may only shrink.
   */
  const dimensionError = (text, ceiling) => {
    if (!dimensionsKnown) {
      return null;
    }
    const value = parseDimension(text);
    if (value === null) {
      return i18n._t('AssetAdmin.IMAGE_EDITOR_RESIZE_INVALID', 'Enter a whole number of pixels, 1 or more');
    }
    return value > ceiling ? upsizeMessage : null;
  };

  const widthError = dimensionError(widthField, cropOutput.width);
  const heightError = dimensionError(heightField, cropOutput.height);
  const resizeValid = !widthError && !heightError;

  // Left null unless a resize is targeted, where it would only restate the crop output beside it.
  const outputSize = resize.axis && resizeValid
    ? { width: parseDimension(widthField), height: parseDimension(heightField) }
    : null;

  // Route validation errors to the polite live region as well as the red field.
  useEffect(() => {
    const message = widthError || heightError || '';
    // Read before the update, which runs after the ref has moved on.
    const previous = lastValidationMessage.current;
    lastValidationMessage.current = message;
    // Clearing a message once the fields are valid again keeps stale text out of the live region,
    // but only our own: a transform's announcement made in the same render must survive.
    setAnnouncement((prev) => (message || prev === previous ? message : prev));
  }, [widthError, heightError]);

  const onImageLoad = (event) => {
    const img = event.currentTarget;
    setSourceImg(img);
    setLoadNonce((nonce) => nonce + 1);
    const size = { width: img.naturalWidth, height: img.naturalHeight };
    setNaturalSize(size);
    // Any seed or reshape before load ran against a 0x0 frame, so re-fit it to the real dimensions.
    if (crop) {
      const working = workingSizeFor(rotate, size);
      setCrop((prev) => reshapeCropToAspect(prev, resolveAspect(aspectKey, working), working));
    }
  };

  /**
   * Toggle the Crop tool; turning it off clears the selection but keeps the chosen aspect. A
   * keyboard activation (click with detail 0) cannot drag a box out, so one is seeded for it.
   */
  const toggleCrop = (event) => {
    if (loading) {
      return;
    }
    if (cropActive) {
      setCropActive(false);
      setCrop(undefined);
      setAnnouncement(i18n._t('AssetAdmin.IMAGE_EDITOR_CROP_OFF', 'Crop tool off'));
      return;
    }
    setCropActive(true);
    const keyboardActivated = !event || event.detail === 0;
    setCrop(keyboardActivated ? seedCropFor(aspectKey, workingSize) : undefined);
    setAnnouncement(i18n._t('AssetAdmin.IMAGE_EDITOR_CROP_ON', 'Crop tool on'));
  };

  const handleAspectChange = (event) => {
    const key = event.target.value;
    setAspectKey(key);
    // Choosing a ratio with the tool off is an intent to crop, so it turns the tool on. A preset
    // names a shape, so it is seeded as a centred box - a select change carries no modality signal,
    // and a keyboard author has no other route to one. Freeform names none, so it only arms: a
    // full-frame seed would cover the canvas and leave nowhere to drag a box out of.
    if (!cropActive) {
      setCropActive(true);
      setCrop(computeCrop(key, workingSize));
      setAnnouncement(i18n._t('AssetAdmin.IMAGE_EDITOR_CROP_ON', 'Crop tool on'));
      return;
    }
    // With no box, the ratio is only the constraint for the next drag.
    if (cropSelected) {
      setCrop(reshapeCropToAspect(crop, resolveAspect(key, workingSize), workingSize));
    }
  };

  const handleRotate = () => {
    if (loading) {
      return;
    }
    const next = (rotate + 90) % 360;
    setRotate(next);
    // The box rotates with the image, so a preset that cannot survive the turn releases to Freeform.
    if (crop) {
      setCrop(rotateCropQuarter(crop));
      if (shouldReleaseAspectOnQuarterTurn(aspectKey)) {
        setAspectKey('free');
      }
    }
    setAnnouncement(i18n.sprintf(
      i18n._t('AssetAdmin.IMAGE_EDITOR_ROTATED', 'Rotated to %s degrees'),
      next
    ));
  };

  /**
   * Toggle the flip flag that mirrors what the user currently sees. The payload composes flip then
   * rotate, so a 90/270 rotate swaps which payload axis the seen axis maps to.
   */
  const handleFlip = (seenAxis) => {
    if (loading) {
      return;
    }
    const rotated = isRotatedQuarter(rotate);
    let key;
    if (seenAxis === 'horizontal') {
      key = rotated ? 'vertical' : 'horizontal';
    } else {
      key = rotated ? 'horizontal' : 'vertical';
    }
    // The resulting state, so the announcement can report an un-flip rather than claiming a flip.
    const flippedOn = !flip[key];
    setFlip((prev) => ({ ...prev, [key]: !prev[key] }));
    // Mirror the crop box in the seen axis; flip leaves the working dimensions and aspect unchanged.
    if (crop) {
      setCrop(mirrorCrop(crop, seenAxis));
    }
    if (seenAxis === 'horizontal') {
      setAnnouncement(flippedOn
        ? i18n._t('AssetAdmin.IMAGE_EDITOR_FLIPPED_HORIZ', 'Flipped horizontally')
        : i18n._t('AssetAdmin.IMAGE_EDITOR_UNFLIPPED_HORIZ', 'Horizontal flip removed'));
    } else {
      setAnnouncement(flippedOn
        ? i18n._t('AssetAdmin.IMAGE_EDITOR_FLIPPED_VERT', 'Flipped vertically')
        : i18n._t('AssetAdmin.IMAGE_EDITOR_UNFLIPPED_VERT', 'Vertical flip removed'));
    }
  };

  // Reset's gate: any in-modal state to clear, a full-frame box included.
  const hasTransform = rotate !== 0
    || flip.horizontal
    || flip.vertical
    || cropSelected
    || resize.axis !== null;

  // A target that matches the crop output on both axes is no resize at all: typing a dimension
  // back to the size it already was must un-arm Apply, not leave it armed on an identical render.
  // Only a shrink is valid, so falling short on either axis is the whole test.
  const resizeShrinks = resize.axis !== null
    && resizeValid
    && (parseDimension(widthField) < cropOutput.width || parseDimension(heightField) < cropOutput.height);

  // Apply's gate: something that would actually change the pixels. A box the author has left
  // framing the whole image crops nothing, so on its own there is no edit to send.
  const hasEdit = rotate !== 0
    || flip.horizontal
    || flip.vertical
    || (cropSelected && cropTrimsFrame(crop))
    || resizeShrinks;

  const cropValid = !crop || cropSelected;

  const handleReset = () => {
    if (loading || !hasTransform) {
      return;
    }
    setRotate(0);
    setFlip({ horizontal: false, vertical: false });
    setAspectKey('free');
    setCrop(undefined);
    setCropActive(false);
    setError(null);
    // The crop-change effect does not fire when the crop output is unchanged (only a resize typed).
    seedResizeFields(cropOutputFor(FULL_FRAME_CROP, naturalSize));
    setAnnouncement(i18n._t('AssetAdmin.IMAGE_EDITOR_RESET', 'Reset all changes'));
    // Reset disables itself once the transforms are cleared, which would drop focus to <body>.
    setToolbarIndex(0);
    focusToolbar(0);
  };

  const handleCancel = () => {
    if (loading) {
      return;
    }
    onClosed();
  };

  const handleApply = () => {
    // Nothing to apply means nothing to write: a no-op edit would still re-encode and back up.
    if (loading || !hasEdit || !cropValid || !resizeValid) {
      return;
    }
    setLoading(true);
    setError(null);

    const url = Config.getSection(SECTION_KEY).endpoints.editImage.url;
    // No crop selected means "keep the whole working image", so send a full-frame (no-op) crop.
    const activeCrop = cropSelected ? crop : FULL_FRAME_CROP;
    const payload = {
      fileId,
      flip: { horizontal: flip.horizontal, vertical: flip.vertical },
      rotate,
      crop: {
        x: activeCrop.x / 100,
        y: activeCrop.y / 100,
        width: activeCrop.width / 100,
        height: activeCrop.height / 100,
      },
      backupOriginal,
    };
    // Only the typed dimension crosses the wire; the backend derives the other. A target equal to
    // the crop output is left off it entirely - it would re-sample the image for no change.
    if (resizeShrinks) {
      payload.resize = { [resize.axis]: resize.value };
    }

    backend.post(url, payload, { 'X-SecurityID': Config.get('SecurityID') })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        // The backup's name is server-generated, so this is the only place the author learns it.
        setSuccess(responseJson.backupFilename
          ? i18n.sprintf(
            i18n._t('AssetAdmin.IMAGE_EDITOR_SAVED_WITH_BACKUP', 'Image updated. Original backed up as "%s".'),
            responseJson.backupFilename
          )
          : i18n._t('AssetAdmin.IMAGE_EDITOR_SAVED', 'Image updated.'));
        if (typeof onImageEdited === 'function') {
          onImageEdited();
        }
        onClosed();
      })
      .catch(async (err) => {
        setLoading(false);
        const serverMessage = await extractServerMessage(err);
        const message = serverMessage
          || (err && err.message)
          || i18n._t('AssetAdmin.IMAGE_EDITOR_FAILED', 'The image could not be edited. Please try again.');
        // The Alert is an assertive live region, so this is not also pushed to the polite one.
        setError(message);
      });
  };

  // `element.disabled` covers the <button>s, the aspect <select> and the resize <input>s alike.
  const isToolbarEnabled = (index) => {
    const element = toolbarRefs.current[index];
    return !!element && element.disabled !== true;
  };

  // The nearest enabled control from `start`, wrapping; null when none is enabled (all disabled).
  const nextEnabledIndex = (start, step) => {
    const count = toolbarRefs.current.length;
    for (let i = 1; i <= count; i += 1) {
      const index = (((start + step * i) % count) + count) % count;
      if (isToolbarEnabled(index)) {
        return index;
      }
    }
    return null;
  };

  // The first enabled control scanning from `start`, for Home (0, forward) and End (last, backward).
  const firstEnabledIndex = (start, step) => {
    const count = toolbarRefs.current.length;
    for (let i = 0; i < count; i += 1) {
      const index = start + step * i;
      if (isToolbarEnabled(index)) {
        return index;
      }
    }
    return null;
  };

  const handleToolbarKeyDown = (event) => {
    const isSelect = event.target && event.target.tagName === 'SELECT';
    let index;
    // Everything but the horizontal keys and Home/End falls through to the focused control, leaving
    // Up/Down to the resize spinners as the ARIA toolbar pattern requires.
    switch (event.key) {
      case 'ArrowRight':
        index = nextEnabledIndex(toolbarIndex, 1);
        break;
      case 'ArrowLeft':
        index = nextEnabledIndex(toolbarIndex, -1);
        break;
      case 'Home':
        // The aspect <select> keeps its native Home (jump to first option).
        if (isSelect) {
          return;
        }
        index = firstEnabledIndex(0, 1);
        break;
      case 'End':
        // The aspect <select> keeps its native End (jump to last option).
        if (isSelect) {
          return;
        }
        index = firstEnabledIndex(toolbarRefs.current.length - 1, -1);
        break;
      default:
        return;
    }
    if (index === null) {
      return;
    }
    event.preventDefault();
    setToolbarIndex(index);
    focusToolbar(index);
  };

  const handleOpened = useCallback(() => {
    setToolbarIndex(0);
    focusToolbar(0);
  }, []);

  const toolbarTabIndex = (index) => (index === toolbarIndex ? 0 : -1);
  const registerToolbarRef = (index) => (element) => {
    toolbarRefs.current[index] = element;
  };
  const rovingProps = (index) => ({
    tabIndex: toolbarTabIndex(index),
    innerRef: registerToolbarRef(index),
  });

  const seesFlipHoriz = isRotatedQuarter(rotate) ? flip.vertical : flip.horizontal;
  const seesFlipVert = isRotatedQuarter(rotate) ? flip.horizontal : flip.vertical;

  const activeAspect = resolveAspect(aspectKey, workingSize);

  // The record's own values come first, so the readout does not wait on the preview loading.
  const originalWidth = (file && file.width) || naturalSize.width;
  const originalHeight = (file && file.height) || naturalSize.height;
  const originalSize = formatFileSize(file && file.size);

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleCancel}
      onOpened={handleOpened}
      onClosed={onClosed}
      keyboard={!loading}
      backdrop={loading ? 'static' : true}
      className="image-editor-modal"
      size="lg"
      labelledBy="image-editor-modal-title"
    >
      <ModalHeader
        toggle={loading ? undefined : handleCancel}
        close={<ModalCloseButton onClosed={loading ? () => {} : handleCancel} />}
      >
        <span id="image-editor-modal-title">
          {i18n._t('AssetAdmin.IMAGE_EDITOR_TITLE', 'Edit image')}
        </span>
      </ModalHeader>
      <ModalBody className="image-editor-modal__body">
        <div
          aria-live="polite"
          className="image-editor-modal__sr-only"
        >
          {announcement}
        </div>

        {error && (
          <Alert
            color="danger"
            fade={false}
            className="image-editor-modal__error"
            innerRef={errorRef}
            tabIndex={-1}
          >
            {error}
          </Alert>
        )}

        {/* The transform toolbar and Reset share one roving-tabindex group, so arrows reach Reset. */}
        <div className="image-editor-modal__toolbar-bar">
          <div
            role="toolbar"
            aria-label={i18n._t('AssetAdmin.IMAGE_EDITOR_TOOLBAR', 'Image transform tools')}
            className="image-editor-modal__toolbar"
            onKeyDown={handleToolbarKeyDown}
          >
            <Button
              color="secondary"
              size="sm"
              onClick={toggleCrop}
              disabled={loading}
              active={cropActive}
              aria-pressed={cropActive}
              {...rovingProps(0)}
            >
              <span className="image-editor-modal__icon-crop" aria-hidden="true" />
              {i18n._t('AssetAdmin.IMAGE_EDITOR_CROP', 'Crop')}
            </Button>
            <Input
              type="select"
              aria-label={i18n._t('AssetAdmin.IMAGE_EDITOR_ASPECT', 'Aspect ratio')}
              value={aspectKey}
              onChange={handleAspectChange}
              disabled={loading}
              {...rovingProps(1)}
              className="image-editor-modal__aspect"
              bsSize="sm"
            >
              <option value="free">{i18n._t('AssetAdmin.IMAGE_EDITOR_ASPECT_FREE', 'Freeform')}</option>
              <option value="1:1">1:1</option>
              <option value="4:3">4:3</option>
              <option value="3:2">3:2</option>
              <option value="16:9">16:9</option>
              <option value="original">{i18n._t('AssetAdmin.IMAGE_EDITOR_ASPECT_ORIGINAL', 'Original')}</option>
            </Input>
            <span className="image-editor-modal__toolbar-separator" aria-hidden="true" />
            <div className="image-editor-modal__resize">
              <div className="image-editor-modal__resize-field">
                <Label for="image-editor-modal-width">
                  {i18n._t('AssetAdmin.IMAGE_EDITOR_RESIZE_WIDTH', 'Width')}
                </Label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  id="image-editor-modal-width"
                  bsSize="sm"
                  value={widthField}
                  onChange={handleDimensionChange('width')}
                  disabled={loading || !dimensionsKnown}
                  {...rovingProps(2)}
                  invalid={!!widthError}
                  aria-invalid={!!widthError}
                  aria-describedby={widthError ? 'image-editor-modal-width-error' : undefined}
                />
                {widthError && (
                  <div className="image-editor-modal__field-error" id="image-editor-modal-width-error">
                    {widthError}
                  </div>
                )}
              </div>
              <div className="image-editor-modal__resize-field">
                <Label for="image-editor-modal-height">
                  {i18n._t('AssetAdmin.IMAGE_EDITOR_RESIZE_HEIGHT', 'Height')}
                </Label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  id="image-editor-modal-height"
                  bsSize="sm"
                  value={heightField}
                  onChange={handleDimensionChange('height')}
                  disabled={loading || !dimensionsKnown}
                  {...rovingProps(3)}
                  invalid={!!heightError}
                  aria-invalid={!!heightError}
                  aria-describedby={heightError ? 'image-editor-modal-height-error' : undefined}
                />
                {heightError && (
                  <div className="image-editor-modal__field-error" id="image-editor-modal-height-error">
                    {heightError}
                  </div>
                )}
              </div>
            </div>
            <span className="image-editor-modal__toolbar-separator" aria-hidden="true" />
            <Button
              color="secondary"
              size="sm"
              onClick={handleRotate}
              disabled={loading}
              {...rovingProps(4)}
            >
              {/* The icon set has no rotate glyph, so this is the sync glyph mirrored in CSS. */}
              <span className="font-icon-sync image-editor-modal__icon-mirror" aria-hidden="true" />
              {i18n._t('AssetAdmin.IMAGE_EDITOR_ROTATE', 'Rotate')}
            </Button>
            <span className="image-editor-modal__toolbar-separator" aria-hidden="true" />
            <Button
              color="secondary"
              size="sm"
              onClick={() => handleFlip('horizontal')}
              disabled={loading}
              aria-pressed={seesFlipHoriz}
              {...rovingProps(5)}
            >
              <span className="font-icon-switch" aria-hidden="true" />
              {i18n._t('AssetAdmin.IMAGE_EDITOR_FLIP_HORIZ', 'Flip horizontal')}
            </Button>
            <Button
              color="secondary"
              size="sm"
              className="image-editor-modal__flip-vertical"
              onClick={() => handleFlip('vertical')}
              disabled={loading}
              aria-pressed={seesFlipVert}
              {...rovingProps(6)}
            >
              {/* The icon set has no flip glyph, so this is the switch glyph turned in CSS. */}
              <span className="font-icon-switch image-editor-modal__icon-quarter-turn" aria-hidden="true" />
              {i18n._t('AssetAdmin.IMAGE_EDITOR_FLIP_VERT', 'Flip vertical')}
            </Button>
            <Button
              color="link"
              size="sm"
              className="image-editor-modal__reset"
              onClick={handleReset}
              disabled={loading || !hasTransform}
              {...rovingProps(7)}
            >
              {i18n._t('AssetAdmin.IMAGE_EDITOR_RESET_BUTTON', 'Reset')}
            </Button>
          </div>
        </div>

        <div className="image-editor-modal__canvas">
          {file && (
            <>
              {/* Hidden loader for the raw source, feeding composePreview its dimensions and pixels. */}
              <img
                src={sourceUrl}
                alt=""
                aria-hidden="true"
                onLoad={onImageLoad}
                className="image-editor-modal__source"
                style={{ display: 'none' }}
              />
              <ReactCrop
                className="image-editor-modal__crop"
                crop={crop}
                onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                aspect={activeAspect || undefined}
                disabled={loading || !cropActive}
              >
                <img
                  src={composedSrc}
                  alt={fileName}
                  className="image-editor-modal__image"
                  // The native image drag makes a drag over the canvas look like the image moving,
                  // which is never what is wanted here - a drag is a crop gesture or nothing.
                  onDragStart={(event) => event.preventDefault()}
                />
              </ReactCrop>
            </>
          )}
          {loading && (
            <div className="image-editor-modal__spinner" role="status">
              <span className="image-editor-modal__sr-only">
                {i18n._t('AssetAdmin.IMAGE_EDITOR_WORKING', 'Applying edit')}
              </span>
            </div>
          )}
        </div>

        <p className="image-editor-modal__readouts">
          {outputSize && (
            <span className="image-editor-modal__readout">
              {i18n.sprintf(
                i18n._t('AssetAdmin.IMAGE_EDITOR_OUTPUT_DIMENSIONS', 'Output: %s x %s'),
                outputSize.width,
                outputSize.height
              )}
            </span>
          )}
          {cropActive && dimensionsKnown && (
            <span className="image-editor-modal__readout">
              {i18n.sprintf(
                i18n._t('AssetAdmin.IMAGE_EDITOR_CROPPED_DIMENSIONS', 'Cropped: %s x %s'),
                cropOutput.width,
                cropOutput.height
              )}
            </span>
          )}
          {originalWidth > 0 && originalHeight > 0 && (
            <span className="image-editor-modal__readout">
              {i18n.sprintf(
                i18n._t('AssetAdmin.IMAGE_EDITOR_ORIGINAL_DIMENSIONS', 'Original: %s x %s'),
                originalWidth,
                originalHeight
              )}
            </span>
          )}
          {originalSize !== null && (
            <span className="image-editor-modal__readout">
              {i18n.sprintf(
                i18n._t('AssetAdmin.IMAGE_EDITOR_ORIGINAL_SIZE', 'File size: %s'),
                originalSize
              )}
            </span>
          )}
        </p>

        <div className="image-editor-modal__backup">
          <div className="form-check">
            <Input
              type="checkbox"
              className="form-check-input"
              id="image-editor-modal-backup"
              checked={backupOriginal}
              onChange={(event) => setBackupOriginal(event.target.checked)}
              disabled={loading}
            />
            <Label className="form-check-label" for="image-editor-modal-backup">
              {i18n._t('AssetAdmin.IMAGE_EDITOR_BACKUP_LABEL', 'Back up the original image')}
            </Label>
          </div>
        </div>

        <p className="image-editor-modal__notice">
          {i18n._t(
            'AssetAdmin.IMAGE_EDITOR_PUBLISH_REQUIRED',
            'The edited image will be saved as draft, publish the image to update it on the live site'
          )}
        </p>
      </ModalBody>
      <ModalFooter className="image-editor-modal__footer">
        <Button
          color="secondary"
          onClick={handleCancel}
          disabled={loading}
        >
          {i18n._t('AssetAdmin.IMAGE_EDITOR_CANCEL', 'Cancel')}
        </Button>
        <Button
          color="primary"
          onClick={handleApply}
          disabled={loading || !hasEdit || !cropValid || !resizeValid}
        >
          {i18n._t('AssetAdmin.IMAGE_EDITOR_APPLY', 'Apply')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ImageEditorModal.propTypes = {
  fileId: PropTypes.number.isRequired,
  file: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    extension: PropTypes.string,
    version: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    size: PropTypes.number,
  }),
  isOpen: PropTypes.bool,
  onClosed: PropTypes.func.isRequired,
  onImageEdited: PropTypes.func,
  setSuccess: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    setSuccess(text) {
      dispatch(displayToast({ text, type: 'success' }));
    },
  };
}

export { ImageEditorModal as Component };

export default compose(
  connect(null, mapDispatchToProps),
)(ImageEditorModal);
