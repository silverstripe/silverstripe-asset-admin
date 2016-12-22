import deepFreeze from 'deep-freeze-strict';

/**
 * Default empty structure for a file
 */
const fileStructure = deepFreeze({
  name: null,
  canDelete: false,
  canEdit: false,
  category: null,
  created: null,
  extension: null,
  filename: null,
  id: 0,
  lastEdited: null,
  messages: null,
  owner: {
    id: 0,
    title: null,
  },
  parent: {
    filename: null,
    id: 0,
    title: null,
  },
  queuedId: null,
  size: null,
  title: null,
  type: null,
  url: null,
  xhr: null,
  thumbnail: null,
  smallThumbnail: null,
  height: null,
  width: null,
});

export default fileStructure;
