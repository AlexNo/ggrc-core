import {NgModule} from '@angular/core';

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

const materialModules = [
  MatFormFieldModule,
  MatIconModule,
  MatTabsModule,
  MatMenuModule,
  MatToolbarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatSelectModule,
];

@NgModule({
  imports: [
    ...materialModules,
  ],
  exports: [
    ...materialModules,
  ],
})
export class MaterialComponentsModule {
}