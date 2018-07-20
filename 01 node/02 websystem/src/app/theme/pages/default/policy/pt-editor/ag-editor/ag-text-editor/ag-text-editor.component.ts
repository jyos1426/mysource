import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-text-cell',
  templateUrl: './ag-text-editor.component.html'
})
export class AgTextEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  value: string;
  private params: any;

  @ViewChild('input', { read: ViewContainerRef }) input;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
  }

  getValue(): any {
    return this.value.toString();
  }

  onKeyDown(event): void {
    // if (!this.isKeyPressedNumeric(event)) {
    //   if (event.preventDefault) event.preventDefault();
    // }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    }, 0);
  }
}
