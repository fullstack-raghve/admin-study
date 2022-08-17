import { Injectable,Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { HttpService } from './http-service';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  private userData = JSON.parse(localStorage.getItem("userpermissions"));
  private auth: HttpService;
  constructor(private injector: Injector) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.auth = this.injector.get(HttpService);
    request = request.clone({
      setHeaders: {
        'Authorization': this.userData.token_type + ' ' + this.userData.access_token,
        'Content-Type': 'application/json'
      }
    });

    return next.handle(request);
  }
}