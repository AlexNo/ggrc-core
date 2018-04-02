import {Action} from '@ngrx/store';

export const LOAD = '[Import] Load';

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor() {};
}