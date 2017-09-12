import React, { PropTypes, Component } from 'react';

class HistoryItem extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.props.versionid);
    }
  }

  render() {
    let publishedLine = null;

    if (this.props.status === 'Published') {
      publishedLine = (<p><span className="history-item__status-flag">
        {this.props.status}</span> at {this.props.date_formatted}
      </p>);
    }

    return (
      // @todo wrap the contents in an `<a>` tag
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <li
        className="list-group-item history-item"
        onClick={this.handleClick}
      >
        <p>
          <span className="history-item__version">v.{this.props.versionid}</span>
          <span className="history-item__date">{this.props.date_ago} {this.props.author}</span>
          {this.props.summary}
        </p>
        {publishedLine}
      </li>
    );
  }
}


HistoryItem.propTypes = {
  versionid: PropTypes.number.isRequired,
  summary: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  status: PropTypes.string,
  author: PropTypes.string,
  date_formatted: PropTypes.string,
  date_ago: PropTypes.string,
  onClick: PropTypes.func,
};

export default HistoryItem;
