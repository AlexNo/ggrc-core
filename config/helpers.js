/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

const path = require('path');

const contextDir = path.resolve(__dirname, '..', 'src', 'ggrc-client');
const imagesDir = path.resolve(contextDir, 'images');
const vendorDir = path.resolve(contextDir, 'vendor');
const nodeModulesDir = path.resolve(__dirname, '..', 'node_modules');

exports.getCanJsEntries = () => {
  return {
    vendor: 'entrypoints/vendor',
    styles: 'entrypoints/styles',
    dashboard: getEntryModules('dashboard'),
    'import': getEntryModules('import'),
    'export': getEntryModules('export'),
    admin: getEntryModules('admin'),
    login: 'entrypoints/login',
  };
};

exports.isProduction = (env) => {
  return env === 'production';
};

exports.contextDir = contextDir;
exports.imagesDir = imagesDir;
exports.vendorDir = vendorDir;
exports.nodeModulesDir = nodeModulesDir;

function getEntryModules(entryName) {
  return [`entrypoints/${entryName}`, `entrypoints/${entryName}/bootstrap`];
}
