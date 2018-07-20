import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { RequiredValueValidator, MinNumValueValidator, MaxNumValueValidator } from './../../../../../_interfaces/form-validators';

import { IppoolComponent } from './ippool.component';
import { LayoutModule } from './../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';
import { WidgetGridComponent } from './widget-grid/widget-grid.component';
import { IppoolSidebarComponent } from './ippool-sidebar/ippool-sidebar.component';
import { IppoolSidebar2Component } from './ippool-sidebar2/ippool-sidebar2.component';
import { IppoolSidebar3Component } from './ippool-sidebar3/ippool-sidebar3.component';
import { IppoolSidebar4Component } from './ippool-sidebar4/ippool-sidebar4.component';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: IppoolComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    // BrowserAnimationsModule,
    DropDownsModule,
    RouterModule.forChild(routes),
    LayoutModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    IppoolComponent,
    RequiredValueValidator,
    MinNumValueValidator,
    MaxNumValueValidator,
    WidgetGridComponent,
    IppoolSidebarComponent,
    IppoolSidebar2Component,
    IppoolSidebar3Component,
    IppoolSidebar4Component
  ]
})
export class IPPoolModule { }
