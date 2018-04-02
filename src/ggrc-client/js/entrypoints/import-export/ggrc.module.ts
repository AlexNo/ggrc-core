import {BrowserModule} from '@angular/platform-browser';

// import { RouterModule } from '@angular/router';

import { CoreModule } from './core';



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

import { routes } from './app-routes';


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
    CoreModule,

    // RouterModule.forRoot(routes, { useHash: true }),

  ],
  providers: [
    ImportService,
    GApiClientService,
    // QueryApiService,
  ],
  bootstrap: [ImportExportComponent]
})
export class GGRCModule {
}
