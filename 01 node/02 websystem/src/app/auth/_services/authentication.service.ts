import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http) {
  }

  login1(userid: string, r1: string) {
    // return this.http.get( '/login1', JSON.stringify( { userid: userid, r1: r1 } ) )
    return this.http.get('/auth/login1', { params: { id: userid, r1: r1 } })
      // return this.http.get( '/login1?id='+ userid+'&r1='+r1,    )
      .map((response: Response) => response.json());
  }

  login2(userid: string, res2: string) {
    // return this.http.get( '/login2', JSON.stringify( { userid: userid, res2: res2 } ) )
    return this.http.get('/auth/login2', { params: { id: userid, res2: res2 } })
      // return this.http.get( '/login2?id='+ userid+'&res2='+res2,    )
      .map((response: Response) => response.json());
  }

  logout() {
    return this.http.get('/auth/logout').subscribe();
    // return this.http.get('/api/auth/logout').subscribe(data => {
    //                 localStorage.removeItem('currentUser');
    // });
    // .subscribe(data => {
    //     this.jsonData = data['apis'];

    //     this.jsonData.forEach((data, i) => {
    //         data['index'] = i;
    //         data['isShowHistory'] = false;
    //     })
    // });
    // return this.http.post('/api/auth/logout')
    //                 .map((response: Response) => {
    //                     // remove user from local storage to log user out
    //                     localStorage.removeItem('currentUser');
    //                 });

  }
}
