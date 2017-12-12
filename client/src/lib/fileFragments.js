import gql from 'graphql-tag';

const fileInterface = gql`
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

const file = gql`
  fragment FileFields on File {
    draft
    extension
    published
    size
    smallThumbnail
    thumbnail
    inUseCount
  }
`;

const folder = gql`
  fragment FolderFields on Folder {
    filesInUseCount
  }
`;

export { fileInterface, file, folder };
