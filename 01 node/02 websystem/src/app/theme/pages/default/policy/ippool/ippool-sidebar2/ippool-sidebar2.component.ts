import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { NgModel, NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'ippool-sidebar2',
  templateUrl: './ippool-sidebar2.component.html',
  styles: [`#noc-check-all { display: inline; float: right; }`],
  encapsulation: ViewEncapsulation.None
})

export class IppoolSidebar2Component implements OnInit {

  @ViewChild('btnDetailSidebarClose') public btnDetailSidebarClose: ElementRef;

  @ViewChild('objectAddForm') objectAddForm: NgForm;
  @ViewChild('objectUse') objectUse : ElementRef;
  @ViewChild('objectID') objectID : ElementRef;
  @ViewChild('objectName') objectName : ElementRef;
  @ViewChild('inboundTemplate') inboundTemplate : ElementRef;
  @ViewChild('outboundTemplate') outboundTemplate : ElementRef;
  @ViewChild('tabObjectAdd') tabObjectAdd : ElementRef;
  @ViewChild('tabNetworkAdd') tabNetworkAdd : ElementRef;
  @ViewChild('tabNOCAdd') tabNOCAdd : ElementRef;

  @ViewChild('nocSelect') nocSelect : any;

  @Output() public submitOK: EventEmitter<any> = new EventEmitter<any>();

  sidebarMode: string = 'object-add';

  templateDatas: any[] = [];
  groupDatas: any[] = [];
  groupData: any;
  objectData: any;
  errorCodes = ['min', 'max', 'required', 'pattern'];
  objectAddFormErrors: any[] = [];
  error_msg: string = '';
  error_detail: string = '';
  networkAddIPVerTab: number = 4;
  inputNetworkV4: string = '';
  inputNetworkV6: string = '';
  onSubmit: boolean = false;

  public toggleSelectNOC: boolean = false;
  public nocItems: Array<{ text: string, value: string }> = 
                  [{ text: 'IPS(패킷재조합)',  value: 'fragment' },
                   { text: 'IPS(패턴블럭)', value: 'patternblock' },
                   { text: 'IPS(WebCGI)', value: 'webcgi' },
                   { text: 'IPS(프로파일)', value: 'profile' },
                   { text: 'DNS(탐지/차단)', value: 'dns' },
                   { text: 'VoIP(탐지/차단)', value: 'voip' },
                   { text: 'HTTPS', value: 'https' },
                   { text: 'RegEx', value: 'regex' },
                   { text: 'RateLimit(Static)', value: 'static' },
                   { text: 'RateLimit(Dynamic)', value: 'dynamic' },
                   { text: 'DDoS(SSS엔진 TCP)', value: 'tcp' },
                   { text: 'DDoS(SSS엔진 UDP)', value: 'udp' },
                   { text: 'DDoS(패킷추출)', value: 'auto_sign' },
                   { text: 'Reputation', value: 'reputation' },
                   { text: 'Application', value: 'ar' },
                   { text: 'User', value: 'ur' },
                   { text: 'Malware', value: 'mr' }];
  public selectedNOC: any = [];
  public ipv4Count: number = 0;
  public ipv6Count: number = 0;

  public pageSize: number;
  public skip: number;
  public gridViewNetworkV4: GridDataResult;
  public gridViewNetworkV6: GridDataResult;
  public gridDataNetworkV4: any[] = [];
  public gridDataNetworkV6: any[] = [];
  

  public onClose(event: any) {
    event.preventDefault();
    setTimeout(() => {
      if(!this.nocSelect.wrapper.nativeElement.contains(document.activeElement)) {
        this.nocSelect.toggle(false);
      }
    })
  }

  constructor( private _script : ScriptLoaderService, private http: Http ) { 
    this.pageSize = 5;
    this.skip = 0;    
  }

  ngOnInit() {
    this.sidebarMode = 'object-add';

    this.initObjectAdd([], [], 100, 101);
  }

  ngAfterViewInit() {
    this._script.load( '.m-grid__item.m-grid__item--fluid.m-wrapper', 'assets/app/js/ippool-sidebar.js' );

    //객체추가 폼 옵저버 생성
    this.objectAddForm.statusChanges
    .filter((s) => s === 'INVALID')
    .switchMap(() => {
      this.objectAddFormErrors = [];
      return Observable.from(Object.keys(this.objectAddForm.controls));
    })
    .subscribe((controlName) => {
      this.errorCodes
      .filter((code) => this.objectAddForm.hasError(code, [controlName]))
      .forEach((code) => {
        const errorMsg = this.objectAddForm.getError(code, [controlName]);
        this.objectAddFormErrors.push({ controlName, code, errorMsg })
      });
    });

    this.objectAddForm.statusChanges.filter((s) => s === 'VALID').subscribe(() => this.objectAddFormErrors = []);
  }

  public toggleIPVer(ipver: number) {
    this.networkAddIPVerTab = ipver;
    this.pageSize = 5;
    this.skip = 0; 
    this.loadItems();
  }

  public loadItems(): void {
    if (this.networkAddIPVerTab == 4) {
      this.gridViewNetworkV4 = {
        data: (
          this.gridDataNetworkV4.slice(this.skip, this.skip + this.pageSize)
        ),
        total: this.gridDataNetworkV4.length
      }
      
      //테이블에 1개의 row만 있고 이를 삭제하였을때에는 이전 페이지가 표시되도록 한다.
      if ((this.gridViewNetworkV4.data.length == 0) && (this.skip >= this.pageSize)) {
        this.skip -= this.pageSize;
        this.pageChange({ skip: this.skip, take: this.pageSize });
      }
    } else {
      this.gridViewNetworkV6 = {
        data: (
          this.gridDataNetworkV6.slice(this.skip, this.skip + this.pageSize)
        ),
        total: this.gridDataNetworkV6.length
      }

      //테이블에 1개의 row만 있고 이를 삭제하였을때에는 이전 페이지가 표시되도록 한다.
      if ((this.gridViewNetworkV6.data.length == 0) && (this.skip >= this.pageSize)) {
        this.skip -= this.pageSize;
        this.pageChange({ skip: this.skip, take: this.pageSize });
      }
    }
  }

  public initObjectAdd( templateDatas: any[],
                        groupDatas: any[], 
                        selectedGroupID: number, 
                        nextObjectID: number) {
    
    this.sidebarMode = 'object-add';
    
    this.selectedNOC = [];
    this.toggleSelectNOC = false;
    
    this.templateDatas = templateDatas;
    this.groupDatas = groupDatas;

    this.objectData = { use: false,
                        g_id: selectedGroupID,
                        o_id: nextObjectID, 
                        o_name: undefined,
                        template_inbound: 65535,
                        template_outbound: 65535,
                        noc: {
                          ips: {
                            fragment: false,
                            patternblock: false,
                            webcgi: false,
                            profile: false
                          },
                          dns: false,
                          voip: false,
                          https: false,
                          regex: false,
                          ratelimit: {
                            static: false,
                            dynamic: false
                          },
                          ddos: {
                            tcp: false,
                            udp: false,
                            auto_sign: false
                          },
                          reputation: false,
                          ar: false,
                          ur: false,
                          mr: false
                        }
                      };
    this.error_msg = '';
    this.error_detail = '';

    this.gridDataNetworkV4 = [];
    this.gridDataNetworkV6 = [];
    this.loadItems();

    this.tabObjectAdd.nativeElement.click();
  }
  public initNetworkMod( templateData: any[], groupDatas: any[], objectData: any, option: any) {    
    this.initObjectMod(templateData, groupDatas, objectData, option);

    this.tabNetworkAdd.nativeElement.click();
  }

  public initObjectMod( templateDatas: any[], groupDatas: any[], objectData: any, option: any) {

     this.sidebarMode = 'object-mod';
     this.networkAddIPVerTab = option['ipver'] ? option['ipver'] : 4;
     this.toggleSelectNOC = false;

     this.objectData = new Object();

     this.objectData['use'] = objectData['enable'];
     this.objectData['g_id'] = objectData['g_id'];
     this.objectData['o_id'] = objectData['o_id'];
     this.objectData['o_name'] = objectData['o_name'];

     if (objectData.networkV4 || objectData.networkV6) {
       var networks = new Object();
       networks = new Object();
       if (objectData.networkV4) {
         networks['ipv4'] = [];
         objectData.networkV4.forEach((item) => {
           networks['ipv4'].push(`${item['network']}/${item['prefix']}`);
         })
       }
       if (objectData.networkV6) {
         networks['ipv6'] = [];
         objectData.networkV6.forEach((item) => {
           networks['ipv6'].push(`${item['network']}/${item['prefix']}`);
         })
       }
       this.objectData['networks'] = networks;
     }

     this.objectData['template_inbound'] = objectData['template_inbound_id'];
     this.objectData['template_outbound'] = objectData['template_outbound_id'];
     this.objectData['noc'] = objectData['noc'];

     this.selectedNOC = [];
     let nocKeys = Object.keys(objectData.noc);
     nocKeys.forEach((nKey) => {
       switch (nKey) {
         case 'ips': 
         case 'ratelimit': 
         case 'ddos': 
           let nocSubKeys = Object.keys(objectData.noc[nKey]);
           nocSubKeys.forEach((nSubKey) => {
             let val = objectData.noc[nKey][nSubKey];
             if (val) {
               var nocItem = this.nocItems.filter((item) => {
                 return item['value'] == nSubKey;
               });
               if (nocItem.length > 0) this.selectedNOC.push(nocItem[0]);
             }
           })
           break;
         default: 
           let val = objectData.noc[nKey];
           if (val) {
             var nocItem = this.nocItems.filter((item) => {
                 return item['value'] == nKey;
             });
             if (nocItem.length > 0) this.selectedNOC.push(nocItem[0]);
           }
       }
     });

     this.templateDatas = templateDatas;
     this.groupDatas = groupDatas;

     this.error_msg = '';
     this.error_detail = '';

     this.gridDataNetworkV4 = [];
     this.gridDataNetworkV6 = [];

     objectData.networkV4.forEach((item) => {
       this.gridDataNetworkV4.push({
         network: item['network'],
         prefix: item['prefix'],
         desc: item['desc']
       });
     });
     objectData.networkV6.forEach((item) => {
       this.gridDataNetworkV6.push({
         network: item['network'],
         prefix: item['prefix'],
         desc: item['desc']
       });
     });
     
     this.loadItems();
     
     if (this.objectData['g_id'] == 65535 || this.objectData['g_id'] == 9900)
       this.tabNOCAdd.nativeElement.click();
     else
       this.tabObjectAdd.nativeElement.click();
   }

  private addObject(objectDatas: any[]) {
    return this.http
        .post('/api/policy/ippool/objects', objectDatas)
        .map((response: Response) => response.json());
  }

  private modObject(objectDatas: any[]) {
    return this.http
        .patch('/api/policy/ippool/objects', objectDatas)
        .map((response: Response) => response.json());
  }

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public onSubmitHandler() {
    switch (this.sidebarMode) {
      case 'object-add':
        this.onSubmitObjectAdd();
        break;
      case 'object-mod':
        this.onSubmitObjectMod();
        break;
    }
  }

  private onSubmitObjectAdd() {
    this.onSubmit = true;

    this.objectData.use = this.objectData.use ? 1 : 0;

    this.objectData.template_inbound = this.inboundTemplate.nativeElement.value;
    this.objectData.template_outbound = this.outboundTemplate.nativeElement.value;

    this.objectData.noc.ips.fragment = false;
    this.objectData.noc.ips.patternblock = false;
    this.objectData.noc.ips.webcgi = false;
    this.objectData.noc.ips.profile = false;
    this.objectData.noc.dns = false;
    this.objectData.noc.voip = false;
    this.objectData.noc.https = false;
    this.objectData.noc.regex = false;
    this.objectData.noc.ratelimit.static = false;
    this.objectData.noc.ratelimit.dynamic = false;
    this.objectData.noc.ddos.tcp = false;
    this.objectData.noc.ddos.udp = false;
    this.objectData.noc.ddos.auto_sign = false;
    this.objectData.noc.ur = false;
    this.objectData.noc.ar = false;
    this.objectData.noc.mr = false;
    this.objectData.noc.reputation = false;

    if ((this.gridDataNetworkV4.length > 0) || (this.gridDataNetworkV6.length > 0)) {
      var networks = new Object();

      if (this.gridDataNetworkV4.length > 0) {
        networks['ipv4'] = [];

        this.gridDataNetworkV4.forEach((data)=>{
          networks['ipv4'].push(`${data['network']}/${data['prefix']}`);
        });
      }

      if (this.gridDataNetworkV6.length > 0) {
        networks['ipv6'] = [];

        this.gridDataNetworkV6.forEach((data)=>{
        networks['ipv6'].push(`${data['network']}/${data['prefix']}`);
        });
      }

      this.objectData['networks'] = networks;
    }

    this.selectedNOC.forEach((item)=> {
      switch(item.value) {
        case 'fragment':     this.objectData.noc.ips.fragment = true; break;
        case 'patternblock':  this.objectData.noc.ips.patternblock = true; break;
        case 'webcgi':        this.objectData.noc.ips.webcgi = true; break;
        case 'profile':       this.objectData.noc.ips.profile = true; break;
        case 'profile':       this.objectData.noc.ips.profile = true; break;
        case 'dns':           this.objectData.noc.dns = true; break;
        case 'voip':          this.objectData.noc.voip = true; break;
        case 'https':         this.objectData.noc.https = true; break;
        case 'regex':         this.objectData.noc.regex = true; break;
        case 'static':        this.objectData.noc.ratelimit.static = true; break;
        case 'dynamic':       this.objectData.noc.ratelimit.dynamic = true; break;
        case 'tcp':       this.objectData.noc.ddos.tcp = true; break;
        case 'udp':       this.objectData.noc.ddos.udp = true; break;
        case 'auto_sign':   this.objectData.noc.ddos.auto_sign = true; break;
        case 'ur':               this.objectData.noc.ur = true; break;
        case 'ar':               this.objectData.noc.ar = true; break;
        case 'mr':               this.objectData.noc.mr = true; break;
        case 'reputation':       this.objectData.noc.reputation = true; break;
      }
    });

    this.error_msg = '';
    if (!this.objectAddForm.form.valid) {
      this.tabObjectAdd.nativeElement.click();
      switch (this.objectAddFormErrors[0].controlName) {
        case 'object-id': this.objectID.nativeElement.focus(); break;
        case 'object-name': this.objectName.nativeElement.focus(); break;
      }
      this.error_msg = this.objectAddFormErrors[0].errorMsg;
      this.onSubmit = false;
      return;
    }

    this.addObject([this.objectData]).subscribe(
      data => {
        this.onSubmit = false;

        this.btnDetailSidebarClose.nativeElement.click();
        this.submitOK.emit();
      },
      error => {
        this.onSubmit = false;

        this.error_msg = '객체 추가에 실패하였습니다.';
        this.error_detail = JSON.parse(error['_body'])['detail'];
        this.objectID.nativeElement.focus();
      }
    );
  }

  private clone(obj: any): any {
    if (obj === null || typeof(obj) !== 'object') return obj;
    var copy = new Object();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  }

  private onSubmitObjectMod() {

    this.onSubmit = true;

    this.objectData.use = this.objectData.use ? 1 : 0;
    this.objectData.template_inbound = this.inboundTemplate.nativeElement.value;
    this.objectData.template_outbound = this.outboundTemplate.nativeElement.value;

    this.objectData.noc.ips.fragment = false;
    this.objectData.noc.ips.patternblock = false;
    this.objectData.noc.ips.webcgi = false;
    this.objectData.noc.ips.profile = false;
    this.objectData.noc.dns = false;
    this.objectData.noc.voip = false;
    this.objectData.noc.https = false;
    this.objectData.noc.regex = false;
    this.objectData.noc.ratelimit.static = false;
    this.objectData.noc.ratelimit.dynamic = false;
    this.objectData.noc.ddos.tcp = false;
    this.objectData.noc.ddos.udp = false;
    this.objectData.noc.ddos.auto_sign = false;
    this.objectData.noc.ur = false;
    this.objectData.noc.ar = false;
    this.objectData.noc.mr = false;
    this.objectData.noc.reputation = false;
    
    var networks = new Object();
    networks['ipv4'] = [];
    this.gridDataNetworkV4.forEach((data)=>{
      networks['ipv4'].push(`${data['network']}/${data['prefix']}`);
    });
    
    networks['ipv6'] = [];
    this.gridDataNetworkV6.forEach((data)=>{
    networks['ipv6'].push(`${data['network']}/${data['prefix']}`);
    });

    this.objectData['networks'] = networks;
    
    this.selectedNOC.forEach((item)=> {
      switch(item.value) {
        case 'fragment':     this.objectData.noc.ips.fragment = true; break;
        case 'patternblock':  this.objectData.noc.ips.patternblock = true; break;
        case 'webcgi':        this.objectData.noc.ips.webcgi = true; break;
        case 'profile':       this.objectData.noc.ips.profile = true; break;
        case 'profile':       this.objectData.noc.ips.profile = true; break;
        case 'dns':           this.objectData.noc.dns = true; break;
        case 'voip':          this.objectData.noc.voip = true; break;
        case 'https':         this.objectData.noc.https = true; break;
        case 'regex':         this.objectData.noc.regex = true; break;
        case 'static':        this.objectData.noc.ratelimit.static = true; break;
        case 'dynamic':       this.objectData.noc.ratelimit.dynamic = true; break;
        case 'tcp':       this.objectData.noc.ddos.tcp = true; break;
        case 'udp':       this.objectData.noc.ddos.udp = true; break;
        case 'auto_sign':   this.objectData.noc.ddos.auto_sign = true; break;
        case 'ur':               this.objectData.noc.ur = true; break;
        case 'ar':               this.objectData.noc.ar = true; break;
        case 'mr':               this.objectData.noc.mr = true; break;
        case 'reputation':       this.objectData.noc.reputation = true; break;
      }
    });

    this.error_msg = '';
    if (!this.objectAddForm.form.valid) {
      this.tabObjectAdd.nativeElement.click();
      switch (this.objectAddFormErrors[0].controlName) {
        case 'object-id': this.objectID.nativeElement.focus(); break;
        case 'object-name': this.objectName.nativeElement.focus(); break;
      }
      this.error_msg = this.objectAddFormErrors[0].errorMsg;
      this.onSubmit = false;
      return;
    }

    //delete this.objectData['g_id'];
    //api에서 지원하지 않는 g_id를 삭제하면 two-way binding을 통해 UI에 반영되므로 객체를 COPY하여 사용한다.
    var modObjectData = this.clone(this.objectData);
    delete modObjectData['g_id'];

    this.modObject([modObjectData]).subscribe(
      data => {
        this.onSubmit = false;

        this.btnDetailSidebarClose.nativeElement.click();
        this.submitOK.emit();
      },
      error => {
        this.onSubmit = false;

        this.error_msg = '객체 수정에 실패하였습니다.';
        this.error_detail = JSON.parse(error['_body'])['detail'];
        this.objectID.nativeElement.focus();
      }
    );
  }

  public closePopup(e: any) {
    this.btnDetailSidebarClose.nativeElement.click();
  }

  public getInboundTemplateData(): any[] {
    return this.templateDatas.filter((data) => {
      return (data['flow'] == 0 || (data['flow'] == -1));
    });
  }

  public getOutboundTemplateData(): any[] {
    return this.templateDatas.filter((data) => {
      return (data['flow'] == 1 || (data['flow'] == -1));
    });
  }

  public selectNOCAll(e: any) {
    this.selectedNOC = [];

    if (!this.toggleSelectNOC) {
      this.nocItems.forEach((item) => {
        this.selectedNOC.push(item);
      })
    }
  }

  public addHandler(e: any) {
    if (this.networkAddIPVerTab == 4) {
      var value = this.inputNetworkV4;
    } else {
      var value = this.inputNetworkV6;
    }
    
    var ip = value.split('/')[0];
    var prefix = value.split('/')[1];

    if (this.networkAddIPVerTab == 4) {
      if (!prefix) prefix = '32';
      this.inputNetworkV4 = '';
    } else {
      if (!prefix) prefix = '128';
      this.inputNetworkV6 = '';
    }
    
    this.error_msg = '';

    //중복체크
    if (ip && prefix) {

      if (this.networkAddIPVerTab == 4) {
        var result = this.gridDataNetworkV4.every((data) => {
          return !((data.network == ip) && (data.prefix == prefix));
        });
      } else {
        var result = this.gridDataNetworkV6.every((data) => {
          return !((data.network == ip) && (data.prefix == prefix));
        });
      }

      if (result) {
        if (this.networkAddIPVerTab == 4) {
          this.gridDataNetworkV4.push({
          'network': ip,
          'prefix': prefix,
          'desc': ''});
        } else {
          this.gridDataNetworkV6.push({
          'network': ip,
          'prefix': prefix,
          'desc': ''});
        }
        this.loadItems();
        return;
      }
    } 
    this.error_msg = '이미 존재하거나 잘못된 형식입니다.';
  }

  public delNetwork(dataItem: any, ipv: number) {
    if (ipv == 4) {
      this.gridDataNetworkV4.splice(this.gridDataNetworkV4.indexOf(dataItem), 1);
    } else {
      this.gridDataNetworkV6.splice(this.gridDataNetworkV6.indexOf(dataItem), 1);
    }
    this.loadItems();
  }

  public onNetworkInputChange(e: any) {
    if (e.key == 'Enter') {
      e.preventDefault();
      this.addHandler(e);
    }
  }

  public isHiddenTab(): boolean {
    if (this.sidebarMode == 'object-mod' && this.objectData) {
      return (this.objectData['g_id'] == 65535) || (this.objectData['g_id'] == 9900);
    } else {
      return false;
    }
  }
}
