import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PopupModule } from '@progress/kendo-angular-popup';

import { BlockMonitorService } from './_services/block-monitor.service';

import { BlockMonitorComponent } from './block-monitor.component';
import { AddBlockModalComponent } from './add-block-modal/add-block-modal.component';
import { DeleteBlockModalComponent } from './delete-block-modal/delete-block-modal.component';
import { GridContextMenuComponent } from './grid-context-menu/grid-context-menu.component';
import { LayoutModule } from './../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';
import { BlockMonitorSidebarComponent } from './block-monitor-sidebar/block-monitor-sidebar.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: BlockMonitorComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    ExcelModule,
    DropDownsModule,
    InputsModule,
    PopupModule,
    RouterModule.forChild(routes),
    LayoutModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    BlockMonitorComponent,
    AddBlockModalComponent,
    DeleteBlockModalComponent,
    GridContextMenuComponent,
    BlockMonitorSidebarComponent
  ],
  providers: [
    BlockMonitorService
  ]
})
export class BlockMonitorModule { }
