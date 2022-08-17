import { Component, ElementRef, OnInit, ViewChild,AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
//import {MatTableDataSource} from '@angular/material/table';
//import { MatPaginator, MatSort } from '@angular/material';
//import {MatPaginator} from '@angular/material/paginator';
import { MatTabsModule } from "@angular/material";
import { MatPaginator, MatSort, MatTable, MatTableDataSource, Sort } from '@angular/material';
//import { HttpService } from './../../../../services/http-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import { HttpService } from 'src/app/services/http-service';
import { UploadFile } from '../../../../services/uploadFile.service';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';
import { ViewStoreDialogComponent } from 'src/app/shared/components/view-store-dialog/view-store-dialog.component';
import { ViewGiftingLimitComponent } from '../../view-gifting-limit/view-gifting-limit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface UserData {
  userID: string;
  userName: string;
  perGiftLimit: string;
  eventGiftLimit: string;
}
export interface couTableData {
  couponID: string;
  couponName: string;
  discountType: string;
  value: string;
  startDate: string;
  endDate: string;
}
export interface locTableData {
  locationName:string;
  countryName:string;
  cityName:string;
   BrandName:string;
}

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ViewEventsComponent implements OnInit {
  public languageList = JSON.parse(localStorage.getItem("languageList"));

  medialist = [
    { "name": "Image", ID: "D1"},
    { "name": "Video", ID: "D2"},
    { "name": "URL", ID: "D2"}
]
chosenItem = this.medialist[0].name;

  public acessList;
  public imgUpload = false;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild('uploadEl1') uploadElRef1: ElementRef;

  public imageErrMsg;

  public menuIds: any = JSON.parse(localStorage.getItem("menuIds"))
  public showPermissionTab: boolean = false;
  alignCss = [];
  public imageUploading: boolean = false;
  public imagePath: any = [];

  public videoSRCUrl:any  = [];

  public imagePath1: any = [];
  public statusValue: string = 'ONLINE';
  public toggleVal: boolean = true;
  public isDafultEvent: boolean;
  public isPreptual: boolean;
  public isDOCAPP: boolean;
  public isCouponEnabled: boolean = true;
  public isProgramEnabled: boolean = true;
  public uploadFlag = [];
  public uploadFlagVid = [];

  public uploadFlag1 = [];
  public uploadError = [];
  public uploadErrorVid = [];

  public uploadError1 = [];
  public languageDirection = [];
  public langfield = [];
  public langfieldname = [];
  public fileImgPathUrl = localStorage.getItem("imgBaseUrl");
appContentForm:FormGroup;

  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Events',
    
  },

  ];
  public eventData:any = [];
  public  eventDetails: any;
  public locationDetails: any;
  public storeAppContent: any;
  giftingtype: any;
  GiftingDetails: any;

  public displayedColumns: string[] = ['userID', 'userName', 'perGiftLimit', 'eventGiftLimit'];
  public displayedColumnsCoupon: string[] = ['couponID', 'couponName', 'discountType', 'value','startDate','endDate'];
  public displayedColumnsLocation: string[] = ['locationName', 'countryName', 'cityName', 'BrandName'];

  public filePathUrl = localStorage.getItem("imgBaseUrl");

  coupon_data :couTableData[]=[];
  dataSource: MatTableDataSource<UserData>;
  dataSourceCoupon: MatTableDataSource<couTableData>;
  dataSourceLocation: MatTableDataSource<locTableData>;
  selectStoreValPass: any;
  public imageOrVideoUrl;
  giftingLimitsDummy: { giftType: string; giftName: string; maxGiftPerCustomer: number; maxGiftPerEvent: number; balance: number; }[];
  selectedStoreData: any;
  alllocationDetails: any;
  event_notification_view: any;
  smsData: any;
  pushData: any;
  sms_notification: any;
  app_notification: any;
  event_coupon_gifting_view: any;
  event_program_gifting_view: any;
  event_product_gifting_view: any;
  multiple_coupon_allowed: any;
  multiple_product_allowed: any;
  usersGifting: any;
  allUser: any;
  eventIdinResponse: any;
  countryList: any;
  countryCode: any;
  appContentDetails: any;
  appContent: any;
  phone: any;
  email: any;
  loadingview:boolean = true;
  selectedStatus:  number ;  
  eventOid: number;
  showError: boolean;
  safeSrc: SafeResourceUrl;
  safeSrcVideoUpload: SafeResourceUrl;
  safeSrcVideoUploadArray: SafeResourceUrl = [];

  url;
  format;
  displayEventOnCustomerApp: any;
  eventStatus: any;
  approvalStatus: any;
  multiple_program_allowed: any;
  productGridData: any;
  useroidinnum: any;
  constructor(private fb:FormBuilder,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private https: HttpService,
    public snackBar: MatSnackBar,
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private router: Router,

    private uploadFile: UploadFile) 
  { }

  ngOnInit() {
    let eventOid = this.activatedRoute.snapshot.params.id;
this.eventOid = +eventOid;

    this.buildEventForm();
  
  //  this.bannersLocaleBeanA();
this.imgVidoUrl();
    this.videoURL();
    this.videoUpload();
    this.giftLanguageList();
    //this.dummyJson();
    this.viewSelectedEvent(eventOid);
   this.getAllCountries();

  }


  buildEventForm(){
    let form = {
      giftLanguageList: this.fb.array([]),
      imgVidoUrl: this.fb.array([]),
      videoURL: this.fb.array([]),
    //  bannersLocaleBean: this.fb.array([]),
     videoUpload:this.fb.array([]),
      //conditionArray: this.fb.array([]),
      imageOrVideoUrl: ['',Validators.required],
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['',Validators.compose([Validators.required])]
    }
      this.appContentForm = this.fb.group(form);

      this.selectedStatus = 1;


      for (let l of this.languageList) {
        this.uploadFlag.push(false);
        this.uploadError.push(false);

        this.imagePath.push('');
        this.videoSRCUrl.push('');

        this.uploadFlagVid.push(false);
        this.uploadErrorVid.push(false);

      }

      
  }



  public uploadvideo(event: FileList, i,type ) {
    console.log('i>>>',i);

   // this.imageUploading = true;
    if (event[0].size < 1000000) {
      if (event[0].type == "video/mp4") {
        if (event[0].size < 1000000) {
          this.uploadFile.uploadEventGiftingVideo(event.item(0),this.eventOid)
            .subscribe((response) => {
              console.log('upload vid res>>>',response);
              if(response['statusCode'] == 200){
                 this.videoSRCUrl[i] = response['output']['uploadVideo'];
                 this.uploadFlagVid[i] = true;
                 this.uploadErrorVid[i] = false;
                 this.uploadElRef1.nativeElement.value = ''
            
              }
              // if(type=='imgBanner'){
              //   this.imagePath[i] = response['message'];
              //   this.uploadFlag[i] = true;
              //   this.uploadError[i] = false;
              //   this.uploadElRef.nativeElement.value = ''
              // }else{
              //   this.imagePath1[i] = response['message'];
              //   this.uploadFlag1[i] = true;
              //   this.uploadError1[i] = false;
              //   this.uploadElRef.nativeElement.value = ''
              // }
            
              console.log("res ::: " + response)
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            }, err => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
            )
        } else {
          this.imageUploading[i] = false;
          this.imageErrMsg = "Max upload file size is 1Mb";

        }
      } else {
        this.imagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }

 
  public uploadImage(event: FileList, i,type ) {
    console.log('i>>>',i);

    this.imageUploading = true;
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
        if (event[0].size < 1000000) {
          this.uploadFile.uploadEventGiftingImage1(event.item(0),this.eventOid)
            .subscribe((response) => {
              console.log('upload img res>>>',response);
              if(response['statusCode'] == 200){
                this.imagePath[i] = response['output']['uploadImage'];
                this.uploadFlag[i] = true;
                this.uploadError[i] = false;
                this.uploadElRef.nativeElement.value = ''
            
              }
              // if(type=='imgBanner'){
              //   this.imagePath[i] = response['message'];
              //   this.uploadFlag[i] = true;
              //   this.uploadError[i] = false;
              //   this.uploadElRef.nativeElement.value = ''
              // }else{
              //   this.imagePath1[i] = response['message'];
              //   this.uploadFlag1[i] = true;
              //   this.uploadError1[i] = false;
              //   this.uploadElRef.nativeElement.value = ''
              // }
            
              console.log("res ::: " + response)
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 1500,
                data: {
                  status: "success",
                  message: " image successfully uploaded"
                }
              });
            }, err => {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }
            )
        } else {
          this.imageUploading[i] = false;
          this.imageErrMsg = "Max upload file size is 1Mb";

        }
      } else {
        this.imagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.imagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }
  }


  public removeImage1(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;

    const control = this.appContentForm.get('imgVidoUrl') as FormArray;
    control.at(index).get('uploadImage').setValue('');
  }

  public removeVideo(index) {
    this.videoSRCUrl[index] = "";
    this.uploadFlagVid[index] = false;

    const control = this.appContentForm.get('videoUpload') as FormArray;
    control.at(index).get('uploadVideo').setValue('');
  }

  public removeImage(index,type) {
    if(type == 'imgBanner'){
      this.imagePath[index] = "";
      this.uploadFlag[index] = false;
      const control = this.appContentForm.get('bannersLocaleBean') as FormArray;
      control.at(index).get('imgBanner').setValue('');
    }else{
      this.imagePath1[index] = "";
      this.uploadFlag1[index] = false;
      const control = this.appContentForm.get('titleArray') as FormArray;
      control.at(index).get('imgBannerTitle').setValue('');
    }
   
  }

 
openStoresDialog() {
  console.log('this.selectedStoreData',this.selectedStoreData);
  const dialogRef = this.dialog.open(ViewStoreDialogComponent, {
    panelClass: 'custom-modalbox'
  });
  dialogRef.componentInstance.selectedStoreData = this.selectedStoreData;
  dialogRef.afterClosed().subscribe(
    (result) => {

    }
  );
}


public demo1TabIndex = 0;
public demo1BtnClick() {
  
  const tabCount = 3;
  this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
  console.log('demo1TabIndex',this.demo1TabIndex)
}

giftingType(event) {
  let value = event.index;
  // if (value === 0) {
  //   this.couponGiftingType = true;
  //   this.programGiftingType = false;
  //   this.productGiftingType = false;
  // }
  // else if (value === 1) {
  //   this.programGiftingType = true;
  //   this.couponGiftingType = false;
  //   this.productGiftingType = false;
  // }
  // else if (value === 2) {
  //   this.productGiftingType = true;
  //   this.programGiftingType = false;
  //   this.couponGiftingType = false;
  // }
}


loading:boolean = false;
userList = [];

isAppcontentAvailable:boolean;
public mediaType:any;
loder:boolean = false;
viewSelectedEvent(eventOid){
  this.loder = true;

this.loading = true;

 let data = {
  "eventId":eventOid,
  "languageCode":"en"
}

this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/view_selected_event_details',data).subscribe(res => {
  console.log('add event res',res);
  this.loading = false;

  this.eventData = res['output'];
  this.displayEventOnCustomerApp = this.eventData['displayEventOnCustomerApp'];
  this.eventStatus = this.eventData['status'];
  this.approvalStatus = this.eventData['approvalStatus'];

  this.eventData['perpetual'].toLowerCase() === "true" ? this.isPreptual = true : this.isPreptual = false;
//this.eventData['displayOnUserApp'].toLowerCase() === "yes" ? this.isDOCAPP = true : this.isDOCAPP = false;
 this.eventData['defaultEvent'] === "true" ||  this.eventData['defaultEvent'] === "TRUE" ? this.isDafultEvent = true : this.isDafultEvent = false;
this.eventDetails = this.eventData['eventName'];
this.locationDetails = this.eventData['locationDetails'];
this.storeAppContent = this.eventData['storeAppContent'];
//////
// let sms_notification =  this.eventData['sms_notification'];
// let app_notification =  this.eventData['app_notification'];

// this.sms_notification =  sms_notification.toLowerCase();
// this.app_notification =  app_notification.toLowerCase();

this.eventIdinResponse = this.eventData['eventId'];

let multiple_coupon_allowed = this.eventData['multiple_coupon_allowed'];
let multiple_product_allowed = this.eventData['multiple_product_allowed'];
let multiple_program_allowed = this.eventData['multiple_program_allowed'];

this.multiple_coupon_allowed = multiple_coupon_allowed && multiple_coupon_allowed.toLowerCase();
this.multiple_product_allowed = multiple_product_allowed && multiple_product_allowed.toLowerCase();
this.multiple_program_allowed = multiple_program_allowed && multiple_program_allowed.toLowerCase();

///////

// console.log('this.storeAppContent',this.storeAppContent);
// console.log('this.eventDetails',this.eventDetails);

this.selectedStoreData = this.eventData['storeDetails'];

////app content detais

let appContentDetails = this.eventData['appContentDetails']
if(appContentDetails.length>0){
  this.isAppcontentAvailable = true;
  console.log('content avail')
  this.appContentDetails = this.eventData['appContentDetails'][0];

  this.appContent = this.eventData['appContentDetails'][0]['appContent'];

this.email = this.appContentDetails['email'];
this.phone = this.appContentDetails['phone'];



if(this.appContent){

  for(let i = 0;i<this.appContent.length;i++){
    if(this.appContent[i].image != ''){
       this.mediaType = 'image';
        break;
    }else if(this.appContent[i].videoLink != ''){
      this.mediaType = 'videoLink';
      this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.appContent[0].videoLink);
      console.log('safeSrc type is>>>',this.safeSrc);

     /// this.mediaType.push('videoLink');
      break;
    }else{
      this.mediaType = 'videoUpload';
      this.safeSrcVideoUpload =  this.sanitizer.bypassSecurityTrustResourceUrl(this.appContent[0].videoUpload);
      //this.mediaType.push('videoUpload');

      break;
    }
  }
}
console.log('media type is>>>',this.mediaType);

  // console.log('this.appContentDetails>>>>',this.appContentDetails['email']);
  
  // this.appContentForm.get('email').patchValue(this.appContentDetails['email']);
  // this.appContentForm.get('phone').patchValue(this.appContentDetails['phone']);
}else{
  this.isAppcontentAvailable = false;
  console.log('content not avail')

}





this.event_notification_view = this.eventData['event_notification_view'];

this.event_coupon_gifting_view = this.eventData['event_coupon_gifting_view'];
this.event_program_gifting_view = this.eventData['event_program_gifting_view'];
this.event_product_gifting_view = this.eventData['event_product_gifting_view'];

 this.productGridData =  this.eventData['event_product_gifting_view'] && this.eventData['event_product_gifting_view'][0];

// this.smsData = this.event_notification_view[0];
// this.pushData = this.event_notification_view[1];

// console.log('sms',this.smsData);
// console.log('push',this.pushData )

this.loadingview = false;

let locationdata = this.eventData['locationDetails'];
this.userList = []; 
this.fetchLocations(locationdata);


this.usersGifting = this.eventData['user'];

console.log('usersGifting',this.usersGifting);
for(let i= 0;i<this.usersGifting.length;i++){
  
  this.userList.push(this.usersGifting[i]['userOid']);
  //this.userList =  this.userList.flat();
  console.log('userList before>>>>>>>>>',this.userList[0]);
  let flatarray1 = this.userList.reduce((acc, val) => acc.concat(val), []);

 this.useroidinnum = flatarray1.map(i=>Number(i));

}
if(this.useroidinnum){
this.fetchUsers(this.useroidinnum)
}

})


this.loder = false;



}

fetchLocations(locationdata){
    
  let data2 = {
    "universalId":  "",
    "countryOid":  null,
    "cityOid":  [],
    "languageCode": "en" 
  }

  let data1 = {
    
    "universalId": '',
  "countryOid": '',
  "cityOid": [],
  "languageCode": "en" ,
    "page":0,
    "pageSize":0,
   "order":{"column":"address","dir":"asc"}
   
  
  
}
  //console.log('req body',data2);
  
   this.https.postGiftingJson(environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin_location/search_location', data1).subscribe(res => {
  if(res['statusCode'] === 200){
   // console.log('all loc data',res);
    ///this.loading = false;
    let allLocation = res['output']['searchOutput'];
    console.log('loc data',locationdata);
    //this.allocations = res['locationOid'];
    let result = allLocation && allLocation.filter( el => (-1 != locationdata.indexOf(el.locationOid)));
    console.log(result);
  
  //console.log('result>>>>',result);
  this.alllocationDetails = result;

  }
})
}

fetchUsers(users){
    
 let data = {
  "page": "0",
  "pageSize": "10000",
  "order": {
    "column": "",
    "dir": "asc"
  },
  "keySearch": "",
  "fieldSearch": [
    {
      "fieldName": "FULL_NAME",
      "fieldValue": ""
    },
    {
      "fieldName": "EMAIL_ID",
      "fieldValue": ""
    },
    {
      "fieldName": "MOBILE_NUMBER",
      "fieldValue": ""
    },
    {
      "fieldName": "ROLE_OID",
      "fieldValue": ""
    },
    {
      "fieldName": "STATUS",
      "fieldValue": ""
    },
    {
      "fieldName": "storeName",
      "fieldValue": ""
    },
    {
      "fieldName": "brandOid",
      "fieldValue": ""
    }
  ]
}

  
 // console.log('req body of user',data);
  
  this.https.postJson(environment.APIEndpoint + 'api/rpa/user/v3/search', data).subscribe(res => {
    if(res){
  //  console.log('alluser res>>>',res);
    ///this.loading = false;
    let alluser = res['items'];
   // let userNumber = users.map(i=>Number(i));
  ///  console.log('userId to filter>>>',userNumber);

///filter those users from total - we know userOid
    let result = alluser.filter( el => (-1 != users.indexOf(el.userId)));
  //  console.log('matched>>',result);
  
  this.allUser = result;
 /// console.log('allUser filtred>>>>',this.allUser);


  }
})
}

viewGift(data){

  const dialogRef = this.dialog.open(ViewGiftingLimitComponent);
  dialogRef.componentInstance.userOid = data;
  dialogRef.componentInstance.totalData =  this.allUser;
  dialogRef.componentInstance.fullusersGifting = this.usersGifting

  dialogRef.afterClosed().subscribe(result => {
   console.log('gift details>>>>>>',result);

  })
}


viewUserGiftLimit(){

}
numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}

public imgVidoUrl(){
  const control = <FormArray>this.appContentForm.controls['imgVidoUrl'];
  for (let i = 0; i < this.languageList.length; i++) {
    const newForm = this.fb.group({
      languageCode: this.languageList[i]['languageCode'],
      uploadImage: [''],
      uploadVideo: [''],
      videolink: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])]

    });
    control.push(newForm);
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  }
}

public bannersLocaleBeanA() {
  const control = <FormArray>this.appContentForm.controls['bannersLocaleBean'];
  for (let i = 0; i < this.languageList.length; i++) {
    const newForm = this.fb.group({
      languageCode: this.languageList[i]['languageCode'],
      imgBanner: [''],
     // videoUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
    });
    control.push(newForm);
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  }
}


public videoURL() {
  const control = <FormArray>this.appContentForm.controls['videoURL'];
  for (let i = 0; i < this.languageList.length; i++) {
    const newForm = this.fb.group({
      languageCode: this.languageList[i]['languageCode'],
       videolink: ["",Validators.compose([Validators.required, Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
    });
    control.push(newForm);
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  }
}

public videoUpload() {
  const control = <FormArray>this.appContentForm.controls['videoUpload'];
  for (let i = 0; i < this.languageList.length; i++) {
    const newForm = this.fb.group({
      languageCode: this.languageList[i]['languageCode'],
      uploadVideo: [''],
     // videoUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
    });
    control.push(newForm);
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  }
}

public giftLanguageList() {
  const control = <FormArray>this.appContentForm.controls['giftLanguageList'];
  for (let i = 0; i < this.languageList.length; i++) {
    let newForm = this.fb.group({
      languageName: this.languageList[i]['languageName'],
      languageCode: this.languageList[i]['languageCode'],
      eventName: ['', Validators.required]
    });
    control.push(newForm);
    this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  }
}

onSelectFile(event) {
  const file = event.target.files && event.target.files[0];
  if (file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    if(file.type.indexOf('image')> -1){
      this.format = 'image';
    } else if(file.type.indexOf('video')> -1){
      this.format = 'video';
    }
    reader.onload = (event) => {
      this.url = (<FileReader>event.target).result;
    }
  }
}



public bannersLocaleBeanArray;
public appContent1:any[];
imgUploadErr:boolean;
createAppContent(formdata){
  console.log('formdata',formdata);
  console.log('imagePath',this.imagePath);

 



/////////////
let giftLanguageList = this.appContentForm.controls['giftLanguageList'].value
let imgVidoUrl = this.appContentForm.controls['imgVidoUrl'].value;
let videoURL =  this.appContentForm.controls['videoURL'].value;
let videoUpload =  this.appContentForm.controls['videoUpload'].value;

console.log('videoUpload',videoUpload);


console.log('imgVidoUrl',imgVidoUrl);
console.log('giftLanguageList',giftLanguageList);
console.log('selectedStatus',this.selectedStatus);

let appContentarray=[];
if(this.selectedStatus == 1){

  for(var content in giftLanguageList) {
      for(var ivu in imgVidoUrl){

  if(giftLanguageList[content]['languageCode'] == imgVidoUrl[ivu]['languageCode']){
        let new_obj={
          "languageCode": giftLanguageList[content]['languageCode'],
          "languageName": giftLanguageList[content]['languageName'],
          "content": giftLanguageList[content]['eventName'],
          'uploadImage':this.imagePath[content],
          "uploadVideo": "",
          "videolink": ""
      }
      appContentarray.push(new_obj);

  }

      }

}


//////hide validation of url link
    const pushController = this.appContentForm.get('videoURL') as FormArray;
for (let i = 0; i < this.languageList.length; i++) {
  let sub = pushController.at(i).get('videolink');
   sub.clearValidators();
  sub.updateValueAndValidity();

}

/////end


let imgLIST = this.imagePath
this.imagePath = this.imagePath.filter(item => item);



 if(this.languageList.length != this.imagePath.length){
console.log('all images not uploaded');
console.log('all images not uploaded',imgLIST.length);
console.log('imgLIST',imgLIST);

  for(let i = 0;i<imgLIST.length;i++){
    if(imgLIST[i] == ''){
      this.uploadError[i] = true;
      
    }

  }
  return;
}

}

console.log('appContent>>>>>',appContentarray);



if(this.selectedStatus == 2){
  for(var content in giftLanguageList) {
      for(var vidup in videoUpload){

  if(giftLanguageList[content]['languageCode'] == videoUpload[vidup]['languageCode']){
        let new_obj={
          "languageCode": giftLanguageList[content]['languageCode'],
          "languageName": giftLanguageList[content]['languageName'],
          "content": giftLanguageList[content]['eventName'],
          'uploadImage':"",
          "uploadVideo": this.videoSRCUrl[content],
          "videolink": ""
      }
      appContentarray.push(new_obj);

  }

      }

}


//////hide validation of url link
const pushController = this.appContentForm.get('videoURL') as FormArray;
for (let i = 0; i < this.languageList.length; i++) {
  let sub = pushController.at(i).get('videolink');
   sub.clearValidators();
  sub.updateValueAndValidity();

}

/////end




let videoSRCUrl = this.videoSRCUrl;
this.videoSRCUrl = this.videoSRCUrl.filter(item => item);



 if(this.languageList.length != this.videoSRCUrl.length){
console.log('all videos not uploaded');

  for(let i = 0;i<videoSRCUrl.length;i++){
    if(videoSRCUrl[i] == ''){
      this.uploadErrorVid[i] = true;
    }

  }
  return;

}

}
console.log('appContent of video>>>>>',appContentarray);



if(this.selectedStatus == 3){
  for(var content in giftLanguageList) {
      for(var vidURL in videoURL){

  if(giftLanguageList[content]['languageCode'] == videoURL[vidURL]['languageCode']){
        let new_obj={
          "languageCode": giftLanguageList[content]['languageCode'],
          "languageName": giftLanguageList[content]['languageName'],
          "content": giftLanguageList[content]['eventName'],
          'uploadImage':"",
          "uploadVideo": "",
          "videolink": videoURL[content]['videolink']
      }
      appContentarray.push(new_obj);

  }

      }

}

/////

//////show validation of url link
const pushController = this.appContentForm.get('videoURL') as FormArray;
for (let i = 0; i < this.languageList.length; i++) {
  let sub = pushController.at(i).get('videolink');
  sub.setValidators(Validators.compose([Validators.required, Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")]));
  sub.updateValueAndValidity();
  //videolink: ["",Validators.compose([Validators.required, Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],

}

/////end


///
}




let reqBody = {
  
    "eventId": this.eventIdinResponse,
    "email": formdata.email,
    "phone": formdata.phone,
    "countryCode": this.countryCode,
    "appContent":appContentarray
   
  }




console.log('reqBody',reqBody);

 if(this.appContentForm.invalid){
  console.log('form is not valid');

    return;

  }

let url = 'rest/api/v1/event_admin/add_appcontentdata';

this.http.postGiftingJson(environment.GiftingAPIEndpoint+url,reqBody).subscribe(res => {
  console.log('create app content',res);
  
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 5000,
    data: {
      status: "success",
      message: "App content  added successfully"
    }
  });
  this.loading = false;
  this.router.navigate(['/search-events']);
  }
  , err => {
    this.loading = false;
    console.log("error Status = ", err);
    if (err.error.errorType == 'VALIDATION') {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: err.error.errorDetails[0].description
        }
      });
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Your request cannot be saved at this time. Please try again later"
        }
      });
    }
  
  
  });
  
  

}
editMode:boolean = false;
editEvent(){
  console.log('edit events');
// this.isAppcontentAvailable = false;
// this.editMode = true;
// if(this.editMode){
// this.editContent()
// }


}

editContent(){

  let appContentDetails = this.eventData['appContentDetails']
  if(appContentDetails.length>0){
  //  this.isAppcontentAvailable = true;
    console.log('content avail')
    this.appContentDetails = this.eventData['appContentDetails'][0];
  
    this.appContent = this.eventData['appContentDetails'][0]['appContent'];
  
  this.email = this.appContentDetails['email'];
  this.phone = this.appContentDetails['phone'];
  
    // console.log('this.appContentDetails>>>>',this.appContentDetails['email']);
    
    // this.appContentForm.get('email').patchValue(this.appContentDetails['email']);
    // this.appContentForm.get('phone').patchValue(this.appContentDetails['phone']);
  }


  this.appContentForm.controls['email'].patchValue(this.email);
  this.appContentForm.controls['phone'].patchValue(this.phone);

}




eventstatus:boolean;
sendForapproveEvent(){
this.eventstatus = true;
//  let data = {
//   "eventId":eventOid,
//   "languageCode":"en"
// }
let data = {
    "eventId":this.eventIdinResponse
}

this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/send_event_for_approval',data).subscribe(res => {
 

  this.eventstatus = false;

this.snackBar.openFromComponent(SnackBarComponent, {
  duration: 2000,
  data: {
    status: "success",
    message: "Event is successfully  sent for approval"
  }
});

this.router.navigate(['/search-events']);

},err=>{
  console.log(err);
  this.eventstatus = false;

  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 10000,
    data: {
      status: "failure",
      message: "Your request cannot be saved at this time. Please try again later"
    }
  });
})


}

approveEvent(){
  this.eventstatus = true;
  //  let data = {
  //   "eventId":eventOid,
  //   "languageCode":"en"
  // }
  let data = {
    ///  "eventId":this.eventIdinResponse;

      "eventId":this.eventIdinResponse,
      "languageCode":"en"
   
  }
  //http://182.72.208.172:3015/rest/api/v1/event_admin/approve_event

  this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/approve_event',data).subscribe(res => {
  
    this.eventstatus = false;
  
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 2000,
    data: {
      status: "success",
      message: "Event Approved Successfully!"
    }
  });
  
  this.router.navigate(['/search-events']);
  
  },err=>{
    console.log(err);
    this.eventstatus = false;
  
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 10000,
      data: {
        status: "failure",
        message: "Your request cannot be saved at this time. Please try again later"
      }
    });
  })
  
}


getAllCountries() {
  const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
  this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
    console.log('GET_ALL_COUNTRIES list',res);
                this.countryCode = res[0]['countryCode'];
  }, err => {
    console.log(err);
  });
}

}