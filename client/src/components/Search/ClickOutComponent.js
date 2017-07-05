import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

/**
 * Source: https://raw.githubusercontent.com/boblauer/react-onclickout/master/src/index.jsx
 *
 * Example:
 *
 * ```jsx
 *    class TestComponent extends React.Component {
 *      ...
 *
 *      handleClickOut(e) {
 *        ...
 *      }
 *
 *      render() {
 *        return (
 *          <ClickOutComponent onClickOut={this.handleClickOut} callerComponent={this}>
 *            <div>... </div>
 *          </ClickOutComponent>
 *        );
 *       }
 *    < /ClickOutComponent>
 *  ```
 */

class ClickOutComponent extends React.Component {

  componentDidMount() {
    let elTouchIsClick = true;
    let documentTouchIsClick = true;
    const el = ReactDOM.findDOMNode(this);

    this.__documentTouchStarted = () => {
      el.removeEventListener('click', this.__elementClicked);
      document.removeEventListener('click', this.__documentClicked);
    };

    this.__documentTouchMoved = () => {
      documentTouchIsClick = false;
    };

    this.__documentTouchEnded = (e) => {
      if (documentTouchIsClick) this.__documentClicked(e);
      documentTouchIsClick = true;
    };

    this.__documentClicked = (e) => {
      if ((e.__clickedElements || []).indexOf(el) !== -1) return;

      const clickOutHandler = this.props.onClickOut;
      clickOutHandler.call(this.props.callerComponent, e);
    };

    this.__elementTouchMoved = () => {
      elTouchIsClick = false;
    };

    this.__elementTouchEnded = (e) => {
      if (elTouchIsClick) this.__elementClicked(e);
      elTouchIsClick = true;
    };

    this.__elementClicked = (e) => {
      // eslint-disable-next-line no-param-reassign
      e.__clickedElements = e.__clickedElements || [];
      e.__clickedElements.push(el);
    };

    setTimeout(() => {
      if (this.__unmounted) return;
      this.toggleListeners('addEventListener');
    }, 0);
  }

  componentWillUnmount() {
    this.toggleListeners('removeEventListener');
    this.__unmounted = true;
  }

  toggleListeners(listenerMethod) {
    const el = ReactDOM.findDOMNode(this);

    el[listenerMethod]('touchmove', this.__elementTouchMoved);
    el[listenerMethod]('touchend', this.__elementTouchEnded);
    el[listenerMethod]('click', this.__elementClicked);

    document[listenerMethod]('touchstart', this.__documentTouchStarted);
    document[listenerMethod]('touchmove', this.__documentTouchMoved);
    document[listenerMethod]('touchend', this.__documentTouchEnded);
    document[listenerMethod]('click', this.__documentClicked);
  }

  render() {
    return Array.isArray(this.props.children) ?
      <div>{this.props.children}</div> :
      React.Children.only(this.props.children);
  }
}

ClickOutComponent.propTypes = {
  children: PropTypes.object,
  callerComponent: PropTypes.object.isRequired,
  onClickOut: PropTypes.func.isRequired,
};

export default ClickOutComponent;
