import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private clientId = environment.clientId;
  private redirect = environment.redirect;
  private loginUrl = new URL("https://www.reddit.com/api/v1/authorize");
  private loginUrlMobile = new URL("https://www.reddit.com/api/v1/authorize.compact");

  private state;

  constructor(private activatedRoute: ActivatedRoute, public auth: AuthenticationService ) {

    this.activatedRoute.queryParams.subscribe(params => {
          if(this.auth.isAuthenticated()){
            return;
          }
          const code = params['code'];
          if(code == null || code == undefined){
            return;
          }
          const state = params['state']; 
          console.log(state);
          console.log(this.state);

          console.log(code); // Print the parameter to the console. 
          auth.authenticate(code);
      });

  }

  ngOnInit(): void {
  }

  login(){
    if(this.auth.isAuthenticated()){
      return;
    }
    var url = this.loginUrl;
    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) {
      url = this.loginUrlMobile;
    }

    url.searchParams.set("client_id", this.clientId);
    url.searchParams.set("response_type", 'code');
    this.state = Math.floor(Math.random() * 9999);
    url.searchParams.set("state", this.state);
    url.searchParams.set("redirect_uri", this.redirect);
    url.searchParams.set("duration", "temporary");
    url.searchParams.set("scope", "read,edit,identity,history");

    window.open(url.href, "_self");
  }

}
