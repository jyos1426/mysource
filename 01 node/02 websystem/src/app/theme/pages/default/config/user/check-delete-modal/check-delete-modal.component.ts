import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  Output,
  Input,
  EventEmitter,
  ViewChild
} from '@angular/core';


@Component({
  selector: 'app-check-delete-modal',
  templateUrl: './check-delete-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CheckDeleteModalComponent implements OnInit, AfterViewInit {
  @Output() deleteConfirm = new EventEmitter();
  @ViewChild('btnModalClose') btnModalClose : ElementRef;
  selectedId : string;

  constructor() {
  }

  initForm(id: string) {
    console.log(id);
    this.selectedId = id;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  confirm(){
    this.deleteConfirm.emit();
    this.btnModalClose.nativeElement.click();  
  }
}
