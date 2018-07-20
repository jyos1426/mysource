import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  ElementRef
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';

import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

import { Helpers } from './../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { BlockMonitorService } from './../_services/block-monitor.service';

import {
  protocols,
  icmpTypes,
  icmpV6Types,
  icmpNoCode,
  icmpCodesDestinationUnreachable,
  icmpCodesRedirect,
  icmpCodesAlternateHostAddress,
  icmpCodesRouterAdvertisement,
  icmpCodesTimeExceeded,
  icmpCodesTimestamp,
  icmpCodesPhoturi,
  icmpV6CodesDetinationUnreachable,
  icmpV6CodesTimeExceeded,
  icmpV6CodesParameterProblem,
  icmpV6CodesRouterRenumbering,
  icmpV6CodesICMPNodeInformationQuery,
  icmpV6CodesICMPNodeInformationResponse
} from '../../../../../../common/subcodes';

interface Item {
  text: string;
  value: number;
}

@Component({
  selector: 'app-add-block-modal',
  templateUrl: './add-block-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddBlockModalComponent implements OnInit, AfterViewInit {
  @Input() public ipv: number;
  @ViewChild('ddlProtocol2') public ddlProtocol2: DropDownListComponent;
  @ViewChild('btnModalClose') public btnModalClose: ElementRef;

  private protocols: Array<Item>;
  private icmpTypes: Array<Item>;
  private icmpV6Types: Array<Item>;
  private icmpNoCode: Array<Item>;
  private icmpCodesDestinationUnreachable: Array<Item>;
  private icmpCodesRedirect: Array<Item>;
  private icmpCodesAlternateHostAddress: Array<Item>;
  private icmpCodesRouterAdvertisement: Array<Item>;
  private icmpCodesTimeExceeded: Array<Item>;
  private icmpCodesTimestamp: Array<Item>;
  private icmpCodesPhoturi: Array<Item>;
  private icmpV6CodesDetinationUnreachable: Array<Item>;
  private icmpV6CodesTimeExceeded: Array<Item>;
  private icmpV6CodesParameterProblem: Array<Item>;
  private icmpV6CodesRouterRenumbering: Array<Item>;
  private icmpV6CodesICMPNodeInformationQuery: Array<Item>;
  private icmpV6CodesICMPNodeInformationResponse: Array<Item>;
  private blockModeListData: Array<Item>;

  public activeHackerIP: boolean;
  public activeVictimIP: boolean;
  public activeProtocol: boolean;
  public activeIcmp: boolean;
  public activePort: boolean;
  public emptyProtocol: boolean;

  public blockModeListItems: Array<Item>;
  public selectedBlockMode: Item;

  public limitTime: number;
  public port: number;
  public icmpResult: number;

  public protocolListItems: Array<Item>;
  public selectedProtocol: Item;

  public icmpTypeListItems: Array<Item>;
  public selectedICMPType: Item;

  public icmpCodeListItems: Array<Item>;
  public selectedICMPCode: Item;

  public hip: string;
  public vip: string;

  constructor(
    private _script: ScriptLoaderService,
    private _blockMonitorService: BlockMonitorService
  ) {
    this.protocols = protocols;
    this.icmpTypes = icmpTypes;
    this.icmpV6Types = icmpV6Types;
    this.icmpNoCode = icmpNoCode;
    this.icmpCodesDestinationUnreachable = icmpCodesDestinationUnreachable;
    this.icmpCodesRedirect = icmpCodesRedirect;
    this.icmpCodesAlternateHostAddress = icmpCodesAlternateHostAddress;
    this.icmpCodesRouterAdvertisement = icmpCodesRouterAdvertisement;
    this.icmpCodesTimeExceeded = icmpCodesTimeExceeded;
    this.icmpCodesTimestamp = icmpCodesTimestamp;
    this.icmpCodesPhoturi = icmpCodesPhoturi;
    this.icmpV6CodesDetinationUnreachable = icmpV6CodesDetinationUnreachable;
    this.icmpV6CodesTimeExceeded = icmpV6CodesTimeExceeded;
    this.icmpV6CodesParameterProblem = icmpV6CodesParameterProblem;
    this.icmpV6CodesRouterRenumbering = icmpV6CodesRouterRenumbering;
    this.icmpV6CodesICMPNodeInformationQuery = icmpV6CodesICMPNodeInformationQuery;
    this.icmpV6CodesICMPNodeInformationResponse = icmpV6CodesICMPNodeInformationResponse;
    this.blockModeListData = [
      { value: 1, text: 'SN_SRC_IP' },
      { value: 2, text: 'SN_DST_IP' },
      { value: 8, text: 'SN_AND_IP' },
      { value: 256, text: 'SN_SRC_SERV' },
      { value: 512, text: 'SN_DST_SERV' }
    ];

    this.init();
  }

  ngOnInit() {
    // this.ddlProtocol.toggle(true);
  }

  ngAfterViewInit() {
    // this._script.load( 'app-block-monitor-modal', 'assets/app/js/block-monitor-modal.js' );
  }

  public init() {
    this.activeHackerIP = true;
    this.activeVictimIP = false;
    this.activeProtocol = false;
    this.activeIcmp = false;
    this.activePort = false;

    this.blockModeListItems = this.blockModeListData;
    this.selectedBlockMode = this.blockModeListItems[0];

    this.limitTime = 60;

    this.hip = null;
    this.vip = null;

    this.emptyProtocol = false;
    this.protocolListItems = this.protocols;
    this.selectedProtocol = this.protocolListItems[0];

    this.port = 0;
    this.icmpResult = 0;
  }

  public changeBlockMode(item: Item) {
    this.selectedBlockMode = item;

    let mode = this.selectedBlockMode.value;

    switch (mode) {
      // SN_SRC_IP
      case 1:
        this.activeHackerIP = true;
        this.activeVictimIP = false;
        this.activeProtocol = false;
        break;
      // SN_DST_IP
      case 2:
        this.activeHackerIP = false;
        this.activeVictimIP = true;
        this.activeProtocol = false;
        break;
      // SN_AND_IP
      case 8:
        this.activeHackerIP = true;
        this.activeVictimIP = true;
        this.activeProtocol = false;
        break;
      // SN_SRC_SERV
      case 256:
        this.activeHackerIP = true;
        this.activeVictimIP = false;
        this.activeProtocol = true;
        break;
      // SN_DST_SERV
      case 512:
        this.activeHackerIP = false;
        this.activeVictimIP = true;
        this.activeProtocol = true;
        break;
    }
    // this.changeProtocol();
  }

  public changeProtocol(item: Item) {
    // console.log('[VALUE:before]', 'this.selectedProtocol', this.selectedProtocol);
    // console.log('[VALUE]', 'this.protocolListItems', this.protocolListItems);

    // if (typeof item === 'undefined') {
    //   this.protocolListItems = this.protocols;
    //   this.selectedProtocol = this.protocolListItems[0];
    // } else {
    //   this.selectedProtocol = item;
    // }
    // this.ddlProtocol2.value = this.selectedProtocol;
    // this.ddlProtocol2.defaultItem = this.selectedProtocol;
    // console.log('[VALUE:after]', 'this.selectedProtocol', this.selectedProtocol);
    // console.log('[VALUE]', 'this.ddlProtocol2', this.ddlProtocol2);

    this.selectedProtocol = item;

    // if (typeof item === 'undefined') {
    //   // this.protocolListItems = this.protocols;
    //   // this.selectedProtocol = this.protocolListItems[0];
    //   this.emptyProtocol = true;
    // } else {
    //   // this.selectedProtocol = item;
    //   this.emptyProtocol = false;
    // }
    // this.selectedProtocol = item;

    let protocol = this.selectedProtocol.value;

    switch (protocol) {
      // ICMP
      case 1:
        this.activeIcmp = true;
        this.activePort = false;

        this.icmpTypeListItems = this.icmpTypes;
        this.selectedICMPType = this.icmpTypeListItems[0];

        this.icmpCodeListItems = this.icmpNoCode;
        this.selectedICMPCode = this.icmpNoCode[0];
        break;

      // TCP
      case 6:
        this.activeIcmp = false;
        this.activePort = true;
        break;

      // UDP
      case 17:
        this.activeIcmp = false;
        this.activePort = true;
        break;

      // IPv6-ICMP
      case 58:
        this.activeIcmp = true;
        this.activePort = false;

        this.icmpTypeListItems = this.icmpV6Types;
        this.selectedICMPType = this.icmpTypeListItems[0];

        this.icmpCodeListItems = this.icmpV6CodesDetinationUnreachable;
        this.selectedICMPCode = this.icmpNoCode[0];
        break;
      default:
        this.activeIcmp = false;
        this.activePort = false;
    }

    // this.changeICMPType();
  }

  public testCheckEmptyProtocol() {
    console.log('[BLUR]', 'this.selectedProtocol', this.selectedProtocol);
    this.protocolListItems = this.protocols;
    // console.log('[BLUR]', 'this.protocolListItems', this.protocolListItems);
    // if (this.emptyProtocol) {
    //   this.protocolListItems = this.protocols;
    //   this.selectedProtocol = this.protocolListItems[0];
    //   this.ddlProtocol2.reset();
    // }
  }

  public filterProtocol(filter: any) {
    console.log('[FILTER]', 'this.selectedProtocol', this.selectedProtocol);
    // console.log('[FILTER]', 'this.protocolListItems', this.protocolListItems);
    this.protocolListItems = this.protocols.filter(
      row =>
        JSON.stringify(row)
          .toLowerCase()
          .indexOf(filter.toLowerCase()) !== -1
    );
  }

  // public checkEmptyProtocol(event: any) {
  //   // this.protocolListItems = this.protocols;
  // }

  public closeProtocol() {
    console.log('[CLOSE]', 'this.selectedProtocol', this.selectedProtocol);
    // console.log('[CLOSE]', 'this.protocolListItems', this.protocolListItems);
    this.protocolListItems = this.protocols;
  }

  public openProtocol() {
    console.log('[OPEN]', 'this.selectedProtocol', this.selectedProtocol);
    // console.log('[OPEN]', 'this.protocolListItems', this.protocolListItems);
  }

  public checkEmptyProtocol(item: any) {
    console.log('[SELECT]', 'this.selectedProtocol', this.selectedProtocol);
    // console.log('[SELECT]', 'this.protocolListItems', this.protocolListItems);

    // if (typeof item === 'undefined') {
    //   this.protocolListItems = this.protocols;
    //   this.selectedProtocol = this.protocolListItems[0];
    // }
    // if ( typeof item === 'undefined' ) {
    //   // console.log('Undefined');
    //   this.emptyProtocol = true;
    //   this.protocolListItems = this.protocols;
    //   this.selectedProtocol = this.protocols[0];
    //   this.ddlProtocol.reset();
    //   // console.log(this.protocolListItems, this.selectedProtocol);
    // } else {
    //   this.selectedProtocol = item;
    // }
  }

  public changeICMPType(item: any) {
    this.selectedICMPType = item;

    let protocol = this.selectedProtocol.value;
    let icmpType = this.selectedICMPType.value;

    console.log('changeICMPType', protocol, icmpType, this.selectedICMPType);

    if (protocol === 1) {
      // ICMP

      switch (icmpType) {
        // Destination Unreachable
        case 3:
          this.icmpCodeListItems = this.icmpCodesDestinationUnreachable;
          break;
        // Redirect
        case 5:
          this.icmpCodeListItems = this.icmpCodesRedirect;
          break;
        // Alternate Host Address
        case 6:
          this.icmpCodeListItems = this.icmpCodesAlternateHostAddress;
          break;
        // Router Advertisement
        case 9:
          this.icmpCodeListItems = this.icmpCodesRouterAdvertisement;
          break;
        // Time Exceeded
        case 11:
          this.icmpCodeListItems = this.icmpCodesTimeExceeded;
          break;
        // Timestamp
        case 13:
          this.icmpCodeListItems = this.icmpCodesTimestamp;
          break;
        // Photuri
        case 40:
          this.icmpCodeListItems = this.icmpCodesPhoturi;
          break;
        // No Code
        default:
          this.icmpCodeListItems = this.icmpNoCode;
          break;
      }
    } else if (protocol === 58) {
      // IPv6-ICMP

      switch (icmpType) {
        // Destination Unreachable
        case 1:
          this.icmpCodeListItems = this.icmpV6CodesDetinationUnreachable;
          break;
        // Time Exceeded
        case 3:
          this.icmpCodeListItems = this.icmpV6CodesTimeExceeded;
          break;
        // Parameter Problem
        case 4:
          this.icmpCodeListItems = this.icmpV6CodesParameterProblem;
          break;
        // Router Renumbering
        case 138:
          this.icmpCodeListItems = this.icmpV6CodesRouterRenumbering;
          break;
        // ICMP Node Information Query
        case 139:
          this.icmpCodeListItems = this.icmpV6CodesICMPNodeInformationQuery;
          break;
        // ICMP Node Information Response
        case 140:
          this.icmpCodeListItems = this.icmpV6CodesICMPNodeInformationResponse;
          break;
        // No Code
        default:
          this.icmpCodeListItems = this.icmpNoCode;
          break;
      }
    }

    this.selectedICMPCode = this.icmpCodeListItems[0];
  }

  // public changeICMPCode(value: any = 0) {
  //   this.selectedICMPCode = Number(code);
  // }

  // public parseCommaText(codes: string) {
  //   return JSON.stringify(codes.split(',').map(function(item, index, array) {
  //     const temp = item.split('=');
  //     return { value: temp[1], value: temp[0] };
  //   }));
  // }

  public addBlockPolicy() {
    let method = this.selectedBlockMode.value;
    let protocol = this.selectedProtocol.value;
    let params;

    switch (method) {
      // SN_SRC_IP
      case 1:
        if (
          typeof this.hip === 'undefined' ||
          this.hip.toString().length <= 0
        ) {
          return false;
        }

        params = {
          ipv: this.ipv,
          method: method,
          limit_time: this.limitTime,
          hip: this.hip
        };
        break;

      // SN_DST_IP
      case 2:
        if (
          typeof this.vip === 'undefined' ||
          this.vip.toString().length <= 0
        ) {
          return false;
        }

        params = {
          ipv: this.ipv,
          method: method,
          limit_time: this.limitTime,
          vip: this.vip
        };
        break;

      // SN_AND_IP
      case 8:
        if (
          typeof this.hip === 'undefined' ||
          this.hip.toString().length <= 0
        ) {
          return false;
        }
        if (
          typeof this.vip === 'undefined' ||
          this.vip.toString().length <= 0
        ) {
          return false;
        }

        params = {
          ipv: this.ipv,
          method: method,
          limit_time: this.limitTime,
          hip: this.hip,
          vip: this.vip
        };
        break;

      // SN_SRC_SERV
      case 256:
        if (
          typeof this.hip === 'undefined' ||
          this.hip.toString().length <= 0
        ) {
          return false;
        }

        params = {
          ipv: this.ipv,
          method: method,
          limit_time: this.limitTime,
          protocol: protocol,
          hip: this.hip
        };

        if (protocol === 1 || protocol === 58) {
          // 1: ICMP, 58: IPv6-ICMP
          params.port = this.icmpResult;
        } else if (protocol === 6 || protocol === 17) {
          // 6: TCP, 17: UDP
          params.port = this.port;
        }
        break;

      // SN_DST_SERV
      case 512:
        if (
          typeof this.vip === 'undefined' ||
          this.vip.toString().length <= 0
        ) {
          return false;
        }

        params = {
          ipv: this.ipv,
          method: method,
          limit_time: this.limitTime,
          protocol: protocol,
          vip: this.vip
        };

        if (protocol === 1 || protocol === 58) {
          // 1: ICMP, 58: IPv6-ICMP
          params.port = this.icmpResult;
        } else if (protocol === 6 || protocol === 17) {
          // 6: TCP, 17: UDP
          params.port = this.port;
        }
        break;
    }

    console.log(params);

    this._blockMonitorService.addBlockPolicy(params).subscribe(
      data => {
        console.log('success', data);
        this.btnModalClose.nativeElement.click();
      },
      error => {
        console.error('error', error);
      }
    );
  }

  private convertNumber(num, from, to, pad = 0) {
    return parseInt(num, from)
      .toString(to)
      .padStart(pad, '0');
  }

  public getICMPResultNumber(event: any) {
    const binIcmpType = this.selectedICMPType.value.toString(2).padStart(8, '0');
    const binIcmpCode = this.selectedICMPCode.value.toString(2).padStart(8, '0');
    const binIcmpResult = binIcmpType + binIcmpCode;

    this.icmpResult = Number(this.convertNumber(binIcmpResult, 2, 10));
  }

  // public renderMonitorBlock() {
  //   this.loadData = true;
  //   this.getMonitorBlockData().subscribe(
  //     data => {
  //       if (typeof data === 'undefined') {
  //         this.gridData = [];
  //       } else {
  //         this.viewCount = data.header['view-count'];
  //         this.allCount = data.header['all-count'];
  //         this.parseGridData(data.datas);
  //       }
  //     },
  //     error => {
  //       this.gridData = [];
  //     }
  //   );
  // }
}
