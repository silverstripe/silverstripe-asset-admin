import React from 'react';
import PropTypes from 'prop-types';

const HistoryItem = ({
  versionid,
  summary,
  status,
  author,
  // eslint-disable-next-line camelcase
  date_formatted,
  // eslint-disable-next-line camelcase
  date_ago,
  onClick
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (typeof onClick === 'function') {
      onClick(versionid);
    }
  };
  let publishedLine = null;
  if (status === 'Published') {
    publishedLine = (<p><span className="history-item__status-flag">
      {/* eslint-disable-next-line camelcase */}
      {status}</span> at {date_formatted}
    </p>);
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className="list-group-item history-item"
      onClick={handleClick}
    >
      <p>
        <span className="history-item__version">v.{versionid}</span>
        {/* eslint-disable-next-line camelcase */}
        <span className="history-item__date">{date_ago} {author}</span>
        {summary}
      </p>
      {publishedLine}
    </li>
  );
};

HistoryItem.propTypes = {
  versionid: PropTypes.number.isRequired,
  summary: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  status: PropTypes.string,
  author: PropTypes.string,
  // eslint-disable-next-line camelcase
  date_formatted: PropTypes.string,
  // eslint-disable-next-line camelcase
  date_ago: PropTypes.string,
  onClick: PropTypes.func,
};

export default HistoryItem;
