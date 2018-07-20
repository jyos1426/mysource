import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Http, Response } from '@angular/http';
import { process } from '@progress/kendo-data-query';
import { forkJoin } from 'rxjs/observable/forkJoin';

import { IppoolSidebarComponent } from './ippool-sidebar/ippool-sidebar.component';
import { IppoolSidebar2Component } from './ippool-sidebar2/ippool-sidebar2.component';
import { IppoolSidebar3Component } from './ippool-sidebar3/ippool-sidebar3.component';
import { IppoolSidebar4Component } from './ippool-sidebar4/ippool-sidebar4.component';
import { WidgetGridComponent } from './widget-grid/widget-grid.component';

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './ippool.component.html',
  styleUrls: ['ippool.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IppoolComponent implements OnInit, AfterViewInit {

  @ViewChildren(WidgetGridComponent) widgets: QueryList<WidgetGridComponent>;
  @ViewChild('ippoolSidebar') public ippoolSidebar: IppoolSidebarComponent;
  @ViewChild('ippoolSidebar2') public ippoolSidebar2: IppoolSidebar2Component;
  @ViewChild('ippoolSidebar3') public ippoolSidebar3: IppoolSidebar3Component;
  @ViewChild('ippoolSidebar4') public ippoolSidebar4: IppoolSidebar4Component;
  @ViewChild('dataLoading') public dataLoading: ElementRef;
  @ViewChild('btnSidebar') public btnSidebar: ElementRef;
  @ViewChild('btnSidebar2') public btnSidebar2: ElementRef;
  @ViewChild('btnSidebar3') public btnSidebar3: ElementRef;

  @ViewChild('inputSearch') public inputSearch: ElementRef;

  public groupDatas: any[] = [];
  private groupDatasSearchInfo: any[] = [];

 	private objectDatas: any[] = [];
  private templateDatas: any[] = [];
  private networkDatasV4: any[] = [];
  private networkDatasV6: any[] = [];

  private networkViewCount: number = 3;

  public groupDataForDelete: any[] = [];
  public objectDataForDelete: any[] = [];
  public msg_delete_group: string = '';
  public msg_delete_object: string = '';

  public stateLoading: boolean;

  public searchString: string = '';
  public dataLoadingMessage: string = '';

  // public networkViewCountItems: Array<Item>;
  // public selectedNetworkViewCount: Item;
 	 	
  gridData: any[] = [];  
  
  constructor( private _script : ScriptLoaderService, private http: Http) {
    this.dataLoadingMessage = '데이터를 로드하고 있습니다.';
    this.stateLoading = false;
  }

  ngOnInit() {
  	this.refreshData();
  }

  ngAfterViewInit() {
    this._script.load( '.m-grid__item.m-grid__item--fluid.m-wrapper', 'assets/app/js/ippool.js' );
    // this._script.load( '.m-grid__item.m-grid__item--fluid.m-wrapper', 'assets/app/js/ippool-sidebar.js' );
  }

  // public changeNetworkViewCount( item: Item ) {
  //   this.selectedNetworkViewCount = item;
  // }

  private _loadTemplate() {
    return this.http.get('/api/policy/ippool/templates').map( (
      response: Response) => response.json() );
  }

  private _loadIPPoolGroup() {
    return this.http.get( '/api/policy/ippool/groups' ).map( (response: Response) => response.json() );
  }

  private _loadIPPoolObject() {
    return this.http.get( '/api/policy/ippool/objects' ).map( (response: Response) => response.json() );
  }

  private _loadIPPoolNetworkV4() {
    return this.http.get( '/api/policy/ippool/networks' ).map( (response: Response) => response.json() );
  }

  private _loadIPPoolNetworkV6() {
    return this.http.get( '/api/policy/ippool/networks?ipv=6' ).map( (response: Response) => response.json() );
  }

  private getNextGroupID(): number {
    //100단위(100->200->300...)
    var id = [];
    var nextID = 0;
    for(let val=100; val<=9900; val+=100) id.push(val);
    id.every((val) => {
      nextID = val;
      var res = this.groupDatas.filter((data) => {
        return data['g_id'] == val;
      });
      return res.length > 0;
    })
    return nextID;
  }

  private getNextObjectID(g_id: number): number {
    //100단위(101->201->301...)
    var id = [];
    var nextID = 0;
    for(let val=g_id+1; val<=g_id+99; val++) id.push(val);
    id.every((val) => {
      nextID = val;
      var res = this.objectDatas.filter((data) => {
        return data['o_id'] == val;
      });
      return res.length > 0;
    })
    return nextID;
  }

  private getNextTemplateID(): number {
    var id = [];
    var nextID = 0;
    for(let val=1; val<=255; val++) id.push(val);
    id.every((val) => {
      nextID = val;
      var res = this.templateDatas.filter((data) => {
        return data['template_id'] == val;
      });
      return res.length > 0;
    })
    return nextID;
  }

  public clickShowSidebar(data: any, type: string) {
    //type: group_add, object_add, object_mod
    switch (type) {
      case 'group-add': 
        this.ippoolSidebar.initGroupAdd(this.getNextGroupID());
        break;

      case 'group-mod':
        this.btnSidebar.nativeElement.click();
        this.ippoolSidebar.initGroupMod(data);
        break;

      case 'object-add':
        this.btnSidebar2.nativeElement.click();
        this.ippoolSidebar2.initObjectAdd(
          this.templateDatas,
          this.groupDatas, 
          data['g_id'], 
          this.getNextObjectID(data['g_id']));
        break;

      case 'object-mod':
        this.btnSidebar2.nativeElement.click();
        this.ippoolSidebar2.initObjectMod(
          this.templateDatas,
          this.groupDatas, 
          data,
          {});
        break;

      case 'network-mod':
        let option = data['option'];
        delete data['option'];
        this.btnSidebar2.nativeElement.click();
        this.ippoolSidebar2.initNetworkMod(
          this.templateDatas,
          this.groupDatas, 
          data,
          option);
        break;

      case 'template-manage': 
        this.ippoolSidebar3.initTemplateAdd(this.getNextTemplateID(), this.templateDatas);
        break;

      case 'ippool-backup':
        this.ippoolSidebar4.initIPPoolBackup();
        break;
    }
  }

  private doAddData() { 
    //그리드에 출력하기 위한 데이터들을 미리 추가한다.
    this.objectDatas.map((_data) => {
      _data.template['inbound_name'] = this.getTemplateName(_data['template']['inbound']);
      _data.template['outbound_name'] = this.getTemplateName(_data['template']['outbound']);

      _data['networkV4'] = this.getNetworkData(_data['o_id'], 4);
      _data['networkV6'] = this.getNetworkData(_data['o_id'], 6);
    });

    //실시간 검색을 위한 자료구조를 생성한다.
    this.groupDatasSearchInfo = [];
    this.groupDatas.forEach((gData)=>{
      var obj = new Object({g_id: gData['g_id'], filtered: true});
      this.groupDatasSearchInfo.push(obj);
    });
  }

  private getTemplateName(template_id: number): string {
    var res = this.templateDatas.filter((data) => {
      return (data['template_id'] == template_id);
    });
    return res[0]['template_name'];
  }

  getObjectData(g_id: number): any[] {
    return this.objectDatas.filter((data) => {
      return data['g_id'] == g_id;
    });
  }

  public getDeleteObjectData(): any[] {
    if (this.groupDataForDelete.length == 0) return [];
    let g_id = this.groupDataForDelete[0]['g_id'];
    return this.getObjectData(g_id);
  }

  public getDeleteNetworkData(): any[] {
    if (this.objectDataForDelete.length == 0) return [];
    let o_id = this.objectDataForDelete[0]['o_id'];
    var ipv4 = this.getNetworkData(o_id, 4);
    var ipv6 = this.getNetworkData(o_id, 6);
    return ipv4.concat(ipv6);
  }

  getNetworkData(o_id: number, ipv: number): any[] {
    if (ipv == 4) {
      return this.networkDatasV4.filter((data) => {
        return data['o_id'] == o_id;
      });
    } else {
      return this.networkDatasV6.filter((data) => {
        return data['o_id'] == o_id;
      });
    }
  }

  public refreshData() {
    this.dataLoadingMessage = '데이터를 로드하고 있습니다.';
    this.stateLoading = true;

    this.inputSearch.nativeElement.value = '';

    forkJoin([this._loadTemplate(),
              this._loadIPPoolGroup(),
              this._loadIPPoolObject(),
              this._loadIPPoolNetworkV4(),
              this._loadIPPoolNetworkV6()])
    .subscribe(
      responses => {
        this.templateDatas = responses[0].datas;
        this.groupDatas = responses[1].datas;
        this.objectDatas = responses[2].datas;
        this.networkDatasV4 = responses[3].datas;
        this.networkDatasV6 = responses[4].datas;

        this.doAddData();

        this.stateLoading = false;
      },
      error => {
        console.log(error);
      }
    )
  }

  public submitOK() {
    this.refreshData();
  }

  public refreshTemplateData() {
    forkJoin([this._loadTemplate()])
    .subscribe(
      responses => {
        this.templateDatas = responses[0].datas;
        this.clickShowSidebar([], 'template-manage');
      },
      error => {
        console.log(error);
      }
    )
  }

  public delGroup(e: any) {
    this.http.delete('/api/policy/ippool/groups', { body : this.groupDataForDelete })
    .map((response: Response) => response.json())
    .subscribe(
      data => {
        this.refreshData();
      },
      error => {
        console.log(error);
      }
    );
  }

  public delObject(e: any) {
    this.http.delete('/api/policy/ippool/objects', { body : this.objectDataForDelete })
    .map((response: Response) => response.json())
    .subscribe(
      data => {
        this.refreshData();
      },
      error => {
        console.log(error);
      }
    );
  }

  public showGroupDeleteModal(data: any) {
    this.groupDataForDelete = [ { g_id: data['g_id'] } ];
    this.msg_delete_group = `<span class="m--font-boldest">${data['g_name']}(${data['g_id']})</span> 그룹을 삭제 합니다.`;
  }

  public showObjectDeleteModal(data: any) {
    this.objectDataForDelete = [ { o_id: data['o_id'] } ];
    this.msg_delete_object = `<span class="m--font-boldest">${data['o_name']}(${data['o_id']})</span> 객체를 삭제 합니다.`;
  }

  public onSearchInputKeyUp(e: any) {
    this.searchString = e.target.value;
    var search = false;

    //그룹검색
    this.groupDatas.forEach((data) => {
      search = (String(data['g_id']) == this.searchString) || (data['g_name'].indexOf(this.searchString) >= 0);

      this.groupDatasSearchInfo.filter((_data) => {
        return _data['g_id'] == data['g_id'];
      }).map((_data) => {
        //객체검색
        var widget = this.widgets.filter((widget) => {
           return widget.groupData['g_id'] == _data['g_id'];
        })[0];

        var res = widget.search(this.searchString);

        //그룹정보에서 검색되면 무조건 true
        if (search) {
          _data['filtered'] = true
        } else {
          _data['filtered'] = res;
        }
      })
    });
  }

  public doIPPoolCompile() {
    this.stateLoading = true;
    this.dataLoadingMessage = 'IPPool 정보를 엔진에 적용하고 있습니다.';

    this.http.post('/api/policy/ippool/compile', {}).map( (
      response: Response) => response.json() )
    .subscribe(
      (responses) => {
        this.stateLoading = false;
      },
      (error) => {

      });
  }

  public existFilterResult(): boolean {
    if (this.groupDatasSearchInfo.length == 0) return true;

    var results = this.groupDatasSearchInfo.filter((data) => {
      return data['filtered'];
    });
    return results.length > 0;
  }

  public isHideData(group: any): boolean {
    let g_id = group['g_id'];
    var hidden = false;
    var results = this.groupDatasSearchInfo.filter((gData) => {
       return gData.g_id == g_id;
    });
    hidden = !results[0]['filtered'];

    return hidden;
  }
}
