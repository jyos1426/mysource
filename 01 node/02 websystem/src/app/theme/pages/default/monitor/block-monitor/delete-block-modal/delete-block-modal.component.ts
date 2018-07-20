import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Helpers } from './../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import { BlockMonitorService } from './../_services/block-monitor.service';

@Component({
  selector: 'app-delete-block-modal',
  templateUrl: './delete-block-modal.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DeleteBlockModalComponent implements OnInit, AfterViewInit {

  @Input() public ipv: number;
  @Input() public totalCount: number;
  @Input() public selectedRows: Array<any>;
  @Output() public complete: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('btnModalClose') public btnModalClose: ElementRef;

  public message = '';

  constructor(
    private _script: ScriptLoaderService,
    private _blockMonitorService: BlockMonitorService
  ) {
    this.message = '아래의 선택된 내용이 삭제됩니다. 삭제하시겠습니까?';

    this.init();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  public init() {
    // this.complete = false;
  }

  public deleteBlockPolicy(e: any) {
    if (this.selectedRows.length > 0) {
      if (this.selectedRows.length === this.totalCount && this.totalCount > 1) {
        const params = {
          ipv: this.ipv
        };
        this._blockMonitorService
          .deleteAllBlockPolicy(params)
          .subscribe(
          data => {
            console.log(data);
          },
          error => { }
          );
      } else {
        this.selectedRows.forEach((row, idx) => {
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
              console.log('success', data);
            },
            error => {
              console.error('error', error);
            },
            () => {
              if ((idx + 1) === this.selectedRows.length) {
                this.btnModalClose.nativeElement.click();
                this.complete.emit({ code: '000', message: 'success' });
              }
            }
            );
        });
      }
    }
  }

}
