import React, { PropTypes } from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';

class HistoryItem extends SilverStripeComponent {

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
  id: PropTypes.number.isRequired,
  status: PropTypes.string,
  author: PropTypes.string,
  date: PropTypes.string,
  onClick: PropTypes.func,
};

export default HistoryItem;
