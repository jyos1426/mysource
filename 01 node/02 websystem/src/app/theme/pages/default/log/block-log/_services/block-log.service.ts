import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
// import 'rxjs/add/operator/map';

@Injectable()
export class BlockLogService {

  constructor(private http: Http) {
  }

  public getBlockLogData(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/logs/block', getParams)
      .map((response: Response) => response.json());
  }
}
