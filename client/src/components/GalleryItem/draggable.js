import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

export default function draggable(type) {
  const spec = {
    canDrag(props) {
      return props.canDrag;
    },
    beginDrag(props) {
      const { id } = props.item;
      if (typeof props.onDrag === 'function') {
        props.onDrag(true, id);
      }
      const selected = props.selectedFiles.concat([]);
      if (!selected.includes(id)) {
        selected.push(id);
      }

      return { selected, props };
    },
    endDrag(props) {
      const { id } = props.item;
      if (typeof props.onDrag === 'function') {
        props.onDrag(false, id);
      }
    },
  };

  const collect = (connect, monitor) => ({
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  });

  // eslint-disable-next-line new-cap
  const dragItem = DragSource(type, spec, collect);

  return (Item) => {
    class DraggableItem extends Component {
      componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        this.props.connectDragPreview(getEmptyImage(), {
          // IE fallback: specify that we'd rather screenshot the node
          // when it already knows it's being dragged so we can hide it with CSS.
          captureDraggingState: true,
        });
      }

      render() {
        const { connectDragSource } = this.props;
        const item = <Item {...this.props} />;

        if (typeof item.type === 'string') {
          return connectDragSource(item);
        }
        return connectDragSource(<div className="gallery-item__draggable">{ item }</div>);
      }
    }

    DraggableItem.propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      connectDragPreview: PropTypes.func.isRequired,
      item: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }).isRequired,
      onDrag: PropTypes.func,
      selectedFiles: PropTypes.arrayOf(PropTypes.number),
    };

    return dragItem(DraggableItem);
  };
}
