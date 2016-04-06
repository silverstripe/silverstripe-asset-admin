jest.dontMock('react');
jest.dontMock('react-dom');
jest.dontMock('react-redux');
jest.dontMock('react-addons-test-utils');
jest.dontMock('../../../components/bulk-actions');
jest.dontMock('../controller');

var React = require('react'),
    i18n = require('i18n'),
    ReactTestUtils = require('react-addons-test-utils'),
    GalleryContainer = require('../controller').GalleryContainer;

describe('GalleryContainer', function() {

    var props;

    beforeEach(() => {
        props = {
            backend: {
                getFilesByParentID: () => null
            },
            actions: {
                gallery: {
                    addFiles: () => null,
                    removeFiles: () => null,
                    updateFile: () => null,
                    selectFiles: () => null,
                    deselectFiles: () => null,
                    setEditing: () => null,
                    setEditorFields: () => null,
                    updateEditorField: () => null,
                    setPath: () => null,
                    sortFiles: () => null,
                    setViewingFolder: () => null,
                    setParentFolderId: () => null,
                    setFolderId: () => null
                },
                queuedFiles: {
                    addQueuedFile: () => null,
                    failUpload: () => null,
                    purgeUploadQueue: () => null,
                    removeQueuedFile: () => null,
                    succeedUpload: () => null
                }
            },
            gallery: {
                parentFolderID: null,
                selectedFiles: [],
                files: [],
                folderID: 1
            },
            queuedFiles: {
                items: []
            }
        };
    });

    describe('handleSuccessfulUpload', () => {
        const file = {
            filename: 'unclepaul.png',
            size: 123,
            xhr: { response: '[{"id":1}]' }
        };

        it('should call an action to remove the file from the `queuedFiles` state', () => {
            props.actions.queuedFiles.removeQueuedFile = jest.genMockFunction();

            const gallery = ReactTestUtils.renderIntoDocument(<GalleryContainer {...props} />);

            gallery.handleSuccessfulUpload(file);
            expect(props.actions.queuedFiles.removeQueuedFile).toBeCalled();
        });

        it('should call an action to add the file to the `files` state', () => {
            props.actions.gallery.addFiles = jest.genMockFunction();

            const gallery = ReactTestUtils.renderIntoDocument(<GalleryContainer {...props} />);

            gallery.handleSuccessfulUpload(file);
            expect(props.actions.gallery.addFiles).toBeCalled();
        });
    });
    
    describe('handleSort()', () => {
        var gallery,
            event = {
                target: {
                    dataset: {
                        field: 'field',
                        direction: 'direction'
                    }
                }
            };
    
        beforeEach(() => {
            props.actions.queuedFiles.purgeUploadQueue = jest.genMockFunction();
            props.actions.gallery.sortFiles = jest.genMockFunction();
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should purge the upload queue', () => {
            gallery.handleSort(event);
            expect(props.actions.queuedFiles.purgeUploadQueue).toBeCalled();
        });
    
        it('should call props.actions.sortFiles() with the event\'s dataset', () => {
            gallery.handleSort(event);
            expect(props.actions.gallery.sortFiles).toBeCalled();
        });
    });
    
    describe('getNoItemsNotice()', () => {
    
        it('should return the no items notice if there are no files', () => {
            props.gallery.count = 0;
    
            const gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
    
            expect(JSON.stringify(gallery.getNoItemsNotice())).toContain('gallery__no-item-notice');
        });
        
        it('should return null if there is at least one file', () => {
            props.gallery.count = 1;
    
            const gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
    
            expect(gallery.getNoItemsNotice()).toBe(null);
        });
    });
    
    describe('getBackButton()', () => {
        var gallery;
    
        beforeEach(() => {
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should not return a back button it we\'re at the top level', () => {
            expect(gallery.getBackButton()).toBe(null);
        });
    
        it('should return a back button if parentFolderID is set.', () => {
            props.gallery.parentFolderID = 0;
            var button;
    
            button = gallery.getBackButton();
    
            expect(button).not.toBe(null);
            expect(button.type).toBe('button');
            expect(button.ref).toBe('backButton')
        });
    });
    
    describe('getBulkActionsComponent()', () => {
        var gallery;
    
        beforeEach(() => {
            props.backend.bulkActions = true;
            props.gallery.bulkActions = {
                options: 'option1'
            };
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });

        it('should not return a BulkActionsComponent if there are no selected items', () => {
            expect(gallery.getBulkActionsComponent()).toBe(null);
        });
    
        it('should return a BulkActionsComponent if there are items in the selectedFiles array.', () => {
            props.gallery.selectedFiles = [1];
            
            expect(gallery.getBulkActionsComponent()).not.toBe(null);
        });
    });
    
    describe('getMoreButton()', () => {
        var gallery;
    
        beforeEach(() => {
            props.gallery.files = [1];
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should not return a more button if all files are loaded', () => {
            props.gallery.count = 1
    
            expect(gallery.getMoreButton()).toBe(null);
        });
    
        it('should return a more button if all files are loaded.', () => {
            props.gallery.count = 2
    
            expect(gallery.getMoreButton()).not.toBe(null);
        });
    });

    describe('handleEnterRoute()', () => {
        var gallery, ctx, next;
    
        beforeEach(() => {
            next = jest.genMockFunction();
            ctx = { params: {} };
    
            props.actions.gallery.setViewingFolder = jest.genMockFunction();
            props.actions.gallery.removeFiles = jest.genMockFunction();
            props.actions.gallery.deselectFiles = jest.genMockFunction();
            props.actions.gallery.setPath = jest.genMockFunction();
            props.backend.getFilesByParentID = jest.genMockFunction();
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
        
        it('should call next()', () => {
            gallery.handleEnterRoute(ctx, next);
            
            expect(next).toBeCalled();
        });
        
        it('should call props.actions.setViewingFolder with false if we are not in a folder', () => {
            gallery.handleEnterRoute(ctx, next);
            
            expect(props.actions.gallery.setViewingFolder).toBeCalledWith(false);
        });
        
        it('should call props.actions.setViewingFolder with true if we are in a folder', () => {
            ctx.params.action = 'show';
            ctx.params.id = 1;
            
            gallery.handleEnterRoute(ctx, next);
            
            expect(props.actions.gallery.setViewingFolder).toBeCalledWith(true);
        });
    
        it('should remove and deselect all current files', () => {
            const event = {};
    
            ctx.params.id = 1;
    
            gallery.handleEnterRoute(ctx, next);
            expect(props.actions.gallery.deselectFiles).toBeCalled();
            expect(props.actions.gallery.removeFiles).toBeCalled();
        });
    
        it('should call backend.getFilesByParentID with the folder id', () => {
            const event = {};
    
            ctx.params.id = 1;
    
            gallery.handleEnterRoute(ctx, next);
            expect(props.backend.getFilesByParentID).toBeCalledWith(1);
        });
    });
    
    describe('handleItemDelete()', () => {
        var gallery,
            item = { id: 1 },
            event = {};
    
        beforeEach(() => {
            props.backend.delete = jest.genMockFunction();
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should call props.backend.delete with the item id.', () => {
            var mock = jest.genMockFunction(),
                originalConfirm = window.confirm;
    
            mock.mockReturnValueOnce(true);
            window.confirm = mock;
            // i18n.sprintf = jest.genMockFunction();
    
            gallery.handleItemDelete(event, item);
    
            expect(props.backend.delete).toBeCalledWith(1);
            expect(window.confirm).toBeCalled();
    
            window.confirm = originalConfirm;
        });
    });
    
    describe('itemIsSelected()', () => {
        var gallery;
    
        beforeEach(() => {
            props.gallery.selectedFiles = [1];
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should return true if the file is selected', () => {
            expect(gallery.itemIsSelected(1)).toBe(true);
        });
        
        it('should return false if the file is not selected', () => {
            expect(gallery.itemIsSelected(2)).toBe(false);
        });
    });
    
    describe('handleFolderActivate()', () => {
        var gallery;
    
        beforeEach(() => {
            window.ss = { router: { show: jest.genMockFunction() } };
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should update the route', () => {
            var folder = { id: 1 },
                event = {};
    
            gallery.handleFolderActivate(event, folder);
    
            expect(window.ss.router.show).toBeCalledWith('/assets/show/1');
        });
    });

    describe('handleFileActivate()', () => {
        var gallery;
    
        beforeEach(() => {
            props.actions.gallery.setEditing = jest.genMockFunction();
            window.ss = { router: { show: jest.genMockFunction() } };
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should set the editing state to the given file and update the route', () => {
            var file = { id: 1 },
                event = {};
    
            gallery.handleFileActivate(event, file);
    
            expect(props.actions.gallery.setEditing).toBeCalledWith(file);
            expect(window.ss.router.show).toBeCalledWith('/assets/EditForm/field/Files/item/1/edit');
        })
    });
    
    describe('handleToggleSelect()', () => {
        var gallery,
            event = {};
    
        beforeEach(() => {
            props.actions.gallery.selectFiles = jest.genMockFunction();
            props.actions.gallery.deselectFiles = jest.genMockFunction();
            props.gallery.selectedFiles = [1];
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should set deselect the file is currently selected', () => {
            var item = { id: 1 };
    
            gallery.handleToggleSelect(event, item);
    
            expect(props.actions.gallery.deselectFiles).toBeCalledWith([1]);
        })
        
        it('should set select the file is not currently selected', () => {
            var item = { id: 2 };
    
            gallery.handleToggleSelect(event, item);
    
            expect(props.actions.gallery.selectFiles).toBeCalledWith([2]);
        })
    });
    
    describe('handleMoreClick()', () => {
        var gallery, event;
    
        beforeEach(() => {
            props.backend.more = jest.genMockFunction();
            event = {
                stopPropagation: jest.genMockFunction(),
                preventDefault: jest.genMockFunction()
            };
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
        
        it('should stop propagation of the event', () => {
            gallery.handleMoreClick(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
        
        it('should prevent the default behaviour of the event', () => {
            gallery.handleMoreClick(event);
            
            expect(event.preventDefault).toBeCalled();
        });
        
        it('should call props.backend.more', () => {
            gallery.handleMoreClick(event);
            
            expect(props.backend.more).toBeCalled();
        });
    });
    
    describe('handleBackClick()', () => {
        var gallery, event;
    
        beforeEach(() => {
            props.actions.gallery.deselectFiles = jest.genMockFunction();
            props.actions.gallery.removeFiles = jest.genMockFunction();
            props.actions.gallery.setPath = jest.genMockFunction();
            props.backend.getFilesByParentID = jest.genMockFunction();
            window.ss = { router: { show: jest.genMockFunction() } };
            props.gallery.parentFolderID = 1;
            event = {
                preventDefault: jest.genMockFunction()
            }
    
            gallery = ReactTestUtils.renderIntoDocument(
                <GalleryContainer {...props} />
            );
        });
    
        it('should prevent the default behaviour of the event', () => {
            gallery.handleBackClick(event);
            
            expect(event.preventDefault).toBeCalled();
        });
        
        it('should update the route', () => {
            gallery.handleBackClick(event);
            
            expect(window.ss.router.show).toBeCalledWith('/assets/show/1');
        });
    });
});
