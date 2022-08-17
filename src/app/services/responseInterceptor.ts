import { Injectable, Injector } from '@angular/core';
import {
    HttpResponse,
    HttpErrorResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { loginServcie } from './LoginServcie';
import { HttpService } from './http-service'
import { Observable,throwError } from 'rxjs';
import 'rxjs/add/operator/do';
import { Http, Response } from '@angular/http';
import { mergeMap, retry } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import { map, tap, retryWhen, delayWhen } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()

export class RefreshTokenInterceptor implements HttpInterceptor {
    cachedRequests: Array<HttpRequest<any>> = [];

    private auth: loginServcie;
    private https: HttpService;
    private userData;
    constructor(private injector: Injector,private router: Router) {
        
     }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.auth = this.injector.get(loginServcie);
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
               // console.log(event)
            }
        },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status == 0) {
                        this.cachedRequests.push(request);
                        this.auth.getRefreshToken().subscribe(
                            res => {
                                localStorage.clear();
                                localStorage.setItem("userpermissions", JSON.stringify(res));
                                this.userData = JSON.parse(localStorage.getItem("userpermissions"));
                                request = request.clone({
                                    setHeaders: {
                                        'Authorization': this.userData.token_type + ' ' + this.userData.access_token,
                                        'Content-Type': 'application/json'
                                    }
                                });

                                // return next.handle(this.cachedRequests[0]).do((event: HttpEvent<any>) => {
                                //     console.log("get refresh token", this.cachedRequests[0])
                                // });

                              

                            },
                            err => {
                                console.log(err);
                              
                            }


                        )
                    }
                }
            }).pipe(
                catchError((err, caught: Observable<HttpEvent<any>>) => {
                   if (err instanceof HttpErrorResponse && err.status == 0) {
                        localStorage.clear()
                        localStorage.clear()
                        this.router.navigate(['/login'])
                  } else {
                    return throwError(err);
                  }
                })
              );
    }
}