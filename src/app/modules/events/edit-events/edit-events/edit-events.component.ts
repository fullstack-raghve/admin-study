import { Component, ElementRef, OnInit, ViewChild,AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSlideToggleChange, MatSnackBar } from '@angular/material';
//import {MatTableDataSource} from '@angular/material/table';
//import { MatPaginator, MatSort } from '@angular/material';
//import {MatPaginator} from '@angular/material/paginator';
import { MatTabsModule } from "@angular/material";
import { MatPaginator, MatSort, MatTable, MatTableDataSource, Sort } from '@angular/material';

import * as moment from 'moment';
import { HttpService } from 'src/app/services/http-service';
import { UploadFile } from '../../../../services/uploadFile.service';
import { selectStoreDialog } from 'src/app/shared/components/select-store-dialog/select-store.component';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { environment } from 'src/environments/environment';
import { addCouponDialog } from 'src/app/shared/components/coupon-dialog/add-coupon.component';
import { SelectLocationDialogComponent } from '../../select-location-dialog/select-location-dialog.component';
import { UserLocationDialogComponent } from '../../user-location-dialog/user-location-dialog.component';
import { GiftingLimitDialogComponent } from '../../gifting-limit-dialog/gifting-limit-dialog.component';
/////import { SelectProductDialogComponent } from 'src/app/shared/components/select-product-dialog/select-product-dialog.component';
import { SelectProductItemsDialogComponent } from '../../select-product-items-dialog/select-product-items-dialog.component';
import { SelectCouponDialogeComponent } from '../../select-coupon-dialoge/select-coupon-dialoge.component';
import { EventsStoreDialogComponent } from '../../events-store-dialog/events-store-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ExtraValidators } from 'src/app/services/validator-service';
import { ViewGiftingLimitComponent } from '../../view-gifting-limit/view-gifting-limit.component';
import { EditGiftingLimitDialogComponent } from '../../edit-gifting-limit-dialog/edit-gifting-limit-dialog.component';
import { filter } from 'rxjs/operators';


export class Color {

  $primary = '#2ebce6';
  $secondary = '#e53935';
  $normal = '#757575';
}

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.scss'],
  encapsulation: ViewEncapsulation.None,

})

export class EditEventsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
    title: 'Events',
    link: ''
  },
  {
    title: 'Edit Event',
    link: '/edit-event'
  }
  ];
  locationDetails = [];
  isMarkDefault : boolean = false;
  public Editable = true;
  updateEventForm:FormGroup;
  alignCss = [];
  color = new Color();
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public currentDate;
  public minEndDate;
  public endDateError = null;
  public selectedStorearray = [];
  public selectedCouponArray = [];
  public selectedUserArray = [];
  public storeCount: any = 5000;
  public selectedCount = 0;
  //public skuRequired = false;
  public totalCount: [];
  public selectStoreVal = false;
  public dataStore: boolean = false;
  public storeErrorMsg;
  public storeRequiredFiled = false;
  public selectedStore = [];
  CurrencyCode=[];
  programKeywordVAlues = [];
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  uploadedFile: File;
  skuXslFileName: string;
  addProgramArray=[];
  programname: any;
  CouponArray=[];
  LocationArray = [];
  selectedStatus:  number ;  
  public videoSRCUrl:any  = [];

  //COUPON_DATA = []
  public couponGiftingType: boolean = true;
  public programGiftingType: boolean = false;
  public productGiftingType: boolean = false;
  displayedColumns: string[] = ['couponId', 'couponTitle', 'discountType', 'discountValue', 'startDate','endDate','remove'];
  displayedColumn: string[] = ['location', 'countryName', 'cityName', 'remove'];
  userdisplayedColumn: string[] = ['userId', 'userName', 'gifting', 'remove'];

  dataSource: MatTableDataSource<any>;
  mydataSource: MatTableDataSource<any>;
  userdataSource: MatTableDataSource<any>;

  coupondataSource: MatTableDataSource<any>;
 // public mynewdataSource;
  public newlocationDetails = [];
  MinValCondition = false;

  selectedIndex: number = 0;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatTable) tablenew: MatTable<any>;
  @ViewChild('uploadEl') uploadElRef: ElementRef;

  public imgUpload = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('firstPaginator') firstPaginator: MatPaginator;
  @ViewChild('secondPaginator') secondPaginator: MatPaginator;


  @ViewChild(MatSort) sortnew: MatSort;
  @ViewChild(MatSort) sorttwo: MatSort;

  programGridVal: any[];

  public checked: boolean = true;
  public toggleVal: boolean;

  selectedBrandOptions: any[];
  brandList: any[];
  selectedLocation: any;
  ul: any;
  productDropdown: any;
  productDropdownnew = [];

  //productDropdown: ({ productId: number; productName: string; pId?: undefined; } | { pId: number; productName: string; productId?: undefined; })[];
  programMinvalue: any;
  productMinvalue: any;
  minValueErrorProd: boolean;
  ProgramMinError: boolean;
  minValueErrorProd2: boolean =false;
  ProgramMinError2: boolean;
  isPreptual: boolean;
  isDOCAPP: boolean;
  isDafultEvent: boolean;
  eventDetails: any;
  giftingTypeis: any;
  GiftingDetails: any;
  updateContentForm:FormGroup;
  public imageOrVideoUrl;
  public uploadFlag = [];
  public uploadFlag1 = [];
  public uploadError = [];
  public uploadError1 = [];
  @ViewChild('uploadEl1') uploadElRef1: ElementRef;

  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public noEdit = false;

  public imageUploading: boolean = false;
  public imagePath: any = [];
  public imagePath1: any = [];
  public statusValue: string = 'ONLINE';
  //public toggleVal: boolean = true;
  imageErrMsg: string;
  brandDropdown:any;
  gifting_type_zero: any;
  gifting_type_one: any;
  gifting_type_two: any;
  isCouponGifting: any;
  isProgramGifting: any;
  isProductGifting: any;
  alllocationDetails: any;
  allUser: any;
  eventOid: number;
  event_coupon_gifting_view: any;
  allCouponList:any = [];
  allLocationList:any = [];
  allUserList:any = [];
 /// public selectedUserArray = [];

 couponsgiftingLimitsArry: any = [];
 programgiftingLimitsArry: any = [];
 productgiftingLimitsArry: any = [];

  allCouponListnew;
  event_program_gifting_view: any;
  allProgram: any[];
  programMaxiEventval: any;
  minValueError2: boolean;
  programMaxiPerStoreval: any;
  public addProgramResNew  = [];
  brandId: any;
  noUserGifitng: boolean;
  public insertProductArray = [];
  approvalStatus: any;
  loaderStart: boolean;
  couponLength: any;
  programLength: any;
  productLength: any;
  appContentDetails: any;
  displayEventOnCustomerApp: any;
  public uploadErrorVid = [];
  public uploadFlagVid = [];
  countryCode: any;
  usersGifting: any;
  index: number;
  insertProductArrayNew: any[];
  skulistDetails: any;

  constructor(private fb:FormBuilder,
    public dialog: MatDialog,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private uploadFile: UploadFile,
    private activatedRoute: ActivatedRoute,
    private router: Router,

    ) {
    this.currentDate = new Date();
    this.minEndDate = new Date();
    this.dataSource = new MatTableDataSource();
    this.mydataSource = new MatTableDataSource();
    this.userdataSource = new MatTableDataSource();
    this.coupondataSource = new MatTableDataSource();
  }










  ngOnInit() {
    let eventOid = this.activatedRoute.snapshot.params.id;
    this.eventOid = +eventOid;
   // this.selectedStatus = 1;

   this.getStore();
     this.viewSelectedEvent(this.eventOid);
     this.myProgram()
   // this.editJsonData();
   
  // this.updateAppContentEventForm();


  //  this.giftLanguageList();
  //  this.conditionFormArray();
   // this.LocationFormList();
   // this.CouponFormList();

   // this.addProgram();
   // this.ProgramInserFormList();
   /// this.getBrandCategory();

  //  this.appContentLanguageList();
   // this.bannersLocaleBean();

    this.myProgram();
  //  this.myProductDropdown();

  this.getAllCountries();
  }


  buildFlag:boolean;
  buildFlagApp:boolean;

   buildEventForm(eventData) {
    this.buildFlag = true;

//console.log('event data',eventData)
    let form = {
      giftLanguageList: this.fb.array([]),
      conditionArray: this.fb.array([]),

      startDate: [eventData['startDate'],Validators.compose([Validators.required])],
      startTime: [this.strtTime,Validators.compose([Validators.required])],
     // endDate: [eventData['endDate'],Validators.compose([Validators.required])],
      //endTime: [this.closetime,Validators.compose([Validators.required])],

      endDate: [eventData['endDate'] ? eventData['endDate'] : '', Validators.compose([ExtraValidators.conditional(group => this.isPreptual === false, Validators.required)])],
      endTime: [this.closetime ? this.closetime : '', Validators.compose([ExtraValidators.conditional(group => this.isPreptual === false, Validators.required)])],

      isPreptual: [this.isPreptual],
      eventdesc: [eventData['description'] ? eventData['description'] : ''],
      isDefaultEvent: [this.isDafultEvent,Validators.compose([Validators.required])],
      apptitle:  [eventData['storeAppContent']['title'] ? eventData['storeAppContent']['title'] : ''],
      appdesc: [eventData['storeAppContent']['description'] ? eventData['storeAppContent']['description'] : ''],
      isDisplayEvent: [eventData['displayEventOnCustomerApp'] == 'YES' ? true : false,Validators.compose([Validators.required])],
      brandDropdowncontrol:['',Validators.compose([Validators.required])],
      storeId:[''],
      moreThenOneCouponAllow: [eventData['multiple_coupon_allowed'],Validators.compose([Validators.required])],
      isCouponsEnabled:[eventData['event_coupon_gifting_view'].length !=0 ? true : false] ,
      enableProduct:[eventData['event_product_gifting_view'].length !=0 ? true : false] ,
      enableProgram:[eventData['event_program_gifting_view'].length !=0 ? true : false] ,
      Brand:[''],
      moreThanOneGiftProduct:[''],
     // locationName: [''],
     // SelectedBrands: [this.toppingList],
     // LocationFormList :this.fb.array([]),
     // CouponFormList: this.fb.array([]),
      usersFormList: this.fb.array([]),
      ProgramFormList: this.fb.array([]),
      ProductFormList: this.fb.array([]),
    //  ProgramInserFormList: this.fb.array([]),
     // isPushNotify:['',Validators.compose([Validators.required])],
      ///isSMS:['',Validators.compose([Validators.required])]
    }
    this.updateEventForm = this.fb.group(form);

   // this.updateEventForm.get('brandDropdowncontrol').setValue(this.eventData["brandName"]);

   // this.updateEventForm.get("startTime").setValue("1");

    this.ProgramFormList();
    this.ProductFormList();
  if(this.isPreptual){
    this.updateEventForm.controls['endDate'].disable();
    this.updateEventForm.controls['endTime'].disable();
  }
  }

  updateAppContentEventForm(eventData){
    this.buildFlagApp = true;
    let form = {
      appContentLanguageList: this.fb.array([]),
     // bannersLocaleBean: this.fb.array([]),
      imgVidoUrl: this.fb.array([]),
      videoURL: this.fb.array([]),
       videoUpload:this.fb.array([]),   
          imageOrVideoUrl: ['',Validators.required],
     // email: [eventData['email'] ? eventData['email'] : '',Validators.compose([Validators.required])],
      email: [eventData['email'] ? eventData['email'] : '', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: [eventData['phone'] ? eventData['phone'] : '',Validators.compose([Validators.required])]
    }
      this.updateContentForm = this.fb.group(form);

      // for (let l of this.languageList) {
      //   this.uploadFlag.push(false);
      //   this.uploadError.push(false);
      //   this.imagePath.push('');
      // }
      for (let l of this.languageList) {
        this.uploadFlag.push(false);
        this.uploadError.push(false);

        this.imagePath.push('');
        this.videoSRCUrl.push('');

        this.uploadFlagVid.push(false);
        this.uploadErrorVid.push(false);

      }


      for (let i = 0; i < eventData.appContent.length; i++) {
        this.imagePath[i] = eventData.appContent[i].image;

        if (this.imagePath[i] != ''){
          this.uploadFlag[i] = true

        }
      }

      for (let i = 0; i < eventData.appContent.length; i++) {
        this.videoSRCUrl[i] = eventData.appContent[i].videoUpload;

        if (this.videoSRCUrl[i] != ''){
          this.uploadFlagVid[i] = true

        }
      }


      this.appContentLanguageList(eventData);
    //  this.bannersLocaleBean(eventData);
      this.imgVidoUrl();
      this.videoURL(eventData);
      this.videoUpload();
  }
///////for add
  // public giftLanguageList() {
  //   const control = <FormArray>this.updateEventForm.controls['giftLanguageList'];
  //   for (let i = 0; i < this.languageList.length; i++) {
  //     let newForm = this.fb.group({
  //       languageCode: this.languageList[i]['languageCode'],
  //       eventName: ['', Validators.required]
  //     });
  //     control.push(newForm);
  //     this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
  //   }
  // }

  ////for edit
  public giftLanguageList(eventData) {
    const control = <FormArray>this.updateEventForm.controls['giftLanguageList'];
    for (let i = 0; i < eventData['eventName'].length; i++) {
      let newForm = this.fb.group({
        languageCode: eventData['eventName'][i]['languageCode'],
        eventField: [eventData['eventName'][i]['eventName'], Validators.required]
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  public appContentLanguageList(eventData) {
    console.log('apcontent>>>',eventData)
    const control = <FormArray>this.updateContentForm.controls['appContentLanguageList'];
    for (let i = 0; i < eventData['appContent'].length; i++) {
      let newForm = this.fb.group({
        languageName: eventData['appContent'][i]['languageName'],

        languageCode: eventData['appContent'][i]['languageCode'],
        eventFieldApp: [eventData['appContent'][i]['content'], Validators.required]
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }
  public videoURL(eventData) {
    console.log('apcontent videoURL>>>',eventData)

    const control = <FormArray>this.updateContentForm.controls['videoURL'];
    for (let i = 0; i < eventData['appContent'].length; i++) {
      const newForm = this.fb.group({
        languageCode: this.languageList[i]['languageCode'],
         videolink: [eventData['appContent'][i]['videoLink'],Validators.compose([Validators.required, Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }
  public bannersLocaleBean(eventData) {
    const control = <FormArray>this.updateContentForm.controls['bannersLocaleBean'];
    for (let i = 0; i < this.languageList.length; i++) {
      const newForm = this.fb.group({
       // imgBanner:   eventData['appContent'][i]['image'],
        imgBanner:[''],
       // videoUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
      });
      control.push(newForm);
   //   this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }



  
  public videoUpload() {
    const control = <FormArray>this.updateContentForm.controls['videoUpload'];
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


  // public conditionFormArray() {
  //   const control = <FormArray>this.updateEventForm.controls['conditionArray'];
  //   for (let i = 0; i < this.languageList.length; i++) {
  //     let newForm = this.fb.group({
  //       languageCode: this.languageList[i]['languageCode'],
  //       termAndCondition: ['']
  //     });
  //     control.push(newForm);
  //   }
  // }

  public conditionFormArray(eventData) {
    const control = <FormArray>this.updateEventForm.controls['conditionArray'];
    for (let i = 0; i < eventData['eventName'].length; i++) {
      let newForm = this.fb.group({
        languageCode: eventData['eventName'][i]['languageCode'],
        languageName: eventData['eventName'][i]['languageName'],
        termAndCondition: eventData['eventName'][i]['termAndCondition']
      });
      control.push(newForm);
    }
  }
/////validate calender

  setEndDate(formData) {
    let startDate = moment(formData.startDate);
    if (formData.endDate != null && formData.endDate != '') {
      let endDate = moment(formData.endDate);
      if (moment(endDate) < moment(startDate)) {
        this.endDateError = true;
      } else {
        this.endDateError = false;
      }
    }
    this.minEndDate = formData.startDate;
  }

  selectedBrands(eventData){
    this.http.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands")
     .subscribe(response => {
    // console.log('brandss>>>',response);
     if(response){

       let filteritem =  response.filter(item=>item.brandId != null);
       this.brandDropdown = filteritem;
      // console.log('brandDropdown----',this.brandDropdown);
      // console.log('eventData["brandName"]----',eventData["brandName"]);

      //  let f_b =  filteritem.filter(item=>item.brandName == eventData["brandName"]);
      //  console.log('f_b----',f_b);
      let f_b =  this.brandDropdown.filter(item=>item.brandName == eventData["brandName"]);
        this.brandId = f_b[0]['brandId'];

       this.updateEventForm.get('brandDropdowncontrol').setValue(eventData["brandName"]);
       // this.brandDropdown.forEach(res => {
       //   this.allBrands.push({
       //     "brandName": res. brandName,
       //     "value": res.brandId
       //   });
       // });

      }

     });

   }

   myProgram(){
  

    this.http.getJson(environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programs?publishStatus=LIVE")
    .subscribe(response => {
    //console.log('allProgram>>>',response);
    if(response){
      this.allProgram = response;
    }
 
    });
  }



  changeProgram(programid){
    console.log('programid',programid);

}

get PC(){
  return (<FormArray>this.updateEventForm.get("ProgramFormList")).at(0);

}
// get Prd(){
//   return (<FormArray>this.updateEventForm.get("ProductFormList")).at(0);

// }

get programMinVal() {

  return (<FormArray>this.updateEventForm.get('ProgramFormList')).controls;  
}

get programManVal() {
  return <FormArray>this.updateEventForm.get('ProgramFormList');
}
programMaxiEvent(event){
  this.programMaxiEventval = event.target.value;
   this.PC.get("programMaxiPerStore").reset();
   this.PC.get("programmaxiPerLocation").reset();

  if(+this.programMaxiEventval<1){
    this.minValueError2  = true;
    this.PC.get("programMaxiEvent").setErrors({ 'incorrect': true});
    this.PC.get("programMaxiEvent").markAsTouched();
  }

}
programMaxiPerStore(event){
  this.programMaxiPerStoreval = event.target.value;
 // this.PC.get("programmaxiPerLocation").reset();

  if(+event.target.value >= +this.programMaxiEventval){
    this.PC.get("programMaxiPerStore").setErrors({ 'incorrect': true});
    this.PC.get("programMaxiPerStore").markAsTouched();
  }
}
programmaxiPerLocation(event){
  let val = event.target.value;
 // console.log('this.programMaxiEventval',this.programMaxiEventval)
  if(+val >= +this.programMaxiEventval){
    this.PC.get("programmaxiPerLocation").setErrors({ 'incorrect': true});
    this.PC.get("programmaxiPerLocation").markAsTouched();
  }
}



  ///program -range -method
  CheckProgramRange(event){
    if(event.checked){
  
      this.Editable = false;
      this.isMarkDefault = true;
  
      this.PC.get("programMinValue").setValidators([Validators.required]);
      this.PC.get("programMaxValue").setValidators([Validators.required]);
  
      this.PC.get('programMinValue').updateValueAndValidity();
      this.PC.get('programMaxValue').updateValueAndValidity();
  
      this.PC.get('programKeywordVAlues').clearValidators();
      this.PC.get('programKeywordVAlues').updateValueAndValidity();
  
    }else{
      this.Editable = true;
      this.isMarkDefault = false;
     
  
      this.PC.get("programMinValue").reset();
      this.PC.get("programMaxValue").reset();
  
   
      this.PC.get("programMinValue").clearValidators();
      this.PC.get("programMaxValue").clearValidators();
  
      this.PC.get('programMinValue').updateValueAndValidity();
      this.PC.get('programMaxValue').updateValueAndValidity();
  
    
     }
      
    }
  // add Program
  public disableBtn:boolean;
   insertProgram():void{
   // event.stopPropagation();

   // console.log('programKeywordVAlues',this.programKeywordVAlues);
    
  let formData=this.updateEventForm.controls['ProgramFormList'].value
    
    ///console.log(this.updateEventForm.controls['ProgramFormList'].value);
//console.log('range', formData[0]['rangeOfProgram']);
console.log('formData',formData);


if(this.programKeywordVAlues.length>0){
  this.PC.get('programKeywordVAlues').clearValidators();
  this.PC.get('programKeywordVAlues').updateValueAndValidity();
}else{

  if(formData[0]['rangeOfProgram']){

  }else{
    this.PC.get('programKeywordVAlues').setErrors({'incorrect': true});
    this.PC.get('programKeywordVAlues').markAsTouched();
    return;
  }



}

//console.log('all program',this.allProgram);
let selectedProgramdata = this.allProgram.filter(data => +data.programId === +formData[0]['programId'])

    let data2 = {
      
        "programOid": +formData[0]['programId'],
        "rewardType":selectedProgramdata[0]['rewardType'],
         "valueType": "both",
        "maxNumOfValues":this.programKeywordVAlues,
        "maxPerStorePerDay":Number(formData[0]['programMaxiPerStore']),
        "maxPerLocationPerDay": +formData[0]['programmaxiPerLocation'],
        "languageCode":"en",
        "rangeValueSelection": formData[0]['rangeOfProgram'] ? 'True' : 'False',
        "minValue": +formData[0]['rangeOfProgram'] ? +formData[0]['programMinValue'] : null, 
        "maxValue":+formData[0]['rangeOfProgram'] ? +formData[0]['programMaxValue'] : null, 
        "maxperEvent": Number(formData[0]['programMaxiEvent']),
       }
     // console.log('req body new',data2);
    
    
    let data={
      "programId": formData[0]['programId'],
      "valueType": "both",
      "maxNumOfValues":this.programKeywordVAlues,
      "maxForEvent": Number(formData[0]['programMaxiEvent']),
      "maxPerStorePerDay":Number(formData[0]['programMaxiPerStore']),
      "maxPerLocationPerDay": formData[0]['programmaxiPerLocation'],
      "languageCode":"en",
    //  "currency": formData[0]['programCurrency'],
      "rangeValueSelection": "True",
      "minValue":formData[0]['programMinValue'],
      "maxValue":formData[0]['programMaxValue']
     }
   //  console.log('ADD PROGRAM REQ BODY',data);

     if(this.updateEventForm.controls['ProgramFormList'].valid){

       this.disableBtn = true;
     // console.log('program form is  valid');
     // let url = 'http://182.72.208.172:3015/rest/api/v1/event_admin/add_program'
      this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/add_program',data2).subscribe(res => {
       //   console.log('res of add prgrm',res);
          this.disableBtn = false;
         // this.addProgramRes  = res['output'];
         let data = res['output'];
         //this.event_program_gifting_view.push(data[0])
         // this.addProgramResNew.push(data[0])
        ///  console.log('addProgramResNew',res);
        ///  console.log('event_program_gifting_view',this.event_program_gifting_view);


          this.addProgramResNew.push(data[0])
        //  console.log('addProgramResNew',this.addProgramResNew);

          this.addProgramResNew.map(res=>{
            res['pointorstamp'] = res['point&Stamp']
          })

          this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['programId'].patchValue('');
          this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['programKeywordVAlues'].patchValue('');
          this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMinValue'].patchValue('');
          this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMaxValue'].patchValue('');

          this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMaxiEvent'].patchValue('');
          this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMaxiPerStore'].patchValue('');
          this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['programmaxiPerLocation'].patchValue('');

     this.programKeywordVAlues.length = 0;


         // this.updateEventForm['controls']['ProgramFormList']['controls'][0]['controls']['rewardType'].patchValue(res['output'][0]['rewardType']);

     });


     }else{
       console.log('program form is not valid');
     }
  }




public CouponFormList() {
  const control = <FormArray>this.updateEventForm.controls['CouponFormList'];
  let newForm = this.fb.group({
    moreThenOneGiftAllowed: [''],
    couponID: [''],

  });
  control.push(newForm);

}

public LocationFormList() {
  const control = <FormArray>this.updateEventForm.controls['LocationFormList'];
  let newForm = this.fb.group({
    //moreThenOneGiftAllowed: [''],
    locationName: [''],
    SelectedBrands: ['']
  });
  control.push(newForm);
}

public usersFormList(){
  const control = <FormArray>this.updateEventForm.controls['usersFormList'];
  let newForm = this.fb.group({
    //moreThenOneGiftAllowed: [''],
    userId: [''],
    UserGiftingLimit: ['']
  });
  control.push(newForm);

}




public ProgramFormList() {
  // console.log(this.addProgramArray);
  const control = <FormArray>this.updateEventForm.controls['ProgramFormList'];

  // this.addProgram()
  let newForm = this.fb.group({
    programId: ['', Validators.compose([Validators.required])],  
    rangeOfProgram:[''],
  //  programKeywordVAlues: ['', Validators.compose([ExtraValidators.conditional(group => this.programKeywordVAlues.length === 0, Validators.required)])],

    programKeywordVAlues: [''],
    programMinValue:[''],
    programMaxValue:[''],
    // programMinValue:['',Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
    // programMaxValue:['',Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
    programMaxiEvent: ['', Validators.compose([Validators.required])],
    programMaxiPerStore: ['', Validators.compose([Validators.required])],
    programmaxiPerLocation: ['', Validators.compose([Validators.required])],

  });
  control.push(newForm);

}

//////product section//////
public ProductFormList() {
  const control = <FormArray>this.updateEventForm.controls['ProductFormList'];
  let newForm = this.fb.group({
   // currency: [''],
 //   sku: [''],
 defineProduct:['', Validators.compose([Validators.required])],
 prodRangeValueSelection:[''],
 productMinVal: [''],
 productMaxVal: [''],

    maxDenomination: [''],
    prodructMaxiEvent: ['', Validators.compose([Validators.required])],
    productMaxiPerStore: ['', Validators.compose([Validators.required])],
  
    productmaxiPerLocation: ['', Validators.compose([Validators.required])],
   // productCurrency:[],
   // enableProduct:[],
   // prodRangeValueSelection:[]
  });
  control.push(newForm);

}



deleteProgramFixedValue(i:number){
  this.programKeywordVAlues.splice(i,1)

}






// public removeOrderType(combotype){
//   console.log(combotype)
//   const control = <FormArray>this.updateEventForm.controls['ProgramFormList'];
//   console.log(control)
//   while (control.length) {
//     control.removeAt(control.length-1);
//   }
// }


public showKeyword(keyword: HTMLInputElement) {
  if (this.programKeywordVAlues.length < 5) {
    if (this.programKeywordVAlues.includes(keyword.value)) {

    }
    else {
      // this.keywordStatus = true;
      if(keyword.value<'1'){
        // this.keywordError=true;
        if(keyword.value==''){
          // this.keywordStatus = false;
          // this.keywordError=false;
          // this.secondCon=false;
        }
      }
      if(keyword.value>'0'){
        // this.keywordError=false;
        this.programKeywordVAlues.push(keyword.value);
        keyword.value = '';
      }

    }

  }
  // else {
  //   this.keywordStatus = true;
  //   this.updateEventForm.get('keywords').clearValidators();
  //   this.updateEventForm.get('keywords').updateValueAndValidity();
  //   setTimeout(() => {
  //     this.keywordStatus = false;
  //   }, 2000);

  // }
}


// if (this.paymentform.invalid) {
//   for (let i in this.paymentform.controls)
//     this.paymentform.controls[i].markAsTouched();

//   return;
// }

  // add Program
//   addProgram(){
//     console.log('programKeywordVAlues',this.programKeywordVAlues);
//    let programRange =   this.programControls.get('programRange').value;


//    let myForm = (<FormArray>this.updateEventForm.get("ProgramFormList")).at(0);


//  if(programRange){
//   this.programControls.get('programMinValue').setValidators(Validators.required);
//   this.programControls.get('programMaxValue').setValidators(Validators.required);
//   this.programControls.get('programMaxValue').updateValueAndValidity();
//   this.programControls.get('programMinValue').updateValueAndValidity();

//  }else{
//   this.programControls.get('programMinValue').clearValidators();
//   this.programControls.get('programMaxValue').clearValidators();

//  }

//   let formData=this.updateEventForm.controls['ProgramFormList'].value

//  let chkRange = formData[0]['programRange'];
//  console.log('ranges is',chkRange);

//     console.log(this.updateEventForm.controls['ProgramFormList'].value);
//     let newdata =  {
//       "programOid": 20,
//       "rewardType":"base",
//       "valueType": "both",
//       "maxNumOfValues":[100,50,400],
//       "maxPerStorePerDay":5,
//       "maxPerLocationPerDay": 1000,
//       "languageCode":"en",
//       "rangeValueSelection": "True",
//       "minValue":100,
//       "maxValue": 1000 ,
//        "maxperEvent": 100
//      }

//     let data={
//       "programId": formData[0]['programId'],
//       "valueType": "both",
//       "maxNumOfValues":this.programKeywordVAlues,
//       "maxForEvent": Number(formData[0]['programMaxiEvent']),
//       "maxPerStorePerDay":Number(formData[0]['programMaxiPerStore']),
//       "maxPerLocationPerDay": formData[0]['programmaxiPerLocation'],
//       "languageCode":"en",
//       "rangeValueSelection": "True",
//       "minValue":formData[0]['programMinValue'],
//       "maxValue":formData[0]['programMaxValue']
//      }
//      console.log('ADD PROGRAM REQ BODY',data);

//      if(this.updateEventForm.controls['ProgramFormList'].valid){
//     console.log(JSON.stringify(data));
//     this.http.postCustomizeJson('https://uoieiz443h.execute-api.ap-south-1.amazonaws.com/eventgifting_sit/rest/api/v1/event_admin/add_program', data).subscribe(res => {
//      console.log('ADD PROGRAM REQ RES1',res['output']);
//      console.log('ADD PROGRAM REQ RES2',JSON.stringify(res['output']));
//      this.addProgramArray=res['output'];
//      this.programname=res['output'][0]['programName']
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['programName'].patchValue(this.programname);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['rewardType'].patchValue(res['output'][0]['rewardType']);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['pointsOrStamps'].patchValue(res['output'][0]['point&Stamp']);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['denominations'].patchValue(res['output'][0]['denominations']);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['startRange'].patchValue(res['output'][0]['startRange']);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['endRange'].patchValue(res['output'][0]['endRange']);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['maxEvent'].patchValue(res['output'][0]['maxForEvent']);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['balEvent'].patchValue(res['output'][0]['balanceForEvent']);
//      this.updateEventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['maxStore'].patchValue(res['output'][0]['maxPerStorePerDay']);

//     })
//   }
//   }
// insertProduct(){
//  let productRange =   this.productControls.get('prodRangeValueSelection').value;
//  if(productRange){
//   this.productControls.get('productMinVal').setValidators(Validators.required);
//   this.productControls.get('productMaxVal').setValidators(Validators.required);
//   this.productControls.get('productMaxVal').updateValueAndValidity();
//   this.productControls.get('productMinVal').updateValueAndValidity();

//  }else{
//   this.productControls.get('productMinVal').clearValidators();
//   this.productControls.get('productMaxVal').clearValidators();

//  }


// }

//////product section//////
// public ProductFormList() {
//   const control = <FormArray>this.updateEventForm.controls['ProductFormList'];
//   let newForm = this.fb.group({
//     sku: [''],
//     maxDenomination: ['', Validators.compose([Validators.required])],
//     prodructMaxiEvent: ['', Validators.compose([Validators.required])],
//     productMaxiPerStore: ['', Validators.compose([Validators.required])],
//     prodRangeValueSelection:['', Validators.compose([Validators.required])],
//     productMinVal: ['',Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
//     productMaxVal: ['',Validators.compose([Validators.required,Validators.minLength(1),Validators.pattern("^[1-9][0-9]*")])],
//     productmaxiPerLocation: ['', Validators.compose([Validators.required])],
//     moreThanOneGiftProduct:[''],
//      defineProduct:['', Validators.compose([Validators.required])],

//   });
//   control.push(newForm);

// }
////slect prodcut county
changeCountry(data){
alert(data);
}

////////select store popup///////

  openSoreDialog() {
    ///const dialogRef = this.dialog.open(selectStoreDialog);
    const dialogRef = this.dialog.open(EventsStoreDialogComponent);
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.totalCount = this.storeCount;
    dialogRef.afterClosed().subscribe(result => {
    //  console.log('result>>>',result)
      if (result.buttonName === 'SELECT') {
        //this.selectedStorearray = [];
        this.selectedCount = result.tableData.length;
        this.totalCount = result.totalCount;
        for (let i = 0; i < result.tableData.length; i++) {
          this.selectedStorearray.push(result.tableData[i].storeOid);
          const arrrayTemp = this.selectedStorearray;
          this.selectedStorearray = Array.from(new Set(arrrayTemp));
          console.log('storeId',this.selectedStorearray);
          if (this.selectedStorearray.length) {
            this.selectStoreVal = true;
            this.dataStore = false;
            setTimeout(() => {
              this.selectStoreVal = false;
              if (this.selectStoreVal == false) {
                this.dataStore = true;
              }
            }, 1000);
          }
        }
        if (this.selectedStorearray.length != 0) {
          this.storeRequiredFiled = false;
          this.storeErrorMsg = "Please select Store";
        }
      }
    });
  }

////////select store popup end///////


//////////add location in grid start ///////

public selectedLocationarray = [];
addLocation() {
    const dialogRef = this.dialog.open(SelectLocationDialogComponent);
    dialogRef.componentInstance.locationitem = this.selectedLocationarray;

    dialogRef.afterClosed().subscribe(result => {
     this.selectedLocation = result;
      let arrayFromPopUp =result.tableData;
     if (result.buttonName === 'SELECT') {
      this.selectedLocationarray = [];
         this.allLocationList = [];
      for (let i = 0; i < arrayFromPopUp.length; i++) {

        this.allLocationList.push(arrayFromPopUp[i]);
       this.selectedLocationarray.push(arrayFromPopUp[i].locationOid);
       const arrrayTempw = this.selectedLocationarray;
       this.selectedLocationarray = Array.from(new Set(arrrayTempw));
       console.log('location id',this.selectedLocationarray);

      }
  }

       this.mydataSource = new MatTableDataSource<any>(this.allLocationList);
       this.mydataSource.paginator = this.paginator;
       this.mydataSource.sort = this.sort;


  });
}

removeAllLocation() {
  this.mydataSource.data = [];
  this.selectedLocationarray = [];
  this.allLocationList = [];
}
removeLocationAt(index: number) {
  let data = this.mydataSource.data;
  data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
  this.mydataSource.data = data;


  this.selectedLocationarray.splice(index, 1);
  this.allLocationList.splice(index, 1);

  //console.log('location id UPDATED',this.selectedLocationarray);


}
//////////add location in grid end ///////

////////////add coupon in grid start////////////
public finalCouponArray=[];
addCoupon() {
  const dialogRef = this.dialog.open(SelectCouponDialogeComponent);
  dialogRef.componentInstance.getCoupons = this.selectedCouponArray;
  dialogRef.afterClosed().subscribe(result => {
  ///  this.CouponArray = result.tableData;
     let tableData = result.tableData;

    if (result.buttonName === 'SELECT') {
      this.selectedCouponArray = [];
      this.allCouponList = [];

      for (let i = 0; i < tableData.length; i++) {
        this.allCouponList.push(tableData[i]);

       this.selectedCouponArray.push(tableData[i].couponId);
       const arrrayTempw = this.selectedCouponArray;
       this.selectedCouponArray = Array.from(new Set(arrrayTempw));
       console.log('selectedCouponArray id',this.selectedCouponArray);

      }

      this.keepOnlySelectedCoupon(this.selectedCouponArray)

         }


         this.coupondataSource = new MatTableDataSource<any>(this.allCouponList);
         this.coupondataSource.paginator = this.secondPaginator;
         this.coupondataSource.sort = this.sorttwo;
        // this.finalCouponArray.push(updatedCouponArray[0]);
  });
}
keepOnlySelectedCoupon(selectedCouponArray){
      /////push coupon id of grid in list
      // this.couponIdToDelete = [];
      // for(let i = 0;i<this.allCouponList;i++){
      //   this.couponIdToDelete.push(this.allCouponList[i]['couponId'].toString());
      // }
              console.log('selectedCouponArray',selectedCouponArray)
              console.log('FINAL_OBJ',this.FINAL_OBJ)

      ///// remove all coupons of user's gifting = which unselected on popup
      for (let i = 0; i < this.FINAL_OBJ.length; i++) {
        for (let j = 0; j < this.FINAL_OBJ[i]['couponsgiftingLimits'].length; j++) {
            let obj = this.FINAL_OBJ[i]['couponsgiftingLimits'][j];
       // console.log(obj)
            if (selectedCouponArray.indexOf(+obj['giftcode']) == -1) {
        //console.log(arrayOfObjects[i]['couponsgiftingLimits'])
               this.FINAL_OBJ[i]['couponsgiftingLimits'].splice(j, 1);
                j--;
        
            }
        }
        }

        console.log('FINAL_OBJ',this.FINAL_OBJ)
this.deleteUsersOfCoupons();
}
//////////////////////////
deleteUsersOfCoupons(){
  for (let i = 0; i < this.FINAL_OBJ.length; i++) {

    if(this.FINAL_OBJ[i]['couponsgiftingLimits'].length ==0 && this.FINAL_OBJ[i]['productgiftingLimits'].length ==0 && this.FINAL_OBJ[i]['programgiftingLimits'].length ==0){
     let userOidToDelete = this.FINAL_OBJ[i]['userOid']
  console.log('userOidToDelete',userOidToDelete)
  
     for (let i = 0; i < this.allUserList.length; i++) {
      var obj = this.allUserList[i];
  
      if (userOidToDelete.indexOf(obj.userId).toString() !== -1) {
        this.allUserList.splice(i, 1);
          i--;
      }
  }
  
      this.FINAL_OBJ.splice(i, 1);
      //this.allUserList.splice(i, 1);
  
      this.userdataSource = new MatTableDataSource<any>(this.allUserList);
      this.userdataSource.paginator = this.firstPaginator
      this.userdataSource.sort = this.sortnew;
      console.log('allUserList list',this.allUserList);
  
    ///  this.selectedUserArray.splice(i, 1); //will delete all userOid of that 

    this.selectedUserArray = this.selectedUserArray.filter(function(val){
      return (userOidToDelete.indexOf(val.toString()) == -1 ? true : false)
    })
    
    console.log('selectedUserArray>>>',this.selectedUserArray);
      console.log('FINAL_OBJ',this.FINAL_OBJ);
  
    }
  
  }

}

/////////////////////
public removedCouponArray = [];
removeAllCoupon() {
  this.coupondataSource.data = [];
  this.selectedCouponArray = [];
  this.allCouponList = [];
}
public listToDelete = [];
removeCouponAt(index: number) {
  let i = index;
  // let data = this.coupondataSource.data;
  // data.splice((this.secondPaginator.pageIndex * this.secondPaginator.pageSize) + index, 1);
  // this.coupondataSource.data = data;


  this.listToDelete = [];

 ///  this.selectedUserArray.splice(index, 1);
   let clikedRow = this.allCouponList[index];
    let clicked_couponId = clikedRow['couponId'];
    let clicked_couponIdString = clicked_couponId.toString();
    var listToDelete = ["2"];

    this.listToDelete.push(clicked_couponIdString);
console.log('listToDelete',this.listToDelete);

    if(this.listToDelete){
      //this.allCouponList = this.allCouponList.filter(item=>item.couponId != clicked_couponId);

      for (let i = 0; i < this.FINAL_OBJ.length; i++) {
        for (let j = 0; j < this.FINAL_OBJ[i]['couponsgiftingLimits'].length; j++) {
            let obj = this.FINAL_OBJ[i]['couponsgiftingLimits'][j];
       // console.log(obj)
            if (this.listToDelete.indexOf(obj['giftcode'].toString()) !== -1) {
        //console.log(arrayOfObjects[i]['couponsgiftingLimits'])
             this.FINAL_OBJ[i]['couponsgiftingLimits'].splice(j, 1);
                j--;
        
            }
        }
        }
       
    }
    console.log('after remove coupon final obj',this.FINAL_OBJ);

    let allCouponList = this.allCouponList.map(item=>{
      return {...item}
    })

    this.selectedCouponArray.splice(index, 1);

    allCouponList.splice(index, 1);
     this.allCouponList = allCouponList;

  this.coupondataSource = new MatTableDataSource<any>(this.allCouponList);
  this.coupondataSource.paginator = this.secondPaginator;
  this.coupondataSource.sort = this.sorttwo;

/////////////////////////if no coupon ,pgm & product then delete --all users from grid
this.deleteUsersOfCoupon();
/////////////////////////////

  console.log('after remove coupon final obj',this.FINAL_OBJ);

               
} 

deleteUsersOfCoupon(){

  for (let i = 0; i < this.FINAL_OBJ.length; i++) {

    if(this.FINAL_OBJ[i]['couponsgiftingLimits'].length ==0 && this.FINAL_OBJ[i]['productgiftingLimits'].length ==0 && this.FINAL_OBJ[i]['programgiftingLimits'].length ==0){
     let userOidToDelete = this.FINAL_OBJ[i]['userOid']
  console.log('userOidToDelete',userOidToDelete)
  
     for (let i = 0; i < this.allUserList.length; i++) {
      var obj = this.allUserList[i];
  
      if (userOidToDelete.indexOf(obj.userId).toString() !== -1) {
        this.allUserList.splice(i, 1);
          i--;
      }
  }
  
      this.FINAL_OBJ.splice(i, 1);
      //this.allUserList.splice(i, 1);
  
      this.userdataSource = new MatTableDataSource<any>(this.allUserList);
      this.userdataSource.paginator = this.firstPaginator
      this.userdataSource.sort = this.sortnew;
      console.log('allUserList list',this.allUserList);
  
        ///  this.selectedUserArray.splice(i, 1); //will delete all userOid of that 

        this.selectedUserArray = this.selectedUserArray.filter(function(val){
          return (userOidToDelete.indexOf(val.toString()) == -1 ? true : false)
        })
      console.log('FINAL_OBJ',this.FINAL_OBJ);
      console.log('selectedUserArray---',this.selectedUserArray);

  
    }
  
  }

}


///////////uncheck enable program 
public progrmIdToDelete
removePrograms(){

this.progrmIdToDelete = [];

  /////remove that all program unser coupon - bcoz we r disbling chkbox ///means removing all program
     // 

     for(let i = 0;i<this.addProgramResNew.length;i++){
      this.progrmIdToDelete.push(this.addProgramResNew[i]['programID'].toString())

     }
     console.log('progrmIdToDelete----', this.progrmIdToDelete);
     console.log('FINAL_OBJ----', this.FINAL_OBJ);

/////on disble checkbox , remove all program of user's gifting
for (let i = 0; i < this.FINAL_OBJ.length; i++) {
  for (let j = 0; j < this.FINAL_OBJ[i]['programgiftingLimits'].length; j++) {
      let obj = this.FINAL_OBJ[i]['programgiftingLimits'][j];
 // console.log(obj)
      if (this.progrmIdToDelete.indexOf(obj['giftcode'].toString()) !== -1) {
  //console.log(arrayOfObjects[i]['couponsgiftingLimits'])
         this.FINAL_OBJ[i]['programgiftingLimits'].splice(j, 1);
          j--;
  
      }
  }
  }

    

     this.deleteUsersOfCoupon();

     this.addProgramResNew.length = 0;
     this.programKeywordVAlues.length = 0;

     
}

public productIdToDelete
// /productOid
removeProducts(){
  this.productIdToDelete = [];

  /////remove that all product unser coupon - bcoz we r disbling chkbox ///means removing all product
     // 
     console.log('insertProductArray--',this.insertProductArray);

     for(let i = 0;i<this.insertProductArray.length;i++){
      this.productIdToDelete.push(this.insertProductArray[i]['skuCode'].toString()) ///no product id ,so will use sku

     }

       console.log('productIdToDelete--',this.productIdToDelete);
       console.log('FINAL_OBJ----',this.FINAL_OBJ);

/////on disble checkbox , remove all product of user's gifting
for (let i = 0; i < this.FINAL_OBJ.length; i++) {
  for (let j = 0; j < this.FINAL_OBJ[i]['productgiftingLimits'].length; j++) {
      let obj = this.FINAL_OBJ[i]['productgiftingLimits'][j];
 // console.log(obj)
      if (this.productIdToDelete.indexOf(obj['productOID'].toString()) !== -1) {
  //console.log(arrayOfObjects[i]['couponsgiftingLimits'])
         this.FINAL_OBJ[i]['productgiftingLimits'].splice(j, 1);
          j--;
  
      }
  }
  }

    

     this.deleteUsersOfCoupon();

     this.insertProductArray.length = 0;
     this.maxDenomination.length = 0;
     this.selectedProductarray.length = 0;

     this.removeSKU();
}

///tested code------------------------------------------

////////////add coupon in grid end////////////
public couponIdToDelete2;
isEnabledCheckbox(event,tabtype,type,couponstabGroupArray){
  if (event.checked) {
    this.updateEventForm.get(type).patchValue(true);
    console.log('checkbox checked')
   // this.titleTab(combotype);
  }else{
    this.updateEventForm.get(type).patchValue(false);
    console.log('checkbox un-checked');
    console.log('allCouponList',this.allCouponList);

    /////push coupon id of grid in list
    this.couponIdToDelete2 = [];
for(let i = 0;i<this.allCouponList.length;i++){
  this.couponIdToDelete2.push(+this.allCouponList[i]['couponID']);
}
  console.log('couponIdToDelete--',this.couponIdToDelete2)

/////on disble checkbox , remove all coupons of user's gifting
for (let i = 0; i < this.FINAL_OBJ.length; i++) {
  for (let j = 0; j < this.FINAL_OBJ[i]['couponsgiftingLimits'].length; j++) {
      let obj = this.FINAL_OBJ[i]['couponsgiftingLimits'][j];
 // console.log(obj)
      if (this.couponIdToDelete2.indexOf(+obj['giftcode']) !== -1) {
  //console.log(arrayOfObjects[i]['couponsgiftingLimits'])
         this.FINAL_OBJ[i]['couponsgiftingLimits'].splice(j, 1);
          j--;
  
      }
  }
  }
  console.log('FINAL_OBJ--',this.FINAL_OBJ)

/////on disble checkbox , remove all coupons of user's gifting -end
/////////////////////////if no coupon ,pgm & product then delete --all users from grid
this.deleteUsersOfCoupon();
/////////////////////////////

this.selectedCouponArray = [];
this.allCouponList = [];
this.coupondataSource = new MatTableDataSource<any>(this.allCouponList);
this.coupondataSource.paginator = this.secondPaginator;
this.coupondataSource.sort = this.sorttwo;

  }
}

////////// addUser in grid start//////////////
addUser() {
  const dialogRef = this.dialog.open(UserLocationDialogComponent);

  dialogRef.componentInstance.selectedUsers = this.selectedUserArray;
  dialogRef.componentInstance.getCoupons =  this.CouponArray;

  dialogRef.afterClosed().subscribe(result => {
   console.log('selected users>>>>>>',result);
   if (result.buttonName === 'SELECT') {
  ////  this.CouponArray = result.tableData
  //// this.dataSource.data = result.tableData;

  let arrayFromPopUp =result.tableData;


  let updateUser = arrayFromPopUp.map((obj)=>{
   return {...obj } ;

  })
  //this.ul = updatedLocation;
  console.log('updateUser',updateUser)

  this.userdataSource = new MatTableDataSource<any>(updateUser);
       this.userdataSource.paginator = this.firstPaginator
       this.userdataSource.sort = this.sortnew;

    if (result.buttonName === 'SELECT') {
      this.selectedUserArray = [];
      for(let i=0;i<result.tableData.length; i++){
        let Usersdata = {
          userId : result.tableData[i]['userId'],
          userName : result.tableData[i]['userName'],
        }
        this.selectedUserArray.push(result.tableData[i]['userId'])

      // let x:any =  this.selectedUserArray;

      //   this.userdataSource = new MatTableDataSource<any>(x);
      //   this.userdataSource.paginator = this.paginator;
      //   this.userdataSource.sort = this.sort;

        console.log('Usersdata',Usersdata);
        console.log('selectedUserArray',this.selectedUserArray);



       // let CId = result['tableData'][i]['couponId'];

     ////   this.selectedCouponArray.push(result.tableData[i].couponId);
      ///  const coupTemp = this.selectedCouponArray;
      ////  this.selectedCouponArray = Array.from(new Set(coupTemp));
      ////  console.log('couponId',this.selectedCouponArray);

        // this.eventGiftingFormGroup.controls['couponID'].patchValue(CId);
      ////raghve  this.updateEventForm['controls']['CouponFormList']['controls']['couponID'].patchValue(CId);
      }


      // this.CouponFormList.controls['couponTitile'].patchValue(Name)
    }
 } });
}





FINAL_OBJ_matched: any;
FINAL_OBJ_NEW: any;
FINAL_OBJ_NEW1: any;
couponResult: any;
PROGRAMResult: any;
PRODUCTResult: any;
finalObj_at_index_userOid: any;
finalObj_at_index: any = [];
userOid_length: any;
couponArray: any;
couponCount_length: any;
programArray: any;
  productArray: any;
  programCount_length: any;
  productCount_length: any;

  removeAllUser(data) {
    this.selectedUserArray = [];
    this.FINAL_OBJ = [];
    this.allUserList = [];
    this.userdataSource = new MatTableDataSource<any>(this.allUserList);
    this.userdataSource.paginator = this.firstPaginator
    this.userdataSource.sort = this.sortnew;
  }
  
removeUserAt(index: number) {

 // console.log('allUserList >>>',this.allUserList);
 // console.log('allUserList >>>',this.allUserList[index]);
 this.selectedUserArray.splice(index, 1);
  let clikedUserRow = this.allUserList[index]
   let clicked_userId = clikedUserRow['userId'];
   if(clicked_userId){
    this.allUserList = this.allUserList.filter(item=>item.userId != clicked_userId);

  //  console.log('allUserList filter>>>',this.allUserList);

    this.userdataSource = new MatTableDataSource<any>(this.allUserList);
    this.userdataSource.paginator = this.firstPaginator
    this.userdataSource.sort = this.sortnew;

let id = clicked_userId.toString();
    for(let i=0;i<this.FINAL_OBJ.length;i++){
      if(this.FINAL_OBJ[i]['userOid'].includes(id)){
        this.FINAL_OBJ_matched = this.FINAL_OBJ[i];
        this.finalObj_at_index_userOid = this.FINAL_OBJ[i]['userOid'];

        if(this.finalObj_at_index_userOid.length==1){
          this.FINAL_OBJ.splice(i,1);
          console.log('this.FINAL_OBJ splice if>>>',this.FINAL_OBJ);

        }else{
         let indx = this.FINAL_OBJ[i]['userOid'].indexOf(id);
         console.log('indx>>>',indx);

          this.FINAL_OBJ[i]['userOid'].splice(indx,1);
          console.log('this.FINAL_OBJ splice useroid else>>>',this.FINAL_OBJ);

        }

        break;

      }
    }

   }

  // let data = this.userdataSource.data;
  // data.splice((this.firstPaginator.pageIndex * this.firstPaginator.pageSize) + index, 1);
  // this.userdataSource.data = data;
  // this.selectedUserArray.splice(index, 1);


////////////------------------------------
////////REMOVE THAT USER FROM GIFTING////////////////////

return;


////////REMOVE THAT USER FROM GIFTING end////////////////////


  ///////------------------------------
}
////////// addUser in grid end//////////////


brandMssg:boolean;
LocationMssg:boolean;

InsertLocation(){
 let selectedbrand =  this.updateEventForm.controls['Brand'].value;
console.log('selected brands',selectedbrand);
console.log('selected selectedLocation',this.selectedLocation && this.selectedLocation['tableData']);

if(!this.selectedLocation){
  this.LocationMssg = true;

}else{
  this.LocationMssg = false;

  if(selectedbrand.length<1){
    this.brandMssg = true;
  }else{
    this.brandMssg = false;
    let arr = this.selectedLocation.tableData;
    console.log('arr',arr);

    //// this.mydataSource.data = arr;
     //this.mydataSource.data.push(...this.mydataSource.data,...arr);

    // this.LocationArray=result.tableData;

    let updatedLocation = arr.map((obj)=>{
    /// return obj.locationName === 'Cross Road,AI-2' ? {...obj, brands:'Gucci,Nike'} : obj;
     return {...obj, brands:selectedbrand} ;

    })
    //this.LocationArray.push(...this.LocationArray,...updatedLocation);
    console.log('updatedLocation',updatedLocation);

   this.mydataSource.data = updatedLocation;

    console.log('LocationArray',this.LocationArray);

    selectedbrand = [];

    ///if (this.selectedLocation.buttonName === 'SELECT') {
      for(let i=0;i<this.mydataSource.data.length; i++){
        console.log('bbb',this.mydataSource.data[i]);
        //let CId = result['tableData'][i]['couponId'];
        // this.eventGiftingFormGroup.controls['couponID'].patchValue(CId);
       //this.updateEventForm['controls']['CouponFormList']['controls']['couponID'].patchValue(CId);
      }


      // this.CouponFormList.controls['couponTitile'].patchValue(Name)

  }
}



}


isEnabledProgramCheckbox(event){

  if(!event.checked){
    this.updateEventForm.get('enableProgram').patchValue(false);

    const pushController = this.updateEventForm.get('ProgramFormList') as FormArray;
//for (let i = 0; i < this.languages.length; i++) {
 

  let programId = pushController.at(0).get('programId');
 // let programKeywordVAlues = pushController.at(0).get('programKeywordVAlues');
  let programMaxiEvent = pushController.at(0).get('programMaxiEvent');
  let programMaxiPerStore = pushController.at(0).get('programMaxiPerStore');
  let programmaxiPerLocation = pushController.at(0).get('programmaxiPerLocation');

  let programMinValue = pushController.at(0).get('programMinValue');
  let programMaxValue = pushController.at(0).get('programMaxValue');

  programId.clearValidators();
  programId.updateValueAndValidity();

  programMinValue.clearValidators();
  programMinValue.updateValueAndValidity();


  programMaxValue.clearValidators();
  programMaxValue.updateValueAndValidity();

  // programKeywordVAlues.clearValidators();
  // programKeywordVAlues.updateValueAndValidity();
  programMaxiEvent.clearValidators();
  programMaxiEvent.updateValueAndValidity();

  programMaxiEvent.clearValidators();
  programMaxiEvent.updateValueAndValidity();

  programMaxiPerStore.clearValidators();
  programMaxiPerStore.updateValueAndValidity();

  programmaxiPerLocation.clearValidators();
  programmaxiPerLocation.updateValueAndValidity();

  this.removePrograms();

// }

  }else{
    
    this.updateEventForm.get('enableProgram').patchValue(true);
    const pushController = this.updateEventForm.get('ProgramFormList') as FormArray;
 // for (let i = 0; i < this.languages.length; i++) {
  let programId = pushController.at(0).get('programId');
  //let programKeywordVAlues = pushController.at(0).get('programKeywordVAlues');
  let programMaxiEvent = pushController.at(0).get('programMaxiEvent');
  let programMaxiPerStore = pushController.at(0).get('programMaxiPerStore');
  let programmaxiPerLocation = pushController.at(0).get('programmaxiPerLocation');



  programId.setValidators(Validators.required);
  programId.updateValueAndValidity();

  programMaxiEvent.setValidators(Validators.required);
  programMaxiEvent.updateValueAndValidity();

  programMaxiPerStore.setValidators(Validators.required);
  programMaxiPerStore.updateValueAndValidity();

  programmaxiPerLocation.setValidators(Validators.required);
  programmaxiPerLocation.updateValueAndValidity();

}


}

isEnabledProductCheckbox(event){

  let pushController = this.updateEventForm.get('ProductFormList') as FormArray;

  let defineProduct = pushController.at(0).get('defineProduct');
  let maxDenomination = pushController.at(0).get('maxDenomination');
  let prodRangeValueSelection = pushController.at(0).get('prodRangeValueSelection');
  let prodructMaxiEvent = pushController.at(0).get('prodructMaxiEvent');
  let productMaxiPerStore = pushController.at(0).get('productMaxiPerStore');
  let productmaxiPerLocation = pushController.at(0).get('productmaxiPerLocation');

  let productMinVal = pushController.at(0).get('productMinVal');
  let productMaxVal = pushController.at(0).get('productMaxVal');


  if(!event.checked){
    this.updateEventForm.get('enableProduct').patchValue(false);
    defineProduct.clearValidators();
    defineProduct.updateValueAndValidity();

    maxDenomination.clearValidators();
    maxDenomination.updateValueAndValidity();

    prodRangeValueSelection.clearValidators();
    prodRangeValueSelection.updateValueAndValidity();

    prodructMaxiEvent.clearValidators();
    prodructMaxiEvent.updateValueAndValidity();

    productMaxiPerStore.clearValidators();
    productMaxiPerStore.updateValueAndValidity();

    productmaxiPerLocation.clearValidators();
    productmaxiPerLocation.updateValueAndValidity();

productMinVal.clearValidators();
productMinVal.updateValueAndValidity();

productMaxVal.clearValidators();
productMaxVal.updateValueAndValidity();

  this.removeProducts();

  }else{
    this.updateEventForm.get('enableProduct').patchValue(true);

    defineProduct.setValidators(Validators.required);
    defineProduct.updateValueAndValidity();

    maxDenomination.setValidators(Validators.required);
    maxDenomination.updateValueAndValidity();

    prodRangeValueSelection.setValidators(Validators.required);
    prodRangeValueSelection.updateValueAndValidity();

    prodructMaxiEvent.setValidators(Validators.required);
    prodructMaxiEvent.updateValueAndValidity();

    productMaxiPerStore.setValidators(Validators.required);
    productMaxiPerStore.updateValueAndValidity();

    productmaxiPerLocation.setValidators(Validators.required);
    productmaxiPerLocation.updateValueAndValidity();

}

}
//remove user

removeUser(index){
  this.selectedUserArray.splice(index, 1);

}

viewGifts(i){
  const dialogRef = this.dialog.open(GiftingLimitDialogComponent);
  dialogRef.afterClosed().subscribe(result => {
   console.log('gift details>>>>>>',result);

  })
}
public selectedProductarray = [];
selectProduct33(){

  const dialogRef = this.dialog.open(SelectProductItemsDialogComponent);
  dialogRef.componentInstance.productitem = this.selectedProductarray;

  dialogRef.afterClosed().subscribe(result => {
   console.log('selected product item>>>>>>',result);

   if (result.buttonName === 'SELECT') {
       this.selectedProductarray = [];
       for (let i = 0; i < result.tableData.length; i++) {
        this.selectedProductarray.push(result.tableData[i].sku);
        const arrrayTempw = this.selectedProductarray;
        this.selectedProductarray = Array.from(new Set(arrrayTempw));
        console.log('sku',this.selectedProductarray);
       }
   }
  })
}



/////add location on click

selectedTargets = [];

removeLocation(index){
//https://www.itsolutionstuff.com/post/angular-how-to-remove-element-from-arrayexample.html
this.selectedTargets.push(this.ul[index]);
this.ul.splice(index, 1);
console.log('selectedTargets',this.selectedTargets);
console.log('locationDetails',this.locationDetails);

}
InsertLocation1(){

  let selectedbrand =  this.updateEventForm.controls['Brand'].value;

  if(!this.selectedLocation){
    this.LocationMssg = true;

    }else{
    this.LocationMssg = false;

    if(selectedbrand.length<1){
      this.brandMssg = true;
    }else{
      this.brandMssg = false;
      let arr = this.selectedLocation.tableData;
      console.log('arr',arr);



////get data from popup
let arrayFromPopUp = this.selectedLocation.tableData;
console.log('arrayFromPopUp',arrayFromPopUp);

let updatedLocation = arrayFromPopUp.map((obj)=>{
   return {...obj} ;

  })
  console.log('updatedLocation',updatedLocation);
// this.ul = updatedLocation;
  ///// end

  if(this.locationDetails.length>=5){
alert('maximum 5 locations are allowed');
  }else{


  // let data={

  //     "locationId": 7,
  //     "locationName": "del",
  //     "countryName": "india",
  //     "cityName": "Riyadh",
  //     "brandId": [11,22,33],
  //     "brandName": ["Nike1","Guci2","Levis3"]

  // }
  // delete updatedLocation[0].selectable;
  // delete updatedLocation[0].selected;
let x = updatedLocation[0]
for(let i=0;i<x.length-1;i++){
  this.locationDetails.push(x[i]);
}


  console.log('updatedLocation[0] push',updatedLocation[0]);
  console.log('locationDetails 0',this.locationDetails[0]);
  console.log('locationDetails',this.locationDetails);


  // this.selectedLocation.tableData = '';
  // this.selectedLocation = '';
}

}
}

}

//end

  expandtermAndCondition(){

  }
/////////////////////////product-------------------------------------

get Prd(){
  return (<FormArray>this.updateEventForm.get("ProductFormList")).at(0);

}

public productBtnText:any = 'INSERT';
public prodRangeValueSelectionchkbox:boolean = false;

  getDefineProduct(defineProdData){

     console.log('defineProdData',defineProdData);
     let formData= this.updateEventForm.controls['ProductFormList'].value;
     if(this.insertProductArray.length>0){
       
  let matchedDefinedPord = this.insertProductArray.filter((item) => item.defineProduct === defineProdData);
  console.log('matchedDefinedPord>>>',matchedDefinedPord);
  console.log('matchedDefinedPord length>>>',matchedDefinedPord.length);

  if(matchedDefinedPord.length>0){
    this.productBtnText  = 'UPDATE';
    let matchedProdArray = matchedDefinedPord[0] ;

    this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['prodructMaxiEvent'].patchValue(matchedProdArray['maxForEvent']);
    this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxiPerStore'].patchValue(matchedProdArray['maxperStoreperDay']);
    this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productmaxiPerLocation'].patchValue(matchedProdArray['maxPerLocation']);
  
   // this.maxDenomination.push(matchedProdArray['maxDenomination']);

if(matchedProdArray['rangeValueSelection']){
this.prodRangeValueSelectionchkbox  = true;
console.log('matchedProdArray>>>>',true);
this.Prd.get("prodRangeValueSelection").patchValue(true);

  this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productMinVal'].patchValue(matchedProdArray['minValue']);
  this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxVal'].patchValue(matchedProdArray['maxValue']);

}else{
  this.Prd.get("prodRangeValueSelection").patchValue(false);

}
  
  }else{
    this.productBtnText  = 'INSERT';


    this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['prodructMaxiEvent'].patchValue('');
    this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxiPerStore'].patchValue('');
    this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productmaxiPerLocation'].patchValue('');
  

  this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productMinVal'].patchValue('');
  this.updateEventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxVal'].patchValue('');

  }
     }else{


      
      console.log('no data inproduct grid');

     }

  }

  public uploadType:any;
  public skuLink_url:any;
  hidetext:boolean = true;
  public sku_code = [];
  sku_code_inserarray = [];
    public uploadSkuEvent_Gifting(event: FileList) {
  
  this.loaderStart = true;
         console.log('event',event);
  
  
      if (event[0].size < 1000000) {
        if (event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          this.uploadFile.uploadSkuFileEvent_Gifting(event.item(0), event[0].type)
            .subscribe((response) => {
              let url = response["output"]
              console.log('upload sku res',response["output"]);
             
              // this.updateEventForm.controls.SKUCODE.patchValue(response["Output"]['sku']);
              // this.SKUCODEurl=response["Output"]['upload_url'];
              // console.log(response["Output"]['upload_url']);
              // console.log(event[0].name);
              this.skuXslFileName = response["output"]['uploadFileName'];
              console.log('sku file name>>>',this.skuXslFileName);
               this.hidetext = false;
              this.skuLink_url =  response["output"]['skuLink'];
             
              this.selectionType = 'upload';
              this.uploadType = 'file'
              this.disblebtns = false;
              this.loaderStart = false;
              this.warn1 = false;
              this.skulistDetails = [];
  console.log('sku list -----',response['output']['skuList']);
  let skulist = response['output']['skuList'];
  this.skulistDetails = response['output']['skuList'];

if(skulist.length>0){
  this.sku_code = [];
  for(let i = 0;i<skulist.length;i++){
    this.sku_code.push(skulist[i]['skuCode']);
    console.log('sku_code', this.sku_code);

  }

}
 
  if(this.insertProductArray.length>0){
    console.log('exist on grid');
    console.log('exist on grid list',this.insertProductArray);
    console.log('exist on grid list',this.sku_code);




  this.sku_code_inserarray = [];
  for(let i = 0;i<this.insertProductArray.length;i++){
    this.sku_code_inserarray.push(+this.insertProductArray[i]['skuCode']);
    console.log('sku_code of insert array', this.sku_code_inserarray);

  }
  if(skulist.length == this.sku_code.length){
    if(this.sku_code_inserarray.length == this.insertProductArray.length){

////show only those in dropdown which are not on grid

    let sk = this.sku_code_inserarray
    for (let i = 0; i < this.skulistDetails.length; i++) {
      var obj = this.skulistDetails[i];
  
      if (sk.indexOf(obj.skuCode) !== -1) {
        this.skulistDetails.splice(i, 1);
          i--;
      }

      console.log('skulistDetails -----------',  this.skulistDetails);

  }

    this.productDropdown = this.skulistDetails;
  }
}



    ///this.productDropdown = result;

    console.log('latest in dropdown',this.productDropdown);

    ////if already on grid , then do not display in dropdown

    //this.productDropdown = response['output']['skuList'];
   // this.insertProductArray.filter(item=>item.skuCode != )
  
    // for(let i = 0; i<this.insertProductArray.length;i++){
    //    for(let j = 0;j<this.productDropdown.length;j++){
    //       if(+this.insertProductArray[i]['skuCode'] == +this.productDropdown[j]['skuCode']){
    //         this.insertProductArray.splice(i,1);
    //         console.log('updated insert prod arry>>>',this.insertProductArray)
    //       }
    //    }    
    // }

 ////////////////////////////////////////////////////////////////////////////////////////////////   
  //   this.insertProductArray.forEach(function(item, index, array) {
  //     let ItemIndex = this.productDropdown.findIndex(b => b.skuCode === item.skuCode);
  
  //     this.insertProductArray.splice(ItemIndex, 1);
  // });

  //////////////////////////////////////////////////////////
//   for (var i = 0, len = this.productDropdown.length; i < len; i++) { 
//     for (var j = 0, len2 = this.insertProductArray.length; j < len2; j++) { 
//         if (+this.insertProductArray[i].skuCode === +this.productDropdown[j].skuCode) {
//           this.insertProductArray.splice(j, 1);
//             len2=this.insertProductArray.length;
//         }
//     }
// }
// let b = this.productDropdown;
// let c = this.productDropdown

// this.insertProductArray.forEach(function(item, index, array) {
//   var ItemIndex = b.findIndex(b => +b.skuCode === +item.skuCode);

//   c.splice(ItemIndex, 1)
// });
               console.log('updated insert prod arryvv>>>',this.insertProductArray)
             //  console.log('updated insert prod arryvv>>>',c)

 
  
  }else{
    console.log('fresh entry');
    this.productDropdown = response['output']['skuList'];

  }
  
  ///// make all the selected product as dropdown--end
  
  
            },
  
              (error) => {
                console.log(typeof (error));
                console.log('error is>>>',error);
  
                   this.loaderStart = false;
                console.log(JSON.stringify(error));
                this.snackBar.openFromComponent(SnackBarComponent, {
                  duration: 10000,
                  data: {
                    status: 'failure',
                    message: error.error['errorMessage']
                  }
                });
              }
            );
  
        }
        else {
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "failure",
              message: "Supported format is xls and xlsx"
            }
          });
        }
      }
  
      else {
  
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Max upload file size is 1Mb"
          }
        });
      }
  
    }
   

    public disableBtnProd:boolean;

    ////add product
    //public insertProductArray = [];
    public warn1:boolean;
    public selectionType:any;
    filtered_productItem: any;

    addProduct(){
    
      let formData= this.updateEventForm.controls['ProductFormList'].value;
    
      console.log(this.updateEventForm.controls['ProductFormList'].value);
      console.log('range', formData[0]['rangeOfProgram']);
      console.log('formData',formData);
    
    
      if(this.maxDenomination.length>0){
        this.Prd.get('maxDenomination').clearValidators();
        this.Prd.get('maxDenomination').updateValueAndValidity();
      }else{
      
        if(formData[0]['prodRangeValueSelection']){
      
        }else{
          this.Prd.get('maxDenomination').setErrors({'incorrect': true});
          this.Prd.get('maxDenomination').markAsTouched();
          return;
        }
      
      
      
      }
    
      if(this.productDropdown.length === 0){
        this.Prd.get('defineProduct').setErrors({'incorrect': true});
        this.Prd.get('defineProduct').markAsTouched();
      }else{
    
      }
    
    if(this.hidetext &&  (this.selectedProductarray && this.selectedProductarray.length === 0)){
        this.warn1 = true;
    }else{
      this.warn1 = false;
    
    }
    
      let skuCodeArray = this.selectedProductarray.map(i=>Number(i));
      this.maxDenomination = this.maxDenomination.map(i=>Number(i));
    
      // if(this.maxDenomination.length>0){
    
      // }
    
       let defineProduct = formData[0]['defineProduct'];
        console.log('define product',defineProduct);
    
        this.uploadType = 'file';
        this.uploadType = 'select';
    
        console.log('productDropdown',this.productDropdown);
    
      let filteredItem = this.productDropdown && this.productDropdown.filter(p => p.skuCode == defineProduct);
        this.filtered_productItem = filteredItem;
      console.log('filteredItem',filteredItem);
    
      console.log('filteredItem',filteredItem);
      console.log('maxDenomination prd>>',this.maxDenomination);
    
      console.log('uploadType',this.uploadType);
    
      
    
      let data = {
        "selectionType": this.selectionType,
        "enableGifting": this.updateEventForm.get('enableProduct').value ? this.updateEventForm.get('enableProduct').value : false,
        "defineProduct": defineProduct ? defineProduct : '',
        "value": 100,
        "valueType": "both",
        "maxNumOfValues":  this.maxDenomination ? this.maxDenomination : [0],
      
        "maxForEvent": +formData[0]['prodructMaxiEvent'],
        "maxperStoreperDay":+formData[0]['productMaxiPerStore'],
        "maxPerLocation": +formData[0]['productmaxiPerLocation'],
        "rangeValueSelection": formData[0]['prodRangeValueSelection'] ? formData[0]['prodRangeValueSelection'] : false,
        "minValue": +formData[0]['productMinVal'] ? +formData[0]['productMinVal'] : '0', 
        "maxValue": +formData[0]['productMaxVal'] ?  +formData[0]['productMaxVal'] : '0',
       
        "skuCode": +filteredItem[0]['skuCode'] ?  +filteredItem[0]['skuCode'] : '',
        "moreThenOneProduct" : this.updateEventForm.get('moreThanOneGiftProduct').value ? this.updateEventForm.get('moreThanOneGiftProduct').value : false,
        "uploadImage": '',
        "productName": filteredItem[0]['productName'] ? filteredItem[0]['productName'] : '',
        "currencyCode": filteredItem[0]['currencyCode'] ? filteredItem[0]['currencyCode'] : '',
        "price": filteredItem[0]['price'] ? filteredItem[0]['price'] : '',
        "variantTypeName":  this.uploadType === 'select' ? filteredItem[0]['variantTypeName'] : filteredItem[0]['variantName'],
        "maxDenomination": this.maxDenomination ? this.maxDenomination : [0],
      
        //"productOid" : filteredItem[0]['productOid'] ? filteredItem[0]['productOid'] : '',
        "productVariantOid" : filteredItem[0]['productVariantOid'] ? filteredItem[0]['productVariantOid'] : '',
        "variantTypeOid"  : filteredItem[0]['productVariantOid'] ? filteredItem[0]['productVariantOid'] : ''
      }

      if(this.selectionType = 'upload'){
       let x = {
        "productOid" :  1234
       }
       data['productOid'] = x;

      }else{
        let x = {
          "productOid" : filteredItem[0]['productOid'] ? filteredItem[0]['productOid'] : '',
        }
         data['productOid'] = x;

      }
      console.log('product data as req body',data)
      
      if(this.insertProductArray.length>0){
        console.log('iiiii>>>',this.insertProductArray);
        console.log('iiiiiskuu>>>',filteredItem[0]['skuCode']);
        console.log('iiiiismaxForEvent>>>' +formData[0]['prodructMaxiEvent']);
    
       let insertProductArrayUpdate = this.insertProductArray.filter(p => +p.skuCode === +filteredItem[0]['skuCode']);
       console.log('insertProductArrayUpdate>>>', insertProductArrayUpdate);
    
    
    if(insertProductArrayUpdate.length>0){
      this.insertProductArray =  this.insertProductArray.map((obj)=>
            +obj.skuCode === +filteredItem[0]['skuCode'] ? {...obj,maxForEvent:+formData[0]['prodructMaxiEvent'],maxperStoreperDay:+formData[0]['productMaxiPerStore'],maxPerLocation:+formData[0]['productmaxiPerLocation'],minValue:+formData[0]['productMinVal'],maxValue:+formData[0]['productMaxVal']} : obj
    
     );
     console.log('using map>>>',this.insertProductArray);
    
    }else{
      this.insertProductArray.push(data);
    }
     
    
    ///working
    // let at_zero_insertProductArrayUpdate = insertProductArrayUpdate[0];
    //  console.log('mached n updated',insertProductArrayUpdate[0]);
    //  const updatedListtogrid = {...at_zero_insertProductArrayUpdate,maxForEvent:+formData[0]['prodructMaxiEvent'],xx:1}
    //  console.log('updatedListtogrid',updatedListtogrid);
    
    //  this.insertProductArray.push(updatedListtogrid);
    ///working end
    
    
    
    
      }else{
        this.insertProductArray.push(data);
    
      }
    
      console.log('insertProductArray',this.insertProductArray);
    //this.maxDenomination.length = 0;
      this.updateEventForm.controls['ProductFormList'].reset();
    
      ///this.Prd.get('prodructMaxiEvent').reset();
      this.Prd.get('prodructMaxiEvent').clearValidators();
      this.Prd.get('prodructMaxiEvent').updateValueAndValidity();
    
    
    
    
    
    
    
    //   const control = <FormArray>this.updateEventForm.controls['ProductFormList'];
    //   for(let i = control.length-1; i >= 0; i--) {
    //       control.removeAt(i)
    // }
    /*imp*/
      // const arr2 = <FormArray>this.updateEventForm.controls.ProductFormList;
      //   arr2.controls = [];
     // https://www.codegrepper.com/code-examples/javascript/angular+formarray+remove+all
      // (this.updateEventForm.controls['ProductFormList']).clear();
      // let frmArray = this.updateEventForm.get('ProductFormList') as FormArray;
      // frmArray.clear();
    }
    
   // public selectedProductarray = [];
    selectProduct(){
     // alert('hii');
      
      const dialogRef = this.dialog.open(SelectProductItemsDialogComponent);
      dialogRef.componentInstance.productitem = this.selectedProductarray;
    
      dialogRef.afterClosed().subscribe(result => {
       console.log('selected product item>>>>>>',result);
    this.uploadType = 'select'
    
       if (result.buttonName === 'SELECT') {
          let popupdata = result['tableData'];
       // let resultitem = popupdata.filter( el => (-1 == this.selectedProductarray.indexOf(el.skuCode)));
       // console.log('matched>>',resultitem);
      
      //this.allUser = result;
     // this.productDropdown = resultitem;
    //  console.log('productDropdown>>', this.productDropdown);

    /////make all the selected product as dropdown
   // this.productDropdown = result['tableData'];
    this.selectionType = 'select';
    
    this.loaderStart = false;
    this.disblebtns =false;
    this.skulistDetails = [];
    let skulist = result['tableData'];
   // this.skulistDetails = result['tableData'];
    console.log('skulistDetails', this.skulistDetails);

    ////create copy

    this.skulistDetails = result['tableData'].map(item=>{
      return {...item}

    });


  if(skulist.length>0){
    this.sku_code = [];
    for(let i = 0;i<skulist.length;i++){
      this.sku_code.push(skulist[i]['skuCode']);
      console.log('sku_code', this.sku_code);
  
    }
  
  }
    
  
//////////////////////////////////////////////////////////////================================
if(this.insertProductArray.length>0){
  console.log('exist on grid');
  console.log('exist on grid list',this.insertProductArray);
  console.log('exist on grid list',this.sku_code);




this.sku_code_inserarray = [];
for(let i = 0;i<this.insertProductArray.length;i++){
  this.sku_code_inserarray.push(this.insertProductArray[i]['skuCode']);
  console.log('sku_code of insert array', this.sku_code_inserarray);

}
if(skulist.length == this.sku_code.length){
  if(this.sku_code_inserarray.length == this.insertProductArray.length){

////show only those in dropdown which are not on grid
  let sk = this.sku_code_inserarray
  for (let i = 0; i < this.skulistDetails.length; i++) {
    var obj = this.skulistDetails[i];

    if (sk.indexOf(obj.skuCode) !== -1) {
      this.skulistDetails.splice(i, 1);
        i--;
    }

    console.log('skulistDetails -----------',  this.skulistDetails);

}

  this.productDropdown = this.skulistDetails;
}
}



  ///this.productDropdown = result;

  console.log('latest in dropdown',this.productDropdown);

             console.log('updated insert prod arryvv>>>',this.insertProductArray)
           //  console.log('updated insert prod arryvv>>>',c)



}else{
  console.log('fresh entry');
  this.productDropdown = result['tableData'];

}
   //////////////////////////////////////////////////////////////////////////// 

    ///// make all the selected product as dropdown--end
    
           this.selectedProductarray = [];
           for (let i = 0; i < result.tableData.length; i++) {
            this.selectedProductarray.push(result.tableData[i].skuCode);
            const arrrayTempw = this.selectedProductarray;
            this.selectedProductarray = Array.from(new Set(arrrayTempw));
            console.log('sku-------',this.selectedProductarray);
            this.warn1 = false;
    
         
           }

///////remove those from grid - those we are uncheking in popup
///MEANS KEEP THOSE ON GRID - WHICH ARE IN ==SELECTEDPRODUCTARRAY
if(popupdata.length == this.selectedProductarray.length){
 // keep only those match
  let listToNotDelete = this.selectedProductarray;
  
  // let arrayOfObjects = [{id:'abc',name:'oh'},
  //                       {id:'efg',name:'em'}, 
  //                       {id:'hij',name:'ge'}]


    ////create copy

    let insertProductArrayy = this.insertProductArray.map(item=>{
      return {...item}

    });

    console.log('this.insertProductArray',this.insertProductArray)

  for (var i = 0; i < insertProductArrayy.length; i++) {
      let object =  insertProductArrayy[i];
  
      if (listToNotDelete.indexOf(object.skuCode) == -1) {
        insertProductArrayy.splice(i, 1);
          i--;
      }
  }
  console.log('insertProductArrayy',insertProductArrayy)
  this.insertProductArray = insertProductArrayy;
}
///////remove those from grid - those we are uncheking in popup end

       }
    
       //will chk later
      //  if(this.selectedProductarray.length>0){
         
      //        this.filterMatchedProduct(this.selectedProductarray); 
      // }
    
    
      })
    
    
    }
    
    
  //  loaderStart:boolean;
    disblebtns:boolean =true;
    filterMatchedProduct(selectedProductarray){
      this.loaderStart = true;
      let data = {
        "page": "0",
        "pageSize": "20",
        "order": {
          "column": "",
          "dir": "asc"
        },
        "keySearch": "",
        "fieldSearch": [
          {
            "fieldName": "STATUS",
            "fieldValue": "ONLINE"
          },{
            "fieldName": "categoryIds",
            "fieldValue": ""
          },{
            "fieldName": "countryIds",
            "fieldValue": ""
          },,{
            "fieldName": "BRAND_OID",
            "fieldValue": ""
          }
      
        ]
      }
      
      this.http.postJson(environment.APIEndpoint+'api/rpa/product/v2/searchProduct',data).subscribe(res => {
    if(res){
    
      let productItem = res['items'];
      console.log('getAllProduct>>>',productItem);
      console.log('selectedProductarray>>>',selectedProductarray);
    
      
      let result = productItem.filter( el => (-1 != selectedProductarray.indexOf(el.skuCode)));
      console.log('filtered product',result)
      this.productDropdown = result;
      this.loaderStart = false;
      this.disblebtns =false;
    
    
    }
      });
    
    }
    
    public showKeywordPRD(keyword: HTMLInputElement) {
      if (this.maxDenomination.length < 5) {
        if (this.maxDenomination.includes(keyword.value)) {
    
        }
        else {
          // this.keywordStatus = true;
          if(keyword.value<'1'){
            // this.keywordError=true;
            if(keyword.value==''){
              // this.keywordStatus = false;
              // this.keywordError=false;
              // this.secondCon=false;
            }
          }
          if(keyword.value>'0'){
            // this.keywordError=false;
             this.maxDenomination.push(keyword.value);
            keyword.value = '';
    
            this.Prd.get('maxDenomination').clearValidators();
            this.Prd.get('maxDenomination').updateValueAndValidity();
          }
         
        }
    
      }
      
      // else {
      //   this.keywordStatus = true;
      //   this.updateEventForm.get('keywords').clearValidators();
      //   this.updateEventForm.get('keywords').updateValueAndValidity();
      //   setTimeout(() => {
      //     this.keywordStatus = false;
      //   }, 2000);
    
      // }
    }
    removeSKU(){
      this.skuXslFileName = '';
      this.skuLink_url  = '';
      this.productDropdown = [];
      this.hidetext = true;
    }
    

    
    maxDenomination = [];
    Editablenew: boolean = true;
    public imageErr = false;
    imgloader:boolean;

    maxDenominationProd(val){
    console.log('val',val);
    if(val){
      if(this.maxDenomination.length<5){
        this.maxDenomination.push(val);
        this.Prd.get('maxDenomination').reset();
      }else{
        this.Prd.get('maxDenomination').reset();
      
      }
      
    }else{
      if(this.maxDenomination.length>0){
        this.Prd.get('maxDenomination').clearValidators();
        this.Prd.get('maxDenomination').updateValueAndValidity();
      
      }else{
        //this.Prd.get('maxDenomination').clearValidators();
        this.Prd.get('maxDenomination').setValidators(Validators.required);
        this.Prd.get('maxDenomination').updateValueAndValidity();
      
      }
    }
    
    
    
    }

    deleteProductFixedValue(i:number){
      this.maxDenomination.splice(i,1)
    
      if(this.maxDenomination.length<1){
       /// this.Prd.get('maxDenomination').clearValidators();
       this.Prd.get('maxDenomination').setValidators(Validators.required);
    
        this.Prd.get('maxDenomination').updateValueAndValidity();
      
      }else{
        //this.Prd.get('maxDenomination').clearValidators();
        // this.Prd.get('maxDenomination').setValidators(Validators.required);
        // this.Prd.get('maxDenomination').updateValueAndValidity();
      
      }
    
    }
    productMaxOEventVal: any;

    productMaxOEvent(event){
      this.productMaxOEventVal = event.target.value;
      this.Prd.get("productMaxiPerStore").reset();
      this.Prd.get("productmaxiPerLocation").reset();
   
       if(+event.target.value<1){
        this.Prd.get("prodructMaxiEvent").setErrors({ 'incorrect': true});
        this.Prd.get("prodructMaxiEvent").markAsTouched();
       }
     
   }
   productMaxOStore(event){
     
     if(+event.target.value >= +this.productMaxOEventVal){
      this.Prd.get("productMaxiPerStore").setErrors({ 'incorrect': true});
      this.Prd.get("productMaxiPerStore").markAsTouched();
     }
   
   }
   productMaxOLocation(event){
    
     if(+event.target.value >= +this.productMaxOEventVal){
      this.Prd.get("productmaxiPerLocation").setErrors({ 'incorrect': true});
      this.Prd.get("productmaxiPerLocation").markAsTouched();
     }
   
   }


///mat -tab

// public demo2BtnClick(tabGroup: MatTabGroup) {
//   this.goToNextTabIndex(tabGroup);
// }

public demo1TabIndex = 0;
public demo1BtnClick() {
  const tabCount = 3;
  this.demo1TabIndex = (this.demo1TabIndex + 1) % tabCount;
  console.log('demo1TabIndex',this.demo1TabIndex)
}

// private goToNextTabIndex(tabGroup: MatTabGroup) {
//   if (!tabGroup || !(tabGroup instanceof MatTabGroup)) return;

//   const tabCount = tabGroup._tabs.length;
//   tabGroup.selectedIndex = (tabGroup.selectedIndex + 1) % tabCount;
// }
///////GIFTING TYPE

giftingType(event) {
  let value = event.index;
  if (value === 0) {
    this.couponGiftingType = true;
    this.programGiftingType = false;
    this.productGiftingType = false;
  }
  else if (value === 1) {
    this.programGiftingType = true;
    this.couponGiftingType = false;
    this.productGiftingType = false;
  }
  else if (value === 2) {
    this.productGiftingType = true;
    this.programGiftingType = false;
    this.couponGiftingType = false;
  }
}






public removeOrderType(combotype){
  console.log(combotype)
  const control = <FormArray>this.updateEventForm.controls['ProgramFormList'];
  console.log(control)
  while (control.length) {
    control.removeAt(control.length-1);
  }
}



reset() {
 // this.dataSource.data = scoreboard.slice();
  this.table.renderRows();
}
myreset() {
  // this.dataSource.data = scoreboard.slice();
   this.table.renderRows();
 }
//"endTime": moment(this.updateEventForm.controls['endTime'].value, "YYYY-MM-DD h:m").format("HH:mm:ss"),
////



get inFormArray() {
 return this.updateEventForm.get('ProgramFormList') as FormArray;
}




  CheckProgramRange1(event){
    if(event.checked){

    }else{

    }
  }
  // batches(ti): FormArray {
  //   return this.teachers()
  //     .at(ti)
  //     .get("batches") as FormArray;

  //     this.form
  //     .get("credentials")
  //     .at(index)
  //     .get("label")
  //     .enable();

  // get programControls() {
  //   return (<FormArray>this.updateEventForm.get("ProgramFormList")).at(0);
  // }
  // get productControls() {
  //   return (<FormArray>this.updateEventForm.get("ProductFormList")).at(0);
  // }


  productMinValidate(event,data){
    //console.log(event,data);

    if(data === 'minValue'){
      const myForm = (<FormArray>this.updateEventForm.get("ProgramFormList")).at(0);
      myForm.get("productMaxVal").reset();

     this.productMinvalue = event.target.value;
      if(+event.target.value<1){
        this.minValueErrorProd  = true;
      }
    }

  }
  productMaxValidate(event,data){
    let myForm = (<FormArray>this.updateEventForm.get("ProgramFormList")).at(0);

    if(data === 'maxValue'){
      if(+event.target.value <= +this.productMinvalue){

        myForm.get("productMaxVal").setErrors({ 'incorrect': true});
        myForm.get("productMaxVal").markAsTouched();
      }
    }

  }


   programMinValidate(event,data){
      console.log(event,data);
      if(data === 'minValue'){

      let myForm = (<FormArray>this.updateEventForm.get("ProgramFormList")).at(0);
      myForm.get("programMaxValue").reset();

       this.programMinvalue = event.target.value;
        if(+event.target.value<1){
          this.minValueError  = true;
        }
      }


  }
  programMaxValidate(event,data){
    let myForm = (<FormArray>this.updateEventForm.get("ProgramFormList")).at(0);

      if(data === 'maxValue'){
let maxVal = event.target.value;

      if(+maxVal <= +this.programMinvalue){
      //  this.ProgramMinError2 = true;

        myForm.get("programMaxValue").setErrors({ 'incorrect': true});
        myForm.get("programMaxValue").markAsTouched();

      }else{
      ///  this.ProgramMinError2 = false;
        // myForm.get("programMaxValue").setErrors({ 'incorrect': true});
        // myForm.get("programMaxValue").markAsTouched();

      }
    }

}
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }




  public imgVidoUrl(){
    const control = <FormArray>this.updateContentForm.controls['imgVidoUrl'];
    for (let i = 0; i < this.languageList.length; i++) {
      const newForm = this.fb.group({
        languageCode: this.languageList[i]['languageCode'],
        languageName: this.languageList[i]['languageName'],
        uploadImage: [''],
        uploadVideo: [''],
        videolink: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])]
  
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }












  ///program -range -method
// CheckProgramRange(event){
//   if(event.checked){

//     this.Editable = false;
//     this.isMarkDefault = true;
//     console.log('checked',event.checked)


//   }else{
//     console.log('un checked',event.checked)

//     this.Editable = true;
//     this.isMarkDefault = false;
//     this.programControls.get('programMinValue').clearValidators();
//     this.programControls.get('programMinValue').reset();

//     this.programControls.get('programMaxValue').clearValidators();
//     this.programControls.get('programMaxValue').reset();

//    }

//   }
  public removeImage2(index,type) {
    if(type == 'imgBanner'){
      this.imagePath[index] = "";
      this.uploadFlag[index] = false;
      const control = this.updateContentForm.get('bannersLocaleBean') as FormArray;
      control.at(index).get('imgBanner').setValue('');
    }else{
      this.imagePath1[index] = "";
      this.uploadFlag1[index] = false;
      const control = this.updateContentForm.get('titleArray') as FormArray;
      control.at(index).get('imgBannerTitle').setValue('');
    }

  }


/////////////app content -------------start

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

  const control = this.updateContentForm.get('imgVidoUrl') as FormArray;
  control.at(index).get('uploadImage').setValue('');
}

public removeVideo(index) {
  this.videoSRCUrl[index] = "";
  this.uploadFlagVid[index] = false;

  const control = this.updateContentForm.get('videoUpload') as FormArray;
  control.at(index).get('uploadVideo').setValue('');
}

public removeImage(index,type) {
  if(type == 'imgBanner'){
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
    const control = this.updateContentForm.get('bannersLocaleBean') as FormArray;
    control.at(index).get('imgBanner').setValue('');
  }else{
    this.imagePath1[index] = "";
    this.uploadFlag1[index] = false;
    const control = this.updateContentForm.get('titleArray') as FormArray;
    control.at(index).get('imgBannerTitle').setValue('');
  }
 
}


////////////////////// end



  public userinfo = [];
  userinfodummy = [];
  addUsernew(): void {

    if(!this.updateEventForm.get('isCouponsEnabled').value){
      this.CouponArray.length = 0;
    }
    if(!this.updateEventForm.get('enableProgram').value){
      this.addProgramResNew.length = 0;
    }
    if(!this.updateEventForm.get('enableProduct').value){
      this.insertProductArray.length = 0;
    
    
    }
    
    if(this.CouponArray.length == 0){
      console.log('no coupons on grid')
    }else{
      console.log('coupons on grid',this.CouponArray.length)
    
    }
    
    
    
      ////SearchUserComponent UserLocationDialogComponent
        const dialogRef = this.dialog.open(UserLocationDialogComponent, {
         // width: '250px',
         // backdropClass: 'custom-dialog-backdrop-class',
        //  panelClass: 'custom-dialog-panel-class',

       /// this.CouponArray == this.allCouponList
        ///this.allCouponList

          data: { selectedUsers: this.selectedUserArray,getCoupons:this.allCouponList,getProgram:this.addProgramResNew,getProduct:this.insertProductArray}
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('selected users>>>>>>',result);
          
          if (result.buttonName === 'SELECT') {
    ///////////
    this.noUserGifitng = false;
    
            console.log('jsondata>>',result['jsondata']);
           
    if(result['jsondata']['userOid'].length>0){
    
      this.userinfo.push(result['jsondata']);
     // this.allGiftingLimitsArry.push(result['jsondata']);
      //this.userinfodummy.push(result['jsondata']);
      this.FINAL_OBJ.push(result['jsondata']);
    }
    console.log('this.FINAL_OBJo>>', this.FINAL_OBJ);
   /// console.log(' allGiftingLimitsArry>>>>>>>>>>', this.allGiftingLimitsArry);

   console.log('allUserList list bb',this.allUserList);

         let arrayFromPopUp = result.tableData;
       
       
         let updateUser = arrayFromPopUp.map((obj,index)=>{
          return {...obj,'giftingLimit':index } ;
       
         })
         //this.ul = updatedLocation;
          console.log('updateUser list',updateUser);
       
        
       
           if (result.buttonName === 'SELECT') {
               this.allUserList = updateUser;

               this.userdataSource = new MatTableDataSource<any>(this.allUserList);
               this.userdataSource.paginator = this.firstPaginator
               this.userdataSource.sort = this.sortnew;
               console.log('allUserList list',this.allUserList);



             this.selectedUserArray = [];
             for(let i=0;i<result.tableData.length; i++){
               let Usersdata = {
                 userId : result.tableData[i]['userId'],
                 userName : result.tableData[i]['userName'],
               }
               this.selectedUserArray.push(result.tableData[i]['userId'])
       
       
       
       
              // let CId = result['tableData'][i]['couponId'];
       
            ////   this.selectedCouponArray.push(result.tableData[i].couponId);
             ///  const coupTemp = this.selectedCouponArray;
             ////  this.selectedCouponArray = Array.from(new Set(coupTemp));
             ////  console.log('couponId',this.selectedCouponArray);
       
               // this.eventGiftingFormGroup.controls['couponID'].patchValue(CId);
             ////raghve  this.updateEventForm['controls']['CouponFormList']['controls']['couponID'].patchValue(CId);
             }
           
            
             // this.CouponFormList.controls['couponTitile'].patchValue(Name)
           }
          }
    
         });
      
    
    }

    allowRangeProduct(event){
      if(event.checked){
        this.Editablenew = false;
  
        this.Prd.get("productMinVal").setValidators([Validators.required]);
        this.Prd.get('productMinVal').updateValueAndValidity();
  
        this.Prd.get("productMaxVal").setValidators([Validators.required]);
    
        this.Prd.get('productMaxVal').updateValueAndValidity();
  
        this.Prd.get('maxDenomination').clearValidators();
        this.Prd.get('maxDenomination').updateValueAndValidity();
  
      }else{
        this.Editablenew = true;
  
        this.Prd.get("productMinVal").reset();
        this.Prd.get("productMaxVal").reset();
    
     
        this.Prd.get("productMinVal").clearValidators();
        this.Prd.get('productMinVal').updateValueAndValidity();
  
        this.Prd.get("productMaxVal").clearValidators();
    
        this.Prd.get('productMaxVal').updateValueAndValidity();
  
  
      }
    }




    onChangePreptual(event){
      if(event.checked){
        this.updateEventForm.controls['endDate'].disable();
        this.updateEventForm.controls['endTime'].disable();
        this.updateEventForm.controls['endDate'].clearValidators();
        this.updateEventForm.controls['endTime'].clearValidators();
        this.updateEventForm.controls['endDate'].reset();
          this.updateEventForm.get('endTime').reset();
          this.timeerror2 = false;

      }else{
        this.updateEventForm.controls['endDate'].enable();
        this.updateEventForm.controls['endTime'].enable();

        this.updateEventForm.controls['endDate'].setValidators(Validators.required);
        this.updateEventForm.controls['endDate'].updateValueAndValidity();
       this.updateEventForm.controls['endTime'].setValidators(Validators.required);
       this.updateEventForm.controls['endTime'].updateValueAndValidity();

      }
      }

      changeBrand(brand){
        console.log('brand is',brand)
       // this.brandId = brand;
       let f_b =  this.brandDropdown.filter(item=>item.brandName == brand);
        this.brandId = f_b[0]['brandId'];
        console.log('brandId',this.brandId);

          }




 allGiftingLimitsArrynew = [];     
public minValueError :boolean

timeerror:boolean = false;
timeerror2:boolean = false;

updateEvent(){
 let formvalue = this.updateEventForm.value






  if(this.approvalStatus == 'EXPIRE' || this.approvalStatus == 'EXPIRED'){
return;
  }
  if(this.approvalStatus == 'LIVE'){
    return;
      }
 console.log('events daata',formvalue);




 let ctx = new Date().toLocaleTimeString();
 let currentTime = ctx
 let startTime = moment(formvalue['startTime'], "YYYY-MM-DD h:m").format("HH:mm:ss");
 let endTime = moment(formvalue['endTime'], "YYYY-MM-DD h:m").format("HH:mm:ss");
 
 
 if(new Date ('1/1/1999 ' + currentTime) > new Date ('1/1/1999 ' + startTime)){
   console.log('strt time is less then current time>>')
   this.timeerror = true;
 return;
 }else{
   this.timeerror = false;
 } 
 
 if(new Date ('1/1/1999 ' + startTime) > new Date ('1/1/1999 ' + endTime)){
   console.log('strt time is less then  endTime>>')
   this.timeerror2 = true;
 return;
 }else{
   this.timeerror2 = false;
 
 }


 console.log('isCouponsEnabled',this.updateEventForm.get('isCouponsEnabled').value);
 console.log('enableProgram',this.updateEventForm.get('enableProgram').value);
 console.log('enableProduct',this.updateEventForm.get('enableProduct').value);


 if(!this.updateEventForm.get('isCouponsEnabled').value){

  this.CouponArray.length = 0;

}
if(!this.updateEventForm.get('enableProgram').value){

  this.addProgramResNew.length = 0;

}
if(!this.updateEventForm.get('enableProduct').value){

  this.insertProductArray.length = 0;

}

let programformData = this.updateEventForm.controls['ProgramFormList'].value

let giftLanguageList = this.updateEventForm.controls['giftLanguageList'].value;
let conditionArray = this.updateEventForm.controls['conditionArray'].value;

let ProductFormList =  this.updateEventForm.controls['ProductFormList'].value;

// console.log('allGiftingLimitsArry>>>>',this.allGiftingLimitsArry);


// for(let i = 0;i<this.allGiftingLimitsArry.length;i++){

//   for(let j = 1;j<this.allGiftingLimitsArry.length;j++){
//     if(this.allGiftingLimitsArry[i]['userOid'].sort().join(',') == this.allGiftingLimitsArry[j]['userOid'].sort().join(',')){
       

//          let obj1 = {
//           'userOid':this.allGiftingLimitsArry[i]['userOid'],
//           'couponsgiftingLimits':this.allGiftingLimitsArry[i]['couponsgiftingLimits'].length>0 ? this.allGiftingLimitsArry[i]['couponsgiftingLimits'] : this.allGiftingLimitsArry[j]['couponsgiftingLimits'],
//           'programgiftingLimits':this.allGiftingLimitsArry[i]['programgiftingLimits'].length>0 ? this.allGiftingLimitsArry[i]['programgiftingLimits'] :  this.allGiftingLimitsArry[j]['programgiftingLimits'],
//           'productgiftingLimits' : this.allGiftingLimitsArry[i]['productgiftingLimits'].length>0  ? this.allGiftingLimitsArry[i]['productgiftingLimits'] : this.allGiftingLimitsArry[j]['productgiftingLimits']
//         }
//         this.allGiftingLimitsArrynew.push(obj1);
       
//        // break;
//     }
//   }

// }
// console.log('allGiftingLimitsArrynew>>>>',this.allGiftingLimitsArrynew);


//this.loading = true;

let eventNamesTnc=[];
for(var obj_cOn in conditionArray)
    {
      for(var obj_Lag in giftLanguageList)
      {
  if(conditionArray[obj_cOn]['languageCode'] == giftLanguageList[obj_Lag]['languageCode']){
        let tem_obj={
          "languageCode": giftLanguageList[obj_Lag]['languageCode'],
          "languageName": conditionArray[obj_cOn]['languageName'],
          "eventName": giftLanguageList[obj_Lag]['eventField'],
          "termAndCondition": conditionArray[obj_cOn]['termAndCondition']
      }
      eventNamesTnc.push(tem_obj);

  }
      } 
    } 



//////////////////////////////
if(this.addProgramResNew.length>0){
  this.programGridVal = this.addProgramResNew;
  this.programGridVal.map(res =>{
    
     res["programOid"] = res["programID"] ? res["programID"] : '';
     res['currency'] = 'inr';
     res['maxForEvent'] = +res['maxForEvent'];
     delete res["programID"];
     delete res["programName"];
     delete res['balanceForEvent'];
     delete res['point&Stamp'];
     delete res['BalanceForEvent'];
     delete res['maxperStoreperDay'];
     delete res['maxperLocationperDay'];
     delete res['maxperLocationperDay'];
     delete res['programGiftingType'];
     delete res['moreThenOneGiftAllowed'];

     
   // res["programID"] = res["moneyRefund"] == 'SREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];

  })
   console.log('this.addProgramResNewjj>>>', this.programGridVal);
 // return;
}
let arrayy = [2]
let FINAL_OBJ_MODIFY = this.FINAL_OBJ;

FINAL_OBJ_MODIFY.map(res=>{

  let result = res['couponsgiftingLimits'].filter( el => (-1 != arrayy.indexOf(el.giftcode)));
console.log('result>>>',result)

  res['couponsgiftingLimits'] && res['couponsgiftingLimits'].map(res1=>{

     res1['language_code'] = "";



   });

   res['programgiftingLimits'] && res['programgiftingLimits'].map(res1=>{
    res1['language_code'] = "";
  })
  res['productgiftingLimits'] && res['productgiftingLimits'].map(res1=>{
    res1['language_code'] = "";
  })
})


//////////product modify start

//let copyWithSlice = this.insertProductArray;
//let productArryList_finalmodify = this.insertProductArray;
//this.insertProductArrayNew = this.insertProductArray;

//console.log('productArryList_finalmodify before>>>',productArryList_finalmodify);
//console.log('this.insertProductArrayNew>>>',this.insertProductArrayNew);
//let copyWithSlice = this.insertProductArray.slice() // Changes to array will not change copyWithSlice
let copyWithSlice = this.insertProductArray && this.insertProductArray.map(item=>{
  return {...item}
})

copyWithSlice.map(res=>{
  
 
 res['maxNumOfValues'] = res['maxDenomination'];
 res['value'] = 100;
res['maxperStoreperDay'] = res['maxperStoreperDay'];

 delete res["denominations"];
 delete res["variantTypeOid"];
  delete res["VariantTypeOid"];
  delete res["eventId"];

  delete res["variantTypeName"];
  delete res['productVariantOid'];
  delete res['productOid'];
  delete res['productName'];
  delete res['price'];
  delete res['uploadImage'];

  delete res['moreThenOneProduct'];
  delete res['currencyCode'];
  delete res['skuCode'];

  delete res['maxDenomination'];
  

  delete res['productVariantOid'];
  delete res['productImage'];
  delete res['productImage'];


})
console.log('copyWithSlice>>>',copyWithSlice);

let skulist_modify = this.productDropdown && this.productDropdown.map(item=>{
  return {...item}
})


//let skulist_modify = this.productDropdown;//incorrect
console.log('skulist_modify',skulist_modify)
console.log('this.productDropdown;',this.productDropdown)
console.log('this.this.filtered_productItem;',this.filtered_productItem);
console.log('this.uploadType;',this.uploadType);

skulist_modify && skulist_modify.map(res=>{

  res['skuCode'] = +res['skuCode'];
  res['productName'] = res['productName'] ? res['productName'] : '';
 // res['variantName'] = this.uploadType === 'select' ? this.filtered_productItem[0]['variantTypeName'] : this.filtered_productItem[0]['variantName'];
  res['variantName'] = res['variantName'] ? res['variantName'] : 'card'

  res['price'] =  +res['price'] ? res['price'] : '';
  res['currencyCode'] = res['currencyCode'] ?  res['currencyCode'] : 'AED';
  res['productOID'] =  +res['productOID'] ? res['productOID'] : (res['productOid'] ? res['productOid'] : '');
  res['variantOid'] = +res['variantOid'] ? res['variantOid'] : (res['productVariantOid'] ? res['productVariantOid'] : '');
  res['language_code'] =  res['language_code'] ?  res['language_code'] : 'en';
  delete res['maxDenomination'];
  ///these new deletes are for -- type = select
  delete res['skuBean'];
  delete res['status'];
  delete res['categoryName'];
  delete res['variantTypeName'];
  delete res['variantTypeOid'];
  delete res['productOid'];
  delete res['productVariantOid'];



})


///let productArryList_finalmodify = this.insertProductArray;

copyWithSlice.map(res =>{
    
  res['uploadData'] = {
    "skuLink":  this.skuLink_url ? this.skuLink_url : '',
    "uploadFileName": this.skuXslFileName ? this.skuXslFileName : '',
      "skuList":  skulist_modify
  }  


})
 console.log('productArryList final>>>',copyWithSlice);



////product modify end




let multiple_coupon_allowed =  formvalue.moreThenOneCouponAllow == 'TRUE' ? formvalue.moreThenOneCouponAllow = true: '';


let  updateEvent = {
  "eventOid":this.eventOid,
  "startDate": moment(formvalue['startDate'], "YYYY-MM-DD h:m").format("YYYY-MM-DD"),
  "endDate":  moment(formvalue['endDate'], "YYYY-MM-DD h:m").format("YYYY-MM-DD") ? moment(formvalue['endDate'], "YYYY-MM-DD h:m").format("YYYY-MM-DD") : '',
  "startTime": moment(formvalue['startTime'], "YYYY-MM-DD h:m").format("HH:mm:ss"),//h:mm a
  "endTime":  moment(formvalue['endTime'], "YYYY-MM-DD h:m").format("HH:mm:ss") ? moment(formvalue['endTime'], "YYYY-MM-DD h:m").format("HH:mm:ss") : '',
  "perpetual": formvalue.isPreptual ? formvalue.isPreptual:false,
  "defaultEvent" :formvalue.isDefaultEvent ? formvalue.isDefaultEvent : false,
   "brandOid" : this.brandId,
   "product_gifting" : formvalue.enableProduct ? formvalue.enableProduct : false,
   "program_gifting" : formvalue.enableProgram ? formvalue.enableProgram : false,
   "coupon_gifting" :   formvalue.isCouponsEnabled ? formvalue.isCouponsEnabled : false,
   "multiple_coupon_allowed" :multiple_coupon_allowed ? multiple_coupon_allowed : false,
   "multiple_product_allowed" :   formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
   "multiple_program_allowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
   "status": 'Online',  //"NEW", 
   "Product_Image": "",
   "eventDescription": formvalue.eventdesc,
    "displayEventOnCustomerApp": formvalue.isDisplayEvent ? "yes" : 'no',
  // "conditionArray":conditionArray,
  // "giftLanguageList":giftLanguageList,
   "eventNamesTnc": eventNamesTnc,
   "storeId": this.selectedStorearray.length>0 ?  this.selectedStorearray : [],
   "location":this.selectedLocationarray.length>0 ? this.selectedLocationarray : [],
    "users": FINAL_OBJ_MODIFY,
     "storeAppContent": {
     "title":formvalue.apptitle,
     "description": formvalue.appdesc,
   //  "note": "hello welcome to the store"
     }
     
}

console.log('isCouponsEnabled>>>>>',this.updateEventForm.get('isCouponsEnabled').value);
console.log('enableProgram>>>>>',this.updateEventForm.get('enableProgram').value);
console.log('enableProduct>>>>>',this.updateEventForm.get('enableProduct').value);

console.log('selectedCouponArray>>>>>',this.selectedCouponArray);


///make gifting dynamic
//all c pr pd   
if(this.updateEventForm.get('isCouponsEnabled').value && this.updateEventForm.get('enableProgram').value && this.updateEventForm.get('enableProduct').value){
  console.log('gifting type>>>>>> ------ coupon,program,product');
  let giftingdata = [
    {
        "giftingtype": "programs",
        "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
        "GiftingDetails": this.programGridVal
    },
    {
      "giftingtype": "coupons",
      "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
      "GiftingDetails":this.selectedCouponArray
  },
  {
    "giftingtype": "products",
    "productImage": "",
    "enableGifting": this.updateEventForm.get('enableProduct').value ? this.updateEventForm.get('enableProduct').value : false,
    "GiftingDetails": {
          "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
          "productDetails": copyWithSlice
    }
  
  }
  ]
  updateEvent['gifting'] = giftingdata;
  
  
  }
  //none c pr pd   
if(!this.updateEventForm.get('isCouponsEnabled').value && !this.updateEventForm.get('enableProgram').value && !this.updateEventForm.get('enableProduct').value){
  console.log('gifting type>>>>>> ------ none');
  let giftingdata = []
  updateEvent['gifting'] = giftingdata;
  
  
  }
  
  //c pro
  if(this.updateEventForm.get('isCouponsEnabled').value && this.updateEventForm.get('enableProgram').value && !this.updateEventForm.get('enableProduct').value){
    console.log('gifting type>>>>>> ------ coupon,program');
  
    let giftingdata = [
      {
          "giftingtype": "programs",
          "moreThenOneGiftAllowed": false,
          "GiftingDetails": this.programGridVal
      },
      {
        "giftingtype": "coupons",
        "moreThenOneGiftAllowed": false,
        "GiftingDetails":this.selectedCouponArray
    },
   
    ]
    updateEvent['gifting'] = giftingdata;
    
    
    }
  
  //c prd
  if(this.updateEventForm.get('isCouponsEnabled').value && !this.updateEventForm.get('enableProgram').value && this.updateEventForm.get('enableProduct').value){
    console.log('gifting type>>>>>> ------ ,coupon,product');
  
    let giftingdata = [
    
      {
        "giftingtype": "coupons",
        "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
        "GiftingDetails":this.selectedCouponArray
    },
    {
      "giftingtype": "products",
      "productImage": "",
      "enableGifting": this.updateEventForm.get('enableProduct').value ? this.updateEventForm.get('enableProduct').value : false,
      "GiftingDetails": {
            "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
            "productDetails": copyWithSlice
      }
    
    }
    ]
    updateEvent['gifting'] = giftingdata;
    
    
    }  
  //c
    if(this.updateEventForm.get('isCouponsEnabled').value && !this.updateEventForm.get('enableProgram').value && !this.updateEventForm.get('enableProduct').value){
      console.log('gifting type>>>>>> ------ coupon');
  
      let giftingdata = [
      
        {
          "giftingtype": "coupons",
          "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
          "GiftingDetails":this.selectedCouponArray
      }
     
      ]
      updateEvent['gifting'] = giftingdata;
      
      
      }
  
      //pr pd
      if(!this.updateEventForm.get('isCouponsEnabled').value && this.updateEventForm.get('enableProgram').value && this.updateEventForm.get('enableProduct').value){
        console.log('gifting type>>>>>> ------ ,program,product');
  
        let giftingdata = [
          {
              "giftingtype": "programs",
              "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
              "GiftingDetails": this.programGridVal
          },
      
        {
          "giftingtype": "products",
          "productImage": "",
          "enableGifting": this.updateEventForm.get('enableProduct').value ? this.updateEventForm.get('enableProduct').value : false,
          "GiftingDetails": {
                "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
                "productDetails": copyWithSlice
          }
        
        }
        ]
        updateEvent['gifting'] = giftingdata;
        
        
        }
           //pr c
      // if(this.updateEventForm.get('isCouponsEnabled').value && this.updateEventForm.get('enableProgram').value && !this.updateEventForm.get('enableProduct').value){
      //   console.log('gifting type>>>>>> ------ coupon,program');
  
      //   let giftingdata = [
      //     {
      //         "giftingtype": "programs",
      //         "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
      //         "GiftingDetails": this.programGridVal
      //     },
      //     {
      //       "giftingtype": "coupons",
      //       "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
      //       "GiftingDetails":this.selectedCouponArray
      //   }
       
      //   ]
      //   updateEvent['gifting'] = giftingdata;
        
        
      //   }
         // pr
         if(!this.updateEventForm.get('isCouponsEnabled').value && this.updateEventForm.get('enableProgram').value && !this.updateEventForm.get('enableProduct').value){
          console.log('gifting type>>>>>> ------ ,program,');
  
          let giftingdata = [
            {
                "giftingtype": "programs",
                "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
                "GiftingDetails": this.programGridVal
            }
         
          ]
          updateEvent['gifting'] = giftingdata;
          
          
          }
  
  
  
  
      // prd
      if(!this.updateEventForm.get('isCouponsEnabled').value && !this.updateEventForm.get('enableProgram').value && this.updateEventForm.get('enableProduct').value){
        console.log('gifting type>>>>>> ------ ,,product');
  
        let giftingdata = [
       
        {
          "giftingtype": "products",
          "productImage": "",
          "enableGifting": this.updateEventForm.get('enableProduct').value ? this.updateEventForm.get('enableProduct').value : false,
          "GiftingDetails": {
                "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
                "productDetails": copyWithSlice
          }
        
        }
        ]
        updateEvent['gifting'] = giftingdata;
        
        
        }
            // prd c
      // if(this.updateEventForm.get('isCouponsEnabled').value && !this.updateEventForm.get('enableProgram').value && this.updateEventForm.get('enableProduct').value){
      //   console.log('gifting type>>>>>> ------ coupon,product');
  
      //   let giftingdata = [
        
      //     {
      //       "giftingtype": "coupons",
      //       "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
      //       "GiftingDetails":this.selectedCouponArray
      //   },
      //   {
      //     "giftingtype": "products",
      //     "productImage": "",
      //     "enableGifting": this.updateEventForm.get('enableProduct').value ? this.updateEventForm.get('enableProduct').value : false,
      //     "GiftingDetails": {
      //           "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
      //           "productDetails": 'copyWithSlice'
      //     }
        
      //   }
      //   ]
      //   updateEvent['gifting'] = giftingdata;
        
        
      //   }
  
        //pd pr
        // if(!this.updateEventForm.get('isCouponsEnabled').value && this.updateEventForm.get('enableProgram').value && this.updateEventForm.get('enableProduct').value){
        //   console.log('gifting type>>>>>> ------ ,program,product');
  
        //   let giftingdata = [
        //     {
        //         "giftingtype": "programs",
        //         "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
        //         "GiftingDetails": this.programGridVal
        //     },
        
        //   {
        //     "giftingtype": "products",
        //     "productImage": "",
        //     "enableGifting": this.updateEventForm.get('enableProduct').value ? this.updateEventForm.get('enableProduct').value : false,
        //     "GiftingDetails": {
        //           "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
        //           "productDetails": 'copyWithSlice'
        //     }
          
        //   }
        //   ]
        //   updateEvent['gifting'] = giftingdata;
          
          
        //   }
       
  
        this.loading = true;


console.log('reqBody-------------------',updateEvent);
//return;

this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/edit_event',updateEvent).subscribe(res => {
  console.log('edit_event res >>>>>',res);


  if(this.displayEventOnCustomerApp == 'YES' && this.appContentDetails){
this.updateAppContent();
console.log('upcontent also submitted')
  }else{
    console.log('no upcontent submitted')

  }
  
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 2000,
    data: {
      status: "success",
      message: "Updated successfully"
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
        duration: 2000,
        data: {
          status: "failure",
          message: err.error.errorDetails[0].description
        }
      });
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 2000,
        data: {
          status: "failure",
          message: "Your request cannot be saved at this time. Please try again later"
        }
      });
    }
  
  
  });
  


  }

changeEventStatus(event: MatSlideToggleChange){
  console.log('toggle', event.checked);

  let data = {
    "eventId":this.eventOid,
    "statusToBe": this.toggleVal == true ? "ONLINE" : "OFFLINE",

  }
 
  this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/change_event_status',data).subscribe(res => {
    console.log('statusToBe Res>>>>>>>',res);

    let response = res['output'];

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 2000,
      data: {
        status: "success",
        message: response
      }
    });


  }
, err => {
    this.loading = false;
    console.log("error Status = ", err);
 
  //  err.error.errorMessage === 'Duplicate name not allowed' ? err.error.errorMessage = 'Please enter unique event name' : err.error.errorMessage;

    if (err.error.errorType == 'VALIDATION') {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        data: {
          status: "failure",
          message:  err.error.errorMessage
        }
      });
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        data: {
          status: "failure",
          message:  err.error.errorMessage
        }
      });
    }
  });
}





editAfterLive(){
  console.log('edit after live');
let formvalue = this.updateEventForm.value;
let conditionArray = this.updateEventForm.controls['conditionArray'].value;

let array = conditionArray;
//console.log('conditionArray',conditionArray);
console.log('formvalue',formvalue);

if(!formvalue['isPreptual']){

  let enddate = formvalue['endDate'];
  let endTime = formvalue['endTime'];

console.log('enddate===',enddate);
console.log('endTime===',endTime);
if(enddate == ''){
  this.updateEventForm.controls['endDate'].setValidators(Validators.required);
  this.updateEventForm.controls['endDate'].updateValueAndValidity();
//  this.updateEventForm.controls['endTime'].setValidators(Validators.required);
//  this.updateEventForm.controls['endTime'].updateValueAndValidity();
this.snackBar.openFromComponent(SnackBarComponent, {
  duration: 2000,
  data: {
    status: "failure",
    message: "Please enter end date"
  }
});
return;
}
if(endTime == ''){
  this.updateEventForm.controls['endDate'].setValidators(Validators.required);
  this.updateEventForm.controls['endDate'].updateValueAndValidity();
//  this.updateEventForm.controls['endTime'].setValidators(Validators.required);
//  this.updateEventForm.controls['endTime'].updateValueAndValidity();
this.snackBar.openFromComponent(SnackBarComponent, {
  duration: 2000,
  data: {
    status: "failure",
    message: "Please enter end time"
  }
});
return;

}
}



let ctx = new Date().toLocaleTimeString();
let currentTime = ctx
let startTime = moment(formvalue['startTime'], "YYYY-MM-DD h:m").format("HH:mm:ss");
let endTime = moment(formvalue['endTime'], "YYYY-MM-DD h:m").format("HH:mm:ss");


if(new Date ('1/1/1999 ' + currentTime) > new Date ('1/1/1999 ' + startTime)){
  console.log('strt time is less then current time>>')
  this.timeerror = true;
return;
}else{
  this.timeerror = false;
} 

if(new Date ('1/1/1999 ' + startTime) > new Date ('1/1/1999 ' + endTime)){
  console.log('strt time is less then  endTime>>')
  this.timeerror2 = true;
return;
}else{
  this.timeerror2 = false;

}


let tnc = array.map(res=>{
  delete res['languageName'];
})

let enddate = moment(formvalue['endDate'], "YYYY-MM-DD h:m").format("YYYY-MM-DD");
//let endTime =  moment(formvalue['endTime'], "YYYY-MM-DD h:m").format("HH:mm:ss");

  let data = {
    "eventOid": this.eventOid,
    "endDate":  formvalue['isPreptual'] == false ? enddate : null,           // enddate ? enddate : '',
    "endTime":  formvalue['isPreptual'] == false ? endTime : null,
    "eventDescription": formvalue.eventdesc ? formvalue.eventdesc : '',
    "displayEventOnCustomerApp": formvalue.isDisplayEvent ? "yes" : 'no',
    "Product_Image": "",
   // "displayEventOnCustomerApp": true,
    "eventNamesTnc": conditionArray,
    "storeAppContent": {
      "title":formvalue.apptitle ? formvalue.apptitle : '',
      "description": formvalue.appdesc ? formvalue.appdesc : '',
      }
 
   }
   console.log('edit after live req body',data);
   this.loading = true;
 
  this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/edit_event_after_live',data).subscribe(res => {
    console.log('edit_event_after_live Res>>>>>>>',res);

    let response = res['output'];

    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 2000,
      data: {
        status: "success",
        message: response
      }
    });

    this.loading = false;
    this.router.navigate(['/search-events']);
  }
, err => {
    this.loading = false;
    console.log("error Status = ", err);
 
  //  err.error.errorMessage === 'Duplicate name not allowed' ? err.error.errorMessage = 'Please enter unique event name' : err.error.errorMessage;

    if (err.error.errorType == 'VALIDATION') {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        data: {
          status: "failure",
          message:  err.error.errorMessage
        }
      });
    } else {
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 3000,
        data: {
          status: "failure",
          message:  err.error.errorMessage
        }
      });
    }
  });
}
eventData:any;
strtTime:any;
closetime:any;
loading:boolean;
public users:any;
public users2:any;
public users3:any;

public userOid = [];
couponsgiftingLimitsArry1 = [];
programgiftingLimitsArry1 = [];
allGiftingLimitsArry = [];
productgiftingLimitsArry1 = [];
couponsgiftingLimitsx = [];

userArray = [];
userArrayProgram = [];
userArrayProduct = [];
FINAL_OBJ = [];
viewSelectedEvent(eventOid){

  this.loading = true;

  let data = {
   "eventId":eventOid,
   "languageCode":"en"
 }

 this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/view_selected_event_details',data).subscribe(res => {
   console.log('view event',res);
   this.loading = false;
   if(res){
    this.eventData = res['output'];

    this.approvalStatus = this.eventData['approvalStatus'];
     this.approvalStatus = this.approvalStatus && this.approvalStatus.toUpperCase();
     //this.approvalStatus = 'EXPIRE';
    // this.approvalStatus = 'LIVE';
     if(this.approvalStatus == 'LIVE'){
      this.noEdit =  true;
     }else{
      this.noEdit =  false;

     }


   this.eventData['perpetual'].toLowerCase() == "true" ? this.isPreptual = true : this.isPreptual = false;
    this.eventData['displayEventOnCustomerApp'].toLowerCase() === "yes" ? this.isDOCAPP = true : this.isDOCAPP = false;
    this.eventData['defaultEvent'].toLowerCase() === "true" ? this.isDafultEvent = true : this.isDafultEvent = false;
    this.eventDetails = this.eventData['eventNamesTnc'];
   // this.locationDetails = this.eventData['locationDetails'];
    this.eventData['perpetual'];
   // this.giftingTypeis = this.eventData['gifting']['giftingtype'];
    //this.GiftingDetails = this.eventData['gifting']['GiftingDetails'];
    this.toggleVal = this.eventData["status"] == "ONLINE" ? true : false;

 let brandName    =  this.eventData["brandName"];
 let brandOid    =  this.eventData["brandOid"];

    // brandName: "Mr.B"
    // brandOid: 1


    this.isCouponGifting =   this.eventData['coupon_gifting'];
    this.isProgramGifting =   this.eventData['program_gifting'];
    this.isProductGifting =   this.eventData['product_gifting'];

    this.selectedStorearray = this.eventData['storeDetails'];

    this.locationDetails = this.eventData['locationDetails'];

    this.getLocation(this.locationDetails)

       //  console.log('selectedStorearray>>>',this.selectedStorearray);

    this.event_coupon_gifting_view = this.eventData['event_coupon_gifting_view'] && this.eventData['event_coupon_gifting_view'];
    this.couponDataForGrid(this.event_coupon_gifting_view);

    this.couponLength = this.eventData['event_coupon_gifting_view'].length;
    this.programLength = this.eventData['event_program_gifting_view'].length;
    this.productLength = this.eventData['event_product_gifting_view'].length;
    this.usersGifting = this.eventData['user'];



    this.addProgramResNew = this.eventData['event_program_gifting_view'];
    if(this.addProgramResNew){
      this.addProgramResNew.map(res=>{
        res['balanceForEvent'] = res['BalanceForEvent'];
        res['maxPerStorePerDay'] = res['maxperStoreperDay'];
        res['maxPerLocationPerDay'] = res['maxperLocationperDay']


      })

    }

///////product gift
   let event_product_gifting_view = this.eventData['event_product_gifting_view'];
    if(event_product_gifting_view){
      this.insertProductArray = event_product_gifting_view;
      this.insertProductArray.map(res=>{
        res['variantTypeName'] = res['variantName'];
        res['maxDenomination'] = res['denominations'];
        res['maxPerLocation'] = res['maxperLocationperDay']


      })
    }
/////
///store sku code
if(event_product_gifting_view){
  for(let i =0;i<event_product_gifting_view.length;i++){
    if(event_product_gifting_view[i].selectionType == 'SELECT'){
      this.selectedProductarray.push(event_product_gifting_view[i].skuCode);
      const arrrayTempw = this.selectedProductarray;
      this.selectedProductarray = Array.from(new Set(arrrayTempw));
      console.log('sku list',this.selectedProductarray); 
    }
  
  }

}
///store sku code end

/////////////user gifting

let user = this.eventData['user'];
for(let i = 0;i<user.length;i++){
  this.userinfo.push(user[i]);

  this.userOid.push(user[i]['userOid']);
//  console.log('userOid',user[i]['userOid']);
//  console.log('userOid arry',this.userOid);

}



let flatarray1 = this.userOid.reduce((acc, val) => acc.concat(val), []);



if(this.userinfo){
  for(let i=0;i<this.userinfo.length;i++){
    
       if(this.userinfo[i]['giftingLimits']){
        let COUPON = this.userinfo[i]['giftingLimits'].filter(x => x.giftingType == 'COUPON');
       let PROGRAM = this.userinfo[i]['giftingLimits'].filter(x => x.giftingType == 'PROGRAM');
       let PRODUCT = this.userinfo[i]['giftingLimits'].filter(x => x.giftingType == 'PRODUCT');

    
       
//        console.log('userOid,',this.userinfo[i]['userOid']);
// console.log('COUPON,',COUPON);
// console.log('PROGRAM,',PROGRAM);

// console.log('PRODUCT,',PRODUCT);

let obj = {
  'userOid':this.userinfo[i]['userOid'],
  'couponsgiftingLimits':COUPON,
  'programgiftingLimits':PROGRAM,
  'productgiftingLimits':PRODUCT


}


//console.log('obj,',obj);
this.FINAL_OBJ.push(obj);
//console.log('FINAL_OBJ,',this.FINAL_OBJ);

       }
  }
}

this.fetchUsers(flatarray1);

// let flatarray2 = this.userOid.flat();
// console.log('flatarray2',flatarray2);

console.log('this.userinfo from api>>>>>>>',this.userinfo);

////////




    // this.gifting_type_zero =  this.eventData['gifting'][0] && this.eventData['gifting'][0]['giftingtype'];
    // this.gifting_type_one =  this.eventData['gifting'][1] && this.eventData['gifting'][1]['giftingtype'];
    // this.gifting_type_two =  this.eventData['gifting'][2] && this.eventData['gifting'][2]['giftingtype'];
    // if(this.eventData['coupon_gifting']){
    // let couponID = this.gifting_type_zero['GiftingDetails'];

    // console.log('couponID>>>',couponID);

    // this.getAllCoupon(348);
    // }
    // if(this.eventData['program_gifting']){

    // }


    // if(this.eventData['product_gifting']){

    // }

    // console.log('gifting_type_zero',this.gifting_type_zero);
    // console.log('gifting_type_one',this.gifting_type_one);
    // console.log('gifting_type_two',this.gifting_type_two);

 


    if (this.eventData.startTime != null) {
      this.strtTime = new Date();
      let e = this.eventData['startTime'].split(":");
      this.strtTime.setHours(e[0]);
      this.strtTime.setMinutes(e[1]);
    }
    //let closetime;
    if (this.eventData.endTime != null) {
      this.closetime = new Date();
      let t = this.eventData['endTime'].split(":");
      this.closetime.setHours(t[0]);
      this.closetime.setMinutes(t[1]);
    }

    this.buildEventForm(this.eventData);
    this.appContentDetails =  this.eventData['appContentDetails'][0] && this.eventData['appContentDetails'][0]
      console.log('appContentDetails',this.appContentDetails);

    this.giftLanguageList(this.eventData);
    this.conditionFormArray(this.eventData);
    this.selectedBrands(this.eventData)
//////app content/////////////////////////////////////////////
       this.displayEventOnCustomerApp = this.eventData['displayEventOnCustomerApp'];

    if(this.displayEventOnCustomerApp == 'YES' && this.appContentDetails){
     // this.updateAppContentEventForm(this.eventData['appContentDetails']);

     for (let i = 0; i < this.appContentDetails['appContent'].length; i++) {
     // this.imagePath[i] = this.appContentDetails.appContent[i].image;

      if (this.appContentDetails['appContent'][i]['image'] != ''){
        this.selectedStatus = 1;
      //  this.selectedStatus = 1;

          console.log('image path is there',1)
      }else if(this.appContentDetails['appContent'][i]['videoLink'] != ''){
        this.selectedStatus = 3;
        console.log('videoLink path is there',2)

      }else{
        this.selectedStatus = 2;
        console.log('videoUpload path is there',3)

      }
    }
    
        this.updateAppContentEventForm(this.appContentDetails);
        
      
    }

   }

 })
}





getStore(){
  let data = {
    "page":  "0",
  "pageSize": 1000,
    "order": {
      "column": "oid",
      "dir": "asc"
    },
    "keySearch": "",
    "fieldSearch": [
      {
        "fieldName": "country.oid",
        "fieldValue": "",
      },
      {
        "fieldName": "cityOids",
        "fieldValue": "",
      },
      {
        "fieldName": "mallOids",
        "fieldValue": "",
      },
      {
        "fieldName": "brandOids",
        "fieldValue": "",
      }
    ]
  }


 // this.loadingResponse = true;
    this.http.postJson(environment.APIEndpoint + 'api/rpa/store/v2/getAll', data).subscribe(res => {
//console.log('stores respnse',res);
this.totalCount = res["totalCount"];

    })
}

getLocation(locationDetailsID){
  let data = {
    "universalId":"",
    "countryOid":"",
    "cityOid":[],
    "languageCode":"en"
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


 // this.loadingResponse = true;
    this.http.postGiftingJson(environment.GiftingAPIEndpoint + 'rest/api/v1/event_admin_location/search_location', data1).subscribe(res => {
///console.log('location respnse',res);
//console.log('location ID TO FILTER>>',locationDetailsID);
if(res['statusCode']===200){

   let allLocation = res['output']['searchOutput'];
   let result = allLocation && allLocation.filter( el => (-1 != locationDetailsID.indexOf(el.locationOid)));
  /// console.log('filtered loc>>>',result);

if(result.length>0){
  for(let i=0;i<result.length;i++){
    this.allLocationList.push(result[i]);

    this.selectedLocationarray.push(result[i].locationOid);
    const arrrayTempw = this.selectedLocationarray;
    this.selectedLocationarray = Array.from(new Set(arrrayTempw));
   // console.log('selected loc id',this.selectedLocationarray);

  }

 // console.log('all this.allLocationList',this.allLocationList);

  this.mydataSource = new MatTableDataSource<any>(this.allLocationList);
  this.mydataSource.paginator = this.paginator;
  this.mydataSource.sort = this.sort;
}else{
let result = [];
this.mydataSource = new MatTableDataSource<any>(result);
this.mydataSource.paginator = this.paginator;
this.mydataSource.sort = this.sort;
}

 }

    })
}

couponDataForGrid(event_coupon_gifting_view){
  //console.log('event_coupon_gifting_view',event_coupon_gifting_view)

  // this.mydataSource = new MatTableDataSource<any>(event_coupon_gifting_view);
  // this.mydataSource.paginator = this.paginator;
  // this.mydataSource.sort = this.sort;
  event_coupon_gifting_view && event_coupon_gifting_view.map(res=>{
    res["couponTitle"] = res["couponName"];
    res["discountValue"] = res["value"];
    res["couponId"] = res["couponID"];
  })


 // console.log('event_coupon_gifting_view',event_coupon_gifting_view);


  for(let i=0;i<event_coupon_gifting_view.length;i++){

    this.allCouponList.push(event_coupon_gifting_view[i]);

    this.CouponArray.push(event_coupon_gifting_view[i]);

    this.selectedCouponArray.push(event_coupon_gifting_view[i].couponId);
    const arrrayTempw = this.selectedCouponArray;
    this.selectedCouponArray = Array.from(new Set(arrrayTempw));
   // console.log('selectedCouponArray id',this.selectedCouponArray);

  }

 // console.log('all this.allCouponList',this.allCouponList);

  this.coupondataSource = new MatTableDataSource<any>(this.allCouponList);
  this.coupondataSource.paginator = this.secondPaginator;
  this.coupondataSource.sort = this.sorttwo;

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

  this.http.postJson(environment.APIEndpoint + 'api/rpa/user/v3/search', data).subscribe(res => {
    if(res){
 /// console.log('alluser res>>>',res);
    ///this.loading = false;
    let alluser = res['items'];
    let useroidfinal = users && users.map(i=>Number(i));


    let result = alluser.filter( el => (-1 != useroidfinal.indexOf(el.userId)));
  //  console.log('matched>>',result);
  //console.log('allUser filtred matched>>>>',result);

  this.allUser = result;


  if(result.length>0){
    for(let i=0;i<result.length;i++){
      this.allUserList.push(result[i]);

      this.selectedUserArray.push(result[i].userId);
      const arrrayTempw = this.selectedUserArray;
      this.selectedUserArray = Array.from(new Set(arrrayTempw));
    //  console.log('selected user id',this.selectedUserArray);
  
    }
  
   // console.log(' this.allUserList', this.allUserList);
  
    this.userdataSource = new MatTableDataSource<any>(this.allUserList);
    this.userdataSource.paginator = this.firstPaginator
    this.userdataSource.sort = this.sortnew;
  }else{
  let result = [];
  this.userdataSource = new MatTableDataSource<any>(result);
  this.userdataSource.paginator = this.firstPaginator
  this.userdataSource.sort = this.sortnew;
  }


  }
})
}





  public bannersLocaleBeanArray;
  public appContent1:any[];
  imgUploadErr:boolean;
  updateAppContent(){
   // console.log('imagePath',this.imagePath);
  let formdata = this.updateContentForm.value;
   
   console.log('appContentLanguageList>>>',this.updateContentForm.controls['appContentLanguageList'].value);
  
  
  /////////////
  let giftLanguageList = this.updateContentForm.controls['appContentLanguageList'].value
  let imgVidoUrl = this.updateContentForm.controls['imgVidoUrl'].value;
  let videoURL =  this.updateContentForm.controls['videoURL'].value;
  let videoUpload =  this.updateContentForm.controls['videoUpload'].value;
  
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
            "content": giftLanguageList[content]['eventFieldApp'],
            'uploadImage':this.imagePath[content],
            "uploadVideo": "",
            "videolink": ""
        }
        appContentarray.push(new_obj);
  
    }
  
        }
  
  }
  
  
  //////hide validation of url link
      const pushController = this.updateContentForm.get('videoURL') as FormArray;
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
            "content": giftLanguageList[content]['eventFieldApp'],
            'uploadImage':"",
            "uploadVideo": this.videoSRCUrl[content],
            "videolink": ""
        }
        appContentarray.push(new_obj);
  
    }
  
        }
  
  }
  
  
  //////hide validation of url link
  const pushController = this.updateContentForm.get('videoURL') as FormArray;
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
            "content": giftLanguageList[content]['eventFieldApp'],
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
  const pushController = this.updateContentForm.get('videoURL') as FormArray;
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
    
      "eventId":this.eventOid,
      "email": formdata.email,
      "phone": formdata.phone,
      "countryCode": this.countryCode,
      "appContent":appContentarray
     
    }
  
  
  
  
  console.log('reqBody',reqBody);
  
   if(this.updateContentForm.invalid){
    console.log('form is not valid');
  
      return;
  
    }
  
  let url = 'rest/api/v1/event_admin/edit_appcontentdata';
  
  this.http.postGiftingJson(environment.GiftingAPIEndpoint+url,reqBody).subscribe(res => {
    console.log('create app content',res);
    this.updateEvent();
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
      data: {
        status: "success",
        message: "Updated successfully"
      }
    });
    this.loading = false;
  //  this.router.navigate(['/search-events']);
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

  getAllCountries() {
    const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
    this.http.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
     // console.log('GET_ALL_COUNTRIES list',res);
                  this.countryCode = res[0]['countryCode'];
    }, err => {
      console.log(err);
    });
  }


//////////edit gift


viewGift(data){

  const dialogRef = this.dialog.open(ViewGiftingLimitComponent);
  dialogRef.componentInstance.userOid = data;
  dialogRef.componentInstance.totalData =  this.allUser;
  dialogRef.componentInstance.fullusersGifting = this.usersGifting

  dialogRef.afterClosed().subscribe(result => {
   console.log('gift details>>>>>>',result);
 

  })
}
editGift(data){
 
  const dialogRef = this.dialog.open(EditGiftingLimitDialogComponent);
  dialogRef.componentInstance.userOid = data;
  dialogRef.componentInstance.totalData =  this.allUser;
  dialogRef.componentInstance.mode =  'edit';
  dialogRef.componentInstance.isLive =  this.noEdit;

  
 // dialogRef.componentInstance.fullusersGifting = this.usersGifting
 // dialogRef.componentInstance.FINAL_OBJ = this.FINAL_OBJ
  dialogRef.componentInstance.FINAL_OBJ_NEW_Copy = this.FINAL_OBJ

  dialogRef.afterClosed().subscribe(result => {
   console.log('gift details>>>>>>',result);
   if(result.data === 'no'){
    this.FINAL_OBJ = result.final_obj;

    console.log('no change in data',this.FINAL_OBJ);

   }else{
    console.log('change in data');
    this.FINAL_OBJ = result.final_obj;
    console.log('change in data-----',this.FINAL_OBJ);

   }
  })
}








  public userinfo1 = [];
// giftLimit(userId){

// console.log('userid',userId)
//   const dialogRef = this.dialog.open(GiftingLimitDialogComponent);
//   console.log('sending this info>>>>',this.userinfo);
//   console.log('sending this info1>>>>',this.userinfo1);

//   console.log('sending this info3>>>>',this.userinfodummy);

//   dialogRef.componentInstance.clikedUserID =  userId;

//   dialogRef.componentInstance.giftingDetails = this.userinfodummy;


 



  
//   dialogRef.afterClosed().subscribe(result => {
//    console.log('gift details>>>>>>',result);

//    if(result['buttonName'] == 'SELECT'){


    
//     console.log('response before view gift limit >> ',this.userinfo);
//     console.log('response after view gift limit >> ', result['jsondata']);

//     this.userinfodummy.push(result['jsondata']);
//   console.log('this.userinfodummy 2',this.userinfodummy); 

//     this.popupdataAfterClose = result['jsondata'];
   
//  for(let i=0;i<this.userinfo.length;i++){

//      if(this.userinfo[i]['userOid'].includes(userId)){
//         console.log('matched array',this.userinfo[i]);

//         this.machedArray = this.userinfo[i];
//         this.userinfo.splice(i,1);
      
//      }
// }




// console.log('this.popupdataAfterClose>>>>',this.popupdataAfterClose);

// let couponsgiftingLimits_popup = this.popupdataAfterClose['couponsgiftingLimits'];
// let programgiftingLimits_popup = this.popupdataAfterClose['programgiftingLimits'];
// let productgiftingLimits_popup = this.popupdataAfterClose ['productgiftingLimits'];


// let couponsgiftingLimits = this.machedArray['couponsgiftingLimits'];
// let programgiftingLimits = this.machedArray['programgiftingLimits'];
// let productgiftingLimits = this.machedArray['productgiftingLimits'];

// console.log('couponsgiftingLimits old',couponsgiftingLimits);
// console.log('couponsgiftingLimits_popup',couponsgiftingLimits_popup);

// if(couponsgiftingLimits.length>0 && couponsgiftingLimits_popup.length>0){




//   for(let i = 0;i<couponsgiftingLimits.length;i++){
//     for(let j = 0;j<couponsgiftingLimits_popup.length;j++){
//        if(couponsgiftingLimits[i]['maxGiftPerCustomer'] == couponsgiftingLimits_popup[j]['maxGiftPerCustomer'] && couponsgiftingLimits[i]['maxGiftPerEvent'] == couponsgiftingLimits_popup[j]['maxGiftPerEvent']){
//              console.log('no change in gifting');
//        }else{
//         console.log('some change in gifting');
//         this.userinfo.push(this.popupdataAfterClose);
//         console.log('this.userinfo data1>>>',this.userinfo);


//         this.doCalCULATION(userId);
//        return;
//        }
//     }
//   }





// }



// }

//   })

// }

  }