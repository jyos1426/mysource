import { Component, OnInit, Input,  ViewChild, ElementRef } from '@angular/core';

import * as moment from 'moment';
import * as Highcharts from 'highcharts';

import { formatNumber } from '@telerik/kendo-intl';

@Component({
  selector: 'big-chart',
  templateUrl: './big-chart.component.html',
  styles: []
})

export class BigChartComponent implements OnInit {

  @ViewChild('container') container: ElementRef;

  chart: any;  
  options: Object;
  emptyData: Object[] = [];
  gridData: any[] = [];  
  stackState: boolean = true;
  protocolCount: number = 10; //tcp*2, udp*2, icmp*2, etc*2, drop*2

  @Input() chartID; 
  @Input() dataUnit;
  @Input() interfaceID;
  
  constructor() { }

  ngOnInit() {    
    this.initChartOption(this.chartID);

    var el = this.container.nativeElement;    
    if (this.chartID == 'by-protocol-link') {
       el.id = 'traffic-chart-container-' + this.chartID + '-' + this.interfaceID + '-' + this.dataUnit;

       //console.log(el.id);
    } else {
      el.id = 'traffic-chart-container-' + this.chartID + '-' + this.dataUnit;
    }

    this.options['chart']['renderTo'] = el.id;

    if (this.dataUnit == 'pps') {
      if (this.chartID == 'by-protocol-bound')
        this.options['yAxis']['title']['text'] = 'Outbound(pps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Inbound(pps)';
      else
        this.options['yAxis']['title']['text'] = 'Output(pps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Input(pps)';
    } 
    
    this.chart = new Highcharts.Chart( this.options ); 
    this.chart.showLoading();
  }

  seriesStack(on: boolean) {
 
    this.stackState = on;

    this.chart.series.map((series)=>{
      series.update({
        "stacking": this.stackState ? 'normal' : null,
      }, false);
    });

    this.chart.redraw(false);
     
  }

  dataInit() {
    var emptyData = [],        
        _time = (new Date()).getTime(),
        i;

    for (i = -299; i <= 0; i += 1) {
        emptyData.push({
            x: _time + i * 1000,
            y: null
        });
    }

    this.chart.series.map((series) => {      
      series.setData(emptyData, false);  
    });
    this.chart.redraw(false);
  }

  private initChartOption(id: string) {

    if (id == 'by-protocol-bound') {
      this.options = {
        chart: { 
          type: 'area', 
          animation: false,
          height: 300        
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
        legend: {
          align: 'center',
          verticalAlign: 'top',
          //layout: 'vertical'
        },
        yAxis: { 
          title: { text: 'Outbound(kbps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Inbound(kbps)', useHTML: true }, 
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
            lineWidth: 1,
            events: {
              legendItemClick: function() {
                const visible = !this.visible;
                for (var i=0; i < this.chart.series.length; i++)
                {
                  const series = this.chart.series[i];
                  if (series.name == this.name) continue;
                  if (series.color == this.color)
                    series.setVisible(visible, false);
                }
                this.chart.redraw(false);
              }
            }
          } 
        },       
        series: [{
          name: 'TCP',
          color: '#196F3D',
          marker: { enabled: false },      
          showInLegend: true,
          lineColor: '#111',
          stack: 0
        },  
        {
          name: 'TCP(Outbound)',
          color: '#196F3D',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: 'UDP',
          color: '#F4D03F',
          marker: { enabled: false },      
          showInLegend: true,
          lineColor: '#111',
          stack: 0        
        },
        {
          name: 'UDP(Outbound)',
          color: '#F4D03F',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: 'ICMP',
          color: '#E851F5',
          marker: { enabled: false },      
          showInLegend: true,
          lineColor: '#111',
          stack: 0
        },
        {
          name: 'ICMP(Outbound)',
          color: '#E851F5',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: 'ETC',
          color: '#5F6A6A',
          marker: { enabled: false },    
          showInLegend: true,  
          lineColor: '#111',
          stack: 0
        },
        {
          name: 'ETC(Outbound)',
          color: '#5F6A6A',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: '차단',
          color: '#C0392B',
          marker: { enabled: false },  
          showInLegend: true,  
          lineColor: '#111',  
          stack: 0
        },
        {
          name: '차단(outbound)',
          color: '#C0392B',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        }]      
      }
    } else if ((id == 'by-protocol') || (id == 'by-protocol-link')) {
      this.options = {
        chart: { 
          type: 'area', 
          animation: false,
          height: 300        
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
        legend: {
          align: 'center',
          verticalAlign: 'top',
          //layout: 'vertical'
        },
        yAxis: { 
          title: { text: 'Output(kbps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Input(kbps)', useHTML: true },  
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
            lineWidth: 1,
            events: {
              legendItemClick: function() {
                const visible = !this.visible;
                for (var i=0; i < this.chart.series.length; i++)
                {
                  const series = this.chart.series[i];
                  if (series.name == this.name) continue;
                  if (series.color == this.color)
                    series.setVisible(visible, false);
                }
                this.chart.redraw(false);
              }
            }
          } 
        },
        series: [{
          name: 'TCP',
          color: '#196F3D',
          marker: { enabled: false },      
          showInLegend: true,
          lineColor: '#111',
          stack: 0
        },  
        {
          name: 'TCP(Output)',
          color: '#196F3D',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: 'UDP',
          color: '#F4D03F',
          marker: { enabled: false },      
          showInLegend: true,
          lineColor: '#111',
          stack: 0        
        },
        {
          name: 'UDP(Output)',
          color: '#F4D03F',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: 'ICMP',
          color: '#E851F5',
          marker: { enabled: false },      
          showInLegend: true,
          lineColor: '#111',
          stack: 0
        },
        {
          name: 'ICMP(Output)',
          color: '#E851F5',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: 'ETC',
          color: '#5F6A6A',
          marker: { enabled: false },    
          showInLegend: true,  
          lineColor: '#111',
          stack: 0
        },
        {
          name: 'ETC(Output)',
          color: '#5F6A6A',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        },
        {
          name: '차단',
          color: '#C0392B',
          marker: { enabled: false },  
          showInLegend: true,  
          lineColor: '#111',  
          stack: 0
        },
        {
          name: '차단(Output)',
          color: '#C0392B',
          marker: { enabled: false },        
          showInLegend: false,
          lineColor: '#111',
          stack: 1
        }]      
      }    
    } else {
      this.options = {
        chart: { 
          type: 'area', 
          animation: false,
          height: 300        
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
        legend: {
          align: 'center',
          verticalAlign: 'top',
          //layout: 'vertical'
        },
        yAxis: { 
          title: { text: 'Output(kbps)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Input(kbps)', useHTML: true },  
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
            lineWidth: 1,
            events: {
              legendItemClick: function() {
                const visible = !this.visible;
                for (var i=0; i < this.chart.series.length; i++)
                {
                  const series = this.chart.series[i];
                  if (series.name == this.name) continue;
                  if (series.color == this.color)
                    series.setVisible(visible, false);
                }
                this.chart.redraw(false);
              }
            }
          } 
        },
        series: []
      }
    }

    var _time = (new Date()).getTime();
    for (var i = -299; i <= 0; i += 1) {
        this.emptyData.push({
            x: _time + i * 1000,
            y: null
        });
    }    
    this.options['series'].forEach( (_data, i) => {
      this.options['series'][i]['data'] = this.emptyData;      
    })    
  }

  displayChartProtocolBound(time:number, tcp_in: number, tcp_out: number, udp_in: number, udp_out: number, icmp_in: number, icmp_out: number, etc_in: number, etc_out: number,     drop_in: number, drop_out: number) {

    this.chart.hideLoading();

    this.chart.series[0].addPoint([time, tcp_in], false, true);
    this.chart.series[1].addPoint([time, -tcp_out], false, true);
    this.chart.series[2].addPoint([time, udp_in], false, true);
    this.chart.series[3].addPoint([time, -udp_out], false, true);
    this.chart.series[4].addPoint([time, icmp_in], false, true);
    this.chart.series[5].addPoint([time, -icmp_out], false, true);
    this.chart.series[6].addPoint([time, etc_in], false, true);
    this.chart.series[7].addPoint([time, -etc_out], false, true);
    this.chart.series[8].addPoint([time, drop_in], false, true);
    this.chart.series[9].addPoint([time, -drop_out], false, true);

    this.yAxisSetMinMax();
    this.chart.redraw(false);
  }

  displayGridProtocolBound(jsonData: any[]) {
    
    this.gridData = [];

    jsonData.map((data, i) => {
      var row = new Object();
      row['byItem'] = i == 0 ? 'Inbound' : 'Outbound';
      row['protocol'] = '전체';
      
      row['cur_in'] = formatNumber(data[this.dataUnit + '_total_in'], "n");
      row['tot_in'] = formatNumber(data[this.dataUnit + '_total_in_t'], "n");
      row['cur_out'] = formatNumber(data[this.dataUnit + '_total_out'], "n");
      row['tot_out'] = formatNumber(data[this.dataUnit + '_total_out_t'], "n");
      row['cur_drop'] = formatNumber(data[this.dataUnit + '_total_drop'], "n");
      row['tot_drop'] = formatNumber(data[this.dataUnit + '_total_drop_t'], "n");

      this.gridData.push(row);

      var row = new Object();
      // row['byItem'] = i == 0 ? 'Inbound' : 'Ounbound';
      row['protocol'] = 'TCP';
      row['cur_in'] = formatNumber(data[this.dataUnit + '_tcp_in'], "n");
      row['tot_in'] = formatNumber(data[this.dataUnit + '_tcp_in_t'], "n");
      row['cur_out'] = formatNumber(data[this.dataUnit + '_tcp_out'], "n");
      row['tot_out'] = formatNumber(data[this.dataUnit + '_tcp_out_t'], "n");
      row['cur_drop'] = formatNumber(data[this.dataUnit + '_tcp_drop'], "n");
      row['tot_drop'] = formatNumber(data[this.dataUnit + '_tcp_drop_t'], "n");
      
      this.gridData.push(row);

      var row = new Object();
      // row['byItem'] = i == 0 ? 'Inbound' : 'Ounbound';
      row['protocol'] = 'UDP';
      row['cur_in'] = formatNumber(data[this.dataUnit + '_udp_in'], "n");
      row['tot_in'] = formatNumber(data[this.dataUnit + '_udp_in_t'], "n");
      row['cur_out'] = formatNumber(data[this.dataUnit + '_udp_out'], "n");
      row['tot_out'] = formatNumber(data[this.dataUnit + '_udp_out_t'], "n");
      row['cur_drop'] = formatNumber(data[this.dataUnit + '_udp_drop'], "n");
      row['tot_drop'] = formatNumber(data[this.dataUnit + '_udp_drop_t'], "n");
      
      this.gridData.push(row);

      var row = new Object();
      // row['byItem'] = i == 0 ? 'Inbound' : 'Ounbound';
      row['protocol'] = 'ICMP';
      row['cur_in'] = formatNumber(data[this.dataUnit + '_icmp_in'], "n");
      row['tot_in'] = formatNumber(data[this.dataUnit + '_icmp_in_t'], "n");
      row['cur_out'] = formatNumber(data[this.dataUnit + '_icmp_out'], "n");
      row['tot_out'] = formatNumber(data[this.dataUnit + '_icmp_out_t'], "n");
      row['cur_drop'] = formatNumber(data[this.dataUnit + '_icmp_drop'], "n");
      row['tot_drop'] = formatNumber(data[this.dataUnit + '_icmp_drop_t'], "n");
      
      this.gridData.push(row);

      var row = new Object();
      // row['byItem'] = i == 0 ? 'Inbound' : 'Ounbound';
      row['protocol'] = 'ETC';
      row['cur_in'] = formatNumber(data[this.dataUnit + '_etc_in'], "n");
      row['tot_in'] = formatNumber(data[this.dataUnit + '_etc_in_t'], "n");
      row['cur_out'] = formatNumber(data[this.dataUnit + '_etc_out'], "n");
      row['tot_out'] = formatNumber(data[this.dataUnit + '_etc_out_t'], "n");
      row['cur_drop'] = formatNumber(data[this.dataUnit + '_etc_drop'], "n");
      row['tot_drop'] = formatNumber(data[this.dataUnit + '_etc_drop_t'], "n");
      
      this.gridData.push(row);
    });
    
  }

  displayChartProtocolLink(time:number, jsonData:any[]) {
    // if (this.chart.series.length == 0) {
    //   jsonData.map((data, i) => {
    //     this.chart.addSeries({
    //       name: 'TCP',
    //       color: '#196F3D',
    //       marker: { enabled: false },      
    //       showInLegend: true,
    //       lineColor: '#111',
    //       stack: 0,          
    //       data: this.emptyData,     
    //       selectedInterfaceID: 0,
    //       protocolCount: this.protocolCount,
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: 'TCP(Output)',
    //       color: '#196F3D',
    //       marker: { enabled: false },        
    //       showInLegend: false,
    //       lineColor: '#111',
    //       stack: 1,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: 'UDP',
    //       color: '#F4D03F',
    //       marker: { enabled: false },      
    //       showInLegend: true,
    //       lineColor: '#111',
    //       stack: 0,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: 'UDP(Output)',
    //       color: '#F4D03F',
    //       marker: { enabled: false },        
    //       showInLegend: false,
    //       lineColor: '#111',
    //       stack: 1,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: 'ICMP',
    //       color: '#E851F5',
    //       marker: { enabled: false },      
    //       showInLegend: true,
    //       lineColor: '#111',
    //       stack: 0,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: 'ICMP(Output)',
    //       color: '#E851F5',
    //       marker: { enabled: false },        
    //       showInLegend: false,
    //       lineColor: '#111',
    //       stack: 1,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: 'ETC',
    //       color: '#5F6A6A',
    //       marker: { enabled: false },    
    //       showInLegend: true,  
    //       lineColor: '#111',
    //       stack: 0,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: 'ETC(Output)',
    //       color: '#5F6A6A',
    //       marker: { enabled: false },        
    //       showInLegend: false,
    //       lineColor: '#111',
    //       stack: 1,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: '차단',
    //       color: '#C0392B',
    //       marker: { enabled: false },  
    //       showInLegend: true,  
    //       lineColor: '#111',  
    //       stack: 0,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //     this.chart.addSeries({
    //       name: '차단(Output)',
    //       color: '#C0392B',
    //       marker: { enabled: false },        
    //       showInLegend: false,
    //       lineColor: '#111',
    //       stack: 1,
    //       data: this.emptyData,  
    //       selectedInterfaceID: 0,        
    //       //visible: this.interfaceID == data.id
    //       visible: true
    //     });
    //   })
    // }

    this.chart.hideLoading();

    //console.log(`[${this.dataUnit}] ${this.interfaceID}`)
    jsonData.filter((data) => {
      //console.log(`${data.id}, ${this.interfaceID}`);
      return data.id == this.interfaceID;
    }).map((data, i) => {
      const tcp_in = data[this.dataUnit + '_tcp_in'];
      const tcp_out = data[this.dataUnit + '_tcp_out'];
      const udp_in = data[this.dataUnit + '_udp_in'];
      const udp_out = data[this.dataUnit + '_udp_out'];
      const icmp_in = data[this.dataUnit + '_icmp_in'];
      const icmp_out = data[this.dataUnit + '_icmp_out'];
      const etc_in = data[this.dataUnit + '_etc_in'];
      const etc_out = data[this.dataUnit + '_etc_out'];
      const drop_in = 0;
      const drop_out = data[this.dataUnit + '_total_drop'];

      this.chart.series[i*this.protocolCount+0].addPoint([time, tcp_in], false, true);
      this.chart.series[i*this.protocolCount+1].addPoint([time, -tcp_out], false, true);
      this.chart.series[i*this.protocolCount+2].addPoint([time, udp_in], false, true);
      this.chart.series[i*this.protocolCount+3].addPoint([time, -udp_out], false, true);
      this.chart.series[i*this.protocolCount+4].addPoint([time, icmp_in], false, true);
      this.chart.series[i*this.protocolCount+5].addPoint([time, -icmp_out], false, true);
      this.chart.series[i*this.protocolCount+6].addPoint([time, etc_in], false, true);
      this.chart.series[i*this.protocolCount+7].addPoint([time, -etc_out], false, true);
      this.chart.series[i*this.protocolCount+8].addPoint([time, drop_in], false, true);
      this.chart.series[i*this.protocolCount+9].addPoint([time, -drop_out], false, true);
    })

    this.yAxisSetMinMax();    
    this.chart.redraw(false);    
  }

  displayChartProtocol(time:number, tcp_in: number, tcp_out: number, udp_in: number, udp_out: number, icmp_in: number, icmp_out: number, etc_in: number, etc_out: number,     drop_in: number, drop_out: number) {

    this.chart.hideLoading();

    this.chart.series[0].addPoint([time, tcp_in], false, true);
    this.chart.series[1].addPoint([time, -tcp_out], false, true);
    this.chart.series[2].addPoint([time, udp_in], false, true);
    this.chart.series[3].addPoint([time, -udp_out], false, true);
    this.chart.series[4].addPoint([time, icmp_in], false, true);
    this.chart.series[5].addPoint([time, -icmp_out], false, true);
    this.chart.series[6].addPoint([time, etc_in], false, true);
    this.chart.series[7].addPoint([time, -etc_out], false, true);
    this.chart.series[8].addPoint([time, drop_in], false, true);
    this.chart.series[9].addPoint([time, -drop_out], false, true);

    this.yAxisSetMinMax();
    this.chart.redraw(false);
  }

  displayGridProtocol(data: object) {
    
    this.gridData = [];
    
    var row = new Object();    
    row['protocol'] = '전체';
    row['cur_in'] = formatNumber(data[this.dataUnit + '_total_in'], "n");
    row['tot_in'] = formatNumber(data[this.dataUnit + '_total_in_t'], "n");
    row['cur_out'] = formatNumber(data[this.dataUnit + '_total_out'], "n");
    row['tot_out'] = formatNumber(data[this.dataUnit + '_total_out_t'], "n");
    row['cur_drop'] = formatNumber(data[this.dataUnit + '_total_drop'], "n");
    row['tot_drop'] = formatNumber(data[this.dataUnit + '_total_drop_t'], "n");

    this.gridData.push(row);

    var row = new Object();    
    row['protocol'] = 'TCP';
    row['cur_in'] = formatNumber(data[this.dataUnit + '_tcp_in'], "n");
    row['tot_in'] = formatNumber(data[this.dataUnit + '_tcp_in_t'], "n");
    row['cur_out'] = formatNumber(data[this.dataUnit + '_tcp_out'], "n");
    row['tot_out'] = formatNumber(data[this.dataUnit + '_tcp_out_t'], "n");
    row['cur_drop'] = formatNumber(data[this.dataUnit + '_tcp_drop'], "n");
    row['tot_drop'] = formatNumber(data[this.dataUnit + '_tcp_drop_t'], "n");
    
    this.gridData.push(row);

    var row = new Object();    
    row['protocol'] = 'UDP';
    row['cur_in'] = formatNumber(data[this.dataUnit + '_udp_in'], "n");
    row['tot_in'] = formatNumber(data[this.dataUnit + '_udp_in_t'], "n");
    row['cur_out'] = formatNumber(data[this.dataUnit + '_udp_out'], "n");
    row['tot_out'] = formatNumber(data[this.dataUnit + '_udp_out_t'], "n");
    row['cur_drop'] = formatNumber(data[this.dataUnit + '_udp_drop'], "n");
    row['tot_drop'] = formatNumber(data[this.dataUnit + '_udp_drop_t'], "n");
    
    this.gridData.push(row);

    var row = new Object();    
    row['protocol'] = 'ICMP';
    row['cur_in'] = formatNumber(data[this.dataUnit + '_icmp_in'], "n");
    row['tot_in'] = formatNumber(data[this.dataUnit + '_icmp_in_t'], "n");
    row['cur_out'] = formatNumber(data[this.dataUnit + '_icmp_out'], "n");
    row['tot_out'] = formatNumber(data[this.dataUnit + '_icmp_out_t'], "n");
    row['cur_drop'] = formatNumber(data[this.dataUnit + '_icmp_drop'], "n");
    row['tot_drop'] = formatNumber(data[this.dataUnit + '_icmp_drop_t'], "n");
    
    this.gridData.push(row);

    var row = new Object();    
    row['protocol'] = 'ETC';
    row['cur_in'] = formatNumber(data[this.dataUnit + '_etc_in'], "n");
    row['tot_in'] = formatNumber(data[this.dataUnit + '_etc_in_t'], "n");
    row['cur_out'] = formatNumber(data[this.dataUnit + '_etc_out'], "n");
    row['tot_out'] = formatNumber(data[this.dataUnit + '_etc_out_t'], "n");
    row['cur_drop'] = formatNumber(data[this.dataUnit + '_etc_drop'], "n");
    row['tot_drop'] = formatNumber(data[this.dataUnit + '_etc_drop_t'], "n");
    
    this.gridData.push(row);    
    
  }

  displayGridProtocolLink(jsonData: any[]) {
    jsonData.filter((data) => {
      return data.id == this.interfaceID;
    }).map((data, i) => {      
      this.displayGridProtocol(data);
    })
  }

  displayChartInterface(time:number, jsonData: any[]) {
    if (this.chart.series.length == 0) {
      jsonData.map((data, i) => {
        const series = this.chart.addSeries({
          name: data.name,
          marker: { enabled: false },
          stack: 0,
          lineColor: '#111',
          data: this.emptyData
        });
        this.chart.addSeries({
          name: data.name + '(Output)',
          marker: { enabled: false },
          color: series.color,
          showInLegend: false,
          stack: 1,
          lineColor: '#111',
          data: this.emptyData
        });
      });
      this.chart.addSeries({
          name: '차단',
          marker: { enabled: false },
          color: '#C0392B',          
          stack: 1,
          lineColor: '#111',
          data: this.emptyData
        });
    }

    this.chart.hideLoading();

    var val_drop = 0; 
    jsonData.map((data, i) => {
      const val_in = data[this.dataUnit + '_total_in'];
      const val_out = data[this.dataUnit + '_total_out'];
      val_drop += data[this.dataUnit + '_total_drop'];

      this.chart.series[i*2].addPoint([time, val_in], false, true);
      this.chart.series[i*2+1].addPoint([time, -val_out], false, true);      
    });
    this.chart.series[this.chart.series.length-1].addPoint([time, -val_drop], false, true)

    this.yAxisSetMinMax();

    this.chart.redraw(false);
  }

  displayGridInterface(jsonData: any[]) {
    this.gridData = [];

    jsonData.map((data, i) => {
      var row = new Object();
      row['byItem'] = data['name'];
      row['slotId'] = data['slotId'];
      row['portType'] = data['type'];
      row['cur_in'] = formatNumber(data[this.dataUnit + '_total_in'], "n");
      row['tot_in'] = formatNumber(data[this.dataUnit + '_total_in_t'], "n");
      row['cur_out'] = formatNumber(data[this.dataUnit + '_total_out'], "n");
      row['tot_out'] = formatNumber(data[this.dataUnit + '_total_out_t'], "n");
      row['cur_drop'] = formatNumber(data[this.dataUnit + '_total_drop'], "n");
      row['tot_drop'] = formatNumber(data[this.dataUnit + '_total_drop_t'], "n");

      this.gridData.push(row);
    });
  }

  private yAxisSetMinMax(redraw: boolean = false) {
    let max = this.chart.yAxis[0].dataMax;
    let min = this.chart.yAxis[0].dataMin;
    if (max < Math.abs(min)) max = Math.abs(min);

    this.chart.yAxis[0].setExtremes(-max, max, redraw);
  }
 
}
