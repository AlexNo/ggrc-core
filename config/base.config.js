/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const path = require('path');

const {isProduction} = require('./helpers');

const ENV = process.env;

const contextDir = path.resolve(__dirname, '..', 'src', 'ggrc-client');
const imagesDir = path.resolve(contextDir, 'images');
const vendorDir = path.resolve(contextDir, 'vendor');
const nodeModulesDir = path.resolve(__dirname, '..', 'node_modules');

const STATIC_FOLDER = '/static/';


module.exports = (options) => {
  const isProd = isProduction(options.env);
  const extractSass = new ExtractTextPlugin({
    filename: isProd ? '[name].[chunkhash].css' : '[name].css',
    allChunks: true,
    // disable: isDev
  });
  const manifestName = options.manifestName || 'manifest.json';

  return {
    context: contextDir,

    output: {
      filename: isProd ? '[name].[chunkhash].js' : '[name].js?[hash]',
      chunkFilename: isProd ? 'chunk.[name].[chunkhash].js' : 'chunk.[name].js?[hash]',
      sourceMapFilename: '[file].map',
      path: path.join(__dirname, '../src/ggrc/static/'),
      publicPath: STATIC_FOLDER,
    },

    module: {
      rules: [{
        test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        include: /node_modules/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
          },
        }],
      }, {
        test: /\.css$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
          },
        }),
      }, {
        test: /\.(png|jpe?g|gif)$/,
        exclude: /node_modules/,
        include: [imagesDir, vendorDir],
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        }],
      }, {
        test: /\.svg$/,
        include: [imagesDir],
        use: [{
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]?[hash:8]',
          },
        }],
      }, {
        test: /\.ico$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        }],
      }, {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'sass-loader',
          }],
          fallback: 'style-loader',
        }),
      }],
    },

    devtool: isProd ? 'source-map' : 'cheap-module-eval-source-map',

    resolve: {
      modules: [nodeModulesDir, vendorDir],
      alias: {
        entrypoints: './js/entrypoints',
      },
    },
    plugins: [
      extractSass,
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        _: 'lodash',
        moment: 'moment',
      }),
      new webpack.DefinePlugin({
        GOOGLE_ANALYTICS_ID: JSON.stringify(ENV.GOOGLE_ANALYTICS_ID),
        DEV_MODE: JSON.stringify(!isProd),
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new ManifestPlugin({
        publicPath: STATIC_FOLDER,
        fileName: manifestName,
      }),
    ],
    stats: {
      errorDetails: true,
    },
  };
};
