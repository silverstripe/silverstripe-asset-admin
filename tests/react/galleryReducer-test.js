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
    
    describe('SET_EDITING', () => {
        it('should start editing the given file', () => {
			const initialState = {
				editing: false
			};

			const nextState = galleryReducer(initialState, { 
				type: 'SET_EDITING',
				payload: { id: 1 }
			});

            expect(JSON.stringify(nextState.editing)).toBe(JSON.stringify({id:1}));
		});
		
		it('should stop editing', () => {
			const initialState = {
				editing: { id: 1 }
			};

			const nextState = galleryReducer(initialState, { 
				type: 'SET_EDITING',
                payload: false
			});

			expect(nextState.editing).toBe(false);
		});
	});
    
    describe('SET_FOCUS', () => {
        it('should set focus the given file', () => {
			const initialState = {
				focus: false
			};

			const nextState = galleryReducer(initialState, { 
				type: 'SET_FOCUS',
				payload: { id: 1 }
			});

            expect(nextState.focus).toBe(1);
		});
		
		it('should remove', () => {
			const initialState = {
				focus: 1
			};

			const nextState = galleryReducer(initialState, { 
				type: 'SET_FOCUS',
                payload: { id: false }
			});

			expect(nextState.focus).toBe(false);
		});
	});
});