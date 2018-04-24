import { Action } from '@ngrx/store';

export const SELECT_FILE = '[Import] Select File';

export class SelectFileAction implements Action {
  readonly type = SELECT_FILE;
}

export type Actions
  = SelectFileAction;
