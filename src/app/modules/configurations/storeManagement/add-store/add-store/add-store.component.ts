import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSnackBar } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { storeContactDialog } from '../../../../../shared/components/store-contact-dialog/store-contact.component';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import * as moment from 'moment';
import { storeAmenitiesDialog } from '../../store-amenities-dialog/store-amenites.component';
import { AreaMappingDialog } from '../../area-mapping-dialog/area-mapping.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExtraValidators } from 'src/app/services/validator-service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export interface Amenity {
  name: string;
}
export interface Keyword {
  name: string;
}

export interface daysArray {
  name: string;

}


export interface City {
  cityId: number;
  cityName: string;
}

export interface Brand {
  brandId: number;
  brandName: string;
}
export interface Mall {
  mallId: number;
  mallName: string;
}

@Component({
  selector: 'add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss']
})
export class AddStoreComponent implements OnInit {
  public breadCrumbData: Array<Object> = [{
    title: 'Configurations',
    link: '/login'
  }, {
    title: 'Store Management',
    link: '/search-user'
  },];
  @ViewChild("storeForm") storeForm;
  @ViewChild('personName') personName: ElementRef;
  @ViewChild('personNumber') personNumber: ElementRef;
  @ViewChild('personEmail') personEmail: ElementRef;
  @ViewChild('uploadEl') uploadElRef: ElementRef;
  @ViewChild('uploadImgEl') uploadImgEl: ElementRef;


  storeFormGroup: FormGroup;
  public showNotification: boolean;
  storeId = new FormControl('', [Validators.required]);
  public imgUpload = false;
  public imgUpload360 = false;
  public imgUploadArabic = false;
  public filePathUrl = localStorage.getItem("imgBaseUrl");
  public countries: any = [];
  public showCountryError: boolean = false;
  public languageList = JSON.parse(localStorage.getItem("languageList"));
  public statusValue: string = 'ONLINE';
  public toggleVal: boolean = true;
  public uploadError = [];
  public loading = false;
  public cities: any = [];
  public brands: any = [];
  public malls: any = [];
  public minDate: Date = new Date();
  // public mallList = [];
  public keywordErrorMsg = [];
  public amenitiesErrorMsg = false;
  public currency = '';
  public amenitiesArr = [];
  public selectedAminity = [];
  public selectedDeliveryArea = [];
  public storeLocalesArr = [];
  public personContactDetails = [];
  public alignCss = [];
  public showError = false;
  public storeTimings = [];
  public imagePath: any = [];
  public uploadFlag = [];
  public keywordArray = [];
  public fullImagePath = [];
  public storeImgFlag = [];
  public contactsErrorMsg = false;
  public requiredKeywordError = [];
  public codeGeneration = 'Radius';
  public keywordEmptyErrors = [];
  businessHours = [];
  deliveryHours = [];
  public orderServiceType;
  public holidayType;
  deliveryChecked = false;
  public orderService: any;
  public weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public brandType: String = '';
  public brandCtrlKey;
  public cityCtrlKey;
  public mallCtrlKey;
  // public closingDate: Date = new Date();
 

  public cityList;
  Cities: City[] = [];
  cityCtrl = new FormControl();
  filteredCities: Observable<City[]>;

  public brandList;
  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredBrands: Observable<Brand[]>;
  public imagePathLogo: string = '';
  public imageUploadingLogo: boolean = false;
  public uploadImageLogoError;
  public showImageErrorLogo: boolean = false;
  imageErrMsgLogo: string;

  public mallList;
  Malls: Mall[] = [];
  mallCtrl = new FormControl();
  filteredMalls: Observable<Mall[]>;

  public daysArray = [
    { name: 'Monday' },
    { name: 'Tuesday' },
    { name: 'Wednesday' },
    { name: 'Thursday' },
    { name: 'Friday' },
    { name: 'Saturday' },
    { name: 'Sunday' },

  ]
  mallId: any;
  brandId: any;
  StoreTypeList=[ ]
  // affiliateStoresVal: any;
  languageDirection = [];

  constructor(private fb: FormBuilder, private http: HttpService,
    private router: Router, public dialog: MatDialog,
    public snackBar: MatSnackBar, private uploadFile: UploadFile) {
     this.buildCreateStoreForm();
  }

  baseUrl: any = '';
  StoreTypeList1 = [];
  DeliveryHours = true;

  ngOnInit() {
    this.getStoreListData();
    this.addStoreLocales();
    this.getAllRegionBrands();
    this.addStoreTimings();
    this.addBusinessDays();
    this.addDeliveryDays();
  }

  getStoreListData() {
    let StoreTypeList = environment.APIEndpoint + "api/rpa/store/v1/get/storeTypes";
    this.http.getJson(StoreTypeList)
    .subscribe((response) => {
       this.StoreTypeList=response;
       this.StoreTypeList.forEach(res => {
         this.StoreTypeList1.push({
           "storeTypeOid": res.storeTypeOid,
           "storeTypeValue": res.storeTypeValue,
           "value" : res.storeTypeOid
        
       });
     })
      });
  }
  storeImage(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgUpload = true;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.baseUrl = <string>reader.result;

      }
    }
  }

  //keywords chips
  addKeyword(event: MatChipInputEvent, index): void {
    const input = event.input;
    const value = event.value;

    let regex = /^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*$/;
    if (value != '') {
      let valid = value.match(regex)
      if (!valid) {
        this.keywordErrorMsg[index] = true;
      } else {
        this.keywordErrorMsg[index] = false;
        // Add our keyword
        if ((value || '').trim()) {
          this.keywordArray[index].keyword.push(value.trim());
          this.requiredKeywordError[index] = false;
          this.keywordEmptyErrors[index] = false;
        }

        // Reset the input value
        if (input) {
          input.value = '';
        }
      }
    }
  }

  removeKeyword(keyword: Keyword, ind): void {
    const index = this.keywordArray[ind].keyword.indexOf(keyword);

    if (index >= 0) {
      this.keywordArray[ind].keyword.splice(index, 1);
    }
  }

  //amenities chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  selectedContact = 0;
  name = {};

  addContact(x) {
    this.selectedContact = x;

    this.name['personName'] = this.personName.nativeElement.value;
    this.name['personNumber'] = this.personNumber.nativeElement.value;
    this.name['personMailId'] = this.personEmail.nativeElement.value;
    this.personName.nativeElement.value = '';
    this.personNumber.nativeElement.value = '';
    this.personEmail.nativeElement.value = '';
  }

  //image upload

  url: any = '';
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgUpload = true;
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        // this.url = event.target.result;
        this.url = <string>reader.result;

      }
    }
  }
  urlAr: any = '';
  onSelectFileAr(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgUploadArabic = true;
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        // this.url = event.target.result;
        this.urlAr = <string>reader.result;
      }
    }
  }

  public removeContact(i) {
    this.personContactDetails.splice(i, 1);

  }

  public setBrandType(brandOid) {
    this.brandList.forEach(element => {
      if (element.brandId == brandOid) {
        this.brandType = element.brandType;
      }
    });
  }

  public buildCreateStoreForm() {
    let form = {
       storeTypes: [""],
      storeId: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,15}$")])],
      country: ["", Validators.required],
      // city: ["", Validators.required],
      // brandId: ["", Validators.required],
      currencyCode: ["", Validators.required],
     // affiliateStore: ["", Validators.required],
      // mall: ['', Validators.required],
      googleMapUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
      longitude: ["", Validators.compose([Validators.required, Validators.pattern('[0-9.\"&\'(),-:.?_]{1,50}$')])],
      latitude: ["", Validators.compose([Validators.required, Validators.pattern('[0-9.\"&\'(),-:?_]{1,50}$')])],
      launchDate: ["",],
      // launchTime: ['',],
      // closingDateCtrl: [''],
      launchTime: ['', Validators.compose([ExtraValidators.conditional(
        group => this.storeFormGroup.get('launchDate').value !== '',
        Validators.required
        )])],
      storeLocales: this.fb.array([]),
      adminName: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z ]{1,200}$")])],
      phoneNumber: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*")])],
      emailId: ["", Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
      employeId: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9]{1,20}$")])],
      storeTimings: this.fb.array([]),
      menuUrl:["" ,Validators.compose([Validators.maxLength(50),Validators.pattern("^[a-zA-Z0-9.-]{1,50}$")])],
      pickUp: false,
      delivery: false,
      dropInCar: false,
      // shipping: false,
      signingStore: false,
      sameBuildingDelivery: false,
      driveThru: false,
      kms: "",
      businessTimings: this.fb.array([]),
      deliveryTimings: this.fb.array([]),
      businessAvailable247: false,
      deliveryAvailabe247: false,
      deliveryId:['', Validators.compose([Validators.pattern("^[A-Za-z0-9]*")])],
    }


    this.storeFormGroup = this.fb.group(form);
    for (let l of this.languageList) {
      this.uploadFlag.push(false);
      this.storeImgFlag.push(false);
      this.keywordEmptyErrors.push(false);
      this.uploadError.push(false);
      this.imagePath.push('');
    }

  }
  
  public addBusinessDays() {
    for (let i = 0; i < this.weekDays.length; i++) {
      const control = <FormArray>this.storeFormGroup.controls['businessTimings'];
      let newForm = this.fb.group({
        isHoliday: [true,],
        openTime: [''],
        closeTime: [''],
        addBusinessTimings: new FormArray([])
      });
      control.push(newForm);
    }
  }

  public addDeliveryDays() {

    for (let i = 0; i < this.weekDays.length; i++) {
      const control = <FormArray>this.storeFormGroup.controls['deliveryTimings'];
      let newForm = this.fb.group({
        isHoliday: [true,],
        openTime: ['',],
        closeTime: ['',],
        addDeliveryTimings: new FormArray([])
      });
      control.push(newForm);
    }
  }

  public addStoreLocales() {
    this.imagePath = [];
    this.fullImagePath = [];
    this.requiredKeywordError = [];
    const control = <FormArray>this.storeFormGroup.controls['storeLocales'];
    for (let ln of this.languageList) {
      let newForm = this.fb.group({
        storeName: ["", Validators.compose([Validators.required])],
        videoUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
        address: ["", Validators.compose([Validators.required])],
        keywords: ["", Validators.pattern("^[A-Za-z0-9 ]{1,20}$")],
        storeImage: [],
        store360Image: [],
        storeLogoImage: []
      });
      control.push(newForm);
      this.keywordArray.push({
        keyword: []
      });
      this.imagePath.push('');
      this.fullImagePath.push('');
      this.requiredKeywordError.push(false);
      this.alignCss.push(ln.direction == 'RTL' ? 'text-right' : '');
      this.languageDirection.push(ln.direction == 'RTL' ? 'direction' : '');
    }
  }
  public addStoreTimings() {
    for (let i = 0; i < this.daysArray.length; i++) {
      const control = <FormArray>this.storeFormGroup.controls['storeTimings'];
      let newForm = this.fb.group({
        holiday: [false],
        openTime: [""],
        closeTime: [""],

      });
      control.push(newForm);
    }
  }

  getAllCitiesA(countryId) {
    this.selectedDeliveryArea =[];
    this.areaMappingError=false;
    console.log(countryId);
    this.cityList = [];
    this.Cities = [];
    this.cityCtrl.reset('');
    this.cityId = '';
    this.storeFormGroup.get('latitude').setValue('');
    this.storeFormGroup.get('longitude').setValue('');
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
    this.http.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
      .subscribe((response) => {
        this.cityList = [];
        this.Cities = [];
        this.cityList = response;
        for (let i of this.countries) {
          if (i.countryId == countryId) {
            this.storeFormGroup.patchValue({
              currencyCode: i.currencyCode
            })
          }
        }

        for (let i = 0; i <= this.cityList.length - 1; i++) {
          let objCitykey = {
            cityId: this.cityList[i]['cityId'],
            cityName: this.cityList[i]['cityName'],
          }
          console.log(objCitykey);
          this.Cities.push(objCitykey);
        }
        this.filteredCities = this.cityCtrl.valueChanges
          .pipe(
            startWith(''),
            map(city => city ? this._filterCities(city) : this.Cities.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
  }

  public cityId;

  getAllcity(cityId) {
    this.cityId = cityId;
    console.log(this.cityId);
  }


  getAllBrand(brandId) {
    this.brandId = brandId;
    console.log(this.brandId);
  }

  getAllMall(mallId) {
    this.mallId = mallId;
    console.log(this.mallId);
  }

  getAllRegionBrands() {
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.http.getJson(GET_ALL_CITIES)
      .subscribe((response) => {
        this.brandList = response;
        console.log(this.brandList);

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objbrandkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          console.log(objbrandkey);
          this.Brands.push(objbrandkey);
        }
        this.filteredBrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }

  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }


  getAllMalls(cityId) {
    console.log(cityId);
    this.selectedDeliveryArea=[];
    this.areaMappingError=false;
    this.mallList = [];
    this.Malls = [];
    this.mallId = '';
    this.mallCtrl.reset('');
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/mall/v1/get/malls";
    this.http.getJson(GET_ALL_CITIES + "?cityIds=" + cityId)
      .subscribe((response) => {
        this.mallList = response;

        for (let i = 0; i <= this.mallList.length - 1; i++) {
          let objMallkey = {
            mallId: this.mallList[i]['mallId'],
            mallName: this.mallList[i]['mallName'],
          }
          console.log(objMallkey);
          this.Malls.push(objMallkey);
        }
        this.filteredMalls = this.mallCtrl.valueChanges
          .pipe(
            startWith(''),
            map(mall => mall ? this._filterMalls(mall) : this.Malls.slice())
          );
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterMalls(value: string): Mall[] {
    const filterValue = value.toLowerCase();
    return this.Malls.filter(mall => mall.mallName.toLowerCase().indexOf(filterValue) === 0);
  }

  getAllCountries(brandId) {
    console.log(brandId);
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions"
    this.http.getJson(GET_ALL_COUNTRIES + "?brandOid=" + brandId)
      .subscribe((response) => {
        this.countries = response;
      })
  }

  getLatLongValue(mallId) {
    let GET_MALL_BY_ID = environment.APIEndpoint + "api/rpa/master/mall/v1/view";
    let request = {
      mallId: mallId
    }
    this.http.postJson(GET_MALL_BY_ID, request)
      .subscribe((response) => {
        this.storeFormGroup.patchValue({
          latitude: response['lattitude'],
          longitude: response['longitude']
        })
      });
  }

  public updateValidatiopn(value) {
    let kms = this.storeFormGroup.get('kms');
    if (value == 'Radius') {
      kms.setValidators([Validators.required]);
      kms.updateValueAndValidity();
      this.selectedDeliveryArea = [];
      this.areaMappingError=false;
    } else {
      kms.clearValidators();
      kms.updateValueAndValidity();
    }
  }

  public uploadImageLogo(event: FileList) {
    this.imageUploadingLogo = true;
    if (event[0].size < 1000000) {
        if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/jpg" || event[0].type == "image/JPG" || event[0].type == "image/JPEG" || event[0].type == "image/PNG") {
            if (event[0].size < 1000000) {
                this.uploadFile.upload(event.item(0), 'productAddon', 'images')
                    .subscribe((response) => {
                        console.log(response);
                        this.imagePathLogo = response['message'];
                        this.imageUploadingLogo = false;
                        this.showImageErrorLogo = false;
                        this.uploadElRef.nativeElement.value = ''
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
                this.imageUploadingLogo = false;
                this.imageErrMsgLogo = "Max upload file size is 1Mb";
            }
        } else {
            this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                    status: "failure",
                    message: "Supported format is JPG, JPEG and PNG"
                }
            });
        }
    } else {
        this.imagePathLogo = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
                status: "failure",
                message: "Max upload file size is 1Mb"
            }
        });
    }
}

removeImageLogo() {
    this.imagePathLogo = '';
}

  createStore(formData) {
    if(this.storeFormGroup.valid && this.cityCtrl.status == 'VALID' && this.mallCtrl.status == 'VALID' && this.brandCtrl.status == 'VALID'){
    console.log(formData);
    this.storeLocalesArr = [];
    this.storeTimings = [];
    this.amenitiesArr = [];

    let imageInvalid = false;
    if (this.imagePath.length > 0) {
      for (let i = 0; i < formData.storeLocales.length; i++) {
        if (this.imagePath[i] == '') {
          this.uploadError[i] = true;
          imageInvalid = true;
        }
      }
    }

    for (let i = 0; i < this.keywordArray.length; i++) {
      let keyword = this.keywordArray[i].keyword;
      if (keyword.length == undefined || keyword.length <= 0) {
        this.keywordEmptyErrors[i] = true;
      } else {
        this.keywordEmptyErrors[i] = false;
      }
    }

    let keyWordError = false;
    for (let i = 0; i < this.keywordEmptyErrors.length; i++) {
      if (this.keywordEmptyErrors[i] == true) {
        keyWordError = true;
      }
    }

    if (this.personContactDetails.length == 0)
      this.contactsErrorMsg = true;
    if (this.storeFormGroup.invalid || this.contactsErrorMsg || keyWordError || imageInvalid) {
      this.showError = true;

    } else {
      this.loading = true;
      for (var i = 0; i < formData.storeLocales.length; i++) {
        let locale = {
          languageOid: this.languageList[i].languageId,
          videoUrl: formData.storeLocales[i].videoUrl,
          storeImagePath: this.imagePath[i],
          storeName: formData.storeLocales[i].storeName,
          storeAddress: formData.storeLocales[i].address,
          storeKeywords: this.keywordArray[i].keyword,
          store360ImagePath: this.fullImagePath[i],
        }
        this.storeLocalesArr.push(locale);
      }


      let selectedArear = this.selectedDeliveryArea.map(oid => oid.deliveryAreaOid);

      let businessHoursarray = [];
      let deliveryHoursarray = [];
       
       this.DeliveryHours = true;
  
      if (formData.businessTimings.length != 0) {
        for (let i = 0; i < formData.businessTimings.length; i++) {
          let businessstoreTimings = [];
          let timeBody: any;
          timeBody = {
            openTime: formData.businessTimings[i].openTime != '' ? moment(formData.businessTimings[i].openTime).format('HH:mm') : '',
            closeTime: formData.businessTimings[i].closeTime != '' ? moment(formData.businessTimings[i].closeTime).format('HH:mm') : ''
          }
          businessstoreTimings.push(timeBody);
        
          for (let j = 0; j < formData.businessTimings[i].addBusinessTimings.length; j++) {
            let timeBody = {
              openTime: formData.businessTimings[i].addBusinessTimings[j].openTime != '' ? moment(formData.businessTimings[i].addBusinessTimings[j].openTime).format('HH:mm') : '',
              closeTime: formData.businessTimings[i].addBusinessTimings[j].closeTime != '' ? moment(formData.businessTimings[i].addBusinessTimings[j].closeTime).format('HH:mm') : ''
            }
            businessstoreTimings.push(timeBody);
      
          }
          let body = {
            day: this.weekDays[i] == 'SUN' ? 'SUNDAY' : this.weekDays[i] == 'MON' ? 'MONDAY' : this.weekDays[i] == 'TUE' ? 'TUESDAY' : this.weekDays[i] == 'WED' ? 'WEDNESDAY' : this.weekDays[i] == 'THU' ? 'THURSDAY' : this.weekDays[i] == 'FRI' ? 'FRIDAY' : 'SATURDAY',
            isHoliday: formData.businessAvailable247 == true || formData.businessTimings[i].isHoliday == true?  false : true,
            isAvalilable247: formData.businessAvailable247,
            storeTimings: businessstoreTimings
          }
          businessHoursarray.push(body);
        }
      }
      if(formData.delivery == true){
        this.DeliveryHours = false;
      } 
      if(formData.deliveryAvailabe247 == true){
        this.DeliveryHours = true;
      }
      if (formData.deliveryTimings.length != 0) {
        for (let i = 0; i < formData.deliveryTimings.length; i++) {
          let deliverystoreTimings = [];
          let timeBody: any;
          timeBody = {
            openTime: formData.deliveryTimings[i].openTime != '' ? moment(formData.deliveryTimings[i].openTime).format('HH:mm') : '',
            closeTime: formData.deliveryTimings[i].closeTime != '' ? moment(formData.deliveryTimings[i].closeTime).format('HH:mm') : ''
          }
          if(formData.deliveryTimings[i].openTime != '' && formData.deliveryTimings[i].closeTime != ''){
            this.DeliveryHours=true;
          }
          deliverystoreTimings.push(timeBody);
          for (let j = 0; j < formData.deliveryTimings[i].addDeliveryTimings.length; j++) {
            timeBody = {
              openTime: formData.deliveryTimings[i].addDeliveryTimings[j].openTime != '' ? moment(formData.deliveryTimings[i].addDeliveryTimings[j].openTime).format('HH:mm') : '',
              closeTime: formData.deliveryTimings[i].addDeliveryTimings[j].closeTime != '' ? moment(formData.deliveryTimings[i].addDeliveryTimings[j].closeTime).format('HH:mm') : ''
            }
            deliverystoreTimings.push(timeBody);
            if(formData.deliveryTimings[i].addDeliveryTimings[j].openTime!= '' && formData.deliveryTimings[i].addDeliveryTimings[j].closeTime != ''){
              this.DeliveryHours=true;
            }
          }

          let body = {
            day: this.weekDays[i] == 'SUN' ? 'SUNDAY' : this.weekDays[i] == 'MON' ? 'MONDAY' : this.weekDays[i] == 'TUE' ? 'TUESDAY' : this.weekDays[i] == 'WED' ? 'WEDNESDAY' : this.weekDays[i] == 'THU' ? 'THURSDAY' : this.weekDays[i] == 'FRI' ? 'FRIDAY' : 'SATURDAY',
            isHoliday: formData.deliveryAvailabe247 == true ? formData.deliveryTimings[i].isHoliday == false : formData.deliveryTimings[i].isHoliday,
            isAvalilable247: formData.deliveryAvailabe247,
            storeTimings: deliverystoreTimings
          }
          deliveryHoursarray.push(body);
        }
      }

      let storeService = null;
      if (this.brandType == "FB") {
        storeService = {
          pickUp: formData.pickUp,
          delivery: formData.delivery,
          deliveryRadius: formData.kms,
          deliveryAreaOids: selectedArear,
          dropInCar: formData.dropInCar,
          // shipping: formData.shipping,
          signingStore: formData.signingStore,
          sameBuildingDelivery:formData.sameBuildingDelivery ,
          driveThru:formData.driveThru,
          deliveryId:formData.deliveryId
        }
        this.amenitiesArr = this.selectedAminity.map(oid => oid.amenityOid);
      }

      if(this.DeliveryHours== true ){
        let launchDate='';
        let launchTime = '';
        if(formData.launchDate != '' || formData.launchDate != ''){
            launchDate=   moment(formData.launchDate).format('YYYY-MM-DD');
        }
        if(formData.launchTime != '' ){
            launchTime = moment(formData.launchTime).format('HH:mm:ss')
        }
      let request = {
        storeTypes: formData.storeTypes,
        storeId: formData.storeId,
        status: this.statusValue,
        brandOid: this.brandId,
        countryOid: formData.country,
        cityOid: this.cityId,
        mallOid: this.mallId,
        currencyCode: formData.currencyCode,
        locationUrl: formData.googleMapUrl,
        latitude: formData.latitude,
        longitude: formData.longitude,
        // launchDate: formData.launchDate != null || formData.launchDate != '' ? moment(formData.launchDate).format('YYYY-MM-DD HH:mm:ss') : '',
        // launchDate: moment(formData.launchDate).format('DD/MM/YYYY') + ' ' + moment(formData.launchTime).format('HH:mm:ss'),
        // closingDate: moment(formData.closingDateCtrl).format('YYYY-MM-DD'),
        launchDate : launchDate+' '+launchTime,
        storeLocales: this.storeLocalesArr,
        amenitieOids: this.amenitiesArr,
        storeService: storeService,
        menuUrl: formData.menuUrl,
        storeImage: this.imagePathLogo,
        storeAdmin: {
          adminName: formData.adminName,
          phoneNumber: formData.phoneNumber,
          emailId: formData.emailId,
          employeeId: formData.employeId
        },
        storeContactPersons: this.personContactDetails,
        storeBeacons: [],
        staffs: [],
        businessHours: businessHoursarray,
        deliveryHours: deliveryHoursarray,
        // isAffliateStore: this.affiliateStoresVal
      }
      console.log(JSON.stringify(request))
      let CREATE_STORE = environment.APIEndpoint + "api/rpa/store/v1/create"
      this.http.postJson(CREATE_STORE, request)
        .subscribe((response) => {
          this.loading = false;
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Store details have been added successfully"
            }
          });
          sessionStorage.clear();
          this.router.navigate(['/search-store']);
        }
          , err => {
            this.loading = false;
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

    }else{
      this.loading = false;
      setTimeout(() => {
       
        this.DeliveryHours = false;
        this.DeliveryHours = true;
   
      }, 3000);

      
      
    }
  }

    }
  }
 
  public toggleStatus(event) {
    if (event.checked == true) {
      this.statusValue = 'ONLINE';
    } else {
      this.statusValue = 'OFFLINE';
    }

  }
  addBusinessHours(control) {
    control.addBusinessTimings.push(
      this.fb.group({
        openTime: ['',],
        closeTime: ['',]
      }))
  }

  addDeliveryHours(control) {
    control.addDeliveryTimings.push(
      this.fb.group({
        openTime: ['',],
        closeTime: ['',]
      }))
  }
  openTimeIndex;
  removeHours(contro, index, j,Value) {
    this.openTimeIndex = index;
    if(Value == 'DELIVERY'){
        const control = this.storeFormGroup.get('deliveryTimings') as FormArray;
        const addTime = control.at(index).get('addDeliveryTimings') as FormArray;
        addTime.removeAt(j);
    }else{
        const control = this.storeFormGroup.get('businessTimings') as FormArray;
        const addTime = control.at(index).get('addBusinessTimings') as FormArray;
        addTime.removeAt(j);
    }

    }

  removeDeliveryHours(dhmsg: string) {
    this.deliveryHours.splice(this.deliveryHours.indexOf(dhmsg), 1);
  }

  storeAmenitiesDialog() {
    const dialogRef = this.dialog.open(storeAmenitiesDialog);
    dialogRef.componentInstance.selectedAminity = this.selectedAminity;
    dialogRef.afterClosed().subscribe(result => {
      this.selectedAminity = result;
    });
  }

  // areaMappingDialog() {
  //   const dialogRef = this.dialog.open(AreaMappingDialog);
  //   dialogRef.componentInstance.selectedArea = this.selectedDeliveryArea;
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.selectedDeliveryArea = result
  //   })
  // }
  areaMappingCountry;
  areaMappingCity;
  areaMappingError=false;
  areaMappingDialog() {

  if(this.storeFormGroup.get('country').value != '' && this.cityCtrl.status == 'VALID' && this.areaMappingError == false){
    console.log(this.cityCtrl)
  let cityID = [this.cityId];
 
  let formValue = this.storeFormGroup.value;
  this.areaMappingCountry = formValue.country;
  this.areaMappingCity = cityID;

    const dialogRef = this.dialog.open(AreaMappingDialog);
    dialogRef.componentInstance.selectedArea = this.selectedDeliveryArea;
    // dialogRef.componentInstance.brandID = this.brandOid;
    dialogRef.componentInstance.countryId =  this.areaMappingCountry,
    dialogRef.componentInstance.cityID = this.areaMappingCity
    dialogRef.afterClosed().subscribe(result => {
        console.log(result);

        if (result.buttonName == "SELECT") {
          this.selectedDeliveryArea = [];
          let selectedCount = result.tableData.length;
          if (selectedCount !== 0) {
            for (let i = 0; i < result.tableData.length; i++) {                 
              this.selectedDeliveryArea.push(result.tableData[i]);
            }
          } 
        }
       else{
            this.selectedDeliveryArea= this.selectedDeliveryArea;
        }
        
    })
  }else{
    this.areaMappingError=true;
  }
}

  removeArea(deliveryArea) {
    for (let i = 0; i < this.selectedDeliveryArea.length; i++) {
      if (this.selectedDeliveryArea[i].deliveryAreaOid == deliveryArea.deliveryAreaOid) {
        this.selectedDeliveryArea.splice(i, 1);
      }
    }
  }

  storeConatctDialog() {
    const dialogRef = this.dialog.open(storeContactDialog);
    dialogRef.afterClosed().subscribe(result => {
      this.contactsErrorMsg = false;
      if (result != undefined)
        this.personContactDetails.push(result);
    });

  }
  public uploadImage(event: FileList, i) {
    if (event[0].size < 1000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'brandCategory', 'images')
          .subscribe((response) => {
            this.imagePath[i] = response['message'];
            this.uploadError[i] = false;
            this.uploadFlag[i] = true;
            this.uploadElRef.nativeElement.value = ''
            this.snackBar.openFromComponent(SnackBarComponent, {
              duration: 1500,
              data: {
                status: "success",
                message: " image successfully uploaded"
              }
            });
          }, err => {
            this.loading = false;
            if (err.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Supported format is JPG, JPEG and PNG"
                }
              });
            } else {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: "Internal server error"
                }
              });
            }

          }
          )
      }
      else {
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
  public uploadFullImage(event: FileList, i) {
    if (event[0].size < 5000000) {
      if (event[0].type == "image/jpeg" || event[0].type == "image/png" || event[0].type == "image/PNG" || event[0].type == "image/jpg" || event[0].type == "image/JPG"
        || event[0].type == "image/JPEG" || event[0].type == "image/Jpg" || event[0].type == "image/Jpeg" || event[0].type == "image/Png") {
        this.uploadFile.upload(event.item(0), 'store360', 'images')
          .subscribe((response) => {
            this.fullImagePath[i] = response['message'];
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
          }
          )
      }
      else {
        this.fullImagePath[i] = '';
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Supported format is JPG, JPEG and PNG"
          }
        });
      }
    } else {
      this.fullImagePath[i] = '';
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 5Mb"
        }
      });
    }
  }

  public removeImage(index) {
    this.imagePath[index] = "";
    this.uploadFlag[index] = false;
    const control = this.storeFormGroup.get('storeLocales') as FormArray;
    control.at(index).get('storeImage').setValue('');
  }

  public removeStoreImage(index) {
    this.fullImagePath[index] = "";
    this.storeImgFlag[index] = false;
    const control = this.storeFormGroup.get('storeLocales') as FormArray;
    control.at(index).get('store360Image').setValue('');
  }

  checkValidationOnDelivery(delivery) {
    if (delivery == true) {
      this.orderServiceType = "Radius";
      this.orderService = true;
    } else {
      this.orderServiceType = "";
      this.selectedDeliveryArea = [];
      this.orderService = false;
    }
  }

  public cloneTime(formData: any) {
    const control = this.storeFormGroup.get('businessTimings') as FormArray;
    for (let i = 0; i < formData.businessTimings.length; i++) {
      if (i != 0) {
        control.at(i).get('openTime').patchValue(formData.businessTimings[0].openTime);
        control.at(i).get('closeTime').patchValue(formData.businessTimings[0].closeTime);
        control.at(i).get('isHoliday').patchValue(formData.businessTimings[0].isHoliday);
        for (let i = 0; i < formData.businessTimings.length; i++) {
              if (formData.businessTimings[i].addBusinessTimings.length != 0 ) {
                  let addBT = formData.businessTimings[0].addBusinessTimings;
                  for (let i = 0; i < formData.businessTimings.length; i++) {
                      this.removeBusinessTiming(control.at(i).get('addBusinessTimings'));
                  }

                  for (let j = 0; j < formData.businessTimings[i].addBusinessTimings.length; j++) {
                      for (let k = 0; k < formData.businessTimings.length; k++) {
                          const addTime = control.at(k).get('addBusinessTimings') as FormArray;
                          this.addBusinessTime(addTime, addBT[j].openTime, addBT[j].closeTime);
                      }
                  }
          }
      }
      }
    }

    const control1 = this.storeFormGroup.get('deliveryTimings') as FormArray;
    for (let i = 0; i < formData.deliveryTimings.length; i++) {
      if (i != 0) {
        control1.at(i).get('openTime').patchValue(formData.deliveryTimings[0].openTime);
        control1.at(i).get('closeTime').patchValue(formData.deliveryTimings[0].closeTime);
        control1.at(i).get('isHoliday').patchValue(formData.deliveryTimings[0].isHoliday);
        for (let i = 0; i < formData.deliveryTimings.length; i++) {
          if (formData.deliveryTimings[i].addDeliveryTimings.length != 0 ) {
              let addDT = formData.deliveryTimings[0].addDeliveryTimings;
              for (let i = 0; i < formData.deliveryTimings.length; i++) {
                  this.removeBusinessTiming(control1.at(i).get('addDeliveryTimings'));
              }

              for (let j = 0; j < formData.deliveryTimings[i].addDeliveryTimings.length; j++) {
                  for (let k = 0; k < formData.deliveryTimings.length; k++) {
                      const addTime = control1.at(k).get('addDeliveryTimings') as FormArray;
                      this.addDeliveryTime(addTime, addDT[j].openTime, addDT[j].closeTime);
                  }
              }
      }
  }
      }
    }

  }

  addBusinessTime(control, openTime, closeTime) {
    control.push(
      this.fb.group({
        openTime: [openTime, Validators.compose([Validators.required])],
        closeTime: [closeTime, Validators.compose([Validators.required])]
      }))
  }

  addDeliveryTime(control, openTime, closeTime) {
    control.push(
      this.fb.group({
        openTime: [openTime, Validators.compose([Validators.required])],
        closeTime: [closeTime, Validators.compose([Validators.required])]
      }))
  }

  removeBusinessTiming(control) {
    while (control.length) {
      control.removeAt(control.length - 1);
    }
    return true;
  }
  // getAllaffiliateStore(value){
  //   console.log(value);
  //   this.affiliateStoresVal = value;
  // }
}
