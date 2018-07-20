import { Component, OnInit, AfterViewInit, ViewEncapsulation, EventEmitter, ViewChild, ElementRef, Output } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { NgModel, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'ippool-sidebar',
  templateUrl: './ippool-sidebar.component.html', 
  styles: [`#noc-check-all { display: inline; float: right; }`],
  encapsulation: ViewEncapsulation.None
})
export class IppoolSidebarComponent implements OnInit, AfterViewInit {

  @ViewChild('btnDetailSidebarClose') public btnDetailSidebarClose: ElementRef;

  @ViewChild('groupAddForm') groupAddForm: NgForm;
  
  @ViewChild('groupID') groupID : ElementRef;
  @ViewChild('groupName') groupName : ElementRef;
  
  @ViewChild('tabGroupAdd') tabGroupAdd : ElementRef;
  
  @Output() public submitOK: EventEmitter<any> = new EventEmitter<any>();

  sidebarMode: string = 'group-add';

  templateDatas: any[] = [];
  groupDatas: any[] = [];
  groupData: any;
  objectData: any;
  errorCodes = ['min', 'max', 'required', 'pattern'];
  groupAddFormErrors: any[] = [];
  error_msg: string = '';
  error_detail: string = '';
   
  constructor( private _script : ScriptLoaderService, private http: Http ) { }

  ngOnInit() {
    this.sidebarMode = 'group-add';

    this.initGroupAdd(100);
  }

  ngAfterViewInit() {
    this._script.load( '.m-grid__item.m-grid__item--fluid.m-wrapper', 'assets/app/js/ippool-sidebar.js' );

    //그룹추가 폼 옵저버 생성
    this.groupAddForm.statusChanges
    .filter((s) => s === 'INVALID')
    .switchMap(() => {
      this.groupAddFormErrors = [];
      return Observable.from(Object.keys(this.groupAddForm.controls));
    })
    .subscribe((controlName) => {
      this.errorCodes
      .filter((code) => this.groupAddForm.hasError(code, [controlName]))
      .forEach((code) => {
        const errorMsg = this.groupAddForm.getError(code, [controlName]);
        this.groupAddFormErrors.push({ controlName, code, errorMsg })
      });
    });

    this.groupAddForm.statusChanges.filter((s) => s === 'VALID').subscribe(() => this.groupAddFormErrors = []);
  }

  public initGroupAdd(nextGroupID: number) {

    this.sidebarMode = 'group-add';
    this.tabGroupAdd.nativeElement.click();
    
    this.groupData = { g_id: nextGroupID, g_name: undefined };
    this.error_msg = '';
    this.error_detail = '';
  }

  public initGroupMod(groupData: any) {

    this.sidebarMode = 'group-mod';
    this.tabGroupAdd.nativeElement.click();
    
    this.groupData = groupData;
    this.error_msg = '';
    this.error_detail = '';
  }

  private addGroup(groupDatas: any[]) {
    return this.http
        .post('/api/policy/ippool/groups', groupDatas)
        .map((response: Response) => response.json());
  }

  private modGroup(groupDatas: any[]) {
    return this.http
        .patch('/api/policy/ippool/groups', groupDatas)
        .map((response: Response) => response.json());
  }

  public onSubmit() {
    switch (this.sidebarMode) {
      case 'group-add':
        this.onSubmitGroupAdd();
        break;
      case 'group-mod':
        this.onSubmitGroupMod();
        break;
    }
  }

  private onSubmitGroupAdd() {
    
    this.error_msg = '';
    if (!this.groupAddForm.form.valid) {
      switch (this.groupAddFormErrors[0].controlName) {
        case 'group-id': this.groupID.nativeElement.focus(); break;
        case 'group-name': this.groupName.nativeElement.focus(); break;
      }
      this.error_msg = this.groupAddFormErrors[0].errorMsg;
      return;
    }

    this.addGroup([this.groupData]).subscribe(
      data => {
        this.btnDetailSidebarClose.nativeElement.click();
        this.submitOK.emit();
      },
      error => {
        this.error_msg = '그룹 추가에 실패하였습니다.';
        this.error_detail = JSON.parse(error['_body'])['detail'];
        this.groupID.nativeElement.focus();
      }
    );
  }

  private onSubmitGroupMod() {
    
    this.error_msg = '';
    if (!this.groupAddForm.form.valid) {
      switch (this.groupAddFormErrors[0].controlName) {
        case 'group-id': this.groupID.nativeElement.focus(); break;
        case 'group-name': this.groupName.nativeElement.focus(); break;
      }
      this.error_msg = this.groupAddFormErrors[0].errorMsg;
      return;
    }

    this.modGroup([this.groupData]).subscribe(
      data => {
        this.btnDetailSidebarClose.nativeElement.click();
        this.submitOK.emit();
      },
      error => {
        this.error_msg = '그룹 수정에 실패하였습니다.';
        this.error_detail = JSON.parse(error['_body'])['detail'];
        this.groupID.nativeElement.focus();
      }
    );
  }

  public closePopup(e: any) {
    this.btnDetailSidebarClose.nativeElement.click();
  }

}
