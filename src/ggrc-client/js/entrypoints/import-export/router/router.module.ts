import { NgModule }            from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {PageNotFoundComponent} from "../core/components/page-not-found/page-not-found";

const routes: Routes = [
  {path: 'import', component: ''},
  {path: 'export', component: ''},
  {path: '', redirectTo: '/import', pathMatch: 'full' },
  {path: '**', component: PageNotFoundComponent}
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
})
export class RoutingModule {}