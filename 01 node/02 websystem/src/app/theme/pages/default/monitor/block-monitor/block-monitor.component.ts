import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Helpers } from './../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { Observable } from 'rxjs/Rx';

import { GridComponent, SelectionEvent, RowClassArgs } from '@progress/kendo-angular-grid';
// import { SelectableSettings } from '@progress/kendo-angular-grid';
import * as moment from 'moment';

import { AddBlockModalComponent } from './add-block-modal/add-block-modal.component';
import { DeleteBlockModalComponent } from './delete-block-modal/delete-block-modal.component';
import { BlockMonitorService } from './_services/block-monitor.service';
import { BlockMonitorSidebarComponent } from './block-monitor-sidebar/block-monitor-sidebar.component';

interface Item {
  text: string;
  value: number;
}

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './block-monitor.component.html',
  styleUrls: ['block-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlockMonitorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('addBlockModal')
  private addBlockModal: AddBlockModalComponent;
  private deleteBlockModal: DeleteBlockModalComponent;
  // @ViewChild('blockMonitorGrid') public blockMonitorGrid: GridComponent;
  @ViewChild('blockMonitorSidebar') public blockMonitorSidebar: BlockMonitorSidebarComponent;

  private player: any;
  private subscription: any;
  private replayTimerListData: Array<Item>;
  private flowListData: Array<Item>;

  public ipv: number;
  public flow: number;
  public playActive: boolean;
  public allCount: number;
  public viewCount: number;
  public updatedTime: any;
  public updatedTimeTitle: string;
  public playState: string;
  public playButtonTitle: string;
  public loadData: boolean;
  public popupShow: boolean;
  public popupOffset: any;
  public blockMonitorExcelFileName: string;
  public popupMenuItems: any[];
  public selectedRowKeys: number[];
  public gridData: Array<any>;
  public selectedRows: Array<any>;
  public replayTimerListItems: Array<Item>;
  public flowListItems: Array<Item>;
  public selectedReplayTime: Item;
  public selectedFlow: Item;
  public applyFilterData: object;
  public applyFilterItems: Array<any>;

  constructor(
    private _router: Router,
    private _script: ScriptLoaderService,
    private _blockMonitorService: BlockMonitorService
  ) {
    this.playState = 'pause';
    this.playButtonTitle = '일시정지';
    this.updatedTime = moment().format('HH:mm:ss');
    this.updatedTimeTitle = '';
    this.blockMonitorExcelFileName = '';
    this.playActive = true;
    this.allCount = 0;
    this.viewCount = 0;
    this.loadData = true;
    this.popupShow = false;
    this.selectedRowKeys = [];
    this.gridData = [];
    this.selectedRows = [];

    this.popupMenuItems = [
      '탐지정책설정',
      '차단추가',
      '삭제',
      '전체삭제',
      '정보갱신',
      '정보갱신주기',
      '엑셀저장',
      '찾기',
      '선택된정보 복사',
      '전체복사',
      '추적도구'
    ];
    this.replayTimerListData = [
      { value: 3, text: '3초' },
      { value: 5, text: '5초' },
      { value: 10, text: '10초' },
      { value: 15, text: '15초' },
      { value: 20, text: '20초' },
      { value: 30, text: '30초' },
      { value: 60, text: '60초' }
    ];
    this.flowListData = [
      { value: 0, text: '전체' },
      { value: 1, text: 'InBound' },
      { value: 2, text: 'OutBound' }
    ];
    this.ipv = 4;
    this.flow = 0;
    // init kendo dropdown
    this.replayTimerListItems = this.replayTimerListData;
    this.selectedReplayTime = this.replayTimerListItems[1];
    this.flowListItems = this.flowListData;
    this.selectedFlow = this.flowListItems[0];

    this.applyFilterData = {};
  }

  ngOnInit() {
    this.play();
  }

  ngAfterViewInit() {
    this._script.load( '.m-grid__item.m-grid__item--fluid.m-wrapper', 'assets/app/js/block-monitor.js' );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public play() {
    this.playState = 'pause';
    this.playButtonTitle = '일시정지';

    const replayTime = this.selectedReplayTime.value;

    this.player = Observable.timer(0, replayTime * 1000);
    this.subscription = this.player.subscribe(() => {
      this.selectedRowKeys = [];
      this.renderMonitorBlock();
    });
  }

  public stop() {
    this.playState = 'play';
    this.playButtonTitle = '시작';
    this.subscription.unsubscribe();
  }

  public pause() {
    this.subscription.unsubscribe();
  }

  public togglePlayer(el) {
    if (this.playActive) {
      this.stop();
    } else {
      this.play();
    }

    this.playActive = !this.playActive;
  }

  public changeReplayTime(item: Item) {
    this.selectedReplayTime = item;
    this.stop();
    this.play();
  }

  public renderMonitorBlock() {
    this.loadData = true;

    const params = {};
    const filterData = this.applyFilterData;

    params['ipv'] = this.ipv;
    params['flow'] = this.flow;

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
    if (filterData.hasOwnProperty('method')) {
      params['method'] = filterData['method'].value;
    }
    if (filterData.hasOwnProperty('reason')) {
      params['reason'] = filterData['reason'].value;
    }

    this._blockMonitorService.getBlockMonitorData(params).subscribe(
      data => {
        if (typeof data === 'undefined') {
          this.gridData = [];
        } else {
          this.viewCount = data.header['view-count'];
          this.allCount = data.header['all-count'];

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

          const now = moment();
          this.updatedTime = now.format('HH:mm:ss');
          this.updatedTimeTitle = now.format('YYYY년 MM월 DD일 HH시 mm분 ss초');
          setTimeout(() => {
            this.loadData = false;
          }, 500);
        }
      },
      error => {
        this.gridData = [];
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

  private parseGridData(jsonData: any[]): any {
    const tempGridData: any[] = [];

    jsonData.forEach((row, idx) => {
      tempGridData.push({
        idx: idx,
        reg_time: row.reg_time,
        exp_time: row.exp_time,
        ipv: row.ipv,
        method_code: row.method.code,
        method_message: row.method.message,
        reason_code: row.reason.code,
        reason_meassage: row.reason.message,
        policy_info_category_name: row.policy_info.category_name,
        policy_info_attack_code: row.policy_info.attack_code,
        policy_info_attack_name: row.policy_info.attack_name,
        hacker_country_code: row.hacker.country.code,
        hacker_country_name: row.hacker.country.name,
        hacker_ip: row.hacker.ip,
        victim_country_code: row.victim.country.code,
        victim_country_name: row.victim.country.name,
        victim_ip: row.victim.ip,
        victim_protocol: row.victim.protocol,
        victim_port: row.victim.port,
        packet: row.packet,
        size: row.size,
        etc_info: row.etc_info,
        flow_message: row.flow.message
      });
    });

    return tempGridData;
  }

  public filterIpv(ipv: number) {
    this.ipv = ipv;
    this.stop();
    this.play();
  }

  public filterFlow(item: Item) {
    this.selectedFlow = item;
    this.flow = item.value;
    this.stop();
    this.play();
  }

  public filterReplayTime(filter: any) {
    this.replayTimerListItems = this.replayTimerListData.filter(
      s =>
        JSON.stringify(s)
          .toLowerCase()
          .indexOf(filter.toLowerCase()) !== -1
    );
  }

  // ---------------------

  public popupMenuItemSelect({ dataItem, item }) {
  }

  public showAddBlockModal(e: any) {
    this.addBlockModal.init();
  }

  public onSelectedRow(e: SelectionEvent) {
  }

  public onSelectKeyChange(e: any) {
    this.selectedRowKeys.sort();
    this.selectedRows = this.selectedRowKeys.map(key => {
      return this.gridData[key];
    });
  }
  // { dataItem, type }
  public sniffingSelectedContextMenu(e: any) {
    if (e.type === 'contextmenu' && Object.keys(e.dataItem).length > 0) {
      const idx = e.dataItem.idx;
      if (this.selectedRowKeys.indexOf(idx) < 0) {
        this.selectedRowKeys.push(idx);
      }
    }
  }

  public showDeleteBlockModal(e: any) {
    // this.pause();
    this.deleteBlockModal.init();
  }

  public deleteComplete(e: any) {
    // this.play();
  }

  public deleteBlockPolicy(e: any) {
    if (this.selectedRows.length > 0) {
      if (this.selectedRows.length === this.gridData.length && this.gridData.length > 1) {
        const params = {
          ipv: this.ipv
        };
        this._blockMonitorService
          .deleteAllBlockPolicy(params)
          .subscribe(
          data => {
            console.log(data);
          },
          error => {
            if (typeof error.status !== 'undefined') {
              if (error.status === 401) {
                const returnUrl = this._router.url || '/';
                console.log('error', returnUrl);
                this._router.navigate(['/log/block']);
              }
            }
          }
          );
      } else {
        this.selectedRows.forEach(row => {
          let params;
          const method = Number(row.method_code);

          switch (method) {

            // SN_SRC_IP
            case 1:
              params = {
                ipv: row.ipv,
                method: method,
                hip: row.hacker_ip
              };
              break;

            // SN_DST_IP
            case 2:
              params = {
                ipv: row.ipv,
                method: method,
                vip: row.victim_ip
              };
              break;

            // SN_AND_IP
            case 8:
              params = {
                ipv: row.ipv,
                method: method,
                hip: row.hacker_ip,
                vip: row.victim_ip
              };
              break;

            // SN_SRC_SERV
            case 256:
              params = {
                ipv: row.ipv,
                method: method,
                hip: row.hacker_ip,
                protocol: row.victim_protocol
              };

              if (row.victim_protocol === 1 || row.victim_protocol === 58 || row.victim_protocol === 6 || row.victim_protocol === 17) {
                params.port = row.victim_port;
              }
              break;

            // SN_DST_SERV
            case 512:
              params = {
                ipv: row.ipv,
                method: method,
                vip: row.victim_ip,
                protocol: row.victim_protocol
              };

              if (row.victim_protocol === 1 || row.victim_protocol === 58 || row.victim_protocol === 6 || row.victim_protocol === 17) {
                params.port = row.victim_port;
              }
              break;
          }

          this._blockMonitorService
            .deleteBlockPolicy(params)
            .subscribe(
            data => {
              console.log(data);
            },
            error => { }
            );
        });
      }
    }
  }

  public setRowStyle(context: RowClassArgs) {
    const isTypeManagerKill = (Number(context.dataItem.reason_code) === 16) ? true : false;
    return {
      'type-manager': isTypeManagerKill
    };
  }

  public exportBlockMonitorData(grid: GridComponent) {
    if (this.gridData.length > 0) {
      this.blockMonitorExcelFileName = `BlockMonitor_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      grid.saveAsExcel();
    }
  }

  public clickShowFilter(e: any) {
    // this.blockMonitorSidebar.init();
    this.blockMonitorSidebar.init(this.applyFilterData);
  }

  public applyFilter(filterData: any = {}) {
    this.applyFilterData = filterData;

    this.makeFilterItem();
    this.stop();
    this.play();
  }

  public removeFilter(e: any, targets: string[]) {
    const filterData = this.applyFilterData;

    targets.forEach(key => {
      if (filterData.hasOwnProperty(key)) {
        delete filterData[key];
      }
    });

    const checkedFilterData = this.checkFilterActivated(filterData);
    this.applyFilter(filterData);
  }

  public removeAllFilter(e: any) {
    this.applyFilter();
  }

  private checkFilterActivated(filter: any): any {
    const filterData = filter;

    filterData['activePolicy'] = false;
    filterData['activeIP'] = false;
    filterData['activePort'] = false;
    filterData['activeEtc'] = false;

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
  }

}
