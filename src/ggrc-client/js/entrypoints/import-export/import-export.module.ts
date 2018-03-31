import {BrowserModule} from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Angular Material
import {
  MatFormFieldModule,
  MatIconModule,
  MatTabsModule,
  MatMenuModule,
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
} from '@angular/material';

import {NgModule} from '@angular/core';

import {ImportExportComponent} from './import-export.component';
import {PageNavbarComponent} from './compoentns/page-navbar/page-navbar';
import {ImportObjectsComponent} from './compoentns/import-objects/import-objects';
import {ExportObjectsComponent} from './compoentns/export-objects/export-objects';
import {DownloadImportTemplatesDialogComponent} from './compoentns/download-import-templates/download-import-templates';

// Services
import { ImportService } from "./services/import-service";
import { GApiClientService } from "./services/gapi-client";

// import { QueryApiService } from './services/query-api-service';

@NgModule({
  declarations: [
    ImportExportComponent,
    PageNavbarComponent,
    ImportObjectsComponent,
    ExportObjectsComponent,
    DownloadImportTemplatesDialogComponent,
  ],
  entryComponents: [
    DownloadImportTemplatesDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  providers: [
    ImportService,
    GApiClientService,
    // QueryApiService,
  ],
  bootstrap: [ImportExportComponent]
})
export class ImportExportModule {
}
