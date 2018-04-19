import {
  ActionReducer,
  combineReducers,
} from '@ngrx/store';
import { environment } from '../../environments/environment';

import { compose } from '@ngrx/core/compose';

import { storeFreeze } from 'ngrx-store-freeze';

import * as fromImportHistory from './history.reducer';
import * as fromCurrentImport from './current-import.reducer';

import {ImportExportJob} from '../../models/ImportExportJob';

export interface State {
  history: Array<ImportExportJob>;
  current: ImportExportJob;
  jobStatus: string;
}

const reducers = {
  history: fromImportHistory.reducer,
  current: fromCurrentImport.reducer,
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}