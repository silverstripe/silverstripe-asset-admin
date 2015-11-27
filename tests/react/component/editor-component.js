jest
    .dontMock('../../../public/src/component/editor-component.js')
    .dontMock('../../../public/src/component/base-component.js');


describe('FileComponent', function() {

	var React = require('react/addons'),
		TestUtils = React.addons.TestUtils,
		EditorComponent = require('../../../public/src/component/editor-component.js'),
		props;
		
	beforeEach(function () {
        props = {
            file: {
                title: 'file1',
                attributes: {
                    dimensions: {
                        width: 10,
                        height: 10
                    }
                }
            }
        }
	});
    
    describe('onFieldChange()', function () {
    });
    
    describe('onFileSave()', function () {
        var editor;
        
        beforeEach(function () {
            props.onFileSave = jest.genMockFunction();
            
            editor = TestUtils.renderIntoDocument(
                <EditorComponent {...props} />
            );
        });
        
        it('should call props.onFileSave()', function () {
            editor.onFileSave();
            
            expect(editor.props.onFileSave).toBeCalled();
        });
    });
    
    describe('onCancel()', function () {
        var editor;
        
        beforeEach(function () {
            props.onCancel = jest.genMockFunction();
            
            editor = TestUtils.renderIntoDocument(
                <EditorComponent {...props} />
            );
        });
        
        it('should call props.onCancel()', function () {
            editor.onCancel();
            
            expect(editor.props.onCancel).toBeCalled();
        });
    });
});
