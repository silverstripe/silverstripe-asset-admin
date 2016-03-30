jest.dontMock('../index.js');

const React = require('react'),
    $ = require('jQuery'),
    ReactDom = require('react-dom'),
    i18n = require('i18n'),
    ReactTestUtils = require('react-addons-test-utils'),
    FileComponent = require('../index.js');

describe('FileComponent', function() {
    
    var props;

    beforeEach(function () {
        props = {
            id: 0,
            selected: false,
            handleToggleSelect: jest.genMockFunction(),
            handleActivate: jest.genMockFunction(),
            handleDelete: jest.genMockFunction(),
            item: {
                attributes: {
                    dimensions: {
                        width: 10,
                        height: 10
                    }
                },
                category: 'image',
                id: 1,
                title: 'test'
            }
        }
  });

    describe('handleActivate()', function () {
        var file, event;
        
        beforeEach(function () {
            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            event = {
                stopPropagation: jest.genMockFunction()
            }
        });
        
        it('should call props.handleActivate', function () {
            expect(file.props.handleActivate.mock.calls.length).toBe(0);
            
            file.handleActivate(event);
            
            expect(file.props.handleActivate).toBeCalled();
        });
        
        it('should stop propagation of the event', function () {
            file.handleActivate(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
    });
    
    describe('handleToggleSelect()', function () {
        var file, event;
        
        beforeEach(function () {
            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            event = {
                stopPropagation: jest.genMockFunction()
            }
        });
        
        it('should call props.handleToggleSelect', function () {
            expect(file.props.handleToggleSelect.mock.calls.length).toBe(0);
            
            file.handleToggleSelect(event);
            
            expect(file.props.handleToggleSelect).toBeCalled();
        });
        
        it('should stop propagation of the event', function () {
            file.handleToggleSelect(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
    });
    
    describe('getThumbnailStyles()', function () {
        var file;
        
        beforeEach(function () {
            props.item.url = 'myurl';
            
            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
        });
        
        it('should return backgroundImage with the correct url if the item is an image', function () {
            file.props.item.category = 'image';

            expect(JSON.stringify(file.getThumbnailStyles())).toBe('{"backgroundImage":"url(myurl)"}');
        });

        it('should return an empty object if the item is not an image', function () {
            file.props.item.category = 'notAnImage';
            
            expect(JSON.stringify(file.getThumbnailStyles())).toBe('{}');
        });
    });
    
    describe('getThumbnailClassNames()', function () {
        var file;

        beforeEach(function () {
            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
            
            file.isImageSmallerThanThumbnail = jest.genMockFunction();
        });

        it('should return "item__thumbnail"', function () {
            expect(file.getThumbnailClassNames()).toBe('item__thumbnail');
        });

        it('should return "item__thumbnail item__thumbnail--small" if isImageSmallerThanThumbnail returns true', function () {
            file.isImageSmallerThanThumbnail.mockReturnValueOnce(true);

            expect(file.getThumbnailClassNames()).toContain('item__thumbnail--small');
        });
    });

    describe('getItemClassNames()', function () {
        var file;
        
        it('should return the file\'s category', function () {
            props.item.category = 'image';

            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            expect(file.getItemClassNames()).toContain('item--image');
        });
        
        it('should return selected if the selected prop is true', function () {
            props.selected = true;

            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );

            expect(file.getItemClassNames()).toContain('item--selected');
        });
    });

    describe('isImageSmallerThanThumbnail()', function () {
        var file;
        
        beforeEach(function () {
            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
        });
        
        it('should return true if the dimensions are smaller than the default thumbnail size', function () {
            expect(file.isImageSmallerThanThumbnail()).toBe(true);
        });
        
        it('should return false if the dimensions are larger than the default thumbnail size', function () {
            props.item.attributes.dimensions = {
                width: 1000,
                height: 1000
            }

            expect(file.isImageSmallerThanThumbnail()).toBe(false);
        });
    });

    describe('handleKeyDown()', function () {
        var file, event; 
        
        beforeEach(function () {
            props.spaceKey = 32;
            props.returnKey = 13;

            file = ReactTestUtils.renderIntoDocument(
                <FileComponent {...props} />
            );
            
            event = {
                stopPropagation: jest.genMockFunction(),
                preventDefault: jest.genMockFunction()
            }
            
            file.handleToggleSelect = jest.genMockFunction();
            file.handleActivate = jest.genMockFunction();
        });
        
        it('should trigger handleToggleSelect when the space key is pressed', function () {
            event.keyCode = 32;
            expect(file.handleToggleSelect.mock.calls.length).toBe(0);

            file.handleKeyDown(event);

            expect(file.handleToggleSelect).toBeCalled();
        });
        
        it('should trigger handleActivate when the return key is pressed', function () {
            event.keyCode = 13;
            expect(file.handleActivate.mock.calls.length).toBe(0);

            file.handleKeyDown(event);

            expect(file.handleActivate).toBeCalled();
        });
        
        it('should stop propagation of the event', function () {
            file.handleKeyDown(event);
            
            expect(event.stopPropagation).toBeCalled();
        });
        
        it('should prevent the default behaviour of the event', function () {
            file.handleKeyDown(event);
            
            expect(event.preventDefault).toBeCalled();
        });
    });
    
    describe('preventFocus()', function () {
        var file, event;
        
        beforeEach(function () {
            file = ReactTestUtils.renderIntoDocument(
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
});
