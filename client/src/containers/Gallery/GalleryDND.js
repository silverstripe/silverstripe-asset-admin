/* global window */
import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import GalleryItemDragLayer from 'components/GalleryItem/GalleryItemDragLayer';

let capturedManager = null;

// add middleware to capture the manager that is to be used
// eslint-disable-next-line new-cap
const context = DragDropContext((manager) => {
  capturedManager = manager;
  // eslint-disable-next-line new-cap
  return HTML5Backend(manager);
});

/**
 * Wrapper stateless component, this is primarily to apply the HOC for drag and drop
 */
class GalleryDND extends Component {
  componentDidMount() {
    // workaround for dropzone using `e.stopPropagation()` when a file is dropped to be uploaded
    window.addEventListener('drop', this.handleDrop, true);
  }

  componentWillUnmount() {
    window.removeEventListener('drop', this.handleDrop, true);
  }

  handleDrop() {
    const backend = capturedManager && capturedManager.backend;

    if (backend && backend.isDraggingNativeItem()) {
      backend.endDragNativeItem();
    }
  }

  render() {
    const {
      className,
      children,
    } = this.props;
    return (
      <div className={className}>
        {children}
        <GalleryItemDragLayer />
      </div>
    );
  }
}

GalleryDND.propTypes = {
  className: PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

export default context(GalleryDND);
