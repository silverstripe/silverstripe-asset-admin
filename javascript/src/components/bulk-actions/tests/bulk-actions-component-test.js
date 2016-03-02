jest.dontMock('../index.js');

var React = require('react'),
    i18n = require('i18n'),
    ReactTestUtils = require('react-addons-test-utils'),
    BulkActionsComponent = require('../index.js').BulkActionsComponent;

describe('BulkActionsComponent', function() {

    var props;

    beforeEach(function () {
        props = {
            gallery: {
                bulkActions: {
                    options: [
                        {
                            value: 'delete',
                            label: 'Delete',
                            destructive: true
                        }
                    ]
                },
                selectedFiles: [1]
            }
        }
    });

    describe('getOptionByValue()', function () {
        var bulkActions;

        beforeEach(function () {
            bulkActions = ReactTestUtils.renderIntoDocument(
                <BulkActionsComponent {...props} />
            );
        });

        it('should return the option which matches the given value', function () {
            expect(bulkActions.getOptionByValue('delete').value).toBe('delete');
        });

        it('should return null if no option matches the given value', function () {
            expect(bulkActions.getOptionByValue('destroyCMS')).toBe(null);
        });
    });
    
    describe('getSelectedFiles()', function () {
        var bulkActions;

        beforeEach(function () {
            bulkActions = ReactTestUtils.renderIntoDocument(
                <BulkActionsComponent {...props} />
            );
        });

        it('should return the option which matches the given value', function () {
            expect(bulkActions.getSelectedFiles()[0]).toBe(1);
        });
    });
    
    describe('applyAction()', function () {
        var bulkActions;
    
        beforeEach(function () {
            props.backend = {
                delete: jest.genMockFunction()
            }
            props.getSelectedFiles = jest.genMockFunction();
    
            bulkActions = ReactTestUtils.renderIntoDocument(
                    <BulkActionsComponent {...props} />
            );
        });
    
        it('should apply the given action', function () {
            props.getSelectedFiles.mockReturnValueOnce('file1');
    
            bulkActions.applyAction('delete');
    
            expect(bulkActions.props.backend.delete).toBeCalled();
        });
    
        it('should return false if there are no matching actions', function () {
            expect(bulkActions.applyAction('destroyCMS')).toBe(false);
        });
    });
    
    describe('onChangeValue()', function () {
        var bulkActions, event;
    
        beforeEach(function () {
            bulkActions = ReactTestUtils.renderIntoDocument(
                    <BulkActionsComponent {...props} />
            );
    
            event = {
                target: {
                    value: 'delete'
                }
            }
    
            bulkActions.getOptionByValue = jest.genMockFunction();
            bulkActions.applyAction = jest.genMockFunction();
        });
    
        it('should return undefined if no valid option is selected', function () {
            bulkActions.getOptionByValue.mockReturnValueOnce(null);
    
            expect(bulkActions.onChangeValue(event)).toBe(undefined);
        });
    
        it('should ask user for confirmation if the action is destructive', function () {
            var mock = jest.genMockFunction(),
                originalConfirm = window.confirm;
    
            bulkActions.getOptionByValue.mockReturnValueOnce({destructive: true});
            mock.mockReturnValueOnce(true);
            window.confirm = mock;
            i18n.sprintf = jest.genMockFunction();
    
            bulkActions.onChangeValue(event);
    
            expect(bulkActions.applyAction).toBeCalled();
            expect(window.confirm).toBeCalled();
    
            window.confirm = originalConfirm;
        });
    
        it('should not ask user for confirmation if the action is not destructive', function () {
            bulkActions.getOptionByValue.mockReturnValueOnce({destructive: false});
    
            bulkActions.onChangeValue(event);
    
            expect(bulkActions.applyAction).toBeCalled();
        });
    });
});
