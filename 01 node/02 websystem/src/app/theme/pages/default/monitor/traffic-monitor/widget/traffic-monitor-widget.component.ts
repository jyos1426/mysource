import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import * as moment from 'moment';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'traffic-monitor-widget',
  templateUrl: './traffic-monitor-widget.component.html',
  styles: []
})
export class TrafficMonitorWidgetComponent implements OnInit {
  
  @ViewChild('container') container: ElementRef;

  chart: any;
  options: Object;
  bandwidth: string;

  @Input() index;
  @Input() interfaceID;
  @Input() interfaceName;
  @Input() dataUnit;
  @Output() onSelectWidget = new EventEmitter<any>();

  constructor() {     
    this.options = {
      chart: { 
        type: 'area', 
        animation: false,
        height: 100,
        renderTo: 'container'
      },
      title : { text: '' },
      xAxis: {
        type: 'logarithmic',
        tickPixelInterval: 100,
        labels: {
           formatter: function() {
             return moment(this.value).format('HH:mm:ss');
           } 
         }
      },
      yAxis: { 
        title: { text: 'kbps' }, 
        reversedStacks: false        
      },    
      tooltip: {
         shared: true,
         formatter: function() {
           const time = moment(this.x).format('HH:mm:ss');
           var msg = `${time}<br>`;

            this.points.forEach( (point, i) => {
              var symbol = '●';             
              msg += `<span style="color:${point.series.color}">●</span>${point.series.name}:<b>${Math.abs(point.series.yData[point.point.index])}</b><br>`;             
            })
           return msg;
         }
      },      
      credits: { enabled: false },
      plotOptions: { 
        series: { 
          stacking: 'normal',           
          lineWidth: 1          
        } 
      },
      series: [{
        name: 'Input',
        color: '#3498DB',
        marker: { enabled: false },      
        showInLegend: false,
        lineColor: '#111',
        stack: 0
      },
      {
        name: 'Output',
        color: '#3498DB',
        marker: { enabled: false },      
        showInLegend: false,
        lineColor: '#111',
        stack: 1
      },
      {
        name: '차단',
        color: '#C0392B',
        marker: { enabled: false },      
        showInLegend: false,
        lineColor: '#111',
        stack: 1
      }]      
    }  

    var emptyData = [],        
        _time = (new Date()).getTime(),
        i;

    for (i = -99; i <= 0; i += 1) {
        emptyData.push({
            x: _time + i * 1000,
            y: null
        });
    }

    this.options['series'].forEach( (_data, i) => {
      this.options['series'][i]['data'] = emptyData;      
    })      
  }

  ngOnInit() {    
    //여기는 @Input 변수들 초기화 된 상태.

    var el = this.container.nativeElement;    
    el.id = 'traffic-widget-container-' + this.index + '-' + this.dataUnit;

    this.options['chart']['renderTo'] = el.id;

    if (this.dataUnit == 'pps')
      this.options['yAxis']['title']['text'] = 'pps';
     
    this.chart = new Highcharts.Chart( this.options );
  }

  private yAxisSetMinMax(redraw: boolean = false) {
    let max = this.chart.yAxis[0].dataMax;
    let min = this.chart.yAxis[0].dataMin;
    if (max < Math.abs(min)) max = Math.abs(min);

    this.chart.yAxis[0].setExtremes(-max, max, redraw);
  }

  displayChart(time: number, total_in: string, total_out: string, total_drop: string, bandwidth: string) {
    // console.log(`displayChart~ ${this.interfaceName} ${bps_total_in}/${bps_total_out}/${bps_total_drop}`);
    //console.log(this.dataUnit);
    
    this.chart.series[0].addPoint([time, total_in], false, true);
    this.chart.series[1].addPoint([time, -total_out], false, true);
    this.chart.series[2].addPoint([time, -total_drop], false, true);

    this.bandwidth = bandwidth;

    this.yAxisSetMinMax();

    this.chart.redraw(false);    

  }

  selectWidget() {
    //선택한 인터페이스ID를 부모 컴포넌트로 전달.
    this.onSelectWidget.emit({'id': this.interfaceID, 'name': this.interfaceName});
  }

  dataInit() {
    var emptyData = [],        
        _time = (new Date()).getTime(),
        i;

    for (i = -99; i <= 0; i += 1) {
        emptyData.push({
            x: _time + i * 1000,
            y: null
        });
    }

    this.chart.series[0].setData(emptyData, false);
    this.chart.series[1].setData(emptyData, false);
    this.chart.series[2].setData(emptyData, false);    
    this.chart.redraw(false);
  }

}
