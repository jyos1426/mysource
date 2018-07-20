import { Component, OnInit,ViewChild, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from './../../../../../helpers';
// import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

import { GridComponent,GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Http, Response } from '@angular/http';

import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

import { UserService } from './_services/user.service';
import { AddUserSidebarComponent } from './add-user-sidebar/add-user-sidebar.component';
import { ModifyUserSidebarComponent } from './modify-user-sidebar/modify-user-sidebar.component';
import { CheckDeleteModalComponent } from './check-delete-modal/check-delete-modal.component';

import * as moment from 'moment';

interface Item {
  text: string;
  value: number;
}

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './user.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UserComponent implements OnInit, AfterViewInit {  
  @ViewChild('addUserSidebar') addUserSidebar: AddUserSidebarComponent; 
  @ViewChild('modifyUserSidebar') modifyUserSidebar: ModifyUserSidebarComponent; 
  @ViewChild('checkDeleteModal') checkDeleteModal: CheckDeleteModalComponent; 
  @ViewChild('btnOpenModifySidebar') btnOpenModifySidebar: ElementRef; 
  @ViewChild('btnOpenDelteModal') btnOpenDelteModal: ElementRef; 
  @ViewChild('btnOpenAddSidebar') btnOpenAddSidebar: ElementRef; 
  @ViewChild('blockSearching') public blockSearching: ElementRef;

  userGridView: GridDataResult;
  pageSize: number;
  skip: number;

  public userGridData: Array<any>;
  // private data: Object[];
  private length: number = 0;
  private pageMaxListSize: number;
  private pageListSize: number;

  private selectedId: string;

  userExcelFileName : string = "";
  
  constructor(
    private _script: ScriptLoaderService,
    private _userService : UserService, 
    private http: Http) {
    
    this.userGridData = [];

    this.pageSize = 10;
    this.pageMaxListSize = 10;
    this.pageListSize = 0;
    this.length = (this.pageSize * this.pageMaxListSize <= this.userGridData.length) ? (this.pageSize * this.pageMaxListSize) : this.userGridData.length;
    if( this.length / this.pageSize < this.pageMaxListSize) 
      this.pageListSize = Math.ceil(this.length/this.pageSize);
    else
      this.pageListSize = this.pageMaxListSize;

    this.loadUserItems();
  }

  ngOnInit() {
    this.skip = 0;
    this.renderUserGrid();    
  }

  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper','assets/app/js/user.js');
  }

  renderUserGrid(){
    this.blockSearching.nativeElement.className = 'fadeIn animated';
    
    const params = {
      id : undefined,
    };
    this._userService.getUserData(params).subscribe(
      data => {
        if (typeof data === 'undefined') {
          this.userGridData = [];
        } else {
          this.parseUserGridData(data.datas);
          this.loadUserItems();
        }
      },
      error => {
        this.userGridData = [];
      }
    );
  }

  public parseUserGridData(jsonData: any[]) {
    const tempGridData: any[] = [];

    jsonData.forEach((row, idx) => {
      tempGridData.push({
        id: row.id,
        email: row.email,
        access_address: row.access_address.length,
        password_limit: row.password_limit,
        authority: row.authority,
        extension: row.extension,
        phone: row.phone,
      });
    });

    this.blockSearching.nativeElement.className = 'fadeOut animated';
    this.userGridData = tempGridData;
  }

  pageChange(event: PageChangeEvent): void {

    let maybeLastPage = event.skip + this.pageSize;
    if (maybeLastPage >= this.length) {
      this.length = (this.length <= this.userGridData.length && (this.length + this.pageSize * this.pageListSize) <= this.userGridData.length) ? (this.length + this.pageSize * this.pageListSize) : this.userGridData.length;
    }

    this.skip = event.skip;
    this.loadUserItems();
  }

  private loadUserItems(): void {
    this.userGridView = {
      data: this.userGridData.slice(this.skip, this.skip + this.pageSize),
      total: this.userGridData.length
    };
  }
  
  public openAddSidebar() {
    this.addUserSidebar.initForm(); 
    this.btnOpenAddSidebar.nativeElement.click(); 
  }

  public openModifySidebar(id: string) {
    this.selectedId = id;
    this.modifyUserSidebar.initForm(this.selectedId);
    this.btnOpenModifySidebar.nativeElement.click();  
  }
  
  public openCheckDeleteModal(id : string) {
    this.selectedId = id;
    this.checkDeleteModal.initForm(this.selectedId);
    this.btnOpenDelteModal.nativeElement.click();
  }

  public deleteUser() {
    const params = {
      id : this.selectedId,
    };
    this._userService.deleteUser(params).subscribe(
      data => {
        if (typeof data === 'undefined') {
          console.log('data : undefined');
        } else {
          this.renderUserGrid();
        }
      },
      error => {
        console.log('data : undefined');
      }
    );
  }
  
  public exportToExcel(grid: GridComponent) {
    this.userExcelFileName = `User_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
    grid.saveAsExcel();    
  }

}
