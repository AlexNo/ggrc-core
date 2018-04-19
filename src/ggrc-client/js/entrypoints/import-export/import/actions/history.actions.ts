import { Action } from '@ngrx/store';
import {ImportExportJob} from "../../models/ImportExportJob";

export const DELETE =           '[ImportHistory] Delete';
export const LOAD_COMPLETE =    '[ImportHistory] Load Complete';
export const LOAD =             '[ImportHistory] Load';

export class DeleteJobAction implements Action {
  readonly type = DELETE;

  constructor(public payload: ImportExportJob) { }
}

export class LoadHistoryAction implements Action {
  readonly type = LOAD;

  constructor() { }
}

export class LoadCompleteAction implements Action {
  readonly type = LOAD_COMPLETE;

  constructor(public payload: ImportExportJob[]) { }
}

export type Actions
  = DeleteJobAction
  | LoadCompleteAction
  | LoadHistoryAction;