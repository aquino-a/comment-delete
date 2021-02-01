import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { isNull, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  private clientId = environment.clientId;
  private clientSecret = environment.clientSecret;
  private tokenUrl = "https://www.reddit.com/api/v1/access_token";
  private meUrl = "https://www.reddit.com/api/v1/me";
  private redirect = environment.redirect;
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
      if(localStorage.token != null){
        this.accessToken = localStorage.token;
      }
      resolve(null);
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
        this.accessToken = null;
      });
  }

  
  setUser(accessToken: string) {
    this.http.get(this.meUrl)
      .subscribe(o => console.log(o));
  }

  isAuthenticated() {
    return this.accessToken != null;
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
  username: string;
}
``

