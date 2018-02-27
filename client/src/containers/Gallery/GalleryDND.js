/* global window */
import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import classnames from 'classnames';
import GalleryItemDragLayer from 'components/GalleryItem/GalleryItemDragLayer';

// add middleware to capture the manager that is to be used
// eslint-disable-next-line new-cap
const context = DragDropContext(HTML5Backend);

/**
 * Wrapper stateless component, this is primarily to apply the HOC for drag and drop
 */
class GalleryDND extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dragging: false,
    };
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('drop', this.handleDrop, true);
  }

  componentWillUpdate() {
    setTimeout(() => {
      if (!this.mounted) {
        return;
      }
      const manager = this.context.dragDropManager;
      // isDragging only updates after one render cycle, which makes this throttle necessary
      this.setState({ dragging: manager.monitor.isDragging() });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('drop', this.handleDrop, true);
  }

  handleDrop() {
    const manager = this.context.dragDropManager;
    const backend = manager && manager.backend;

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
      <div className={classnames(className, { 'gallery__main--dragging': this.state.dragging })}>
        {children}
        <GalleryItemDragLayer />
      </div>
    );
  }
}
GalleryDND.contextTypes = {
  dragDropManager: PropTypes.object,
};

GalleryDND.propTypes = {
  className: PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};

export default context(GalleryDND);
