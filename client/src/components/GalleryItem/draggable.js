import React from 'react';
import PropTypes from 'prop-types';
import { useDraggable } from '@dnd-kit/core';

export default function draggable(Item, isKeyboardAccessible = true) {
  function DraggableItem(props) {
    const canDrag = typeof props.canDrag === 'boolean' ? props.canDrag : true;
    const draggableArgs = {
      disabled: !canDrag,
      id: props.item.id,
      data: { props }
    };
    // For complex dragging, it may be better to provide an alternative keyboard-accessible
    // way to perform the action rather than allowing keyboard drag-and-drop.
    if (!isKeyboardAccessible) {
      draggableArgs.attributes = {
        role: null,
        roleDescription: null,
        tabIndex: null,
      };
    }
    const { attributes, listeners, setNodeRef } = useDraggable(draggableArgs);
    const item = <Item {...props} />;

    // We don't want the screen reader drag/drop instructions if we're removing
    // keyboard accessible dragging.
    if (!isKeyboardAccessible) {
      delete attributes['aria-describedby'];
    }

    const setRef = (el) => {
      setNodeRef(el);
      // The ref used for keyboard navigation needs to be set on this element,
      // because the margin applied to it factors into the items per row calculation.
      if (typeof props.draggableSizeRef === 'function') {
        props.draggableSizeRef(el);
      }
    };

    return <div
      className="gallery-item__draggable"
      // The `data-draggable` attribute is used to denote to that as this is a "draggable" element
      // you should not start selecting on mousedown in Selectable.shouldStartSelecting()
      data-draggable="true"
      ref={setRef}
      {...listeners}
      {...attributes}
    >{ item }</div>;
  }

  DraggableItem.propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
    canDrag: PropTypes.bool,
  };

  return DraggableItem;
}
