import { 
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription  } from 'rxjs/Rx';

import {   GridComponent,
  SelectionEvent,
  RowClassArgs,
  GridDataResult,
  PageChangeEvent 
} from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import * as moment from 'moment';
import { Helpers } from './../../../../../helpers';

import { DetectLogService } from './_services/detect-log.service';
import { DetailSidebarComponent } from './detail-sidebar/detail-sidebar.component';

export class DetaectLogFilter {
  ipv: number = 4;  
}

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './detect-log.component.html',
  styleUrls: ['detect-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetectLogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dpFrom') public dpFrom: any;
  @ViewChild('detectSearching') public detectSearching: ElementRef;
  @ViewChild('mPortlet') public mPortlet: ElementRef;
  @ViewChild('detailSidebar') public detailSidebar: DetailSidebarComponent;

  public gridView: GridDataResult;
  public gridData: Array<any>;
  public detectLogExcelFileName: string;
  public ipv: number;
  public selectedRowKeys: number[];
  public selectedRows: Array<any>;
  public pageSize: number;
  public pageListSize: number;
  public skip: number;
  public sort: SortDescriptor[];
  public length: number;

  public stateSearching: boolean;
  public hasPeriodFilter: boolean;
  public fromDate: Date;
  public toDateMax: Date;
  public unchangeFromDate: Date;
  public isDateMax: boolean;
  public applyFilterData: object;
  public applyFilterItems: Array<any>;

  private last : string;
  private offset : number;
  private datalength : number;  
  private bserachinit: boolean;
  private currentPage: Array<any>;

  constructor(
    private _router: Router,
    private _script: ScriptLoaderService,
    private _detectLogService: DetectLogService 
  ) {
    this.selectedRowKeys = [];
    this.gridData = [];
    this.pageSize = 25;
    this.pageListSize = 10;
    this.stateSearching = false;
    this.hasPeriodFilter = false;
    this.sort = [];

    this.fromDate = moment(moment().format('YYYYMMDD'), 'YYYYMMDD').toDate();
    this.unchangeFromDate = this.fromDate;
    this.toDateMax = this.fromDate;
    this.isDateMax = true;

    this.ipv = 4;
    this.applyFilterData = {};

    this.last = '';
    this.offset = 0;
    this.datalength = 0;
    this.skip = 0;

    this.bserachinit = true;
  }

  ngOnInit() {
    this.search();    
  }

  ngOnDestroy(){ }

  ngAfterViewInit() {
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/app/js/block-log.js'
    );
  }

  public clickSearch(e: any) {
    this.gridData = [];
    this.bserachinit = true;
    this.datalength =0;
    this.skip = 0;
    this.search();
  }

  public search() {
    if (!this.stateSearching && this.dpFrom.errors === null) {
      this.sort = [];
      this.selectedRowKeys = [];      
      this.mPortlet.nativeElement.className = 'm-portlet m-portlet--tabs m-portlet--relative';
      this.detectSearching.nativeElement.className = 'fadeIn animated';
      this.stateSearching = true;
      this.isDateMax = this.fromDate >= this.toDateMax ? true : false;

      this.renderDetectLogGrid();
    }
  }

  public formatterTime(value: string) {
    return moment(value, 'YYYYMMDDHHmmss').format('HH:mm:ss');
  }

  public renderDetectLogGrid() {
    const params = {};
    const filterData = this.applyFilterData;
    
    params['ipv'] = this.ipv;
    params['limit'] = this.pageSize * 10;
    if (filterData.hasOwnProperty('fromDate') && filterData.hasOwnProperty('toDate')) {
      params['from'] = filterData['fromDate'];
      params['to'] = filterData['toDate'];
    } else {
      params['from'] = `${moment(this.fromDate).format('YYYYMMDD')}000000`;
    }

    if (filterData.hasOwnProperty('category')) {
      params['category_code'] = filterData['category'].value;
    }
    if (filterData.hasOwnProperty('attack_code')) {
      params['attack_code'] = filterData['attack_code'];
    }
    if (filterData.hasOwnProperty('risk')) {
      params['risk'] = filterData['risk'].value;
    }
    if (filterData.hasOwnProperty('hip') && filterData.hasOwnProperty('hprefix')) {
      params['hip'] = filterData['hip'];
      params['hprefix'] = filterData['hprefix'];
    }
    if (filterData.hasOwnProperty('vip') && filterData.hasOwnProperty('vprefix')) {
      params['vip'] = filterData['vip'];
      params['vprefix'] = filterData['vprefix'];
    } 
    if (filterData.hasOwnProperty('hport_f') && filterData.hasOwnProperty('hport_t')) {
      params['hport_f'] = filterData['hport_f'];
      params['hport_t'] = filterData['hport_t'];
    }
    if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
      params['vport_f'] = filterData['vport_f'];
      params['vport_t'] = filterData['vport_t'];
    }
    if (filterData.hasOwnProperty('g_id')) {
        params['g_id'] = filterData['g_id'].value;
    }
    if (filterData.hasOwnProperty('o_id')) {
      params['o_id'] = filterData['o_id'].value;
    }
    if (filterData.hasOwnProperty('flow')) {
      params['flow'] = filterData['flow'].value;
    }
    if (filterData.hasOwnProperty('method')) {
      params['method'] = filterData['method'].value;
    }
    if (filterData.hasOwnProperty('reason')) {
      params['reason'] = filterData['reason'].value;
    }
    if (filterData.hasOwnProperty('block')) {
      params['block'] = filterData['block'].value;
    }
    if (filterData.hasOwnProperty('raw')) {
      params['raw'] = filterData['raw'].value;
    }
    if (filterData.hasOwnProperty('h_asset')) {
      params['h_asset'] = filterData['h_asset'];
    }
    if (filterData.hasOwnProperty('v_asset')) {
      params['v_asset'] = filterData['v_asset'];
    }
    if (filterData.hasOwnProperty('a_id')) {
      params['a_id'] = filterData['a_id'];
    }
    
    if ( this.bserachinit == false ) {
      params['last'] = this.last;
      params['offset'] = this.offset;
    } else {
      this.gridData = [];
    }
    console.log(params);
    this._detectLogService.getDetectLogData(params).subscribe(
      data => {
        if (typeof data.datas !== 'undefined') {
          const fullGridData = this.parseGridData(data.datas);
          // this.gridData = [];
          if (this.applyFilterData.hasOwnProperty('attack_name')) {
            this.gridData = this.gridData.concat(fullGridData.filter(row => {
                const column = row['policy_info_attack_name'].toString().toLowerCase();
                const search = this.applyFilterData['attack_name'].toString().toLowerCase();
                return (column.indexOf(search) !== -1);
              }));
          } else {
            this.gridData = this.gridData.concat(fullGridData);
          }
          this.last = data.info['last'];
          this.offset = data.info['offset'];
          this.datalength += data.info['length'];
          if ( this.offset > 0) {
            this.gridData.length = this.gridData.length +1;
          }
          this.loadItems();
          this.detectSearching.nativeElement.className = 'fadeOut animated';
          setTimeout(() => {
            this.stateSearching = false;
            this.mPortlet.nativeElement.className = 'm-portlet m-portlet--tabs';
          }, 900);
          // this.skip = 275;
          this.skip = this.skip;
        } else {
          this.gridData = [];
          this.stateSearching = false;
          this.loadItems();
        }
      },
      error => {
        this.gridData = [];
        this.stateSearching = false;
        this.loadItems();
        if (typeof error.status !== 'undefined') {
          if (error.status === 401) {
            const returnUrl = this._router.url || '/';
            console.log('error', returnUrl);
            this._router.navigate(['/log/detect']);
          }
        }
      }
    );
  }

  private parseGridData( jsonData: any[] ) {
    var tempGridData: any[] = [];
    for (var i = 0; i < jsonData.length; i++) {
      var row = jsonData[i];
      if ( row.raw.message != 'single' )
        row.raw.message = '';
      
      var start_Date = moment ( row.start_date );
      var end_Date = moment( row.end_date );
      tempGridData.push({      
        period: start_Date.format('hh-mm-ss') + ' - ' + end_Date.format('hh-mm-ss'),
        policy_info_category_name: row.policy_info.category_name,
        policy_info_attack_code: row.policy_info.attack_code,
        policy_info_attack_name: row.policy_info.attack_name,
        group_id: row.ippool_info.g_id,
        group_name: row.ippool_info.g_name,
        object_id: row.ippool_info.o_id,
        object_name: row.ippool_info.o_name,
        hacker_country_code: row.hacker.country.code,
        hacker_country_name: row.hacker.country.name,
        hacker_ip: row.hacker.ip+':'+row.hacker.port,
        victim_country_name: row.victim.country.name,
        victim_country_code: row.victim.country.code,
        victim_ip: row.victim.ip+':'+row.victim.port,
        protocol: row.victim.protocol,
        detect_risk: row.policy_info.risk,
        asset_risk: row.asset_risk,
        block: row.block.message,
        detect_attempts: row.count,
        ttl: row.ttl,
        raw: row.raw.message,
        Additional_Information: row.etc_info,
        nic_port: row.interface_info.name,
        direction: row.flow.message,
        application_name: row.application_info.name,
        detect_Traffic: row.size
      });
    }
    return tempGridData;
  }

  public exportDetectLogData(e: any, grid: GridComponent) {
    if (this.stateSearching) {
      e.preventDefault();
    }

    if (this.gridData.length > 0) {
      this.detectLogExcelFileName = `DetectLog_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      grid.saveAsExcel();
    }
  }

  public setRowStyle(context: RowClassArgs) {
    const isRiskHigh = (context.dataItem.detect_risk === 'high') ? true : false;
    const isRiskMedium = (context.dataItem.detect_risk === 'medium') ? true : false;
    const isRiskLow = (context.dataItem.detect_risk === 'low') ? true : false;
    const isTypeManagerKill = Number(context.dataItem.reason_code) === 16 ? true : false;
    return {
      'risk-high': isRiskHigh,
      'risk-medium': isRiskMedium,
      'risk-low': isRiskLow,
      'type-manager': isTypeManagerKill
    };
  }

  public onSelectKeyChange(e: any) {
    this.selectedRowKeys.sort();
    this.selectedRows = this.selectedRowKeys.map(key => {
      return this.gridData[key];
    });
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;

    if (this.skip == this.datalength) {
      this.bserachinit = false;
      this.gridData.length = this.gridData.length -1;
      this.search();
    } 
    this.loadItems();
  }
  
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadItems();
  }

  private loadItems(): void {    
    this.gridView = {
      data : orderBy(
        this.gridData.slice(this.skip, this.skip + this.pageSize),
        this.sort
      ),
      total: this.gridData.length
    };
  }

  public focusFromDatepicker(e: any) {
    this.unchangeFromDate = this.fromDate;
  }

  public changeFromDatepicker(value: Date) {
    if (this.fromDate > this.toDateMax) {
      this.fromDate = this.unchangeFromDate;
      this.isDateMax = this.fromDate >= this.toDateMax ? true : false;
    }
    this.gridData = [];
    this.bserachinit = true;
    this.skip = 0;
    this.search();
  }

  public filterIpv(e: any, ipv: number) {
    if (this.stateSearching) {
      e.preventDefault();
    }

    this.ipv = ipv;
    this.gridData = [];
    this.bserachinit = true;
    this.datalength =0;
    this.skip = 0;
    this.search();
  }

  public filterPrevDate(e: any) {
    if (this.stateSearching) {
      e.preventDefault();
    }

    this.fromDate = moment(this.fromDate)
      .add(-1, 'd')
      .toDate();
    if (this.fromDate > this.toDateMax) {
      this.fromDate = this.toDateMax;
      this.isDateMax = true;
    }
    this.gridData = [];
    this.bserachinit = true;
    this.datalength =0;
    this.skip = 0;
    this.search();
  }

  public filterNextDate(e: any) {
    if (this.stateSearching || this.isDateMax) {
      e.preventDefault();
    }

    this.fromDate = moment(this.fromDate)
      .add(1, 'd')
      .toDate();
    if (this.fromDate > this.toDateMax) {
      this.fromDate = this.toDateMax;
      this.isDateMax = true;
    }
    this.gridData = [];
    this.bserachinit = true;
    this.datalength =0;
    this.skip = 0;
    this.search();
  }

  public exportExcelAllData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridData
    };

    return result;
  }
  
  public clickShowFilter(e: any) {
    this.detailSidebar.init(this.applyFilterData);
  }

  public applyFilter(filterData: any = {}) {
    console.log('Apply', filterData);

    this.applyFilterData = filterData;
    this.checkPeriodFilter();
    this.makeFilterItem();
    this.gridData = [];
    this.datalength =0;
    this.bserachinit = true;
    this.skip = 0;
    this.search();
  }

  private checkPeriodFilter() {
    if (this.applyFilterData.hasOwnProperty('fromDate')) {
      this.hasPeriodFilter = true;
    } else {
      this.hasPeriodFilter = false;
    }
  }

  public removeFilter(e: any, targets: string[]) {
    const filterData = this.applyFilterData;

    targets.forEach(key => {
      if (filterData.hasOwnProperty(key)) {
        delete filterData[key];
        console.log('applyFilterData', filterData);
      }
    });
    const checkedFilterData = this.checkFilterActivated(filterData);
    this.applyFilter(filterData);

    console.log(this.applyFilterItems, filterData)
  }

  public removeAllFilter(e: any) {
    this.applyFilter();
  }
  private checkFilterActivated(filter: any): any {
    const filterData = filter;

    filterData['activePeriod'] = false;
    filterData['activeDirection'] = false;
    filterData['activePolicy'] = false;
    filterData['activeIP'] = false;
    filterData['activePortSource'] = false;
    filterData['activePortDestination'] = false;
    filterData['activeEtc'] = false;
    
    // 기간
    if (filterData.hasOwnProperty('fromDate') && filterData.hasOwnProperty('toDate')) {
      filterData['activePeriod'] = true;
    }

    //방향
    if (filterData.hasOwnProperty('flow')) {
      filterData['activeDirection'] = true;
    }
    // 정책
    if (filterData.hasOwnProperty('category') ||
        filterData.hasOwnProperty('attack_code') ||
        filterData.hasOwnProperty('attack_name') ||
        filterData.hasOwnProperty('risk')) {
      filterData['activePolicy'] = true;
    }
    // 공격자/대상자
    if ((filterData.hasOwnProperty('hip') &&
        filterData.hasOwnProperty('hprefix')) ||
        (filterData.hasOwnProperty('vip') &&
        filterData.hasOwnProperty('vprefix'))) {
      filterData['activeIP'] = true;
    }
    // 포트정보(대상자)
    if (filterData.hasOwnProperty('hport_f') && filterData.hasOwnProperty('hport_t')) {
      filterData['activePortSource'] = true;
    }
    // 포트정보(대상자)
    if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
      filterData['activePortDestination'] = true;
    }
    // IP POOL
    if (filterData.hasOwnProperty('g_id') || filterData.hasOwnProperty('o_id')) {
      filterData['activeIPPool'] = true;
    }
    // 기타
    if (filterData.hasOwnProperty('block') ||
        filterData.hasOwnProperty('raw') ||
        filterData.hasOwnProperty('h_asset') ||
        filterData.hasOwnProperty('v_asset')) {
      filterData['activeEtc'] = true;
    }

    if (filterData.hasOwnProperty('a_id')) {
      filterData['a_id'] = true;
    }


    return filterData;
  }
  
  public makeFilterItem() {
    const filterData = this.applyFilterData;

    const filterItems = [];

    if (filterData.hasOwnProperty('fromDate') && filterData.hasOwnProperty('toDate')) {
      const fromDate = moment(filterData['fromDate'], 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
      const toDate = moment(filterData['toDate'], 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
      filterItems.push({
        type: 'period',
        typeText: '기간',
        values: [
          `${fromDate} ~ ${toDate}`
        ],
        targets: [ 'fromDate', 'toDate' ]
      });
    }

    if (filterData.hasOwnProperty('flow')) {
      filterItems.push({
        type: 'Direction',
        typeText: '방향',
        typeSubText: '통신',
        values: [
          {
            type: 'flow',
            text: '통신',
            value: filterData['flow'].text
          }
        ],
        targets: [ 'flow' ]
      });
    }

    if (filterData.hasOwnProperty('category')) {
      filterItems.push({
        type: 'policy',
        typeText: '정책',
        typeSubText: '공격유형',
        values: [
          {
            type: 'category',
            text: '공격유형',
            value: filterData['category'].text
          }
        ],
        targets: [ 'category' ]
      });
    }

    if (filterData.hasOwnProperty('attack_code')) {
      filterItems.push({
        type: 'policy',
        typeText: '정책',
        values: [
          {
            type: 'attack_code',
            text: '공격코드',
            value: filterData['attack_code']
          }
        ],
        targets: [ 'attack_code' ]
      });
    }

    if (filterData.hasOwnProperty('attack_name')) {
      filterItems.push({
        type: 'policy',
        typeText: '정책',
        values: [
          {
            type: 'attack_name',
            text: '공격명',
            value: `${filterData['attack_name']}`
          }
        ],
        targets: [ 'attack_name' ]
      });
    }

    if (filterData.hasOwnProperty('risk')) {
      filterItems.push({
        type: 'policy',
        typeText: '정책',
        values: [
          {
            type: 'risk',
            text: '위험도',
            value: filterData['risk'].text
          }
        ],
        targets: [ 'risk' ]
      });
    }

    if (filterData.hasOwnProperty('hip') && filterData.hasOwnProperty('hprefix')) {
      filterItems.push({
        type: 'ip',
        typeText: '공격자/대상자',
        values: [
          {
            type: 'hip',
            text: '공격자',
            value: `${filterData['hip']}/${filterData['hprefix']}`
          }
        ],
        targets: [ 'hip', 'hprefix' ]
      });
    }

    if (filterData.hasOwnProperty('vip') && filterData.hasOwnProperty('vprefix')) {
      filterItems.push({
        type: 'ip',
        typeText: '공격자/대상자',
        values: [
          {
            type: 'vip',
            text: '대상자',
            value: `${filterData['vip']}/${filterData['vprefix']}`
          }
        ],
        targets: [ 'vip', 'vprefix' ]
      });
    }

    if (filterData.hasOwnProperty('hport_f') && filterData.hasOwnProperty('hport_t')) {
      filterItems.push({
        type: 'port',
        typeText: '포트정보(공격자)',
        values: [
          {
            type: 'hport_f',
            text: '시작',
            value: filterData['hport_f']
          },
          {
            type: 'hport_t',
            text: '종료',
            value: filterData['hport_t']
          }
        ],
        targets: [ 'hport_f', 'hport_t' ]
      });
    }

    if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
      filterItems.push({
        type: 'port',
        typeText: '포트정보(대상자)',
        values: [
          {
            type: 'vport_f',
            text: '시작',
            value: filterData['vport_f']
          },
          {
            type: 'vport_t',
            text: '종료',
            value: filterData['vport_t']
          }
        ],
        targets: [ 'vport_f', 'vport_t' ]
      });
    }

    if (filterData.hasOwnProperty('g_id')) {
      filterItems.push({
        type: 'ippool',
        typeText: 'IP POOL',
        values: [
          {
            type: 'g_id',
            text: '그룹',
            value: filterData['g_id'].text
          }
        ],
        targets: [ 'g_id' ]
      });
    }

    if (filterData.hasOwnProperty('o_id')) {
      filterItems.push({
        type: 'ippool',
        typeText: 'IP POOL',
        values: [
          {
            type: 'o_id',
            text: '객체',
            value: filterData['o_id'].text
          }
        ],
        targets: [ 'o_id' ]
      });
    }

    
    if (filterData.hasOwnProperty('block')) {
      filterItems.push({
        type: 'etc',
        typeText: 'ETC',
        values: [
          {
            type: 'block',
            text: '차단',
            value: filterData['block'].text
          }
        ],
        targets: [ 'block' ]
      });
    }

    if (filterData.hasOwnProperty('raw')) {
      filterItems.push({
        type: 'etc',
        typeText: 'ETC',
        values: [
          {
            type: 'raw',
            text: 'raw',
            value: filterData['raw'].text
          }
        ],
        targets: [ 'raw' ]
      });
    }

    if (filterData.hasOwnProperty('h_asset')) {
      filterItems.push({
        type: 'etc',
        typeText: 'ETC',
        values: [
          {
            type: 'h_asset',
            text: '공격자 자산',
            value: filterData['h_asset'].text
          }
        ],
        targets: [ 'h_asset' ]
      });
    }

    if (filterData.hasOwnProperty('v_asset')) {
      filterItems.push({
        type: 'etc',
        typeText: 'ETC',
        values: [
          {
            type: 'v_asset',
            text: '대상자 자산',
            value: filterData['v_asset'].text
          }
        ],
        targets: [ 'v_asset' ]
      });
    }

    if (filterData.hasOwnProperty('a_id')) {
      filterItems.push({
        type: 'applicationId',
        typeText: 'APPLICATION',
        values: [
          {
            type: 'a_id',
            text: 'Application id',
            value: `${filterData['a_id']}`
          }
        ],
        targets: [ 'a_id' ]
      });
    }
    this.applyFilterItems = filterItems;
    console.log('applyFilterItems', this.applyFilterItems);
  }

}
