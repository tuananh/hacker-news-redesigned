const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const paths = require('./paths');

if (process.env.NODE_ENV !== 'production') {
  throw new Error('Production builds must have NODE_ENV=production.');
}

module.exports = {
  name: 'client',
  mode: 'production',
  target: 'web',
  devtool: false,
  bail: true,

  entry: [paths.srcPath],

  output: {
    path: paths.buildPath,
    filename: 'assets/js/[name].[chunkhash:8].js',
    publicPath: paths.publicPath,
  },

  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 400000,
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    runtimeChunk: true,
  },

  module: {
    strictExportPresence: true,

    rules: [
      {
        oneOf: [

          // Transiplie JavaScript with Babel
          {
            test: /\.js$/,
            include: paths.srcPath,
            exclude: /(node_modules)/,
            use: [
              'thread-loader',
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true,
                  highlightCode: true,
                },
              },
            ],
          },

          // Process SCSS
          // 1. `sass-resources-loader` – Makes global dependencies (variables/mixins)
          // available to modules without @import
          // 2. `sass-loader` – Compiles Sass
          // 3. `postcss-loader` – Adds PostCSS plugins (e.g. autoprefixer)
          // 4. `css-loader` –Inteprets imports and adds CSS modules functionality
          // 5. `MiniCSSExtractPlugin` – Extracts generated CSS into a file
          {
            test: /\.scss$/,
            include: paths.srcPath,
            exclude: /(node_modules)/,
            use: [
              MiniCSSExtractPlugin.loader,
              {
                loader: 'css-loader',
                query: {
                  sourceMap: true,
                  modules: true,
                  importLoaders: 3,
                  localIdentName: '[local]_[hash:base64:5]', //[name]-[local]_[hash:base64:5]
                },
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader',
                options: {
                  includePaths: ['node_modules'],
                },
              },
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [
                    './src/styles/functions/_functions.all.scss',
                    './src/styles/settings/_settings.all.scss',
                    './src/styles/mixins/_mixins.all.scss',
                  ],
                },
              },
            ],
          },

          // Process imported .graphql files
          {
            test: /\.(graphql)$/,
            exclude: /node_modules/,
            loader: 'graphql-tag/loader',
          },

          // Inline small SVGs
          {
            test: [/\.svg$/],
            include: paths.srcPath,
            loader: 'url-loader',
            options: {
              limit: 2000,
              name: 'assets/media/[name].[hash:8].svg',
            },
          },

          // Everything else gets processed by `file-loader`.
          {
            // Exclude everything that's being handled by the loaders above.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            include: paths.srcPath,
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.graphql$/, /\.json$/, /\.svg/, /\.(css|scss)$/, /(node_modules)/],
            loader: 'file-loader',
            options: {
              name: 'assets/media/[name].[hash:8].[ext]',
            },
          },

          // No loaders beyond this point. All loaders should be specified
          // before the `file-loader`.

        ],
      }
    ],
  },

  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: paths.publicPath,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],

  stats: {
    colors: true,
    assets: true,
    modules: false,
    builtAt: false,
    source: false,
    children: false,
  },
};
