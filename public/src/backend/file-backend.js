import $ from 'jquery';
import Events from 'events';

export default class FileBackend extends Events {
	static create(...parameters) {
		return new FileBackend(...parameters);
	}

	constructor(fetch_url, search_url, update_url, delete_url, limit, bulkActions, $folder, currentFolder) {
		super();

		this.fetch_url = fetch_url;
		this.search_url = search_url;
		this.update_url = update_url;
		this.delete_url = delete_url;
		this.limit = limit;
		this.bulkActions = bulkActions;
		this.$folder = $folder;
		this.folder = currentFolder;

		this.page = 1;
	}

	/**
	 * @func fetch
	 * @param number id
	 * @desc Fetches a collection of Files by ParentID.
	 */
	fetch(id) {
		if (typeof id === 'undefined') {
			return;
		}

		this.page = 1;

		this.request('POST', this.fetch_url, { id: id }).then((json) => {
			this.emit('onFetchData', json);
		});
	}

	search() {
		this.page = 1;

		this.request('GET', this.search_url).then((json) => {
			this.emit('onSearchData', json);
		});
	}

	more() {
		this.page++;

		this.request('GET', this.search_url).then((json) => {
			this.emit('onMoreData', json);
		});
	}

	navigate(folder) {
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

	delete(ids) {
		var filesToDelete = [];

		// Allows users to pass one or more ids to delete.
		if (Object.prototype.toString.call(ids) !== '[object Array]') {
			filesToDelete.push(ids);
		} else {
			filesToDelete = ids;
		}

		this.request('GET', this.delete_url, {
			'ids': filesToDelete
		}).then(() => {
			// Using for loop cos IE10 doesn't handle 'for of',
			// which gets transcompiled into a function which uses Symbol,
			// the thing IE10 dies on.
			for (let i = 0; i < filesToDelete.length; i += 1) {
				this.emit('onDeleteData', filesToDelete[i]);
			}
		});
	}

	filter(name, type, folder, createdFrom, createdTo, onlySearchInFolder) {
		this.name = name;
		this.type = type;
		this.folder = folder;
		this.createdFrom = createdFrom;
		this.createdTo = createdTo;
		this.onlySearchInFolder = onlySearchInFolder;

		this.search();
	}

	save(id, values) {
		values['id'] = id;

		this.request('POST', this.update_url, values).then(() => {
			this.emit('onSaveData', id, values);
		});
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
			'type': method,
			'method': method,
			'dataType': 'json',
			'data': $.extend(defaults, data)
		}).always(() => {
			this.hideLoadingIndicator();
		});
	}

	showLoadingIndicator() {
		$('.cms-content, .ui-dialog').addClass('loading');
		$('.ui-dialog-content').css('opacity', '.1');
	}

	hideLoadingIndicator() {
		$('.cms-content, .ui-dialog').removeClass('loading');
		$('.ui-dialog-content').css('opacity', '1');
	}
}
