import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';

import '../../../styles/import-export.css';
import {QueryApiService} from "./services/query-api-service";

@Component({
  selector: 'importexport',
  styleUrls: ['./import-export.css'],
  templateUrl: './import-export.component.html',
})
export class ImportExportComponent implements OnInit{
  // name: string = 'Angular!!!';

    // constructor(/*private queryApi: QueryApiService*/) {}

    ngOnInit() {
      // console.log(this.queryApi.makeRequest());

    }
}
