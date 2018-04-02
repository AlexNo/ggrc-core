import * as importActions from '../actions/import.actions';

export interface State {

}

export const initialState: State = {

};

export function reducer (state = initialState, action): State {
  switch (action.type) {
    case (importActions.LOAD): {

      return Object.assign({}, state);
    }
    default: {
      return state;
    }
  }
}