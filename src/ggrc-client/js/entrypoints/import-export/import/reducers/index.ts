import {
  ActionReducer,
  combineReducers,
} from '@ngrx/store';
import { createSelector } from 'reselect';

import { environment } from '../../environments/environment';

import { compose } from '@ngrx/core/compose';

import { storeFreeze } from 'ngrx-store-freeze';

import * as fromImportHistory from './history.reducer';
import * as fromCurrentImport from './current-import.reducer';

import {State as AppState} from '../../reducers';

export interface State {
  history: fromImportHistory.State;
  current: fromCurrentImport.State;
}

const reducers = {
  history: fromImportHistory.reducer,
  current: fromCurrentImport.reducer,
};

// const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const developmentReducer: ActionReducer<State> = combineReducers(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

const selectImportState = (state: AppState) => state.import;

export const getHistoryState = (state: any) => {
  console.log('getHistoryState', state);
  return state.import.history;
};

export const getFinishedJobs = createSelector(getHistoryState, fromImportHistory.getFinished);

export const getCurrentJob = createSelector(getHistoryState, fromImportHistory.getCurrentJob);