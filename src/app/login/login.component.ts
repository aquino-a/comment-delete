import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private clientId = environment.clientId;
  private redirect = environment.redirect;
  private loginUrl = new URL("https://www.reddit.com/api/v1/authorize");

  private state;

  constructor(private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService ) {

    this.activatedRoute.queryParams.subscribe(params => {
          const code = params['code'];
          if(code == null || code == undefined){
            return;
          }
          const state = params['state']; 
          console.log(state);
          console.log(this.state);

          console.log(code); // Print the parameter to the console. 
          this.authenticationService.authenticate(code);
      });

  }

  ngOnInit(): void {
  }

  login(){
    this.loginUrl.searchParams.set("client_id", this.clientId);
    this.loginUrl.searchParams.set("response_type", 'code');
    this.state = Math.floor(Math.random() * 9999);
    this.loginUrl.searchParams.set("state", this.state);
    this.loginUrl.searchParams.set("redirect_uri", this.redirect);
    this.loginUrl.searchParams.set("duration", "temporary");
    this.loginUrl.searchParams.set("scope", "read,edit");

    window.open(this.loginUrl.href);
  }

}