import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { of } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { EncrDecrService } from 'src/app/services/encrDecrservice';


@Injectable({
    providedIn: 'root'
})

export class loginServcie {
    constructor(private http: HttpClient,
        private EncrDecr: EncrDecrService,) {

    }

    cachedRequests: Array<HttpRequest<any>> = [];

    public collectFailedRequest(request): void {
        this.cachedRequests.push(request);
        // this.getRefreshToken().subscribe(
        //     res=>{
        //         localStorage.clear();
        //         localStorage.setItem("userpermissions",JSON.stringify(res) );
               
        //     },
        //     err=>{
        //        console.log(err);
        //     }
        // )

    }

    private userData = JSON.parse(localStorage.getItem("userpermissions"));

    doLoginApp(url, data): Observable<any[]> {
        let httpOptions = new HttpHeaders({
            'Authorization': 'Basic cmVjaXByb2NpOnJlY2lwcm9jaQ=='
        });
        let input = new FormData();
        input.append('username', data.username);
        input.append('password', data.password);
        // input.append('grant_type', data.grant_type);
        input.append('device_id', data.device_id);
        return this.http.post<any[]>(url, input, { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }

    getRefreshToken() { 
        let httpOptions = new HttpHeaders({
            'Authorization': 'Basic cmVjaXByb2NpOnJlY2lwcm9jaQ=='
        });
        let token = new FormData();
        // token.append('grant_type', 'refresh_token');
        token.append('device_id', 'device_id');
        token.append('refresh_token', this.userData.refresh_token);
        return this.http.post<any[]>(environment.APIEndpoint+"oauth/token", token, { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );

    };

    unsecPostJson(url, data) {
        let httpOptions = {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            // DEVICE_ID: sessionStorage.getItem("deviceId")
          })
        };
        return this.http.post<any>(url, data, httpOptions);
      }

}