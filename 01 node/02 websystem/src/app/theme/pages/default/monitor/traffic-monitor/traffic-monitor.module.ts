import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';

import { TrafficMonitorComponent } from './traffic-monitor.component';
import { TrafficMonitorWidgetComponent } from './widget/traffic-monitor-widget.component';
import { BigChartComponent } from './big-chart/big-chart.component';

import { LayoutModule } from './../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: TrafficMonitorComponent
      }    
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    RouterModule.forChild(routes),
    LayoutModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    TrafficMonitorComponent,
    TrafficMonitorWidgetComponent,
    BigChartComponent
  ]
})
export class TrafficMonitorModule { }
