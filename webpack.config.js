const Path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CssWebpackConfig, JavascriptWebpackConfig } = require('@silverstripe/webpack-config');

const PATHS = {
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
  LEGACY_SRC: Path.resolve('client/src/entwine'),
};

/**
 * Dart Sass's "compressed" output style prepends a UTF-8 BOM to the compiled CSS
 * whenever it contains non-ASCII characters i.e. our icon font glyphs
 * Strip it as a final build step so it can't break styling
 */
class StripStrayBomPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('StripStrayBomPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'StripStrayBomPlugin',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        (assets) => {
          Object.keys(assets)
            .filter((name) => name.endsWith('.css'))
            .forEach((name) => {
              const bom = String.fromCharCode(0xFEFF);
              const content = compilation.getAsset(name).source.source().toString();
              if (!content.includes(bom)) {
                return;
              }
              const occurrences = content.split(bom).length - 1;
              compilation.warnings.push(
                new webpack.WebpackError(
                  `StripStrayBomPlugin: removed ${occurrences} stray BOM character(s) from ${name}`
                )
              );
              compilation.updateAsset(
                name,
                new webpack.sources.RawSource(content.split(bom).join(''))
              );
            });
        }
      );
    });
  }
}

const cssConfig = new CssWebpackConfig('css', PATHS)
  .setEntry({
    bundle: `${PATHS.SRC}/styles/bundle.scss`,
  })
  .getConfig();
cssConfig.plugins.push(new StripStrayBomPlugin());

const config = [
  // Main JS bundles
  new JavascriptWebpackConfig('js', PATHS, 'silverstripe/asset-admin')
    .setEntry({
      bundle: `${PATHS.SRC}/bundles/bundle.js`,
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
  cssConfig,
];

// Use WEBPACK_CHILD=js or WEBPACK_CHILD=css env var to run a single config
module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : config;
