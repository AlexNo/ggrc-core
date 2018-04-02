import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared';
import {GDriveModule} from '../gdrive';

import {DownloadImportTemplatesDialogComponent} from './components/download-import-templates/download-import-templates';
import {ImportObjectsComponent} from './components/import-objects/import-objects';
import {ImportService} from './services/import-service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GDriveModule,
  ],
  declarations: [
    ImportObjectsComponent,
    DownloadImportTemplatesDialogComponent,
  ],
  entryComponents: [
    DownloadImportTemplatesDialogComponent,
  ],
  providers: [
    ImportService,
  ],
  exports: [
    ImportObjectsComponent,
  ],
})
export class ImportModule {
}
