import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import {ImportHistoryComponent} from './import-history/import-history.component';

const COMPONENTS = [
  ImportHistoryComponent,
];

@NgModule({
  imports: [],
  exports: COMPONENTS,
  declarations: COMPONENTS,
})
export class ImportHistoryModule {
}
