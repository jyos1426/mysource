import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { Helpers } from './../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { Observable, Subscription } from 'rxjs/Rx';

import { DashboardService } from './_services/dashboard.service';
import { HttpApiService } from '../../../../_services/http-api.service';
import { formatNumber } from '@telerik/kendo-intl';

import * as moment from 'moment';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from './chartist.component';

export interface Chart {
  type: ChartType;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './dashboard.component.html',
  styleUrls: [ 'dashboard.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  public detectHackerIpItems: any;
  public detectVictimIpItems: any;
  public detectAttackNameItems: any;
  public categoryData: any;
  public detectAttackNameCount: number;
  public detectVictimIpCount: number;
  public detectHackerIpCount: number;
  public tabActiveNumberAttackIp: string;
  public tabActiveNumberVictimIp: string;
  public tabActiveNumberAttackName: string;
  public isCurrentDateAttack: boolean;
  public isCurrentDateHacker: boolean;
  public isCurrentDateAttackName: boolean;

  public hardware: any;

  public cpuChartData;
  public memChartData;
  public chart: Chart;

  private system: any;
  private systemSubscription: any;

  private rankBy: any;
  private rankBySubscription: any;

  public updatedTime: any;
  public updatedTimeTitle: string;

  public loadData: boolean;

  constructor(private _script: ScriptLoaderService, private _dashBoardService: DashboardService) {
    this.categoryData = [];
    this.detectHackerIpItems = [];
    this.detectVictimIpItems = [];
    this.detectAttackNameItems = [];

    this.hardware = {
      cpu: {
        percentNumber: 0,
        percentString: '0%'
      },
      mem: {
        percentNumber: 0,
        percentString: '0%'
      },
      sniper: {
        percentNumber: 0,
        percentString: '0%',
        percentColor: 'bg-success'
      },
      backup: {
        percentNumber: 0,
        percentString: '0%',
        percentColor: 'bg-success'
      }
    };

    this.cpuChartData = {};
    this.memChartData = {};
    this.chart = {
      type: 'Pie',
      options: {
        donut: true,
        donutWidth: 10,
        donutSolid: true,
        startAngle: 0,
        showLabel: false,
        width: 100,
        height: 100
      },
      events: {
        draw(data: any): boolean {
          return data;
        }
      }
    };
    this.loadData = true;
    this.updatedTimeTitle = '';
    // this.detectExcelFileName = '';
    this.updatedTime = moment().format('HH:mm:ss');
    this.getCategoryData();
  }

  ngOnInit() {
    this.system = Observable.timer(0, 5000);
    this.systemSubscription = this.system.subscribe(() => this.getSystemData());
    // this.getSystemData();
    this.isCurrentDateAttackName = true;
    this.isCurrentDateAttack = true;
    this.isCurrentDateHacker = true;

    this.rankBy = Observable.timer(0, 10000);
    this.rankBySubscription = this.rankBy.subscribe(() =>
      this.getRankByAttackNameDataProperty(
        this.isCurrentDateAttackName,
        this.isCurrentDateAttack,
        this.isCurrentDateHacker
      )
    );
  }

  ngAfterViewInit() {
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      '../../../../../assets/vendors/custom/jquery-ui/jquery-ui.bundle.js',
      '../../../../../assets/app/js/draggable.js'
    );
  }

  ngOnDestroy() {
    this.rankBySubscription.unsubscribe();
    this.systemSubscription.unsubscribe();
  }

  private getCategoryName(categoryCode: string) {
    var filtered = this.categoryData.filter((_data) => {
      return _data['categoryCode'] == categoryCode;
    });
    return filtered[0]['categoryName'];
  }

  private getCategoryData() {
    this._dashBoardService.getCategoryList().subscribe(
      (data) => {
        if (typeof data.datas !== 'undefined') {
          this.categoryData = data.datas;
        } else {
          console.log('category_info: error');
        }
      },
      (error) => {
        console.log('category_info: real' + error);
      }
    );
  }

  private getRankByAttackNameDataProperty(
    isCurrentDateAttackName: boolean = true,
    isCurrentDateAttack: boolean = true,
    isCurrentDateHacker: boolean = true
  ) {
    this.loadData = true;
    const param = {};
    param['isCurrentDateAttackName'] = isCurrentDateAttackName ? 1 : 0;
    param['isCurrentDateHackerIp'] = isCurrentDateAttack ? 1 : 0;
    param['isCurrentDateVictimIp'] = isCurrentDateHacker ? 1 : 0;

    this._dashBoardService.getRankBy(param).subscribe(
      (responses) => {
        if (!responses[0].datas) {
          this.detectHackerIpItems = this.nonParseData();
        } else {
          this.detectAttackNameCount = responses[0].info.detect_hacker_ip_count;
          this.detectHackerIpItems = this.parseData(responses[0].datas.detect_hacker_ip);
        }

        if (!responses[1].datas) {
          this.detectVictimIpItems = this.nonParseData();
        } else {
          this.detectAttackNameCount = responses[1].info.detect_victim_ip_count;
          this.detectVictimIpItems = this.parseData(responses[1].datas.detect_victim_ip);
        }

        if (!responses[2].datas) {
          this.detectAttackNameItems = this.nonParseData();
        } else {
          this.detectAttackNameCount = responses[2].info.detect_attack_name_count;
          this.detectAttackNameItems = this.parseData(responses[2].datas.detect_attack_name);
          console.log(this.detectAttackNameItems);
        }
      },
      (error) => {
        console.log('error:' + error);
      }
    );
  }

  private nonParseData() {
    var tempGridData: any[] = [];
    for (var i = 0; i < 4; i++) {
      tempGridData.push({
        type_spec: '',
        type: 'None',
        name: '데이터 없음',
        progress_number: 0,
        progress_label: '침입탐지수: 0',
        style: 0,
        progress_color: 'bg-success'
      });
    }
    return tempGridData;
  }

  private parseData(jsonData: any[]) {
    var tempGridData: any[] = [];

    for (var i = 0; i < jsonData.length; i++) {
      var row = jsonData[i];
      var category = '';
      if (row.category !== undefined) {
        category = this.getCategoryName(row.category);
      }
      var name = '';
      if (row.attack_name !== undefined) {
        name = row.attack_name;
      } else if (row.victim_ip !== undefined) {
        name = row.victim_ip;
      } else {
        name = row.hacker_ip;
      }

      var percent = Math.floor(row.detect_count / this.detectAttackNameCount * 100);
      var progress_color = '';
      if (Number(percent) > 0 && Number(percent) < 25) {
        progress_color = 'bg-success';
      } else if (Number(percent) > 26 && Number(percent) < 50) {
        progress_color = 'bg-brand';
      } else if (Number(percent) > 51 && Number(percent) < 75) {
        progress_color = 'bg-warning';
      } else {
        progress_color = 'bg-danger';
      }
      var type_spec = '';
      if (category === '패턴블럭') {
        type_spec = 'p';
      } else if (category === '서비스거부') {
        type_spec = 's';
      } else {
        type_spec = '';
      }
      var progress_number = percent + '%';
      var progress_label = '침입탐지수:' + row.detect_count;
      tempGridData.push({
        type_spec: type_spec,
        type: category,
        name: name,
        progress_number: progress_number,
        progress_label: progress_label,
        style: progress_number,
        progress_color: progress_color
      });
    }
    let now = moment();
    this.updatedTime = now.format('HH:mm:ss');
    this.updatedTimeTitle = now.format('YYYY년 MM월 DD일 HH시 mm분 ss초');
    setTimeout(() => {
      this.loadData = false;
    }, 500);
    return tempGridData;
  }

  public filterTab(tabId: string) {
    if (tabId === 'm_widget4_tab1_content') {
      this.isCurrentDateAttack = true;
      this.tabActiveNumberAttackIp = tabId;
    } else if (tabId === 'm_widget4_tab2_content') {
      this.isCurrentDateAttack = false;
      this.tabActiveNumberAttackIp = tabId;
    } else if (tabId === 'm_widget4_tab3_content') {
      this.isCurrentDateHacker = true;
      this.tabActiveNumberVictimIp = tabId;
    } else if (tabId === 'm_widget4_tab4_content') {
      this.isCurrentDateHacker = false;
      this.tabActiveNumberVictimIp = tabId;
    } else if (tabId === 'm_widget4_tab5_content') {
      this.isCurrentDateAttackName = true;
      this.tabActiveNumberAttackName = tabId;
    } else if (tabId === 'm_widget4_tab6_content') {
      this.isCurrentDateAttackName = false;
      this.tabActiveNumberAttackName = tabId;
    }

    this.getRankByAttackNameDataProperty(
      this.isCurrentDateAttackName,
      this.isCurrentDateAttack,
      this.isCurrentDateHacker
    );
  }

  public getSystemData() {
    var param = {};
    this.loadData = true;
    this._dashBoardService.getSystemDataList(param).subscribe(
      (data) => {
        this.parseSystemData(data.datas);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public parseSystemData(jsonData) {
    let hardware = jsonData['hardware'];
    this.hardware.cpu.percentNumber = hardware.cpu;
    this.hardware.mem.percentNumber = hardware.mem;
    this.hardware.cpu.percentString = formatNumber(hardware.cpu, 'n0') + '%';
    this.hardware.mem.percentString = formatNumber(hardware.mem, 'n0') + '%';
    this.hardware.backup.percentString = formatNumber(hardware.backup, 'n0') + '%';
    this.hardware.sniper.percentString = formatNumber(hardware.sniper, 'n0') + '%';

    if (hardware.backup > 80) {
      this.hardware.backup.percentColor = 'bg-danger';
    } else if (hardware.backup > 60) {
      this.hardware.backup.percentColor = 'bg-warning';
    } else {
      this.hardware.backup.percentColor = 'bg-success';
    }

    if (hardware.sniper > 80) {
      this.hardware.sniper.percentColor = 'bg-danger';
    } else if (hardware.sniper > 60) {
      this.hardware.sniper.percentColor = 'bg-warning';
    } else {
      this.hardware.sniper.percentColor = 'bg-success';
    }

    this.memChartData = {
      series: [ this.hardware.mem.percentNumber, 100 - this.hardware.mem.percentNumber ]
    };
    this.cpuChartData = {
      series: [ this.hardware.cpu.percentNumber, 100 - this.hardware.cpu.percentNumber ]
    };
    let now = moment();
    this.updatedTime = now.format('HH:mm:ss');
    this.updatedTimeTitle = now.format('YYYY년 MM월 DD일 HH시 mm분 ss초');
    setTimeout(() => {
      this.loadData = false;
    }, 500);
  }
}
