import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PopupModule } from '@progress/kendo-angular-popup';

import { UserComponent } from './user.component';
import { AddUserSidebarComponent } from './add-user-sidebar/add-user-sidebar.component';
import { ModifyUserSidebarComponent } from './modify-user-sidebar/modify-user-sidebar.component';
import { CheckDeleteModalComponent } from './check-delete-modal/check-delete-modal.component';

import { LayoutModule } from './../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';

import { UserService } from './_services/user.service';
import { TextMaskModule } from 'angular2-text-mask';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: UserComponent
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
    TextMaskModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    UserComponent,
    AddUserSidebarComponent,
    ModifyUserSidebarComponent,
    CheckDeleteModalComponent
  ],
  providers: [
    UserService
  ]
})
export class UserModule { }
