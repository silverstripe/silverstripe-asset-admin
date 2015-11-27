jest.dontMock('../../../public/src/component/gallery-component.js');


describe('GalleryComponent', function() {

	var React = require('react/addons'),
		TestUtils = React.addons.TestUtils,
		GalleryComponent = require('../../../public/src/component/gallery-component.js'),
		props;
		
	beforeEach(function () {
		props = {
			current_folder: '',
			initial_folder: '',
			name: 'Files'
		}
	});

	describe('getBackButton()', function () {
		var gallery;

		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {}
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);
		});

		it('should not return a back button if we\'re at the top level', function () {
			expect(gallery.getBackButton()).toBe(null);
		});

		it('should return a back button if we\'re in a folder.', function () {
			var button;

			gallery.folders.push('Uploads');

			button = gallery.getBackButton();

			expect(button).not.toBe(null);
			expect(button.type).toBe('button');
			expect(button.ref).toBe('backButton')
		});
	});

	describe('getMoreButton()', function () {
		var gallery;
		
		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {}
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);

			gallery.state.files = ['file1', 'file2'];
		});
		
		it('should not show the load more button when all items have been loaded', function () {
			gallery.state.count = 2;

			expect(gallery.getMoreButton()).toBe(null);
		});

		it('should show when not all items have been loaded', function () {
			var button;
			gallery.state.count = 3;

			button = gallery.getMoreButton();

			expect(button).not.toBe(null);
			expect(button.type).toBe('button');
			expect(button.props.className).toBe('gallery__load__more');
		});
	});

	describe('onCancel()', function () {
		var gallery;
		
		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {}
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);
		});
		
		it('should set the editing state to null', function () {
			
		});
	});

	describe('onFileDelete()', function () {
		var gallery, event, file;
		
		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {},
				delete: jest.genMockFunction()
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);

			event = {
				stopPropagation: jest.genMockFunction()
			};
			
			file = {id: 1}
		});
		
		it('should request to remove the item from the backend', function () {
			var mock = jest.genMockFunction(),
				originalConfirm = window.confirm;
			mock.mockReturnValueOnce(true);
			window.confirm = mock;
			expect(gallery.props.backend.delete.mock.calls.length).toBe(0);
			
			gallery.onFileDelete(file, event);
			
			expect(gallery.props.backend.delete).toBeCalled();
			expect(gallery.props.backend.delete.mock.calls).toContain([1])
			window.confirm = originalConfirm;
		});
		
		it('should stop propagation of the event', function () {
			gallery.onFileDelete('file1', event);
			
			expect(event.stopPropagation).toBeCalled();
		});
	});

	describe('onFileEdit()', function () {
		var gallery, event;
		
		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {}
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);

			event = {
				stopPropagation: jest.genMockFunction()
			};
		});
		
		it('should set set the editing state to the given file', function () {
			
		});
		
		it('should stop propagation of the event', function () {
			gallery.onFileEdit('file1', event);
			
			expect(event.stopPropagation.mock.calls.length).toBe(1);
		});
	});

	describe('onFileNavigate()', function () {
		var gallery;
		
		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {},
				navigate: jest.genMockFunction()
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);
		});
		
		it('should add the given folder to the folders array', function () {
			gallery.folders = [];

			gallery.onFileNavigate( {filename: 'folder1'} );

			expect(gallery.folders[0]).toBe('folder1');
		});
		
		it('should request to navigate in the backend', function () {
			expect(gallery.props.backend.navigate.mock.calls.length).toBe(0);
			
			gallery.onFileNavigate('folder1');
			
			expect(gallery.props.backend.navigate).toBeCalled();
		});
		
		it('should set the state of selectedFiles to an empty array', function () {
		    
		});
	});

	describe('onNavigate()', function () {
		var gallery;

		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {},
				navigate: jest.genMockFunction()
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);
		});

		it('should add the given folder to gallery.folders', function() {
			gallery.folders = [];

			gallery.onNavigate('folder1');

			expect(gallery.folders[0]).toBe('folder1');
		});

		it('should should request to navigate in the backend', function() {
			expect(gallery.props.backend.navigate.mock.calls.length).toBe(0);

			gallery.onNavigate('folder1');

			expect(gallery.props.backend.navigate).toBeCalled();
		});
	});
	
	describe('onMoreClick()', function () {
		var gallery, event;

		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {},
				more: jest.genMockFunction()
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);
			
			event = {
				stopPropagation: jest.genMockFunction(),
				preventDefault: jest.genMockFunction()
			};
		});

		it('should request more items from the backend', function () {
			expect(gallery.props.backend.more.mock.calls.length).toBe(0);

			gallery.onMoreClick(event);
			
			// onMoreClick should call backend.more to get more items.
			expect(gallery.props.backend.more).toBeCalled();
		});
		
		it('should stop propagation of the event', function () {
			gallery.onMoreClick(event);
			
			expect(event.stopPropagation).toBeCalled();
		});
		
		it('should prevent the default event behaviour', function () {
			gallery.onMoreClick(event);
			
			expect(event.preventDefault).toBeCalled();
		});
	});

	describe('onBackClick()', function () {
		var gallery, event;
		
		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {},
				navigate: jest.genMockFunction()
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);
			
			event = {
				preventDefault: jest.genMockFunction()
			};
			
			gallery.folders = ['folder1', 'folder2'];
		});

		it('should remove one item from the end of the gallery.folders array', function () {
			gallery.onBackClick(event);

			expect(JSON.stringify(gallery.folders)).toBe('["folder1"]');
		});

		it('should request to navigate the folder at the end of the gallery.folders array', function () {
			expect(gallery.props.backend.navigate.mock.calls.length).toBe(0);

			gallery.onBackClick(event);

			expect(gallery.props.backend.navigate).toBeCalled();
			expect(gallery.props.backend.navigate.mock.calls).toContain(["folder1"]);
		});
		
		it('should set the state of selectedFiles to an empty array', function () {
			
		});
		
		it('should prevent the default event behaviour', function () {
			gallery.onBackClick(event);

			expect(event.preventDefault).toBeCalled();
		});
	});

	describe('onFileSave()', function () {
		var gallery, event;

		beforeEach(function () {
			props.backend = {
				on: function () {},
				search: function () {},
				save: jest.genMockFunction()
			};

			gallery = TestUtils.renderIntoDocument(
				<GalleryComponent {...props} />
			);

			event = {
				stopPropagation: jest.genMockFunction(),
				preventDefault: jest.genMockFunction()
			};
		});

		it('should request to save from the backend', function() {
			expect(gallery.props.backend.save.mock.calls.length).toBe(0);

			gallery.onFileSave('1', 'editing', event);

			expect(gallery.props.backend.save).toBeCalled();
			expect(gallery.props.backend.save.mock.calls).toContain(['1', 'editing']);
		});

		it('should prevent the default event behaviour', function () {
			gallery.onFileSave('1', 'editing', event);

			expect(event.preventDefault).toBeCalled();
		});

		it('should stop propagation of the event', function () {
			gallery.onFileSave('1', 'editing', event);

			expect(event.stopPropagation).toBeCalled();
		});
	});
});
