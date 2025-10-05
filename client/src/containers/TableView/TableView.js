/* eslint-disable import/no-cycle */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import i18n from 'i18n';
import moment from 'moment';
import Paginator from 'components/Paginator/Paginator';
import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';
import VersionedBadge from 'components/VersionedBadge/VersionedBadge';
import { galleryViewPropTypes, galleryViewDefaultProps } from 'containers/Gallery/Gallery';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

function TableView(_props) {
  const props = { ...galleryViewDefaultProps, ..._props };

  function columnIsSortable(columnId) {
    return ['title', 'lastEdited'].includes(columnId);
  }

  /**
   * Handles when a cell is clicked and determines what action to take.
   * By default it'll active the item for the row
   */
  function handleCellClick(row, cell, evt) {
    const rowData = row.original;
    // if this column is for selecting, let the label/checkbox control it instead.
    if (cell.column.id === 'selected') {
      return;
    }
    // Open the folder or file edit form
    if (rowData.type === 'folder') {
      props.onOpenFolder(evt, rowData);
    } else {
      props.onOpenFile(evt, rowData);
    }
  }

  /**
   * Handles selecting a row
   */
  function handleSelect(rowData, evt) {
    if (typeof props.onSelect === 'function') {
      props.onSelect(evt, rowData);
    }
  }

  /**
   * Handles setting the sorted column and direction that sorting is happening
   */
  function handleSort(header) {
    const columnId = header.column.id;
    if (!columnIsSortable(columnId)) {
      return;
    }
    const ascending = props.sort !== `${columnId},asc`;
    const direction = ascending ? 'asc' : 'desc';
    props.onSort(`${columnId},${direction}`);
  }

  /**
   * Handles setting the pagination to a different page
   */
  function handleSetPage(page) {
    // Convert 0-based to 1-based
    props.onSetPage(page);
  }

  /**
   * Get the sort order of the current column (ascending, descending, or null)
   */
  function getSortOrder(column) {
    const [sortColumn, sortDirection] = props.sort.split(',');
    if (sortColumn === column) {
      return `${sortDirection}ending`;
    }
    return null;
  }

  /**
   * Renders the content for size, formatting the raw size value to look nicer
   */
  function renderSize(rowData) {
    if (rowData.type === 'folder') {
      return null;
    }
    return <span>{rowData.size}</span>;
  }

  /**
   * Renders the content for the status column
   */
  function renderStatus(rowData) {
    let flags = [];
    if (rowData.type !== 'folder') {
      if (rowData.draft) {
        flags.push({
          key: 'status-draft',
          status: 'draft',
          className: 'status-addedtodraft',
        });
      } else if (rowData.modified) {
        flags.push({
          key: 'status-modified',
          status: 'modified',
          className: 'status-modified',
        });
      }
    }
    flags = flags.map(({ ...attributes }) => <VersionedBadge {...attributes} />);
    return flags ? <span>{flags}</span> : null;
  }

  /**
   * Renders the progressbar for a given row
   */
  function renderProgressBar(rowData) {
    if (!rowData.queuedId || (rowData.message && rowData.message.type === 'error')) {
      return null;
    }
    if (rowData.id > 0) {
      return (
        <div className="gallery__progress-bar--complete" aria-hidden="true" />
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

  function renderRestrictedAccess(rowData) {
    const { hasRestrictedAccess } = rowData;
    const attrs = {
      fileID: rowData.id,
      placement: 'top',
      hasRestrictedAccess
    };
    return <FileStatusIcon {...attrs} />;
  }

  function renderTrackedFormUpload(rowData) {
    const { isTrackedFormUpload, hasRestrictedAccess } = rowData;
    const attrs = {
      fileID: rowData.id,
      placement: 'top',
      isTrackedFormUpload,
      hasRestrictedAccess
    };
    return <FileStatusIcon {...attrs} />;
  }

  /**
   * Renders the title for the row/item, includes a progress bar if appropriate for uploading
   */
  function renderTitle(rowData) {
    const progress = renderProgressBar(rowData);
    return <div className="fill-width">
      <div className="flexbox-area-grow">
        <span>{rowData.title}</span>
        {rowData.hasRestrictedAccess && renderRestrictedAccess(rowData)}
        {rowData.isTrackedFormUpload && renderTrackedFormUpload(rowData)}
      </div>
      {progress}
    </div>;
  }

  /**
   * Renders the checkbox for selecting the row/item in the table view
   */
  function renderSelect(rowData, rowId) {
    if (props.selectableItems && (props.selectableFolders || rowData.type !== 'folder')) {
      const checkboxProps = {
        type: 'checkbox',
        title: i18n._t('AssetAdmin.SELECT'),
        checked: rowData.selected,
        onChange: (evt) => handleSelect(rowData, evt),
      };
      const maxSelected = (
        ![null, 1].includes(props.maxFilesSelect) &&
        props.selectedFiles.length >= props.maxFilesSelect
      );
      if (maxSelected && !rowData.selected) {
        checkboxProps.disabled = true;
      }
      // Have to disable the linting rule because for some reason the linter doesn't realise
      // there's an input inside the label, which is perfectly valid per the linter's own docs.
      // Label is there to allow selecting the checkbox by clicking anywhere inside the cell.
      // eslint-disable-next-line jsx-a11y/label-has-associated-control
      return <label>
        <input {...checkboxProps} aria-labelledby={`row-${rowId}-title row-${rowId}-status`} />
      </label>;
    }
    return null;
  }

  /**
   * Renders the dates for the row/item in the table view.
   * Hides the column if it is for a folder
   */
  function renderLastEdited(rowData) {
    if (rowData.type === 'folder') {
      return null;
    }
    moment.locale(i18n.detectLocale());
    return <span>{ moment(rowData.lastEdited).format('L LT') }</span>;
  }

  /**
   * Renders the thumbnail for the row/item in the table view.
   * Shows an error box if no url was defined.
   */
  function renderThumbnail(rowData, row, cell) {
    const url = rowData.url;
    const category = rowData.category || 'false';
    const baseClass = 'gallery__table-image';
    const classNames = [baseClass];
    const styles = {};
    let errorMsg = null;
    if (rowData.message?.type === 'error') {
      errorMsg = rowData.message.value;
    }
    if (errorMsg) {
      classNames.push(`${baseClass}--error`);
    } else {
      classNames.push(`${baseClass}--${category}`);
      if (category === 'image' && url) {
        styles.backgroundImage = `url("${url}")`;
      }
    }
    const content = <div title={errorMsg} aria-label={errorMsg} className={classNames.join(' ')} style={styles} />;
    if (errorMsg) {
      return content;
    }
    // We add a button to this element so keyboard users have a way to open the edit form
    // without having to select the item and navigating to the actions panel.
    return <button className="btn gallery__table-image__btn" onClick={(evt) => handleCellClick(row, cell, evt)} aria-label={i18n._t('AssetAdmin.EDIT', 'Edit')}>
      {content}
    </button>;
  }

  /**
   * Returns the CSS class for a row, based on the rowData
   */
  function getTrClassName(row) {
    const rowData = row.original;
    return `gallery__table-row ${rowData.highlighted ? 'gallery__table-row--highlighted' : ''}`;
  }

  /**
   * Returns the CSS class for a cell, for both header and body cells
   */
  function getCellClassName(cell, isHeader) {
    const ret = ['gallery__table-column__header'];
    const columnId = cell.column.id;
    if (isHeader) {
      const sortOrder = getSortOrder(columnId);
      if (sortOrder) {
        ret.push(`sort-${sortOrder}`);
      }
      if (columnIsSortable(columnId)) {
        ret.push('gallery__table-column__header--sortable');
      }
    }
    if (columnId === 'selected') {
      ret.push('gallery__table-column--select');
    } else if (columnId === 'thumbnail') {
      ret.push('gallery__table-column--image');
    } else if (columnId === 'title') {
      ret.push('gallery__table-column--title');
    } else if (columnId === 'lastEdited') {
      ret.push('gallery__table-column--modified');
    }
    return ret.join(' ');
  }

  /**
   * Renders the content for a th table header
   */
  function renderHeaderContent(header) {
    const label = header.column.columnDef.header;
    if (columnIsSortable(header.column.id)) {
      // The "font-icon-" class is intentional. It adds the necessary CSS for adding an icon.
      // The actual icon itself is added through explicit CSS depending on how the column's sorted.
      return <button onClick={() => handleSort(header)} className="btn gallery__table-column__sort-button">
        <span className="gallery__table-column__label">{label}</span>
        <span className="gallery__table-column__sort-icon font-icon-" aria-hidden="true" />
      </button>;
    }
    return label;
  }

  /**
   * Renders the content for a td table cell
   */
  function renderCellContent(cell) {
    return flexRender(cell.column.columnDef.cell, cell.getContext());
  }

  function renderPaginator() {
    return <Paginator
      totalItems={props.totalCount}
      maxItemsPerPage={props.limit}
      currentPage={props.page}
      onChangePage={(page) => handleSetPage(page)}
    />;
  }

  // Column configuration for react-table
  const columnConfig = [
    {
      id: 'thumbnail',
      header: '',
      cell: (info) => renderThumbnail(info.getValue(), info.row, info.cell),
    },
    {
      id: 'title',
      header: i18n._t('File.TITLE', 'Title'),
      cell: (info) => renderTitle(info.getValue()),
    },
    {
      id: 'status',
      header: i18n._t('File.STATUS', 'Status'),
      cell: (info) => renderStatus(info.getValue()),
    },
    {
      id: 'size',
      header: i18n._t('File.SIZE', 'Size'),
      cell: (info) => renderSize(info.getValue()),
    },
    {
      id: 'lastEdited',
      header: i18n._t('File.MODIFIED', 'Modified'),
      cell: (info) => renderLastEdited(info.getValue()),
    },
  ];
  if (props.selectableItems) {
    columnConfig.unshift({
      id: 'selected',
      header: '',
      cell: (info) => renderSelect(info.getValue(), info.row.id),
    });
  }

  const columnHelper = createColumnHelper();
  // Memoising columns means the table doesn't get rebuilt unnecessarily.
  // This was causing problems when selecting a checkbox with the keyboard
  // - it would rebuild the whole table and that would cause the focus to be lost.
  const columns = useMemo(() => columnConfig.map(config => columnHelper.accessor(row => row, config)), [props.selectableItems]);
  const table = useReactTable({
    data: props.files,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // render
  if (props.files.length === 0) {
    if (!props.loading) {
      // Show a "no items" notice if there are no items to display
      return <p className="gallery__no-item-notice">{i18n._t('AssetAdmin.NOITEMSFOUND')}</p>;
    }
  } else {
    return <table className="gallery__table table table-hover">
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                className={getCellClassName(header, true)}
                aria-sort={getSortOrder(header.column.id)}
              >
                {renderHeaderContent(header)}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr
            key={row.id}
            id={`row-${row.id}`}
            className={getTrClassName(row)}
          >
            {row.getVisibleCells().map(cell => (
              <td
                id={`row-${row.id}-${cell.column.columnDef.id}`}
                key={cell.id}
                onClick={(evt) => handleCellClick(row, cell, evt)}
                className={getCellClassName(cell, false)}
              >
                {renderCellContent(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={columnConfig.length}>{renderPaginator()}</td>
        </tr>
      </tfoot>
    </table>;
  }
}

TableView.propTypes = {
  ...galleryViewPropTypes,
  sort: PropTypes.string.isRequired,
};

export { TableView as Component };

export default TableView;
