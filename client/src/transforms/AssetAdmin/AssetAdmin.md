## AssetAdmin transformations

Provides injector transformations for the following AssetAdmin components:

 * insertAssetModal: Transforms the 'insert' action of a form to read either 'Insert File' or 'Update File'
   depending on whether or not a file is being inserted or updated. This does this by looking at
   the schema overrides. E.g. see `containers/InsertMediaModal/InsertMediaModal.js`
