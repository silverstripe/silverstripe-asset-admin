/* eslint-disable import/no-cycle */
import i18n from 'i18n';
import React, { useState, useEffect, useRef, useId } from 'react';
import { inject } from 'lib/Injector';
import { galleryViewPropTypes, galleryViewDefaultProps } from 'containers/Gallery/Gallery';
import Paginator from 'components/Paginator/Paginator';
import ResizeAware from 'components/ResizeAware/ResizeAware';
import PropTypes from 'prop-types';

const ThumbnailView = (_props) => {
  const defaultProps = galleryViewDefaultProps;
  const props = {
    ...defaultProps,
    ..._props,
  };
  // Refs for grid size, gallery item size, and file/folder element/ID pairs.
  const gridRef = useRef(null);
  const gallerySizeRef = useRef(null);
  const fileRefs = useRef([]);
  const folderRefs = useRef([]);

  /**
   * Determines if two files or folders are identical for focus purposes.
   * If either item doesn't exist, they're not the same.
   * If both items have an ID, that is used as the identifier.
   * If both items have a queued ID (e.g. uploaded files), we can fall back on that.
   */
  const focusItemsAreIdentical = (item1, item2) => {
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
  };

  /**
   * Create a new object based on the passed in item which contains all the information
   * needed for the focusedItem state.
   * @param {object} item A file or folder from props.files
   */
  const getFocusDataFromItem = (item) => {
    if (!item) {
      return null;
    }
    const itemRefs = item.type === 'folder' ? folderRefs.current : fileRefs.current;
    const index = itemRefs.findIndex((itemRef) => focusItemsAreIdentical(item, itemRef));
    return { id: item.id, queuedId: item.queuedId, type: item.type, index };
  };

  /**
   * Get the object for setting a focused item based on the openFileId prop.
   * If openFileId is in the files list, it should be the focused item.
   * Otherwise, return null so the appropriate first indexed item is used.
   */
  const getFocusedItemFromOpenId = () => {
    const openFile = props.files.find((item) => item.id === props.openFileId);
    if (openFile) {
      return getFocusDataFromItem(openFile);
    }
    return null;
  };

  // allowedToSetFocus must be false until the user intentionally
  // attempts to focus on a new item or we add items to the gallery.
  // Otherwise we end up focusing on a grid item as soon as the gallery
  // is first loaded or anything rerenders.
  const [allowedToSetFocus, setAllowedToSetFocus] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(null);
  const [focusedItem, setFocusedItem] = useState(getFocusedItemFromOpenId);
  const [forceResetRefs, setForceResetRefs] = useState(false);
  // Holds the props of the previous render, to simulate the oldProps argument of componentDidUpdate
  const oldPropsRef = useRef(null);
  // focusedItem updates from renderItem must apply after the commit, or GalleryItem misses the isFocused change
  const pendingFocusedItemUpdates = useRef([]);
  pendingFocusedItemUpdates.current = [];

  /**
   * Calculates how many items fit in a row and sets the state
   */
  const updateItemsPerRow = () => {
    if (!gallerySizeRef.current || !gridRef.current) {
      setItemsPerRow(0);
      return;
    }
    const style = window.getComputedStyle(gallerySizeRef.current);
    const marginRight = parseFloat(style.marginRight);
    const marginLeft = parseFloat(style.marginLeft);
    const totalItemWidth = gallerySizeRef.current.offsetWidth + marginRight + marginLeft;
    const newItemsPerRow = Math.floor(gridRef.current.offsetWidth / totalItemWidth);
    setItemsPerRow(newItemsPerRow);
  };

  /**
   * Checks if two arrays of file data contain the same items.
   * This is based on the ID and QueuedID only, since these are the
   * properties that identify unique items.
   */
  const fileArraysAreIdentical = (arrA, arrB) => {
    // First, check if the lengths are equal. If not, they are not identical.
    if (arrA.length !== arrB.length) {
      return false;
    }
    // Check if there are any files in one array which aren't present in the other.
    // If there's no descrepencies, we return true.
    return arrA.every(itemA => arrB.some(itemB => focusItemsAreIdentical(itemA, itemB)));
  };

  /**
   * Handles setting the pagination page number
   */
  const handleSetPage = (page) => {
    props.onSetPage(page);
  };

  /**
   * Filtering by folder type
   *
   * @param {object} file
   * @returns {boolean}
   */
  const folderFilter = (file) => file.type === 'folder';

  /**
   * Filtering by non-folder types
   *
   * @param {object} file
   * @returns {boolean}
   */
  const fileFilter = (file) => file.type !== 'folder';

  useEffect(() => {
    updateItemsPerRow();
  }, []);

  // Must run before the componentDidUpdate effect, so its setFocusedItem calls apply last
  useEffect(() => {
    const updates = pendingFocusedItemUpdates.current;
    pendingFocusedItemUpdates.current = [];
    updates.forEach((update) => setFocusedItem(update));
  });

  // IMPORTANT
  // A lot of the logic here is similar to logic in TableView.
  // If a change is needed (e.g. to resolve a bug), make sure you check both views!
  useEffect(() => {
    const oldProps = oldPropsRef.current;
    oldPropsRef.current = props;
    // Nothing to compare against on the first render, which is the equivalent of componentDidMount
    if (!oldProps) {
      return;
    }
    // If we changed page or are looking at a different folder, throw away the old refs
    // and reset focus, and skip the rest of the logic in this lifecycle event.
    if (forceResetRefs || oldProps.page !== props.page || oldProps.folderId !== props.folderId) {
      // If the files arrays are still identical, the navigation hasn't finished yet, so defer changes for now.
      if (fileArraysAreIdentical(oldProps.files, props.files)) {
        if (!forceResetRefs) {
          setForceResetRefs(true);
        }
        return;
      }
      // gallerySizeRef is not reset: the first item's ref callback keeps it current, and a ResizeObserver
      // callback before the next render would read null and set itemsPerRow to 0
      folderRefs.current = [];
      fileRefs.current = [];
      // Explicitly focus on the grid itself to announce changes to page etc.
      gridRef.current.focus();
      setForceResetRefs(false);
      if (focusedItem) {
        setFocusedItem(null);
      }
      return;
    }
    // If we removed a file or folder, we have some tidy-up to do.
    if (props.totalCount < oldProps.totalCount || props.files.length < oldProps.files.length) {
      // If we have less files/folders than we used to, make sure to remove the extra refs
      // Note that all the refs are correct, there's just some extra old ones at the end of
      // the arrays.
      if (props.files.length === 0) {
        gallerySizeRef.current = null;
        folderRefs.current = [];
        fileRefs.current = [];
      } else {
        const oldFolders = oldProps.files.filter(folderFilter);
        const currentFolders = props.files.filter(folderFilter);
        if (currentFolders.length < oldFolders.length) {
          folderRefs.current = folderRefs.current.slice(0, currentFolders.length);
        }
        const oldFiles = oldProps.files.filter(fileFilter);
        const currentFiles = props.files.filter(fileFilter);
        if (currentFiles.length < oldFiles.length) {
          fileRefs.current = fileRefs.current.slice(0, currentFiles.length);
        }
      }
      // If we removed the focused item, we need to apply focus to a new item
      if (focusedItem) {
        // If there are no files or folders, move focus to the grid itself to announce "0 folders, 0 files"
        if (props.files.length === 0) {
          gridRef.current.focus();
          setFocusedItem(null);
        } else {
          const current = props.files.find((item) => focusItemsAreIdentical(focusedItem, item));
          if (!current) {
            setFocusedItem((oldFocusedItem) => {
              // This needs to be calculated within this callback to satisfy the linter, which doesn't like
              // setting new state based on old state outside of the callback.
              let items = oldFocusedItem.type === 'folder' ? folderRefs.current : fileRefs.current;
              let nextIndex = Math.min(items.length - 1, oldFocusedItem.index);
              if (items.length === 0) {
                // If there are no more items in the old type, use the other type.
                if (oldFocusedItem.type === 'folder') {
                  items = fileRefs.current;
                  nextIndex = 0;
                } else {
                  items = folderRefs.current;
                  nextIndex = folderRefs.current.length - 1;
                }
              }
              const newFocusItem = items[nextIndex];
              return { ...newFocusItem, index: nextIndex, type: oldFocusedItem.type };
            });
          }
        }
      }
    }

    // If we added a folder or file, move focus to the first new item
    if (props.totalCount > oldProps.totalCount || props.files.length > oldProps.files.length) {
      const newItems = props.files.filter((item) => !oldProps.files.find((oldItem) => focusItemsAreIdentical(item, oldItem)));
      const newItem = newItems[0];
      if (newItem) {
        setAllowedToSetFocus(true);
        setFocusedItem(getFocusDataFromItem(newItem));
      }
    }

    // For successful uploads, when the file gets assigned a new ID we need to capture that.
    // There's a brief period where the file has both a queuedID and a regular ID - and then it
    // drops the queuedID. We need to make sure we catch the ID so we can retain focus on the
    // item.
    if (focusedItem?.queuedId && !focusedItem.id && props.totalCount === oldProps.totalCount) {
      const current = props.files.find((item) => focusItemsAreIdentical(focusedItem, item));
      if (current && current.id !== focusedItem.id) {
        setFocusedItem(getFocusDataFromItem(current));
        // It is important that focus change only happens if a different file already has its form open.
        // Otherwise, we have a race condition between moving focus into the newly opened form for the new item
        // and keeping focus on the newly uploaded file.
        if (!oldProps.openFileId || oldProps.openFileId === current.id) {
          setAllowedToSetFocus(false);
        }
      }
    }

    // If a file edit form gets closed, focus back inside the grid.
    // Note the focusedItem state isn't suitable here because either it's already
    // set to the right thing (and therefore it won't do anything)
    // or it's not set at all (and should therefore remain unset).
    // Note we ignore the allowedToSetFocus state here intentionally.
    if (oldProps.openFileId && !props.openFileId) {
      let itemToFocus = null;
      if (focusedItem) {
        itemToFocus = gridRef.current.querySelector('.gallery-item[tabindex="0"]');
      }
      if (!itemToFocus) {
        itemToFocus = gridRef.current.querySelector('.gallery-item');
      }
      if (!itemToFocus) {
        itemToFocus = gridRef.current;
      }
      itemToFocus.focus();
    }
  });

  /**
   * Renders the react component for pagination.
   *
   * @returns {XML|null}
   */
  const renderPagination = () => {
    if (props.totalCount <= props.limit) {
      return null;
    }
    const paginationProps = {
      totalItems: props.totalCount,
      maxItemsPerPage: props.limit,
      currentPage: props.page,
      onChangePage: handleSetPage,
      title: i18n._t('AssetAdmin.FILES')
    };
    return <Paginator {...paginationProps} />;
  };

  /**
   * Handles keydown events for navigating the gallery items (e.g. arrow keys)
   */
  const handleNavigateKeyDown = (event, index, itemType) => {
    // Get item width including margins and calculate items per row based on size
    if (!itemsPerRow) {
      return;
    }
    // Get references for folders, files, and the current grid items
    const folders = folderRefs.current;
    const files = fileRefs.current;
    let items = itemType === 'folder' ? folders : files;
    let nextType = itemType;
    const currentFocusItem = items[index];
    // Prepare for event handling calculations
    const itemsInLastRow = items.length % itemsPerRow;
    const itemsRemaining = items.length - 1 - index;
    const columnIndex = index % itemsPerRow;
    const row = Math.ceil((index + 1) / itemsPerRow);
    // Based on the current index and which key was pressed,
    // identify the index of the item that should gain focus.
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = index - 1;
        break;
      case 'ArrowRight':
        nextIndex = index + 1;
        break;
      case 'ArrowUp':
        nextIndex = index - itemsPerRow;
        break;
      case 'ArrowDown':
        nextIndex = index + itemsPerRow;
        // If there's no item below but there are items on the next (last) row,
        // go to the last item in the last row.
        // But don't move if we're already on the last row.
        if (nextIndex >= items.length && itemsInLastRow <= itemsRemaining) {
          nextIndex = items.length - 1;
        }
        break;
      case 'Home':
        if (event.getModifierState('Control')) {
          // Ctrl+Home goes to the first item altogether
          items = folders.length ? folders : files;
          nextIndex = 0;
        } else {
          // First item in the current row
          nextIndex = (row - 1) * itemsPerRow;
        }
        break;
      case 'End':
        if (event.getModifierState('Control')) {
          // Ctrl+Home goes to the last item altogether
          items = files.length ? files : folders;
          nextIndex = items.length - 1;
        } else {
          // Last item in the current row
          nextIndex = Math.min((row * itemsPerRow) - 1, items.length - 1);
        }
        break;
      default:
        return;
    }

    // For any of the keydown events we're handling, ignore the default browser functionality.
    event.preventDefault();

    // Traverse to the correct file from the folders grid
    if (nextIndex >= items.length && itemType === 'folder' && files.length !== 0) {
      items = files;
      nextType = 'file';
      if (event.key === 'ArrowDown') {
        nextIndex = Math.min(columnIndex, files.length - 1);
      } else {
        nextIndex = 0;
      }
    }

    // Traverse to the correct folder from the files grid
    if (nextIndex < 0 && itemType === 'file' && folders.length !== 0) {
      items = folders;
      nextType = 'folder';
      if (event.key === 'ArrowUp') {
        // Calculate the correct index of the folder in the last row in the current column
        nextIndex = Math.min(
          Math.floor((folders.length - 1) / itemsPerRow) * itemsPerRow + columnIndex,
          folders.length - 1
        );
      } else {
        nextIndex = folders.length - 1;
      }
    }

    // Set the focused item only if there's a new item to focus on
    const newFocusItem = items[nextIndex];
    if (typeof newFocusItem === 'undefined') {
      return;
    }
    if (!focusItemsAreIdentical(newFocusItem, currentFocusItem)) {
      setFocusedItem({ ...newFocusItem, index: nextIndex, type: nextType });
      setAllowedToSetFocus(true);
    }
  };

  /**
   * Renders the item for the this view, assigning relevant props
   *
   * @param {object} item
   * @param {number} index
   * @returns {XML}
   */
  const renderItem = (item, index, folders) => {
    const {
      File,
      Folder,
      badges,
      sectionConfig,
      selectedFiles,
      selectableItems,
      selectableFolders,
    } = props;
    const badge = badges.find((badgeItem) => badgeItem.id === item.id);
    const isFocusedItem = focusItemsAreIdentical(focusedItem, item);
    // If we haven't set the index for the focused item yet, set it now that we know it.
    // This is important if we remove the item later e.g. deleting a file/folder.
    if (focusedItem?.index === undefined) {
      pendingFocusedItemUpdates.current.push((oldFocusedItem) => ({ ...oldFocusedItem, index }));
    }
    let itemProps = {
      sectionConfig,
      key: item.key,
      selectableKey: item.id,
      item,
      selectedFiles,
      badge,
      canDrag: props.canDrag,
      onNavigateKeyDown: (event) => handleNavigateKeyDown(event, index, item.type),
      tabIndex: isFocusedItem ? 0 : -1,
      isFocused: allowedToSetFocus && isFocusedItem,
      onClick: () => { setFocusedItem(getFocusDataFromItem(item)); },
    };
    // All gallery items are the same width, so we only need one item for size checking
    let sizeRef = null;
    if (index === 0) {
      sizeRef = (el) => { gallerySizeRef.current = el; };
      // If there is an opened item or an item has already been explicitly given focus,
      // that item has focus.
      // Otherwise if there are folders, the first folder will be the tabbable item.
      // Otherwise the first file will be the tabbable item.
      if (!focusedItem && (item.type === 'folder' || folders.length === 0)) {
        itemProps.tabIndex = 0;
      }
    }

    // Get the row and column indexes for accessibility
    if (itemsPerRow) {
      let realIndex = index;
      if (item.type !== 'folder') {
        // There may not be enough folders to fill out an entire last row,
        // so we have to figure out how many folders there would be if they
        // did fill it out to get the correct row/column values for the file.
        const numMaxFolders = Math.ceil((folders.length) / itemsPerRow) * itemsPerRow;
        realIndex = index + numMaxFolders;
      }
      itemProps.colIndex = (realIndex % itemsPerRow) + 1;
      itemProps.rowIndex = Math.ceil((realIndex + 1) / itemsPerRow);
    }

    // Various action handlers
    if (item.queuedId && !item.id) {
      const { onCancelUpload, onRemoveErroredUpload } = props;
      itemProps = { ...itemProps, onCancelUpload, onRemoveErroredUpload };
    } else {
      const { onOpenFolder, onOpenFile } = props;
      itemProps = {
        ...itemProps,
        onActivate: (item.type === 'folder') ? onOpenFolder : onOpenFile,
      };
    }

    // Handlers for selecting an item
    if (selectableItems && (selectableFolders || item.type !== 'folder')) {
      const maxSelected = (
        ![null, 1].includes(props.maxFilesSelect) &&
        props.selectedFiles.length >= props.maxFilesSelect
      );
      const onSelect = (props.maxFilesSelect === 1) ? itemProps.onActivate : props.onSelect;
      itemProps = { ...itemProps, selectable: true, onSelect, maxSelected };
    }

    let FileComponent = null;
    if (item.type === 'folder') {
      folderRefs.current[index] = { id: item.id, queuedId: item.queuedId };
      FileComponent = Folder;
      itemProps.droppableSizeRef = sizeRef;
    } else {
      fileRefs.current[index] = { id: item.id, queuedId: item.queuedId };
      FileComponent = File;
      itemProps.draggableSizeRef = sizeRef;
    }

    // If we haven't set the focused item yet, set it now that we know it.
    // This is important if we remove the item later e.g. deleting a file/folder.
    if (!focusedItem && itemProps.tabIndex === 0) {
      pendingFocusedItemUpdates.current.push(getFocusDataFromItem(item));
    }

    return <FileComponent {...itemProps}/>;
  };

  // filter files and folders
  const folders = props.files.filter(folderFilter);
  const files = props.files.filter(fileFilter);
  const className = 'gallery__main-view--tile';
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
  // Values of -1 tell assistive technologies we don't know yet how many rows/cols there are.
  let numRows = -1;
  let numCols = -1;
  if (itemsPerRow) {
    const numFolderRows = Math.ceil(folders.length / itemsPerRow);
    const numFileRows = Math.ceil(files.length / itemsPerRow);
    numRows = numFolderRows + numFileRows;
    // The number of columns is the items per row, unless there's not enough files AND not enough folders
    // to fill out a full row. Then it's whichever has more of files or folders.
    numCols = itemsPerRow;
    if (numCols > files.length && numCols > folders.length) {
      numCols = Math.max(files.length, folders.length);
    }
  }
  // Since this can be used inside a modal, we should use a unique ID to prevent
  // problems if someone manages to get two of these in the DOM at the same time.
  const gridID = `asset-admin-grid-${useId()}`;

  // Note about the role="row" divs:
  // Elements with role="grid-cell" must have a parent with role="row".
  // Since this is a flex grid, we can't have proper fixed rows, so we add a single row for each cell and then use
  // aria-rowcount and aria-colcount to tell assistive technologies how many rows/columns we actually have.
  // We also use aria-rowIndex and aria-colIndex on the individual cells.
  return (
    <div
      ref={gridRef}
      className={className}
      role="grid"
      aria-rowcount={numRows}
      aria-colcount={numCols}
      aria-multiselectable="true"
      aria-roledescription={i18n._t('AssetAdmin.FILE_GALLERY', 'File gallery')}
      aria-describedby={gridID}
      tabIndex={-1}
    >
      <span id={gridID} className="visually-hidden">{`${paginationText}, ${thisPageText}`}</span>
      <ResizeAware onResize={updateItemsPerRow}>
        <div className="gallery__folders">
          {folders.map((item, index) => <div role="row">{renderItem(item, index, folders)}</div>)}
        </div>

        <div className="gallery__files">
          {files.map((item, index) => <div role="row">{renderItem(item, index, folders)}</div>)}
        </div>
      </ResizeAware>

      {props.files.length === 0 && !props.loading &&
        <p className="gallery__no-item-notice">{i18n._t('AssetAdmin.NOITEMSFOUND')}</p>
      }

      <div className="gallery__load">
        {renderPagination()}
      </div>
    </div>
  );
};

ThumbnailView.propTypes = {
  ...galleryViewPropTypes,
  File: PropTypes.elementType.isRequired,
  Folder: PropTypes.elementType.isRequired,
};

const injector = inject(
  ['GalleryItemFile', 'GalleryItemFolder'],
  (GalleryItemFile, GalleryItemFolder) => ({
    File: GalleryItemFile,
    Folder: GalleryItemFolder
  }),
  () => 'AssetAdmin.Gallery.ThumbnailView',
);

export { ThumbnailView as Component };

export default injector(ThumbnailView);
