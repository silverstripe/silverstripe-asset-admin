import React from 'react';
import PropTypes from 'prop-types';
import { useDndContext, useDroppable } from '@dnd-kit/core';

export default function droppable(Item) {
  function DroppableItem(props) {
    const { active } = useDndContext();
    const disableDrop = props.item.selected || props.item.id === active?.id;
    const { setNodeRef, isOver } = useDroppable({ id: props.item.id, disabled: disableDrop });
    const item = <Item isDropping={isOver} {...props} />;

    const setRef = (el) => {
      setNodeRef(el);
      // The ref used for keyboard navigation needs to be set on this element,
      // because the margin applied to it factors into the items per row calculation.
      if (typeof props.droppableSizeRef === 'function') {
        props.droppableSizeRef(el);
      }
    };

    return <div ref={setRef} className="gallery-item__droppable">{ item }</div>;
  }

  DroppableItem.propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }).isRequired,
  };

  return DroppableItem;
}
