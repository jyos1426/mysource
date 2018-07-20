import { Component, OnInit, AfterViewInit, Input, Output, ViewEncapsulation, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';

import { formatNumber } from '@telerik/kendo-intl';

@Component({
  selector: 'widget-grid',
  templateUrl: './widget-grid.component.html',
  styles: [
  `
    .k-grid tr.object-row td {
      background-color: #fff;
      border-width: 0px 0px 1px 1px;
    }
    .k-grid tr.object-row-filtered td {
      background-color: #D6EAF8;
      border-width: 0px 0px 1px 1px;
    }
    .k-grid tr.object-row-not-filtered td {
      display: none;
    }
    .ippool-grid .k-grid-header .k-grid {
        padding: 4px;
        position: relative;
    }
    .ippool-grid th {
      padding: 1px;
      position: relative;
    }
  `
  ],
  encapsulation: ViewEncapsulation.None
})
export class WidgetGridComponent implements OnInit, AfterViewInit {
  @Input() groupData;
  @Input() viewData;
  @Input() networkViewLimitCount;

  @Output() public showGroupDeleteModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() public showObjectDeleteModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() public clickObjectAddShowSidebar: EventEmitter<any> = new EventEmitter<any>();
  @Output() public clickObjectModShowSidebar: EventEmitter<any> = new EventEmitter<any>();
  @Output() public clickNetworkModShowSidebar: EventEmitter<any> = new EventEmitter<any>();
  @Output() public clickGroupModShowSidebar: EventEmitter<any> = new EventEmitter<any>();

  public gridData: any[] = [];
  public isHideSummary: boolean = false;
  public isNOCViewDetailMode: boolean = false;
  public titleNOCDetail: string = '';
  
  constructor( private _script : ScriptLoaderService ) { 
    this.isNOCViewDetailMode = false;
    this.titleNOCDetail = '상세보기';
  }

  ngOnInit() {
    this.displayGrid(this.viewData);

    this.isHideSummary = !(this.viewData.length > 0);
  }

  ngAfterViewInit() {}

  //Display Grid
  private displayGrid(jsonData: any[]) {

    jsonData.map((data, i) => {
      var row = new Object();
      
      row['enable'] = data['use'];
      row['o_id'] = data['o_id'];
      row['o_name'] = data['o_name'];

      row['networkV4'] = data['networkV4'];
      row['networkV6'] = data['networkV6'];
      
      row['template_inbound_id'] = data['template']['inbound'];
      row['template_inbound'] = data['template']['inbound_name'];
      row['template_outbound_id'] = data['template']['outbound'];
      row['template_outbound'] = data['template']['outbound_name'];

      row['noc'] = data['noc'];
      //필터시 row style 처리를 위한 flag
      row['filterInfo'] = { filterMode: false, isFiltered: false };

      this.gridData.push(row);
    });
  }

  public setRowStyle(context: RowClassArgs) {
    //여기서는 콤포넌트내의 멤버변수들에 접근이 불가능하다.
    if (context.dataItem.filterInfo.filterMode) {
      if (context.dataItem.filterInfo.isFiltered)
        return 'object-row-filtered';
      else
        return 'object-row-not-filtered';
    } else {
      return 'object-row';
    }
  }

  public getTopNetwork(networks: any[], limit: number): any[] {
    return networks.slice(0, limit);
  }

  public getTotalNetworkCount(ipv: number): string {
    var count = 0;
    if (ipv = 4) {
      this.viewData.map((data) => {
        count += data.networkV4.length;
      })
    } else {
      this.viewData.map((data) => {
        count += data.networkV6.length;
      })
    }
    return formatNumber(count, "n");
  }

  public getObjectData(o_id: number): any {
    if (o_id == -1) return [];
    var res = this.viewData.filter((data) => {
      return o_id == data['o_id'];
    })[0];
    return res;
  }

  public delGroup() {
    this.showGroupDeleteModal.emit(this.groupData);
  }

  public delObject(item: any) {
    this.showObjectDeleteModal.emit(item);
  }

  public showSidebar(type: string, data: any, option: any) {
    switch (type) {
      case 'group-mod':
        this.clickGroupModShowSidebar.emit(this.groupData);
        break;
      case 'object-add': 
        this.clickObjectAddShowSidebar.emit(this.groupData);
        break;
      case 'object-mod': 
        data['g_id'] = this.groupData['g_id'];
        this.clickObjectModShowSidebar.emit(data);
        break;
      case 'network-mod':
        data['g_id'] = this.groupData['g_id'];
        data['option'] = option;
        this.clickNetworkModShowSidebar.emit(data);
        break;
    }
    
  }

  public getPTEditorUrl(templateID: number): string {
    return `/policy/pt-editor?template_id=${templateID}`;
  }

  public toggleNOCDetailMode() {
    this.isNOCViewDetailMode = !this.isNOCViewDetailMode;
    if (this.isNOCViewDetailMode) 
      this.titleNOCDetail = '축약보기'
    else
      this.titleNOCDetail = '상세보기';
  }

  //객체ID/객체명에서 searchString을 검색하고 검색결과가 존재하지 않으면 네트워크정보를 추가로 검색한다.
  public search(searchString: string): boolean {
    var existFilterData = false;

    this.gridData.map((rowData) => {
      rowData['filterInfo']['filterMode'] = searchString != '';

      if ((rowData['filterInfo']['filterMode']) && 
        ((String(rowData['o_id']) == searchString) || (rowData['o_name'].indexOf(searchString) >= 0))) {
        existFilterData = true;
        rowData['filterInfo']['isFiltered'] = true;
      } else {
        const networkV4 = rowData['networkV4'];
        const networkV6 = rowData['networkV6'];
        var results = networkV4.filter((networkData) => {
          return networkData['network'].indexOf(searchString) >= 0;
        });
        if (results.length == 0) {
          var results = networkV6.filter((networkData) => {
            return networkData['network'].indexOf(searchString) >= 0;
          });
        }
        if (results.length > 0) existFilterData = true;
        rowData['filterInfo']['isFiltered'] = results.length > 0;
      }
    });
    return existFilterData;
  }

}
