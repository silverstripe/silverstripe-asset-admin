import React, { PropTypes, Component } from 'react';
import { DragLayer } from 'react-dnd';
import GalleryItem from './GalleryItem';
import Badge from 'components/Badge/Badge';

class GalleryItemDragLayer extends Component {
  getOffset() {
    const offset = this.props.offset;
    return {
      transform: offset && `translate(${offset.x}px, ${offset.y}px)`,
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
    const selected = `${item.selected.length}`;

    return (
      <div className="gallery-item__drag-layer">
        <div className="gallery-item__drag-layer-item" style={this.getOffset()}>
          {selected > 1 && [
            <div key="1" className="gallery-item__drag-shadow" />,
            <div key="2" className="gallery-item__drag-shadow gallery-item__drag-shadow--second" />,
            <div key="3" className="gallery-item__drag-shadow gallery-item__drag-shadow--third" />,
          ]}
          <GalleryItem {...item.props} />
          {selected > 1 &&
            <Badge
              className="gallery-item__drag-layer-count"
              status="primary"
              message={selected}
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
  offset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
});

// eslint-disable-next-line new-cap
export default DragLayer(collect)(GalleryItemDragLayer);
