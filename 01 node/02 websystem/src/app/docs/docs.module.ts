import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DocsComponent } from './docs.component';
import { DocsRoutingModule } from './docs-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DocsRoutingModule,
    RouterModule
  ],
  declarations: [DocsComponent]
})
export class DocsModule { }
