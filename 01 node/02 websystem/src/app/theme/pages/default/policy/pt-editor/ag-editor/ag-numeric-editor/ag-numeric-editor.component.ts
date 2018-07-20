import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-numeric-cell',
  templateUrl: './ag-numeric-editor.component.html'
})
export class AgNumericEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  @ViewChild('input') input;

  value: number;
  private params: any;

  agInit(params: any): void {
    this.params = params;
    this.value = Number(this.params.value);
  }

  getValue(): any {
    return this.value.toString();
  }

  onKeyDown(event): void {
    const key = event.which || event.keyCode;
    if (key === 38 || key === 40) { // up down
      event.preventDefault();
      event.stopPropagation();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.focus();
    }, 0);
  }
}
