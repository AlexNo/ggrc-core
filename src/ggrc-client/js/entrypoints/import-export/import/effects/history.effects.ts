import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';

import {ImportService} from "../services/import-service";
import * as ImportHistoryActions from '../actions/history.actions';
import {ImportExportJob} from "../../models/ImportExportJob";


@Injectable()
export class ImportHistoryEffects {
  constructor(private actions$: Actions, private importSrv: ImportService) {
  }

  @Effect()
  loadImportHistory$: Observable<Action> = this.actions$
    .ofType(ImportHistoryActions.LOAD)
    .switchMap(() => this.importSrv.loadImportHistory()
      .map((history: ImportExportJob[]) => {
        return new ImportHistoryActions.LoadCompleteAction(history);
      }))
    .catch(() => Observable.of(new ImportHistoryActions.LoadCompleteAction([])));
}