import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// import { RouterModule } from '@angular/router';

import {CoreModule} from './core';

import {NgModule} from '@angular/core';

import {SharedModule} from './shared';
import {ImportModule} from './import';
import {ExportModule} from './export';

import {GGRCAppComponent} from './ggrc.component';

// import { routes } from './ggrc-routes';

import './styles/styles.css';

@NgModule({
  declarations: [
    GGRCAppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    ImportModule,
    ExportModule,
    // RouterModule.forRoot(routes, { useHash: true }),
  ],
  providers: [],
  bootstrap: [GGRCAppComponent]
})
export class GGRCModule {
}
