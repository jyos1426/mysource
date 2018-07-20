import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
// import 'rxjs/add/operator/map';

@Injectable()
export class BlockMonitorService {

  constructor(private http: Http) {
  }

  public getBlockMonitorData(params: object) {
    let getParams = {
      params: params
    }
    return this.http
      .get('/api/monitor/block', getParams)
      .map((response: Response) => response.json());
  }

  public addBlockPolicy(params: object) {
    let urlParams = new URLSearchParams();

    for (let param in params) {
      if (params.hasOwnProperty(param)) {
        urlParams.set(param, params[param]);
      }
    }

    return (
      this.http
        .post('/api/monitor/block' + '?' + urlParams.toString(), {})
        .map(response => response.json())
    );
  }

  public deleteBlockPolicy(params: object) {
    let urlParams = new URLSearchParams();

    for (let param in params) {
      if (params.hasOwnProperty(param)) {
        urlParams.set(param, params[param]);
      }
    }

    return (
      this.http
        .delete('/api/monitor/block' + '?' + urlParams.toString(), {})
        .map(response => response.json())
    );
  }

  public deleteAllBlockPolicy(params: object) {
    let urlParams = new URLSearchParams();

    for (let param in params) {
      if (params.hasOwnProperty(param)) {
        urlParams.set(param, params[param]);
      }
    }

    return (
      this.http
        .delete('/api/monitor/block/all' + '?' + urlParams.toString(), {})
        .map(response => response.json())
    );
  }
}
