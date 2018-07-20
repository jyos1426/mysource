import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-boolean-cell',
  templateUrl: './ag-boolean-editor.component.html'
})
export class AgBooleanEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  value: boolean;
  private params: any;

  @ViewChild('input', { read: ViewContainerRef }) input;

  agInit(params: any): void {
    this.params = params;
    this.value = (this.params.value.toString() === '1') ? true : false;
  }

  getValue(): any {
    return (this.value) ? '1' : '0';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    }, 0);
  }
}
