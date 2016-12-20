const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
  MODULES: './node_modules',
  MODULE_JS_SRC: './client/src',
  MODULE_JS_DIST: './client/dist/js',
  MODULE_CSS_SRC: './client/src/styles',
  MODULE_CSS_DIST: './client/dist/styles',
};

// Used for autoprefixing css properties (same as Bootstrap Aplha.2 defaults)
const SUPPORTED_BROWSERS = [
  'Chrome >= 35',
  'Firefox >= 31',
  'Edge >= 12',
  'Explorer >= 9',
  'iOS >= 8',
  'Safari >= 8',
  'Android 2.3',
  'Android >= 4',
  'Opera >= 12',
];

module.exports = {
  entry: {
    'bundle': `${PATHS.MODULE_JS_SRC}/bundles/bundle.js`,
  },
  resolve: {
    modulesDirectories: [PATHS.MODULE_JS_SRC, PATHS.MODULES],
  },
  output: {
    path: './client/dist',
    filename: 'js/[name].js',
  },
  externals: {
    'apollo-client': 'ApolloClient',
    'containers/InsertMediaModal/InsertMediaModal': 'InsertMediaModal',
    'components/Breadcrumb/Breadcrumb': 'Breadcrumb',
    'state/schema/SchemaActions': 'SchemaActions',
    'components/FieldHolder/FieldHolder': 'FieldHolder',
    'components/LiteralField/LiteralField': 'LiteralField',
    'lib/DataFormat': 'DataFormat',
    'lib/schemaFieldValues': 'schemaFieldValues',
    'components/FormBuilderModal/FormBuilderModal': 'FormBuilderModal',
    'components/FormBuilder/FormBuilder': 'FormBuilder',
    'components/Toolbar/Toolbar': 'Toolbar',
    'components/FormAlert/FormAlert': 'FormAlert',
    'containers/FormBuilderLoader/FormBuilderLoader': 'FormBuilderLoader',
    'state/breadcrumbs/BreadcrumbsActions': 'BreadcrumbsActions',
    'deep-freeze-strict': 'DeepFreezeStrict',
    'graphql-tag': 'GraphQLTag',
    i18n: 'i18n',
    jQuery: 'jQuery',
    'lib/Backend': 'Backend',
    'lib/Config': 'Config',
    'lib/Injector': 'Injector',
    'lib/ReducerRegister': 'ReducerRegister',
    'lib/Router': 'Router',
    'lib/ReactRouteRegister': 'ReactRouteRegister',
    'lib/SilverStripeComponent': 'SilverStripeComponent',
    'page.js': 'Page',
    'react-addons-css-transition-group': 'ReactAddonsCssTransitionGroup',
    'react-addons-test-utils': 'ReactAddonsTestUtils',
    'react-apollo': 'ReactApollo',
    'react-dom': 'ReactDom',
    'react-redux': 'ReactRedux',
    'react-bootstrap-ss': 'ReactBootstrap',
    'react-router-redux': 'ReactRouterRedux',
    'react-router': 'ReactRouter',
    react: 'React',
    'redux-thunk': 'ReduxThunk',
    redux: 'Redux',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|thirdparty)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-object-assign'/* , 'transform-object-rest-spread' */],
          comments: false,
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          'css?sourceMap&minimize&-core&discardComments',
          'postcss?sourceMap',
          'resolve-url',
          'sass?sourceMap',
        ], {
          publicPath: '../', // needed because bundle.css is in a subfolder
        }),
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        loader: 'file?name=images/[name].[ext]',
      },
      {
        test: /\.(woff|eot|ttf)$/,
        loader: 'file?name=fonts/[name].[ext]',
      },
    ],
  },
  postcss: [
    autoprefixer({ browsers: SUPPORTED_BROWSERS }),
  ],
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jQuery',
      jQuery: 'jQuery',
      'ss.i18n': 'i18n',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: false,
        warnings: false,
      },
      output: {
        beautify: false,
        semicolons: false,
        comments: false,
        max_line_len: 200,
      },
    }),
    new ExtractTextPlugin('styles/bundle.css', { allChunks: true }),
  ],
};
