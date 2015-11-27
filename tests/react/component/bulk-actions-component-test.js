jest.dontMock('../../../public/src/component/bulk-actions-component.js');

describe('FileComponent', function() {

	var React = require('react/addons'),
        $ = require('jquery'),
        i18n = require('i18n'),
		TestUtils = React.addons.TestUtils,
		BulkActionsComponent = require('../../../public/src/component/bulk-actions-component.js'),
		props;

	beforeEach(function () {
        props = {
            options: [{
                value: 'delete'
            }]
        }
	});

    describe('getOptionByValue()', function () {
        var bulkActions;

        beforeEach(function () {            
            bulkActions = TestUtils.renderIntoDocument(
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
    
    describe('applyAction()', function () {
        var bulkActions;

        beforeEach(function () {
            props.backend = {
                delete: jest.genMockFunction()
            }
            props.getSelectedFiles = jest.genMockFunction();

            bulkActions = TestUtils.renderIntoDocument(
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
            bulkActions = TestUtils.renderIntoDocument(
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
