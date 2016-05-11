import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from 'state/configureStore';
import AssetAdminContainer from 'containers/AssetAdmin/AssetAdmin';
import backend from 'lib/Backend';

$.entwine('ss', () => {
  $('.asset-gallery-component-wrapper').entwine({
    onadd() {
      const store = configureStore();

      // Build API callers from the URLs provided to us in the div
      // In time, something like a GraphQL endpoint might be a better way to run

      const filesByParentApi = backend.createEndpointFetcher({
        method: 'get',
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

      const updateApi = backend.createEndpointFetcher({
        method: 'put',
        payloadFormat: 'urlencoded',
        url: this.data('asset-gallery-update-url'),
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
            updateApi={updateApi}
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
