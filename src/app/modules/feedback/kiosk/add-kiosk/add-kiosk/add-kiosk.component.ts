import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { MatDialogConfig, MatDialog, MatSnackBar } from "@angular/material";
import { KioskSelectedUserComponent } from "../../kiosk-selected-user/kiosk-selected-user.component";
import { FormBuilder, FormGroup, Validators,FormControl } from "@angular/forms";
import { HttpService } from "src/app/services/http-service";
import { environment } from "src/environments/environment";
import { SnackBarComponent } from "src/app/shared/components/snack-bar/snack-bar.component";
import { Router } from "@angular/router";
import { SelectedFeedbackFlowComponent } from "../../selected-feedback-flow/selected-feedback-flow.component";
import { UploadFile } from 'src/app/services/uploadFile.service';
import { GenerateQrCodeComponent } from '../../generate-qr-code/generate-qr-code.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


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
  selector: "add-kiosk",
  templateUrl: "./add-kiosk.component.html",
  styleUrls: ["./add-kiosk.component.scss"]
})
export class AddKioskComponent implements OnInit {
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



  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredbrands: Observable<Brand[]>;

  @ViewChild("createKioskForm") createKioskForm;
  @ViewChild('uploadImgEl') uploadImgElRef: ElementRef;
  public imgBaseUrl = localStorage.getItem("imgBaseUrl");
  public KioskForm: FormGroup;
  public toggleVal = true;
  public statusValue = "ONLINE";
  public headercolor;
  public footercolor;
  public bgcolor;
  public cities: any = [];
  public countries: any = [];
  removable = true;
  public brandId = "";
  countryId = "";
  stores;
  brandList;
  brands;
  users;
  selectable = true;
  public flowCount = 1000;
  languages;
  selectedUser = [];
  selectedUserId = [];
  selectedCount: number;
  storeErrorMsg: string;
  loading: boolean;
  showError: boolean = false;
  showSelectedUser: boolean = false;
  showSelectedFlow: boolean = false;
  public selectedFlows = [];
  public paginationData;
  public resultsLength = 0;
  public flows;
  bgColor: any;
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;
  mallList: any = [];
  @Input('brandOid') brandOid: number = 0;
  @Input('isDisabled') isDisabled: boolean = false;
  public storeList: any = [];
  public imageUploading: boolean = false;
  public showImageError: boolean = false;
  public kioskBrandLogoPath: any = '';
  public kioskDetails: any;
  public selectedStoreId;
  selectedBrandIdValue: any;
  disabledStores: boolean = false;

  public prePopulateCountryId;
  Countries: Country[] = [];
  countryCtrl = new FormControl();
  filteredcountry: Observable<Country[]>;

  public prePopulateCityId;
  Cities: City[] = [];
  cityCtrl = new FormControl();
  filteredcities: Observable<City[]>;

  public prePopulateMallId;
  Malls: Mall[] = [];
  mallCtrl = new FormControl();
  filteredmalls: Observable<Mall[]>;

  Stores: Store[] = [];
  storeCtrl = new FormControl();
  filteredstores: Observable<Store[]>;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public snackBar: MatSnackBar,
    private router: Router,
    private uploadFile: UploadFile,
    private https: HttpService
  ) { }

  ngOnInit() {
    this.buildKioskForm();
    // this.getAllBrands();
    // this.getStores("", "");
    this.getFlows(this.flowCount, "", "");
    // this.GetBrandOnCountry("");
    this.getAllCountries();
    this.getLanguages();
  }
  public toggleStatus(event) {
    if (event.checked === true) {
      this.statusValue = "ONLINE";
    } else {
      this.statusValue = "OFFLINE";
    }
  }
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

  selectedUsers() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(
      KioskSelectedUserComponent,
      dialogConfig
    );
    dialogRef.componentInstance.UserList = this.selectedUserId;
    console.log(this.selectedUserId);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      var getSelectedFlow = result.tableData.slice(-1)[0];
      console.log(getSelectedFlow);
      this.selectedUser = [];
      this.selectedUserId = [];
      if (result.buttonName === "SELECT") {
        this.selectedUser = [];
        this.selectedUserId = [];
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

  buildKioskForm() {
    this.KioskForm = this.fb.group({
      kioskName: ["", Validators.required],
      kioskdevice: ["", Validators.required],
      kioskModelNumber: ["", Validators.required],
      kioskDeviceIMEI: ["", Validators.required],
      kioskDeviceTrackingId: ["", Validators.required],
      kioskDeviceStatus: ["", Validators.required],
      // kioskCountry: ["", Validators.required],
      // kioskBrand: [""],
      // kioskStore: ["", Validators.required],
      kioskUserName: ["", Validators],
      kioskMobileNumber: [""],
      headerColor: [""],
      FooterColor: [""],
      backgroundColor: [""],
      language: ["", Validators.required],
      // feedbackFlow: ["", Validators.required],
      idleTimeOut: ["", Validators.required],
      finalPageDuration: ["", Validators.required],
      sendEmail: [""],
      sendSms: [""],
      kisoktype: ["", Validators.required],
      // cityName: [""],
      // mall: [""]
    });
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

  // getAllCountries() {
  //   const GET_ALL_COUNTRIES =
  //     environment.APIEndpoint + "api/rpa/master/country/v1/get/countries";
  //   this.http.getJson(GET_ALL_COUNTRIES).subscribe(response => {
  //     console.log(response);
  //     this.countries = response;
  //   });
  // }
  selectCountry(countryId) {
    this.countryId = countryId.countryId;
    // this.GetBrandOnCountry(this.countryId);
    // this.getStores("", this.countryId);
    this.getFlows(this.flowCount, "", this.countryId);
  }
  selectBrand(brandId) {
    this.brandId = brandId.brandOid;
    // this.getStores(this.brandId, this.countryId);
    this.getFlows(this.flowCount, this.brandId, "");
  }

  removeuser(userdId) {
    this.selectedUserId;
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
  //   const SEARCH_STORE = "api/rpa/store/v2/search";
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

 

  getUsersList(storeId, store) {
    console.log(storeId);
    this.selectedStoreId = storeId;
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

  createKiosk(formData) {
    console.log(this.selecttedBrandId, this.selectedcountryIdValue,this.selectedcityIdValue);
    console.log(formData)
    if (this.KioskForm.invalid === true) {
      this.showError = false;
      this.showSelectedUser = true;
      this.showSelectedFlow = true;
      console.log(this.selectedFlows)
    } else {
      console.log(this.selectedFlows)
      this.showError = true;
      this.showSelectedUser = false;
      this.showSelectedFlow = false;
      const requestBody = {
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
        brandOid: this.selecttedBrandId,
        userId: formData.kioskUserName,
        headerImage: this.kioskBrandLogoPath,
        mobileNumber: formData.kioskMobileNumber,
        headerColor: formData.headerColor,
        footerColor: formData.FooterColor,
        backgroundColor: formData.backgroundColor,
        languageOid: formData.language,
        assignedFlowOid: formData.feedbackFlow,
        idleTimeout: formData.idleTimeOut,
        finalPageDuration: formData.finalPageDuration,
        sendEmailToCustomer: formData.sendEmail === true ? true : false,
        sendSMSToCustomer: formData.sendSms === true ? true : false,
        notifyUsers: this.selectedUserId,
        status: this.statusValue,
        kioskType: formData.kisoktype,
        assignedFlows: this.selectedFlows
      };
      console.log(requestBody);
      const CREATE_KIOSK =
        environment.APIEndpoint + "api/rpa/feedback/kiosk/v1/create";
      this.http.postJson(CREATE_KIOSK, requestBody).subscribe(
        response => {
          console.log(response);
          this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 10000,
            data: {
              status: "success",
              message: "Kiosk has been Created successfully"
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
  selectedFlow(brandId, countryId) {
    console.log(brandId, countryId);
    console.log(this.selectedFlows)
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
      maxWidth: "100%",
    };
    const dialogRef = this.dialog.open(
      SelectedFeedbackFlowComponent,
      dialogConfig
    );
    // dialogRef.componentInstance.flowList = this.selectedFlowsId;

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result.buttonName != "CANCEL") {
        this.selectedFlows.push(result);
        this.selectedFlowsId.push(result.flowOid);
        console.log(this.selectedFlows)
        var removeDuplicate = this.removeDuplicatesJSON(this.selectedFlows, 'flowOid');
        this.selectedFlows = removeDuplicate;
      } else {
        this.selectFlowMessage = "Please select Flows";
      }
    });
  }
  removeFlow(userdId, valueIndex) {
    this.selectedFlowsId.splice(valueIndex, 1);
    const index = this.selectedFlows.indexOf(userdId);
    this.selectedFlows.splice(index, 1);
    console.log(this.selectedFlowsId);
  }
  removeDups(names) {
    let unique = {};
    names.forEach(function (i) {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
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


  // get all brands, country, cities and malls

  getAllBrands(ev) {
    // console.log(this.KioskForm.get('brands').value);
    this.selectedCityIdValue = ev;
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + this.selectedcountryIdValue ;
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
      },
        (error) => {
          console.log(error);
        });
  }
  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }
  public brandIdValue;
  // getBrandVal (ev){
  //   console.log(ev.brandId);
  //   this.brandIdValue = ev.brandId;
  //   this.getAllCountries(this.brandIdValue);
  // }
  public selecttedBrandId;
  // getAllCountries() {
  //   let GET_ALL_COUNTRIES = environment.APIEndpoint + "api/rpa/master/country/v1/get/onlineCountries";
  //   this.https.getJson(GET_ALL_COUNTRIES)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.countries = response;
  //     })
  // }
  getAllCountries() {
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
      })
  }

  private _filterCountry(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.Countries.filter(country => country.countryName.toLowerCase().indexOf(filterValue) === 0);
  }
  public selectedcountryIdValue;
  getAllCities(ev){
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

    this.storeCtrl.setValue("");
    this.storeCtrl.updateValueAndValidity();
    
    this.getAllCities1(this.selectedcountryIdValue);
  }
  public selectedCityIdValue;
  
  // getAllCities1(countryId) {
  //   if (countryId != '' && countryId != null && countryId != undefined) {
  //     this.disabledCity = false;
  //   } else {
  //     this.disabledCity = true;
  //   }
  //   let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
  //   this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.cities = response;
  //     })
  // }
  getAllCities1(countryId) {
    if (countryId != '' && countryId != null && countryId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }
    let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
    this.https.getJson(GET_ALL_CITIES + '?countryIds=' + this.selectedcountryIdValue)
      .subscribe((response) => {
        console.log(response);
        this.Cities = [];
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
  public selectedcityIdValue;
  getcityIdValue(ev) {
    console.log(ev);
    this.selectedcityIdValue = ev;
  }
  getAllMalls1(ev){
    console.log(ev);
    
    this.selectedBrandIdValue = ev;
    this.getAllMalls(this.selectedBrandIdValue,this.selectedcountryIdValue,this.selectedCityIdValue)
  }
  // getAllMalls(brandId, countryId, cityId) {
  //   if (brandId != '' && brandId != null && brandId != undefined
  //     && countryId != '' && countryId != null && countryId != undefined
  //     && cityId != '' && cityId != null && cityId != undefined) {
  //     this.disabledMall = false;
  //   } else {
  //     this.disabledMall = true;
  //   }
  //   let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
  //   this.https.getJson(GET_ALL_MALLS + "?brandOids=" + brandId + '&countryOids=' + countryId + '&cityOids=' + cityId)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.mallList = response;
  //     },
  //       (error) => {
  //         console.log(error);
  //       });
  // }
  getAllMalls(brandId, countryId, cityId) {
    this.selecttedBrandId = brandId;
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
        console.log(response);
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
  public selectedmallIdValue;
  getAllStores1(ev){
    this.selectedmallIdValue = ev;
    this.getAllStores(this.selectedBrandIdValue,this.selectedcountryIdValue,this.selectedCityIdValue,this.selectedmallIdValue);
  }
  // getAllStores(brandId, countryId, cityId, mallId) {
  //   if (brandId != '' && brandId != null && brandId != undefined
  //   && countryId != '' && countryId != null && countryId != undefined
  //   && cityId != '' && cityId != null && cityId != undefined
  //   && mallId != '' && mallId != null && mallId != undefined
  //   ) {
  //   this.disabledStores = false;
  // } else {
  //   this.disabledStores = true;
  // }
  //   let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v1/getStoresByMallId"
  //   this.https.getJson(GET_ALL_STORES + "?brandOid=" + brandId + '&countryOid=' + countryId + '&cityOid=' + cityId + '&mallOid=' + mallId)
  //     .subscribe(
  //       res => {
  //         console.log(res);
  //         console.log(res);
  //         this.stores = res;
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );
  // }
  public storesList = [];
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
              storeSpecId: this.storesList[i]['storeSpecId'],
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
  // getAllStores(mallId) {

  //   let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/getStoresByMallId/"
  //   this.https.getJson(GET_ALL_MALLS + mallId)
  //     .subscribe((response) => {
  //       console.log(response);
  //       this.storeList = response;
  //     },
  //       (error) => {
  //         console.log(error);
  //       });
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
      if(request.scanId != '' && request.scanId != null){
        let GET_KIOSK_DETAILS = environment.APIEndpoint + 'api/rpa/feedback/kiosk/v1/getKioskByScanId';
        this.http.postJson(GET_KIOSK_DETAILS, request).subscribe(
          (response) => {
            this.kioskDetails = response;
            console.log(this.kioskDetails);
            this.KioskForm.patchValue({ kioskDeviceIMEI: this.kioskDetails.deviceIMEI })
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
      }else{
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


