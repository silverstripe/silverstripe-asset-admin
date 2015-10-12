import $ from 'jquery';
import Events from 'events';

export default class FileStore extends Events {
	static create(...parameters) {
		return new FileStore(...parameters);
	}

	constructor(search_url, update_url, delete_url, limit, $folder) {
		super();

		this.search_url = search_url;
		this.update_url = update_url; // @todo
		this.delete_url = delete_url;
		this.limit = limit;
		this.$folder = $folder;

		this.page = 1;
	}

	addEventListeners() {
		this.on('search', this.onSearch.bind(this));
		this.on('more', this.onMore.bind(this));
		this.on('navigate', this.onNavigate.bind(this));
		this.on('delete', this.onDelete.bind(this));
		this.on('filter', this.onFilter.bind(this));

		return this;
	}

	removeEventListeners() {
		this.removeListener('search');
		this.removeListener('more');
		this.removeListener('navigate');
		this.removeListener('delete');
		this.removeListener('filter');

		return this;
	}

	onSearch() {
		this.page = 1;

		this.request('GET', this.search_url).then((json) => {
			this.emit('onSearchData', json);
		});
	}

	onMore() {
		this.page++;

		this.request('GET', this.search_url).then((json) => {
			this.emit('onMoreData', json);
		});
	}

	onNavigate(folder) {
		this.page = 1;
		this.folder = folder;

		this.persistFolderFilter(folder);

		this.request('GET', this.search_url).then((json) => {
			this.emit('onNavigateData', json);
		});
	}

	persistFolderFilter(folder) {
		if (folder.substr(-1) === '/') {
			folder = folder.substr(0, folder.length - 1);
		}

		this.$folder.val(folder);
	}

	onDelete(id) {
		this.request('GET', this.delete_url, {
			'id': id
		}).then(() => {
			this.emit('onDeleteData', id);
		});
	}

	onFilter(name, type, folder, createdFrom, createdTo, onlySearchInFolder) {
		this.name = name;
		this.type = type;
		this.folder = folder;
		this.createdFrom = createdFrom;
		this.createdTo = createdTo;
		this.onlySearchInFolder = onlySearchInFolder;

		this.onSearch();
	}

	request(method, url, data = {}) {
		let defaults = {
			'limit': this.limit,
			'page': this.page,
		};

		if (this.name && this.name.trim() !== '') {
			defaults.name = decodeURIComponent(this.name);
		}

		if (this.folder && this.folder.trim() !== '') {
			defaults.folder = decodeURIComponent(this.folder);
		}

		if (this.createdFrom && this.createdFrom.trim() !== '') {
			defaults.createdFrom = decodeURIComponent(this.createdFrom);
		}

		if (this.createdTo && this.createdTo.trim() !== '') {
			defaults.createdTo = decodeURIComponent(this.createdTo);
		}

		if (this.onlySearchInFolder && this.onlySearchInFolder.trim() !== '') {
			defaults.onlySearchInFolder = decodeURIComponent(this.onlySearchInFolder);
		}

		this.showLoadingIndicator();

		return $.ajax({
			'url': url,
			'method': method,
			'dataType': 'json',
			'data': $.extend(data, defaults)
		}).always(() => {
			this.hideLoadingIndicator();
		});
	}

	showLoadingIndicator() {
		$('.cms-content').addClass('loading');
	}

	hideLoadingIndicator() {
		$('.cms-content').removeClass('loading');
	}
}
