import React, { PropTypes, Component } from 'react';
import { DragLayer } from 'react-dnd';
import GalleryItem from './GalleryItem';
import Badge from 'components/Badge/Badge';

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
    const item = this.props.item;
    if (!item.selected) {
      return null;
    }
    const shadows = [
      <div key="1" className="gallery-item__drag-shadow" />,
      <div key="2" className="gallery-item__drag-shadow gallery-item__drag-shadow--second" />,
    ];

    return (
      <div className="gallery-item__drag-layer">
        <div className="gallery-item__drag-layer-item" style={this.getOffset()}>
          <div className="gallery-item__drag-layer-preview">
            {item.selected.length > 1 && shadows}
            <GalleryItem {...item.props} isDragging />
          </div>
          {item.selected.length > 1 &&
            <Badge
              className="gallery-item__drag-layer-count"
              status="info"
              message={`${item.selected.length}`}
            />
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
