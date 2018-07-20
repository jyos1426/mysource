import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { NgModel, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: 'ippool-sidebar4',
  templateUrl: './ippool-sidebar4.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class IppoolSidebar4Component implements OnInit {

  @ViewChild('btnDetailSidebarClose') public btnDetailSidebarClose: ElementRef;
  @ViewChild('ippoolBackupForm') ippoolBackupForm: NgForm;

  @ViewChild('filename') filename : ElementRef;

  public stateLoading: boolean = false;
  public inputFilename: string = '';

  errorCodes = ['min', 'max', 'required', 'pattern'];
  ippoolBackupFormErrors: any[] = [];
	error_msg: string = '';
	error_detail: string = '';

  private ippoolBackupDatas: any[] = [];
  public pageSize: number;
  public skip: number;
  public gridView: GridDataResult;
  public gridDataIPPoolBackup: any[] = [];

  constructor( private _script : ScriptLoaderService, private http: Http ) { 
  	 this.pageSize = 5;
  	 this.skip = 0;
  }

  ngOnInit() {
    this.initIPPoolBackup();
  }

  ngAfterViewInit() {
    //IPPool 백업 폼 옵저버 생성
    this.ippoolBackupForm.statusChanges
    .filter((s) => s === 'INVALID')
    .switchMap(() => {
      this.ippoolBackupFormErrors = [];
      return Observable.from(Object.keys(this.ippoolBackupForm.controls));
    })
    .subscribe((controlName) => {
      this.errorCodes
      .filter((code) => this.ippoolBackupForm.hasError(code, [controlName]))
      .forEach((code) => {
        const errorMsg = this.ippoolBackupForm.getError(code, [controlName]);
        this.ippoolBackupFormErrors.push({ controlName, code, errorMsg })
      });
    });

    this.ippoolBackupForm.statusChanges.filter((s) => s === 'VALID').subscribe(() => this.ippoolBackupFormErrors = []);
  }

  public onSubmitIPPoolBakcup() {

    this.stateLoading = true;

    this.error_msg = '';
    if (!this.ippoolBackupForm.form.valid) {
      switch (this.ippoolBackupFormErrors[0].controlName) {
        case 'input-filename': this.filename.nativeElement.focus(); break;
       }
      this.error_msg = this.ippoolBackupFormErrors[0].errorMsg;
      this.stateLoading = false;
      return;
    }

    const filename = this.inputFilename;
    this.http.post('/api/policy/ippool/backup', [{filename: filename}]).map( (
      response: Response) => response.json() )
    .subscribe(
      (responses) => {
        this.stateLoading = false;

        this.initIPPoolBackup();
      }, 
      (error) => {
        this.error_msg = 'IPPool 백업에 실패하였습니다.';
        this.error_detail = JSON.parse(error['_body'])['detail'];
        this.filename.nativeElement.focus();

        this.stateLoading = false;
      }
    );
  }

  public initIPPoolBackup() {

    this.gridDataIPPoolBackup = [];
    this.http.get('/api/policy/ippool/backup').map((response: Response) => response.json() )
    .subscribe(
      response => {
        response.datas.forEach((data) => {
          this.gridDataIPPoolBackup.push(
            { date: data['date'],
              size: data['size'],
              filename: data['filename'] });
        });
        this.loadItems();
      },
      error => {

      })
  }

  public loadItems(): void {
    this.gridView = {
      data: (
        this.gridDataIPPoolBackup.slice(this.skip, this.skip + this.pageSize)
      ),
      total: this.gridDataIPPoolBackup.length
    };
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public getColClass(): string {
    if (this.stateLoading) {
      return 'm-loader m-loader--primary m-loader--right';
    } else {
      return 'input-group';
    }
  }

  public closePopup(e: any) {
    this.btnDetailSidebarClose.nativeElement.click();
  }

  public saveFile(filename: string) {
    const downloadURL = '/api/files/ippool/backup?filename=' + filename;
    this.http.get(downloadURL)
      .toPromise()
      .then(response => this.saveToFileSystem(response));
  }

  private saveToFileSystem(response) {
    const contentDispositionHeader: string = response.headers.get('Content-Disposition');
    const parts: string[] = contentDispositionHeader.split(';');
    var filename = parts[1].split('=')[1].replace(/(")/gi, '');
    const blob = new Blob([response._body], { type: 'text/plain' });
    saveAs(blob, filename);
  }
}
