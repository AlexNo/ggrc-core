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

export function Proxy(optionModelName, joinOptionAttr, joinModelName,
  joinObjectAttr, instanceJoinAttr) {
  return new ProxyListLoader(joinModelName, joinObjectAttr, joinOptionAttr,
    instanceJoinAttr, optionModelName);
}

export function Direct(optionModelName, instanceJoinAttr, remoteJoinAttr) {
  return new DirectListLoader(
    optionModelName, instanceJoinAttr, remoteJoinAttr);
}

export function Indirect(instModelName, joinAttr) {
  return new IndirectListLoader(instModelName, joinAttr);
}

export function Search(queryFunction, observeTypes) {
  return new SearchListLoader(queryFunction, observeTypes);
}

export function Multi(sources) {
  return new MultiListLoader(sources);
}

export function TypeFilter(source, modelName) {
  return TypeFilteredListLoader(source, [modelName]);
}

export function AttrFilter(source, filterName, keyword, type) {
  return new AttrFilteredListLoader(source, filterName,
    keyword, type);
}

export function CustomFilter(source, filterFn) {
  return new CustomFilteredListLoader(source, filterFn);
}

export function Reify(source) {
  return new ReifyingListLoader(source);
}

export function Cross(localMapping, remoteMapping) {
  return new CrossListLoader(localMapping, remoteMapping);
}
