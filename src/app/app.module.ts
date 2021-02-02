import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './service/authentication.service';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
import { CommentComponent, DeleteComponent } from './delete/delete.component';
import { FormsModule } from '@angular/forms';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DeleteComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (as: AuthenticationService) => {
        return () => {
           return as.load(); 
        }
      },
      deps:[AuthenticationService],
      multi: true
    },
    httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

