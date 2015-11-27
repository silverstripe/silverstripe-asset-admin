jest
    .dontMock('../../../public/src/component/file-component.js')
    .dontMock('jquery');


describe('FileComponent', function() {

    var React = require('react/addons'),
        $ = require('jquery'),
        TestUtils = React.addons.TestUtils,
        FileComponent = require('../../../public/src/component/file-component.js'),
        props;
		
	beforeEach(function () {
        props = {
            attributes: {
                dimensions: {
                    width: 10,
                    height: 10
                }
            }
        }
	});

    describe('onFileNavigate()', function () {
        var file, event;
        
        beforeEach(function () {
            props.onFileNavigate = jest.genMockFunction();

            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            file.onFileEdit = jest.genMockFunction();
            file.isFolder = jest.genMockFunction();

            event = jest.genMockFunction();
        });
        
        it('should call onFileNavigate if it is a folder', function () {
            file.isFolder.mockReturnValueOnce(true);
            expect(file.props.onFileNavigate.mock.calls.length).toBe(0);
            
            file.onFileNavigate(event);
            
            expect(file.props.onFileNavigate).toBeCalled();    
            expect(file.onFileEdit.mock.calls.length).toBe(0);
            
        });
        
        it('should call onFileEdit if it is a file', function () {
            file.isFolder.mockReturnValueOnce(false);
            expect(file.onFileEdit.mock.calls.length).toBe(0);
            
            file.onFileNavigate(event);
            
            expect(file.onFileEdit).toBeCalled();    
            expect(file.props.onFileNavigate.mock.calls.length).toBe(0);
        });
    });
    
    describe('onFileEdit()', function () {
        var file, event; 
        
        beforeEach(function () {
            props.onFileEdit = jest.genMockFunction();

            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            event = {
                stopPropagation: jest.genMockFunction()
            }
        });
        
        it('should stop propagation of the event', function () {
            file.onFileEdit(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
        
        it('should call file edit on props', function () {
            expect(file.props.onFileEdit.mock.calls.length).toBe(0);
            
            file.onFileEdit(event);
            
            expect(file.props.onFileEdit).toBeCalled();
        });
    });
    
    describe('onFileDelete()', function () {
        var file, event; 
        
        beforeEach(function () {
            props.onFileDelete = jest.genMockFunction();

            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            event = {
                stopPropagation: jest.genMockFunction()
            }
        });
        
        it('should stop propagation of the event', function () {
            file.onFileDelete(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
        
        it('should call file delete on props', function () {
            expect(file.props.onFileDelete.mock.calls.length).toBe(0);
            
            file.onFileDelete(event);
            
            expect(file.props.onFileDelete).toBeCalled();
        });
    });
    
    describe('onFileSelect()', function () {
        var file, event; 
        
        beforeEach(function () {
            props.onFileSelect = jest.genMockFunction();

            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            event = {
                stopPropagation: jest.genMockFunction()
            }
        });
        
        it('should stop propagation of the event', function () {
            file.onFileSelect(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
        
        it('should call file select on props', function () {
            expect(file.props.onFileSelect.mock.calls.length).toBe(0);
            
            file.onFileSelect(event);
            
            expect(file.props.onFileSelect).toBeCalled();
        });
    });
    
    describe('handleDoubleClick()', function () {
        var file, event; 
        
        beforeEach(function () {
            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            event = {
                target: 'target'
            }

            file.onFileNavigate = jest.genMockFunction();
            file.refs.title.getDOMNode = jest.genMockFunction();
        });
        
        it('should call onFileNavigate if the event target is correct', function () {
            file.refs.title.getDOMNode.mockReturnValueOnce('target');
            expect(file.onFileNavigate.mock.calls.length).toBe(0);
            
            file.handleDoubleClick(event);
            
            expect(file.onFileNavigate).toBeCalled();
        });
        
        it('should not call onFileNavigate if the event target is incorrect', function () {
            file.refs.title.getDOMNode.mockReturnValueOnce('notTarget');
            expect(file.onFileNavigate.mock.calls.length).toBe(0);

            file.handleDoubleClick(event);

            expect(file.onFileNavigate.mock.calls.length).toBe(0);
        });
    });
    
    describe('handleKeyDown()', function () {
        var file, event; 
        
        beforeEach(function () {
            document.body.innerHTML =
                '<div class="actions">' +
                '  <button class="item__actions__action" />' +
                '</div>';

            props.spaceKey = 32;
            props.returnKey = 13;

            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
            
            event = {
                stopPropagation: jest.genMockFunction(),
                preventDefault: jest.genMockFunction(),
                target: 'target'
            }
            
            file.onFileNavigate = jest.genMockFunction();
            React.findDOMNode = jest.genMockFunction();
        });
        
        it('should focus on the items buttons when space key is pressed', function () {
            React.findDOMNode.mockReturnValueOnce('target');
            React.findDOMNode.mockReturnValue($('.actions'));
            event.keyCode = 32;

            file.handleKeyDown(event);

            expect(event.preventDefault).toBeCalled();
            expect($('.item__actions__action').is(':focus')).toBe(true);
        });
        
        it('should navigate the item when return key is pressed', function () {
            React.findDOMNode.mockReturnValueOnce('target');
            event.keyCode = 13;
            expect(file.onFileNavigate.mock.calls.length).toBe(0);

            file.handleKeyDown(event);

            expect(file.onFileNavigate).toBeCalled();
        });
        
        it('should stop propagation of the event', function () {
            file.handleKeyDown(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
        
        it('should do nothing if the event does not come from the root element', function () {
            React.findDOMNode.mockReturnValueOnce('notTarget');
            
            file.handleKeyDown(event);
            
            expect(file.onFileNavigate.mock.calls.length).toBe(0);
        });
    });
    
    describe('handleFocus()', function () {
        
    });
    
    describe('handleBlur()', function () {
        
    });
    
    describe('preventFocus()', function () {
        var file, event;
        
        beforeEach(function () {
            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
            
            event = {
                preventDefault: jest.genMockFunction()
            }
        });
        
        it('should prevent the default behaviour of the event', function () {
            file.preventFocus(event);
            
            expect(event.preventDefault).toBeCalled();
        });
    });
    
    describe('isImageLargerThanThumbnail()', function () {
        var file;
        
        beforeEach(function () {
            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
        });
        
        it('should return true if the dimensions are larger than the default thumbnail size', function () {
            props.attributes.dimensions = {
                width: 1000,
                height: 1000
            }
            
            expect(file.isImageLargerThanThumbnail()).toBe(true);
        });
        
        it('should return false if the dimensions are smaller than the default thumbnail size', function () {
            expect(file.isImageLargerThanThumbnail()).toBe(false);
        });
    });
    
    describe('getItemClassNames()', function () {
        var file;
        
        beforeEach(function () {
            props.category = 'image';
            
            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
        });
        
        it('should return the file category', function () {
            expect(file.getItemClassNames()).toBe('item image');
        });
        
        it('should return foccussed if the foccussed state is true', function () {
            file.state.focussed = true;
            
            expect(file.getItemClassNames()).toContain('focussed');
        });
        
        it('should return selected if the selected prop is true', function () {
            file.props.selected = true;
            
            expect(file.getItemClassNames()).toContain('selected');
        });
    });
    
    describe('getThumbnailClassNames()', function () {
        var file;
        
        beforeEach(function () {
            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
            
            file.isImageLargerThanThumbnail = jest.genMockFunction();
        });
        
        it('should return "item__thumbnail"', function () {
            expect(file.getThumbnailClassNames()).toBe('item__thumbnail');
        });
        
        it('should return "item__thumbnail large" is isImageLargerThanThumbnail returns true', function () {
            file.isImageLargerThanThumbnail.mockReturnValueOnce(true);

            expect(file.getThumbnailClassNames()).toBe('item__thumbnail large');
        });
    });
    
    describe('getThumbnailStyles()', function () {
        var file;
        
        beforeEach(function () {
            props.url = 'myurl';
            
            file = TestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
        });
        
        it('should return backgroundImage with the correct url if the item is an image', function () {
            file.props.category = 'image';
            
            expect(JSON.stringify(file.getThumbnailStyles())).toBe('{"backgroundImage":"url(myurl)"}');
        });
        
        it('should return an empty object if the item is not an image', function () {
            file.props.category = 'notAnImage';
            
            expect(JSON.stringify(file.getThumbnailStyles())).toBe('{}');
        });
    });
});
