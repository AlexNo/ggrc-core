import {
  Component,
  Input,
  OnInit,
  Inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {MatDialog} from '@angular/material';
import {DownloadImportTemplatesDialogComponent} from '../download-import-templates/download-import-templates';

import * as fromRoot from '../../reducers';
import * as importActions from '../../actions/current-import.actions';
import { Observable } from 'rxjs/Observable';
import {ImportExportJob} from "../../../models/ImportExportJob";

@Component({
  selector: 'import-objects',
  styleUrls: ['./import-objects.css'],
  templateUrl: './import-objects.html',
})
export class ImportObjectsComponent implements OnInit {

  @Input()
  currentJob: ImportExportJob;

  constructor(public dialog: MatDialog,
              public store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    console.log('import-objects');
  }

  openDownloadTemplatesDialog(): void {
    const dialogRef = this.dialog.open(DownloadImportTemplatesDialogComponent, {
      height: '350px'
    });

    console.log('Open');
  }

  selectFile(): void {
    this.store.dispatch(new importActions.SelectFileAction());
  }
}
