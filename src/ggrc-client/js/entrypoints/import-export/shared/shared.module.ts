import { NgModule }            from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MaterialComponentsModule } from '../material-components'

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    MaterialComponentsModule,
  ],
})
export class SharedModule {}