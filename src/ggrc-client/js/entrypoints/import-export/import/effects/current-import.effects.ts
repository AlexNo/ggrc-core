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
import * as importActions from '../actions/current-import.actions';


@Injectable()
export class ImportHistoryEffects {
  constructor(private actions$: Actions, private importSrv: ImportService) {
  }

  @Effect()
  loadImportHistory$ = this.actions$
    .ofType(importActions.SELECT_FILE)
    .mergeMap(() => this.importSrv.selectFile()
      .map((history: any) => {
        return new importActions.SelectFileAction(history);
      }))
    .catch(() => of(new historyActions.LoadCompleteAction([])));
}