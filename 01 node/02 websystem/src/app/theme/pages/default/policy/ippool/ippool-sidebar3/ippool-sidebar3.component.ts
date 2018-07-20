import { Component, OnInit, AfterViewInit, ViewEncapsulation, EventEmitter, ViewChild, ElementRef, Output } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { NgModel, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'ippool-sidebar3',
  templateUrl: './ippool-sidebar3.component.html',
  styles: [`.m-quick-sidebar { width: 500px }`],
  encapsulation: ViewEncapsulation.None
})
export class IppoolSidebar3Component implements OnInit {

  @ViewChild('btnDetailSidebarClose') public btnDetailSidebarClose: ElementRef;

  @ViewChild('templateAddForm') templateAddForm: NgForm;

  @ViewChild('templateID') templateID : ElementRef;
  @ViewChild('templateName') templateName : ElementRef;
  @ViewChild('templateFlow') templateFlow : ElementRef;

	@Output() public refreshTemplateData: EventEmitter<any> = new EventEmitter<any>();

  templateData: any;

	errorCodes = ['min', 'max', 'required', 'pattern'];
	templateAddFormErrors: any[] = [];
	error_msg: string = '';
	error_detail: string = '';

	public pageSize: number;
 	public skip: number;
 	public gridView: GridDataResult;
	public gridDataTemplate: any[] = [];

  constructor( private _script : ScriptLoaderService, private http: Http ) { 
  	this.pageSize = 5;
  	this.skip = 0;
  }

  ngOnInit() {
  	this.initTemplateAdd(1, []);
  }

  ngAfterViewInit() {
  	//템플릿추가 폼 옵저버 생성
    this.templateAddForm.statusChanges
    .filter((s) => s === 'INVALID')
    .switchMap(() => {
      this.templateAddFormErrors = [];
      return Observable.from(Object.keys(this.templateAddForm.controls));
    })
    .subscribe((controlName) => {
      this.errorCodes
      .filter((code) => this.templateAddForm.hasError(code, [controlName]))
      .forEach((code) => {
        const errorMsg = this.templateAddForm.getError(code, [controlName]);
        this.templateAddFormErrors.push({ controlName, code, errorMsg })
      });
    });

    this.templateAddForm.statusChanges.filter((s) => s === 'VALID').subscribe(() => this.templateAddFormErrors = []);
  }

  public initTemplateAdd(nextTemplateID: number, templateDatas: any[]) {
  	this.templateData = { template_id: nextTemplateID, 
  												template_name: undefined, 
  												flow: -1 };
  	this.error_msg = '';
    this.error_detail = '';

    this.gridDataTemplate = [];
    templateDatas.forEach((data) => {
    	this.gridDataTemplate.push(
    		{ id: data['template_id'],
    			name: data['template_name'],
    			flow: data['flow'] });
    });

    this.loadItems();
  }

	private addTemplate(templateDatas: any[]) {
    return this.http
        .post('/api/policy/ippool/templates', templateDatas)
        .map((response: Response) => response.json());
  }

  private delTemplate(dataItem: any) {

  	let templateDatas = [{ template_id: dataItem.id }]

    return this.http
      .delete('/api/policy/ippool/templates', { body : templateDatas })
      .map((response: Response) => response.json())
      .subscribe(
      	data => {
      		this.refreshTemplateData.emit();
      	},
      	error => {
      		this.error_msg = '템플릿 삭제에 실패하였습니다.';
      		this.error_detail = JSON.parse(error['_body'])['detail'];
      		this.templateID.nativeElement.focus();
      	}
      );
  }

  public onSubmitTemplateAdd() {
    
    this.error_msg = '';
    if (!this.templateAddForm.form.valid) {
      switch (this.templateAddFormErrors[0].controlName) {
        case 'template-id': this.templateID.nativeElement.focus(); break;
        case 'template-name': this.templateName.nativeElement.focus(); break;
     	}
      this.error_msg = this.templateAddFormErrors[0].errorMsg;
      return;
    }

    this.templateData.flow = this.templateFlow.nativeElement.value;

    this.addTemplate([this.templateData]).subscribe(
      data => {
        this.refreshTemplateData.emit();
      },
      error => {
        this.error_msg = '템플릿 추가에 실패하였습니다.';
        this.error_detail = JSON.parse(error['_body'])['detail'];
        this.templateID.nativeElement.focus();
      }
    );
  }

  public loadItems(): void {
    this.gridView = {
      data: (
        this.gridDataTemplate.slice(this.skip, this.skip + this.pageSize)
      ),
      total: this.gridDataTemplate.length
    };
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public closePopup(e: any) {
    this.btnDetailSidebarClose.nativeElement.click();
  }

}
