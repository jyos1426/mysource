import { 
  Component, 
  OnInit, 
  ViewEncapsulation, 
  AfterViewInit, 
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Helpers } from './../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { 
  Observable, 
  Subscription  
} from 'rxjs/Rx';

import { Http, Response } from '@angular/http';
import { 
  GridComponent, 
  RowClassArgs 
} from '@progress/kendo-angular-grid';
import * as moment from 'moment';

import { detectMonitorSidebarComponent } from './detect-monitor-sidebar/detect-monitor-sidebar.component';

export class DetaectMonitorFilter {
  ipv: number = 4;
  flow: number = 0;
}

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './detect-monitor.component.html',
  styleUrls: ['detect-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DetectMonitorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('detectMonitorSidebar') public detectMonitorSidebar: detectMonitorSidebarComponent;

  private filter: DetaectMonitorFilter;
  private player: any;
  private subscription: any;
  private playActive: boolean;
  private filterCount: number;

  public gridData: any;
  public updatedTime: any;
  public selectedReplayTime: any;
  public loadData: boolean;
  public ipv: number;
  public replayTime: number;
  public playState: string;
  public playButtonTitle: string;
  public updatedTimeTitle: string;
  public detectExcelFileName: string;
  public applyFilterData: object;
  public replayTimerListItems: Array<{ text: string, value: number }>;
  public flowListItems: Array<{ text: string, value: number }>;
  public applyFilterItems: Array<any>;  
  public selectedFlow: any;
  
  constructor( private _script : ScriptLoaderService, private http : Http ) {
    this.filter = new DetaectMonitorFilter();

    this.applyFilterData = {};
    this.gridData = [];
    this.playState = 'pause';
    this.playButtonTitle = '정지';
    this.updatedTimeTitle = '';
    this.detectExcelFileName = '';
    this.updatedTime = moment().format('HH:mm:ss');    
    this.loadData = true;
    this.playActive = true;
    this.replayTime = 10;
    this.filterCount = 0;
    this.replayTimerListItems = [
      { text: "5초", value: 5 },
      { text: "10초", value: 10 },
      { text: "15초", value: 15 },
      { text: "20초", value: 20 },
      { text: "30초", value: 30 },
      { text: "60초", value: 60 },
    ];
    this.flowListItems = [
      {text: '전체(0)',value: 0  },
      {text: 'Inbound(0)',value: 1  },
      {text: 'Outbound(0)',value: 2  },
    ];
    this.selectedReplayTime = this.replayTimerListItems[1];
    this.selectedFlow = this.flowListItems[0];
  }
  

  ngOnInit() {
    this.play( this.replayTime );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this._script.load( '.m-grid__item.m-grid__item--fluid.m-wrapper', 'assets/app/js/block-monitor.js' );
  }

  public play( replayTime ) {
    this.playState = 'pause';
    this.playButtonTitle = '정지';

    this.replayTime = replayTime;
    this.player = Observable.timer( 0, this.replayTime * 1000 );
    this.subscription = this.player.subscribe( () => this.renderMonitorDetect() );
  }

  public stop() {
    this.playState = 'play';
    this.playButtonTitle = '시작';
    this.subscription.unsubscribe();
  }

  public changeReplayTime( event ) {
    this.replayTime = event[ 'value' ];
    this.stop();
    this.play( this.replayTime );
  }

  public togglePlayer( el ) {
    if ( this.playActive ) {
      this.stop();
    } else {
      this.play( this.replayTime );
    }
    this.playActive = !this.playActive;
  }

  public getMonitorDetectData() {
    const params = {};
    const filterData = this.applyFilterData;

    params['ipv'] = this.ipv;
    params['flow'] = this.filter.flow;

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
    if (filterData.hasOwnProperty('hport_f') && filterData.hasOwnProperty('hport_t')) {
      params['hport_f'] = filterData['hport_f'];
      params['hport_t'] = filterData['hport_t'];
    }
    if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
      params['vport_f'] = filterData['vport_f'];
      params['vport_t'] = filterData['vport_t'];
    }
    if (filterData.hasOwnProperty('block')) {
      params['block'] = filterData['block'].value;
    }
    let getParams = {
      params: params
    }
    console.log('getMonitorDetectData'+getParams);    
    return this.http.get('/api/monitor/detect', getParams ).map((response : Response) => response.json() );
  }
  
  public renderMonitorDetect() {
    this.loadData = true;
    this.getMonitorDetectData().subscribe(
      data => {
        if ( typeof data === 'undefined' ) {
          this.gridData = [];
        } else {
          this.flowListItems= [
            {text: '전체'+'('+ data.header[ 'all-count'] +')',value: 0  },
            {text: 'Inbound'+'('+ data.header[ 'inbound-count'] +')',value: 1  },
            {text: 'Outbound'+'('+ data.header[ 'outbound-count'] +')',value: 2  },
          ];
          this.parseGridData( data.datas );
        }
      },
      error => {
        this.gridData = [];
        this.flowListItems= [
          {text: '전체(0)',value: 0  },
          {text: 'Inbound(0)',value: 1  },
          {text: 'Outbound(0)',value: 2  },
        ];
      }
    );
  }

  public getMonitorDetectDataDelete() {
    let params = {
      params: {
        ipv: this.ipv,
        flow: this.filter.flow
      }
    };
    return this.http.delete('/api/monitor/detect').map( (response : Response ) => response.json() );
  }

  public renderMonitorDetectDelete() {
    this.loadData = true;
    this.getMonitorDetectDataDelete().subscribe(
      data => {
        if ( typeof data === 'undefined' ) {
          this.gridData = [];
        } else {
          this.flowListItems= [
            {text: '전체'+'('+ data.header[ 'all-count'] +')',value: 0  },
            {text: 'Inbound'+'('+ data.header[ 'inbound-count'] +')',value: 1  },
            {text: 'Outbound'+'('+ data.header[ 'outbound-count'] +')',value: 2  },
          ];
          this.parseGridData( data.datas );
        }
      },
      error => {
        this.gridData = [];
        this.flowListItems= [
          {text: '전체(0)',value: 0  },
          {text: 'Inbound(0)',value: 1  },
          {text: 'Outbound(0)',value: 2  },
        ];
      }
    );
  }

  public parseGridData( jsonData: any[] ) {
    var tempGridData: any[] = [];

    for (var i = 0; i < jsonData.length; i++) {
      var row = jsonData[i];
      if ( row.raw.message != 'single' )
        row.raw.message = '';

      tempGridData.push({
        policy_info_category_name: row.policy_info.category_name,
        policy_info_attack_code: row.policy_info.attack_code,
        policy_info_attack_name: row.policy_info.attack_name,
        hacker_country_code: row.hacker.country.code,
        hacker_country_name: row.hacker.country.name,
        hacker_ip: row.hacker.ip+':'+row.hacker.port,
        victim_country_name: row.victim.country.name,
        victim_country_code: row.victim.country.code,
        victim_ip: row.victim.ip+':'+row.victim.port,
        detect_state: row.state,
        detect_risk: row.policy_info.risk.toLowerCase(),
        detect_attempts: row.count,
        block: row.block.message,
        attack_start: row.start_time,
        attack_end: row.end_time,
        ttl: row.ttl,
        raw: row.raw.message,
        Additional_Information: row.etc_info,
        nic_port: row.interface_info.name,
        direction: row.flow.message,
        application_name: row.application_info.name,
        detect_Traffic: row.size
      })
    }
    this.gridData = tempGridData;

    let now = moment();
    this.updatedTime = now.format('HH:mm:ss');
    this.updatedTimeTitle = now.format('YYYY년 MM월 DD일 HH시 mm분 ss초');
    setTimeout( () => {
      this.loadData = false;
    }, 500);
  }

  public filterFlow( flow ) {
    this.selectedFlow = flow;
    this.filter.flow = flow.value;
    this.stop();
    this.play( this.replayTime );
  }

  public filterIpv( ipv: number ) {
    this.ipv = ipv;
    this.stop();
    this.play( this.replayTime );
  }

  public exportDetectMonitorData(grid: GridComponent) {
    if (this.gridData.length > 0) {
      this.detectExcelFileName = `BlockMonitor_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      grid.saveAsExcel();
    }
  }

  public setRowStyle(context: RowClassArgs) {
    const isRiskHigh = (context.dataItem.detect_risk === 'high') ? true : false;
    const isRiskMedium = (context.dataItem.detect_risk === 'medium') ? true : false;
    const isRiskLow = (context.dataItem.detect_risk === 'low') ? true : false;
    return {
      'risk-high': isRiskHigh,
      'risk-medium': isRiskMedium,
      'risk-low': isRiskLow
    };  
  }

  public detectLogDelete(e){    
    this.renderMonitorDetectDelete();
  }

  public clickShowFilter(e: any) {
    this.detectMonitorSidebar.init(this.applyFilterData);
  }

  public applyFilter(filterData: any = {}) {
    this.applyFilterData = filterData;
    
    this.makeFilterItem();
    this.stop();
    this.play(this.replayTime );
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
    // 포트정보(공격자)
    if (filterData.hasOwnProperty('hport_f') && filterData.hasOwnProperty('hport_t')) {
      filterData['activePortSource'] = true;
    }
    // 포트정보(대상자)
    if (filterData.hasOwnProperty('vport_f') && filterData.hasOwnProperty('vport_t')) {
      filterData['activePortDestination'] = true;
    }
    // 기타
    if (filterData.hasOwnProperty('block')) {
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

    if (filterData.hasOwnProperty('block')) {
      filterItems.push({
        type: 'etc',
        typeText: '기타',
        values: [
          {
            type: 'block',
            text: '차단방법',
            value: filterData['block'].text
          }
        ],
        targets: [ 'block' ]
      });
    }

    this.applyFilterItems = filterItems;
  }

}
