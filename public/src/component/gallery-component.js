import $ from 'jquery';
import React from 'react';
import FileComponent from './file-component';
import EditorComponent from './editor-component';

export default class extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			'files': [],
			'editing': null
		};

		this.folders = [props.initial_folder];

		this.sort = 'name';
		this.direction = 'asc';
	}

	getListeners() {
		return {
			'onSearchData': (data) => {
				this.setState({
					'count': data.count,
					'files': data.files
				});
			},
			'onMoreData': (data) => {
				this.setState({
					'count': data.count,
					'files': this.state.files.concat(data.files)
				});
			},
			'onNavigateData': (data) => {
				this.setState({
					'count': data.count,
					'files': data.files
				});
			},
			'onDeleteData': (data) => {
				this.setState({
					'files': this.state.files.filter((file) => {
						return data !== file.id;
					})
				});
			},
			'onSaveData': (id, values) => {
				let files = this.state.files;

				files.forEach((file) => {
					if (file.id == id) {
						file.title = values.title;
						file.basename = values.basename;
					}
				});

				this.setState({
					'files': files,
					'editing': false
				});
			}
		};
	}

	componentDidMount() {
		let listeners = this.getListeners();

		for (let event in listeners) {
			this.props.backend.on(event, listeners[event]);
		}

		if (this.props.initial_folder !== this.props.current_folder) {
			this.onNavigate(this.props.current_folder);
		} else {
			this.props.backend.emit('search');
		}
	}

	componentWillUnmount() {
		let listeners = this.getListeners();

		for (let event in listeners) {
			this.props.backend.removeListener(event, listeners[event]);
		}
	}

	render() {
		if (this.state.editing) {
			return <div className='gallery'>
				<EditorComponent file={this.state.editing}
					onFileSave={this.onFileSave.bind(this)}
					onListClick={this.onListClick.bind(this)} />
			</div>
		}

		let fileComponents = this.getFileComponents();

		let sorts = [
			{'field': 'title', 'direction': 'asc', 'label': 'title a-z'},
			{'field': 'title', 'direction': 'desc', 'label': 'title z-a'},
			{'field': 'created', 'direction': 'desc', 'label': 'newest'},
			{'field': 'created', 'direction': 'asc', 'label': 'oldest'}
		];

		let sortButtons = sorts.map((sort) => {
			let onSort = () => {
				let folders = this.state.files.filter(file => file.type === 'folder');
				let files = this.state.files.filter(file => file.type !== 'folder');

				let comparator = (a, b) => {
					if (sort.direction === 'asc') {
						if (a[sort.field] < b[sort.field]) {
							return -1;
						}

						if (a[sort.field] > b[sort.field]) {
							return 1;
						}
					} else {
						if (a[sort.field] > b[sort.field]) {
							return -1;
						}

						if (a[sort.field] < b[sort.field]) {
							return 1;
						}
					}

					return 0;
				};

				this.setState({
					'files': folders.sort(comparator).concat(files.sort(comparator))
				});
			};

			return <option onClick={onSort}>{sort.label}</option>;
		});

		var moreButton = null;

		if (this.state.count > this.state.files.length) {
			moreButton = <button className="gallery__load__more" onClick={this.onMoreClick.bind(this)}>Load more</button>;
		}

		var backButton = null;

		if (this.folders.length > 1) {
			backButton = <button
				className='ss-ui-button ui-button ui-widget ui-state-default ui-corner-all font-icon-level-up'
				onClick={this.onBackClick.bind(this)}>Back</button>;
		}

		return <div className='gallery'>
			{backButton}
			<div className="gallery__sort fieldholder-small" style={{width: '160px'}}>
				<select className="dropdown no-change-track">
					{sortButtons}
				</select>
			</div>
			<div className='gallery__items'>
				{fileComponents}
			</div>
			<div className="gallery__load">
				{moreButton}
			</div>
		</div>;
	}

	onListClick() {
		this.setState({
			'editing': null
		});
	}

	getFileComponents() {
		return this.state.files.map((file) => {
			return <FileComponent
					{...file}
					onFileDelete={this.onFileDelete.bind(this)}
					onFileEdit={this.onFileEdit.bind(this)}
					onFileNavigate={this.onFileNavigate.bind(this)}
			/>;
		});
	}

	onFileDelete(file, event) {
		event.stopPropagation();

		if (confirm('Are you sure you want to delete this record?')) {
			this.props.backend.emit('delete', file.id);
		}
	}

	onFileEdit(file, event) {
		event.stopPropagation();

		this.setState({
			'editing': file
		});
	}

	onFileNavigate(file) {
		this.folders.push(file.filename);
		this.props.backend.emit('navigate', file.filename);
	}

	onNavigate(folder) {
		this.folders.push(folder);
		this.props.backend.emit('navigate', folder);
	}

	onMoreClick(event) {
		event.preventDefault(); //Prevent submission of insert media dialog
		this.props.backend.emit('more');
	}

	onBackClick(event) {
		event.preventDefault(); //Prevent submission of insert media dialog
		if (this.folders.length > 1) {
			this.folders.pop();
			this.props.backend.emit('navigate', this.folders[this.folders.length - 1]);
		}
	}

	onFileSave(id, state, event) {
		this.props.backend.emit('save', id, state);

		event.stopPropagation();
		event.preventDefault();
	}
}
