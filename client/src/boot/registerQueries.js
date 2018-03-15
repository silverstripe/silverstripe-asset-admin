import Injector from 'lib/Injector';
import { fileInterface, file, folder } from 'lib/fileFragments';
import { buildQueryConfig as buildCreateFolderConfig } from 'state/files/createFolderMutation';

const registerQueries = () => {
  Injector.query.registerFragment('FileInterfaceFields', fileInterface);
  Injector.query.registerFragment('FileFields', file);
  Injector.query.registerFragment('FolderFields', folder);

  // @todo delete these examples/POCs, CreateFolder is not used in favour of form submit
  // and `FolderCreateInputType` does not exist
  Injector.query.register('CreateFolder', buildCreateFolderConfig());
  Injector.transform('folder-bob', (updater) => {
    updater.query('CreateFolder', (manager) => {
      manager.transformApolloConfig('props', ({ mutate }) => (prevProps) => {
        const createFolder = (parentId) => mutate({
          variables: {
            folder: {
              parentId,
              // this transform forces all folders to be called "another-bob" for no reason
              name: 'another-bob',
            },
          },
        });

        return {
          ...prevProps,
          actions: {
            ...prevProps.actions,
            files: {
              ...prevProps.actions.files,
              createFolder,
            },
          },
        };
      });
    });
  });
};

export default registerQueries;
