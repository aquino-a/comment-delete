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
  
  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;
  private redirect = environment.redirect;

  private tokenUrl = "https://www.reddit.com/api/v1/access_token";
  private meUrl = "https://oauth.reddit.com/api/v1/me";
  accessToken: string;
  currentUser: User;

  // private userLoginSuccessSource = new BehaviorSubject<User>(null);
  // private userLoginFailSource = new Subject<any>();
  
  // userLoginSuccess$ = this.userLoginSuccessSource.asObservable();
  // userLoginFail$ = this.userLoginFailSource.asObservable();


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
      // this.setUser(this.accessToken).subscribe(u => resolve(null), error => { this.clearToken(); resolve(null); });
    }).catch(error => console.log(error));
  }


  authenticate(code: string) {
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirect}`;

    this.http.post<TokenResponse>(this.tokenUrl, body,
      {
        headers: new HttpHeaders()
            .set('Authorization', 'Basic ' + btoa(this.clientId + ':' + this.clientSecret))
            .set('Content-Type', 'application/x-www-form-urlencoded')
      })
      .subscribe(tr =>{
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

