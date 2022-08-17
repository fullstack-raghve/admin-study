import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { KioskSelectedUserComponent } from "../../kiosk-selected-user/kiosk-selected-user.component";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { SelectedFeedbackFlowComponent } from "../../selected-feedback-flow/selected-feedback-flow.component";
import { UploadFile } from 'src/app/services/uploadFile.service';
import { GenerateQrCodeComponent } from '../../generate-qr-code/generate-qr-code.component';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';


export interface Country {
  countryId: number;
  countryName: string;
}

export interface Brand {
  brandId: number;
  brandName: string;
}

export interface City {
  cityId: number;
  cityName: string;
}

export interface Mall {
  mallId: number;
  mallName: string;
}

export interface Store {
  storeId: number;
  storeName: string;
}

@Component({
  selector: "edit-kiosk",
  templateUrl: "./edit-kiosk.component.html",
  styleUrls: ["./edit-kiosk.component.scss"]
})
export class EditKioskComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    {
      title: "Home",
      link: ""
    },
    {
      title: "Feedback",
      link: ""
    }
  ];
  public toggleVal: boolean = true;
  public statusValue: string = "ONLINE";
  public headercolor;
  public footercolor;
  public bgcolor;
  public kioskId;
  public kioskData;
  public checked = false;
  public buildFlag: boolean = false;

  @ViewChild("editKioskForm") editKioskForm;
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  public searchKioskForm: FormGroup;
  countries: any[];
  languages;
  brandList;
  public brandId = "";
  public storeId;
  public countryId;
  stores: any;
  users;

  public flowCount = 1000;
  selectedUserId = [];
  selectedUser = [];
  selectedCount: number;
  storeErrorMsg: string;
  public loading: boolean = false;
  showError: boolean;
  public flows;
  selectable = true;
  removable = true;
  public paginationData;
  deviceStatus: string;
  showSelectedUser: boolean = false;
  bgColor: any;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  cities: any = [];
  public mallList: any = [];
  public storesList: any = [];
  @Input('brandOid') brandOid: number = 0;
  @Input('isDisabled') isDisabled: boolean = false;
  cityId: any;
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public kioskBrandLogoPath: any = '';
  public kioskDetails: any;
  public selectedStoreId: any;

  public prePopulateCountryId;
  Countries: Country[] = [];
  countryCtrl = new FormControl();
  filteredcountry: Observable<Country[]>;

  public prePopulateCityId;
  Cities: City[] = [];
  cityCtrl = new FormControl();
  filteredcities: Observable<City[]>;

  public prePopulateBrandId;
  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredbrands: Observable<Brand[]>;


  public prePopulateMallId;
  Malls: Mall[] = [];
  mallCtrl = new FormControl();
  filteredmalls: Observable<Mall[]>;

  public prePopulateStoreId;
  Stores: Store[] = [];
  storeCtrl = new FormControl();
  filteredstores: Observable<Store[]>;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private uploadFile: UploadFile,
    private https: HttpService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.kioskId = params.id;
    });
  }

  ngOnInit() {
    this.getLanguages();

    this.getkioskById();
    //this.getFlows(this.flowCount);
  }
  public toggleStatus(event) {
    if (event.checked === true) {
      this.statusValue = "ONLINE";
    } else {
      this.statusValue = "OFFLINE";
    }
  }
  buildKioskForm(editData) {
    console.log();
    this.buildFlag = true;
    this.deviceStatus = editData.deviceStatus === "Active" ? "ON" : "OFF";
    this.statusValue = editData.status;
    this.toggleVal = editData.status === "ONLINE" ? true : false;

    this.prePopulateCountryId = editData.countryId;
    this.prePopulateCityId = editData.cityId;
    this.prePopulateBrandId = editData.brandId;
    this.prePopulateMallId = editData.mallId;
    this.prePopulateStoreId = editData.storeId;

    this.searchKioskForm = this.fb.group({
      kioskName: [editData.deviceName, Validators.required],
      kioskdevice: [editData.deviceMake, Validators.required],
      kioskModelNumber: [editData.modelNumber],
      kioskDeviceIMEI: [editData.deviceIMEI, Validators.required],
      kioskDeviceTrackingId: [editData.deviceTrackingID, Validators.required],
      kioskDeviceStatus: [editData.deviceStatus, Validators.required],
      kioskCountry: [editData.countryId, Validators.required],
      kioskBrand: [editData.brandId, Validators.required],
      cityName: [editData.cityId],
      mall: [editData.mallId],
      kioskStore: [editData.storeId, Validators.required],
      kioskUserName: [editData.storeuserId],
      kioskMobileNumber: [editData.mobileNUmber],
      headerColor: [editData.headerColor],
      FooterColor: [editData.footerColor],
      backgroundColor: [editData.backgroundColor],
      language: [editData.languageId, Validators.required],
      // feedbackFlow: [editData.assignedFlowOid, Validators.required],
      idleTimeOut: [editData.idleTimeOut, Validators.required],
      finalPageDuration: [editData.finalPageDuration, Validators.required],
      sendEmail: [editData.sendEmailToCustomer],
      sendSms: [editData.sendSMSToCustomer],
      kisoktype: [editData.kiosktype, Validators.required]
    });
    this.getAllCountries(editData.countryId);
    this.getAllBrands(editData.countryId);
    this.getAllCities1(editData.countryId);
    this.getAllMalls(editData.brandId, editData.countryId, editData.cityId);
    this.getAllStores(editData.mallId,editData.brandId, editData.countryId, editData.cityId);
  }
  // getFlows(flowCount) {
  //   const data = {
  //     'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
  //     'pageSize': flowCount !== 10 ? flowCount : '10',
  //     'order': {
  //       'column': 'modifiedTime',
  //       'dir': 'asc'
  //     },
  //     'keySearch': '',
  //     'fieldSearch': [
  //     ]
  //   };
  //   this.https.postJson(environment.APIEndpoint + "api/rpa/feedback/flow/v1/search", data).subscribe(res => {
  //     this.flows = res["items"];
  //   }, err => {
  //     console.log(err)
  //   })

  //   const SEARCH_KIOSK = 'api/rpa/store/v1/getAll';
  //   this.https.postJson(environment.APIEndpoint + SEARCH_KIOSK, data).subscribe(res => {
  //     console.log(res);
  //     this.stores = res['items'];
  //   }, err => {
  //     console.log(err);
  //   });
  // }


  getAllBrands(ev) {
    // console.log(this.KioskForm.get('brands').value);
    this.selectedCityIdValue = ev;
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + this.selectedcountryIdValue;
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.Brands = [];
        this.brandList = response;

        for (let i = 0; i <= this.brandList.length - 1; i++) {
          let objMallkey = {
            brandId: this.brandList[i]['brandId'],
            brandName: this.brandList[i]['brandName'],
          }
          console.log(objMallkey);
          this.Brands.push(objMallkey);
        }
        this.filteredbrands = this.brandCtrl.valueChanges
          .pipe(
            startWith(''),
            map(brand => brand ? this._filterBrands(brand) : this.Brands.slice())
          );
        console.log(this.brandList['brandName']);
        console.log(this.brandList['brandId']);
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


  getAllCountries(ev) {
    let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/store/v1/get/storeRegions";
    this.https.getJson(GET_ALL_COUNTRIES)
      .subscribe((response) => {
        console.log(response);
        this.countries = response;

        for (let i = 0; i <= this.countries.length - 1; i++) {
          // this.Countries = [];
          let objMallkey = {
            countryId: this.countries[i]['countryId'],
            countryName: this.countries[i]['countryName'],
          }
          console.log(objMallkey);
          this.Countries.push(objMallkey);
        }
        this.filteredcountry = this.countryCtrl.valueChanges
          .pipe(
            startWith(''),
            map(country => country ? this._filterCountry(country) : this.Countries.slice())
          );
        console.log(this.countries['countryId']);
        console.log(this.countries['countryName']);
        for (let j = 0; j < this.Countries.length; j++) {
          if (this.Countries[j].countryId == this.prePopulateCountryId) {
            this.countryCtrl.setValue(this.Countries[j].countryName);
          }
        }

      })
  }

  private _filterCountry(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
  }

  public selectedcountryIdValue;
  getAllCities(ev) {
    console.log(ev);
    this.cities = [];
    this.mallList = [];
    this.storesList = [];
    this.brandList = [];
    this.selectedcountryIdValue = ev;

    this.cityCtrl.setValue("");
    this.cityCtrl.updateValueAndValidity();
    this.prePopulateCityId = "";

    
    this.mallCtrl.setValue("");
    this.mallCtrl.updateValueAndValidity();
    this.prePopulateMallId = "";
    
    this.brandCtrl.setValue("");
    this.brandCtrl.updateValueAndValidity();
    this.prePopulateBrandId = "";

    this.storeCtrl.setValue("");
    this.storeCtrl.updateValueAndValidity();
    this.prePopulateStoreId = "";
    this.getAllCities1(this.selectedcountryIdValue);
    // this.getAllBrands(this.selectedcountryIdValue);
  }

  public selectedcityIdValue;
  getcityIdValue(ev) {
    console.log(ev);
    this.selectedcityIdValue = ev;
  }

  getAllCities1(countryId) {
    if (countryId != '' && countryId != null && countryId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
    this.https.getJson(GET_ALL_CITIES + '?countryIds=' + this.selectedcountryIdValue)
      .subscribe((response) => {
        this.Cities=[];
        console.log(response);
        this.cities = response;

        for (let i = 0; i <= this.cities.length - 1; i++) {
          let objMallkey = {
            cityId: this.cities[i]['cityId'],
            cityName: this.cities[i]['cityName'],
          }
          console.log(objMallkey);
          this.Cities.push(objMallkey);
        }
        this.filteredcities = this.cityCtrl.valueChanges
          .pipe(
            startWith(''),
            map(city => city ? this._filterCities(city) : this.Cities.slice())
          );
        console.log(this.cities['brandName']);
        console.log(this.cities['brandId']);
        for (let j = 0; j < this.Cities.length; j++) {
          if (this.Cities[j].cityId == this.prePopulateCityId) {
            this.cityCtrl.setValue(this.Cities[j].cityName);
          }
        }

      })
  }
  private _filterCities(value: string): City[] {
    const filterValue = value.toLowerCase();
    return this.Cities.filter(city => city.cityName.toLowerCase().indexOf(filterValue) === 0);
  }

  public brandIdValue;


  getAllMalls(brandId, countryId, cityId) {
    this.selecttedBrandId = brandId;
    console.log(this.selecttedBrandId);
    
    if (brandId != '' && brandId != null && brandId != undefined
      && countryId != '' && countryId != null && countryId != undefined
      && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledMall = false;
    } else {
      this.disabledMall = true;
    }
    let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
    this.https.getJson(GET_ALL_MALLS + "?brandOids=" + brandId + '&countryOids=' + this.selectedcountryIdValue + '&cityOids=' + this.selectedcityIdValue)
      .subscribe((response) => {
        this.Malls = [];
        console.log(response);
        this.mallList = response;

        for (let i = 0; i <= this.mallList.length - 1; i++) {
          let objMallkey = {
            mallId: this.mallList[i]['mallId'],
            mallName: this.mallList[i]['mallName'],
          }
          console.log(objMallkey);
          this.Malls.push(objMallkey);
        }
        this.filteredmalls = this.mallCtrl.valueChanges
          .pipe(
            startWith(''),
            map(mall => mall ? this._filterMalls(mall) : this.Malls.slice())
          );
        console.log(this.mallList['mallId']);
        console.log(this.mallList['mallName']);
        for (let j = 0; j < this.Malls.length; j++) {
          if (this.Malls[j].mallId == this.prePopulateMallId) {
            this.mallCtrl.setValue(this.Malls[j].mallName);
          }
        }

      },
        (error) => {
          console.log(error);
        });
  }

  private _filterMalls(value: string): Mall[] {
    const filterValue = value.toLowerCase();
    return this.Malls.filter(mall => mall.mallName.toLowerCase().indexOf(filterValue) === 0);
  }

  public selectedMallId;

  getAllStores(mallId,brandId, countryId, cityId) {
    console.log(mallId);
    this.selectedMallId = mallId;
    if (
      brandId != '' && brandId != null && brandId != undefined
      && countryId != '' && countryId != null && countryId != undefined
      && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledMall = false;
    }

    let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v1/getStoresByMallId"
    this.https.getJson(GET_ALL_STORES + "?brandOid=" + this.selecttedBrandId + '&countryOid=' + this.selectedcountryIdValue + '&cityOid=' + this.selectedcityIdValue + '&mallOid=' + this.selectedMallId)
      .subscribe(
        res => {
          console.log(res);
          console.log(res);
          this.Stores = [];
          this.storesList = res;

          for (let i = 0; i <= this.storesList.length - 1; i++) {
            let objMallkey = {
              storeId: this.storesList[i]['storeId'],
              storeName: this.storesList[i]['storeName'],
            }
            console.log(objMallkey);
            this.Stores.push(objMallkey);
          }
          this.filteredstores = this.storeCtrl.valueChanges
            .pipe(
              startWith(''),
              map(store => store ? this._filterStores(store) : this.Stores.slice())
            );
          console.log(this.storesList['storeId']);
          console.log(this.storesList['storeName']);
          for (let j = 0; j < this.Stores.length; j++) {
            if (this.Stores[j].storeId == this.prePopulateStoreId) {
              this.storeCtrl.setValue(this.Stores[j].storeName);
            }
          }

        },
        err => {
          console.log(err);
        }
      );
  }
  private _filterStores(value: string): Store[] {
    const filterValue = value.toLowerCase();
    return this.Stores.filter(store => store.storeName.toLowerCase().indexOf(filterValue) === 0);
  }

  // getBrandVal (ev){
  //   console.log(ev.brandId);
  //   this.brandIdValue = ev.brandId;
  //   this.getAllCountries(this.brandIdValue);
  // }
  public selecttedBrandId;

  getFlows(flowCount, brandId, countryId) {
    const data = {
      page:
        this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
      pageSize: flowCount !== 10 ? flowCount : "10",
      order: {
        column: "modifiedTime",
        dir: "asc"
      },
      keySearch: "",
      fieldSearch: [
        {
          fieldName: "kioskType",
          fieldValue: "YES"
        },
        {
          fieldName: "countryOid",
          fieldValue: countryId
        },
        {
          fieldName: "brandOid",
          fieldValue: brandId
        }
      ]
    };
    this.https
      .postJson(
        environment.APIEndpoint + "api/rpa/feedback/flow/v1/search",
        data
      )
      .subscribe(
        res => {
          this.flows = res["items"];
          console.log(this.flows);
        },
        err => {
          console.log(err);
        }
      );
  }

  Users() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      KioskSelectedUserComponent,
      dialogConfig
    );
    dialogRef.componentInstance.UserList = this.selectedUserId;
    dialogRef.afterClosed().subscribe(result => {
      this.selectedUserId = [];
      this.selectedUser = [];
      if (result.buttonName === "SELECT") {
        this.selectedUserId = [];
        this.selectedUser = [];
        this.selectedCount = result.tableData.length;
        if (this.selectedCount !== 0) {
          for (let i = 0; i < result.tableData.length; i++) {
            const userId = result.tableData[i].userId;
            this.selectedUserId.push(userId);
            this.selectedUser.push(result.tableData[i]);
          }
        } else {
          this.storeErrorMsg = "Please select User";
          console.log(this.storeErrorMsg);
        }
      }
    });
  }
  arrayObj = [];
  getkioskById() {
    this.selectedUserId = [];
    const GET_KIOSK_BY_ID =
      environment.APIEndpoint + "api/rpa/feedback/kiosk/v1/view";
    const request = {
      kioskId: this.kioskId
    };
    this.http.postJson(GET_KIOSK_BY_ID, request).subscribe(
      response => {
        this.selectedcountryIdValue = response["countryId"];
        this.prePopulateCountryId = response["countryId"];
        this.selectedcityIdValue = response["cityId"];
        this.buildKioskForm(response);
        console.log(response);
        this.countryId = response["countryId"];
        this.brandId = response["brandId"];
        this.storeId = response["storeId"];
        this.selectedStoreId = response["storeSpecId"]
        this.cityId = response["cityId"];
        this.kioskBrandLogoPath = response["headerImage"];
        // this.getAllCountries(this.brandId, 0);
        console.log(this.brandId, this.countryId, this.cityId);

        this.getAllMalls(this.brandId, this.countryId, this.cityId);
        // this.GetBrandOnCountry(this.countryId);
        this.getAllCities1(this.countryId);
        // this.getAllBrands(this.selectedcountryIdValue);
        this.getAllStores(this.brandId, this.selectedcountryIdValue, this.cityId, response["mallId"]);
        this.getFlows(this.flowCount, this.brandId, this.countryId);
        this.getUsersList(this.storeId, null);
        this.kioskData = response;
        for (const user of response["notifyUsers"]) {
          this.selectedUserId.push(user.userId);
          this.selectedUser.push(user);
        }
        for (const user of response["assignedFlows"]) {
          this.selectedFlows.push(user);
          this.selectedFlowsId.push(user.flowOid);
          this.arrayObj.push(user.flowOid);
        }
        console.log(this.selectedFlowsId);
        this.checked = response["status"] === "ONLINE" ? true : false;
      },
      err => {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 1500,
          data: {
            status: "failure",
            message:
              "Your request cannot be saved at this time. Please try again later"
          }
        });
        console.log("error Status = " + err.status);
      }
    );
  }

  getLanguages() {
    const language =
      environment.APIEndpoint + "api/rpa/master/language/v1/list";
    this.http.getJson(language).subscribe(
      response => {
        this.languages = response;
      },
      err => {
        console.log("error Status = " + err.status);
      }
    );
  }

  // selectCountry(countryId) {
  //   this.countryId = countryId.countryId;
  //   this.GetBrandOnCountry(this.countryId);
  //   this.getStores("", this.countryId);
  //   this.getFlows(this.flowCount, "", this.countryId);
  // }
  // selectBrand(brandId) {
  //   this.brandId = brandId.brandOid;
  //   this.getStores(this.brandId, this.countryId);
  //   this.getFlows(this.flowCount, this.brandId, "");
  // }

  removeuser(userdId) {
    const index = this.selectedUser.indexOf(userdId);
    const removedUserId = userdId.userId;
    const removedUserIdIndex = this.selectedUserId.indexOf(removedUserId);
    if (index > -1) {
      this.selectedUser.splice(index, 1);
      if (removedUserIdIndex > -1) {
        this.selectedUserId.splice(removedUserIdIndex, 1);
      }
    }
  }

  // getStores(brandId, countryId) {
  //   const data = {
  //     page: "0",
  //     pageSize: "1000",
  //     order: {
  //       column: "modifiedTime",
  //       dir: "desc"
  //     },
  //     keySearch: "",
  //     fieldSearch: [
  //       {
  //         fieldName: "brand.oid",
  //         fieldValue: brandId
  //       },
  //       {
  //         fieldName: "country.oid",
  //         fieldValue: countryId
  //       }
  //     ]
  //   };
  //   console.log(data);
  //   const SEARCH_STORE = "api/rpa/store/v1/search";
  //   this.http.postJson(environment.APIEndpoint + SEARCH_STORE, data).subscribe(
  //     res => {
  //       console.log(res);
  //       this.stores = res["items"];
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //   );
  // }

  // getAllCountries() {
  //   const GET_ALL_COUNTRIES =
  //     environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
  //   this.http.getJson(GET_ALL_COUNTRIES).subscribe(response => {
  //     console.log(response);
  //     this.countries = response;
  //   });
  // }

  getUsersList(storeId, store) {
    console.log(storeId);
    this.selectedStoreId = storeId;
    if (store != null) {
      this.selectedStoreId = store.storeSpecId;
    }
    this.http
      .getJson(
        environment.APIEndpoint + "api/rpa/store/v1/getStoreUsers/" + storeId
      )
      .subscribe(
        res => {
          console.log(res);
          console.log(res);
          this.users = res;
        },
        err => {
          console.log(err);
        }
      );
  }

  updateKiosk(formData) {
    this.showSelectedUser = true;
    // this.showSelectedFlow = true;
    console.log('existing flow', this.existingFlows);
    console.log(formData);
    if (this.searchKioskForm.invalid === true) {
      this.showError = false;
    }
    if (this.showSelectedUser && this.selectedUser.length === 0) {
      this.showSelectedUser = true;
    }
    else {
      console.log(formData.cityName);
      // console.log(this.editKioskForm.FormControl('cityCtrl').value);
      
      this.showSelectedUser = false;
      // this.showSelectedFlow = false;
      const updateKisokReq = {
        deviceId: this.kioskId,
        deviceName: formData.kioskName,
        deviceMake: formData.kioskdevice,
        modelNumber: formData.kioskModelNumber,
        deviceIMEI: formData.kioskDeviceIMEI,
        deviceTrackingID: formData.kioskDeviceTrackingId,
        deviceStatus: formData.kioskDeviceStatus,
        countryOid: this.selectedcountryIdValue,
        cityOid: this.selectedcityIdValue,
        mallOid: this.selectedMallId,
        storeId: this.selectedStoreId,
        headerImage: this.kioskBrandLogoPath,
        brandOid: this.selecttedBrandId,
        mobileNumber: formData.kioskMobileNumber,
        headerColor: formData.headerColor,
        footerColor: formData.FooterColor,
        backgroundColor: formData.backgroundColor,
        idleTimeout: formData.idleTimeOut,
        finalPageDuration: formData.finalPageDuration,
        sendEmailToCustomer: formData.sendEmail,
        sendSMSToCustomer: formData.sendSms,
        notifyUsers: this.selectedUserId,
        languageOid: formData.language,
        userId: formData.kioskUserName,
        assignedFlowOid: formData.feedbackFlow,
        status: this.toggleVal === true ? "ONLINE" : "OFFLINE",
        kioskType: formData.kisoktype,
        assignedFlows: this.selectedFlows,
        existingFlows: this.existingFlows.length == 0 ? [0] : this.existingFlows
      };
      console.log(updateKisokReq);
      const UPDATE_KIOSK =
        environment.APIEndpoint + "api/rpa/feedback/kiosk/v1/update";
      this.http.postJson(UPDATE_KIOSK, updateKisokReq).subscribe(
        response => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Kiosk has been updated successfully"
            }
          });
          this.loading = false;
          this.router.navigate(["/search-kiosk"]);
        },
        err => {
          this.loading = false;
          console.log("error Status = " + err);
          if (err.error.errorType === "VALIDATION") {
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
                message:
                  "Your request cannot be saved at this time. Please try again later"
              }
            });
          }
        }
      );
    }
  }
  // GetBrandOnCountry(CountryId) {
  //   console.log(CountryId);
  //   const data = {
  //     page: "0",
  //     pageSize: "1000",
  //     order: {
  //       column: "modifiedTime",
  //       dir: "desc"
  //     },
  //     keySearch: "",
  //     fieldSearch: [
  //       {
  //         fieldName: "countryOids",
  //         fieldValue: CountryId
  //       }
  //     ]
  //   };
  //   const SEARCH_BRANDS = "api/rpa/master/brand/v1/search";
  //   this.https
  //     .postJson(environment.APIEndpoint + SEARCH_BRANDS, data)
  //     .subscribe(
  //       res => {
  //         this.brandList = res["items"];
  //         console.log(this.brandList);
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );
  // }

  selectedFlowsId = [];
  selectedFlowsCount;
  selectFlowMessage;
  allassignedFlows = [];
  showSelectedFlow: boolean = false;
  public selectedFlows = [];
  clickSelectedFlow = false;
  selectedFlow(brandId, countryId) {
    this.clickSelectedFlow = true;
    let sendData = {
      brandId: brandId,
      countryId: countryId,
      selectedFlow: this.selectedFlows
    };
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      autoFocus: false,
      maxHeight: "100vh",
      data: sendData,
      maxWidth: "100%"
    };
    const dialogRef = this.dialog.open(
      SelectedFeedbackFlowComponent,
      dialogConfig
    );
    dialogRef.componentInstance.flowList = this.selectedFlowsId;
    console.log(this.selectedFlowsId);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.buttonName != "CANCEL") {
        this.selectedFlows.push(result);
        this.selectedFlowsId.push(result.flowOid);
      }
    });
  }

  public existingFlows = [];
  removeFlow(userdId, valueIndex) {
    for (var i = 0; i < this.selectedFlowsId.length; i++) {
      if (userdId.flowOid == this.arrayObj[i]) {
        this.existingFlows.push(userdId.flowMapId);
      }
    }
    console.log('selected flow', this.selectedFlows);
    console.log('existing flow id', this.existingFlows);
    this.selectedFlowsId.splice(valueIndex, 1);
    const index = this.selectedFlows.indexOf(userdId);
    this.selectedFlows.splice(index, 1);

    // if (this.selectedFlowsId.length == 0) {
    //   this.showSelectedFlow = true;
    // }
  }

  public selectedCityIdValue;
  // getAllBrands(ev) {
  //   console.log(ev);
  //   this.selectedCityIdValue = ev;
  //   // console.log(this.KioskForm.get('brands').value);

  //   let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + this.selectedcountryIdValue;
  //   this.https.getJson(GET_ALL_ONLINE_BRANDS)
  //     .subscribe((response) => {
  //       // console.log(response);
  //       this.brandList = response;
  //       console.log(this.brandList['brandName']);
  //       console.log(this.brandList['brandId']);
  //     },
  //       (error) => {
  //         console.log(error);
  //       });
  // }

 
  // getAllCountries(brandId, value) {
  //   if (value != 0) {
  //     this.searchKioskForm.patchValue({ kioskCountry: '', cityName: '', mall: '', kioskStore: '' })
  //     this.countries = [];
  //     this.cities = [];
  //     this.mallList = [];
  //     this.stores = [];
  //   }
  //   console.log(brandId != '' && brandId != null && brandId != undefined);
  //   if (brandId != '' && brandId != null && brandId != undefined) {
  //     this.disabledCountry = false;
  //   } else {
  //     this.disabledCountry = true;
  //     this.disabledCity = true;
  //     this.disabledMall = true;
  //     this.buildKioskForm(0);
  //     this.countries = [];
  //     this.cities = [];
  //     this.mallList = [];
  //   }
  //   let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regions";
  //   this.https.getJson(GET_ALL_COUNTRIES + '?brandOid=' + brandId)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.countries = response;

  //     })
  // }




  // image upload

  public uploadImage(event: FileList) {
    this.imageUploading = true;
    console.log("event[0].size" + event[0].size)
    if (event[0].size < 1000000) {
      this.uploadFile.upload(event.item(0), 'feedback', 'images')
        .subscribe((response) => {
          console.log(response);
          this.kioskBrandLogoPath = response['message'];
          this.imageUploading = false;
          this.showImageError = false;
          this.uploadImgElRef.nativeElement.value = ''

          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 1500,
            data: {
              status: "success",
              message: "Image successfully uploaded"
            }
          });


        }, err => {

          console.log("error Status = " + err);
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
                message: "Internal server error"
              }
            });
          }

        }
        );
    } else {
      this.imageUploading = false;
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 10000,
        data: {
          status: "failure",
          message: "Max upload file size is 1Mb"
        }
      });
    }


  }
  public removeImage() {
    this.kioskBrandLogoPath = "";
  }
  generateQrCode() {
    const dialogRef = this.dialog.open(GenerateQrCodeComponent);
    dialogRef.afterClosed().subscribe(result => {
      let request = {
        "scanId": result
      }
      if (request.scanId != '' && request.scanId != null) {
        let GET_KIOSK_DETAILS = environment.APIEndpoint + 'api/rpa/feedback/kiosk/v1/getKioskByScanId';
        this.http.postJson(GET_KIOSK_DETAILS, request).subscribe(
          (response) => {
            this.kioskDetails = response;
            console.log(this.kioskDetails);
            this.searchKioskForm.patchValue({ kioskDeviceIMEI: this.kioskDetails.deviceIMEI })
          },
          (error) => {
            if (error.error.errorType == 'VALIDATION') {
              this.snackBar.openFromComponent(SnackBarComponent, {
                duration: 10000,
                data: {
                  status: "failure",
                  message: error.error.errorDetails[0].description
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
            };
          }
        );
      } else {
        this.snackBar.openFromComponent(SnackBarComponent, {
          duration: 10000,
          data: {
            status: "failure",
            message: "Encrypted value is empty"
          }
        });
      }
    });
  }
}