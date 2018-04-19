import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';


import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {catchError, map, tap} from 'rxjs/operators';

import ImportableOption from '../../models/importable-option';

import {IMPORTABLE_OPTIONS} from '../../mocks/importable-options';
import {ExportDTO} from '../../models/export-dto';
import {ImportExportJob} from "../../models/ImportExportJob";

@Injectable()
export class ImportService {

  private exportUrl: string = '/_service/export_csv';
  private importUrl: string = '/_service/import_csv';
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-export-view': 'blocks',
    'X-requested-by': 'GGRC',
  });

  constructor(private http: HttpClient) {
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

  public loadImportHistory(): Observable<ImportExportJob[]> {
    return this.http.get('/api/people/1/imports');
  }
}