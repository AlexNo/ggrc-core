import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import ImportableOption from "../models/importable-option";

import {IMPORTABLE_OPTIONS} from "../mocks/importable-options";
import {ExportDTO} from "../models/export-dto";

@Injectable()
export class GApiClientService {

  private gapiUrl: string = 'https://apis.google.com/js/client.js';
  private currentScopes: Array<string> = [
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  constructor() {

  }

  private loadGapi
}