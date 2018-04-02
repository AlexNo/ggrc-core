import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared';
import {ExportObjectsComponent} from './components/export-objects/export-objects';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ExportObjectsComponent,
  ],
})
export class ExportModule {
}
