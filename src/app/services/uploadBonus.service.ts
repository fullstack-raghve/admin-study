import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { environment } from 'src/environments/environment';
import { HttpService } from './http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class uploadBonusFile {

    constructor(private http: HttpClient) { }

    public postUploadFormdata(url,data){
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let fileUploadOption = new HttpHeaders({
            'Authorization': userData.token_type +" "+ userData.access_token,
            //'Content-Type': 'multipart/form-data' 
            // 'Content-Type': 'multipart/form-data' 
           //'Content-Type': 'multipart/form-data; charset=utf-8; boundary=something'
        });
        return this.http.post(url , data , { headers: fileUploadOption });        
    }

}
