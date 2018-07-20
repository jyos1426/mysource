import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { PtEditorComponent } from './pt-editor.component';
import { LayoutModule } from './../../../../layouts/layout.module';
import { DefaultComponent } from './../../default.component';

import { PtEditorService } from './_services/pt-editor.service';
import { AgCellRenderer } from './ag-editor/ag-cell-renderer/ag-cell-renderer.service';

import { AgSelectEditorComponent } from './ag-editor/ag-select-editor/ag-select-editor.component';
import { AgNumericEditorComponent } from './ag-editor/ag-numeric-editor/ag-numeric-editor.component';
import { AgTextEditorComponent } from './ag-editor/ag-text-editor/ag-text-editor.component';
import { AgBooleanEditorComponent } from './ag-editor/ag-boolean-editor/ag-boolean-editor.component';
import { SubmitEditorModalComponent } from './submit-editor-modal/submit-editor-modal.component';

import { TreeModule } from 'primeng/primeng';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: PtEditorComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    GridModule,
    DropDownsModule,
    InputsModule,
    AgGridModule.withComponents(
      [
        AgSelectEditorComponent,
        AgNumericEditorComponent,
        AgTextEditorComponent,
        AgBooleanEditorComponent,
      ]
    ),
    RouterModule.forChild(routes),
    LayoutModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    AgSelectEditorComponent,
    AgNumericEditorComponent,
    AgTextEditorComponent,
    AgBooleanEditorComponent,
    SubmitEditorModalComponent,
    PtEditorComponent,
  ],
  providers: [
    PtEditorService,
    AgCellRenderer,
  ]
})
export class PtEditorModule { }
