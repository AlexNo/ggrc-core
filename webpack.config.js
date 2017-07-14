/*
    Copyright (C) 2017 Google Inc.
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
    */

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var _ = require('lodash');
var path = require('path');
var GGRC = {
  get_dashboard_modules: function () {
    return _.compact(_.map(process.env.GGRC_SETTINGS_MODULE.split(' '), function (module) {
      var name;
      if (/^ggrc/.test(module)) {
        name = module.split('.')[0];
      }
      if (module === 'development') {
        name = 'ggrc';
      }
      if (!name) {
        return '';
      }
      return './src/' + name + '/assets/assets';
    }));
  }
};

module.exports = {
  entry: {
    vendor: 'ggrc/vendor',
    main: 'ggrc/main',
    'my-assessments': 'ggrc/my-assessments',
    admin: 'ggrc/admin',
    import: 'ggrc/import',
    export: 'ggrc/export',
    dashboard: GGRC.get_dashboard_modules()
  },
  output: {
    filename: '[name]_.js',
    path: path.join(__dirname, './src/ggrc/assets/stylesheets/'),
    publicPath: '/src/ggrc/static/'
  },
  module: {
    rules: [{
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract(['style-loader', 'css-loader'])
    }, {
      test: /\.s[ca]ss$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: "css-loader"
        }, {
          loader: "sass-loader"
        }],
        fallback: "style-loader"
      })
    }]
  },
  resolve: {
    modules: ['node_modules', 'bower_components', 'third_party'].map(function (dir) {
      return path.join(__dirname, dir);
    }),
    alias: {
      'can': 'canjs/amd/can/',
      'ggrc': './src/ggrc/assets/javascripts'
    }
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ]
};
