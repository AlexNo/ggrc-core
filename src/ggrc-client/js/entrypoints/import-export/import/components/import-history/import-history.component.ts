import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import {ImportExportJob} from '../../../models/ImportExportJob';


@Component({
  selector: 'import-history',
  templateUrl: 'import-history.component.html'
})

export class ImportHistoryComponent implements OnInit {

  @Input()
  history: ImportExportJob[];

  constructor() {
  }

  ngOnInit() {
  }
}