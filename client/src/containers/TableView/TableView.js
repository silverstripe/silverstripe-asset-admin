/* eslint-disable import/no-cycle */
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
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
  // The roving state determines which item should have the roving tab index.
  // Focus doesn't actually move unless doSetFocus is set to true.
  const [rovingRowIndex, setRovingRowIndex] = useState(null);
  const [rovingColIndex, setRovingColIndex] = useState(null);
  const [doSetFocus, setDoSetFocus] = useState(false);
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const cellRefs = useRef([]);

  /**
   * Get the props that need to be tracked in prevPropsRef
   */
  function getPropsToTrack() {
    return {
      page: props.page,
      folderId: props.folderId,
      files: props.files,
      openFileId: props.openFileId,
      totalCount: props.totalCount,
    };
  }

  // We need to keep track of changes in specific props to ensure the above refs
  // are kept clean of stale references and ensure the correct item has focus.
  // Because lots of related changes need to be done in a single effect,
  // we can't rely on the dependencies array alone to tell us what changed.
  const prevPropsRef = useRef(getPropsToTrack());

  /**
   * Determines if two files or folders represent the same record.
   * If either item doesn't exist, they're not the same.
   * If both items have an ID, that is used as the identifier.
   * If both items have a queued ID (e.g. uploaded files), we can fall back on that.
   */
  function filesAreIdentical(item1, item2) {
    if (!item1 || !item2) {
      return false;
    }
    if (item1.id && item2.id) {
      return item1.id === item2.id;
    }
    if (item1.queuedId && item2.queuedId) {
      return item1.queuedId === item2.queuedId;
    }
    return false;
  }

  /**
   * Checks if two arrays of file data contain the same items.
   * This is based on the ID and QueuedID only, since these are the
   * properties that identify unique items.
   */
  function fileArraysAreIdentical(arrA, arrB) {
    // First, check if the lengths are equal. If not, they are not identical.
    if (arrA.length !== arrB.length) {
      return false;
    }
    // Check if there are any files in one array which aren't present in the other.
    // If there's no descrepencies, we return true.
    return arrA.every(itemA => arrB.some(itemB => filesAreIdentical(itemA, itemB)));
  }

  // IMPORTANT
  // A lot of the logic here is similar to logic in ThumbnailView.
  // If a change is needed (e.g. to resolve a bug), make sure you check both views!
  useEffect(() => {
    const prevProps = prevPropsRef.current;
    // If we changed page or are looking at a different folder, throw away the old refs
    // and reset focus, and skip the rest of the logic in this lifecycle event.
    if (prevProps.page !== props.page || prevProps.folderId !== props.folderId) {
      // If the files arrays are still identical, the navigation hasn't finished yet, so defer changes for now.
      if (fileArraysAreIdentical(prevProps.files, props.files)) {
        return;
      }
      // If files arrays differ, navigation has completed. We can clean up now.
      rowRefs.current = [];
      cellRefs.current = [];
      setRovingRowIndex(null);
      setRovingColIndex(null);
      setDoSetFocus(false);
      gridRef.current?.focus();
      prevPropsRef.current = getPropsToTrack();
      return;
    }

    // Set focus in an effect so we know the DOM has been updated first
    // since effects happen after rendering.
    if (doSetFocus) {
      setDoSetFocus(false);
      if (rovingColIndex === null) {
        rowRefs.current[rovingRowIndex]?.focus();
      } else {
        cellRefs.current[rovingRowIndex][rovingColIndex]?.focus();
      }
    }

    // If we removed a file or folder, we have some tidy-up to do.
    if (props.totalCount < prevProps.totalCount || props.files.length < prevProps.files.length) {
      // If we have less files/folders than we used to, make sure to remove the extra refs
      // Note that all the refs are correct, there's just some extra old ones at the end of
      // the arrays.
      if (props.files.length === 0) {
        rowRefs.current = [];
        cellRefs.current = [];
        setRovingColIndex(null);
        setRovingRowIndex(null);
        setDoSetFocus(false);
        // Move focus to the grid to avoid losing it altoghether.
        gridRef.current?.focus();
      } else {
        rowRefs.current = rowRefs.current.slice(0, props.files.length);
        cellRefs.current = cellRefs.current.slice(0, props.files.length);
        // If we removed the focused item, we need to apply focus to a new item
        if (rovingRowIndex !== null) {
          const lastRowIndex = rowRefs.current.length - 1;
          if (rovingRowIndex > lastRowIndex) {
            // If the previously focused item had a higher index than our highest index,
            // just focus on the last item.
            setRovingColIndex(null);
            setRovingRowIndex(lastRowIndex);
            setDoSetFocus(true);
          } else {
            // otherwise focus on the relevant cell or row that occupies the same slot
            // as the previously focused item
            setDoSetFocus(true);
          }
        }
      }
    }

    // If we added a folder or file, move focus to the first new item
    if (props.totalCount > prevProps.totalCount || props.files.length > prevProps.files.length) {
      // The index in the table should be the same as the index in the files array
      const newRowIndex = props.files.findIndex((item) => !prevProps.files.some((oldItem) => filesAreIdentical(item, oldItem)));
      if (newRowIndex > -1) {
        setRovingRowIndex(newRowIndex);
        setRovingColIndex(null);
        // If we added a new folder, the edit form should retain focus, otherwise move focus to the new item.
        const newItem = props.files[newRowIndex];
        if (newItem.category === 'folder') {
          setDoSetFocus(false);
        } else {
          setDoSetFocus(true);
        }
      }
    }

    // For successful uploads, when the file gets assigned a new ID it also moves from the top of
    // the table to the appropriate spot in the table. We need to make sure we retain focus on the
    // item.
    // Note we're relying on the index in the table being the same as the index in the files array.
    const prevFocusedItem = prevProps.files[rovingRowIndex] ?? null;
    const currentFocusedItem = props.files[rovingRowIndex] ?? null;
    if (rovingRowIndex !== null
      && prevFocusedItem?.queuedId
      && props.totalCount === prevProps.totalCount
      && !filesAreIdentical(prevFocusedItem, currentFocusedItem)
    ) {
      const newRowIndex = props.files.findIndex((item) => filesAreIdentical(prevFocusedItem, item));
      if (newRowIndex > -1 && newRowIndex !== rovingRowIndex) {
        // Note we don't reset the cell index, since we're just keeping the roving tabindex on the same record when the record moves.
        setRovingRowIndex(newRowIndex);
        setDoSetFocus(false);
        // It is important that focus change only happens if a different file already has its form open.
        // Otherwise, we have a race condition between moving focus into the newly opened form for the new item
        // and moving focus with the newly uploaded file.
        if (prevProps.openFileId && prevProps.openFileId !== prevFocusedItem?.id) {
          setDoSetFocus(true);
        }
      }
    }

    // If a file edit form gets closed, focus back inside the grid.
    if (prevProps.openFileId && !props.openFileId) {
      setDoSetFocus(true);
      // If we don't have the roving index set, make sure it's set
      // in a sensible place.
      if (rovingRowIndex === null) {
        if (props.files.length) {
          setRovingColIndex(null);
          setRovingRowIndex(0);
        } else {
          gridRef.current.focus();
          setDoSetFocus(false);
        }
      }
    }

    prevPropsRef.current = getPropsToTrack();
  }, [...Object.values(getPropsToTrack()), rovingColIndex, rovingRowIndex, doSetFocus]);

  function columnIsSortable(columnId) {
    return ['title', 'lastEdited'].includes(columnId);
  }

  function columnIsDecorative(columnId) {
    // The "thumbnail" column is decorative because it's just a visual representation of the row.
    // The "selected" is decorative because the actual click event that controls selection is
    // handled through events on the row for keyboard users, so screen readers don't need to know
    // about the individual cell that visually represents the selection state.
    return ['thumbnail', 'selected'].includes(columnId);
  }

  /**
   * Returns true if a file is in the process of being uploaded (or has failed)
   */
  function rowIsUploading(rowData) {
    return rowData.queuedId && !rowData.id;
  }

  /**
   * Returns true if the file has an error (e.g. from a failed upload)
   */
  function rowHasError(rowData) {
    return rowData.message?.type === 'error';
  }

  /**
   * Get the adjusted column index for the given cell
   *
   * We subtract 2 from the index to account for the two decorative columns.
   * This ensures we still have a 0-indexed array which makes it easier to deal with.
   */
  function getColumnIndex(cell) {
    return cell.column.getIndex() - 2;
  }

  /**
   * Filtering by folder type
   */
  function folderFilter(file) {
    return file.type === 'folder';
  }

  /**
   * Filtering by non-folder types
   */
  function fileFilter(file) {
    return file.type !== 'folder';
  }

  /**
   * Handles keyboard events for navigating between rows
   */
  function handleNavigateKeyDownOnRow(row, event) {
    const lastIndex = rowRefs.current.length - 1;
    switch (event.key) {
      case 'ArrowUp':
        // Move to the next row up if there is one
        if (row.index > 0) {
          setRovingRowIndex(row.index - 1);
          setRovingColIndex(null);
          setDoSetFocus(true);
        }
        break;
      case 'ArrowDown':
        // Move to the next row down if there is one
        if (rowRefs.current.length > row.index + 1) {
          setRovingRowIndex(row.index + 1);
          setRovingColIndex(null);
          setDoSetFocus(true);
        }
        break;
      case 'ArrowRight':
        // Move focus to the first cell in this row
        setRovingColIndex(0);
        setRovingRowIndex(row.index);
        setDoSetFocus(true);
        break;
      case 'Home':
        // Move to the first row if not there already
        if (row.index > 0) {
          setRovingRowIndex(0);
          setRovingColIndex(null);
          setDoSetFocus(true);
        }
        break;
      case 'End':
        // Move to the last row if not there already
        if (row.index < lastIndex) {
          setRovingRowIndex(lastIndex);
          setRovingColIndex(null);
          setDoSetFocus(true);
        }
        break;
      default:
        // no-op
    }
  }

  /**
   * Handles keyboard events for navigating between cells
   */
  function handleNavigateKeyDownOnCell(cell, event) {
    const rowIndex = cell.row.index;
    const colIndex = getColumnIndex(cell);
    const lastColIndex = cellRefs.current[rowIndex].length - 1;
    switch (event.key) {
      case 'ArrowUp':
        // Move up a row if there is one, but stay in this column
        if (rowIndex > 0) {
          setRovingColIndex(colIndex);
          setRovingRowIndex(rowIndex - 1);
          setDoSetFocus(true);
        }
        break;
      case 'ArrowDown':
        // Move down a row if there is one, but stay in this column
        if (rowRefs.current.length > rowIndex + 1) {
          setRovingColIndex(colIndex);
          setRovingRowIndex(rowIndex + 1);
          setDoSetFocus(true);
        }
        break;
      case 'ArrowLeft':
        // Move focus to the column to the left, if there is one
        if (colIndex > 0) {
          setRovingColIndex(colIndex - 1);
          setRovingRowIndex(rowIndex);
          setDoSetFocus(true);
        } else {
          // Move focus to the row as a whole
          setRovingColIndex(null);
          setRovingRowIndex(rowIndex);
          setDoSetFocus(true);
        }
        break;
      case 'ArrowRight':
        // Move focus to the column to the right, if there is one
        if (cellRefs.current[rowIndex].length > colIndex + 1) {
          setRovingColIndex(colIndex + 1);
          setRovingRowIndex(rowIndex);
          setDoSetFocus(true);
        }
        break;
      case 'Home':
        if (colIndex > 0) {
          setRovingColIndex(0);
          setRovingRowIndex(rowIndex);
          setDoSetFocus(true);
        }
        break;
      case 'End':
        if (colIndex < lastColIndex) {
          setRovingColIndex(lastColIndex);
          setRovingRowIndex(rowIndex);
          setDoSetFocus(true);
        }
        break;
      default:
        // no-op
    }
  }

  /**
   * Handles keyboard events to move from the grid itself onto rows in the grid.
   */
  function handleNavigateKeyDownOnGrid(event) {
    // If there's no rows, don't move focus off the grid
    if (!rowRefs.current.length) {
      return;
    }
    const lastRowIndex = rowRefs.current.length - 1;
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Home':
        // For either the up, down, or home button, focus on the first row
        setRovingColIndex(null);
        setRovingRowIndex(0);
        setDoSetFocus(true);
        break;
      case 'End':
        // Focus on the last row when end is pressed
        setRovingColIndex(null);
        setRovingRowIndex(lastRowIndex);
        setDoSetFocus(true);
        break;
      default:
        // no-op
    }
  }

  /**
   * Handles keyboard events for cells and rows
   */
  function handleKeyDown(row, cell, event) {
    // If the keydown isn't for a row or cell, and isn't on an explicit
    // table, don't do anything.
    if (!row && !cell && event.target?.nodeName !== 'TABLE') {
      return;
    }
    const rowData = row?.original;
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        if (cell) {
          handleNavigateKeyDownOnCell(cell, event);
        } else if (row) {
          handleNavigateKeyDownOnRow(row, event);
        } else {
          handleNavigateKeyDownOnGrid(event);
        }
        break;
      case 'Enter':
        if (cell) {
          // Don't do anything when focused on a cell.
          // This allows us to add specific actions to cells later on
          // as well as keeping consistency with other data grids
          break;
        } else if (!row) {
          // If we're on a table, don't stop propagation
          // or prevent default.
          return;
        }
        // Open the file/folder
        if (rowData.type === 'folder') {
          props.onOpenFolder(event, rowData);
        } else if (rowIsUploading(rowData)) {
          // If a file is being uploaded, you can cancel an upgrade in progress
          // or remove the failed upload.
          if (rowHasError(rowData)) {
            props.onRemoveErroredUpload(rowData);
          } else if (props.onCancelUpload) {
            props.onCancelUpload(rowData);
          }
        } else {
          props.onOpenFile(event, rowData);
        }
        break;
      case ' ':
        if (cell) {
          // Don't do anything when focused on a cell.
          break;
        }
        if (!row) {
          // If we're on a table, don't stop propagation
          // or prevent default.
          return;
        }
        // Select the file/folder
        if (typeof props.onSelect === 'function') {
          props.onSelect(event, rowData);
        }
        break;
      default:
        // Don't stop propagation or prevent default
        // for keys we're not explicitly handling.
        return;
    }
    event.stopPropagation();
    event.preventDefault();
  }

  /**
   * Handles when a cell is clicked and determines what action to take.
   * By default it'll active the item for the row
   */
  function handleCellClick(row, cell, evt) {
    const rowData = row.original;
    // if this column is for selecting, then it'll be better experience to select than activate
    if (cell.column.id === 'selected') {
      evt.stopPropagation();
      evt.preventDefault();
      if (typeof props.onSelect === 'function') {
        props.onSelect(evt, rowData);
        // Move the focus to this row
        setRovingRowIndex(row.index);
        setRovingColIndex(null);
        setDoSetFocus(true);
        return;
      }
    }
    if (rowData.type === 'folder') {
      props.onOpenFolder(evt, rowData);
    } else {
      props.onOpenFile(evt, rowData);
      // Move the roving tabindex to this row, but leave focus on the newly opened form
      setRovingRowIndex(row.index);
      setRovingColIndex(null);
      setDoSetFocus(false);
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
    // Reset roving tabindex without changing focus
    setRovingRowIndex(null);
    setRovingColIndex(null);
    setDoSetFocus(false);
  }

  /**
   * Handles setting the pagination to a different page
   */
  function handleSetPage(page) {
    // Convert 0-based to 1-based
    props.onSetPage(page);
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
  function renderSelect(rowData) {
    if (rowIsUploading(rowData)) {
      return null;
    }
    if (!props.selectableItems || !(props.selectableFolders || rowData.type !== 'folder')) {
      return null;
    }
    const checkboxProps = {
      className: classNames({
        'gallery__table-row__checkbox-icon': true,
        'font-icon-tick': true,
      }),
      // The selected state and interaction for screen-reader users is directly on the
      // row, so we shouldn't also announce a checkbox to them.
      'aria-hidden': true,
    };
    const maxSelected = (
      ![null, 1].includes(props.maxFilesSelect) &&
      props.selectedFiles.length >= props.maxFilesSelect
    );
    const labelClassNames = classNames({
      'gallery__table-row__checkbox': true,
      'gallery__table-row__checkbox--disabled': maxSelected && !rowData.selected,
    });
    return <span className={labelClassNames}><span {...checkboxProps} /></span>;
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
    const momentInstance = moment(rowData.lastEdited);
    return <time
      aria-label={momentInstance.format('LLL')}
      dateTime={momentInstance.format('YYYY-MM-DD[T]HH:mm')}
    >
      {momentInstance.format('L LT')}
    </time>;
  }

  /**
   * Renders the thumbnail for the row/item in the table view.
   * Shows an error box if no url was defined.
   */
  function renderThumbnail(rowData) {
    const url = rowData.url;
    const category = rowData.category || 'false';
    const styles = {};
    let errorMsg = null;
    if (rowData.message?.type === 'error') {
      errorMsg = rowData.message.value;
    }
    const thumbnailClassNames = classNames({
      'gallery__table-image': true,
      'gallery__table-image--error': errorMsg,
      [`gallery__table-image--${category}`]: !errorMsg,
    });
    if (!errorMsg && category === 'image' && url) {
      styles.backgroundImage = `url("${url}")`;
    }
    return <div title={errorMsg} aria-label={errorMsg} className={thumbnailClassNames} style={styles} />;
  }

  /**
   * Get the correct tabIndex value for a row.
   * The row which should have the roving tabindex gets a value '0'
   * All other rows get a value '-1'
   */
  function getRowTabIndex(row, tableHasOpenRow) {
    // If we're focused on a cell, no rows have the roving tabindex.
    if (rovingColIndex !== null) {
      return '-1';
    }
    // If we weren't focused on a row
    if (rovingRowIndex === null) {
      // If there's an open row, and that row is in this table, only the opened row should have the roving tabindex.
      if (tableHasOpenRow) {
        if (row.original.id === props.openFileId) {
          return '0';
        } else {
          return '-1';
        }
      }
      // If there's no open row (or the open row isn't in this table), only the first row should have the roving tabindex.
      return row.index === 0 ? '0' : '-1';
    }
    // If we're focused on a row, that row should have the roving tabindex.
    return rovingRowIndex === row.index ? '0' : '-1';
  }

  /**
   * Get the correct tabIndex value for a cell.
   * The cell which should have the roving tabindex gets a value '0'
   * All other cells get a value '-1'
   */
  function getCellTabIndex(cell) {
    // Decorative cells have no tabindex.
    if (columnIsDecorative(cell.column.id)) {
      return null;
    }
    // If we weren't focused on a cell, no cells have the roving tabindex.
    if (rovingColIndex === null) {
      return '-1';
    }
    // If we're focused on a cell, only that cell should have the roving tabindex.
    return (rovingRowIndex === cell.row.index && rovingColIndex === getColumnIndex(cell)) ? '0' : '-1';
  }

  /**
   * Returns the "ascending" or "descending" order for sortable columns.
   * Returns null for non-sortable columns.
   */
  function getSortOrder(columnId) {
    const [sortColumn, sortDirection] = props.sort.split(',');
    if (sortColumn === columnId) {
      return `${sortDirection}ending`;
    }
    return null;
  }

  /**
   * Returns the CSS class for a row, based on the rowData
   */
  function getTrClassName(row) {
    const rowData = row.original;
    return classNames({
      'gallery__table-row': true,
      'gallery__table-row--selectable': props.selectableItems && (props.selectableFolders || rowData.type !== 'folder'),
      'gallery__table-row--highlighted': rowData.highlighted,
      'gallery__table-row--selected': rowData.selected,
    });
  }

  /**
   * Returns the CSS class for a cell, for both header and body cells
   */
  function getCellClassName(cell, isHeader) {
    const ret = ['gallery__table-column'];
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
    } else if (columnId === 'status') {
      ret.push('gallery__table-column--status');
    } else if (columnId === 'size') {
      ret.push('gallery__table-column--size');
    } else if (columnId === 'lastEdited') {
      ret.push('gallery__table-column--modified');
    }
    return ret.join(' ');
  }

  /**
   * Returns the aria role for the table cell
   */
  function getCellRole(columnId, isHeader = false) {
    if (columnIsDecorative(columnId)) {
      return 'presentation';
    }
    // Header cells get their role implicitly from being a th element.
    return isHeader ? null : 'gridcell';
  }

  /**
   * Adds the cell element to cellRefs if it's not purely decorative.
   */
  function setCellRef(cell, el) {
    if (!columnIsDecorative(cell.column.id)) {
      if (!cellRefs.current[cell.row.index]) {
        cellRefs.current[cell.row.index] = [];
      }
      cellRefs.current[cell.row.index][getColumnIndex(cell)] = el;
    }
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
    const rowData = cell.row.original;
    let editableText = rowData.canEdit ? null : `${i18n._t('AssetAdmin.NOT_EDITABLE', 'not editable')},`;
    let uploadText = null;
    const uploading = rowIsUploading(rowData);
    if (uploading) {
      editableText = null;
      uploadText = rowHasError(rowData)
        ? i18n._t('AssetAdmin.UPLOAD_FAILED_INSTRUCTION', 'upload failed, press enter to remove')
        : i18n._t('AssetAdmin.UPLOADING_INSTRUCTION', 'uploading, press enter to cancel');
      uploadText += ',';
    }
    return <>
      {cell.column.id === 'thumbnail' && <span className="visually-hidden">
        {rowData.category && i18n._t(`AssetAdmin.CATEGORY_${rowData.category.toUpperCase()}`, rowData.category)},&nbsp;
        {editableText}&nbsp;
        {uploadText}&nbsp;
      </span>}
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </>;
  }

  function renderPaginator() {
    return <Paginator
      totalItems={props.totalCount}
      maxItemsPerPage={props.limit}
      currentPage={props.page}
      onChangePage={(page) => handleSetPage(page)}
      title={i18n._t('AssetAdmin.FILES')}
    />;
  }

  const gridDescriptionID = `asset-admin-grid-${useId()}`;
  // Column configuration for react-table
  // Memoising column config prevents the table from being completely rebuilt when unrelated props/state update.
  // Notably, this fixes issues with race conditions for screen readers when updating focus via keyboard events.
  const columnConfig = useMemo(() => {
    const columnConf = [
      {
        id: 'thumbnail',
        header: '',
        cell: (info) => renderThumbnail(info.getValue()),
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
      columnConf.unshift({
        id: 'selected',
        header: '',
        cell: (info) => renderSelect(info.getValue()),
      });
    }
    return columnConf;
  // props.selectedFiles is used in renderSelect so should really be a dependency here,
  // however adding it causes the table to be reconstructed whenever an item is selected.
  // That causes problems with screen readers and keyboard navigation:
  // 1. After selecting an item with the "Space" key, there is a lag before your next key input will be processed
  // 2. If you press "Space" to select and item and then just wait, it will re-announce the item you're focused on,
  //    because it's an entirely new DOM element so to the screen reader it thinks your focus was moved.
  }, [props.selectableItems, props.selectableFolders, props.maxFilesSelect]);

  const columnHelper = createColumnHelper();
  const table = useReactTable({
    data: props.files,
    columns: columnConfig.map(config => columnHelper.accessor(row => row, config)),
    getCoreRowModel: getCoreRowModel(),
  });

  // render
  if (props.files.length === 0) {
    if (!props.loading) {
      // Show a "no items" notice if there are no items to display
      return <p role="region" ref={gridRef} tabIndex={-1} className="gallery__no-item-notice">{i18n._t('AssetAdmin.NOITEMSFOUND')}</p>;
    }
  } else {
    const folders = props.files.filter(folderFilter);
    const files = props.files.filter(fileFilter);
    const totalPages = props.totalCount <= props.limit ? 1 : Math.ceil(props.totalCount / props.limit);
    const paginationText = i18n.inject(
      i18n._t('Admin.PAGE_OF_PAGES', 'Page {current} of {total}'),
      {
        current: props.page,
        total: totalPages,
      }
    );
    const thisPageText = i18n.inject(
      i18n._t('AssetAdmin.NUM_ITEMS_THIS_PAGE', '{numFolders} folders and {numFiles} files on this page'),
      {
        numFiles: files.length || '0',
        numFolders: folders.length || '0',
      }
    );
    return <table
      ref={gridRef}
      role="grid"
      // There are 4 columns with data
      // we skip the thumbnail column as it's purely presentational
      // we skip the checkbox column as that's activated on the row as a whole.
      aria-colcount={4}
      aria-multiselectable="true"
      aria-describedby={gridDescriptionID}
      tabIndex={-1}
      className="gallery__table table table-hover"
      onKeyDown={(event) => handleKeyDown(null, null, event)}
    >
      <caption id={gridDescriptionID} className="visually-hidden">{`${paginationText}, ${thisPageText}`}</caption>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                key={header.id}
                className={getCellClassName(header, true)}
                aria-sort={getSortOrder(header.column.id)}
                role={getCellRole(header.column.id, true)}
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
            // Don't use row.id as the key here because that will reuse the same row element
            // for different records, which can confuse screen readers.
            key={row.original.key}
            className={getTrClassName(row)}
            // aria-selected must be explicitly ommitted if the item isn't selectable.
            aria-selected={(props.selectable && row.original.canEdit) ? row.original.selected : null}
            aria-current={(row.original.highlighted && props.openFileId === row.original.id) ? 'page' : null}
            tabIndex={getRowTabIndex(row, props.files.some((item) => item.id === props.openFileId))}
            onKeyDown={(event) => handleKeyDown(row, null, event)}
            ref={(el) => { rowRefs.current[row.index] = el; }}
            // tr gets the "row" role implicitly, but adding it explicitly helps some screen readers.
            role="row"
          >
            {row.getVisibleCells().map(cell => (
              <td
                tabIndex={getCellTabIndex(cell)}
                role={getCellRole(cell.column.id)}
                key={cell.id}
                onClick={(evt) => handleCellClick(row, cell, evt)}
                className={getCellClassName(cell, false)}
                onKeyDown={(event) => handleKeyDown(row, cell, event)}
                ref={(el) => { setCellRef(cell, el); }}
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
