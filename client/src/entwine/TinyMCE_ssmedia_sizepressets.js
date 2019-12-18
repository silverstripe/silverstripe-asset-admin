/**
 * @typedef {import('types/ImageSizePreset').ImageSizePreset} ImageSizePreset
 */

/**
 * Set up one button
 * @note There's a bit of split logic to handle the original size button based on the width.
 * @param {Object} editor
 * @param {ImageSizePreset} preset
 * @return {string} Button name
 */
function presetButton(editor, preset) {
  const { name, width, text } = preset;

  // We add a prefix to the button name to avoid potential clash.
  const formatName = `ssmedia${name}`;

  // Register a new format on the fly
  editor.on('init', () => {
    editor.formatter.register(formatName, {
      selector: 'img',
      attributes: {
        width: width ? width.toString() : ''
      }
    });
  });

  /**
   * Retrieve the current selection if it's an image.
   * @returns {HTMLElement|undefined}
   */
  const image = () => {
    const img = editor.selection.getNode();
    return img && img.tagName === 'IMG' ? img : undefined;
  };


  /**
   * Enabled/Disabled the provided TinyMCE button
   * @param {Object} button TinyMCE button object
   */
  const disableCheck = (button) => {
    const img = image();
    // Original size button is always enable ... other buttons are only enable
    // if they are smaller than the natural width of the image
    button.disabled(img && width ? img.naturalWidth < width : false);
  };

  /**
   * Check if the current selections matches the format for this button
   * @returns {boolean}
   */
  const formatMatches = () => {
    if (editor.formatter.match(formatName)) {
      // This will work fine for fixed size button
      return true;
    }

    // Original size button will also match if the element
    // width is undefined or set the natural width of the image
    const img = image();
    if (!width && img) {
      const imgWidth = img.getAttribute('width');
      return !imgWidth || imgWidth.toString() === img.naturalWidth.toString();
    }

    return false;
  };

  /**
   * Setups the button. Fired once, the first time the button is rendered.
   * @param event
   */
  const onpostrender = (event) => {
    // Get a reference to the button
    const button = event.target;

    const onFormatChanged = () => { button.active(formatMatches()); };

    // Set the disabled status of the button ... first check needs to be triggered manually.
    editor.on('NodeChange', () => {
      disableCheck(button);
      onFormatChanged();
    });
    disableCheck(button);

    if (editor.formatter) {
      editor.formatter.formatChanged(formatName, onFormatChanged);
      if (formatMatches()) {
        editor.formatter.apply(formatName);
        const img = image();
        img.setAttribute('width', width || img.naturalWidth);
      }
    }
  };

  /**
   * Action that gets run when a user clicks on the button
   */
  const onclick = () => {
    const img = image();
    if (!img) {
      return;
    }

    // Clearn any preset width/height
    img.removeAttribute('height');
    img.removeAttribute('width');

    // Apply format
    editor.formatter.apply(formatName);

    if (width) {
      // Explicitely set the height for fixed size image
      img.setAttribute('height', img.clientHeight);
    } else {
      // For original size image set the width and height
      img.setAttribute('width', img.naturalWidth);
      img.setAttribute('height', img.naturalHeight);
    }
  };

  // Tell TinyMCE about our new button
  editor.addButton(formatName, {
    icon: false,
    text,
    onclick,
    onpostrender
  });

  return formatName;
}

/**
 * Set up all the buttons for tiny mce and return a list of their names
 * @param {Object} editor TinyMCE Editor object
 * @param {SizePreset[]} sizePresets
 * @return {string[]}
 */
export function imageSizePresetButtons(editor, sizePresets) {
  return sizePresets.map(preset => presetButton(editor, preset));
}
