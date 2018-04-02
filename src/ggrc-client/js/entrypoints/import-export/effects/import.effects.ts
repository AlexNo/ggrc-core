import {Injectable} from "@angular/core";
import {Actions, Effect} from "@ngrx/effects";

import {ImportService} from "../services/import-service";

import * as ImportActions from '../actions/import.actions';

@Injectable()
export class ImportEffects {
  constructor(private actions$: Actions, private importService: ImportService) {}

  @Effect()
  loadImportHistory$ = this.actions$.ofType(ImportActions.LOAD)
    .map(action => action.payload)
    .switchMap((position: Geoposition) => this.cityWeatherService.weatherForNearbyCities(position)
      .map(res => {
        return new CityWeatherActions.LoadNearbySuccessAction(res);
      }))
    .catch(() => Observable.of(new CityWeatherActions.LoadNearbySuccessAction([])));
}