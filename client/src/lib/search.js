export function hasSearch(query) {
  if (!query || !query.q) {
    return false;
  }
  const search = Object.entries(query.q).filter((entry) => (
    entry[1] !== '' && entry[0] !== 'AllFolders'
  ));

  return search.length > 0;
}
