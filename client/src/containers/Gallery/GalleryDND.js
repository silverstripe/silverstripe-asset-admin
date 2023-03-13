/* global window */
import React, { Component } from 'react';
import classnames from 'classnames';
import GalleryItemDragLayer from 'components/GalleryItem/GalleryItemDragLayer';
import PropTypes from 'prop-types';
import context from 'lib/withDragDropContext';

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
    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('drop', this.handleDrop, true);
  }

  componentDidUpdate() {
    setTimeout(() => {
      if (!this.mounted || !this.context.dragDropManager) {
        return;
      }
      const manager = this.context.dragDropManager;
      // isDragging only updates after one render cycle, which makes this throttle necessary
      const dragging = manager.monitor.isDragging();
      if (this.state.dragging !== dragging) {
        this.setState({ dragging });
      }
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
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default context(GalleryDND);
