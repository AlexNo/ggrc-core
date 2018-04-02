import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import ImportableOption from '../../models/importable-option';

import {IMPORTABLE_OPTIONS} from '../../mocks/importable-options';
import {ExportDTO} from '../../models/export-dto';

@Injectable()
export class ImportService {

  private exportUrl: string = '/_service/export_csv';
  private importUrl: string = '/_service/import_csv';

  constructor(private http: HttpClient) {
  }

  getImportableOptions(): Observable<ImportableOption[]> {
    return of(IMPORTABLE_OPTIONS);
  }

  exportRequest(data: ExportDTO): Observable<string> {
    const httpOptions = {
      responseType: 'text' as 'text',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-export-view': 'blocks',
        'X-requested-by': 'GGRC',
      })
    };
    return this.http.post(this.exportUrl, data, httpOptions);
  }
}