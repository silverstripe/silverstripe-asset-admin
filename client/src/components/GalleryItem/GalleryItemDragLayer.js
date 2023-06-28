import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
import Badge from 'components/Badge/Badge';
import GalleryItem from './GalleryItem';

class GalleryItemDragLayer extends Component {
  getOffset() {
    const {
      offset,
      dragged,
    } = this.props;
    return {
      transform: offset && `translate(${offset.x + dragged.x}px, ${offset.y + dragged.y}px)`,
    };
  }

  render() {
    if (!this.props.isDragging) {
      return null;
    }
    const { item } = this.props;
    if (!item.selected) {
      return null;
    }
    const selectionCount = item.selected.length;
    const shadows = [
      selectionCount > 1
        ? <div key="1" className="gallery-item__drag-shadow" />
        : null,
      selectionCount > 2
        ? <div key="2" className="gallery-item__drag-shadow gallery-item__drag-shadow--second" />
        : null,
    ];

    return (
      <div className="gallery-item__drag-layer">
        <div className="gallery-item__drag-layer-item" style={this.getOffset()}>
          <div className="gallery-item__drag-layer-preview">
            {shadows}
            <GalleryItem {...item.props} isDragging />
          </div>
          {selectionCount > 1
            ? (
              <Badge
                className="gallery-item__drag-layer-count"
                status="info"
                message={`${selectionCount}`}
              />
            )
            : null
          }
        </div>
      </div>
    );
  }
}

GalleryItemDragLayer.propTypes = {
  item: PropTypes.object,
  offset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
  isDragging: PropTypes.bool.isRequired,
};

const collect = (monitor) => ({
  item: monitor.getItem(),
  offset: monitor.getInitialClientOffset(),
  dragged: monitor.getDifferenceFromInitialOffset(),
  isDragging: monitor.isDragging(),
});

// eslint-disable-next-line new-cap
export default DragLayer(collect)(GalleryItemDragLayer);
