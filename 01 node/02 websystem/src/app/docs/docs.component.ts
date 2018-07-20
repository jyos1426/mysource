// import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-docs',
  // providers: [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  jsonData: Object[] = [];
  constructor(private http: HttpClient, private _router: Router) { }

  ngOnInit() {
    this.http.get('/api/list').subscribe(data => {
      this.jsonData = data['apis'];

      this.jsonData.forEach((data, i) => {
        data['index'] = i;
        data['isShowHistory'] = false;
      })
    });
  }

  public getMajerList(): Object[] {
    let tmp: string[] = [];
    this.jsonData.forEach(data => {
      if (tmp.indexOf(data['major']) < 0) tmp.push(data['major']);
    });
    return tmp.map((major) => {
      let tmp2: Object[] = this.jsonData.filter(data => {
        return data['major'] == major;
      });
      let obj: Object = { 'name': major, 'count': tmp2.length };
      return obj;
    });
  }

  public getObjectKeysByName(restAPI: string, method: string, keyname: string): string[] {
    let apiObj: Object[] = this.jsonData.filter(v => {
      return (v['restAPI'] == restAPI) && (v['method'] == method);
    });
    
    return Object.keys(Object(apiObj[0][keyname]));
  }

  public isExistDependencies(apiObj: object, keyname: string): boolean {
    var res;
    if (apiObj.hasOwnProperty(keyname)) {
      let paramKeys = Object.keys(apiObj[keyname]);
      res = paramKeys.every((key)=>{        
        return !apiObj[keyname][key].hasOwnProperty('dependencies')
      });    
    } else {
      return false;
    }

    return !res;
  }

  public getParameterValues(apiObj: object): string {
    if (!apiObj['validators']) {
      return '';
    }
    const validators = apiObj['validators'];
    var value: string = '';
    validators.filter( (v) => {
      return v.valueType != 'function';
    }).map( (v) => {
      value += v.value + '<br>';
    })
    return value;
  }

  public getDependencyKeys(restAPI: string, paramKey: string, method: string, key: string): string[] {
    let apiObj: Object[] = this.jsonData.filter(v => {
      return (v['restAPI'] == restAPI) && (v['method'] == method);
    });

    return Object.keys(Object(apiObj[0][key][paramKey]['dependencies']));
  }


  public getSubUrl(subUrl: Object): string[] {
    return Object.keys(subUrl);
  }

  public getMethodClass(method: string): string {
    return 'value-method-' + method.toLowerCase();
  }

  public toggleHistory(index: number) {
    let filterData: Object[] = this.jsonData.filter((data) => {
      return data['index'] == index;
    });
    filterData[0]['isShowHistory'] = !filterData[0]['isShowHistory'];
  }

  public gotoHashtag(fragment: string) {
    let url = '';
    let urlWithSegments = this._router.url.split('#');

    if (urlWithSegments.length) {
      url = urlWithSegments[0];
    }

    window.location.hash = fragment;
    const element = document.querySelector("#" + fragment);
    if (element) element.scrollIntoView(element);
  }

  public getAnchorLink(restAPI: string): string {
    let url = restAPI;
    if (url.indexOf('{category_code}') > 0) {
      url = url.replace("{category_code}", "1");
    }
    return url;
  }

  public getRestApiTag(obj: Object): string {
    if (obj['method'] == 'GET')
      return "<a target='_blank' href=" + this.getAnchorLink(obj['restAPI']) + " title='Request this api'>" + obj['restAPI'] + "</a>";
    else
      return obj['restAPI'];
  }

  public print(): void {
    let  printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>SWF API Document</title>
          <style>     
              @page a4sheet { 
                size: 21.0cm 29.7cm 
              } 
              .a4 { 
                page: a4sheet; 
                margin-bottom: 70px;
              } 
  
              .print-hidden {
                display : none;
              }
  
              .data-history {
                display : none;
              }
  
              body {
                font-family: "Lato", "Lucida Grande", "Tahoma, sans-serif";
              }
                    
              .data-title {	
                margin-bottom: 5px;
                margin-right: 10px;
                font-weight: bold;
                font-size: 1.2em;
              }     
              
              .data-added-version {
                font-size: 0.8em;	
                margin-top: 0px;
                margin-bottom: 0px;
                display: inline-block;
              }
  
              .aside {
                font-size: 1.2em;
              }
  
              .aside ul {
                list-style: none;
                padding-left: 5px;
              }
  
              .aside li {
                margin-top: 10px;
              }
  
              .aside a {
                color: #ccc;
              }
  
              .param-box {
                border-collapse: collapse;
                border: 1px solid #bbb;
              }
              
              .param-box thead {
                background-color: #dddddd;
                font-weight: bold;
              }
              
              .param-box td {
                border: 1px solid #bbb;
                text-align: left;
                padding: 5px;
                font-size: 0.9em;
              }            
          </style>
        </head>
        <body onload="window.print(); window.close();">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
}
}
