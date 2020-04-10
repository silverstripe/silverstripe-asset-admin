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
    visibility
    canViewAnonymous
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
    version
    isUserDefinedFormUpload
  }
`;

export { fileInterface, file };
