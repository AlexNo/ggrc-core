/*
  Copyright (C) 2018 Google Inc.
  Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
*/

const state = new can.Map({});

export const initState = (state) => {
  state.attr(state);

  return state;
};

export const initRouter = (routeParams) => {
  state.attr('router', routeParams);
};

export default state;
