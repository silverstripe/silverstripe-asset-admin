/* eslint-disable
 import/no-webpack-loader-syntax,
 import/no-extraneous-dependencies,
 import/no-unresolved
 */
require('expose-loader?InsertMediaModal!containers/InsertMediaModal/InsertMediaModal');
require('expose-loader?InsertEmbedModal!components/InsertEmbedModal/InsertEmbedModal');

require('boot');
require('entwine/UploadField/UploadFieldEntwine.js');
