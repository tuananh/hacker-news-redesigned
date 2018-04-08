const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
// This is the only sane way to lint Sass through webpack. `stylelint-loader`
// and `stylelint` via `postcss-loader` don't work.
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  entry: [
    'react-hot-loader/patch',
    path.resolve(__dirname, 'src', 'index.js')
  ],

  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    strictExportPresence: true,
    rules: [

      // ESLint
      // Runs before Babel regardless of the order
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          formatter: eslintFormatter,
        },
      },

      // Babel transpilation.
      // See options in `.babelrc`
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        // This is a feature of `babel-loader` for webpack (not Babel itself).
        // It enables caching results in ./node_modules/.cache/babel-loader/
        // directory for faster rebuilds.
        options: {
          cacheDirectory: true,
          highlightCode: true,
        }
      },

      // SCSS Modules
      // `sass-resources-loader`: Loads ITCSS-like dependencies to be used in components
      // `sass-loader`: Loads and compiles SCSS files
      // `css-loader`: Takes care of the modules
      // `style-loader`: Injects <style> tags in development mode
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            query: {
              sourceMap: true,
              modules: true,
              importLoaders: 2,
              localIdentName: '[local]_[hash:base64:5]', //[name]-[local]_[hash:base64:5]
            },
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['node_modules']
            }
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                './src/styles/functions/_functions.all.scss',
                './src/styles/settings/_settings.all.scss',
                './src/styles/mixins/_mixins.all.scss'
              ]
            }
          }
        ]
      },

      // Everything else gets processed by `file-loader`.
      {
        // Exclude everything that's being handled by the loaders above.
        // Also exclude `html` and `json` extensions so they get processed
        // by webpacks internal loaders.
        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.(css|scss)$/],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'public/index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new StyleLintPlugin(),
  ],

  devServer: {
    contentBase: './public',
    hot: true,
    port: 3050,
    historyApiFallback: true,
    clientLogLevel: 'error',
    compress: true,
    //noInfo: true,
    //quiet: true,
    progress: true,
    open: 'Google Chrome',
    // Disable everything but errors in webpack's extremely verbose logs.
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      warnings: true,
      publicPath: false,
      errors: true,
      errorDetails: false,
      moduleTrace: false
    }
  },
};

