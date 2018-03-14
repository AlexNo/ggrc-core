import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import * as queryApi from '../../../plugins/utils/query-api-utils.js';

import ImportableOption from '../models/importable-option';

import {IMPORTABLE_OPTIONS} from '../mocks/importable-options';
import {ExportDTO} from '../models/export-dto';
import * as GGRC from "../../../@types/global";

@Injectable()
export class GApiClientService {

  private gapiUrl: string = 'https://apis.google.com/js/client.js';
  private currentScopes: Array<string> = [
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  constructor() {
    this.loadGapi();
  }

  public authorizeGapi(requiredScopes = []): Observable<void> {
    let needToRequestForNewScopes: boolean = this.addNewScopes(requiredScopes);
    let token = gapi.auth.getToken();

    queryApi.buildParam();

    if (needToRequestForNewScopes || !token) {

    }
  }

  private makeGapiAuthRequest(immediate: boolean) {
    return gapi.auth.authorize({
      client_id: GGRC.config.GAPI_CLIENT_ID,
      login_hint: GGRC.current_user && GGRC.current_user.email,
      scope: this.currentScopes,
      immediate,
    });
  }

  private loadGapi(): Observable<void> {
    return Observable.create((observer: Observer<boolean>) => {
      let script = document.createElement('script');
      script.src = this.gapiUrl;
      script.type = 'text/javascript';
      script.async = true;

      document.head.appendChild(script);

      script.onload = () => {
        observer.next(true);
        observer.complete();
      };
    });
  }

  private addNewScopes(newScopes: Array<string>): boolean {
    let scopesWereAdded: boolean = false;

    newScopes.forEach((scope) => {
      if (!this.currentScopes.includes(scope)) {
        this.currentScopes.push(scope);
        scopesWereAdded = true;
      }
    });

    return scopesWereAdded;
  }
}