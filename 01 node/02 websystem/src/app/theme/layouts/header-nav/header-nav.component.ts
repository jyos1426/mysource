import { Component, OnInit, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

import { HttpApiService } from '../../../_services/http-api.service';

declare let mLayout: any;
@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  encapsulation: ViewEncapsulation.None
})
export class HeaderNavComponent implements OnInit, OnDestroy, AfterViewInit {
  private clockSubscription: any;

  clock: string;
  userid: string;
  useridInitial: string;
  userAuthority: number;
  sessionExpireDate: any;

  timeoutSecond: number;
  remainingSecond: number;
  remainingRatio: string;
  remainingTime: string;
  remainingMsg: string;

  activeSessionStats: boolean;

  constructor(private _httpApiService: HttpApiService) {
    this.activeSessionStats = false;
    this.userid = '';
    this.userAuthority = 1;

    this.playClock();
    this.getLoginUserInfo();
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.clockSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    mLayout.initHeader();
  }

  private playClock() {
    this.clockSubscription = Observable.timer(0, 1000).subscribe((idx) => {
      const interval = 60;

      if (idx % interval === 0) {
        this._httpApiService.getServerDate().subscribe(
          (data) => {
            if (typeof data.infos !== 'undefined') {
              this.clock = moment(Number(data.infos.timestamp)).format('YYYY/MM/DD HH:mm:ss');
            } else {
              console.log('error');
            }
          },
          (error) => {
            console.log('error', error);
          }
        );
      } else {
        this.clock = moment(this.clock, 'YYYY/MM/DD HH:mm:ss').add(1, 's').format('YYYY/MM/DD HH:mm:ss');
      }
    });
  }

  private getLoginUserInfo() {
    this._httpApiService.getLoginUser().subscribe(
      (data) => {
        if (typeof data.infos !== 'undefined') {
          this.sessionExpireDate = data.infos.expireDate;

          const userInfo = data.datas[0];

          this.userid = userInfo.id;
          this.useridInitial = this.userid.substring(0, 2);
          this.userAuthority = userInfo.authority;
        } else {
          console.log('error');
        }
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  onUpdateRemainingSessionTime(e: any) {
    if (e.remainingSecond <= 120) {
      this.activeSessionStats = true;

      this.remainingSecond = e.remainingSecond;
      this.timeoutSecond = e.timeoutSecond;
      this.remainingTime = this.toMMSS(this.remainingSecond);
      const ratio = this.remainingSecond / this.timeoutSecond * 100;
      this.remainingRatio = ratio.toString() + '%';
      this.remainingMsg = `해당 로그인세션이 만료되기 까지 ${this.remainingTime} 남았습니다.`;
    } else if (this.activeSessionStats && e.remainingSecond > 120) {
      this.activeSessionStats = false;
    }
  }

  private toMMSS(second: number) {
    function pad(num: number, size: number) {
      let str = num.toString();
      while (str.length < size) {
        str = '0' + str;
      }
      return str;
    }

    const minutes = Math.floor(second / 60);
    const seconds = second - minutes * 60;
    const result = `${minutes}:${pad(seconds, 2)}`;

    return result;
  }
}
