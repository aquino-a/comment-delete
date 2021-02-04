import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { isNull, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
import { ok } from 'assert';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private tokenUrl = environment.tokenUrl;
  private meUrl = "https://oauth.reddit.com/api/v1/me";

  accessToken: string;
  currentUser: User;

  
  constructor(private http: HttpClient, private router: Router) {
     
  }

  load(): Promise<any> {
    return new Promise((resolve) =>{
      if(localStorage.token == null || localStorage.token == undefined){
        resolve(null);
      }

      if(localStorage.user == null || localStorage.user == undefined){
        resolve(null);
      }

      this.accessToken = localStorage.token;
      this.currentUser = JSON.parse(localStorage.user) as User;
      resolve(null);
    }).catch(error => console.log(error));
  }


  authenticate(code: string) {
    this.http.get<TokenResponse>(this.tokenUrl, {
      params: new HttpParams()
                  .set("code", code)
    }).subscribe(tr =>{
      this.accessToken = tr.access_token;
      localStorage.token = tr.access_token;
      this.setUser(this.accessToken);
    }, error => {
      console.log(error); 
      this.clearToken();
    });
  }


  setUser(accessToken: string): Observable<User> {
    const ob =  this.http.get<User>(this.meUrl);
    ob.subscribe(u => {
      this.currentUser = u;
      localStorage.user = JSON.stringify(u);
    }, error => {
      this.clearToken();
      console.log(error);
    });
    return ob;
  }


  clearToken() {
    this.currentUser = null;
    this.accessToken = null;
    localStorage.removeItem('token');
  }

  isAuthenticated() {
    return this.accessToken != null && this.currentUser != null && this.currentUser != undefined;
  }

}



export interface TokenResponse{
  access_token: string;
  token_type: string;
  expires_in: string;
  scope: string;
}
// export interface TokenResponse{
//   token: string;
// }

export interface User {
  name: string;
  icon_img: string;
  id: string;
}
``

