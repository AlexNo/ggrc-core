import {Injectable} from '@angular/core';

import ImportableOption from '../../models/importable-option';

import {IMPORTABLE_OPTIONS} from '../../mocks/importable-options';
import {ExportDTO} from '../../models/export-dto';


declare var GGRC: any;

@Injectable()
export class GApiClientService {

  private gapiUrl: string = 'https://apis.google.com/js/client.js';
  private currentScopes: Array<string> = [
    'https://www.googleapis.com/auth/userinfo.email',
  ];
  private client: Promise<any>;

  private loadedClientLibraries: Map<string, any> = new Map();

  constructor() {
    this.client = this.loadGapi();
  }

  public authorizeGapi(requiredScopes: Array<string> = []): Promise<any> {
    let needToRequestForNewScopes: boolean = this.addNewScopes(requiredScopes);

    // this.client.subscribe(():void => {});

    return this.client
      .then(() => {
        let token = gapi.auth.getToken();

        if (needToRequestForNewScopes || !token) {
          return this.runAuthorization(true);
        } else {
          throw Error();
        }
      }, () => {
      })
      .then(() => this.checkLoggedUser(),
        () => {

        });
  }

  private loadGapi(): Promise<any> {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      script.src = this.gapiUrl;
      script.type = 'text/javascript';
      script.async = true;

      document.head.appendChild(script);

      script.onload = () => {
        resolve();
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

  private runAuthorization(immediate?: boolean): Promise<any> {
    return this.makeGapiAuthRequest(immediate)
      .then(() => {
      }, () => {
        if (immediate) {
          this.runAuthorization();
        }
      });
  }

  private makeGapiAuthRequest(immediate: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.auth.authorize({
        client_id: GGRC.config.GAPI_CLIENT_ID,
        // login_hint: GGRC.current_user && GGRC.current_user.email,
        scope: this.currentScopes,
        immediate,
      }, resolve);
    });
  }

  private loadClientLibrary(libraryName: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.loadedClientLibraries.has(libraryName)) {
        resolve(this.loadedClientLibraries[libraryName]);
      } else {
        gapi.client.load(libraryName, 'v2').then(() => {
          let loadedLibrary = gapi.client[libraryName];
          this.loadedClientLibraries.set(libraryName, loadedLibrary);
          resolve(loadedLibrary);
        });
      }
    });
  }

  private checkLoggedUser(): void {
    this.loadClientLibrary('oauth2').then((oauth2) => {
      oauth2.userinfo.get().execute((user: any) => {
        if (user.error) {
          // GGRC.Errors.notifier('error', user.error);
          return;
        }

        if (user.email.toLowerCase().trim() !==
          GGRC.current_user.email.toLowerCase().trim()) {
          //   GGRC.Errors.notifier('warning', `
          //     You are signed into GGRC as ${GGRC.current_user.email}
          //     and into Google Apps as ${user.email}.
          //     You may experience problems uploading evidence.`);
        }
      });
    });
  }
}