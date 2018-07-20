import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from './../../../../../helpers';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { TrafficMonitorWidgetComponent } from './widget/traffic-monitor-widget.component';
import { BigChartComponent } from './big-chart/big-chart.component';
import { formatNumber } from '@telerik/kendo-intl';

import * as moment from 'moment';

@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './traffic-monitor.component.html',
  styleUrls: ['./traffic-monitor.component.scss'],
  encapsulation: ViewEncapsulation.None 
})
export class TrafficMonitorComponent implements OnInit, AfterViewInit {
	
  @ViewChild('tabProtocolBps') tabProtocolBps: ElementRef;
  @ViewChild('tabProtocolPps') tabProtocolPps: ElementRef;
  
	@ViewChildren(TrafficMonitorWidgetComponent) widgets: QueryList<TrafficMonitorWidgetComponent>;
	@ViewChildren(BigChartComponent) bigCharts: QueryList<BigChartComponent>;

	private playActive: boolean = true;
	private player: any;
  dataUnit: string = 'bps';

  replayTime: number = 3;  
	playState: string = 'pause';
	playButtonTitle: string = '정지';
  stackButtonTitle: string = '누적보기';  
  isHideSummary: boolean = false;
  isHideInterface: boolean = false;  
  loadData: boolean = true;
  updatedTime: any = moment().format('HH:mm:ss');
  updatedTimeTitle: string = '';
  selectedInterfaceID: number = -1;  
  selectedInterfaceName: string = '전체';

  summary_cur_bps: string = '';
  summary_max_bps: string = '';
  summary_cur_pps: string = '';
  summary_max_pps: string = '';
  summary_hack_size: string = '';
  summary_hack_size_percent: string = '';
  summary_hack_packet: string = '';
  summary_hack_packet_percent: string = '';

	interfaces: Object[] = [];

  constructor(private http: Http) { 
  	this.renderMonitorTraffic();
  }

  ngOnInit() {
    this.play();
  }

  ngAfterViewInit() {
    
  }

  ngOnDestroy() {
    console.log('traffic view OnDestroy~~~~')
    this.stop();
  }

  public dataUnitChange(target) {
    if (target.id == 'data-unit-bps') {
      //pps탭 숨김
      this.dataUnit = 'bps';
    } else {
      //bps탭 숨김
      this.dataUnit = 'pps';
       
    }
  }

  public play() {
    this.playState = 'pause';
    this.playButtonTitle = '정지';

    // let el = document.querySelector( '.update-ticker-loader' );
    // console.log(el);
    // el.style.display = 'block';
    this.renderMonitorTrafficSummary();
    this.renderMonitorTraffic();
    this.renderMonitorTrafficBound();
    this.renderMonitorTrafficInteface();

    this.player = setInterval( ()=> {         
      this.renderMonitorTrafficSummary();
      this.renderMonitorTraffic();
      this.renderMonitorTrafficBound();
      this.renderMonitorTrafficInteface();
    }, this.replayTime * 1000 );
  }

  public stop() {
    this.playState = 'play';
    this.playButtonTitle = '시작';

    let el = document.querySelector( '.update-ticker-loader' );
    console.log(el);
    // el.style.display = 'block';

    clearInterval( this.player );
  }

  public togglePlayer( el ) {
    if ( this.playActive ) {
      this.stop();
    } else {
      this.play();
    }

    this.playActive = !this.playActive;
  }

  private initComponent() {
    //위젯 차트 초기화
    this.widgets.map((widget) => {
      widget.dataInit();
    });

    //big 차트 초기화
    this.bigCharts.map((bigChart) => {
      bigChart.dataInit();
    });
  }

  public initData() {
    this.http.delete( '/api/monitor/traffic' )
    .map( (response: Response) => response.json() )
    .subscribe(
      data=> {
        this.initComponent();
      },
      error=> {

      }
     )
  }

  public changeReplayTime( second: number ) {
    console.log( second );
    this.replayTime = second;
    this.stop();
    this.play();
  }

  public getMonitorTrafficDataBound() {
    return this.http.get( '/api/monitor/traffic/protocol/bound' ).map( (response: Response) => response.json() );
  }

  public getMonitorTrafficData() {
    return this.http.get( '/api/monitor/traffic/protocol' ).map( (response: Response) => response.json() );
  }

  public getMonitorTrafficDataInterface() {
    return this.http.get( '/api/monitor/traffic/interface' ).map( (response: Response) => response.json() );
  }

  public getMonitorTrafficDataSummary() {
    return this.http.get( '/api/monitor/traffic/summary' ).map( (response: Response) => response.json() );
  }

  public renderMonitorTrafficBound() {
    this.getMonitorTrafficDataBound().subscribe(
      data => {
        if ( typeof data === 'undefined' ) {
          //this.gridData = [];
        } else {        	
        	this.parseChartDataBound( data['server_time'], data.datas );
          //this.parseGridData( data.datas );
        }
      },
      error => {
        //this.gridData = [];
      }
    );
  }

  public renderMonitorTraffic() {    
    this.getMonitorTrafficData().subscribe(
      data => {
        if ( typeof data === 'undefined' ) {
          //this.gridData = [];
        } else {
        	if (this.interfaces.length == 0) {
            return this.initWidget(data.datas);            
          }
        	this.parseChartData( data['server_time'], data.datas );
          //this.parseGridData( data.datas );
        }
      },
      error => {
        //this.gridData = [];
      }
    );
  }

  public renderMonitorTrafficSummary() {
    this.loadData = true;
    this.getMonitorTrafficDataSummary().subscribe(
      data => {
        if ( typeof data === 'undefined' ) {
          //this.gridData = [];
        } else {
          
          this.parseDataSummary( data.datas );
          //this.parseGridData( data.datas );
        }
      },
      error => {
        //this.gridData = [];
      }
    );
  }

  public renderMonitorTrafficInteface() {
    this.getMonitorTrafficDataInterface().subscribe(
      data => {
        if ( typeof data === 'undefined' ) {
          //this.gridData = [];
        } else {                    
          this.parseChartDataInterface( data['server_time'], data.datas );
          //this.parseGridData( data.datas );
        }
      },
      error => {
        //this.gridData = [];
      }
    );
  }

  public parseChartDataBound( serverTime:string, jsonData: any[] ) {
    const time = (new Date()).getTime();    

    //bps inbound/outbound~
    this.bigCharts.filter((bigChart) => {
    	return (bigChart.chartID == 'by-protocol-bound') && (bigChart.dataUnit == 'bps');
    }).map((bigChart, i) => {    	
      const bps_tcp_in = jsonData[0]['bps_tcp_out'];
      const bps_tcp_out = jsonData[1]['bps_tcp_out'];
      const bps_udp_in = jsonData[0]['bps_udp_out'];
      const bps_udp_out = jsonData[1]['bps_udp_out'];
      const bps_icmp_in = jsonData[0]['bps_icmp_out'];
      const bps_icmp_out = jsonData[1]['bps_icmp_out'];
      const bps_etc_in = jsonData[0]['bps_etc_out'];
      const bps_etc_out = jsonData[1]['bps_etc_out'];
      const bps_drop_in = jsonData[0]['bps_total_drop'];
      const bps_drop_out = jsonData[1]['bps_total_drop'];

    	bigChart.displayChartProtocolBound(time, 
				    												bps_tcp_in,
				    												bps_tcp_out,
				    												bps_udp_in,
				    												bps_udp_out,
				    												bps_icmp_in,
				    												bps_icmp_out,
				    												bps_etc_in,
				    												bps_etc_out,
				    												bps_drop_in,
				    												bps_drop_out);
    	bigChart.displayGridProtocolBound(jsonData);
    });

    //pps inbound/outbound~
    this.bigCharts.filter((bigChart) => {
      return (bigChart.chartID == 'by-protocol-bound') && (bigChart.dataUnit == 'pps');
    }).map((bigChart, i) => {      
      const pps_tcp_in = jsonData[0]['pps_tcp_out'];
      const pps_tcp_out = jsonData[1]['pps_tcp_out'];
      const pps_udp_in = jsonData[0]['pps_udp_out'];
      const pps_udp_out = jsonData[1]['pps_udp_out'];
      const pps_icmp_in = jsonData[0]['pps_icmp_out'];
      const pps_icmp_out = jsonData[1]['pps_icmp_out'];
      const pps_etc_in = jsonData[0]['pps_etc_out'];
      const pps_etc_out = jsonData[1]['pps_etc_out'];
      const pps_drop_in = jsonData[0]['pps_total_drop'];
      const pps_drop_out = jsonData[1]['pps_total_drop'];

      bigChart.displayChartProtocolBound(time, 
                                    pps_tcp_in,
                                    pps_tcp_out,
                                    pps_udp_in,
                                    pps_udp_out,
                                    pps_icmp_in,
                                    pps_icmp_out,
                                    pps_etc_in,
                                    pps_etc_out,
                                    pps_drop_in,
                                    pps_drop_out);
      bigChart.displayGridProtocolBound(jsonData);
    });
  }

  public initWidget(jsonData: any[]) {
    jsonData.forEach( (data, i) => {
      this.interfaces.push({ 'id': data.id, 'name': data.name });
    }); 
  }

  public parseChartData( serverTime:string, jsonData: any[] ) {
    const time = (new Date()).getTime();    

    //bps widgets~~~
    this.widgets.filter((widget) => {
      return widget.dataUnit == 'bps';
    }).map((widget, i) => {            
      
		  const bps_total_in = jsonData[i]['bps_total_in'];
      const bps_total_out = jsonData[i]['bps_total_out'];
      const bps_total_drop = jsonData[i]['bps_total_drop'];
      const bandwidth = jsonData[i]['bandwidth'];
    		  
    	widget.displayChart(time,
    											bps_total_in, 
    											bps_total_out, 
    											bps_total_drop,
                          bandwidth);
    });

    //pps widgets~~~
    this.widgets.filter((widget) => {
      return widget.dataUnit == 'pps';
    }).map((widget, i) => {            
      
      const pps_total_in = jsonData[i]['pps_total_in'];
      const pps_total_out = jsonData[i]['pps_total_out'];
      const pps_total_drop = jsonData[i]['pps_total_drop'];
      const bandwidth = jsonData[i]['bandwidth'];
    
      widget.displayChart(time,
                          pps_total_in, 
                          pps_total_out, 
                          pps_total_drop,
                          bandwidth);
    });

    //bps input/output total~
    this.bigCharts.filter((bigChart) => {
    	return (bigChart.chartID == 'by-protocol') && (bigChart.dataUnit == 'bps');
    }).map((bigChart, i) => {    
      const bps_tcp_in = jsonData[0]['bps_tcp_in'];
      const bps_tcp_out = jsonData[0]['bps_tcp_out'];
      const bps_udp_in = jsonData[0]['bps_udp_in'];
      const bps_udp_out = jsonData[0]['bps_udp_out'];
      const bps_icmp_in = jsonData[0]['bps_icmp_in'];
      const bps_icmp_out = jsonData[0]['bps_icmp_out'];
      const bps_etc_in = jsonData[0]['bps_etc_in'];
      const bps_etc_out = jsonData[0]['bps_etc_out'];
      const bps_drop_in = 0;
      const bps_drop_out = jsonData[0]['bps_total_drop'];

    	bigChart.displayChartProtocol(time, 
				    												bps_tcp_in,
				    												bps_tcp_out,
				    												bps_udp_in,
				    												bps_udp_out,
				    												bps_icmp_in,
				    												bps_icmp_out,
				    												bps_etc_in,
				    												bps_etc_out,
				    												bps_drop_in,
				    												bps_drop_out);
    	bigChart.displayGridProtocol(jsonData[0]);
    });   

    //pps input/output total~
    this.bigCharts.filter((bigChart) => {
      return (bigChart.chartID == 'by-protocol') && (bigChart.dataUnit == 'pps');
    }).map((bigChart, i) => {    
      const pps_tcp_in = jsonData[0]['pps_tcp_in'];
      const pps_tcp_out = jsonData[0]['pps_tcp_out'];
      const pps_udp_in = jsonData[0]['pps_udp_in'];
      const pps_udp_out = jsonData[0]['pps_udp_out'];
      const pps_icmp_in = jsonData[0]['pps_icmp_in'];
      const pps_icmp_out = jsonData[0]['pps_icmp_out'];
      const pps_etc_in = jsonData[0]['pps_etc_in'];
      const pps_etc_out = jsonData[0]['pps_etc_out'];
      const pps_drop_in = 0;
      const pps_drop_out = jsonData[0]['pps_total_drop'];

      bigChart.displayChartProtocol(time, 
                                    pps_tcp_in,
                                    pps_tcp_out,
                                    pps_udp_in,
                                    pps_udp_out,
                                    pps_icmp_in,
                                    pps_icmp_out,
                                    pps_etc_in,
                                    pps_etc_out,
                                    pps_drop_in,
                                    pps_drop_out);
      bigChart.displayGridProtocol(jsonData[0]);
    });  
  
    //전체 제거.
    jsonData = jsonData.filter((data, i) => {
      return data.id != '-1';
    });

    //bps input/output link~
    this.bigCharts.filter((bigChart) => {
      return (bigChart.chartID == 'by-protocol-link') && (bigChart.dataUnit == 'bps');
    }).map((bigChart, i) => {          
      bigChart.displayChartProtocolLink(time, jsonData);
      bigChart.displayGridProtocolLink(jsonData);
    });   

    //pps input/output link~
    this.bigCharts.filter((bigChart) => {
      return (bigChart.chartID == 'by-protocol-link') && (bigChart.dataUnit == 'pps');
    }).map((bigChart, i) => {    
      bigChart.displayChartProtocolLink(time, jsonData);      
      bigChart.displayGridProtocolLink(jsonData);
    });  

  }

  public parseDataSummary( jsonData: any[] ) {
    this.summary_cur_bps = jsonData[0]['cur_bps'];
    this.summary_max_bps = jsonData[0]['max_bps'];
    this.summary_cur_pps = formatNumber(jsonData[0]['cur_pps'], "n");
    this.summary_max_pps = formatNumber(jsonData[0]['max_pps'], "n");
    this.summary_hack_size = jsonData[0]['hack_size'];
    this.summary_hack_size_percent = formatNumber(jsonData[0]['hack_size_per'], "n2") + '%';
    this.summary_hack_packet = formatNumber(jsonData[0]['hack_packet'], "n");
    this.summary_hack_packet_percent = formatNumber(jsonData[0]['hack_packet_per'], "n2") + '%';  


    let now = moment();
    this.updatedTime = now.format('HH:mm:ss');
    this.updatedTimeTitle = now.format('YYYY년 MM월 DD일 HH시 mm분 ss초');
    setTimeout( () => {
      this.loadData = false;
    }, 500);
  
  }

  public parseChartDataInterface( serverTime:string, jsonData: any[] ) {

		const time = (new Date()).getTime();    

    //bps interface~
		this.bigCharts.filter((bigChart) => {
    	return (bigChart.chartID == 'by-interface') && (bigChart.dataUnit == 'bps');
    }).map((bigChart, i) => {    
    	bigChart.displayChartInterface(time, jsonData);
    	bigChart.displayGridInterface(jsonData);
    });

    //pps interface~
    this.bigCharts.filter((bigChart) => {
      return (bigChart.chartID == 'by-interface') && (bigChart.dataUnit == 'pps');
    }).map((bigChart, i) => {    
      bigChart.displayChartInterface(time, jsonData);
      bigChart.displayGridInterface(jsonData);
    });
  }

  public changeBigChart(interfaceObject) {
    //인터페이스 별 트래픽 정보에서 인터페이스를 선택하였을때 호출된다.
    //"전체"를 선택한 경우에는 프로토콜별 - Inbound/Outbound, 프로토콜별 - Input/Output, 인터페이스별을 모두 지원
    //"그외"를 선택한 경우에는 프로토콜별 - Input/Output만 지원    

    this.selectedInterfaceID = interfaceObject.id;
    this.selectedInterfaceName = interfaceObject.name;    

    var el = this.tabProtocolBps.nativeElement;
    el.click();
    var el = this.tabProtocolPps.nativeElement;
    el.click();
  }

}
