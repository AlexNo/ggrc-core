import * as ImportHistoryActions from '../actions/history.actions';
import {ImportExportJob} from "../../models/ImportExportJob";
import {JobStatuses} from "../../models/JobStatuses";

export interface State {
  finished: Array<ImportExportJob>;
  ids: Array<number>;
  currentExportJob: ImportExportJob;
}

export const initialState: State = {
  finished: [],
  ids: [],
  currentExportJob: null,
};

export const reducer = (state = initialState, action: ImportHistoryActions.Actions): State => {
  switch (action.type) {
    case ImportHistoryActions.LOAD: {
      return state;
    }
    case ImportHistoryActions.LOAD_COMPLETE: {
      const history: ImportExportJob[] = <ImportExportJob[]>action.payload;
      const lastJob = history.length ? history[history.length - 1] : null;
      const ids: Array<number> = [];
      const finished = history.filter((job) => {
        const isFinished = job.status === JobStatuses.FINISHED;

        if (isFinished) {
          ids.push(job.id);
        }
        return isFinished;
      });

      return Object.assign({}, state, {
        ids,
        finished,
        currentExportJob: lastJob,
      });
    }
    default: {
      return state;
    }
  }
};

export const getFinished = (state: State) => state.finished;

export const getIds = (state: State) => state.ids;

export const getCurrentJob = (state: State) => state.currentExportJob;