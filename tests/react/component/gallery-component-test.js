// jest.dontMock('../../../public/src/component/gallery-component.js');
// 
// describe('GalleryComponent', function() {
// 
// 	var React = require('react/addons'),
// 		TestUtils = React.addons.TestUtils,
// 		GalleryComponent = require('../../../public/src/component/gallery-component.js'),
// 		props;
// 
// 	beforeEach(function () {
// 		props = {
// 			current_folder: '',
// 			initial_folder: '',
// 			name: 'Files'
// 		};
// 	});
// 
// 	describe('getBackButton()', function () {
// 		var gallery;
// 
// 		beforeEach(function () {
// 			props.backend = {
// 				on: function () {},
// 				search: function () {}
// 			};
// 
// 			gallery = TestUtils.renderIntoDocument(
// 				<GalleryComponent {...props} />
// 			);
// 		});
// 
// 		it('should not return a back button it we\'re at the top level', function () {
// 			expect(gallery.getBackButton()).toBe(null);
// 		});
// 
// 		it('should return a back button if we\'re in a folder.', function () {
// 			var button;
// 
// 			gallery.folders.push('Uploads');
// 
// 			button = gallery.getBackButton();
// 
// 			expect(button).not.toBe(null);
// 			expect(button.type).toBe('button');
// 			expect(button.ref).toBe('backButton')
// 		});
// 	});
// 
// 	describe('getMoreButton()', function () {
// 
// 	});
// 
// 	describe('getMoreButton()', function () {
// 
// 	});
// 
// 	describe('onCancel()', function () {
// 
// 	});
// 
// 	describe('onCancel()', function () {
// 
// 	});
// 
// 	describe('onFileDelete()', function () {
// 
// 	});
// 
// 	describe('onFileEdit()', function () {
// 
// 	});
// 
// 	describe('onFileNavigate()', function () {
// 
// 	});
// 
// 	describe('onNavigate()', function () {
// 
// 	});
// 
// 	describe('onMoreClick()', function () {
// 
// 	});
// 
// 	describe('onBackClick()', function () {
// 
// 	});
// 
// 	describe('onFileSave()', function () {
// 
// 	});
// });
