import { Component, ViewContainerRef, ViewChild, AfterViewInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular/main';

@Component({
  selector: 'app-ag-select-cell',
  templateUrl: './ag-select-editor.component.html',
  styleUrls: ['./ag-select-editor.component.scss']
})
export class AgSelectEditorComponent implements AfterViewInit, ICellEditorAngularComp {
  items: Array<any>;
  selectedItem: any;
  title: string;

  private params: any;
  private data: any;

  @ViewChild('ddlSelect') ddlSelect: any;

  agInit(params: any): void {
    this.params = params;
    this.title = this.params.title;
    this.data = this.params.values;
    this.items = this.data;

    const selectIndex = this.items.findIndex(item => {
      return item.value.toString() === this.params.value.toString();
    });

    this.selectedItem = this.items[selectIndex];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.ddlSelect.toggle(true);
      this.ddlSelect.focus();
    }, 0);
  }

  getValue() {
    return this.selectedItem.value;
  }

  isPopup(): boolean {
    return false;
  }

  onKeyDown(event): void {
    const key = event.which || event.keyCode;
    if (key === 38 || key === 40) {
      this.preventDefaultAndPropagation(event);

      let selectedIndex = this.items.indexOf(this.selectedItem);

      if (key === 38) {            // up
        selectedIndex = selectedIndex === 0 ? (this.items.length - 1) : selectedIndex - 1;
      } else if (key === 40) {     // down
        selectedIndex = (selectedIndex === this.items.length - 1) ? 0 : selectedIndex + 1;
      }
      this.selectedItem = this.items[selectedIndex];
    }
  }

  private preventDefaultAndPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
