import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

export interface UserData {
  alertId: number,
  // kioskId: number,
  kioskName: string,
  alert: string,
  creationTime: string,
  isRead: string,
}

@Component({
  selector: 'search-kiosk-alerts',
  templateUrl: './search-kiosk-alerts.component.html',
  styleUrls: ['./search-kiosk-alerts.component.scss']
})
export class SearchKioskAlertsComponent implements OnInit {

  public searchKioskAlertsForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }];


  public displayedColumns: string[] =
    ['alertId', 'kioskName', 'countryName', 'cityName', 'brandName', 'mallName', 'storeName', 'alert', 'creationTime', 'isRead'];
  public status = true;
  public dataSource;
  buildFlag = false;
  public searchResults: boolean = false;

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input('isDisabled') isDisabled: boolean = false;

  public stores;
  public flows;
  public storeCount = 10;
  public flowCount = 10;
  public paginationData;
  public resultsLength = 0;
  public tagList: any = [];
  brandList: any[];
  countries: any[];
  cities: any[];
  mallList: any[];
  disabledCountry: boolean = true;
  disabledCity: boolean = true;
  disabledMall: boolean = true;

  countryList: any = [];
  cityList: any = [];

  allBrandCountryCityMallList = [];
  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  selectedCountryOptions:any[]; 
  selectedCityOptions: any[];
  selectedBrandOptions: any[];
  selectedMallOptions: any[];
  selectedStoreOptions: any[];
  brandIds: any;
  brands: any[];

  public selectedmallIdValue;
  selectedBrandIdValue: any;
  mallListall: any[];

  constructor(private fb: FormBuilder,
    private router: Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
    this.buildSearchKioskAlertsForm();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
    this.buildSearchKioskAlertsForm();
    this.getAllCountries();
    console.log(document.getElementsByClassName('mat-row').length);
  }

  openFilter() {
    this.status = !this.status;
  }

  buildSearchKioskAlertsForm() {
    this.searchKioskAlertsForm = this.fb.group({
      isRead: [''],
      kioskCountry: [''],
      cityName: [''],
      mallOid: [''],
      kioskBrand: [''],
      kioskStore: [''],
      storeOid:[''],
      searchVal: ['']
    });
  }

  paginationDetail = new BehaviorSubject(
    {
      length: 10,
      pageIndex: 0,
      pageSize: 10
    });

  getUpdate(event) {
    this.paginationDetail.next(event);
    this.paginationData = event;
    this.searchVal();
  }

  searchVal() {
    this.searchResults = true;
    if (this.searchKioskAlertsForm.invalid === false) {
      const formdata = this.searchKioskAlertsForm.value;
      console.log(formdata);
      const data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "oid",
          "dir": "desc"
        },
        "keySearch": formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.kioskBrand.toString()
          },
          {
            "fieldName": "countryOid",
            "fieldValue": formdata.kioskCountry.toString()
          },
          {
            "fieldName": "cityOid",
            "fieldValue": formdata.cityName.toString()
          },
          {
            "fieldName": "mallOid",
            "fieldValue": formdata.mallOid.toString()
          },
          {
            "fieldName": "storeOid",
            "fieldValue": formdata.storeOid.toString()
          },
          {
            "fieldName": "isRead",
            "fieldValue": formdata.isRead,
          },


          // {
          //   "fieldName": "countryOid",
          //   "fieldValue": formdata.kioskCountry.toString()
          // },
          // {
          //   'fieldName': "cityOid",
          //   'fieldValue': formdata.cityName.toString()
          // },
          // {
          //   'fieldName': "mallOid",
          //   'fieldValue': formdata.mallOid.toString()
          // },
          // {
          //   "fieldName": "brandOid",
          //   "fieldValue": formdata.kioskBrand.toString()
          // },


        ]
      }
      const SEARCH_ALERTS = 'api/rpa/feedback/alert/v1/search'
      this.https.postJson(environment.APIEndpoint + SEARCH_ALERTS, data).subscribe(res => {
        this.resultsLength = res["totalCount"];
        this.searchResults = false;
        console.log(this.resultsLength);
        this.dataSource = new MatTableDataSource(res['items']);
        this.dataSource.sort = this.sort;
        this.buildFlag = true;
        if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
          this.paginationData.pageIndex = 0;
          this.paginator.pageIndex = 0;
          this.searchVal();
        }
      }, err => {
        console.log(err);
        this.searchResults = false;
      })
    }
  }
  resetForm() {
    this.countryInput.selectAllChecked = false;
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    this.selectedCountryOptions = [];
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.cityList = [];
    this.brandValueList = [];
    this.mallList = [];
    this.storeList = [];
    this.buildSearchKioskAlertsForm();
    this.searchVal();
  }


  updateAlertStatus(alertId, kioskId) {
    let UPDATE_ALERT_STATUS = environment.APIEndpoint + 'api/rpa/feedback/alert/v1/updateAlertStatus';
    let request = {
      feedbackAlertId: alertId
    }
    this.https.postJson(UPDATE_ALERT_STATUS, request).subscribe(
      (res) => {
        console.log(res);
      }
    )
    this.router.navigate(['/view-kiosk/' + kioskId]);
  }
  // cascading series
  getAllCountries() {
    const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
    this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
      console.log(res);
      res.forEach(res => {
        this.countryList.push({
          'countryId': res.countryId,
          'countryCode': res.countryCode,
          'languageDirection': res.languageDirection,
          'countryName': res.countryName,
          'value': res.countryId,
          'currencyCode': res.currencyCode

        });
      });
      console.log(this.countryList);
    }, err => {
      console.log(err);
    });
  }

  getAllCities(countryId) {
    console.log(countryId);
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    if (countryId != '' && countryId != null && countryId != undefined) {
      this.disabledCity = false;
      let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
      this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
        .subscribe((response) => {
          console.log(response);
          this.cities = response;
          response.forEach(response => {
            this.cityList.push({
              cityId: response.cityId,
              cityCode: response.cityCode,
              languageDirection: response.languageDirection,
              cityName: response.cityName,
              status: response.status,
              value: response.cityId,
            });
            this.getAllMallsCity(countryId, response.cityId);
            console.log(this.cityList);
            this.cityList = this.cities;
            var uniqueArray = this.removeDuplicatesJSON(this.cityList, 'cityId');
            console.log(uniqueArray);
            this.cityList = uniqueArray;
          }
          )
        })
    } else {
      this.cityList = [];
      this.brandValueList = [];
      this.mallList = [];
      this.storeList = [];
    }
  }

  getAllBrands(countryId) {
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    console.log(countryId);
    this.countryIdval = countryId;
    if (countryId != '' && countryId != null && countryId != undefined) {
      this.disabledCity = false;
      let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + countryId;
      this.https.getJson(GET_ALL_ONLINE_BRANDS)
        .subscribe((response) => {
          // if (countryId.length != 0) {
          console.log(response);
          this.brands = response;
          response.forEach(response => {
            this.brandValueList.push({
              brandId: response.brandId,
              brandCode: response.brandCode,
              languageDirection: response.languageDirection,
              brandName: response.brandName,
              status: response.status,
              brandType: response.brandType,
              value: response.brandId,
            });
            this.brandValueList = this.brands;
            var uniqueArray = this.removeDuplicatesJSON(this.brandValueList, 'brandId');
            console.log(uniqueArray);
            this.brandValueList = uniqueArray;
          });
          console.log(this.brandValueList);
          // }
          // else {
          //   this.brandValueList = [];
          // }
        },
          (error) => {
            console.log(error);
          });
    } else {
      // this.disabledCity = true;
      // this.cityList = [];
      this.brandValueList = [];
    }
  }

  getAllMallsCity(ev, cityId) {
    console.log(ev);
    console.log(cityId);
  }



  public countryIdval;
  public brandValueList;

  public storeList;

  getAllMalls(event, countryId, cityId) {
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;

    console.log(event);
    console.log(countryId);
    // console.log(brandId);
    console.log(cityId);
    this.brandIds = event;


    if (countryId != '' && countryId != null && countryId != undefined && this.brandIds != '' && this.brandIds != null && this.brandIds != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.searchKioskAlertsForm.controls['kioskCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchKioskAlertsForm.controls['kioskBrand'].value;
    console.log(this.brandMallList);

    // brandId = [];
    // brandId.push(this.brandMallList);

    this.cityMallList = this.searchKioskAlertsForm.controls['cityName'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    //   console.log("brands" + brandId);


    // console.log(cityId, countryId, brandId);
    // this.cityListMall = this.searchKioskAlertsForm.controls['cityOid'].value;
    // cityId = [];
    // cityId.push(this.cityListMall)
    if (this.brandIds != '' && countryId != '' && cityId != ''
    ) {
      //    console.log(cityId);
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.https
        .getJson(GET_ALL_MALLS + "?brandOids=" + this.brandIds + '&countryOids=' + countryId + "&cityOids=" + cityId)
        .subscribe(response => {
          console.log(response);
          this.mallListall = response;
          console.log(this.mallList)
          response.forEach(res => {
            this.mallList.push({
              "mallCode": res.mallCode,
              "mallId": res.mallId,
              "mallName": res.mallName,
              // "currencyCode": res.currencyCode,
              "languageDirection": res.languageDirection,
              "value": res.mallId
            });

          });

          this.mallList = this.mallListall;
          var uniqueArray = this.removeDuplicatesJSON(this.mallList, 'mallId');
          console.log(uniqueArray);
          this.mallList = uniqueArray;

          // console.log(this.mallList)
          // this.mallList = this.mallListall;
          // var uniqueArray = this.removeDuplicatesJSON(this.allBrandCountryCityMallList, 'mallId');
          // console.log(uniqueArray);

          // // this.allBrandCountryCityMallList = uniqueArray;
          // console.log(this.allBrandCountryCityMallList);
          // //    console.log('push all data', this.allBrandCountryCityMallList)
        });
    }
    else {
      // this.brandValueList = [];
      this.mallList = [];
    }
  }


  getAllStores(event, countryId, brandId, cityId) {
    console.log(event);
    this.selectedStoreOptions = [];
    this.storeInput.selectAllChecked = false;
    
    this.selectedmallIdValue = event;
    if (countryId != '' && countryId != null && countryId != undefined && brandId != '' && brandId != null && brandId != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.searchKioskAlertsForm.controls['kioskCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchKioskAlertsForm.controls['kioskBrand'].value;
    console.log(this.brandMallList);

    brandId = [];
    brandId.push(this.brandMallList);

    this.cityMallList = this.searchKioskAlertsForm.controls['cityName'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    //   console.log("brands" + brandId);


    console.log(cityId, countryId, brandId);
    // this.cityListMall = this.searchKioskAlertsForm.controls['cityOid'].value;
    // cityId = [];
    // cityId.push(this.cityListMall)
    if (brandId != '' && countryId != '' && cityId != '' && this.selectedmallIdValue != ''
    ) {
      //    console.log(cityId);
      let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v2/getStoresByMallId";

      http://14.142.204.100:8080/api/rpa/store/v2/getStoresByMallId?brandOids=2,9,1,12,3,10,5,7,4&countryOids=7,1,6,5,4,3,2&cityOids=18,17,20,4,13,6,12,19,5,2,7,8,11,1,10,9,3&mallOids=1,2,3,10,13,8

      this.https.getJson(GET_ALL_STORES + "?brandOids=" + brandId + '&countryOids=' + countryId + '&cityOids=' + cityId + '&mallOids=' + this.selectedmallIdValue)
        .subscribe(res => {
          console.log(res);
          this.storeList = res;

          // res.forEach(res => {
          //   this.storeList.push({
          //     "storeId": res.storeId,
          //     "storeSpecId": res.storeSpecId,
          //     "storeName": res.storeName,
          //     "value": res.storeId
          //   });
          // });
          console.log(this.storeList)
          this.allBrandCountryCityMallList = this.storeList;
          // var uniqueArray = this.removeDuplicatesJSON(this.allBrandCountryCityMallList, 'mallId');
          // console.log(uniqueArray);

          // this.allBrandCountryCityMallList = uniqueArray;
          console.log(this.allBrandCountryCityMallList);
          //    console.log('push all data', this.allBrandCountryCityMallList)
        });
    }
    else {
      // this.brandValueList = [];
      this.allBrandCountryCityMallList = [];
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
}
