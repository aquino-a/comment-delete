import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';
import { tap } from 'rxjs/operators';

/** Add token parameter */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private auth: AuthenticationService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if(this.auth.accessToken == null || this.auth.accessToken == undefined){
        return next.handle(req);
      }
      
      const authReq = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + this.auth.accessToken)
      })
      return next.handle(authReq)
        .pipe(tap(
          event => {},
          error => {
            if(error instanceof HttpErrorResponse){
              if(error.status == 401 || error.status == 403){
                this.auth.clearToken();
              }
            }  
          }
        ));
        
  }

}