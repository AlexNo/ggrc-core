import { NgModule }            from '@angular/core';

import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
  declarations: [
    ...materialModules,
  ],
  exports: [
    ...materialModules,
  ],
})
export class MaterialComponentsModule { }