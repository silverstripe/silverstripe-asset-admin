jest.dontMock('deep-freeze');
jest.dontMock('../../javascript/src/state/action-types.js');
jest.dontMock('../../javascript/src/state/selected-files/reducer.js');

var selectedFilesReducer = require('../../javascript/src/state/selected-files/reducer.js');

describe('selectedFilesReducer', () => {

	describe('SELECTED_FILES', () => {
        const type = 'SELECTED_FILES.SELECT_FILE';
		const payload = { id: 1 };
        
        it('should add the file to selectedFiles state', () => {
			const initialState = {
				selectedFiles: []
			};

			const newState = selectedFilesReducer(initialState, { type, payload });

            expect(newState.selectedFiles.length).toBe(1);
		});
		
		it('should remove the file from selectedFiles state', () => {
			const initialState = {
				selectedFiles: [1]
			};

			const newState = selectedFilesReducer(initialState, { type, payload });

			expect(newState.selectedFiles.length).toBe(0);
		});
	});
});