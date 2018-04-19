import * as ImportHistoryActions from '../actions/history.actions';
import {ImportExportJob} from "../../models/ImportExportJob";
import {JobStatuses} from "../../models/JobStatuses";

export interface State {
  currentJob: ImportExportJob;
  status: string;
  message: string;
}

export const initialState: State = {
  currentJob: null,
  status: null,
  message: '',
};

export const reducer = (state = initialState, action: ImportHistoryActions.Actions): State => {
  switch (action.type) {
    case ImportHistoryActions.LOAD: {
      return state;
    }
    case ImportHistoryActions.LOAD_COMPLETE: {
      const history: ImportExportJob[] = <ImportExportJob[]>action.payload;
      const ids: Array<number> = [];
      const finished = history.filter((job) => {
        const isFinished = job.status === JobStatuses.FINISHED;

        if (isFinished) {
          ids.push(job.id);
        }
        return isFinished;
      });

      return Object.assign({}, state, {ids, finished})
    }
    default: {
      return state;
    }
  }
};

export const getFinished = (state: State) => state.finished;

export const getIds = (state: State) => state.ids;