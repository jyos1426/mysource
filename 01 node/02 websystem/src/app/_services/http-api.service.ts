import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { forkJoin } from 'rxjs/observable/forkJoin';
// import 'rxjs/add/operator/map';

@Injectable()
export class HttpApiService {

  constructor(private http: Http) {
  }

  // 서버 시간
  getServerDate() {
    return this.http.get('/api/info/time').map((response: Response) => response.json());
  }

  // 로그인 유저 정보
  getLoginUser() {
    return this.http.get('/api/info/user').map((response: Response) => response.json());
  }

}
