/* eslint-disable
 import/no-webpack-loader-syntax,
 import/no-extraneous-dependencies,
 import/no-unresolved
 */
require('expose-loader?exposes=InsertMediaModal!containers/InsertMediaModal/InsertMediaModal');
require('expose-loader?exposes=InsertEmbedModal!components/InsertEmbedModal/InsertEmbedModal');

require('boot');
require('entwine/UploadField/UploadFieldEntwine');
