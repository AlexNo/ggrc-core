/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

const webpack = require('webpack');
const WebpackShellPlugin = require('webpack-shell-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const {
  getCanJsEntries,
  contextDir,
} = require('./helpers');

const canManifest = 'canjs-manifest.json';
const aManifest = 'angular-manifest.json';

const extractSass = new ExtractTextPlugin({
  filename: '[name].css',
  allChunks: true,
  // disable: isDev
});

module.exports = [
  // CanJS config
  webpackMerge(commonConfig({
    env: 'development',
    manifestName: canManifest,
  }), {
    entry: getCanJsEntries(),

    module: {
      rules: [{
        test: /\.css$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
          },
        }),
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
      }, {
        test: /wysihtml5-0\.4\.0pre\.js$/,
        loader: 'exports-loader?wysihtml5',
      }, {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery',
        }, {
          loader: 'expose-loader',
          options: '$',
        }],
      }, {
        test: /\.mustache/,
        loader: 'raw-loader',
      }, {
        test: /\.js$/,
        exclude: /(node_modules|vendor)/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      }],
    },

    plugins: [
      extractSass,
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        chunks: ['dashboard', 'import', 'export', 'admin'],
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
      }),
    ],

    resolve: {
      alias: {
        can: 'canjs/amd/can/',
      },
    },
  }),

  // Angular config
  webpackMerge(commonConfig({
    env: 'development',
    manifestName: aManifest,
  }), {
    entry: {
      'import-export': 'entrypoints/import-export/main',
    },

    module: {
      rules: [{
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
        ],
      }, {
        test: /\.html$/,
        loader: 'html-loader',
      }, {
        test: /\.css$/,
        exclude: path.resolve(contextDir, 'js', 'entrypoints', 'import-export'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: 'css-loader',
        }),
      },
      {
        test: /\.css$/,
        include: path.resolve(contextDir, 'js', 'entrypoints', 'import-export'),
        loader: 'raw-loader',
      }],
    },

    plugins: [
      new ExtractTextPlugin('[name].css'),
      // here we a copy manifests from the all builds
      // new WebpackShellPlugin({
      //   onBuildEnd: [
      //     `cp src/ggrc/static/${canManifest} src/ggrc/${canManifest}`,
      //     `cp src/ggrc/static/${aManifest} src/ggrc/${aManifest}`,
      //   ],
      // }),
    ],

    resolve: {
      extensions: ['.js', '.ts'],
    },
  }),
];
