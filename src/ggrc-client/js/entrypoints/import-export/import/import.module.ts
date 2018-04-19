import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {SharedModule} from '../shared';
import {GDriveModule} from '../gdrive';

import {reducer} from './reducers';
import {ImportHistoryEffects} from './effects/history.effects';

import {DownloadImportTemplatesDialogComponent} from './components/download-import-templates/download-import-templates';
import {ImportObjectsComponent} from './components/import-objects/import-objects';
import {ImportService} from './services/import-service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('import', reducer),
    EffectsModule.forFeature([
      ImportHistoryEffects,
    ]),
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
