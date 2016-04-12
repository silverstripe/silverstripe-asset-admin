import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'state/configureStore';
import AssetAdminContainer from 'sections/asset-admin/controller';
import backend from 'silverstripe-backend';

$.entwine('ss', () => {
  $('.asset-gallery-component-wrapper').entwine({
    onadd() {
      const store = configureStore();

      // Build API callers from the URLs provided to us in the div
      // In time, something like a GraphQL endpoint might be a better way to run

      const filesByParentApi = backend.createEndpointFetcher({
        method: 'get',
        payloadFormat: 'querystring',
        responseFormat: 'json',
        url: this.data('asset-gallery-files-by-parent-url'),
      });

      const deleteApi = backend.createEndpointFetcher({
        method: 'delete',
        payloadFormat: 'urlencoded',
        url: this.data('asset-gallery-delete-url'),
      });

      const addFolderApi = backend.createEndpointFetcher({
        method: 'post',
        payloadFormat: 'urlencoded',
        url: this.data('asset-gallery-add-folder-url'),
      });

      const limit = this.data('asset-gallery-limit');
      const bulkActions = this.data('asset-gallery-bulk-actions');

      const name = $('.asset-gallery').data('asset-gallery-name');

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
          />
        </Provider>,
        this[0]
      );

      // Catch any routes that aren't handled by components.
      window.ss.router('*', () => {});
    },
    onremove() {
      ReactDOM.unmountComponentAtNode(this[0]);
    },
  });
});
