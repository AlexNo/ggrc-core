import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import ImportableOption from '../../models/importable-option';

import {IMPORTABLE_OPTIONS} from '../../mocks/importable-options';
import {ExportDTO} from '../../models/export-dto';
import {GApiClientService} from '../../gdrive/services/gapi-client';

declare var GGRC: any;

@Injectable()
export class ImportService {

  private allowedTypes: string[] = [
    'text/csv',
    'application/vnd.google-apps.document',
    'application/vnd.google-apps.spreadsheet'
  ];
  private exportUrl: string = '/_service/export_csv';
  private importUrl: string = '/_service/import_csv';
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-export-view': 'blocks',
    'X-requested-by': 'GGRC',
  });

  constructor(private http: HttpClient,
              private gclient: GApiClientService) {
  }

  getImportableOptions(): Observable<ImportableOption[]> {
    return of(IMPORTABLE_OPTIONS);
  }

  exportRequest(data: ExportDTO): Observable<string> {
    const httpOptions = {
      responseType: 'text' as 'text',
      headers: this.headers,
    };
    return this.http.post(this.exportUrl, data, httpOptions);
  }

  public loadImportHistory() {
    const httpOptions = {
      headers: this.headers,
    };
    return this.http.get('/api/people/150/imports', httpOptions);
  }

  public async selectFile() {
    await this.gclient
      .authorizeGapi(['https://www.googleapis.com/auth/drive']);

    const gDriveFile: string = await new Promise((resolve, reject) => {
      gapi.load('picker', {
        callback() {
          let docsUploadView;
          let docsView;
          let pickerBuilder = new google.picker.PickerBuilder()
            .setOAuthToken(gapi.auth.getToken().access_token)
            .setDeveloperKey(GGRC.config.GAPI_KEY)
            .setSelectableMimeTypes(this.allowedTypes.join(','))
            .setCallback((data: any) => {
              let file;
              let PICKED = google.picker.Action.PICKED;
              let ACTION = google.picker.Response.ACTION;
              let DOCUMENTS = google.picker.Response.DOCUMENTS;

              if (data[ACTION] === PICKED) {
                file = data[DOCUMENTS][0];
                resolve(file);
              }
            });

          docsUploadView = new google.picker.DocsUploadView();
          docsView = new google.picker.DocsView();

          pickerBuilder.addView(docsUploadView)
            .addView(docsView)
            .build()
            .setVisible(true);
        },
      });


    });
  }

  private analyseSelectedFile() {

  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}