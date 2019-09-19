const fileInterface = `
  fragment FileInterfaceFields on FileInterface {
    canDelete
    canEdit
    canView
    category
    exists
    filename
    id
    lastEdited
    name
    parentId
    title
    type
    url
  }
`;

const file = `
  fragment FileFields on File {
    draft
    extension
    published
    modified
    size
    smallThumbnail
    thumbnail
    inUseCount
    version
  }
`;

const folder = `
  fragment FolderFields on Folder {
    filesInUseCount
  }
`;

export { fileInterface, file, folder };
