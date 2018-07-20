import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PopupModule } from '@progress/kendo-angular-popup';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LayoutModule } from './../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';
import { DetectLogService } from './_services/detect-log.service';
import { DetectLogComponent } from './detect-log.component';
import { DetailSidebarComponent } from './detail-sidebar/detail-sidebar.component';
import '@progress/kendo-angular-intl/locales/ko/all';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: DetectLogComponent
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
    IntlModule,
    DateInputsModule,
    DropDownsModule,
    InputsModule,
    PopupModule,
    RouterModule.forChild(routes),
    LayoutModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    DetectLogComponent,DetailSidebarComponent
  ],
  providers: [
    DetectLogService
  ]
})
export class DetectLogModule { }
