import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatDialog, MatSnackBar, MatDialogConfig } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, NgForm, FormGroupDirective, FormArray, } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { UploadFile } from 'src/app/services/uploadFile.service';
import { storeContactDialog } from 'src/app/shared/components/store-contact-dialog/store-contact.component';
import * as moment from 'moment';
import { storeAmenitiesDialog } from '../../store-amenities-dialog/store-amenites.component';
import { AreaMappingDialog } from '../../area-mapping-dialog/area-mapping.component';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import { DeliveryPopupComponent } from '../delivery-popup/delivery-popup.component';
import { ExtraValidators } from 'src/app/services/validator-service';
import { EditStoreContactDialog } from 'src/app/shared/components/edit-store-contact/edit-store-contact.component';
export interface Brand {
    brandId: number;
    brandName: string;
}

export interface City {
    cityId: string;
    cityName: string;
}

export interface Mall {
    mallId: number;
    mallName: string;
}

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
export interface PeriodicElement {
    name: string;
    weight: number;
    symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
    { name: 'Monday', weight: 1.0079, symbol: 'H' },
    { name: 'Tuesday', weight: 4.0026, symbol: 'He' },
    { name: 'Wednesday', weight: 6.941, symbol: 'Li' },
    { name: 'Thursday', weight: 9.0122, symbol: 'Be' },
    { name: 'Friday', weight: 10.811, symbol: 'B' },
    { name: 'Saturday', weight: 12.0107, symbol: 'C' },
    { name: 'Sunday', weight: 14.0067, symbol: 'N' },

];

@Component({
    selector: 'edit-store',
    templateUrl: './edit-store.component.html',
    styleUrls: ['./edit-store.component.scss']
})
export class EditStoreComponent implements OnInit {
    public breadCrumbData: Array<Object> = [{
        title: 'Configurations',
        link: '/login'
    }, {
        title: 'Store Management',
        link: '/search-user'
    },];
    public prePopulateCityId;
    public cityList;
    Cities: City[] = [];
    cityCtrl = new FormControl();
    filteredCities: Observable<City[]>;

    brandList;
    Brands: Brand[] = [];
    brandCtrl = new FormControl();
    filteredbrands: Observable<Brand[]>;

    public mallList;
    Malls: Mall[] = [];
    mallCtrl = new FormControl();
    filteredMalls: Observable<Mall[]>;
    public prePopulateBrandId;

    // public affiliateStores = [{
    //     name: 'Yes',
    //     value: 'YES'
    // },
    // {
    //     name: 'No',
    //     value: 'NO'
    // }
    // ];

    @ViewChild('dt2') dt2: ElementRef;
    storeFormGroup: FormGroup;
    public showNotification: boolean;
    public storeId;
    public imgUpload = false;
    public imgUpload360 = false;
    public minDate: Date = new Date();
    public imgUploadArabic = false;
    public filePathUrl = localStorage.getItem("imgBaseUrl");
    public countries: any = [];
    public showCountryError: boolean = false;
    public statusValue: string;
    public toggleVal: boolean = true;
    public uploadError = [];
    public loading = false;
    public cities: any = [];
    // public brandList = [];
    // public mallList = [];
    public currency = '';
    public amenitiesArr = [];
    public storeLocalesArr = [];
    public personContactDetails = [];
    public selectedPersonContactDetails = [];
    public amenitiesErrorMsg = false;
    public keywordErrorMsg = false;
    public keywordEmptyErrors = [];
    public timee = ""
    public languageList = JSON.parse(localStorage.getItem("languageList"));
    public storeDetails: any = [];
    public storeTimings = [];
    public buildStoreLocale = false;
    public buildStoreTime = false;
    public showError = false;
    public storeBeaconArray = [];
    public storeStaffArray = [];
    public imageUploading = false;
    public imageUploadingLogo: boolean = false;
    public uploadFlag = [];
    public imagePath = [];
    public alignCss = [];
    public kmsError = false;
    public contactsErrorMsg = false;
    public keywordArray = [];
    public buildFlag = false;
    public fullImagePath = [];
    public storeImgFlag = [];
    public newContactCss = [];
    public contactCss = [];
    public selectedAminity = [];
    public storeLocaleArray = [];
    public selectedDeliveryArea = [];
    public editedPersonContactDetails = [];
    @ViewChild('uploadEl') uploadElRef: ElementRef;
    @ViewChild('uploadImgEl') uploadImgEl: ElementRef;
    businessHours = [];
    deliveryHours = [];
    public imagePathLogo: string = '';
    public orderServiceType;
    public holidayType;
    public brandType;
    public orderService = false;
    public festivalWeekDays = [];
    public requiredKeywordError = [];
    languageDirection = [];
    public showImageErrorLogo: boolean = false;
    imageErrMsgLogo: string;


    public daysArray = [
        { name: 'Monday' },
        { name: 'Tuesday' },
        { name: 'Wednesday' },
        { name: 'Thursday' },
        { name: 'Friday' },
        { name: 'Saturday' },
        { name: 'Sunday' },

    ]
   
    public weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    public key;
    countryId: any;
    brandId: any;
    mallId: any;
    populateMallId: any;
    cityId: any;
    showCityError: boolean;
    cityCtrlKey: any;
    mallCtrlKey: any;

    StoreTypeList = [];
    StoreTypeList1 = [];
    // affiliateStoresVal: any;
    DeliveryHours = true;
    OldDeliveryStatus;
    personName: any;
    personPhoneNumer: any;
    personEmployeeId: any;
    personEmailId: any;
    editedPersonName: any;
    editedPersonPhoneNumer;
    editedPersonEmployeeId;
    editedPersonEmailId;
    contactDetailName = [];
    busHrs: boolean;
    delHrs: boolean;
    constructor(private fb: FormBuilder, private http: HttpService,
        private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar,
        private activatedRoute: ActivatedRoute, private uploadFile: UploadFile, ) {

        // this.activatedRoute.params.subscribe((params) => {
        //     this.storeId = params.id;

        // });

    }
    displayedColumns: string[] = ['select', 'name', 'weight', 'symbol'];
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    selection = new SelectionModel<PeriodicElement>(true, []);

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    // baseUrl: any = '';
    // storeImage(event) {
    //     if (event.target.files && event.target.files[0]) {
    //         this.imgUpload = true;
    //         var reader = new FileReader();
    //         reader.readAsDataURL(event.target.files[0]);
    //         reader.onload = (event) => {
    //             this.baseUrl = <string>reader.result;

    //         }
    //     }
    // }
    
    //keywords chips
    keywords: Keyword[] = [];

    addKeyword(event: MatChipInputEvent, index): void {
        const input = event.input;
        const value = event.value;

        let regex = /^[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*$/;
        if (value != '') {
            let valid = value.match(regex)
            if (!valid) {
                //this.keywordErrorMsg[index] = true;
            } else {
                //this.keywordErrorMsg[index] = false;
                if ((value || '').trim()) {
                    this.keywordArray[index].keyword.push(value.trim());
                    this.requiredKeywordError[index] = false;
                    this.keywordEmptyErrors[index] = false;
                }
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
  
    ngOnInit() {
        console.log(this.editedPersonContactDetails);
        let data = localStorage.getItem('StoreEditID');
        if (data) {
            this.storeId = data;
            this.getStoreDetails();
            localStorage.removeItem('StoreEditID')
        } else {
            sessionStorage.clear();
            this.router.navigate(['/search-store'])
        }

    }
    removeDuplicatesJSON(originalArray, prop) {
        var newArray = [];
        var lookupObject = {};
        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    }
    getStoreListData() {
        let StoreTypeList = environment.APIEndpoint + "api/rpa/store/v1/get/storeTypes";
        this.http.getJson(StoreTypeList)
            .subscribe((response) => {
                this.StoreTypeList = response;
                this.StoreTypeList.forEach(res => {
                    this.StoreTypeList1.push({
                        "storeTypeOid": res.storeTypeOid,
                        "storeTypeValue": res.storeTypeValue,
                        "value": res.storeTypeOid

                    });
                })
            });
        var valuesArray = this.removeDuplicatesJSON(this.StoreTypeList1, 'storeTypeOid');
        this.StoreTypeList1 = valuesArray;
    }
    public removeContact(i) {
        this.personContactDetails.splice(i, 1);
    }


    public addBusinessTiming(control, storeTiming) {
        for (let i = 0; i < storeTiming.length; i++) {
            if (i != 0) {
                let editEndTime = new Date();
                if (storeTiming[i].closeTime != null) {
                    let e = storeTiming[i].closeTime.split(":");
                    editEndTime.setHours(e[0]);
                    editEndTime.setMinutes(e[1]);
                }
                let editStartTimes = new Date();
                if (storeTiming[i].openTime != null) {
                    let s = storeTiming[i].openTime.split(":");
                    editStartTimes.setHours(s[0]);
                    editStartTimes.setMinutes(s[1]);
                }
                const array = <FormArray>control.controls['addBusinessTimings'];
                let arr = this.fb.group({
                    openTime: [editStartTimes,],
                    closeTime: [editEndTime,],
                });
                array.push(arr);
            }
        }
    }

    public addDeliveryTiming(control, storeTiming) {
        for (let i = 0; i < storeTiming.length; i++) {
            if (i != 0) {
                let editStartTime = new Date();
                if (storeTiming[i].openTime != null) {
                    let s = storeTiming[i].openTime.split(":");
                    editStartTime.setHours(s[0]);
                    editStartTime.setMinutes(s[1]);
                }
                let editEndTime = new Date();
                if (storeTiming[i].closeTime != null) {
                    let e = storeTiming[i].closeTime.split(":");
                    editEndTime.setHours(e[0]);
                    editEndTime.setMinutes(e[1]);
                }
                const array = <FormArray>control.controls['addDeliveryTimings'];
                let arr = this.fb.group({
                    openTime: [editStartTime,],
                    closeTime: [editEndTime,],
                });
                array.push(arr);
            }
        }
    }

    public addStoreLocales(editData) {
        for (let i = 0; i < editData.storeLocales.length; i++) {
            const control = <FormArray>this.storeFormGroup.controls['storeLocales'];
            let newForm = this.fb.group({
                storeName: [editData.storeLocales[i].storeName, Validators.compose([Validators.required])],
                videoUrl: [editData.storeLocales[i].videoUrl, Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
                address: [editData.storeLocales[i].storeAddress, Validators.compose([Validators.required])],
                keywords: ['', Validators.pattern("^[A-Za-z ]{1,20}$")],
                storeImage: [],
                store360Image: [],
            });
            control.push(newForm);
            this.keywordArray.push({
                keyword: []
            });
            this.imagePath[i] = editData.storeLocales[i].storeImagePath;
            this.fullImagePath[i] = editData.storeLocales[i].store360ImagePath;
            this.imagePathLogo = editData.storeImage
            if (editData.storeLocales[i].storeImagePath != null) {
                this.uploadFlag[i] = true;
            }
            if (editData.storeLocales[i].storeKeywords != undefined) {
                for (let k of editData.storeLocales[i].storeKeywords) {
                    this.keywordArray[i].keyword.push(k);
                }
            }
        }
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
   
    getAllRegionBrands(prePopulateBrandId) {
        console.log(prePopulateBrandId);
        let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
        this.http.getJson(GET_ALL_ONLINE_BRANDS)
            .subscribe((response) => {
                this.Brands = [];
                this.brandList = response;

                for (let i = 0; i <= this.brandList.length - 1; i++) {
                    let objMallkey = {
                        brandId: this.brandList[i]['brandId'],
                        brandName: this.brandList[i]['brandName'],
                    }

                    this.Brands.push(objMallkey);
                }
                this.filteredbrands = this.brandCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
                    );

                for (let j = 0; j < this.Brands.length; j++) {
                    if (this.Brands[j].brandId == this.prePopulateBrandId) {
                        this.brandCtrl.setValue(this.Brands[j].brandName);
                    }
                }
            },
                (error) => {
                    console.log(error);
                });
    }
    private _filterBrands(value: string): Brand[] {
        const filterValue = value.toLowerCase();
        return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
    }


    getAllCountries(brandId) {
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
                console.log(response);
                this.storeFormGroup.patchValue({
                    latitude: response['lattitude'],
                    longitude: response['longitude']
                })
                // this.mallData= response;
            });
    }

    getAllMalls(cityId, populateMallId) {
        console.log(cityId);
        this.areaMappingError = false;
        this.mallList = [];
        this.Malls = [];
        this.mallId = '';
        this.mallCtrl.reset('');
        if (cityId == undefined || cityId == '') {
            this.showCityError = true;
        } else {
            let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/mall/v1/get/malls";
            this.http.getJson(GET_ALL_CITIES + "?cityIds=" + cityId)
                .subscribe((response) => {
                    this.mallList = [];
                    this.Malls = [];
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
                    for (let j = 0; j < this.Malls.length; j++) {
                        if (this.Malls[j].mallId == this.populateMallId) {
                            this.mallCtrl.setValue(this.Malls[j].mallName);
                        }
                    }
                },
                    (error) => {
                        console.log(error);
                    });
        }
    }

    private _filterMalls(value: string): Mall[] {
        const filterValue = value.toLowerCase();
        return this.Malls.filter(mall => mall.mallName.toLowerCase().indexOf(filterValue) === 0);
    }

    getStoreDetails() {
        let request = {
            storeOid: this.storeId
        }

        let GET_STORE_DETAILS = environment.APIEndpoint + "api/rpa/store/v1/view"
        this.http.postJson(GET_STORE_DETAILS, request)
            .subscribe((response) => {
                this.storeDetails = response;
                this.selectedAminity = response["amenities"];
                if (this.storeDetails['storeContactPersonDetails'] != "" && this.storeDetails['storeContactPersonDetails'] != undefined) {
                    for (let cont of this.storeDetails['storeContactPersonDetails'][0]['contactDetailLocales']) {
                        this.contactCss.push(cont.languageDirection == 'RTL' ? 'text-right' : '');
                        this.languageDirection.push(cont.languageDirection == 'RTL' ? 'direction' : '');
                    }
                }
                for (let l of this.storeDetails['storeLocales']) {
                    this.alignCss.push(l.languageDirection == 'RTL' ? 'text-right' : '');
                    this.languageDirection.push(l.languageDirection == 'RTL' ? 'direction' : '');
                    this.uploadFlag.push(false);
                    this.storeImgFlag.push(false);
                }

                for (let i = 0; i < this.storeDetails.storeLocales.length; i++) {
                    this.imagePath[i] = this.storeDetails.storeLocales[i].storeImagePath;
                    if (this.imagePath[i] != '')
                        this.uploadFlag[i] = true
                }
                for (let i = 0; i < this.storeDetails.storeLocales.length; i++) {
                    this.fullImagePath[i] = this.storeDetails.storeLocales[i].store360ImagePath;
                    if (this.fullImagePath[i] != '')
                        this.storeImgFlag[i] = true
                }
               
                for (let l of this.languageList) {
                    this.newContactCss.push(l.direction == 'RTL' ? 'text-right' : '');
                }

                if (response['storeContactPersonDetails'] != "" && response['storeContactPersonDetails'] != undefined) {
                    for (let personalDetails of response['storeContactPersonDetails']) {
                        this.personContactDetails.push({
                            personalDetails: personalDetails,
                            dataType: "EDIT"
                        });
                    }
                }
                this.statusValue = response["status"];
                this.toggleVal = response["status"] == 'ONLINE' ? true : false;
                this.beaconsAndStaffData();
                this.buildEditStoreForm(response);
                let brand: any = response['brand'];
                let country: any = response['country'];
                let city: any = response['city'];
                let mall: any = response['mall'];
                this.prePopulateBrandId = brand.brandOid;
                this.countryId = country.countryOid;
                this.prePopulateCityId = city.cityOid;
                this.populateMallId = mall.mallOid;
                this.getAllRegionBrands(this.prePopulateBrandId);
                this.getAllCountries(brand.brandOid);

                this.countryId = country.countryOid;
                this.prePopulateCityId = this.prePopulateCityId;

                this.getAllCities(this.countryId, this.prePopulateCityId);

                this.populateMallId = this.populateMallId;
                this.getAllMalls(this.prePopulateCityId, this.populateMallId);

            });
            this.getStoreListData();
    }

    count1=0;
    getAllcity(cityId) {
        this.count1++;
        this.areaMappingError == false;
        if(this.count1 >0){
            this.selectedDeliveryArea=[];
            this.count1--;
        }
        this.prePopulateCityId = cityId;
        console.log(this.cityId);
    }

    getAllBrand(brandId) {
        this.prePopulateBrandId = brandId;
        console.log(this.brandId);
    }

    getAllMall(mallId) {
        this.populateMallId = mallId;
        console.log(this.mallId);
    }

    public buildEditStoreForm(editData) {
        if (editData.length === 0) {
            let form = {
                 storeTypes: [""],
                storeId: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,15}$")])],
                country: ["", Validators.required],
                // affiliateStore: ["",Validators.required],
                googleMapUrl: ["", Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
                longitude: ["", Validators.compose([Validators.required, Validators.pattern('[0-9.\"&\'(),-:.?_]{1,50}$')])],
                latitude: ["", Validators.compose([Validators.required, Validators.pattern('[0-9.\"&\'(),-:?_]{1,50}$')])],
                launchDate: ["",],
                // closingDateCtrl: [''],
                launchTime: ["",],
                storeLocales: this.fb.array([]),
                adminName: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z ]{1,200}$")])],
                phoneNumber: ["", Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*")])],
                emailId: ["", Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
                employeId: ["", Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9\"&\'(),-:.?_ ]{1,20}$")])],
                storeTimings: this.fb.array([]),
                menuUrl:["" ,Validators.compose([Validators.maxLength(50),Validators.pattern("^[a-zA-Z0-9.-]{1,50}$")])],
                pickup: '',
                kms: ''
            }
            this.storeFormGroup = this.fb.group(form);
            this.keywordArray.push({
                keyword: []
            });
        } else {
            this.buildFlag = true;
            this.getAllCities(editData.country.countryOid, editData.city.cityOid);
            this.getAllMalls(editData.city.cityOid, editData.mall.mallOid);
            this.buildStoreLocale = true;
            this.brandType = editData.brand.brandType;
            this.buildStoreTime = true;
            let storeTypeOid;
            if (editData.storeTypes != null || editData.storeTypes != undefined) {
                storeTypeOid = editData.storeTypes.map(function (item) {
                    return item.storeTypeOid;
                })
            }

            // this.affiliateStoresVal = editData.isAffilicateStore;
            console.log(editData);

            let form = {
                 storeTypes: [storeTypeOid],
                storeId: [editData.storeId, Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9 ]{1,15}$")])],
                country: [editData.country.countryOid.toString(), Validators.required],
                city: [editData.city.cityOid, Validators.required],
                brandId: [editData.brand.brandOid, Validators.required],
                mall: [editData.mall.mallOid, Validators.required],
                googleMapUrl: [editData.locationUrl, Validators.compose([Validators.pattern("^(http(s)?)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$")])],
                longitude: [editData.longitude, Validators.compose([Validators.required, Validators.pattern('[0-9.\"&\'(),-:?_]{1,50}$')])],
                latitude: [editData.latitude, Validators.compose([Validators.required, Validators.pattern('[0-9.\"&\'(),-:?_]{1,50}$')])],
                // closingDateCtrl: [null != editData.closingDate ? new Date(editData.closingDate) : '',],
                launchDate: [ editData.launchDate ? new Date(editData.launchDate) : '',],
                launchTime: [editData.launchDate != null ? new Date(editData.launchDate) : '', Validators.compose([ExtraValidators.conditional(
                    group => this.storeFormGroup.get('launchDate').value !== '',
                    Validators.required
                    )])],
                //  launchTime: [null != editData.launchDate ? new Date(editData.launchDate) : '',Validators.compose([Validators.required, Validators.pattern("^[A-Za-z ]{1,200}$")])],
                // affiliateStore: [this.affiliateStoresVal],
                // launchDate: [null != editData.launchDate ? moment(editData.launchDate).format('DD/MM/YYYY') : '',],
                // launchTime: [null != editData.launchDate ? moment(editData.launchDate).format('HH:mm:ss') : '',] ,
                storeLocales: this.fb.array([]),
                currencyCode: [editData.currencyCode],
                adminName: [editData.storeAdmin.adminName, Validators.compose([Validators.required, Validators.pattern("^[A-Za-z ]{1,200}$")])],
                phoneNumber: [editData.storeAdmin.phoneNumber, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]{8,15}$")])],
                emailId: [editData.storeAdmin.emailId, Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")])],
                employeId: [editData.storeAdmin.employeeId, Validators.compose([Validators.required, Validators.pattern("^[A-Za-z0-9\"&\'(),-:.?_ ]{1,20}$")])],
                pickUp: [editData.storeService.pickup,],
                delivery: [editData.storeService.delivery],
                dropInCar: [editData.storeService.dropInCar],
                // shipping: [editData.storreService.shipping],
                signingStore: [editData.storeService.siningStore],
                sameBuildingDelivery: [editData.storeService.sameBuildingDelivery],
                driveThru: [editData.storeService.driveThru],
                kms: [editData.storeService.deliveryRadius],
                deliverAvailableDaily: false,
                businessAvailableDaily: false,
                businessTimings: this.fb.array([]),
                deliveryTimings: this.fb.array([]),
                menuUrl:[editData.menuUrl ,Validators.compose([Validators.maxLength(50),Validators.pattern("^[a-zA-Z0-9.-]{1,50}$")])],
                deliveryId:[editData.storeService.deliveryId, Validators.compose([Validators.pattern("^[A-Za-z0-9]*")])]
            }
            this.storeFormGroup = this.fb.group(form);
           
            if (editData.businessHours != null && editData.businessHours.length != 0) {
                for (let i = 0; i < editData.businessHours.length; i++) {
                    this.festivalWeekDays.push(editData.businessHours[i].day);
                    const control = <FormArray>this.storeFormGroup.controls['businessTimings'];
                    if (editData.businessHours[0].isAvalilable247) {
                        let hour = this.storeFormGroup.get('businessAvailableDaily')
                        hour.setValue(true);
                        hour.updateValueAndValidity();
                    }
                    if (editData.businessHours[i].isHoliday) {
                        let newForm = this.fb.group({
                            isHoliday: [false,],
                            openTime: ['',],
                            closeTime: ['',],
                            addBusinessTimings: this.fb.array([])
                        });
                        control.push(newForm);
                    } else if (editData.businessHours[i].isAvalilable247) {
                        let newForm = this.fb.group({
                            isHoliday: [editData.businessHours[i].isHoliday],
                            openTime: ['',],
                            closeTime: ['',],
                            addBusinessTimings: this.fb.array([])
                        });
                        control.push(newForm);
                    } else {
                        let editStartTime: any = '';
                        if (editData.businessHours[i].storeTimings[0].openTime != null && editData.businessHours[i].storeTimings[0].openTime != "") {
                            editStartTime = new Date();
                            let s = editData.businessHours[i].storeTimings[0].openTime.split(":");

                            editStartTime.setHours(s[0]);
                            editStartTime.setMinutes(s[1]);
                        }

                        let editEndTime: any = '';
                        if (editData.businessHours[i].storeTimings[0].closeTime != null && editData.businessHours[i].storeTimings[0].closeTime != "") {
                            editEndTime = new Date();
                            let e = editData.businessHours[i].storeTimings[0].closeTime.split(":");
                            editEndTime.setHours(e[0]);
                            editEndTime.setMinutes(e[1]);
                        }

                        let newForm = this.fb.group({
                            isHoliday: [true,],
                            openTime: [editStartTime,],
                            closeTime: [editEndTime,],
                            addBusinessTimings: this.fb.array([])
                        });
                        control.push(newForm);
                        this.addBusinessTiming(control.controls[i], editData.businessHours[i].storeTimings);
                    }
                }
            } else {
                for (let i = 0; i < this.weekDays.length; i++) {
                    const control = <FormArray>this.storeFormGroup.controls['businessTimings'];
                    let newForm = this.fb.group({
                        isHoliday: [true,],
                        openTime: ['',],
                        closeTime: ['',],
                        addBusinessTimings: new FormArray([])
                    });
                    control.push(newForm);
                }
            }

            if (editData.deliveryHours != null && editData.deliveryHours.length != 0) {
                for (let i = 0; i < editData.deliveryHours.length; i++) {
                    this.festivalWeekDays.push(editData.deliveryHours[i].day); 
                    const control = <FormArray>this.storeFormGroup.controls['deliveryTimings'];
                    if (editData.deliveryHours[0].isAvalilable247) {
                        let hour = this.storeFormGroup.get('deliverAvailableDaily');
                        hour.setValue(true)
                        hour.updateValueAndValidity();
                    }
                    if (editData.deliveryHours[i].isHoliday) {
                        let newForm = this.fb.group({
                            isHoliday: [false,],
                            openTime: ['',],
                            closeTime: ['',],
                            addDeliveryTimings: this.fb.array([])
                        });
                        control.push(newForm);
                    } else if (editData.deliveryHours[i].isAvalilable247) {
                        let newForm = this.fb.group({
                            isHoliday: [editData.deliveryHours[i].isHoliday,],
                            openTime: ['',],
                            closeTime: ['',],
                            addDeliveryTimings: this.fb.array([])
                        });
                        control.push(newForm);
                    } else {
                        let editStartTime;
                        if (editData.deliveryHours[i].storeTimings[0].openTime != null) {
                            editStartTime = new Date();
                            let s = editData.deliveryHours[i].storeTimings[0].openTime.split(":");
                            editStartTime.setHours(s[0]);
                            editStartTime.setMinutes(s[1]);
                        }
                        let editEndTime;
                        if (editData.deliveryHours[i].storeTimings[0].closeTime != null) {
                            editEndTime = new Date();
                            let e = editData.deliveryHours[i].storeTimings[0].closeTime.split(":");
                            editEndTime.setHours(e[0]);
                            editEndTime.setMinutes(e[1]);
                        }
                        let newForm = this.fb.group({
                            isHoliday: [true,],
                            openTime: [editStartTime,],
                            closeTime: [editEndTime,],
                            addDeliveryTimings: this.fb.array([])
                        });
                        control.push(newForm);
                        this.addDeliveryTiming(control.controls[i], editData.deliveryHours[i].storeTimings);
                    }
                }
            } else {
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

            this.storeFormGroup.get('city').setValidators([Validators.required]);
            this.storeFormGroup.get('city').updateValueAndValidity();
            this.storeFormGroup.get('mall').setValidators([Validators.required]);
            this.storeFormGroup.get('mall').updateValueAndValidity();
            this.addStoreLocales(editData);
            //Giving priority to AreaMapping
            if (editData.storeService != null) {
                this.selectedDeliveryArea = editData.storeService.deliveryAreas;
                this.OldDeliveryStatus = editData.storeService.delivery;
                if(editData.storeService.deliveryAreas!=null){
                    
                    if (editData.storeService.deliveryAreas.length > 0) {
                        this.orderServiceType = 'Area Mapping';
                        this.updateValidatiopn('Area Mapping');
                    } else if (editData.storeService.deliveryRadius != null) {
                        this.orderServiceType = 'Radius';
                        this.updateValidatiopn('Radius');
                        this.areaMappingError=false;
                    }
                }
            }
            if (editData.storeService.delivery == true) {
                this.orderService = true;
            } else {
                this.orderServiceType = "";
                this.selectedDeliveryArea = [];
                this.orderService = false;
            }
        }
        for (let i = 0; i < this.languageList.length; i++) {
            this.uploadFlag.push(false);
            this.storeImgFlag.push(false);
            this.uploadError.push(false);
            this.keywordEmptyErrors[i] = false;
            // this.imagePath.push('');
            // this.fullImagePath.push('');
        }
        //this.addStoreTimings();
    }

    public setBrandType(brandOid) {
        this.brandList.forEach(element => {
            if (element.brandId == brandOid) {
                this.brandType = element.brandType;
            }
        });
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
    count=0;
    getAllCities(countryId, prePopulateCityId) {
        console.log(countryId);
        this.areaMappingError == false;
        this.count++;
        if(this.count >2){
            this.selectedDeliveryArea=[];
            this.count--;
        }
        
        console.log(prePopulateCityId);
        this.cityList = [];
        this.Cities = [];
        this.cityCtrl.reset('');
        this.cityId = '';
        // this.mallId = '';
        this.mallCtrl.reset('');
        let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/cities";
        this.http.getJson(GET_ALL_CITIES + "?countryIds=" + countryId)
            .subscribe((response) => {
                // console.log(response);
                this.Cities = [];
                this.cityList = [];
                this.cityList = response;
                console.log(this.cityList);
                for (let i of this.countries) {
                    if (i.countryId == countryId) {
                      this.storeFormGroup.patchValue({
                        currencyCode: i.currencyCode
                      })
                    }
                  }

                for (let i = 0; i <= this.cityList.length - 1; i++) {
                    let objMallkey = {
                        cityId: this.cityList[i]['cityId'],
                        cityName: this.cityList[i]['cityName'],
                    }

                    this.Cities.push(objMallkey);
                }
                this.filteredCities = this.cityCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(city => city ? this._filtercities(city) : this.Cities.slice())
                    );
                console.log(this.prePopulateCityId);

                for (let j = 0; j < this.Cities.length; j++) {
                    if (this.Cities[j].cityId == this.prePopulateCityId) {
                        this.cityCtrl.setValue(this.Cities[j].cityName);
                    }
                }
            },
                (error) => {
                    console.log(error);
                });
    }
    private _filtercities(value: string): City[] {
        const filterValue = value.toLowerCase();
        return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
    }


updateStore(formData){
    
    if(this.brandType = 'FB'){
      if(formData.delivery == false){
          if(this.OldDeliveryStatus == true){
           this.openDialog();              
          }else{
            this.updateStoreInfo(formData)
          }
      }else{
          this.updateStoreInfo(formData)
      }
    }else{
        this.updateStoreInfo(formData);
    }
}
    updateStoreInfo(formData) {
        if(this.storeFormGroup.valid && this.cityCtrl.status == 'VALID' && this.mallCtrl.status == 'VALID' && this.brandCtrl.status == 'VALID'){
        console.log(this.storeFormGroup);
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

        if (this.storeFormGroup.invalid || this.contactsErrorMsg || keyWordError || imageInvalid ) {
            this.showError = true;
        } else {

            for (var i = 0; i < formData.storeLocales.length; i++) {
                let locale = {
                    languageOid: this.storeDetails['storeLocales'][i].languageOid,
                    videoUrl: formData.storeLocales[i].videoUrl,
                    storeImagePath: this.imagePath[i],
                    storeName: formData.storeLocales[i].storeName,
                    storeAddress: formData.storeLocales[i].address,
                    storeKeywords: this.keywordArray[i].keyword,
                    store360ImagePath: this.fullImagePath[i],
                }
                this.storeLocalesArr.push(locale);
            }

            let storeContactDetails = [];
            let businessHoursarray = [];
            let deliveryHoursarray = [];
           
             this.DeliveryHours = true;
   
            if (formData.businessTimings.length != 0) {
                for (let i = 0; i < formData.businessTimings.length; i++) {
                    let businessstoreTimings = [];
                    let timeBody: any;
                    if (formData.businessTimings[i].isHoliday) {
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
                    }
                    console.log(formData.businessAvailableDaily);
                    console.log(formData.businessTimings[i].isHoliday);
                 
                    // if (formData.businessAvailableDaily == checked) {
                        let hour = this.storeFormGroup.get('businessAvailableDaily');
                        console.log(hour);
                        hour.setValue(true);
                        hour.updateValueAndValidity();
                    // }
console.log(formData);
console.log(businessstoreTimings);
                    let body = {
                        day: this.weekDays[i] == 'SUN' ? 'SUNDAY' : this.weekDays[i] == 'MON' ? 'MONDAY' : this.weekDays[i] == 'TUE' ? 'TUESDAY' : this.weekDays[i] == 'WED' ? 'WEDNESDAY' : this.weekDays[i] == 'THU' ? 'THURSDAY' : this.weekDays[i] == 'FRI' ? 'FRIDAY' : 'SATURDAY',
                        isHoliday: formData.businessAvailableDaily == true || formData.businessTimings[i].isHoliday == true?  false : true,
                        isAvalilable247: formData.businessAvailableDaily,
                        storeTimings: businessstoreTimings
                    }
                    businessHoursarray.push(body);
                    console.log(businessHoursarray);
                }
            }
            if(formData.delivery == true){
                this.DeliveryHours = false;
              } 
              if(formData.deliverAvailableDaily == true){
                this.DeliveryHours = true;
              }
            if (formData.deliveryTimings.length != 0) {
                for (let i = 0; i < formData.deliveryTimings.length; i++) {
                    let deliverystoreTimings = [];
                    let timeBody: any;
                    if (formData.deliveryTimings[i].isHoliday) {
                        if (formData.deliveryTimings[i].openTime != null && formData.deliveryTimings[i].openTime != '' && formData.deliveryTimings[i].closeTime != null && formData.deliveryTimings[i].closeTime != '') {
                            this.DeliveryHours=true;
                            timeBody = {
                                openTime: moment(formData.deliveryTimings[i].openTime).format('HH:mm'),
                                closeTime: moment(formData.deliveryTimings[i].closeTime).format('HH:mm')
                            }
                        } else {
                            timeBody = {
                                openTime: '',
                                closeTime: ''
                            }
                        }
                        deliverystoreTimings.push(timeBody);
                     
                        for (let j = 0; j < formData.deliveryTimings[i].addDeliveryTimings.length; j++) {
                            if (formData.deliveryTimings[i].addDeliveryTimings[j].openTime != null && formData.deliveryTimings[i].addDeliveryTimings[j].openTime != '' && formData.deliveryTimings[i].addDeliveryTimings[j].closeTime != null && formData.deliveryTimings[i].addDeliveryTimings[j].closeTime != '') {
                                timeBody = {
                                    openTime: moment(formData.deliveryTimings[i].addDeliveryTimings[j].openTime).format('HH:mm'),
                                    closeTime: moment(formData.deliveryTimings[i].addDeliveryTimings[j].closeTime).format('HH:mm')
                                }
                                this.DeliveryHours=true;
                            } 
                            else {
                                timeBody = {
                                    openTime: '',
                                    closeTime: ''
                                }
                            }

                            deliverystoreTimings.push(timeBody);
                        }
                    }

                    console.log(formData.deliveryTimings[i].isHoliday);
                    console.log(formData.deliverAvailableDaily);
                    console.log(formData);
                    let body = {
                        day: this.weekDays[i] == 'SUN' ? 'SUNDAY' : this.weekDays[i] == 'MON' ? 'MONDAY' : this.weekDays[i] == 'TUE' ? 'TUESDAY' : this.weekDays[i] == 'WED' ? 'WEDNESDAY' : this.weekDays[i] == 'THU' ? 'THURSDAY' : this.weekDays[i] == 'FRI' ? 'FRIDAY' : 'SATURDAY',
                        isHoliday: formData.deliverAvailableDaily == true || formData.deliveryTimings[i].isHoliday == true?  false : true,
                        isAvalilable247: formData.deliverAvailableDaily,
                        storeTimings: deliverystoreTimings
                    }
                    deliveryHoursarray.push(body);
                }
            }

            for (let con of this.personContactDetails) {
                storeContactDetails.push(con.personalDetails)
            }
            let storeService = null;
            this.loading = true;
            if (this.brandType == "FB") {
                let selectedArear = this.selectedDeliveryArea.map(oid => oid.deliveryAreaOid);
                storeService = {
                    pickUp: formData.pickUp == null ? false : formData.pickUp,
                    delivery: formData.delivery == null ? false : formData.delivery,
                    deliveryRadius: formData.delivery == false ? null : formData.kms,
                    deliveryAreaOids: selectedArear,
                    dropInCar: formData.dropInCar == null ? false : formData.dropInCar,
                    signingStore: formData.signingStore == null ? false : formData.signingStore,
                    sameBuildingDelivery: formData.sameBuildingDelivery == null ? false : formData.sameBuildingDelivery,
                    driveThru: formData.driveThru == null ? false : formData.driveThru,
                    deliveryId:formData.deliveryId
                }
                this.amenitiesArr = this.selectedAminity.map(oid => oid.amenityOid);
            
            }
            if(this.DeliveryHours == true ){
                let launchDate='';
                let launchTime = '';
                if(formData.launchDate != '' || formData.launchDate != ''){
                    launchDate =   moment(formData.launchDate).format('YYYY-MM-DD');
                }
                if(formData.launchTime != '' ){
                    launchTime = moment(formData.launchTime).format('HH:mm:ss')
                }
            let request = {
                storeOid: this.storeId,
                 storeTypes: formData.storeTypes,
                storeId: formData.storeId,
                status: this.statusValue,
                brandOid: this.prePopulateBrandId,
                countryOid: formData.country,
                cityOid: this.prePopulateCityId,
                mallOid: this.populateMallId,
                currencyCode: formData.currencyCode,
                locationUrl: formData.googleMapUrl,
                latitude: formData.latitude,
                longitude: formData.longitude,
                 launchDate : launchDate+' '+launchTime,
                // launchDate: formData.launchDate != null || formData.launchDate != '' ? moment(formData.launchDate).format('YYYY-MM-DD') + ' ' + moment(formData.launchTime).format('HH:mm:ss') : '',
                storeLocales: this.storeLocalesArr,
                amenitieOids: this.amenitiesArr,
                storeService: storeService,
                menuUrl: formData.menuUrl,
                storeImage: this.imagePathLogo,
                // closingDate: formData.closingDateCtrl != null || formData.closingDateCtrl != '' ? moment(formData.closingDateCtrl).format('YYYY-MM-DD'):'',
                storeAdmin: {
                    adminName: formData.adminName,
                    phoneNumber: formData.phoneNumber,
                    emailId: formData.emailId,
                    employeeId: formData.employeId
                },
                storeContactPersons: storeContactDetails,
                storeBeacons: [],
                staffs: [],
                businessHours: businessHoursarray,
                deliveryHours: deliveryHoursarray,
                // isAffliateStore: this.affiliateStoresVal
            }
            console.log(JSON.stringify(request))
            let CREATE_STORE = environment.APIEndpoint + "api/rpa/store/v1/update"
            this.http.postJson(CREATE_STORE, request)
                .subscribe((response) => {
                    this.snackBar.openFromComponent(SnackBarComponent, {
                        duration: 10000,
                        data: {
                            status: "success",
                            message: "Store details have been updated successfully"
                        }
                    });
                    this.loading = false;
                    sessionStorage.clear();
                    this.router.navigate(['/search-store']);
                }
                    , err => {
                        this.loading = false;
                        console.log("error Status = " + err.error);
                        console.log("error Status = " + err.error.errorType);
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
    
    beaconsAndStaffData() {
        this.storeBeaconArray = [];
        this.storeStaffArray = [];
        if (this.storeDetails['storeBeacons'] != null) {
            for (let beacon of this.storeDetails['storeBeacons']) {
                let beacons = {
                    status: "ONLINE",
                    beaconId: beacon.beaconId,
                    beaconName: beacon.beaconName,
                    beaconCode: beacon.beaconCode,
                    majorId: beacon.majorId,
                    minorId: beacon.minorId,
                    description: beacon.description

                }
                this.storeBeaconArray.push(beacons);
            }
        }
        if (this.storeDetails['staffs'] != null) {
            this.storeStaffArray = this.storeDetails['staffs'].map(function (item) {
                return item.staffId;
            })
        }



    }
   
    public removeImage(index) {
        this.imagePath[index] = "";
        this.uploadFlag[index] = false;
        const control = this.storeFormGroup.get('storeLocales') as FormArray;
        control.at(index).get('storeImage').setValue('');
    }

    storeContactDialog() {
        const dialogRef = this.dialog.open(storeContactDialog);
        dialogRef.afterClosed().subscribe(result => {
            this.contactsErrorMsg = false;
            if (result != undefined) {
                this.personContactDetails.push({
                    personalDetails: result,
                    dataType: "NEW"
                });
            }
        });
    }

   

    editContactDialog(contactDetails,i,j) {
        console.log(i);
        console.log(j)
        let editIndex = i;
        console.log(editIndex);
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          editIndex: i,
        }
           dialogConfig.autoFocus = false;

        this.selectedPersonContactDetails = contactDetails['personalDetails'];
        this.personName = this.selectedPersonContactDetails['contactDetailLocales'];
        this.personPhoneNumer = contactDetails['personalDetails'].phoneNumber;
        this.personEmployeeId = contactDetails['personalDetails'].employeeId;
        this.personEmailId = contactDetails['personalDetails'].emailId;
        const dialogRef = this.dialog.open(EditStoreContactDialog);
        dialogRef.componentInstance.personContactDetails = this.selectedPersonContactDetails;
        dialogRef.componentInstance.personName = this.personName;
        dialogRef.componentInstance.personPhoneNumber = this.personPhoneNumer;
        dialogRef.componentInstance.personEmployeeId = this.personEmployeeId;
        dialogRef.componentInstance.personEmailId = this.personEmailId;
        dialogRef.componentInstance.editIndex = editIndex;

        console.log(this.selectedPersonContactDetails);
        dialogRef.afterClosed().subscribe(result => {
            // this.personContactDetails = [];
            // this.personContactDetails.splice(i, 1);
            this.contactsErrorMsg = false;
            this.editedPersonContactDetails = result;
            console.log(result.editIndex);
            if(i == result.editIndex){
                console.log(editIndex);
                this.personContactDetails.splice(i, 1);
               //this.personContactDetails = [];
            if (result != undefined) {
                this.personContactDetails.push({
                    personalDetails: result,
                    dataType: "EDIT"
                });
            }
        }
        });
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
                openTime: ['', Validators.compose([Validators.required])],
                closeTime: ['', Validators.compose([Validators.required])]
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
    // selectedDeliveryAreaID;
    areaMappingCountry;
  areaMappingCity;
  areaMappingError=false;
  areaMappingDialog() {

  if(this.storeFormGroup.get('country').value != '' && this.cityCtrl.status == 'VALID' && this.areaMappingError == false){
    console.log(this.cityCtrl)
  let cityID = [this.prePopulateCityId];
  let formValue = this.storeFormGroup.value;
  this.areaMappingCountry = formValue.country;
  this.areaMappingCity = cityID;

    const dialogRef = this.dialog.open(AreaMappingDialog);
    dialogRef.componentInstance.selectedArea = this.selectedDeliveryArea;
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

    //   areaMappingDialog() {
    //     const dialogRef = this.dialog.open(AreaMappingDialog);
    //     dialogRef.componentInstance.selectedArea = this.selectedDeliveryArea;
    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log(result);
    //         // this.selectedDeliveryArea = [];
    //         // this.selectedDeliveryAreaID = [];
    //         if (result.buttonName === "SELECT") {
    //           this.selectedDeliveryArea = [];
    //         //   this.selectedDeliveryAreaID = [];
    //           let selectedCount = result.tableData.length;
    //           if (selectedCount !== 0) {
    //             for (let i = 0; i < result.tableData.length; i++) {                 
    //               this.selectedDeliveryArea.push(result.tableData[i]);
    //             //   this.selectedDeliveryAreaID.push(result.tableData[i]['deliveryAreaOid'])
    //             }
    //           } 
    //         }
    //        else{
    //             this.selectedDeliveryArea= this.selectedDeliveryArea;
    //             // this.selectedDeliveryAreaID =  this.selectedDeliveryAreaID;
    //         }
            
    //     })
    // }

    removeArea(deliveryArea) {
        for (let i = 0; i < this.selectedDeliveryArea.length; i++) {
          if (this.selectedDeliveryArea[i].deliveryAreaOid == deliveryArea.deliveryAreaOid) {
            this.selectedDeliveryArea.splice(i, 1);
          }
        }
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
    // getAllaffiliateStore(value) {
    //     console.log(value);
    //     this.affiliateStoresVal = value;
    // }

    openDialog(){
        const dialogRef = this.dialog.open(DeliveryPopupComponent);
        // dialogRef.componentInstance.selectedArea = this.selectedDeliveryArea;
        dialogRef.afterClosed().subscribe(result => {
            if(result == 'Proceed'){    
                this.updateStoreInfo(this.storeFormGroup.value)
            } 
        })
    }
}