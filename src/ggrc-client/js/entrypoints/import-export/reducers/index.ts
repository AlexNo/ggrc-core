import {
  ActionReducer,
  combineReducers,
} from '@ngrx/store';
import { environment } from '../environments/environment';

import { compose } from '@ngrx/core/compose';

import { storeFreeze } from 'ngrx-store-freeze';

import * as fromConfig from './config.reducer';
import * as fromCurrentUser from './current-user.reducer';
import * as fromExport from './export.reducer';
import * as fromImport from './import.reducer';

export interface State {
  config: fromConfig.State;
  currentUser: fromCurrentUser.State;
  export: fromExport.State;
  import: fromImport.State;
}

const reducers = {
  import: fromImport.reducer,
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