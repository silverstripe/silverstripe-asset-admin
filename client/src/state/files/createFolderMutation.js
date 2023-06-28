const config = {
  props: ({ mutate, ownProps: { errors, actions = {}, errorMessage } }) => {
    const createFolder = (parentId, name) => mutate({
      variables: {
        folder: {
          parentId,
          name,
        },
      },
    });
    const files = actions.files || {};

    return {
      errorMessage: errorMessage || (errors && errors[0].message),
      actions: {
        ...actions,
        files: {
          ...files,
          createFolder,
        },
      },
    };
  },
};

const buildQueryConfig = () => ({
  apolloConfig: { ...config },
  templateName: 'scaffoldCreate',
  singularName: 'Folder',
  params: {
    folder: 'FolderInput!',
  },
  fields: [
    '...FileInterfaceFields',
    '...FileFields',
  ],
  fragments: [
    'FileInterfaceFields',
    'FileFields',
  ],
});

export { config, buildQueryConfig };
