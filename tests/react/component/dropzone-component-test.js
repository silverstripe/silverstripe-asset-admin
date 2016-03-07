jest.dontMock('../../../javascript/src/components/dropzone/index.js');
jest.dontMock('dropzone');

const React = require('react'),
    ReactDOM = require('react-dom'),
    i18n = require('i18n'),
    ReactTestUtils = require('react-addons-test-utils'),
    DropzoneComponent = require('../../../javascript/src/components/dropzone/index.js');

describe('DropzoneComponent', () => {

    var props;

    beforeEach(() => {
        props = {
            options: {
                url: 'upload'
            }
        }
    });

    describe('constructor()', () => {
        var Dropzone;

        beforeEach(function () {
            Dropzone = ReactTestUtils.renderIntoDocument(
                <DropzoneComponent {...props} />
            );
        });

        it('should set this.dropzone to null', () => {
            Dropzone.dropzone = 1;
            Dropzone.constructor(props);

            expect(Dropzone.dropzone).toBe(null);
        });
        
        it('should call translateDefaultMessages()', () => {
            Dropzone.translateDefaultMessages = jest.genMockFunction();
            Dropzone.constructor(props);
    
            expect(Dropzone.translateDefaultMessages).toBeCalled();
        });
    });
    
    describe('componentDidMount()', () => {
        var Dropzone;

        beforeEach(() => {
            props.promptOnRemove = 'prompt';

            Dropzone = ReactTestUtils.renderIntoDocument(
                <DropzoneComponent {...props} />
            );
        });

        it('should set this.dropzone to a new Dropzone', () => {
            expect(Dropzone.dropzone.options.url).toBe('upload');
        });
        
        it('should call setPromptOnRemove if props.promptOnRemove is set', () => {
            expect(Dropzone.dropzone.options.dictRemoveFileConfirmation).toBe('prompt');
        });
    });

    describe('componentWillUnmount()', () => {
        var Dropzone;

        beforeEach(() => {
            Dropzone = ReactTestUtils.renderIntoDocument(
                <DropzoneComponent {...props} />
            );
        });
        
        it('should remove all dropzone listeners', () => {
            Dropzone.dropzone.disable = jest.genMockFunction();
            Dropzone.componentWillUnmount();
            
            expect(Dropzone.dropzone.disable).toBeCalled();
            
        });
    });
    
    describe('render()', () => {
        var Dropzone;

        beforeEach(() => {
            Dropzone = ReactTestUtils.renderIntoDocument(
                <DropzoneComponent {...props} />
            );
        });

        it('should return an upload button', () => {
            expect(Dropzone.render().props.type).toBe('button');
            expect(Dropzone.render().props.children).toContain('Upload');
        });
    });

    describe('handleAddedFile()', () => {
    });

    describe('setPromptOnRemove()', () => {
        var Dropzone;

        beforeEach(() => {
            Dropzone = ReactTestUtils.renderIntoDocument(
                <DropzoneComponent {...props} />
            );
        });
        
        it('should set dropzone.options.dictRemoveFileConfirmation to the given string', () => {
            Dropzone.setPromptOnRemove('prompt');
            
            expect(Dropzone.dropzone.options.dictRemoveFileConfirmation).toBe('prompt')
        });
    });

    describe('translateDefaultMessages()', () => {
    });
});
