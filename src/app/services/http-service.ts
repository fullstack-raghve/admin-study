
import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { of } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient) {
    }
   
    postJson(url, data): Observable<any[]> {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            'Content-Type': 'application/json'
        });
      
        return this.http.post<any[]>(url, data , { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }  

    postJsonCache(url): Observable<any[]> {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            'Content-Type': 'application/json'
                });
      
        return this.http.post<any[]>(url, { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    } 

    postJsonMember(url, data): Observable<any[]> {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            'Content-Type': 'application/json',
            'Accept-Language': 'en'
        });
      
        return this.http.post<any[]>(url, data , { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    } 
    
    postJson1(url, data): Observable<any[]> {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken':  userData.access_token,
            'Content-Type': 'application/json',
            'requestType': 'application/json'
        });
      
        return this.http.post<any[]>(url, data , { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }
    // oauthToken: '45c12fe9-c733-412b-9531-927819b17f73',
    // requestType:'application/json',

      /////event-gifting method

  
      postGiftingJson(url, data): Observable<any[]> {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken':  userData.access_token,
            'requestType': 'web',
            'Content-Type': 'application/json',
            
        });
     // console.log('header',httpOptions);
      
        return this.http.post<any[]>(url, data , { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }



    ////event -end

    getJson(url):Observable<any[]>{
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            'Content-Type': 'application/json',
            'Accept-Language': 'en'
        }); 
        return this.http.get<any[]>(url ,{ headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }


  
    getJsonStore(url,storeId):Observable<any[]>{
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            'Content-Type': 'application/json',
            'Accept-Language': 'en',
            'storeOid': storeId
        }); 
        return this.http.get<any[]>(url,{ headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }
    
    getJsonStoreStatus(url,storeId):Observable<any[]>{
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            'Content-Type': 'application/json',
            'storeId': storeId
        }); 
        return this.http.get<any[]>(url,{ headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }
    getJsonChacheStatus(url,oid):Observable<any[]>{
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            'Content-Type': 'application/json',
             oid: oid
        }); 
        return this.http.get<any[]>(url,{ headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }
    
    postCustomizeJson(url, data): Observable<any[]> {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        console.log(userData.access_token);
        let httpOptions = new HttpHeaders({
            'oauthtoken': userData.access_token,
            'Content-Type': 'application/json',
            'requestType' : 'application/json'
        });
      console.log(httpOptions);
      
        return this.http.post<any[]>(url, data , { headers: httpOptions }).pipe(
            catchError(error => {
                return throwError(error)
            })
        );
    }

   
}
