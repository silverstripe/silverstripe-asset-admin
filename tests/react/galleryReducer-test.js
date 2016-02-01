jest.dontMock('deep-freeze');
jest.dontMock('../../javascript/src/state/action-types.js');
jest.dontMock('../../javascript/src/state/gallery/reducer.js');

var galleryReducer = require('../../javascript/src/state/gallery/reducer.js');

describe('galleryReducer', () => {

    describe('ADD_FILE', () => {
        const type = 'ADD_FILE';
        const payload = { id: 1 };

        it('should add the file to state', () => {
            const initialState = {
                files: []
            };

            const nextState = galleryReducer(initialState, { type, payload });

            expect(nextState.files.length).toBe(1);
        });
    });

    describe('SELECT_FILE', () => {
        const type = 'SELECT_FILE';
        const payload = { id: 1 };
        
        it('should add the file to selectedFiles state', () => {
            const initialState = {
                selectedFiles: []
            };

            const nextState = galleryReducer(initialState, { type, payload });

            expect(nextState.selectedFiles.length).toBe(1);
        });
        
        it('should remove the file from selectedFiles state', () => {
            const initialState = {
                selectedFiles: [1]
            };

            const nextState = galleryReducer(initialState, { type, payload });

            expect(nextState.selectedFiles.length).toBe(0);
        });
    });
});