import React, { Component, PropTypes } from 'react';
import Griddle from 'griddle-react';
import i18n from 'i18n';
import { galleryViewPropTypes, galleryViewDefaultProps } from 'containers/Gallery/Gallery';
import { fileSize } from 'lib/DataFormat';

class TableView extends Component {
  constructor(props) {
    super(props);

    this.getColumns = this.getColumns.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleSetPage = this.handleSetPage.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
    this.renderTitle = this.renderTitle.bind(this);
    this.renderNoItemsNotice = this.renderNoItemsNotice.bind(this);

    this.state = {
      // TODO remove `enableSort` state when Griddle is version bumped up from 0.7.0
      enableSort: false,
    };
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      enableSort: true,
    });
  }

  componentWillUnmount() {
    this.setState({
      enableSort: false,
    });
  }

  /**
   * Get the columns to display for this table view, could be stored in state in future
   *
   * @returns {Array} columns
   */
  getColumns() {
    const columns = [
      'thumbnail',
      'title',
      'size',
      'lastEdited',
    ];

    if (this.props.selectableItems) {
      columns.unshift('selected');
    }

    return columns;
  }

  /**
   * Configuration for columns, handles formatting and whether they're sortable
   *
   * @returns {array} configItems
   */
  getColumnConfig() {
    return [
      {
        columnName: 'selected',
        sortable: false,
        displayName: '',
        cssClassName: 'gallery__table-column--select',
        customComponent: this.renderSelect,
      },
      {
        columnName: 'thumbnail',
        sortable: false,
        displayName: '',
        cssClassName: 'gallery__table-column--image',
        customComponent: this.renderThumbnail,
      },
      {
        columnName: 'title',
        customCompareFn: () => (0), // Suppress griddle re-sorting
        cssClassName: 'gallery__table-column--title',
        customComponent: this.renderTitle,
      },
      {
        columnName: 'lastEdited',
        displayName: 'Modified',
        customComponent: this.renderDate,
      },
      {
        columnName: 'size',
        sortable: false,
        displayName: 'Size',
        cssClassName: 'sort--disabled',
        customComponent: this.renderSize,
      },
    ];
  }

  getRowMetadata(rowData) {
    return `gallery__table-row ${rowData.highlighted ? 'gallery__table-row--highlighted' : ''}`;
  }

  /**
   * Returns the properties for the table view
   *
   * @returns {object}
   */
  getTableProps() {
    const [sortColumn, sortDirection] = this.props.sort.split(',');

    return {
      tableClassName: 'gallery__table table table-hover',
      gridClassName: 'gallery__main-view--table',
      rowMetadata: {
        bodyCssClassName: this.getRowMetadata,
      },
      sortAscendingComponent: '',
      sortDescendingComponent: '',
      useExternal: true,
      externalSetPage: this.handleSetPage,
      externalChangeSort: this.handleSort,
      // noops for now as they aren't needed yet
      externalSetFilter: () => null,
      externalSetPageSize: () => null,
      externalCurrentPage: this.props.page - 1,
      externalMaxPage: Math.ceil(this.props.totalCount / this.props.limit),
      externalSortColumn: sortColumn,
      // TODO change to `sortDirection === 'asc'` when Griddle is version bumped up from 0.7.0
      // reference: https://github.com/GriddleGriddle/Griddle/pull/515
      externalSortAscending: (!this.state.enableSort)
        ? sortDirection !== 'asc'
        : sortDirection === 'asc',
      initialSort: sortColumn,
      columns: this.getColumns(),
      columnMetadata: this.getColumnConfig(),
      useGriddleStyles: false,
      onRowClick: this.handleRowClick,
      // TODO will need to request upstream to stop their internal sorting to show folders first
      results: this.props.files,
      customNoDataComponent: this.renderNoItemsNotice,
    };
  }

  /**
   * Handles activating either the folder or file, depending on type
   *
   * @param {Event} event
   * @param {object} item
   */
  handleActivate(event, item) {
    if (item.type === 'folder') {
      this.props.onOpenFolder(event, item);
    } else {
      this.props.onOpenFile(event, item);
    }
  }

  /**
   * Handles when a row (really, a column) is clicked and determines what action to take.
   * By default it'll active the item for the row
   *
   * @param {object} row
   * @param {Event} event
   */
  handleRowClick(row, event) {
    const item = row.props.data;

    // if this column is for selecting, then it'll be better experience to select than activate
    if (event.currentTarget.classList.contains('gallery__table-column--select')) {
      event.stopPropagation();
      event.preventDefault();
      if (typeof this.props.onSelect === 'function') {
        this.props.onSelect(event, item);
        return;
      }
    }

    this.handleActivate(event, item);
  }

  /**
   * Handles setting the sorted column and direction that sorting is happening
   *
   * @param {string} column
   * @param {boolean} ascending
   */
  handleSort(column, ascending) {
    const direction = (ascending) ? 'asc' : 'desc';

    // TODO hide while loading or pull request upstream to not setState()
    // the ad-hoc sorting looks bad
    if (this.state.enableSort) {
      this.props.onSort(`${column},${direction}`);
    }
  }

  /**
   * Handles setting the pagination to a different page
   *
   * @param {number} page
   */
  handleSetPage(page) {
    // Convert 0-based to 1-based
    this.props.onSetPage(page + 1);
  }

  /**
   * Avoids the browser's default focus state when selecting an item.
   *
   * @param {Event} event Event object.
   */
  preventFocus(event) {
    event.preventDefault();
  }

  /**
   * Show a "no items" warning, unless the data is still loading.
   *
   * @returns {XML}
   */
  renderNoItemsNotice() {
    if (this.props.files.length === 0 && !this.props.loading) {
      return <p className="gallery__no-item-notice">{i18n._t('AssetAdmin.NOITEMSFOUND')}</p>;
    }

    return null;
  }

  /**
   * Renders the content for size, formatting the raw size value to look nicer
   *
   * @param {object} props
   * @returns {Component|null}
   */
  renderSize(props) {
    if (props.rowData.type === 'folder') {
      return null;
    }
    const description = fileSize(props.data);

    return (
      <span>{description}</span>
    );
  }

  /**
   * Renders the progressbar for a given row
   *
   * @param rowData
   * @returns {XML|null}
   */
  renderProgressBar(rowData) {
    if (!rowData.uploading || (rowData.message && rowData.message.type === 'error')) {
      return null;
    }
    if (rowData.id > 0) {
      return (
        <div className="gallery__progress-bar--complete" />
      );
    }
    const progressBarProps = {
      className: 'gallery__progress-bar-progress',
      style: {
        width: `${rowData.progress}%`,
      },
    };

    return (
      <div className="gallery__progress-bar">
        <div {...progressBarProps} />
      </div>
    );
  }

  /**
   * Renders the title for the row/item, includes a progress bar if appropriate for uploading
   *
   * @param {object} props
   * @returns {XML}
   */
  renderTitle(props) {
    const progress = this.renderProgressBar(props.rowData);

    return (
      <div className="fill-width">
        <div className="flexbox-area-grow">{props.data}</div>
        {progress}
      </div>
    );
  }

  /**
   * Renders the checkbox for selecting the row/item in the table view
   *
   * @param {object} props
   * @returns {Component}
   */
  renderSelect(props) {
    return (
      <input
        type="checkbox"
        title={i18n._t('AssetAdmin.SELECT')}
        checked={props.data}
        tabIndex="-1"
        onMouseDown={this.preventFocus}
      />
    );
  }

  /**
   * Renders the dates for the row/item in the table view.
   * Hides the column if it is for a folder
   *
   * @param {object} props
   * @returns {Component|null}
   */
  renderDate(props) {
    if (props.rowData.type === 'folder') {
      return null;
    }
    // TODO format this properly with something like moment.js
    return <span>{props.data}</span>;
  }

  /**
   * Renders the thumbnail for the row/item in the table view.
   * Shows an error box if no url was defined.
   *
   * @param {object} props
   * @returns {Component}
   */
  renderThumbnail(props) {
    const url = props.data || props.rowData.url;
    const uploading = props.rowData.uploading;
    const category = props.rowData.category || 'false';
    const baseClass = 'gallery__table-image';
    const classNames = [baseClass];
    const styles = {};

    classNames.push(`${baseClass}--${category}`);

    if (category === 'image' && url) {
      styles.backgroundImage = `url("${url}")`;
    }

    // If the url is falsey then show error on the thumbnail. The exception is
    // folder since it doesn't have to physically exist on the file system
    if (!uploading && !url && category !== 'folder') {
      classNames.push(`${baseClass}--error`);
    }

    return (
      <div className={classNames.join(' ')} style={styles} />
    );
  }

  render() {
    return <Griddle {...this.getTableProps()} />;
  }
}

TableView.defaultProps = galleryViewDefaultProps;

TableView.propTypes = {
  ...galleryViewPropTypes,
  sort: PropTypes.string.isRequired,
};

export { TableView as Component };

export default TableView;
