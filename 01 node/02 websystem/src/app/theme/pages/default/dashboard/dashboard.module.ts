import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { HttpApiService } from '../../../../_services/http-api.service';
import { DashboardComponent } from './dashboard.component';
import { LayoutModule } from './../../../layouts/layout.module';
import { DefaultComponent } from './../default.component';

import { ChartistModule } from './chartist.component'
import { DashboardService } from './_services/dashboard.service';
const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    ChartistModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    DashboardService,
    HttpApiService
  ]
})
export class DashboardModule { }
