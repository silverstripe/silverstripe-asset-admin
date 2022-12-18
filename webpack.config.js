const Path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CssWebpackConfig, JavascriptWebpackConfig } = require('@silverstripe/webpack-config');

const PATHS = {
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
  LEGACY_SRC: Path.resolve('client/src/entwine'),
};

const config = [
  // Main JS bundles
  new JavascriptWebpackConfig('js', PATHS, 'silverstripe/asset-admin')
    .setEntry({
      bundle: `${PATHS.SRC}/bundles/bundle.js`,
      TinyMCE_ssmedia: `${PATHS.LEGACY_SRC}/TinyMCE_ssmedia.js`,
      TinyMCE_ssembed: `${PATHS.LEGACY_SRC}/TinyMCE_ssembed.js`,
      'TinyMCE_sslink-file': `${PATHS.LEGACY_SRC}/TinyMCE_sslink-file.js`,
    })
    .mergeConfig({
      plugins: [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: `${PATHS.SRC}/images`,
              to: `${PATHS.DIST}/images`
            },
          ]
        }),
      ],
    })
    .getConfig(),
  // sass to css
  new CssWebpackConfig('css', PATHS)
    .setEntry({
      bundle: `${PATHS.SRC}/styles/bundle.scss`,
    })
    .getConfig(),
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : config;
