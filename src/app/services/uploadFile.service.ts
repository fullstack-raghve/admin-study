import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { environment } from 'src/environments/environment';
import { HttpService } from './http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UploadFile {

    constructor(private http: HttpClient) { }


    public upload(file, moduleName, fileType) {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        console.log(file);
        let UPLOAD_FILE = environment.APIEndpoint + "api/v1/uploadFiles";
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type + " " + userData.access_token,
        });
        const formData: FormData = new FormData();
        formData.append("file", file);
        // formData.append("moduleName", moduleName);
        // formData.append("fileType", fileType);

        return this.http.post(UPLOAD_FILE + "/" + moduleName + "/" + fileType, formData, { headers: httpOptions });

    }

    



    public uploadEventGiftingImage1(file,eventOid){
       
        let UPLOAD_FILE = environment.GiftingAPIEndpoint + "rest/api/v1/event_admin/upload_image";

         let userData = JSON.parse(localStorage.getItem("userpermissions"));
         let httpOptions = new HttpHeaders({
             'oauthToken': userData.access_token,
             'requestType': 'web',
           
         });
         let formData: FormData = new FormData();
         formData.append("file", file);
         formData.append("eventOid", eventOid);

        // formData.append("fileType", fileType);
         console.log(formData)
         console.log('eventoid>>>',eventOid);
         console.log('file>>>',file);

           return this.http.post(UPLOAD_FILE,formData, { headers: httpOptions });
       
     }

     public uploadEventGiftingVideo(file,eventOid){
       
        let UPLOAD_FILE = environment.GiftingAPIEndpoint + "rest/api/v1/event_admin/upload_video";

         let userData = JSON.parse(localStorage.getItem("userpermissions"));
         let httpOptions = new HttpHeaders({
             'oauthToken': userData.access_token,
             'requestType': 'web',
           
         });
         let formData: FormData = new FormData();
         formData.append("file", file);
         formData.append("eventOid", eventOid);

        // formData.append("fileType", fileType);
         console.log(formData)
         console.log('eventoid>>>',eventOid);
         console.log('file>>>',file);

           return this.http.post(UPLOAD_FILE,formData, { headers: httpOptions });
       
     }


    public uploadFileSku(file, moduleName, fileType) {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        console.log(file);
        let UPLOAD_FILE = environment.APIEndpoint + "api/v2/uploadFiles";
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type + " " + userData.access_token,
        });
        const formData: FormData = new FormData();
        formData.append("file", file);
        // formData.append("moduleName", moduleName);
        // formData.append("fileType", fileType);

        return this.http.post(UPLOAD_FILE + "/" + moduleName + "/" + fileType, formData, { headers: httpOptions });

    }

    public uploadsegmentmember(file, moduleName, fileType) {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        console.log(file);
        let UPLOAD_FILE = environment.APIEndpoint + "api/v1/uploadFiles";
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type + " " + userData.access_token,
        });
        const formData: FormData = new FormData();
        formData.append("file", file);
        // formData.append("moduleName", moduleName);
        // formData.append("fileType", fileType);

        return this.http.post(UPLOAD_FILE + "/" + moduleName + "/" + fileType, formData, { headers: httpOptions });

    }
    
    public uploadGallery(file,directoryName) {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        console.log(file);
        let filePath = 'wsstore/fileGallery/' + directoryName;
        // console.log(filePath);
        let UPLOAD_FILE = environment.APIEndpoint + "api/rpa/master/fileGallery/v1/uploadFile";
        let httpOptions = new HttpHeaders({
            'Authorization': userData.token_type + " " + userData.access_token,
        });
        const formData: FormData = new FormData();
        formData.append("file", file);
        formData.append("filePath", filePath);
        console.log(filePath);
        console.log(file);
        console.log(directoryName);

        return this.http.post(UPLOAD_FILE, formData, { headers: httpOptions });

    }

    public upload1(file, fileType) {
        let UPLOAD_FILE = 'https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/Upload_File/Post_Upload_File/';
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken': userData.access_token,
            'Content-Type': 'application/json',
            'requestType': 'application/json'
        });
        const formData: FormData = new FormData();
        console.log(formData);

        formData.append("file", file);
        console.log(file);
        return this.http.post('https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/Upload_File/Post_Upload_File/', formData);

    }


    public uploadRecipientBulk(file, fileType,corporateName) {
        let UPLOAD_FILE='ent/Upload_File/Post_Upload_File/';
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken': userData.access_token
        });
        const formData: FormData = new FormData();
        console.log(formData);

        formData.append("file", file);
        formData.append("corporateID", corporateName);
        console.log(file);
        return this.http.post('https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/recipients_bulk_upload', formData, { headers: httpOptions });

    }


   
    public uploadSkuFileEvent_Gifting(file,fileType){
       
       let skuURL =  environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin/upload_sku'
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken': userData.access_token,
            'requestType': 'web',
           // 'Content-Type': 'application/json'
        });
        let formData: FormData = new FormData();
        formData.append("file", file);
        formData.append("fileType", fileType);
        console.log(formData)
     
          return this.http.post(skuURL
            ,formData, { headers: httpOptions });
      
    }

  



    public Search_gift_card_upload(file, fileType,cardTypeId) {
        let UPLOAD_FILE='ent/Upload_File/Post_Upload_File/';
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken':  userData.access_token
        });
        const formData: FormData = new FormData();
        
        formData.append("file", file);
        formData.append("cardTypeId", cardTypeId);
        console.log(file);
        return this.http.post('https://as6xbe41md.execute-api.ap-south-1.amazonaws.com/searchgiftcard_sit/rest/api/v1/searchgiftcard/bulk_upload_barcode', formData, { headers: httpOptions });

    }
    
    public uploadIMG(file, moduleName, fileType) {
        if (fileType == 'image/jpeg') {
            fileType = 'jpeg';
        } else if (fileType == 'image/jpg') {
            fileType = 'jpg';
        } else if (fileType == 'image/png') {
            fileType = 'png';
        }
        let newName = new Date().getTime()
        const formData: FormData = new FormData();
        formData.append("file", file, newName + '.' + fileType);

        return this.http.post('https://v4p8ehzrec.execute-api.ap-south-1.amazonaws.com/recipient_sit/rest/api/v1/recipient/Upload_File/Post_Upload_File/', formData);

    }


    public uploadSku(file, fileType) {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));

        let httpOptions = new HttpHeaders({
            'oauthToken': userData.access_token
        });
        // let newName = new Date().getTime()
        const formData: FormData = new FormData();
        // formData.append("file", file, newName + '.' + 'xls');
          formData.append("file", file);
          formData.append("fileType", fileType);
        console.log(formData)
        return this.http.post('https://cupilfuhfg.execute-api.ap-south-1.amazonaws.com/gcadmin_sit/rest/api/v1/gcadmin/upload_sku', formData, { headers: httpOptions });
        //  return this.http.post('https://gc-static-media-content.s3.ap-south-1.amazonaws.com/sku/uploadsku_1587535042.982681.xlsx', formData, { headers: httpOptions });
        
    }
    AssignPhysicalCardUpload(file, CardID,URL) {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken': userData.access_token
        });
        let formData = new FormData();
        formData.append("file", file);
        formData.append('cardTypeId', CardID);
        console.log(formData)
        return this.http.post(URL, formData, { headers: httpOptions });


    }
    GiftingAssignPhysicalCardUpload(file, CardID,URL,corporateId) {
        let userData = JSON.parse(localStorage.getItem("userpermissions"));
        let httpOptions = new HttpHeaders({
            'oauthToken': userData.access_token
        });
        let formData = new FormData();
        formData.append("file", file);
        formData.append('cardTypeId', CardID);
        formData.append('corporateId',corporateId);
        console.log(formData)
        return this.http.post(URL, formData, { headers: httpOptions });


    }

}
