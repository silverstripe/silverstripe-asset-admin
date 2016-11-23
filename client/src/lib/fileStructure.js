import deepFreeze from 'deep-freeze-strict';

/**
 * Default empty structure for a file
 */
const fileStructure = deepFreeze({
  attributes: {
    dimensions: {
      height: null,
      width: null,
    },
  },
  name: null,
  canDelete: false,
  canEdit: false,
  category: null,
  created: null,
  extension: null,
  filename: null,
  id: 0,
  lastUpdated: null,
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
});

export default fileStructure;
