import $ from 'jQuery';
import Events from 'events';

export default class FileBackend extends Events {

	constructor(getFilesByParentID_url, getFilesBySiblingID_url, search_url, update_url, delete_url, limit, bulkActions, $folder, currentFolder) {
		super();

		this.getFilesByParentID_url = getFilesByParentID_url;
		this.getFilesBySiblingID_url = getFilesBySiblingID_url;
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
	getFilesByParentID(id) {
		if (typeof id === 'undefined') {
			return;
		}

		this.page = 1;

		return this.request('POST', this.getFilesByParentID_url, { id: id, limit: this.limit }).then((json) => {
			this.emit('onFetchData', json);
		});
	}

	/**
	 * @func getFilesBySiblingID
	 * @param number id - the id of the file to get the siblings from.
	 * @desc Fetches a collection of sibling files given an id.
	 */
	getFilesBySiblingID(id) {
		if (typeof id === 'undefined') {
			return;
		}
		
		this.page = 1;

		return this.request('POST', this.getFilesBySiblingID_url, { id: id, limit: this.limit }).then((json) => {
			this.emit('onFetchData', json);
		});
	}

	search() {
		this.page = 1;

		return this.request('GET', this.search_url).then((json) => {
			this.emit('onSearchData', json);
		});
	}

	more() {
		this.page++;

		return this.request('GET', this.search_url).then((json) => {
			this.emit('onMoreData', json);
		});
	}

	navigate(folder) {
		this.page = 1;
		this.folder = folder;

		this.persistFolderFilter(folder);

		return this.request('GET', this.search_url).then((json) => {
			this.emit('onNavigateData', json);
		});
	}

	persistFolderFilter(folder) {
		if (folder.substr(-1) === '/') {
			folder = folder.substr(0, folder.length - 1);
		}

		this.$folder.val(folder);
	}

	/**
	 * Deletes files on the server based on the given ids
	 *
	 * @param array ids - an array of file ids to delete on the server
	 * @returns object - promise
	 */
	delete(ids) {
		return this.request('DELETE', this.delete_url, {
			'ids': ids
		}).then(() => {
			this.emit('onDeleteData', ids);
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
		var updates = { id };

		values.forEach(field => {
			updates[field.name] = field.value;
		});

		return this.request('POST', this.update_url, updates).then(() => {
			this.emit('onSaveData', id, updates);
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
			'type': method, // compat with jQuery 1.7
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
