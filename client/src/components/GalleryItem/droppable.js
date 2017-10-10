import React, { Component, PropTypes } from 'react';
import { DropTarget } from 'react-dnd';

export default function droppable(types) {
  const spec = {
    drop(props, monitor) {
      if (monitor.canDrop()) {
        const item = monitor.getItem();
        props.onDropFiles(props.item.id, item.selected);
      }
    },
    canDrop(props, monitor) {
      const item = monitor.getItem();

      // check that it is not a folder by itself dragged onto itself
      return !item.selected.includes(props.item.id);
    },
  };

  const collect = (connect, monitor) => {
    const over = monitor.isOver();
    return {
      enlarged: over && monitor.canDrop(),
      connectDropTarget: connect.dropTarget(),
      isOver: over,
    };
  };

  // eslint-disable-next-line new-cap
  const dropItem = DropTarget(types, spec, collect);

  return (Item) => {
    class DroppableItem extends Component {
      render() {
        const { connectDropTarget } = this.props;
        const item = <Item {...this.props} />;

        if (typeof item.type === 'string') {
          return connectDropTarget(item);
        }
        return connectDropTarget(<div className="gallery-item__droppable">{ item }</div>);
      }
    }

    DroppableItem.propTypes = {
      connectDropTarget: PropTypes.func.isRequired,
      item: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
    };

    return dropItem(DroppableItem);
  };
}
