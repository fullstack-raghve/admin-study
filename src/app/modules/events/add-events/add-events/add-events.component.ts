import { Component, ElementRef, OnInit, ViewChild,AfterViewInit, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';

import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
//import {MatTableDataSource} from '@angular/material/table';
//import { MatPaginator, MatSort } from '@angular/material';
//import {MatPaginator} from '@angular/material/paginator';
import { MatTabsModule } from "@angular/material";
import { MatPaginator, MatSort, MatTable, MatTableDataSource, Sort } from '@angular/material';
import * as moment from 'moment';
import { HttpService } from '../../../../services/http-service';
import { environment } from '../../../../../environments/environment'
import { UploadFile } from '../../../../services/uploadFile.service';
import { SnackBarComponent } from '../../../../shared/components/snack-bar/snack-bar.component';
import { SelectLocationDialogComponent } from '../../select-location-dialog/select-location-dialog.component';
import { UserLocationDialogComponent } from '../../user-location-dialog/user-location-dialog.component';
import { GiftingLimitDialogComponent } from '../../gifting-limit-dialog/gifting-limit-dialog.component';
import { SelectProductItemsDialogComponent } from '../../select-product-items-dialog/select-product-items-dialog.component';
import { SelectCouponDialogeComponent } from '../../select-coupon-dialoge/select-coupon-dialoge.component';
import { EventsStoreDialogComponent } from '../../events-store-dialog/events-store-dialog.component';
import { ExtraValidators } from 'src/app/services/validator-service';
import { Router } from '@angular/router';
import { SelectProductDailogComponent } from 'src/app/shared/components/select-product-dailog/select-product-dailog.component';
import { SelectCategoryDailogComponent } from 'src/app/shared/components/select-category-dailog/select-category-dailog.component';
import { addAttributesDialog } from 'src/app/shared/components/attributes-dialog/attributes.component';
/// import { SearchUserComponent } from '../../../../modules/userManagement/search-user/search-user/search-user.component'
import { filter } from 'rxjs/operators';
import { value } from '../../../../feedback.global';
import { EditGiftingLimitDialogComponent } from '../../edit-gifting-limit-dialog/edit-gifting-limit-dialog.component';

export class Color {

  $primary = '#2ebce6';
  $secondary = '#e53935';
  $normal = '#757575';
}

// export interface PeriodicElement {
//   couponId: number;
//   couponTitle: string;
//   discountType:string;
//   discountValue:number;
//   startDate:any;
//   endDate:any;

// }





@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class AddEventsComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
    title: 'Events',
    link: ''
  },
  {
    title: 'Add Events',
    link: '/add-events'
  }
  ];
  locationDetails = [];
  isMarkDefault : boolean = false;
  public Editable = true;
  addeventForm:FormGroup;
  alignCss = [];
  color = new Color();
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public languages = JSON.parse(localStorage.getItem("languageList"));

  public currentDate;
  public minEndDate;
  public endDateError = null;
  public selectedStorearray = [];
  public selectedCouponArray = [];
  public selectedUserArray = [];
  public storeCount: any = 5000;
  public imagePath = [];
  public filePathUrl = localStorage.getItem("imgBaseUrl");

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
  maxDenomination = [];
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  uploadedFile: File;
  skuXslFileName: string;
  addProgramArray=[];
  programname: any;
  CouponArray=[];
  LocationArray = [];
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

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('firstPaginator') firstPaginator: MatPaginator;
  @ViewChild('secondPaginator') secondPaginator: MatPaginator;


  @ViewChild(MatSort) sortnew: MatSort;
  @ViewChild(MatSort) sorttwo: MatSort;

  public imageErrMsg = "";
  public imageErr = false;
  public imgUpload = false;

  selectedBrandOptions: any[];
  brandList: any[];
  selectedLocation: any;
  ul: any;
  programMinvalue: any;
  productMinvalue: any;
  minValueErrorProd: boolean;
  ProgramMinError: boolean;
  minValueErrorProd2: boolean =false;
  ProgramMinError2: boolean;
  minValueError2: boolean;
  programMaxiEventval: any;
  programMaxiPerStoreval: any;
  productMaxOEventVal: any;
  Editablenew: boolean = true;
  public langfield = [];
  public langfieldname = [];
  public  brandDropdown = [];
public allProgram = [];
  addProgramRes: any;
  public addProgramResNew  = [];
  brandId: any;
///notifications
public smsData: any = [];
public emailData: any = [];
public notificationId;
public pushData: any = [];
public emailChecked: boolean = false;
public pushChecked: boolean = true;
public smsChecked: boolean = true;
public pushTemplateChecked: boolean = false;
public smsTemplateChecked: boolean = false;
public emailTemplateChecked: boolean = false;
public pushHyperLinkReq: boolean = false;
//public imagePath: any = [];
public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
@ViewChildren('subInp', {read: ElementRef}) input : QueryList<ElementRef>;
@ViewChildren('content', {read: ElementRef}) inputContent : QueryList<ElementRef>;
public uploadError = [];
public uploadFlag = [];
pushList = [
  { value: 'Customer Profile', label: 'Customer Profile' },
      { value: 'My Transactions', label: 'My Transactions' },
      { value: 'Points Summary', label: 'Points Summary' },
      { value: 'Our Brands', label: 'Our Brands' },
      { value: 'Coupon', label: 'Coupons' },
      { value: 'Refer and Earn', label: 'Refer and Earn' },
      { value: 'Press Releases', label: 'Press Releases' },
      { value: 'FAQ', label: 'FAQ' },
      { value: 'Customer Tier', label: 'Customer Tier' },
      { value: 'Others', label: 'Others - Lands to Home screen' },
      { value: 'External Link', label: 'External Link' },
      { value: 'All Orders', label: 'All Orders' },
      { value: 'Menu', label: 'Menu' },
      { value: 'Stores', label: 'Stores' },
      { value: 'About Us', label: 'About Us' },
      { value: 'Schedule Order Page', label: 'Schedule Order Page' },
      { value: 'Rewards Dashboard', label: 'Rewards Dashboard' },
      { value: 'Scratch Card Listing Page', label: 'Scratch Card Listing Page' },
      { value: 'Hotsellers Category', label: 'Hotsellers Category' },
      { value: 'Exclusive', label: 'Exclusive' },
      { value: 'ime Bounded', label: 'ime Bounded' },
      { value: 'Healthy', label: 'Healthy' },
      { value: 'Product', label: 'Product' },
      { value: 'Category', label: 'Category' },
];
public prePopulateImg = [];
public linkToId;
public languageDirection = [];
  senderList: any[];
  public smsSenderList = [];
  public emailSenderList = [];
  public linkToIteamName = '';
  programGridVal: any[];
  getEventEditor: any;
  public pushAttr = [];
  public smsAttr = [];
  productDropdown: any;
  filtered_productItem: any;
  machedArray: any;
  popupdataAfterClose: any;

  constructor(private fb:FormBuilder,
    public dialog: MatDialog,
    private http: HttpService,
    private https: HttpClient,
    public snackBar: MatSnackBar,
    private uploadFile: UploadFile,
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
    this.buildEventForm();
    this.selectedBrands();
    this.myProgram();

    this.giftLanguageList();
    this.conditionFormArray();
    this.LocationFormList();
    this.CouponFormList();
    this.ProgramFormList();
    this.ProductFormList();
   // this.getQuestionAnswer() ;
  //  this.smsArray(),
   // this.addProgram();
  //  this.ProgramInserFormList();
   // this.getBrandCategory();

    
    //this.myProductDropdown();
   // this.getTemplateList();
   // this.openGiftpop();
  //  this.getAllSenderList();
  }



  buildEventForm() {

    let form = {
      giftLanguageList: this.fb.array([]),
      conditionArray: this.fb.array([]),
 
      startDate: ['',Validators.compose([Validators.required])],
      endDate: ['',Validators.compose([Validators.required])],
      startTime: ['',Validators.compose([Validators.required])],
      endTime: ['',Validators.compose([Validators.required])],
      isPreptual: [''],
      // eventdesc: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z0-9\s]*$")])],
      eventdesc: [''],

      isDefaultEvent: [''],
      brandDropdowncontrol: ['',Validators.compose([Validators.required])],

      apptitle: [''],
      appdesc: [''],
      isDisplayEvent: [''],
     // storeId:[''],
      ///pushTemplate: ['', Validators.compose([ExtraValidators.conditional(group =>this.addeventForm.get('isPushNotify').value === true, Validators.required)])],
     // selectedTemplateTypesms: ['',Validators.compose([Validators.required])],
     // pushLinkTo: ['', Validators.compose([ExtraValidators.conditional(group =>this.addeventForm.get('isPushNotify').value === true, Validators.required)])],
    //  linkTosms: ['',Validators.compose([Validators.required])],
     // pushHyperLink: ['',Validators.compose([Validators.required])],
      //hyperlinkofsms: ['',Validators.compose([Validators.required])],
      //senderId: ['',Validators.compose([Validators.required])],
      moreThenOneCouponAllow: [''],
      moreThenOneProgramnAllow:[''],
      isCouponsEnabled:true,
      enableProduct:true,
      Brand:[''],
      moreThanOneGiftProduct:[''],
      enableProgram:[true],
      LocationFormList :this.fb.array([]),
      CouponFormList: this.fb.array([]),
    //  usersFormList: this.fb.array([]),
      ProgramFormList: this.fb.array([]),
      ProductFormList: this.fb.array([]),
      //isPushNotify:[true,Validators.compose([Validators.required])],
     // isSMS:[true,Validators.compose([Validators.required])],
     // smsSenderId: ['', Validators.compose([ExtraValidators.conditional(group => this.addeventForm.get('isSMS').value === true, Validators.required)])],

    ///  smsTemplate: ['', Validators.compose([ExtraValidators.conditional(group => this.addeventForm.get('isSMS').value === true, Validators.required)])],

    //  pushHyperLink: ['', Validators.compose([ExtraValidators.conditional(group =>this.addeventForm.get('isPushNotify').value === true, Validators.compose([Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]))])],
    //  smsHyperLink: [''],
     // specificBrand: ['', Validators.compose([ExtraValidators.conditional(group => this.addeventForm.get('pushLinkTo').value === 'Our Brands',  Validators.required)])],
    
      //pushLocaleArray: this.fb.array([]),
     /// smsLocaleArray: this.fb.array([]),

    }
    this.addeventForm = this.fb.group(form);

  //  this.buildPushLocale();
  //  this.buildSMSLocale();
   /// this.buildEmailLocale();
  }

  public giftLanguageList() {
    const control = <FormArray>this.addeventForm.controls['giftLanguageList'];
    for (let i = 0; i < this.languageList.length; i++) {
      let newForm = this.fb.group({
        languageCode: this.languageList[i]['languageCode'],
        languageName:this.languageList[i]['languageName'],
        eventName: ['', Validators.required]
      });
      control.push(newForm);
      this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'text-right' : '');
    }
  }

  public conditionFormArray() {
    const control = <FormArray>this.addeventForm.controls['conditionArray'];
    for (let i = 0; i < this.languageList.length; i++) {
      let newForm = this.fb.group({
        languageCode: this.languageList[i]['languageCode'],
        languageName:this.languageList[i]['languageName'],
        termAndCondition: ['',Validators.required]
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

  changeBrand(brand){
console.log('brand is',brand)
this.brandId = brand;
  }

  myProgram(){
  

    this.http.getJson(environment.APIEndpoint + "api/rpa/loyalty/program/v1/get/programs?publishStatus=LIVE")
    .subscribe(response => {
    console.log('allProgram>>>',response);
    if(response){
      this.allProgram = response;
    }
 
    });
  }

  // myProductDropdown(){
  //   this.productDropdown = [
  //     {
  //       'productId':11,
  //       'productName':'Product one'
  //     },
  //     {
  //       'pId':12,
  //       'productName':'Product two'
  //     },
  //     {
  //       'pId':13,
  //       'productName':'Product three'
  //     }
  //   ]
  // }
  selectedBrands(){
   this.http.getJson(environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands")
    .subscribe(response => {
    console.log('brandss>>>',response);
    if(response){
    
      let filteritem =  response.filter(item=>item.brandId != null);
      this.brandDropdown = filteritem;
  
      // this.brandDropdown.forEach(res => {
      //   this.allBrands.push({
      //     "brandName": res. brandName,
      //     "value": res.brandId
      //   });
      // });
  
     }
 
    });

  }

public CouponFormList() {
  const control = <FormArray>this.addeventForm.controls['CouponFormList'];
  let newForm = this.fb.group({
    moreThenOneGiftAllowed: [''],
    couponID: [''],

  });
  control.push(newForm);

}

public LocationFormList() {
  const control = <FormArray>this.addeventForm.controls['LocationFormList'];
  let newForm = this.fb.group({
    //moreThenOneGiftAllowed: [''],
    locationName: [''],
    SelectedBrands: ['']
  });
  control.push(newForm);
}

// public usersFormList(){
//   const control = <FormArray>this.addeventForm.controls['usersFormList'];
//   let newForm = this.fb.group({
//     //moreThenOneGiftAllowed: [''],
//     userId: [''],
//     UserGiftingLimit: ['']
//   });
//   control.push(newForm);

// }

appPushNotfy(event){
  if(!event.checked){
    const pushController = this.addeventForm.get('pushLocaleArray') as FormArray;
for (let i = 0; i < this.languages.length; i++) {
  let sub = pushController.at(i).get('subject');
   sub.clearValidators();
  sub.updateValueAndValidity();
  let content = pushController.at(i).get('content');
  content.clearValidators();
  content.updateValueAndValidity();
}

  }else{

    const pushController = this.addeventForm.get('pushLocaleArray') as FormArray;
  for (let i = 0; i < this.languages.length; i++) {
  let sub = pushController.at(i).get('subject');
  sub.setValidators(Validators.required);
  sub.updateValueAndValidity();
  let content = pushController.at(i).get('content');
  content.setValidators(Validators.required);
  content.updateValueAndValidity();

  }
}
}

appSMSNotfy(event){
  if(!event.checked){
    const pushController = this.addeventForm.get('smsLocaleArray') as FormArray;
for (let i = 0; i < this.languages.length; i++) {
  
  let content = pushController.at(i).get('content');
  content.clearValidators();
  content.updateValueAndValidity();
}

  }else{

    const pushController = this.addeventForm.get('smsLocaleArray') as FormArray;
  for (let i = 0; i < this.languages.length; i++) {
  
  let content = pushController.at(i).get('content');
  content.setValidators(Validators.required);
  content.updateValueAndValidity();

  }
}
}
//imp

// public buildPushLocale() {

//   const control = <FormArray>this.addeventForm.controls['pushLocaleArray'];
//   try {
//     control.removeAt(0);
//     control.removeAt(1);
//   } catch{

//   }
//   control.controls = [];

//     for (let i = 0; i < this.languages.length; i++) {

//       let newForm = this.fb.group({
//          subject: ['', Validators.compose([ExtraValidators.conditional(group => this.addeventForm.get('isPushNotify').value === true, Validators.required)])],
//         content: ['', Validators.compose([ExtraValidators.conditional(group => this.addeventForm.get('isPushNotify').value === true, Validators.required)])],
//         language_code: this.languages[i]['languageCode']
//       });
//       control.push(newForm);
//       this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//       this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//       this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//       this.textAreaAppContent.push('');
//      this.textAreaAppSubject.push('');
//     }
//     for (let l of this.languages) {
//       this.uploadFlag.push(false);
//       this.uploadError.push(false);
     
//     }

// }


// this.smsArrayControl.get('content').setValidators(this.setRequired());

// this.smsArrayControl.get('content').updateValueAndValidity();

// public buildSMSLocale() {

//   const control = <FormArray>this.addeventForm.controls['smsLocaleArray'];
//   for (let i = 0; i < this.languageList.length; i++) {
//     let newForm = this.fb.group({
//       language_code: this.languageList[i]['languageCode'],
//        content: ['', Validators.compose([ExtraValidators.conditional(group => this.addeventForm.get('isSMS').value === true, Validators.required)])],


//     });
//     control.push(newForm);
//     this.alignCss.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
//     this.langfield.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');
//     this.langfieldname.push(this.languageList[i].direction == 'RTL' ? 'direction' : '');

//   }
// }


// public buildPushLocale() {
//   const control = <FormArray>this.addeventForm.controls['pushLocaleArray'];
//   for (let i = 0; i < this.languages.length; i++) {

//     let newForm = this.formBuilder.group({
//       subject: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
//       content: ['', Validators.compose([ExtraValidators.conditional(group => this.pushChecked === true, Validators.required)])],
//       languageId: []
//     });
//     control.push(newForm);
//     this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//     this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//     this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//     this.showEmojiPicker.push(false);
//     this.textAreaAppContent.push('');
//     this.textAreaAppSubject.push('');
//   }
//   for (let l of this.languages) {
//     this.uploadFlag.push(false);
//     this.uploadError.push(false);
    
//   }
// }
// public buildSMSLocale() {
//   const control = <FormArray>this.addeventForm.controls['smsLocaleArray'];
//   for (let i = 0; i < this.languages.length; i++) {

//     let newForm = this.formBuilder.group({
//       content: ['', Validators.compose([ExtraValidators.conditional(group => this.smsChecked === true, Validators.required)])],
//       languageId: []
//     });
//     control.push(newForm);
//     this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//     this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//     this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//   }
// }

// public buildEmailLocale() {
//   const control = <FormArray>this.addeventForm.controls['emailLocaleArray'];
//   for (let i = 0; i < this.languages.length; i++) {

//     let newForm = this.formBuilder.group({
//       subject: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
//       content: ['', Validators.compose([ExtraValidators.conditional(group => this.emailChecked === true, Validators.required)])],
//       languageId: []
//     });
//     control.push(newForm);
//     this.languageDirection.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//     this.langfield.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//     this.langfieldname.push(this.languages[i].direction == 'RTL' ? 'direction' : '');
//   }
// }




public ProgramFormList() {
   console.log('dffff',this.programKeywordVAlues.length);
  const control = <FormArray>this.addeventForm.controls['ProgramFormList'];
 
 
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
 this.getCurrency()
}

// public ProgramInserFormList() {
//   const control = <FormArray>this.addeventForm.controls['ProgramInserFormList'];
 
//   let newForm = this.fb.group({
  
//     programName: [''],
//     rewardType: [''],
//     pointsOrStamps: [''],
//     denominations: [''],
//     startRange: [''],
//     endRange: [''],
//     maxEvent: [''],
//     balEvent: [''],
//     maxStore: ['']
    

//   });
//   control.push(newForm);
//   let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
//   this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
//     .subscribe((response) => {
     
//       let TempArray = response;
//       for (let i = 0; i <= TempArray.length - 1; i++) {
//         let key = {
//           CurrencyName: TempArray[i]['currencyCode'],
//           CurrencyID: TempArray[i]['currencyId']
//         }
//         this.CurrencyCode.push(key)
//       }
    

//     });
// }

getCurrency(){
  let GET_ALL_CURRENCIES = "api/rpa/master/currency/v1/select";
  this.http.getJson(environment.APIEndpoint + GET_ALL_CURRENCIES)
    .subscribe((response) => {
     console.log('all currencyyy>>',response)
      let TempArray = response;
      for (let i = 0; i <= TempArray.length - 1; i++) {
        let key = {
          CurrencyName: TempArray[i]['currencyCode'],
          CurrencyID: TempArray[i]['currencyId']
        }
        this.CurrencyCode.push(key)
      }
    

    });
}

deleteProgramFixedValue(i:number){
  this.programKeywordVAlues.splice(i,1);
 // console.log('llll>>',this.programKeywordVAlues.length);
  if(this.programKeywordVAlues.length===0){
    ///this.PC.get('programKeywordVAlues').markAsTouched();
    this.PC.get("programKeywordVAlues").setErrors({ 'required': true});
    this.PC.get("programKeywordVAlues").markAsTouched();
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




// public removeOrderType(combotype){
//   console.log(combotype)
//   const control = <FormArray>this.addeventForm.controls['ProgramFormList'];
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
        this.PC.get('programKeywordVAlues').clearValidators();
        this.PC.get('programKeywordVAlues').updateValueAndValidity();
        // if(this.programKeywordVAlues.length>0){
        //   this.PC.get('programKeywordVAlues').clearValidators();
        //   this.PC.get('programKeywordVAlues').updateValueAndValidity();
        // }else{
        //   this.PC.get('programKeywordVAlues').setErrors({'incorrect': true});
        //   this.PC.get('programKeywordVAlues').markAsTouched();
        //   return;
        // }
      }
     
    }

  }
  
  // else {
  //   this.keywordStatus = true;
  //   this.addeventForm.get('keywords').clearValidators();
  //   this.addeventForm.get('keywords').updateValueAndValidity();
  //   setTimeout(() => {
  //     this.keywordStatus = false;
  //   }, 2000);

  // }
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
  //   this.addeventForm.get('keywords').clearValidators();
  //   this.addeventForm.get('keywords').updateValueAndValidity();
  //   setTimeout(() => {
  //     this.keywordStatus = false;
  //   }, 2000);

  // }
}


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
public removeImage(index) {
  this.imagePath.splice(index, 1);
  this.imgloader = false;

}
imgloader:boolean;
public uploadImage(event: FileList) {
  this.imageErr = false;
  this.imageErrMsg = "";
  this.imgUpload = true;
  if (
    event[0].type == "image/jpeg" ||
    event[0].type == "image/png" ||
    event[0].type == "image/jpg"
  ) {
    if (event[0].size < 1000000) {
      this.imgloader = true;
      this.uploadFile
        .upload(event.item(0), "brandCategory", "images")
        .subscribe(
          response => {
            this.imagePath.push(response["message"]);
            this.imgUpload = false;
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          },
          err => { }
        );
    } else {
      this.imgloader = false;

      this.imageErr = true;
      this.imageErrMsg = "Max upload file size is 1Mb";
    }
  } else {
    this.imgloader = false;

    this.imageErr = true;
    this.imageErrMsg = "Supported format is JPG, JPEG and PNG";
  }
}


changeProgram(programid){
    console.log('programid',programid);

}


  // add Program
  public disableBtn:boolean;
   insertProgram():void{
   // event.stopPropagation();

   // console.log('programKeywordVAlues',this.programKeywordVAlues);
    
  let formData=this.addeventForm.controls['ProgramFormList'].value
    
    ///console.log(this.addeventForm.controls['ProgramFormList'].value);
console.log('range', formData[0]['rangeOfProgram']);
//console.log('formData',formData);


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
    
    
  
   //  console.log('ADD PROGRAM REQ BODY',data);

     if(this.addeventForm.controls['ProgramFormList'].valid){

       this.disableBtn = true;
     // console.log('program form is  valid');
     // let url = 'http://182.72.208.172:3015/rest/api/v1/event_admin/add_program'
      this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/add_program',data2).subscribe(res => {
       //   console.log('res of add prgrm',res);
          this.disableBtn = false;
         // this.addProgramRes  = res['output'];
         let data = res['output'];
          this.addProgramResNew.push(data[0])
          console.log('addProgramResNew',this.addProgramResNew);

          this.addProgramResNew.map(res=>{
            res['pointorstamp'] = res['point&Stamp']
          })

          this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['programId'].patchValue('');
          this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['programKeywordVAlues'].patchValue('');
          this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMinValue'].patchValue('');
          this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMaxValue'].patchValue('');

          this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMaxiEvent'].patchValue('');
          this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['programMaxiPerStore'].patchValue('');
          this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['programmaxiPerLocation'].patchValue('');

        this.programKeywordVAlues.length = 0;


         // this.addeventForm['controls']['ProgramFormList']['controls'][0]['controls']['rewardType'].patchValue(res['output'][0]['rewardType']);

     });


     }else{
       console.log('program form is not valid');
      //  get Prd(){
      //   return (<FormArray>this.addeventForm.get("ProductFormList")).at(0);
      
      // }
    ///  this.PC.get('programMaxiEvent').markAsTouched();
 
       
 /// for (let i in this.PC.controls){
  //  this.PC.get("programKeywordVAlues").setErrors({ 'required': true});
 // this.PC.controls[i].setErrors({ 'required': true});
      /// this.PC.controls[i].markAsTouched();
   // return;
  //}


     }

  //    if(this.addeventForm.controls['ProgramFormList'].valid){
  //   console.log(JSON.stringify(data));
  //   this.http.postCustomizeJson('https://uoieiz443h.execute-api.ap-south-1.amazonaws.com/eventgifting_sit/rest/api/v1/event_admin/add_program', data).subscribe(res => {
  //    console.log('ADD PROGRAM REQ RES1',res['output']);
  //    console.log('ADD PROGRAM REQ RES2',JSON.stringify(res['output']));
  //    this.addProgramArray=res['output'];
  //    this.programname=res['output'][0]['programName']
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['programName'].patchValue(this.programname);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['rewardType'].patchValue(res['output'][0]['rewardType']);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['pointsOrStamps'].patchValue(res['output'][0]['point&Stamp']);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['denominations'].patchValue(res['output'][0]['denominations']);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['startRange'].patchValue(res['output'][0]['startRange']);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['endRange'].patchValue(res['output'][0]['endRange']);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['maxEvent'].patchValue(res['output'][0]['maxForEvent']);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['balEvent'].patchValue(res['output'][0]['balanceForEvent']);
  //    this.addeventForm['controls']['ProgramInserFormList']['controls'][0]['controls']['maxStore'].patchValue(res['output'][0]['maxPerStorePerDay']);
    
  //   })
  // }


  }




public productBtnText:any = 'INSERT';
public prodRangeValueSelectionchkbox:boolean = false;

  getDefineProduct(defineProdData){

     console.log('defineProdData',defineProdData);
     let formData= this.addeventForm.controls['ProductFormList'].value;
     if(this.insertProductArray.length>0){
       
  let matchedDefinedPord = this.insertProductArray.filter((item) => item.defineProduct === defineProdData);
  console.log('matchedDefinedPord>>>',matchedDefinedPord);
  console.log('matchedDefinedPord length>>>',matchedDefinedPord.length);

  if(matchedDefinedPord.length>0){
    this.productBtnText  = 'UPDATE';
    let matchedProdArray = matchedDefinedPord[0] ;

    this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['prodructMaxiEvent'].patchValue(matchedProdArray['maxForEvent']);
    this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxiPerStore'].patchValue(matchedProdArray['maxperStoreperDay']);
    this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productmaxiPerLocation'].patchValue(matchedProdArray['maxPerLocation']);
  
   // this.maxDenomination.push(matchedProdArray['maxDenomination']);

if(matchedProdArray['rangeValueSelection']){
this.prodRangeValueSelectionchkbox  = true;
console.log('matchedProdArray>>>>',true);
this.Prd.get("prodRangeValueSelection").patchValue(true);

  this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productMinVal'].patchValue(matchedProdArray['minValue']);
  this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxVal'].patchValue(matchedProdArray['maxValue']);

}else{
  this.Prd.get("prodRangeValueSelection").patchValue(false);

}
  
  }else{
    this.productBtnText  = 'INSERT';


    this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['prodructMaxiEvent'].patchValue('');
    this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxiPerStore'].patchValue('');
    this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productmaxiPerLocation'].patchValue('');
  

  this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productMinVal'].patchValue('');
  this.addeventForm['controls']['ProductFormList']['controls'][0]['controls']['productMaxVal'].patchValue('');

  }
     }else{


      
      console.log('no data inproduct grid');

     }

  }



  public disableBtnProd:boolean;

////add product
public insertProductArray = [];
public warn1:boolean;
public selectionType:any;

addProduct(){

  let formData= this.addeventForm.controls['ProductFormList'].value;

  console.log(this.addeventForm.controls['ProductFormList'].value);
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
    "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
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
    "moreThenOneProduct" : this.addeventForm.get('moreThanOneGiftProduct').value ? this.addeventForm.get('moreThanOneGiftProduct').value : false,
    "uploadImage": '',
    "productName": filteredItem[0]['productName'] ? filteredItem[0]['productName'] : '',
    "currencyCode": filteredItem[0]['currencyCode'] ? filteredItem[0]['currencyCode'] : '',
    "price": filteredItem[0]['price'] ? filteredItem[0]['price'] : '',
    "variantTypeName":  this.uploadType === 'select' ? filteredItem[0]['variantTypeName'] : filteredItem[0]['variantName'],
    "maxDenomination": this.maxDenomination ? this.maxDenomination : [0],
  
    "productOid" : filteredItem[0]['productOid'] ? filteredItem[0]['productOid'] : '',
    "productVariantOid" : filteredItem[0]['productVariantOid'] ? filteredItem[0]['productVariantOid'] : '',
    "variantTypeOid"  : filteredItem[0]['productVariantOid'] ? filteredItem[0]['productVariantOid'] : ''
  }
  
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
  this.addeventForm.controls['ProductFormList'].reset();

  ///this.Prd.get('prodructMaxiEvent').reset();
  this.Prd.get('prodructMaxiEvent').clearValidators();
  this.Prd.get('prodructMaxiEvent').updateValueAndValidity();







//   const control = <FormArray>this.addeventForm.controls['ProductFormList'];
//   for(let i = control.length-1; i >= 0; i--) {
//       control.removeAt(i)
// }
/*imp*/
  // const arr2 = <FormArray>this.addeventForm.controls.ProductFormList;
  //   arr2.controls = [];
 // https://www.codegrepper.com/code-examples/javascript/angular+formarray+remove+all
  // (this.addeventForm.controls['ProductFormList']).clear();
  // let frmArray = this.addeventForm.get('ProductFormList') as FormArray;
  // frmArray.clear();
}





//////product section//////
public ProductFormList() {
  const control = <FormArray>this.addeventForm.controls['ProductFormList'];
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
////slect prodcut county
changeCountry(data){
alert(data);
}

////////select store popup///////

  openSoreDialog() {
    const dialogRef = this.dialog.open(EventsStoreDialogComponent);
    dialogRef.componentInstance.storeList = this.selectedStorearray;
    dialogRef.componentInstance.totalCount = this.storeCount;
    dialogRef.afterClosed().subscribe(result => {
    //  console.log('result>>>',result)
      if (result.buttonName === 'SELECT') {
        this.selectedStorearray = [];
        this.selectedCount = result.tableData.length;
        this.totalCount = result.totalCount;
        for (let i = 0; i < result.tableData.length; i++) {
          this.selectedStorearray.push(result.tableData[i].storeOid);
          const arrrayTemp = this.selectedStorearray;
          
          console.log('storeId before>>>',arrrayTemp);

          this.selectedStorearray = Array.from(new Set(arrrayTemp));
          console.log('storeId',this.selectedStorearray);
          if (this.selectedStorearray.length) {
            this.selectStoreError = false;

            this.selectStoreVal = true;
            this.dataStore = false;
            setTimeout(() => {
              this.selectStoreVal = false;
              if (this.selectStoreVal == false) {
                this.dataStore = true;
              }
            }, 1000);
          }else{

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
      if (result.buttonName === 'SELECT') {
        this.selectStoreError = false;
    //console.log('selected locatins',result);
     this.selectedLocation = result;
//console.log('result.tableData',result.tableData)
let arrayFromPopUp =result.tableData;


     let updatedLocation = arrayFromPopUp.map((obj)=>{
      return {...obj } ;
   
     })
    // this.ul = updatedLocation;

     ////make this ul in to data table

    

     this.mydataSource = new MatTableDataSource<any>(updatedLocation);
       this.mydataSource.paginator = this.paginator;
       this.mydataSource.sort = this.sort;


     console.log('updatedLocation',updatedLocation)

     this.newlocationDetails.push(updatedLocation);

     if (result.buttonName === 'SELECT') {
      this.selectedLocationarray = [];
      for (let i = 0; i < result.tableData.length; i++) {
        
       this.selectedLocationarray.push(result.tableData[i].locationOid);
       const arrrayTempw = this.selectedLocationarray;
       this.selectedLocationarray = Array.from(new Set(arrrayTempw));
       console.log('location id selectedLocationarray',this.selectedLocationarray);
      }
      if(this.selectedLocationarray.length>0){
        this.selectLocationError = false
      }
  }




 } });
}

removeAllLocation() {
  this.mydataSource.data = [];
  this.selectedLocationarray = [];

}
removeLocationAt(index: number) {
  let data = this.mydataSource.data;
  data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
  this.mydataSource.data = data;


  this.selectedLocationarray.splice(index, 1);
  //console.log('location id UPDATED',this.selectedLocationarray);


}
//////////add location in grid end ///////

////////////add coupon in grid start////////////
public finalCouponArray=[];
addCoupon() {
  const dialogRef = this.dialog.open(SelectCouponDialogeComponent);
  dialogRef.componentInstance.getCoupons = this.selectedCouponArray;
  dialogRef.afterClosed().subscribe(result => {
    console.log('add coupon result',result);
    if (result.buttonName === 'SELECT') {
    this.CouponArray = result.tableData
let couponFromPopUp = result.tableData;
let updatedCouponArray = couponFromPopUp.map((obj)=>{
   return {...obj} ;
  })
  console.log('updatedCouponArray',updatedCouponArray);
  this.coupondataSource = new MatTableDataSource<any>(updatedCouponArray);
  this.coupondataSource.paginator = this.secondPaginator;
  this.coupondataSource.sort = this.sorttwo;
  this.finalCouponArray.push(updatedCouponArray[0]);
 let x  = this.finalCouponArray
 console.log(' x',x)
 // this.mynewdataSource = x;
    console.log('data in x',x)
///ct codee end

   /// if (result.buttonName === 'SELECT') {
      this.selectedCouponArray = [];
      for (let i = 0; i < result.tableData.length; i++) {
        
       this.selectedCouponArray.push(result.tableData[i].couponId);
       const arrrayTempw = this.selectedCouponArray;
       this.selectedCouponArray = Array.from(new Set(arrrayTempw));
       console.log('selectedCouponArray id',this.selectedCouponArray);

        // this.eventGiftingFormGroup.controls['couponID'].patchValue(CId);
      ////raghve  this.addeventForm['controls']['CouponFormList']['controls']['couponID'].patchValue(CId);
      }
    if(this.selectedCouponArray.length>0){
      this.couponErrMssg = false;

    }else{
      this.couponErrMssg = true;

    }
     
      // this.CouponFormList.controls['couponTitile'].patchValue(Name)
   /// }

  }

  });
}

removeAllCoupon() {
  this.coupondataSource.data = [];
  this.selectedCouponArray = []
}
removeCouponAt2(index: number) {
  let data = this.coupondataSource.data;
  data.splice((this.secondPaginator.pageIndex * this.secondPaginator.pageSize) + index, 1);
  this.coupondataSource.data = data;
  this.selectedCouponArray.splice(index, 1);
  this.CouponArray.splice(index,1);
}
public listToDelete = [];
removeCouponAt(index: number) {
  let i = index;
  // let data = this.coupondataSource.data;
  // data.splice((this.secondPaginator.pageIndex * this.secondPaginator.pageSize) + index, 1);
  // this.coupondataSource.data = data;


  this.listToDelete = [];

 ///  this.selectedUserArray.splice(index, 1);
   let clikedRow = this.CouponArray[index];
    let clicked_couponId = clikedRow['couponId'];
    let clicked_couponIdString = clicked_couponId.toString();
    var listToDelete = ["2"];

    this.listToDelete.push(clicked_couponIdString);
console.log('listToDelete',this.listToDelete);

    if(this.FINAL_OBJ.length>0){
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

    let allCouponList = this.CouponArray.map(item=>{
      return {...item}
    })

    this.selectedCouponArray.splice(index, 1);

    allCouponList.splice(index, 1);
     this.CouponArray = allCouponList;

  this.coupondataSource = new MatTableDataSource<any>(this.CouponArray);
  this.coupondataSource.paginator = this.secondPaginator;
  this.coupondataSource.sort = this.sorttwo;
/////////////////////////if no coupon ,pgm & product then delete

this.deleteUsersOfCoupon();
/////////////////////////if no coupon ,pgm & product then delete
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
    
    console.log('selectedUserArray>>>',this.selectedUserArray);
      console.log('FINAL_OBJ',this.FINAL_OBJ);
  
    }
  
  }

}

///tested code------------------------------------------

////////////add coupon in grid end////////////
public couponIdToDelete = [];
isEnabledCheckbox(event,tabtype,type,couponstabGroupArray){
  if (event.checked) {
    this.addeventForm.get(type).patchValue(true);
    console.log('checkbox checked');
   // this.titleTab(combotype);
  }else{
    this.addeventForm.get(type).patchValue(false);
    console.log('checkbox un-checked');
    console.log('allCouponList', this.CouponArray);
 // let CouponArray =    this.CouponArray;
    /////push coupon id of grid in list
    this.couponIdToDelete = [];
    for(let i = 0;i<this.CouponArray.length;i++){
    this.couponIdToDelete.push(this.CouponArray[i]['couponId'].toString());
}

/////on disble checkbox , remove all coupons of user's gifting
for (let i = 0; i < this.FINAL_OBJ.length; i++) {
  for (let j = 0; j < this.FINAL_OBJ[i]['couponsgiftingLimits'].length; j++) {
      let obj = this.FINAL_OBJ[i]['couponsgiftingLimits'][j];
 // console.log(obj)
      if (this.couponIdToDelete.indexOf(obj['giftcode'].toString()) !== -1) {
  //console.log(arrayOfObjects[i]['couponsgiftingLimits'])
         this.FINAL_OBJ[i]['couponsgiftingLimits'].splice(j, 1);
          j--;
  
      }
  }
  }
/////on disble checkbox , remove all coupons of user's gifting -end
/////////////////////////if no coupon ,pgm & product then delete --all users from grid
this.deleteUsersOfCoupon();
/////////////////////////////

this.selectedCouponArray = [];
this.CouponArray = [];
this.coupondataSource = new MatTableDataSource<any>(this.CouponArray);
this.coupondataSource.paginator = this.secondPaginator;
this.coupondataSource.sort = this.sorttwo;

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
/////on disble checkbox , remove all program of user's gifting
for (let i = 0; i < this.FINAL_OBJ.length; i++) {
  for (let j = 0; j < this.FINAL_OBJ[i]['programgiftingLimits'].length; j++) {
      let obj = this.FINAL_OBJ[i]['programgiftingLimits'][j];
 // console.log(obj)
      if (this.progrmIdToDelete.indexOf(obj['productOID'].toString()) !== -1) {
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

     for(let i = 0;i<this.insertProductArray.length;i++){
      this.productIdToDelete.push(this.insertProductArray[i]['productOid'].toString())

     }
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



////////////add coupon in grid end////////////
dummyjson:any;
openGiftpop(){
  this.dummyjson = [{
    "userOid": [
      1,
      2
    ],
    "couponsgiftingLimits": [
      {
        "couponName": "Reciproci",
        "maxGiftPerCustomer": "1",
        "maxGiftPerEvent": "2"
      }
    ],
    "programgiftingLimits": [
      
    ],
    "productgiftingLimits": [
      
    ]
  },
  {
    "userOid": [
      13437,
      13436
    ],
    "couponsgiftingLimits": [
      {
        "couponName": "Reciproci",
        "maxGiftPerCustomer": "4",
        "maxGiftPerEvent": "4"
      }
    ],
    "programgiftingLimits": [
      
    ],
    "productgiftingLimits": [
      
    ]
  }]
}

////////// addUser in grid start//////////////
public counter  = 0;
public userinfo = [];
userinfodummy = [];



public userinfo1 = [];
giftLimit(userId){

console.log('userid',userId)
  const dialogRef = this.dialog.open(GiftingLimitDialogComponent);
  console.log('sending this info>>>>',this.userinfo);
  console.log('sending this info1>>>>',this.userinfo1);

  console.log('sending this info3>>>>',this.userinfodummy);

  dialogRef.componentInstance.clikedUserID =  userId;

  dialogRef.componentInstance.giftingDetails = this.userinfodummy;


 



  
  dialogRef.afterClosed().subscribe(result => {
   console.log('gift details>>>>>>',result);

   if(result['buttonName'] == 'SELECT'){

//     for(let i=0;i<this.userinfodummy.length;i++){

//       if(this.userinfodummy[i]['userOid'].includes(userId)){
//         this.userinfodummy.splice(i,1);
//          console.log('this.userinfodummy1',this.userinfodummy); 


//       }

      
//  }

   // this.userinfo1 = [];
    // if(result['jsondata']['userOid'].length>0){
    //   this.userinfo.push(result['jsondata']);
    // }
    console.log('response before view gift limit >> ',this.userinfo);
    console.log('response after view gift limit >> ', result['jsondata']);

    this.userinfodummy.push(result['jsondata']);
  //  this.userinfo1.push(result['jsondata']);
  console.log('this.userinfodummy 2',this.userinfodummy); 

    this.popupdataAfterClose = result['jsondata'];
    ////
    // this.userinfo = [];
    // this.userinfo.push(result['jsondata']);

//find that array from total, on which clicked user matching

 for(let i=0;i<this.userinfo.length;i++){

     if(this.userinfo[i]['userOid'].includes(userId)){
        console.log('matched array',this.userinfo[i]);

        this.machedArray = this.userinfo[i];
        this.userinfo.splice(i,1);
       ///if mathed if have to remove that useroid from main array - this.userinfo
       //there are 2 case = in view gift values are old or changed
      // https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array

     }
}




console.log('this.popupdataAfterClose>>>>',this.popupdataAfterClose);

////coupons-gifting of popup data array>>>>>
let couponsgiftingLimits_popup = this.popupdataAfterClose['couponsgiftingLimits'];
///program-gifting of popup array>>>>>>>
let programgiftingLimits_popup = this.popupdataAfterClose['programgiftingLimits'];
//product - gifting of popup array>>>>>>
let productgiftingLimits_popup = this.popupdataAfterClose ['productgiftingLimits'];


////coupons-gifting of matched array>>>>>
let couponsgiftingLimits = this.machedArray['couponsgiftingLimits'];
///program-gifting of matched array>>>>>>>
let programgiftingLimits = this.machedArray['programgiftingLimits'];
//produt - gifting of matched array>>>>>>
let productgiftingLimits = this.machedArray['productgiftingLimits'];

console.log('couponsgiftingLimits old',couponsgiftingLimits);
console.log('couponsgiftingLimits_popup',couponsgiftingLimits_popup);

////compare property of coupons 
if(couponsgiftingLimits.length>0 && couponsgiftingLimits_popup.length>0){

  // let couponsgiftingLimits_afterCompare = _(couponsgiftingLimits)
  //                                       .differenceBy(couponsgiftingLimits_popup, 'maxGiftPerCustomer', 'maxGiftPerEvent')
  //                                       .map(_.partial(_.pick, _, 'maxGiftPerCustomer', 'maxGiftPerEvent'))
  //                                       .value();
  


  for(let i = 0;i<couponsgiftingLimits.length;i++){
    for(let j = 0;j<couponsgiftingLimits_popup.length;j++){
       if(couponsgiftingLimits[i]['maxGiftPerCustomer'] == couponsgiftingLimits_popup[j]['maxGiftPerCustomer'] && couponsgiftingLimits[i]['maxGiftPerEvent'] == couponsgiftingLimits_popup[j]['maxGiftPerEvent']){
             console.log('no change in gifting');
       }else{
        console.log('some change in gifting');
        this.userinfo.push(this.popupdataAfterClose);
        console.log('this.userinfo data1>>>',this.userinfo);


        this.doCalCULATION(userId);
       // break;
       return;
       }
    }
  }



                                         // console.log('couponsgiftingLimits_afterCompare',couponsgiftingLimits_afterCompare);

                                      //   if(couponsgiftingLimits_afterCompare.length>0){
                                      //     console.log('diffrent property');
                                      //     console.log('couponsgiftingLimits_afterCompare',couponsgiftingLimits_afterCompare);

                                         
                                      //  let machedUserOidArray =   this.machedArray['userOid'];
                                      //  machedUserOidArray = machedUserOidArray.filter(item => item !== userId)
                                     
                                      //  let newMathcedArray = {
                                      //    'userOid':machedUserOidArray,
                                      //    'couponsgiftingLimits':this.machedArray['couponsgiftingLimits'],
                                      //    'programgiftingLimits':this.machedArray['programgiftingLimits'],
                                      //    'productgiftingLimits':this.machedArray['productgiftingLimits'],


                                      //  }
                                      //  console.log('new updated matched array',newMathcedArray);
                                    
                                      //  this.userinfo.push(newMathcedArray);

                                      //  console.log('userinfo final after chnge val',this.userinfo);

                                      //   }else{

                                      //     console.log('same property')
                                      //     console.log('couponsgiftingLimits_afterCompare',couponsgiftingLimits_afterCompare)

                                      //   }



}



}///select btn if end

  })

}


doCalCULATION(userId){
  console.log('this.userinfo data2>>>',this.userinfo)

 // console.log('userId>>>>',userId);

  let machedUserOidArray =   this.machedArray['userOid'];
   machedUserOidArray = machedUserOidArray.filter(item => item !== userId);


                          let newMathcedArray = {
                                'userOid':machedUserOidArray,
                                'couponsgiftingLimits':this.machedArray['couponsgiftingLimits'],
                                'programgiftingLimits':this.machedArray['programgiftingLimits'],
                                'productgiftingLimits':this.machedArray['productgiftingLimits']
                                   }

                                 this.userinfo.push(newMathcedArray);

                                 console.log('this.userinfo data3',this.userinfo)
}


// var result1 = [
//   {id:23, name:'John', type:'admin', username:'johnny2'},
//   {id:4, name:'Bobby', type:'user', username:'be_bob'}
// ];

// var result2 = [
//   {id:2, name:'John', email:'johnny@example.com'},
//   {id:4, name:'Bobby', email:'bobby@example.com'}
// ];

// var result3 = _(result1) 
//       .differenceBy(result2, 'id', 'name')
//       .map(_.partial(_.pick, _, 'id', 'name'))
//       .value();

// console.log(result3);




////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
///notifications---------------------------------------------------------------------------------
getTemplateList() {
  let GET_TEMPLATE_LIST = environment.APIEndpoint + "api/rpa/marketing/template/v1/list";
  let request1 = {
    templateType: 'PUSH'
  }
  let request2 = {
    templateType: 'SMS'
  }
  // let request3 = {
  //   templateType: 'EMAIL'
  // }

  this.http.postJson(GET_TEMPLATE_LIST, request1)
    .subscribe((response) => {
      console.log('this.pushData',response)
      this.pushData = response;
    }
      , err => {
      })
  this.http.postJson(GET_TEMPLATE_LIST, request2)
    .subscribe((response) => {
      console.log('this.smsData',response)

      this.smsData = response;
    }
      , err => {
      });
  // this.http.postJson(GET_TEMPLATE_LIST, request3)
  //   .subscribe((response) => {
  //     this.emailData = response;
  //   }
  //     , err => {
  //     });
}


attributeDialog(index, type) {
  const dialogRef = this.dialog.open(addAttributesDialog);
  // dialogRef.componentInstance.campaignActivitySelection = this.activityValue;
  // dialogRef.componentInstance.couponDataValue = this.couponData;
  dialogRef.afterClosed().subscribe(result => {
      let content = result.map(e => {
          return `${e.fieldName}`
      })
      if (type == 'PUSH') {
          this.pushAttr = result.map(e => { return e.id });
          const item = <FormArray>this.addeventForm.controls['pushLocaleArray'];
          // item.at(index).patchValue({
          //     content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),

          // })
          this.insertAtCaret(content.join(" "), `#textareaPush${index}`, item, index, content);
      }
      else if (type == 'SMS') {
          this.smsAttr = result.map(e => { return e.id });
          const item = <FormArray>this.addeventForm.controls['smsLocaleArray'];
          // item.at(index).patchValue({
          //     content: item.value[index].content ? item.value[index].content + content.join(" ") : content.join(" "),
          // })
          this.insertAtCaret(content.join(" "), `#textarea${index}`, item, index, content);

      }

    
  });
}

insertAtCaret(text, id, formgroup, index, content) {
  const textarea = (<HTMLTextAreaElement>document.querySelector(id));

  textarea.setRangeText(
      text,
      textarea.selectionStart,
      textarea.selectionEnd,
      'end'
  )
  const item = formgroup;
  item.at(index).patchValue({
      content: textarea.value,
  });
}
public onPushChange(selectedValue) {
  this.pushTemplateChecked = true;
  this.pushData.forEach(push => {
    if (push.templateId == selectedValue) {
      this.addeventForm.patchValue({
        pushHyperLink: push.hyperLink
      });
      this.pushLocale(push.marketingTemplateLocales);
    }
  });
}

public onSMSChange(selectedValue) {
  this.smsTemplateChecked = true;
  console.log('smschange', this.smsData)
  this.smsData.forEach(sms => {
    if (sms.templateId == selectedValue) {
      this.addeventForm.patchValue({
        smsHyperLink: sms.hyperLink
      });
      this.smsLocale(sms.marketingTemplateLocales);
    }
  });
}
onChangeInEditor(event) {

  this.getEventEditor = event.editor;
}
// public selectedSMSValue;
// onSMSChange(selectedValue) {
//     this.selectedSMSValue = selectedValue;
//     this.smsTemplateChecked = true;
//     this.smsData.forEach(sms => {
//         if (sms.templateId == selectedValue) {
//             this.addeventForm.patchValue({
//                 smsHyperLink: sms.hyperLink
//             });
//             this.smsLocale(sms);
//         }
//     });
// }

public updateValidationHyperLink(value: any) {
  if (value == 'External Link') {
    let linkTo = this.addeventForm.get('pushHyperLink');
    linkTo.setValidators([Validators.required]);
    linkTo.updateValueAndValidity();
    this.pushHyperLinkReq = true;
  } else {
    let linkto = this.addeventForm.get('pushHyperLink');
    linkto.clearValidators();
    linkto.updateValueAndValidity();
    this.pushHyperLinkReq = false;
  }
  if(value == 'Product' || value == 'Category'){
    this.linkToId = ''
    this.linkToIteamName = ''
  }
}

public storeImgFlag = [];

message = [];
public textAreaAppSubject: any[] = [];
public textAreaAppContent: any[] = [];
public textAreaSMSContent: string = '';
public textAreaEmailSub: string = '';
public textAreaEmailContent: string = '';
public imageUploading: boolean = false;
@ViewChild('uploadEl') uploadElRef: ElementRef;
@ViewChild('uploadImgEl') uploadImgEl: ElementRef;
showEmojiPicker = [];
showEmojiPickerAppCOntent = [];
showEmojiPickerSMSCOntent = [];
showEmojiPickerEmailSub = [];
showEmojiPickerEmailContent = [];
public imagePathTwo = [];
public linkToItemErr : boolean = false;

public pushImgValue: any = [];
public pushLocale(pushLocale) {
  this.pushImgValue = pushLocale;
  if (pushLocale != undefined && pushLocale.length > 0) {
    for (let i = 0; i < pushLocale.length; i++) {
      const item = <FormArray>(
        this.addeventForm.controls["pushLocaleArray"]
      );
      this.textAreaAppSubject[i] = pushLocale[i].subject;
      this.textAreaAppContent[i] = pushLocale[i].content;
      item.at(i).patchValue({
        subject: this.textAreaAppSubject[i],
        content: this.textAreaAppContent[i],
       // languageId: pushLocale[i].languageName
      });
    }
  }
  if (pushLocale != undefined && pushLocale.length > 0) {
    this.imagePath = [];
    for (let i = 0; i < this.pushImgValue.length; i++) {
      this.imagePath[i] = this.pushImgValue[i].imagePath;
      this.imagePathTwo[i] = this.pushImgValue[i].imagePathTwo;
      if (this.imagePath[i] != '') {
        this.prePopulateImg.push(true);
        this.uploadFlag.push(true);
      }
      else {
        this.prePopulateImg.push(false);
        this.uploadFlag.push(false);
      }
      if(this.imagePathTwo[i] != ''){
        this.storeImgFlag.push(true);
      }
      else{
        this.storeImgFlag.push(false);
      }
    }
  }
}

public smsLocale(smsLocale) {
  if (smsLocale != undefined && smsLocale.length > 0) {
    for (let i = 0; i < smsLocale.length; i++) {
      const item = <FormArray>this.addeventForm.controls["smsLocaleArray"];
      item.at(i).patchValue({
        subject: smsLocale[i].subject,
        content: smsLocale[i].content,
       // languageId: smsLocale[i].languageName
      });
    }
  }
}

openLinkToItemPopUP(){
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = "unset";
  dialogConfig.height = 'auto';
  dialogConfig.autoFocus = false;
  dialogConfig.panelClass = 'view-product-dialogue';
  let selectedItemList = {
    itemId : this.linkToId
  }
  let dialogRef;
  if(this.addeventForm.get('pushLinkTo').value == 'Product'){
    dialogRef = this.dialog.open(SelectProductDailogComponent ,dialogConfig);
  }
  else if(this.addeventForm.get('pushLinkTo').value == 'Category'){
    dialogRef = this.dialog.open(SelectCategoryDailogComponent ,dialogConfig);
  }
  dialogRef.componentInstance.TempItemList = selectedItemList;
  dialogRef.afterClosed().subscribe(result => {
      this.linkToId = result.itemId
      this.linkToIteamName = result.linkToIteamName
      this.linkToItemErr = this.linkToId == '' ||  this.linkToId == undefined ? true : false;
  });
}
// public removeImage(index) {
//   this.imagePath[index] = "";
//   this.uploadFlag[index] = false;
//   this.prePopulateImg[index] = false;
//   const control = this.addeventForm.get('notificationArray') as FormArray;
// }

public removeDetailImage(index) {
  this.imagePathTwo[index] = "";
  this.storeImgFlag[index] = false;
  const control = this.addeventForm.get('notificationArray') as FormArray;
}

public getAllSenderList() {
  let GET_ALL_SENDER_LIST = environment.APIEndpoint + "api/rpa/campaign/v1/get/senderList";
  this.http.getJson(GET_ALL_SENDER_LIST)
    .subscribe((response) => {
      this.senderList = response;
      for (let sender of this.senderList) {
        if (sender.templateType == 'SMS') {
          this.smsSenderList.push(sender.senderId);
        } else if (sender.templateType == 'EMAIL') {
          this.emailSenderList.push(sender.senderId);
        }
      }
    });
}


   // For the emoji implementation
  //  message = [];
  //  public textAreaAppSubject: any[] = [];
  //  public textAreaAppContent: any[] = [];
  //  public textAreaSMSContent: string = '';
  //  public textAreaEmailSub: string = '';
  //  public textAreaEmailContent: string = '';

  //  showEmojiPicker = [];
  //  showEmojiPickerAppCOntent = [];
  //  showEmojiPickerSMSCOntent = [];
  //  showEmojiPickerEmailSub = [];
  //  showEmojiPickerEmailContent = [];

   sets = [
     'native',
     'google',
     'twitter',
     'facebook',
     'emojione',
     'apple',
     'messenger'
   ]
   set = 'twitter';
   // App Push Section
   toggleEmojiPicker(index) {
       this.showEmojiPicker[index] = !this.showEmojiPicker[index];
   }
   addEmojiAppSubject(event,index) {
     const emoji : string = (event.emoji as any).native;
     const input = (index == 0) ? this.input.first.nativeElement : this.input.last.nativeElement;
     input.focus();
     const text = this.textAreaAppSubject[index] + `${event.emoji.native}`;
     this.textAreaAppSubject[index] = text;
     if (document.execCommand){ 
       var event1 = new Event('input');
       document.execCommand('insertText', false, emoji);
       return; 
   }
       const [start, end] = [input.selectionStart, input.selectionEnd]; 
       input.setRangeText(emoji, start, end, 'end');
   }


   toggleEmojiPickerAppContent(index) {
       this.showEmojiPickerAppCOntent[index] = !this.showEmojiPickerAppCOntent[index];
   }
   addEmojiAppContent(event,index) {
       const emoji : string = (event.emoji as any).native;
       const inputContent = (index == 0) ? this.inputContent.first.nativeElement : this.inputContent.last.nativeElement;
       inputContent.focus();
       const text = this.textAreaAppContent[index] + `${event.emoji.native}`;
       this.textAreaAppContent[index] = text;
       if (document.execCommand){ 
           var event1 = new Event('inputContent');
           document.execCommand('insertText', false, emoji);
           return; 
       }
       const [start, end] = [inputContent.selectionStart, inputContent.selectionEnd]; 
       inputContent.setRangeText(emoji, start, end, 'end');
   }



public uploadFullImage(event: FileList, i) {
  this.imageUploading = true;
  if (event[0].size < 5000000) {
    if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
      || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
      this.uploadFile.upload(event.item(0), 'store360', 'images')
        .subscribe((response) => {
          this.imagePathTwo[i] = response['message'];
          this.storeImgFlag[i] = true;
          this.uploadImgEl.nativeElement.value = ''
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
        });
    }
    else {
      this.imagePathTwo[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Supported format is JPG, JPEG and PNG"
        }
      });
    }
  } else {
    this.imagePathTwo[i] = '';
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 10000,
      data: {
        status: "failure",
        message: "Max upload file size is 5Mb"
      }
    });
  }
}


addUserx() {
  const dialogRef = this.dialog.open(UserLocationDialogComponent);
  
  dialogRef.componentInstance.selectedUsers = this.selectedUserArray;
  dialogRef.componentInstance.getCoupons =  this.CouponArray;

  dialogRef.afterClosed().subscribe(result => {
   console.log('selected users>>>>>>',result);
  let arrayFromPopUp =result.tableData;
  let updateUser = arrayFromPopUp.map((obj)=>{
   return {...obj } ;

  })

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

     
      }
    
         }
  });
}
removeAllUserx() {
  this.userdataSource.data = [];
  this.selectedUserArray = [];
}
removeUserAtx(index: number) {
  let data = this.userdataSource.data;
  data.splice((this.firstPaginator.pageIndex * this.firstPaginator.pageSize) + index, 1);
  this.userdataSource.data = data;
  this.selectedUserArray.splice(index, 1);

}
FINAL_OBJ = [];

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




addUsernew(): void {

  if(!this.addeventForm.get('isCouponsEnabled').value){
    this.CouponArray.length = 0;
  }
  if(!this.addeventForm.get('enableProgram').value){
    this.addProgramResNew.length = 0;
  }
  if(!this.addeventForm.get('enableProduct').value){
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
        data: { selectedUsers: this.selectedUserArray,getCoupons:this.CouponArray,getProgram:this.addProgramResNew,getProduct:this.insertProductArray}
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
  allUserList:any = [];

removeAllUser(data) {
  this.selectedUserArray = [];
  this.FINAL_OBJ = [];
  this.allUserList = [];
  this.userdataSource = new MatTableDataSource<any>(this.allUserList);
  this.userdataSource.paginator = this.firstPaginator
  this.userdataSource.sort = this.sortnew;
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

allUser: any;

editGift(data){
 
  const dialogRef = this.dialog.open(EditGiftingLimitDialogComponent);
  dialogRef.componentInstance.userOid = data;
  dialogRef.componentInstance.totalData =  this.allUser;
  dialogRef.componentInstance.mode =  'add'

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
////////// addUser in grid end//////////////


brandMssg:boolean;
LocationMssg:boolean;

InsertLocation(){
 let selectedbrand =  this.addeventForm.controls['Brand'].value;
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
       //this.addeventForm['controls']['CouponFormList']['controls']['couponID'].patchValue(CId);
      }
    
     
      // this.CouponFormList.controls['couponTitile'].patchValue(Name)
    
  }
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
selectProduct(){
 // alert('hii');
  
  const dialogRef = this.dialog.open(SelectProductItemsDialogComponent);
  dialogRef.componentInstance.productitem = this.selectedProductarray;

  dialogRef.afterClosed().subscribe(result => {
   console.log('selected product item>>>>>>',result);
this.uploadType = 'select'

   if (result.buttonName === 'SELECT') {

/////make all the selected product as dropdown
this.productDropdown = result['tableData'];
this.selectionType = 'select';

this.loaderStart = false;
this.disblebtns =false;

//remove those from grid wghich are modifed ;
if(this.productDropdown.length === 0){
  this.insertProductArray.length = 0;
}
if(this.insertProductArray.length>0){
  console.log('exist on grid');
  console.log('exist on grid list',this.insertProductArray);

  console.log('latest in dropdown',this.productDropdown);

  for(let i = 0; i<this.insertProductArray.length;i++){
     for(let j = 0;j<this.productDropdown.length;j++){
        if(+this.insertProductArray[i]['skuCode'] != +this.productDropdown[i]['skuCode']){
          this.insertProductArray.splice(i,1);
          console.log('updated insert prod arry>>>',this.insertProductArray)
        }
     }    
  }


}else{
  console.log('fresh entry');
}

///// make all the selected product as dropdown--end

       this.selectedProductarray = [];
       for (let i = 0; i < result.tableData.length; i++) {
        this.selectedProductarray.push(result.tableData[i].skuCode);
        const arrrayTempw = this.selectedProductarray;
        this.selectedProductarray = Array.from(new Set(arrrayTempw));
        console.log('sku',this.selectedProductarray);
        this.warn1 = false;

     
       }
   }

   //will chk later
  //  if(this.selectedProductarray.length>0){
     
  //        this.filterMatchedProduct(this.selectedProductarray); 
  // }


  })


}


loaderStart:boolean;
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

  let selectedbrand =  this.addeventForm.controls['Brand'].value;

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


  uploadAndProgress(files: FileList, fileType: String) {

    //    var formData = new FormData();
    //    Array.from(files).forEach(f => formData.append('file',f))
    if (files.item(0).type == "application/vnd.ms-excel" || files.item(0).type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      //this.uploadFiles.uploadFileSku(files.item(0), 'coupon', 'files')
       // .subscribe((response) => {
       //   console.log(response);
 /// }
 // );
}
}


removeSKU(){
  this.skuXslFileName = '';
  this.skuLink_url  = '';
  this.productDropdown = [];
  this.hidetext = true;
}


public uploadType:any;
public skuLink_url:any;
hidetext:boolean = true;;
  public uploadSkuEvent_Gifting(event: FileList) {

this.loaderStart = true;
       console.log('event',event);


    if (event[0].size < 1000000) {
      if (event[0].type == "application/vnd.ms-excel" || event[0].type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.uploadFile.uploadSkuFileEvent_Gifting(event.item(0), event[0].type)
          .subscribe((response) => {
            let url = response["output"]
            console.log('upload sku res',response["output"]);
           
            // this.addeventForm.controls.SKUCODE.patchValue(response["Output"]['sku']);
            // this.SKUCODEurl=response["Output"]['upload_url'];
            // console.log(response["Output"]['upload_url']);
            // console.log(event[0].name);
            this.skuXslFileName = response["output"]['uploadFileName'];
            console.log('sku file name>>>',this.skuXslFileName);
this.hidetext = false;
            this.skuLink_url =  response["output"]['skuLink'];
            this.productDropdown = response['output']['skuList'];
this.selectionType = 'upload';
            this.uploadType = 'file'
            this.disblebtns = false;
            this.loaderStart = false;
            this.warn1 = false;


//remove those from grid wghich are modifed ;
if(this.productDropdown.length === 0){
  this.insertProductArray.length = 0;
}
if(this.insertProductArray.length>0){
  console.log('exist on grid');
  console.log('exist on grid list',this.insertProductArray);

  console.log('latest in dropdown',this.productDropdown);

  for(let i = 0; i<this.insertProductArray.length;i++){
     for(let j = 0;j<this.productDropdown.length;j++){
        if(+this.insertProductArray[i]['skuCode'] != +this.productDropdown[j]['skuCode']){
          this.insertProductArray.splice(i,1);
          console.log('updated insert prod arry>>>',this.insertProductArray)
        }
     }    
  }


}else{
  console.log('fresh entry');
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



isEnabledProgramCheckbox(event){

    if(!event.checked){
      this.addeventForm.get('enableProgram').patchValue(false);

      const pushController = this.addeventForm.get('ProgramFormList') as FormArray;
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
      
      this.addeventForm.get('enableProgram').patchValue(true);
      const pushController = this.addeventForm.get('ProgramFormList') as FormArray;
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

    let pushController = this.addeventForm.get('ProductFormList') as FormArray;

    let defineProduct = pushController.at(0).get('defineProduct');
    let maxDenomination = pushController.at(0).get('maxDenomination');
    let prodRangeValueSelection = pushController.at(0).get('prodRangeValueSelection');
    let prodructMaxiEvent = pushController.at(0).get('prodructMaxiEvent');
    let productMaxiPerStore = pushController.at(0).get('productMaxiPerStore');
    let productmaxiPerLocation = pushController.at(0).get('productmaxiPerLocation');

    let productMinVal = pushController.at(0).get('productMinVal');
    let productMaxVal = pushController.at(0).get('productMaxVal');


    if(!event.checked){
      this.addeventForm.get('enableProduct').patchValue(false);
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

 // }
  
    }else{
      this.addeventForm.get('enableProduct').patchValue(true);

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
//   chkProgramdenomnation(event){
// let val = event.target.value;
// if(val && this.programKeywordVAlues.length ===0){
//   alert('ggg')
//   const pushController2 = this.addeventForm.get('ProgramFormList') as FormArray;

//   let programKeywordVAlues1 = pushController2.at(0).get('programKeywordVAlues');
//   //programKeywordVAlues1.setValidators(Validators.required);

//   programKeywordVAlues1.setErrors({ 'incorrect': true});
//   programKeywordVAlues1.markAsTouched();

//   programKeywordVAlues1.updateValueAndValidity();

// }
//   }
  


public removeOrderType(combotype){
  console.log(combotype)
  const control = <FormArray>this.addeventForm.controls['ProgramFormList'];
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
//"endTime": moment(this.addeventForm.controls['endTime'].value, "YYYY-MM-DD h:m").format("HH:mm:ss"),
////


get inFormArray() {
 return this.addeventForm.get('ProgramFormList') as FormArray;
}


 onChangePreptual(event){
  if(event.checked){
    this.addeventForm.controls['endDate'].disable();
    this.addeventForm.controls['endTime'].disable();
    this.addeventForm.controls['endDate'].clearValidators();
    this.addeventForm.controls['endTime'].clearValidators();
    this.addeventForm.controls['endDate'].reset();
      this.addeventForm.get('endTime').reset();
      this.timeerror2 = false;

  }else{
    this.addeventForm.controls['endDate'].enable();
    this.addeventForm.controls['endTime'].enable();

    this.addeventForm.controls['endDate'].setValidators(Validators.required);
    this.addeventForm.controls['endDate'].updateValueAndValidity();
   this.addeventForm.controls['endTime'].setValidators(Validators.required);
   this.addeventForm.controls['endTime'].updateValueAndValidity();

  }
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
  // }
  get programMinVal() {
  //  return <FormArray>this.addeventForm.get('programMinValue');

    return (<FormArray>this.addeventForm.get('ProgramFormList')).controls;  
  }

  get programManVal() {
    return <FormArray>this.addeventForm.get('ProgramFormList');
  }

  productMinValidate(event,data){
    //console.log(event,data);

    if(data === 'minValue'){
      const myForm = (<FormArray>this.addeventForm.get("ProductFormList")).at(0);
      myForm.get("productMaxVal").reset();

     this.productMinvalue = event.target.value;
      if(+event.target.value<1){
        myForm.get("productMinVal").setErrors({ 'incorrect': true});
        myForm.get("productMinVal").markAsTouched();
      }
    }
   
  }
  productMaxValidate(event,data){
    let myForm = (<FormArray>this.addeventForm.get("ProductFormList")).at(0);

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
    
      let myForm = (<FormArray>this.addeventForm.get("ProgramFormList")).at(0);
      myForm.get("programMaxValue").reset();

       this.programMinvalue = event.target.value;
        if(+event.target.value<1){
          this.minValueError  = true;
        }
      }


  }
  programMaxValidate(event,data){
    let myForm = (<FormArray>this.addeventForm.get("ProgramFormList")).at(0);
  
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
get PC(){
  return (<FormArray>this.addeventForm.get("ProgramFormList")).at(0);

}
get Prd(){
  return (<FormArray>this.addeventForm.get("ProductFormList")).at(0);

}

// get smsArrayControl(){
//   return (<FormArray>this.addeventForm.get("smsLocaleArray")).at(0);

// }

programMaxiEvent(event){
  this.programMaxiEventval = event.target.value;

  console.log('programMaxiEventval--',this.programMaxiEventval);

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


  if(+this.programMaxiPerStoreval >= +this.programMaxiEventval){

    console.log('programMaxiEventval--',this.programMaxiEventval);
    console.log('programMaxiPerStoreval--',this.programMaxiPerStoreval);

    this.PC.get("programMaxiPerStore").setErrors({ 'incorrect': true});
    this.PC.get("programMaxiPerStore").markAsTouched();
  }
}
programmaxiPerLocation(event){
  let val = event.target.value;
  console.log('this.programMaxiEventval',this.programMaxiEventval)
  if(+val >= +this.programMaxiEventval){
    this.PC.get("programmaxiPerLocation").setErrors({ 'incorrect': true});
    this.PC.get("programmaxiPerLocation").markAsTouched();
  }
}


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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

  CheckProductRange(event){
    if(event.checked){
  
      this.Editable = false;
      this.isMarkDefault = true;
  
  
   
  
    }else{
      this.Editable = true;
      this.isMarkDefault = false;
     
  
    
  
    
     }
      
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

public minValueError :boolean;
public selectStoreError:boolean;
public selectLocationError:boolean
public loading:boolean = false;
doValidation:boolean = false;
couponErrMssg:boolean = false;
noUserGifitng:boolean = false;
timeerror:boolean = false;
timeerror2:boolean = false;

createEvents(): void{

  for (let el in this.addeventForm.controls) {
    if (this.addeventForm.controls[el].errors) {
      console.log('invalid in main form>>',el)
    }
  }  
  let formvalues = this.addeventForm.value;

let ctx = new Date().toLocaleTimeString();
let currentTime = ctx
let startTime = moment(formvalues['startTime'], "YYYY-MM-DD h:m").format("HH:mm:ss");
let endTime = moment(formvalues['endTime'], "YYYY-MM-DD h:m").format("HH:mm:ss");


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
  // this.smsArrayControl.get('content').setValidators(this.setRequired());

  // this.smsArrayControl.get('content').updateValueAndValidity();


  this.doValidation = true;

    let formvalue = this.addeventForm.value;
   /// console.log('events daata',formvalue);

if(this.selectedStorearray.length === 0 && this.selectedLocationarray.length === 0){
///alert("please select store");
this.selectStoreError = true;
this.dataStore = false;

return;
}else if(this.addeventForm.get('isCouponsEnabled').value == true && this.finalCouponArray.length == 0){
 this.couponErrMssg = true;
  return;

}else if(this.addProgramResNew.length>0 && this.addeventForm.get('enableProgram').value == true){

  
  const pushController = this.addeventForm.get('ProgramFormList') as FormArray;
 
   let programId = pushController.at(0).get('programId');

   let programMaxiEvent = pushController.at(0).get('programMaxiEvent');
   let programMaxiPerStore = pushController.at(0).get('programMaxiPerStore');
   let programmaxiPerLocation = pushController.at(0).get('programmaxiPerLocation');
   let programMinValue = pushController.at(0).get('programMinValue');
   let programMaxValue = pushController.at(0).get('programMaxValue');
   let programKeywordVAlues = pushController.at(0).get('programKeywordVAlues');

  
   programId.clearValidators();
   programId.updateValueAndValidity();
  
   programMaxiEvent.clearValidators();
   programMaxiEvent.updateValueAndValidity();
  
   programMaxiPerStore.clearValidators();
   programMaxiPerStore.updateValueAndValidity();
  
   programmaxiPerLocation.clearValidators();
   programmaxiPerLocation.updateValueAndValidity();

     
   programMinValue.clearValidators();
   programMinValue.updateValueAndValidity();
     
   programMaxValue.clearValidators();
   programMaxValue.updateValueAndValidity();

   programKeywordVAlues.clearValidators();
   programKeywordVAlues.updateValueAndValidity();

}else if(this.insertProductArray.length>0 && this.addeventForm.get('enableProduct').value == true){

console.log('i am from product ...add event')
  const pushController = this.addeventForm.get('ProductFormList') as FormArray;
 
   let defineProduct = pushController.at(0).get('defineProduct');
   let maxDenomination = pushController.at(0).get('maxDenomination');

   let prodructMaxiEvent = pushController.at(0).get('prodructMaxiEvent');
   let productMaxiPerStore = pushController.at(0).get('productMaxiPerStore');
   let productmaxiPerLocation = pushController.at(0).get('productmaxiPerLocation');

   let productMinVal = pushController.at(0).get('productMinVal');
   let productMaxVal = pushController.at(0).get('productMaxVal');


  
   defineProduct.clearValidators();
   defineProduct.updateValueAndValidity();
  
   maxDenomination.clearValidators();
   maxDenomination.updateValueAndValidity();
  
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



}

if(this.addeventForm.invalid){
  console.log('form is invalidd>>');
  this.snackBar.openFromComponent(SnackBarComponent, {
    duration: 2000,
    data: {
      status: "failure",
      message: "Add event form is not valid.Please check again"
    }
  });
  return;
}



//////////////user gifting validation
if(this.selectedUserArray.length == 0){
  console.log('no user gifting defined');
this.noUserGifitng = true;
//return;
}else{
  console.log('user gifting defined');

  this.noUserGifitng = false;

}





/////////
if(this.addProgramResNew.length>0){
  this.programGridVal = this.addProgramResNew;
  this.programGridVal.map(res =>{
    
     res["programOid"] = res["programID"];
     res['currency'] = 'inr';
     res['maxForEvent'] = +res['maxForEvent'];
     delete res["programID"];
     delete res["programName"];
     delete res['balanceForEvent'];
     delete res['point&Stamp'];

   // res["programID"] = res["moneyRefund"] == 'SREFUNDABLE' ? res["moneyRefund"] = 'REFUNDABLE' : res["moneyRefund"];

  })
   console.log('this.addProgramResNewjj>>>', this.programGridVal);
 // return;
}

console.log( "storeOid",this.selectedStorearray)

// if (this.addeventForm.invalid) {
//   for (let i in this.addeventForm.controls)
//     this.addeventForm.controls[i].markAsTouched();

  
// }

let programformData = this.addeventForm.controls['ProgramFormList'].value

let giftLanguageList = this.addeventForm.controls['giftLanguageList'].value;
let conditionArray = this.addeventForm.controls['conditionArray'].value;

let ProductFormList =  this.addeventForm.controls['ProductFormList'].value;


this.loading = true;

let eventNamesTnc=[];
for(var obj_cOn in conditionArray)
    {
      for(var obj_Lag in giftLanguageList)
      {
  if(conditionArray[obj_cOn]['languageCode'] == giftLanguageList[obj_Lag]['languageCode']){
        let tem_obj={
          "languageCode": giftLanguageList[obj_Lag]['languageCode'],
          "languageName": giftLanguageList[obj_Lag]['languageName'],
          "eventName": giftLanguageList[obj_Lag]['eventName'],
          "termAndCondition": conditionArray[obj_cOn]['termAndCondition']
      }
      eventNamesTnc.push(tem_obj);

  }
      } 
    } 


    
    console.log("---------------Test-------------------");
    console.log(eventNamesTnc);
// "conditionArray":conditionArray,
//     "giftLanguageList":giftLanguageList,

///let productArryList_outer = this.insertProductArray;
///let productArryList_finalmodify = this.insertProductArray;
let productArryList_outer = this.insertProductArray.map(item=>{
  return {...item}
})

let productArryList_finalmodify = this.insertProductArray.map(item=>{
  return {...item}
})

productArryList_finalmodify.map(res =>{
  delete res["variantTypeOid"];
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

///main array product list



console.log('productArryList_outer>>>',productArryList_outer);


/////
console.log('productArryList productArryList_inner before>>>', this.insertProductArray);



 console.log('productArryList_finalmodify>>>',productArryList_finalmodify);

 let skulist_modify = this.productDropdown.map(item=>{
  return {...item}
})

//let skulist_modify = this.productDropdown;
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

productArryList_finalmodify.map(res =>{
    
  res['uploadData'] = {
    "skuLink":  this.skuLink_url ? this.skuLink_url : '',
    "uploadFileName": this.skuXslFileName ? this.skuXslFileName : '',
      "skuList":  skulist_modify
  }  


})

console.log('productArryList final>>>',productArryList_finalmodify);




 let  addEvent = {
   "startDate": moment(formvalue['startDate'], "YYYY-MM-DD h:m").format("YYYY-MM-DD"),
   "endDate": formvalue.isPreptual ? '' : moment(formvalue['endDate'], "YYYY-MM-DD h:m").format("YYYY-MM-DD"),
   "startTime": moment(formvalue['startTime'], "YYYY-MM-DD h:m").format("HH:mm:ss"),//h:mm a
   "endTime":  formvalue.isPreptual ? '' : moment(formvalue['endTime'], "YYYY-MM-DD h:m").format("HH:mm:ss"),
   "perpetual": formvalue.isPreptual ? formvalue.isPreptual:false,
   "defaultEvent" :formvalue.isDefaultEvent ? formvalue.isDefaultEvent : false,
    "brandOid" : this.brandId,
    "product_gifting" : formvalue.enableProduct ? formvalue.enableProduct : false,
    "program_gifting" : formvalue.enableProgram ? formvalue.enableProgram : false,
    "coupon_gifting" :   formvalue.isCouponsEnabled ? formvalue.isCouponsEnabled : false,
    "multiple_coupon_allowed" : formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
    "multiple_product_allowed" :   formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
    "multiple_program_allowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
  //  "app_notification":true,
   // "sms_notification":true,
    "status": 'Online',  //"NEW", 
    "Product_Image": "",
    "eventDescription": formvalue.eventdesc,
    "displayEventOnCustomerApp": formvalue.isDisplayEvent ? "yes" : 'no',
 //   "conditionArray":conditionArray,
   // "giftLanguageList":giftLanguageList,
    "eventNamesTnc": eventNamesTnc,
    "storeId": this.selectedStorearray.length>0 ?  this.selectedStorearray : [],
    "location":this.selectedLocationarray.length>0 ? this.selectedLocationarray : [],
  //  "users": this.userinfo,
  "users" : this.FINAL_OBJ,
      "storeAppContent": {
      "title":formvalue.apptitle,
      "description": formvalue.appdesc,
      "note": "hello welcome to the store"
      }
      
}


console.log('isCouponsEnabled>>>>>',this.addeventForm.get('isCouponsEnabled').value);
console.log('enableProgram>>>>>',this.addeventForm.get('enableProgram').value);
console.log('enableProduct>>>>>',this.addeventForm.get('enableProduct').value);

console.log('selectedCouponArray>>>>>',this.selectedCouponArray);


///make gifting dynamic
//all c pr pd   
if(this.addeventForm.get('isCouponsEnabled').value && this.addeventForm.get('enableProgram').value && this.addeventForm.get('enableProduct').value){
console.log('gifting type>>>>>> ------ coupon,program,product');
let giftingdata = [
  {
      "giftingtype": "programs",
      "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
      "GiftingDetails": this.programGridVal
  },
  {
   "giftingtype": "COUPONS",
    "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
    "GiftingDetails":this.selectedCouponArray
},
{
  "giftingtype": "products",
  "productImage": "",
  "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
  "GiftingDetails": {
        "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
        "productDetails": productArryList_outer
  }

}
]
addEvent['gifting'] = giftingdata;


}

if(!this.addeventForm.get('isCouponsEnabled').value && !this.addeventForm.get('enableProgram').value && !this.addeventForm.get('enableProduct').value){
  console.log('gifting type>>>>>> ------ none');
  let giftingdata = []
  addEvent['gifting'] = giftingdata;
  
  
  }
//c pro
if(this.addeventForm.get('isCouponsEnabled').value && this.addeventForm.get('enableProgram').value && !this.addeventForm.get('enableProduct').value){
  console.log('gifting type>>>>>> ------ coupon,program');

  let giftingdata = [
    {
        "giftingtype": "programs",
        "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
        "GiftingDetails": this.programGridVal
    },
    {
     "giftingtype": "COUPONS",
      "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
      "GiftingDetails":this.selectedCouponArray
  },
  // {
  //   "giftingtype": "products",
  //   "productImage": "",
  //   "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
  //   "GiftingDetails": {
  //         "moreThenOneGiftAllowed": ProductFormList[0]['moreThanOneGiftProduct'],
  //         "productDetails": productArryList_outer
  //   }
  
  // }
  ]
  addEvent['gifting'] = giftingdata;
  
  
  }

//c prd
if(this.addeventForm.get('isCouponsEnabled').value && !this.addeventForm.get('enableProgram').value && this.addeventForm.get('enableProduct').value){
  console.log('gifting type>>>>>> ------ ,coupon,product');

  let giftingdata = [

    {
     "giftingtype": "COUPONS",
      "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
      "GiftingDetails":this.selectedCouponArray
  },
  {
    "giftingtype": "products",
    "productImage": "",
    "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
    "GiftingDetails": {
          "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
          "productDetails": productArryList_outer
    }
  
  }
  ]
  addEvent['gifting'] = giftingdata;
  
  
  }  
//c
  if(this.addeventForm.get('isCouponsEnabled').value && !this.addeventForm.get('enableProgram').value && !this.addeventForm.get('enableProduct').value){
    console.log('gifting type>>>>>> ------ coupon');

    let giftingdata = [
      // {
      //     "giftingtype": "programs",
      //     "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
      //     "GiftingDetails": this.programGridVal
      // }
      {
       "giftingtype": "COUPONS",
        "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
        "GiftingDetails":this.selectedCouponArray
    }
    // {
    //   "giftingtype": "products",
    //   "productImage": "",
    //   "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
    //   "GiftingDetails": {
    //         "moreThenOneGiftAllowed": ProductFormList[0]['moreThanOneGiftProduct'],
    //         "productDetails": productArryList_outer
    //   }
    
    // }
    ]
    addEvent['gifting'] = giftingdata;
    
    
    }

    //pr pd
    if(!this.addeventForm.get('isCouponsEnabled').value && this.addeventForm.get('enableProgram').value && this.addeventForm.get('enableProduct').value){
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
        "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
        "GiftingDetails": {
              "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
              "productDetails": productArryList_outer
        }
      
      }
      ]
      addEvent['gifting'] = giftingdata;
      
      
      }
         //pr c
    // if(this.addeventForm.get('isCouponsEnabled').value && this.addeventForm.get('enableProgram').value && !this.addeventForm.get('enableProduct').value){
    //   console.log('gifting type>>>>>> ------ coupon,program');

    //   let giftingdata = [
    //     {
    //         "giftingtype": "programs",
    //         "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
    //         "GiftingDetails": this.programGridVal
    //     },
    //     {
    //      "giftingtype": "COUPONS",
    //       "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
    //       "GiftingDetails":this.selectedCouponArray
    //   }
     
    //   ]
    //   addEvent['gifting'] = giftingdata;
      
      
    //   }
       // pr
       if(!this.addeventForm.get('isCouponsEnabled').value && this.addeventForm.get('enableProgram').value && !this.addeventForm.get('enableProduct').value){
        console.log('gifting type>>>>>> ------ ,program,');

        let giftingdata = [
          {
              "giftingtype": "programs",
              "moreThenOneGiftAllowed": formvalue.moreThenOneProgramnAllow ? formvalue.moreThenOneProgramnAllow : false,
              "GiftingDetails": this.programGridVal
          }
        //   {
        //    "giftingtype": "COUPONS",
        //     "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
        //     "GiftingDetails":this.selectedCouponArray
        // },
        // {
        //   "giftingtype": "products",
        //   "productImage": "",
        //   "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
        //   "GiftingDetails": {
        //         "moreThenOneGiftAllowed": ProductFormList[0]['moreThanOneGiftProduct'],
        //         "productDetails": productArryList_outer
        //   }
        
        // }
        ]
        addEvent['gifting'] = giftingdata;
        
        
        }




    // prd
    if(!this.addeventForm.get('isCouponsEnabled').value && !this.addeventForm.get('enableProgram').value && this.addeventForm.get('enableProduct').value){
      console.log('gifting type>>>>>> ------ ,,product');

      let giftingdata = [
     
      {
        "giftingtype": "products",
        "productImage": "",
        "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
        "GiftingDetails": {
              "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
              "productDetails": productArryList_finalmodify
        }
      
      }
      ]
      addEvent['gifting'] = giftingdata;
      
      
      }
          // prd c
    // if(this.addeventForm.get('isCouponsEnabled').value && !this.addeventForm.get('enableProgram').value && this.addeventForm.get('enableProduct').value){
    //   console.log('gifting type>>>>>> ------ coupon,product');

    //   let giftingdata = [
     
    //     {
    //      "giftingtype": "COUPONS",
    //       "moreThenOneGiftAllowed": formvalue.moreThenOneCouponAllow ? formvalue.moreThenOneCouponAllow : false,
    //       "GiftingDetails":this.selectedCouponArray
    //   },
    //   {
    //     "giftingtype": "products",
    //     "productImage": "",
    //     "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
    //     "GiftingDetails": {
    //           "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
    //           "productDetails": productArryList_outer
    //     }
      
    //   }
    //   ]
    //   addEvent['gifting'] = giftingdata;
      
      
    //   }

      //pd pr
      // if(!this.addeventForm.get('isCouponsEnabled').value && this.addeventForm.get('enableProgram').value && this.addeventForm.get('enableProduct').value){
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
      //     "enableGifting": this.addeventForm.get('enableProduct').value ? this.addeventForm.get('enableProduct').value : false,
      //     "GiftingDetails": {
      //           "moreThenOneGiftAllowed":  formvalue.moreThanOneGiftProduct ? formvalue.moreThanOneGiftProduct : false,
      //           "productDetails": productArryList_outer
      //     }
        
      //   }
      //   ]
      //   addEvent['gifting'] = giftingdata;
        
        
      //   }
     










//  let isPushNotify = formvalue.isPushNotify ? formvalue.isPushNotify : false;
//  let isSMS = formvalue.isSMS ? formvalue.isSMS : false;

// console.log('isPushNotify',isPushNotify);
// console.log('isSMS',isSMS)


// if(isPushNotify && isSMS){
//   let appNsms1 = [
//     {
//       "type": "PUSH",
//       "template": formvalue.pushTemplate,
//       "hyper_link": formvalue.pushHyperLink,
//       "sender_id": "TestTestTet",
//       "link_to": formvalue.pushLinkTo,
//       "languageContent": [

//           {
//               "subject": "Test",
//               "content": "Test ",
//               "image": "Test",
//               "language_code": "EN"


//           },
//           {
//               "subject": "gggghhhhhhjjjjjjbbbbbaaqqqqqqqqq",
//               "content": "jjmmmooopppuuuuu",
//               "image": "Test",
//               "language_code": "AR"


//           }
//       ]

//   },
//   {
//     "type": "SMS",
//     "template": formvalue.smsTemplate,
//     "hyper_link": "Testnew",
//     "sender_id": formvalue.smsSenderId,
//     "link_to": "Test",
//     "languageContent": [

//         {
//             "subject": "Testdd",
//             "content": "rrrrrrrrrrrrrrrrrrrrrr",
//             "image": "Testnrtt",
//             "language_code": "EN"


//         },
//         {
//             "subject": "Test",
//             "content": "Test",
//             "image": "Test",
//             "language_code": "AR"


//         }
//     ]

// }
// ]
//   addEvent['communicationType'] = appNsms1;
// }
// if(isPushNotify){
//   let appNsms2 = [
//     {
//       "type": "PUSH",
//       "template": 1,
//       "hyper_link": "Test",
//       "sender_id": "TestTestTet",
//       "link_to": "Test",
//       "languageContent": [

//           {
//               "subject": "Test",
//               "content": "Test ",
//               "image": "Test",
//               "language_code": "EN"


//           },
//           {
//               "subject": "gggghhhhhhjjjjjjbbbbbaaqqqqqqqqq",
//               "content": "jjmmmooopppuuuuu",
//               "image": "Test",
//               "language_code": "AR"


//           }
//       ]

//   }

// ]
//   addEvent['communicationType'] = appNsms2;
// }
// if(isSMS){
//   let appNsms3 = [
//     {
//       "type": "SMS",
//       "template": 1,
//       "hyper_link": "Testnew",
//       "sender_id": "Testnew",
//       "link_to": "Test",
//       "languageContent": [

//           {
//               "subject": "Testdd",
//               "content": "rrrrrrrrrrrrrrrrrrrrrr",
//               "image": "Testnrtt",
//               "language_code": "EN"


//           },
//           {
//               "subject": "Test",
//               "content": "Test",
//               "image": "Test",
//               "language_code": "AR"


//           }
//       ]

//   }
// ]
//   addEvent['communicationType'] = appNsms3;
// }


// if (isPushNotify) {
//   for (let i = 0; i < this.languages.length; i++) {
//   }
 
//   if(this.addeventForm.get('specificBrand').value != undefined && this.addeventForm.get('specificBrand').value != '' && this.addeventForm.get('specificBrand').value != null)
//       this.linkToId = this.addeventForm.get('specificBrand').value 

//   let appNsms2 = [
//     {
//       "type": "PUSH",
//       "template": this.addeventForm.get('pushTemplate').value,
//       "hyper_link": this.addeventForm.get('pushHyperLink').value,
//       "sender_id": "",
//       "link_to": this.addeventForm.get('pushLinkTo').value,
//       "languageContent": this.addeventForm.value.pushLocaleArray

//   }

// ]


//   addEvent['communicationType'] = appNsms2
// }


// if (isSMS) {
//   for (let i = 0; i < this.languages.length; i++) {
//   }
//   let smsContent = {
//       templateId: this.addeventForm.get('smsTemplate').value,
//       senderId: this.addeventForm.get('smsSenderId').value,
//       hyperLink: this.addeventForm.get('smsHyperLink').value,
//       smsContentLocale: this.addeventForm.value.smsLocaleArray,
//       smsPersonaliseAttr: this.smsAttr
//   }
//   addEvent['communicationType'] = smsContent
// }



console.log('reqBody of addEvent>>>>',addEvent);

//debugger;

//http://182.72.208.172:3015/rest/api/v1/event_admin/upload_sku
///http://182.72.208.172:3015/rest/api/v1/event_admin/add_event
this.http.postGiftingJson(environment.GiftingAPIEndpoint+'rest/api/v1/event_admin/add_event',addEvent).subscribe(res => {
console.log('add event res',res)

this.snackBar.openFromComponent(SnackBarComponent, {
  duration: 5000,
  data: {
    status: "success",
    message: "Event  added successfully"
  }
});
this.loading = false;
this.router.navigate(['/search-events']);
}
, err => {
  this.loading = false;
  console.log("error errorMessage = ", err.error.errorMessage);

  
  if (err.error.errorType == 'VALIDATION') {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 10000,
      data: {
        status: "failure",
        message: err.error.errorDetails[0].description
      }
    });
  }else if(err.error.errorMessage == 'Please enter unique Event name'){
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 10000,
      data: {
        status: "failure",
        message: "Please enter unique Event name"
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


setRequired() {
  if(this.addeventForm.get('isSMS').value === true) {
   // updateValueAndValidity()
      return [Validators.required];
  } else {
      return [];
  }   
}
  }

