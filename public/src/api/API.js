import $ from 'jquery';

export default {
	_urls: {},

	setURLs (urls) {
		this._urls = urls;
	},

	getFolderData (params, onComplete) {
		$.ajax({
			url: this._urls.data_url,
			dataType: 'json',
			data: params,
			success: onComplete
		});
	},

	destroyItem (id, onComplete) {
		$.ajax({
			url: this._urls.delete_url,
			data: {id},
			dataType: 'json',
			method: 'GET',
			success: onComplete
		}); 
	}
}