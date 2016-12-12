const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Config = require('./webpack.config');

Config.plugins = [
  new webpack.ProvidePlugin({
    jQuery: 'jQuery',
    $: 'jQuery',
    'ss.i18n': 'i18n',
  }),
  new ExtractTextPlugin('styles/bundle.css', { allChunks: true }),
];

Config.devtool = 'source-map';

module.exports = Config;
