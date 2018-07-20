import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { forkJoin } from 'rxjs/observable/forkJoin';
// import 'rxjs/add/operator/map';

@Injectable()
export class DashboardService {

  constructor(private http: Http) {
  }

  public getRankByAttackNameData(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/dashboard/rankby/attack_name', getParams)
      .map((response: Response) => response.json());
  }
  
  public getRankByHackerIpData(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/dashboard/rankby/hacker_ip', getParams)
      .map((response: Response) => response.json());
  }

  public getRankByVictimIpData(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/dashboard/rankby/victim_ip', getParams)
      .map((response: Response) => response.json());
  }

  public getSystemDataList(params: object) {
    const getParams = {
      params: params
    };
    return this.http
    .get('/api/dashboard/resources', getParams)
    .map((response: Response) => response.json());
  }

  public getRankBy(params: any) {
    var parma = {};
    parma['iscurrentdate'] = params['isCurrentDateHackerIp'] ? 1 : 0;
    const getRankByHackerIpData = this.getRankByHackerIpData(parma);    
    parma['iscurrentdate'] = params['isCurrentDateVictimIp'] ? 1 : 0;
    const getRankByVictimIpData = this.getRankByVictimIpData(parma);    
    parma['iscurrentdate'] = params['isCurrentDateAttackName'] ? 1 : 0;
    const getRankByAttackNameData = this.getRankByAttackNameData(parma);
    return forkJoin([getRankByHackerIpData,getRankByVictimIpData,getRankByAttackNameData]);
  }

  getCategoryList() {
    return this.http.get('/api/info/category').map((response: Response) => response.json());
  }

}
