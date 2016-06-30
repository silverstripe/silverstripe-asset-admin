import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import Config from 'lib/Config';
import { Provider } from 'react-redux';
import configureStore from 'state/configureStore';
import AssetAdminContainer from 'containers/AssetAdmin/AssetAdmin';
import backend from 'lib/Backend';

$.entwine('ss', () => {
  $('#assetadmin-cms-content .cms-content-view').entwine({

    onadd() {
      const sectionConfig = Config.getSection('SilverStripe\\AssetAdmin\\Controller\\AssetAdmin');
      const store = configureStore();

      const createEndpoint = (endpointConfig, includeToken = true) =>
        backend.createEndpointFetcher(Object.assign(
            {},
            endpointConfig,
            includeToken ? { defaultData: { SecurityID: Config.get('SecurityID') } } : {}
        ));

      // Build API callers from the URLs provided to us in the div
      // In time, something like a GraphQL endpoint might be a better way to run
      const createFileApiUrl = sectionConfig.createFileEndpoint.url;
      const createFileApiMethod = sectionConfig.createFileEndpoint.method;
      const createFolderApi = createEndpoint(sectionConfig.createFolderEndpoint);
      const readFolderApi = createEndpoint(sectionConfig.readFolderEndpoint, false);
      const updateFolderApi = createEndpoint(sectionConfig.updateFolderEndpoint);
      const updateFileApi = createEndpoint(sectionConfig.updateFileEndpoint);
      const deleteApi = createEndpoint(sectionConfig.deleteEndpoint);
      const limit = sectionConfig.limit;

      ReactDOM.render(
        <Provider store={store}>
          <AssetAdminContainer
            name={name}
            limit={limit}
            createFileApiUrl={createFileApiUrl}
            createFileApiMethod={createFileApiMethod}
            createFolderApi={createFolderApi}
            readFolderApi={readFolderApi}
            updateFolderApi={updateFolderApi}
            updateFileApi={updateFileApi}
            deleteApi={deleteApi}
            sectionConfig={sectionConfig}
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
