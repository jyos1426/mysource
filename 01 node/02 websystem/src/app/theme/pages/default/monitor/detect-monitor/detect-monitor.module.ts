import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { DetectMonitorComponent } from './detect-monitor.component';
import { LayoutModule } from './../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';
import { detectMonitorSidebarComponent } from './detect-monitor-sidebar/detect-monitor-sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: DetectMonitorComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    PopupModule,
    DropDownsModule,
    ExcelModule,
    InputsModule,
    RouterModule.forChild(routes),
    LayoutModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    DetectMonitorComponent,
    detectMonitorSidebarComponent
  ]
})
export class DetectMonitorModule { }
