import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'state/configureStore';
import AssetAdminContainer from 'sections/asset-admin/controller';
import backend from 'silverstripe-backend';

/**
 * Return an API caller for the given endpoint, using the given backend
 * Returns a lambda that takes an object payload returns a promise.
 * The promise will output another object payload as the argument passed to then()
 */
function apiCallerFromEndpoint(endpoint) {
  function serialize(obj) {
    const str = [];
    let p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
      }
    }
    return str.join('&');
  }

  return (data) => {
    let url = endpoint.url;
    let backendData = data;

    if (endpoint.method === 'get' && (endpoint.payloadFormat || 'urlencoded') === 'urlencoded') {
      url += `?${serialize(data)}`;
      backendData = null;
    }

    let backendString = '';
    switch (endpoint.payloadFormat || 'urlencoded') {
      case 'urlencoded':
        backendString = serialize(backendData);
        break;
      case 'json':
        backendString = JSON.stringify(backendData);
        break;
      default:
        throw new Error(`Unknown payloadFormat: '${endpoint.payloadFormat}'`);

    }

    return backend[endpoint.method](url, backendString)
      .then(response => response.json());
  };
}

$.entwine('ss', () => {
  $('.asset-gallery-component-wrapper').entwine({
    onadd() {
      const store = configureStore();

      // Build API callers from the URLs provided to us in the div
      // In time, something like a GraphQL endpoint might be a better way to run

      const filesByParentApi = apiCallerFromEndpoint({
        method: 'get',
        url: this.data('asset-gallery-files-by-parent-url'),
      });

      const deleteApi = apiCallerFromEndpoint({
        method: 'delete',
        url: this.data('asset-gallery-delete-url'),
      });

      const addFolderApi = apiCallerFromEndpoint({
        method: 'post',
        url: this.data('asset-gallery-add-folder-url'),
      });

      const limit = this.data('asset-gallery-limit');
      const bulkActions = this.data('asset-gallery-bulk-actions');

      const name = $('.asset-gallery').data('asset-gallery-name');
      const section = 'SilverStripe\\AssetAdmin\\Controller\\AssetAdmin';

      // TODO
      // filesBySiblingApi={filesBySiblingApi}
      // searchApi={searchApi}
      // updateApi={updateApi}

      ReactDOM.render(
        <Provider store={store}>
          <AssetAdminContainer
            name={name}
            limit={limit}
            bulkActions={!!bulkActions}

            filesByParentApi={filesByParentApi}
            addFolderApi={addFolderApi}
            deleteApi={deleteApi}
            sectionConfigKey={section}
          />
        </Provider>,
        this[0]
      );
    },
    onremove() {
      ReactDOM.unmountComponentAtNode(this[0]);
    },
  });
});
