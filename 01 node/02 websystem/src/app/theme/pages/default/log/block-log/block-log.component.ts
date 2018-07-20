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
import { Observable } from 'rxjs/Rx';

import {
  GridComponent,
  SelectionEvent,
  RowClassArgs,
  GridDataResult,
  PageChangeEvent
} from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { Helpers } from './../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import * as moment from 'moment';

import { BlockLogService } from './_services/block-log.service';
import { DetailSidebarComponent } from './detail-sidebar/detail-sidebar.component';

interface BlockLogFilter {
  ipv: number;
}

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './block-log.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BlockLogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dpFrom') public dpFrom: any;
  @ViewChild('blockSearching') public blockSearching: ElementRef;
  @ViewChild('mPortlet') public mPortlet: ElementRef;
  @ViewChild('detailSidebar') public detailSidebar: DetailSidebarComponent;

  public gridView: GridDataResult;
  public gridData: Array<any>;
  public blockLogExcelFileName: string;
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

  constructor(
    private _router: Router,
    private _script: ScriptLoaderService,
    private _blockLogService: BlockLogService
  ) {
    this.selectedRowKeys = [];
    this.gridData = [];
    this.pageSize = 20;
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
  }

  ngOnInit() {
    this.search();
  }

  ngAfterViewInit() {
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/app/js/block-log.js'
    );
  }

  ngOnDestroy() { }

  public clickSearch(e: any) {
    this.search();
  }

  public search() {
    if (!this.stateSearching && this.dpFrom.errors === null) {
      this.sort = [];
      this.selectedRowKeys = [];
      this.skip = 0;
      this.mPortlet.nativeElement.className = 'm-portlet m-portlet--tabs m-portlet--relative';
      this.blockSearching.nativeElement.className = 'fadeIn animated';
      this.stateSearching = true;
      this.isDateMax = this.fromDate >= this.toDateMax ? true : false;

      this.renderBlockLogGrid();
    }
  }

  public formatterTime(value: string) {
    return moment(value, 'YYYYMMDDHHmmss').format('HH:mm:ss');
  }

  public renderBlockLogGrid() {
    const params = {};
    const filterData = this.applyFilterData;

    params['ipv'] = this.ipv;

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
    if (filterData.hasOwnProperty('hip') && filterData.hasOwnProperty('hprefix')) {
      params['hip'] = filterData['hip'];
      params['hprefix'] = filterData['hprefix'];
    }
    if (filterData.hasOwnProperty('vip') && filterData.hasOwnProperty('vprefix')) {
      params['vip'] = filterData['vip'];
      params['vprefix'] = filterData['vprefix'];
    }
    if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
      params['vport_f'] = filterData['vport_f'];
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

    console.log('params', params);
    this._blockLogService.getBlockLogData(params).subscribe(
      data => {
        if (typeof data.datas !== 'undefined') {
          const fullGridData = this.parseGridData(data.datas);

          if (this.applyFilterData.hasOwnProperty('attack_name')) {
            this.gridData = fullGridData.filter(row => {
              const column = row['policy_info_attack_name'].toString().toLowerCase();
              const search = this.applyFilterData['attack_name'].toString().toLowerCase();
              return (column.indexOf(search) !== -1);
            });
          } else {
            this.gridData = fullGridData;
          }

          this.loadItems();
          this.blockSearching.nativeElement.className = 'fadeOut animated';
          setTimeout(() => {
            this.stateSearching = false;
            this.mPortlet.nativeElement.className = 'm-portlet m-portlet--tabs';
          }, 900);
          // 750
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
            this._router.navigate(['/log/block']);
          }
        }
      }
    );
  }

  private parseGridData(jsonData: any[]) {
    const tempGridData: any[] = [];

    jsonData.forEach((row, idx) => {
      tempGridData.push({
        idx: idx,
        ipv: row.ipv,
        start_date: row.start_date,
        end_date: row.end_date,
        policy_info_category_code: row.policy_info.category_code,
        policy_info_category_name: row.policy_info.category_name,
        policy_info_attack_code: row.policy_info.attack_code,
        policy_info_attack_name: row.policy_info.attack_name,
        ippool_info_g_id: row.ippool_info.g_id,
        ippool_info_g_name: row.ippool_info.g_name,
        ippool_info_o_id: row.ippool_info.o_id,
        ippool_info_o_name: row.ippool_info.o_name,
        hacker_country_code: row.hacker.country.code,
        hacker_country_name: row.hacker.country.name,
        victim_country_code: row.victim.country.code,
        victim_country_name: row.victim.country.name,
        hacker_ip: row.hacker.ip,
        victim_ip: row.victim.ip,
        victim_protocol: row.victim.protocol,
        victim_port: row.victim.port,
        method_code: row.method.code,
        method_message: row.method.message,
        reason_code: row.reason.code,
        reason_meassage: row.reason.message,
        packet: row.packet,
        size: row.size,
        flow_code: row.flow.code,
        flow_message: row.flow.message
      });
    });

    return tempGridData;
  }

  public exportBlockLogData(e: any, grid: GridComponent) {
    if (this.stateSearching) {
      e.preventDefault();
    }

    if (this.gridData.length > 0) {
      this.blockLogExcelFileName = `BlockLog_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      grid.saveAsExcel();
    }
  }

  public setRowStyle(context: RowClassArgs) {
    const isTypeManagerKill = Number(context.dataItem.reason_code) === 16 ? true : false;
    return {
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
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadItems();
  }

  public loadItems(): void {
    this.gridView = {
      // data: orderBy(this.gridData, this.sort).slice(this.skip, this.skip + this.pageSize),
      data: orderBy(
        this.gridData.slice(this.skip, this.skip + this.pageSize),
        this.sort
      ),
      total: this.gridData.length
    };
  }

  public checkFromDatepicker(e: any) {
    console.log('diff', this.fromDate, this.toDateMax);
  }

  public focusFromDatepicker(e: any) {
    this.unchangeFromDate = this.fromDate;
  }

  public changeFromDatepicker(value: Date) {
    if (this.fromDate > this.toDateMax) {
      this.fromDate = this.unchangeFromDate;
      this.isDateMax = this.fromDate >= this.toDateMax ? true : false;
    }
    this.search();
  }

  public filterIpv(e: any, ipv: number) {
    if (this.stateSearching) {
      e.preventDefault();
    }

    this.ipv = ipv;
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

    // if (this.applyFilterData.hasOwnProperty('fromDate')) {
    //   this.fromDate = moment(filterData['fromDate'], 'YYYYMMDDHHmmss').toDate();
    // } else {
    //   this.fromDate = moment(moment().format('YYYYMMDD'), 'YYYYMMDD').toDate();
    // }

    this.checkPeriodFilter();
    this.makeFilterItem();
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
    filterData['activePolicy'] = false;
    filterData['activeIP'] = false;
    filterData['activePort'] = false;
    filterData['activeEtc'] = false;

    // 기간
    if (filterData.hasOwnProperty('fromDate') && filterData.hasOwnProperty('toDate')) {
      filterData['activePeriod'] = true;
    }
    // 정책
    if (filterData.hasOwnProperty('category') ||
        filterData.hasOwnProperty('attack_code') ||
        filterData.hasOwnProperty('attack_name')) {
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
    if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
      filterData['activePort'] = true;
    }
    // IP POOL
    if (filterData.hasOwnProperty('g_id') || filterData.hasOwnProperty('o_id')) {
      filterData['activeIPPool'] = true;
    }
    // 기타
    if (filterData.hasOwnProperty('flow') ||
        filterData.hasOwnProperty('method') ||
        filterData.hasOwnProperty('reason')) {
      filterData['activeEtc'] = true;
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

    // if ((filterData.hasOwnProperty('hip') && filterData.hasOwnProperty('hprefix')) &&
    //     (filterData.hasOwnProperty('vip') && filterData.hasOwnProperty('vprefix'))) {
    //   filterItems.push({
    //     type: 'ip',
    //     typeText: '공격자/대상자',
    //     values: [
    //       {
    //         type: 'filterType',
    //         text: '검색조건',
    //         value: ((filterData['filterType'] === 1) ? 'AND' : 'OR')
    //       }
    //     ],
    //     targets: [ 'filterType' ]
    //   });
    // }

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

    if (filterData.hasOwnProperty('flow')) {
      filterItems.push({
        type: 'etc',
        typeText: '기타',
        values: [
          {
            type: 'flow',
            text: '통신방향',
            value: filterData['flow'].text
          }
        ],
        targets: [ 'flow' ]
      });
    }

    if (filterData.hasOwnProperty('method')) {
      filterItems.push({
        type: 'etc',
        typeText: '기타',
        values: [
          {
            type: 'method',
            text: '차단방법',
            value: filterData['method'].text
          }
        ],
        targets: [ 'method' ]
      });
    }

    if (filterData.hasOwnProperty('reason')) {
      filterItems.push({
        type: 'etc',
        typeText: '기타',
        values: [
          {
            type: 'reason',
            text: '차단사유',
            value: filterData['reason'].text
          }
        ],
        targets: [ 'reason' ]
      });
    }

    this.applyFilterItems = filterItems;

    console.log('applyFilterItems', this.applyFilterItems);
  }

}
