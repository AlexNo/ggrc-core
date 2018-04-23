import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import {ImportService} from "../services/import.service";
import * as historyActions from '../actions/history.actions';
import {ImportExportJob} from "../../models/ImportExportJob";


@Injectable()
export class ImportHistoryEffects {
  constructor(private actions$: Actions, private importSrv: ImportService) {
  }

  @Effect()
  loadImportHistory$ = this.actions$
    .ofType(historyActions.LOAD)
    .mergeMap(() => this.importSrv.loadImportHistory()
      .map((history: any) => {
        return new historyActions.LoadCompleteAction(history);
      }))
    .catch(() => of(new historyActions.LoadCompleteAction([])));
}