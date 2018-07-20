import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { Helpers } from '../../../helpers';
import { Observable, Subject } from 'rxjs/Rx';
import * as moment from 'moment';

import { HttpApiService } from '../../../_services/http-api.service';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SessionTimeoutComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('btnShow') btnShow: ElementRef;
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnExtend') btnExtend: ElementRef;
  @ViewChild('modal') modal: ElementRef;
  @Output() update = new EventEmitter<any>();

  remainingSecond: number;
  progress: any;
  private subscription: any;

  private TIMEOUT_SECOND = 600;
  private POPUP_SECOND = 60;

  constructor(private _httpApiService: HttpApiService, private _router: Router) {
    this.initTimer();

    this.subscription = Observable.timer(0, 1000).subscribe((idx) => {
      this.remainingSecond--;

      if (this.remainingSecond === this.POPUP_SECOND) {
        if (this.modal.nativeElement.className.search('show') === -1) {
          this.btnShow.nativeElement.click(); // show modal
        }
      }

      if (this.remainingSecond <= this.POPUP_SECOND) {
        const ratio = this.remainingSecond / this.POPUP_SECOND * 100;
        this.progress = ratio.toFixed(2) + '%';
      }

      if (this.remainingSecond === 0) {
        this.clearTimer();
      }

      this.update.emit({
        remainingSecond: this.remainingSecond,
        timeoutSecond: this.TIMEOUT_SECOND
      });
    });
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngAfterViewInit() {}

  @HostListener('document:mousedown', [ '$event' ])
  documentMouseDown(e: any) {
    this.detectMotion(e);
  }
  @HostListener('document:mousemove', [ '$event' ])
  documentMouseMove(e: any) {
    this.detectMotion(e);
  }
  @HostListener('document:keydown', [ '$event' ])
  documentKeyDown(e: any) {
    this.detectMotion(e);
  }

  private initTimer() {
    this.remainingSecond = this.TIMEOUT_SECOND;
    this.progress = '100%';
  }

  private detectMotion(e: any) {
    this.initTimer();
  }

  private clearTimer() {
    this.subscription.unsubscribe();
    if (this.modal.nativeElement.className.search('show') !== -1) {
      this.btnClose.nativeElement.click(); // close
    }
    this._router.navigate([ '/logout' ]);
  }

  onClickSessionExtention(e: any) {
    this.initTimer();
  }

  onClickLogout(e: any) {
    this.clearTimer();
  }
}
