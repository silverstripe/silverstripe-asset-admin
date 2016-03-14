jest.dontMock('react');
jest.dontMock('react-dom');
jest.dontMock('react-redux');
jest.dontMock('react-addons-test-utils');
jest.dontMock('../../../javascript/src/sections/editor/controller.js');

const React = require('react'),
    $ = require('jQuery'),
    ReactDOM = require('react-dom'),
    i18n = require('i18n'),
    ReactTestUtils = require('react-addons-test-utils'),
    EditorContainer = require('../../../javascript/src/sections/editor/controller.js').EditorContainer;

describe('EditorContainer', function() {
    
    var props;

    beforeEach(() => {
        props = {
            file: {
                title: 'file1',
                attributes: {
                    dimensions: {
                        width: 10,
                        height: 10
                    }
                }
            },
            actions: {},
            backend: {},
            editorFields: []
        }
    });
    
    describe('onFieldChange()', () => {
        var editor, event;
        
        beforeEach(() => {
            props.actions.updateEditorField = jest.genMockFunction();
            event = {
                target: {
                    name: 'title',
                    value: 'change'
                }
            }
            
            editor = ReactTestUtils.renderIntoDocument(
                <EditorContainer {...props} />
            );
        });

        it('should call props.actions.updateEditorField() with the event name and target', () => {
            editor.onFieldChange(event);
            
            expect(props.actions.updateEditorField).toBeCalledWith({ name: 'title', value: 'change' });
        })
    });
    
    describe('onFileSave()', () => {
        var editor;
        
        beforeEach(() => {
            props.backend.save = jest.genMockFunction();
            var done = jest.genMockFunction();
            props.file.id = 1;
            props.editorFields = ['field'];

            editor = ReactTestUtils.renderIntoDocument(
                <EditorContainer {...props} />
            );
        });

        it('should call props.backend.save() with the current file id and editorFields', () => {
            editor.onFileSave();

            expect(editor.props.backend.save).toBeCalledWith(1, ['field']);
        });
    });
    
    describe('onCancel()', () => {
        var editor;

        beforeEach(() => {
            window.ss = { router: { show: jest.genMockFunction() } };

            editor = ReactTestUtils.renderIntoDocument(
                <EditorContainer {...props} />
            );
        });

        it('should call update the route to the home route', () => {
            editor.onCancel();
            
            expect(window.ss.router.show).toBeCalledWith('/assets');
        });
    });
    
    // describe('handleEnterRoute()', () => {
    //     var editor;
    // 
    //     beforeEach(() => {
    //         window.ss = { router: { show: jest.genMockFunction() } };
    // 
    //         editor = ReactTestUtils.renderIntoDocument(
    //             <EditorContainer {...props} />
    //         );
    //     });
    // 
    //     it('should ', () => {
    // 
    //     });
    // });
    // 
    // describe('handleExitRoute()', () => {
    //     var editor;
    // 
    //     beforeEach(() => {
    //         window.ss = { router: { show: jest.genMockFunction() } };
    // 
    //         editor = ReactTestUtils.renderIntoDocument(
    //             <EditorContainer {...props} />
    //         );
    //     });
    // 
    //     it('should ', () => {
    // 
    //     });
    // });
});
