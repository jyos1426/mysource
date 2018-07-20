import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
// import 'rxjs/add/operator/map';

@Injectable()
export class DetectLogService {

  constructor(private http: Http) {
  }

  public getDetectLogData(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/logs/detect', getParams)
      .map((response: Response) => response.json());
  }
}
