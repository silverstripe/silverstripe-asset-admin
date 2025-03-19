import { boxesIntersect, useSelectionContainer } from '@air/react-drag-to-select';
import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Component that wraps around a list of items to make them selectable by dragging a box around them
 * and calls a callback when the selection changes
 * Uses the @air/react-drag-to-select library
 */
function Selectable(props) {
  const [mouseEvent, setMouseEvent] = useState(null);
  const [lastFileIDs, setLastFileIDs] = useState([]);

  const selectableItems = useRef([]);
  const selectableItemCoords = useRef([]);
  const itemContainerRef = useRef(null);
  const scrollableRef = useRef(null);
  // Using ref rather than state to store the offset so as to not to trigger re-render
  const offset = useRef({ y: 0, x: 0 });

  /**
   * Check if the target or any of its ancestors have the data-draggable attribute
   */
  function targetIsDraggable(target) {
    if (target instanceof HTMLElement) {
      let el = target;
      while (el.parentElement && !el.dataset.draggable) {
        el = el.parentElement;
      }
      if (el.dataset.draggable === 'true') {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if the target in an element outside the selectable, such as a modal
   */
  function targetIsOutside(target) {
    if (target instanceof HTMLElement) {
      let el = target;
      while (el.parentElement && el !== scrollableRef.current) {
        el = el.parentElement;
      }
      if (el === scrollableRef.current) {
        return false;
      }
    }
    return true;
  }

  /**
   * Handle mouse down event
   */
  function handleMouseDown(evt) {
    const target = evt.target;
    if (!props.isEnabled || targetIsOutside(target)) {
      return;
    }
    if (!targetIsDraggable(target)) {
      if (typeof props.onMouseDownOverNonDraggable === 'function') {
        props.onMouseDownOverNonDraggable();
      }
    }
  }

  // Selection container setup
  const { DragSelection } = useSelectionContainer({
    /**
     * Callback when selection starts
     */
    onSelectionStart: (evt) => {
      setMouseEvent(evt);
      // Update seletable items and their coordinates
      // This needs to called on selection start to update the selectable items
      // in case items have been added or removed, or the viewport
      // has been resized
      selectableItems.current = itemContainerRef.current.querySelectorAll('.gallery-item');
      selectableItemCoords.current = [];
      Array.from(selectableItems.current).forEach(item => {
        const { left, top, width, height } = item.getBoundingClientRect();
        selectableItemCoords.current.push({ left, top, width, height, item });
      });
      // Get the offset of the scrollable panel
      offset.current.y = scrollableRef.current.scrollTop;
      offset.current.x = scrollableRef.current.scrollLeft;
    },

    /**
     * Callback when selection changes
     */
    onSelectionChange: (boxCoords) => {
      const scrollAwareBoxCoords = {
        ...boxCoords,
        top: boxCoords.top - offset.current.y + scrollableRef.current.scrollTop,
        left: boxCoords.left - offset.current.x + scrollableRef.current.scrollLeft,
      };
      const selectedIndexes = [];
      selectableItemCoords.current.forEach((itemCoords, index) => {
        if (boxesIntersect(scrollAwareBoxCoords, itemCoords)) {
          selectedIndexes.push(index);
        }
      });
      const fileIDs = [];
      selectableItems.current.forEach((item, index) => {
        if (selectedIndexes.includes(index)) {
          // Multiply by one to convert string to int
          fileIDs.push(item.getAttribute('data-id') * 1);
        }
      });
      // Check if the selection has changed before calling the onSelectionChange callback to prevent
      // a very large number of unnecessary calls
      if (mouseEvent && fileIDs.length !== lastFileIDs.length) {
        if (typeof props.onSelectionChange === 'function') {
          props.onSelectionChange(fileIDs, mouseEvent);
        }
        setLastFileIDs(fileIDs);
      }
    },

    /**
     * Props to pass to the selection box
     */
    selectionProps: {
      // CSS need to be defined as inline styles to override the default styles
      // Setting these in scss with !important does not work as there will be an ugly empty dashed box
      // before anything is selected
      style: {
        border: '1px dashed #999',
        backgroundColor: 'transparent',
        zIndex: 9000,
      },
    },

    /**
     * Whether to start selecting
     */
    shouldStartSelecting: (target) => {
      // Prevent start selecting if currently over an element or ancestor element with the data-draggable attribute
      // Will stop at the first element with the data-draggable attribute
      // Also prevent selecting if the target is outside the selectable area
      if (targetIsDraggable(target) || targetIsOutside(target)) {
        return false;
      }
      // Allow ancestor components to prevent selection
      if (typeof props.onShouldStartSelecting === 'function') {
        return props.onShouldStartSelecting(target);
      }
      return true;
    },

    isEnabled: props.isEnabled,
  });

  // Render
  // Note all of these divs are required for the drag selection to work properly when drag selecting
  // a large list of items which is scrollable
  // The css styles are required for functionality, rather than simply appearance, so they are
  // defined inline here, rather than in an scss file
  const scrollableStyle = {
    overflowY: 'auto',
    overflowX: 'clip',
    position: 'relative',
    height: '100%',
  };
  return <div
    onMouseDown={(evt) => handleMouseDown(evt)}
    ref={scrollableRef}
    style={{ ...scrollableStyle }}
  >
    <div style={{ height: '100%' }}>
      <DragSelection />
      <div
        ref={itemContainerRef}
        style={{ height: '100%' }}
      >
        { props.children }
      </div>
    </div>
  </div>;
}

Selectable.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  onMouseDownOverNonDraggable: PropTypes.func,
  onSelectionChange: PropTypes.func,
  onShouldStartSelecting: PropTypes.func,
};

export default Selectable;
