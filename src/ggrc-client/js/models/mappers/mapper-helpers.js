/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

import CrossListLoader from './cross-list-loader';
import DirectListLoader from './direct-list-loader';
import IndirectListLoader from './indirect-list-loader';
import MultiListLoader from './multi-list-loader';
import ProxyListLoader from './proxy-list-loader';
import ReifyingListLoader from './reifying-list-loader';
import SearchListLoader from './search-list-loader';
import CustomFilteredListLoader from './custom-filtered-list-loader';
import TypeFilteredListLoader from './type-filtered-list-loader';
import AttrFilteredListLoader from './attr-filtered-list-loader';

GGRC.MapperHelpers = {};

GGRC.MapperHelpers.Proxy = function Proxy(
  optionModelName, joinOptionAttr, joinModelName, joinObjectAttr,
  instanceJoinAttr) {
  return new ProxyListLoader(
      joinModelName, joinObjectAttr, joinOptionAttr,
      instanceJoinAttr, optionModelName);
};

GGRC.MapperHelpers.Direct = function Direct(
    optionModelName, instanceJoinAttr, remoteJoinAttr) {
  return new DirectListLoader(
    optionModelName, instanceJoinAttr, remoteJoinAttr);
};

GGRC.MapperHelpers.Indirect = function Indirect(instModelName, joinAttr) {
  return new IndirectListLoader(instModelName, joinAttr);
};

GGRC.MapperHelpers.Search = function Search(queryFunction, observeTypes) {
  return new SearchListLoader(queryFunction, observeTypes);
};

GGRC.MapperHelpers.Multi = function Multi(sources) {
  return new MultiListLoader(sources);
};

GGRC.MapperHelpers.TypeFilter = function TypeFilter(source, modelName) {
  return TypeFilteredListLoader(source, [modelName]);
};

GGRC.MapperHelpers.AttrFilter = function AttrFilter(source, filterName,
                                                    keyword, type) {
  return new AttrFilteredListLoader(source, filterName,
    keyword, type);
};

GGRC.MapperHelpers.CustomFilter = function CustomFilter(source, filterFn) {
  return new CustomFilteredListLoader(source, filterFn);
};

GGRC.MapperHelpers.Reify = function Reify(source) {
  return new ReifyingListLoader(source);
};

GGRC.MapperHelpers.Cross = function Cross(localMapping, remoteMapping) {
  return new CrossListLoader(localMapping, remoteMapping);
};

GGRC.all_local_results = function (instance) {
  // Returns directly-linked objects
  let loaders;
  let multiLoader;
  let localLoaders = [];

  if (instance._all_local_results_binding)
    return instance._all_local_results_binding.refresh_stubs();

  loaders = GGRC.Mappings.get_mappings_for(instance.constructor.shortName);
  can.each(loaders, function (loader, name) {
    if (loader instanceof DirectListLoader ||
      loader instanceof ProxyListLoader) {
      localLoaders.push(name);
    }
  });

  multiLoader = new MultiListLoader(localLoaders);
  instance._all_local_results_binding = multiLoader.attach(instance);
  return instance._all_local_results_binding.refresh_stubs();
};
