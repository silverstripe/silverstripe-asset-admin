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

	componentDidMount() {
		this.props.store.on('onSearchData', (data) => {
			this.setState({
				'count': data.count,
				'files': data.files
			});
		});

		this.props.store.on('onMoreData', (data) => {
			this.setState({
				'count': data.count,
				'files': this.state.files.concat(data.files)
			});
		});

		this.props.store.on('onNavigateData', (data) => {
			this.setState({
				'count': data.count,
				'files': data.files
			});
		});

		this.props.store.on('onDeleteData', (data) => {
			this.setState({
				'files': this.state.files.filter((file) => {
					return data !== file.id;
				})
			});
		});

		if (this.props.initial_folder !== this.props.current_folder) {
			this.onNavigate(this.props.current_folder);
		} else {
			this.props.store.emit('search');
		}
	}

	render() {
		if (this.state.editing) {
			return <div className='gallery'>
				<EditorComponent file={this.state.editing}
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
			moreButton = <button onClick={this.onMoreClick.bind(this)}>more</button>;
		}

		var backButton = null;

		if (this.folders.length > 1) {
			backButton = <button
				className='ss-ui-button ui-corner-all font-icon-level-up'
				onClick={this.onBackClick.bind(this)}>Back</button>;
		}

		return <div className='gallery'>
			<div className='gallery__header'>
				{backButton}
				<div className="gallery__header__sort fieldholder-small" style={{width: '160px'}}>
					<select className="dropdown no-change-track">
						{sortButtons}
					</select>
				</div>
			</div>
			<div className='gallery__items'>
				{fileComponents}
			</div>
			{moreButton}
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
			this.props.store.emit('delete', file.id);
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
		this.props.store.emit('navigate', file.filename);
	}

	onNavigate(folder) {
		this.folders.push(folder);
		this.props.store.emit('navigate', folder);
	}

	onMoreClick() {
		this.props.store.emit('more');
	}

	onBackClick() {
		if (this.folders.length > 1) {
			this.folders.pop();
			this.props.store.emit('navigate', this.folders[this.folders.length - 1]);
		}
	}
}
