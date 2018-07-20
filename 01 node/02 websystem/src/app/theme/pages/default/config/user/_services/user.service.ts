import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions, Headers  } from '@angular/http';
// import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(private http: Http) {
  }

  public getUserData(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/config/users',getParams)
      .map((response: Response) => response.json());
  }

  public checkPassword(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/config/users/check',getParams)
      .map((response: Response) => response.json());
  }

  
  public insertUserData(params: object) {
    // const getParams = {
    //   params: params
    // };
    return this.http
      .post('/api/config/users',params)
      .map((response: Response) => response.json());
  }

  public updateUserData(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .patch('/api/config/users',params)
      .map((response: Response) => response.json());
  }

  public deleteUser(params: object) {
    let body = JSON.stringify(params);

    let header = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions(
      { 
        headers: header,
        body : body
      }
    );
    return this.http
      .delete('/api/config/users', options)
      .map((response: Response) => response.json());
  }
  
  public getUserAccessIp(params: object) {
    const getParams = {
      params: params
    };
    return this.http
      .get('/api/config/users/access_address',getParams)
      .map((response: Response) => response.json());
  }


  public insertUserAccessIp(params: object) {
    // const getParams = {
    //   params: params
    // };
    return this.http
      .post('/api/config/users/access_address',params)
      .map((response: Response) => response.json());
  }

  public deleteUserAccessIp(params: object) {
    let body = JSON.stringify(params);

    let header = new Headers({ 'Content-Type': 'application/json'});
    let options = new RequestOptions(
      { 
        headers: header,
        body : body
      }
    );
    return this.http
      .delete('/api/config/users/access_address',options)
      .map((response: Response) => response.json());
  }

}
