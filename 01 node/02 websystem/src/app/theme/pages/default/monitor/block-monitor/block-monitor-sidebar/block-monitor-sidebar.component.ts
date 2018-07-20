import { Component, OnInit, ViewEncapsulation, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import * as moment from 'moment';

interface Item {
  text: string;
  value: number;
}
@Component({
  selector: 'app-block-monitor-sidebar',
  templateUrl: './block-monitor-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class BlockMonitorSidebarComponent implements OnInit {

  @Input() public ipv: number;
  @Output() public changeFilter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('btnDetailSidebarClose') public btnDetailSidebarClose: ElementRef;

  public activePolicy: boolean;
  public activeIP: boolean;
  public activePort: boolean;
  public activeEtc: boolean;

  public categoryData: Array<Item>;
  public categoryItems: Array<Item>;
  public selectedCategory: Item;
  public signatureCode: number;
  public signatureName: string;
  // public ipFilterType: number;
  public hip: string;
  public vip: string;
  public startPort: number;
  public endPort: number;
  public selectedFlow: Item;
  public blockModeListData: Array<Item>;
  public blockModeListItems: Array<Item>;
  public selectedBlockMode: Item;
  public blockReasonListData: Array<Item>;
  public blockReasonListItems: Array<Item>;
  public selectedBlockReason: Item;
  public hprefix: number;
  public vprefix: number;
  public maxPrefix: number;

  constructor() {
    this.categoryData = [
      { value: -1, text: '전체' },
      { value: 1, text: '서비스 거부' },
      { value: 2, text: '정보 수집' },
      { value: 3, text: '프로토콜 취약점' },
      // { value: 4, text: '서비스 공격' },
      // { value: 2500, text: 'DDoS 패턴추출' },
      // { value: 2100, text: 'SSS(TCP)' },
      // { value: 2101, text: 'SSS(UDP)' },
      { value: 7, text: 'RateLimit(Dynamic)' },
      // { value: 9, text: 'RateLimit(Terminal)' },
      // { value: 1300, text: 'Web CGI 공격' },
      // { value: 1301, text: 'Web CGI 공격(사용자 정의)' },
      { value: 1100, text: '패턴 블럭' },
      { value: 1500, text: '패턴 블럭(사용자 정의)' },
      // { value: 2400, text: 'RegEx' },
      // { value: 2402, text: 'RegEx(WINS)' },
      // { value: 2401, text: 'RegEx(사용자 정의)' },
      // { value: 3201, text: '프로토콜 통계분석' },
      // { value: 3202, text: '서비스 통계분석' },
      // { value: 800, text: 'DNS 차단' },
      // { value: 4100, text: 'IP Reputation' },
      // { value: 4101, text: 'Country Reputation' },
      // { value: 4102, text: 'URL Reputation' },
    ];
    this.blockModeListData = [
      { value: -1, text: '전체' },
      { value: 1, text: 'SN_SRC_IP' },
      { value: 2, text: 'SN_DST_IP' },
      { value: 8, text: 'SN_AND_IP' },
      { value: 256, text: 'SN_SRC_SERV' },
      { value: 512, text: 'SN_DST_SERV' },
      // { value: 1024, text: 'SN_DNS_TYPE' },
      // { value: 4096, text: 'SN_DHCP_MAC' },
      // { value: 8192, text: 'SN_SIP_CALLER' },
      // { value: 8193, text: 'SN_SIP_CALLEE' },
      // { value: 8194, text: 'SN_SIP_CALLER_CALLEE' },
      // { value: 16640, text: 'SN_GTP_TYPE' },
      // { value: 16641, text: 'SN_SRC_GTP_TYPE' },
      // { value: 16642, text: 'SN_DST_GTP_TYPE' },
      // { value: 16648, text: 'SN_AND_IP_GTP_TYPE' },
      // { value: 16385, text: 'SN_RATELIMIT_PPS' },
    ];
    this.blockReasonListData = [
      { value: -1, text: '전체' },
      { value: 16, text: '세션강제종료' },
      { value: 32, text: '침입탐지/방어' },
      { value: 64, text: '패킷기반차단' },
    ];

    this.init();
  }
  ngOnInit() { }

  public init(filterData: object = {}) {
    this.activePolicy = false;
    this.activeIP = false;
    this.activePort = false;
    this.activeEtc = false;

    this.signatureCode = undefined;
    this.signatureName = undefined;
    this.hip = undefined;
    this.hprefix = undefined;
    this.vip = undefined;
    this.vprefix = undefined;
    this.startPort = undefined;
    this.endPort = undefined;

    // this.ipFilterType = 1;
    this.maxPrefix = (this.ipv === 4) ? 32 : 128;

    this.categoryItems = this.categoryData;
    this.selectedCategory = this.categoryItems[0];

    this.blockModeListItems = this.blockModeListData;
    this.selectedBlockMode = this.blockModeListItems[0];

    this.blockReasonListItems = this.blockReasonListData;
    this.selectedBlockReason = this.blockReasonListItems[0];

    // Options 값이 존재하면
    if (Object.keys(filterData).length !== 0) {
      console.log('init', filterData);

      // 정책
      if (filterData.hasOwnProperty('activePolicy')) {
        if (filterData['activePolicy']) {
          this.activePolicy = true;
          if (filterData.hasOwnProperty('category')) {
            this.selectedCategory = filterData['category'];
          }
          if (filterData.hasOwnProperty('attack_code')) {
            this.signatureCode = filterData['attack_code'];
          }
          if (filterData.hasOwnProperty('attack_name')) {
            this.signatureName = filterData['attack_name'];
          }
        }
      }

      // 공격자/대상자
      if (filterData.hasOwnProperty('activeIP')) {
        if (filterData['activeIP']) {
          this.activeIP = true;
          if (filterData.hasOwnProperty('hip') && filterData.hasOwnProperty('hprefix')) {
            // this.ipFilterType = filterData['filterType'];
            this.hip = filterData['hip'];
            this.hprefix = filterData['hprefix'];
          }
          if (filterData.hasOwnProperty('vip') && filterData.hasOwnProperty('vprefix')) {
            // this.ipFilterType = filterData['filterType'];
            this.vip = filterData['vip'];
            this.vprefix = filterData['vprefix'];
          }
        }
      }

      // 포트정보(대상자)
      if (filterData.hasOwnProperty('activePort')) {
        if (filterData['activePort']) {
          this.activePort = true;
          if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
            this.startPort = filterData['vport_f'];
            this.endPort = filterData['vport_t'];
          }
        }
      }

      // 기타
      if (filterData.hasOwnProperty('activeEtc')) {
        if (filterData['activeEtc']) {
          this.activeEtc = true;
          if (filterData.hasOwnProperty('method')) {
            this.selectedBlockMode = filterData['method'];
          }
          if (filterData.hasOwnProperty('reason')) {
            this.selectedBlockReason = filterData['reason'];
          }
        }
      }
    }
  }

  public submitApplyFilter(e: any) {
    const filterData = {};

    // 정책
    if (this.activePolicy) {
      let activated = false;
      if (typeof this.selectedCategory !== 'undefined') {
        if (this.selectedCategory.value !== -1) {
          filterData['category'] = this.selectedCategory;
          activated = ( activated || true );
        }
      }
      if (typeof this.signatureCode !== 'undefined') {
        if (this.signatureCode !== null) {
          if (this.signatureCode.toString().length > 0) {
            filterData['attack_code'] = this.signatureCode;
            activated = ( activated || true );
          }
        }
      }
      if (typeof this.signatureName !== 'undefined') {
        if (this.signatureName.length > 0) {
          filterData['attack_name'] = this.signatureName;
          activated = ( activated || true );
        }
      }
      filterData['activePolicy'] = activated;
    }

    // 공격자/대상자
    if (this.activeIP) {
      let activated = false;
      if (typeof this.hip !== 'undefined' &&
          typeof this.hprefix !== 'undefined') {
          if (this.hip.length > 0 && this.hprefix !== null) {
            if (this.hprefix.toString().length > 0) {
              // filterData['filterType'] = this.ipFilterType;
              filterData['hip'] = this.hip;
              filterData['hprefix'] = this.hprefix;
              activated = ( activated || true );
            }
          }
      }
      if (typeof this.vip !== 'undefined' &&
          typeof this.vprefix !== 'undefined') {
        if (this.vip.length > 0 && this.vprefix !== null) {
          if (this.vprefix.toString().length > 0) {
            // filterData['filterType'] = this.ipFilterType;
            filterData['vip'] = this.vip;
            filterData['vprefix'] = this.vprefix;
            activated = ( activated || true );
          }
        }
      }
      filterData['activeIP'] = activated;
    }

    // 포트정보(대상자)
    if (this.activePort) {
      let activated = false;
      if (typeof this.startPort !== 'undefined' &&
          typeof this.endPort !== 'undefined') {
        if (this.startPort !== null && this.endPort !== null) {
          if (this.startPort.toString().length > 0 && this.endPort.toString().length > 0) {
            filterData['vport_f'] = this.startPort;
            filterData['vport_t'] = this.endPort;
            activated = ( activated || true );
          }
        }
      }
      filterData['activePort'] = activated;
    }

    // 기타
    if (this.activeEtc) {
      let activated = false;
      if (typeof this.selectedBlockMode !== 'undefined') {
        if (this.selectedBlockMode.value !== -1) {
          filterData['method'] = this.selectedBlockMode;
          activated = ( activated || true );
        }
      }
      if (typeof this.selectedBlockReason !== 'undefined') {
        if (this.selectedBlockReason.value !== -1) {
          filterData['reason'] = this.selectedBlockReason;
          activated = ( activated || true );
        }
      }
      filterData['activeEtc'] = activated;
    }

    console.log('filterData', filterData);

    this.btnDetailSidebarClose.nativeElement.click();
    this.changeFilter.emit(filterData);
  }

  public toggleActivate(e: any, activeTarget: string) {
    this[activeTarget] = !this[activeTarget];
  }

  public initFilterPopup(e: any) {
    this.init();
  }

  public closeFilterPopup(e: any) {
    this.btnDetailSidebarClose.nativeElement.click();
  }

}
