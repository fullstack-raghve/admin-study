import { OnInit, ViewChild, Output, Input, Component, EventEmitter, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

export interface UserData {
  referenceId: number,
  kioskName: string,
  flowName: string,
  typeOfFeedback: string,
  dateAndtime: string,
  storeName: string,
  feedbackStatus: string,
  customerOrVisitor: string,
  country: string,
}

@Component({
  selector: 'app-search-notifications',
  templateUrl: './search-notifications.component.html',
  styleUrls: ['./search-notifications.component.scss']
})
export class SearchNotificationsComponent implements OnInit {

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  @ViewChild('flowInput') flowInput: SelectAutocompleteComponent;
  @ViewChild('tagInput') tagInput: SelectAutocompleteComponent;
  


  options = [
    {
      display: 'One',
      value: '1'
    }, {
      display: 'Two',
      value: '2'
    }, {
      display: 'Three',
      value: '3'
    }, {
      display: 'Four',
      value: '4'
    }, {
      display: 'Five',
      value: '5'
    }, {
      display: 'Six',
      value: '6'
    }
  ];
  selectedTags;
  public searchNotificationForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }];
  public displayedColumns: string[] =
    ['referenceId', 'isRead', 'kioskName', 'flowName', 'typeOfFeedback', 'customerOrVisitor',
      'dateAndtime', 'country', 'cityName', 'brandName', 'mallName', 'storeName', 'feedbackStatus', 'isComplete'];
  public status = true;
  public dataSource;
  buildFlag = false;
  public searchResults: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // public stores;
  public stores = [];
  public brandList = [];
  public storesArr = [];
  public tagList = [];
  public flows;
  public storeCount = 10;
  public flowCount = 10;
  public paginationData;
  public resultsLength = 0;
  mallListall: any;
  selectedmallIdValue: any;
  selectedCountryOptions:any[]; 
  public selectedCityOptions: any[];
  public selectedBrandOptions: any[];
  public selectedMallOptions: any[];
  public selectedStoreOptions: any[];
  public selectedFlowOptions: any[];
  public selectedTagOptions :any[];
  
  constructor(private fb: FormBuilder,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
    this.buidsearchNotificationForm();
  }

  ngOnInit() {
    this.getAllCountries();
    // this.getBrand();
    this.getFlowData();
    this.getAllNotificationTags();
    // this.getStores();
    // this.getFlows(this.flowCount);
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.searchVal();
    this.buidsearchNotificationForm();
    console.log(document.getElementsByClassName('mat-row').length);
  }

  openFilter() {
    this.status = !this.status;
  }

  buidsearchNotificationForm() {
    this.searchNotificationForm = this.fb.group({
      flowname: [''],
      brandOid: [''],
      status: [''],
      readstatus: [''],
      store: [''],
      searchVal: [''],
      fromDate: [''],
      endDate: [''],
      notificationTag: [''],
      isComplete: [''],
      notificationCountry: [''],
      notificationcity: [''],
      notificationBrand: [''],
      notificationmall: [''],
    });
  }
  // getStores() {
  //   const GET_STORES_VALUE = 'api/rpa/store/v1/getAllStores';
  //   this.https.getJson(environment.APIEndpoint + GET_STORES_VALUE).subscribe(res => {
  //     console.log(res);
  //     this.storesArr = res;
  //     console.log(this.storesArr);
  //   }, err => {
  //     console.log(err);
  //   });
  // }
  // getStores1() {
  //   const data = {
  //     'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
  //     'pageSize': 1000,
  //     'order': {
  //       'column': 'modifiedTime',
  //       'dir': 'asc'
  //     },
  //     'keySearch': '',
  //     'fieldSearch': [
  //     ]
  //   };
  //   const SEARCH_KIOSK = 'api/rpa/store/v1/getAll';
  //   this.https.postJson(environment.APIEndpoint + SEARCH_KIOSK, data).subscribe(res => {
  //     console.log(res);
  //     this.stores = res['items'];
  //   }, err => {
  //     console.log(err);
  //   });
  // }

  // getBrand() {
  //   const SEARCH_BRANDS = 'api/rpa/master/brand/v1/getAllBrand';
  //   this.https.getJson(environment.APIEndpoint + SEARCH_BRANDS).subscribe(res => {
  //     // this.brandList = res;
  //     // console.log(this.brandList);
  //     console.log(res)
  //     res.forEach(res => {
  //       this.brandList.push({
  //         'brandId': res.brandId,
  //         'brandCode': res.brandCode,
  //         'languageDirection': res.languageDirection,
  //         'brandName': res.brandName,
  //         'status': res.status,
  //         'brandType': res.brandType,
  //         'value': res.brandId
  //       });
  //     });
  //     console.log(this.brandList)
  //   }, err => {
  //     console.log(err);
  //   });
  // }


  getFlowData() {
    this.https.getJson(environment.APIEndpoint + "api/rpa/feedback/flow/v1/getAllFlow")
      .subscribe(res => {
        console.log(res);
        this.flows = res['items'];
      },
        (error) => {
          console.log(error);
        });
  }

  // getFlows(flowCount) {
  //   const data = {
  //     'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
  //     'pageSize': 1000,
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
  //     console.log(this.flows);

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
  gettag(ev) {
    console.log(ev);
  }
  searchVal() {

    this.searchResults = true;
    if (this.searchNotificationForm.invalid === false) {
      const formdata = this.searchNotificationForm.value;

      console.log(formdata);
      // if (formdata.searchVal != '') {
      //   let isDate = moment(formdata.searchVal, 'DD/MM/YYYY').format('YYYY-MM-DD');
      //   formdata.searchVal = isDate === 'Invalid date' ? formdata.searchVal : isDate;
      // }
      const data =
      {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        "keySearch": formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "fromDate",
            "fieldValue": formdata.fromDate,
          },
          {
            "fieldName": "toDate",
            "fieldValue": formdata.endDate,
          },
          {
            "fieldName": "feedBackStatus",
            "fieldValue": formdata.status,
          },
          {
            "fieldName": "IsRead",
            "fieldValue": formdata.readstatus,
          },
          {
            "fieldName": "storeId",
            "fieldValue": formdata.store.toString(),
          },
          {
            "fieldName": "feedbackFlow",
            "fieldValue": formdata.flowname.toString(),
          },
          {
            "fieldName": "feedbackNotificationTagMaps",
            "fieldValue": formdata.notificationTag.toString(),
          },
          {
            "fieldName": "isComplete",
            "fieldValue": formdata.isComplete,
          },
          {
            "fieldName": "brandId",
            "fieldValue": this.searchBrandId != undefined ? this.searchBrandId : "",
          },
          {
            "fieldName": "cityId",
            "fieldValue": this.searchcityId != undefined ? this.searchcityId : "",
          },
          {
            "fieldName": "mallId",
            "fieldValue": formdata.notificationmall.toString(),
            // "fieldValue": this.searchMallId != undefined ? this.searchMallId : "",
          },
          {
            "fieldName": "countryId",
            "fieldValue": this.searchcountryId != undefined ? this.searchcountryId : ""
          },


        ]
      }

      console.log(data);
      const NOTIFICATION_SEARCH = 'api/rpa/feedback/notifications/v1/search'
      this.https.postJson(environment.APIEndpoint + NOTIFICATION_SEARCH, data).subscribe(res => {
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
    this.flowInput.selectAllChecked = false;
    this.tagInput.selectAllChecked = false;
    this.selectedCountryOptions = [];
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.selectedFlowOptions = [];
    this.selectedTagOptions = [];
    this.cityList = [];
    this.brandValueList = [];
    this.mallList = [];
    this.storesArr = [];
    this.buidsearchNotificationForm();
    this.searchVal();
  }

  getSelectedOptionsTag(ev) {
    this.selectedTags = ev;
  }
  getFlowTag(ev) {
    // console.log(ev);
  }
  public getAllNotificationTags() {
    this.https.getJson(environment.APIEndpoint + 'api/rpa/feedback/notifications/v1/getNotificationTagList').subscribe(
      (res) => {
        console.log(res);
        this.tagList = res;
        console.log(this.tagList);
      }
    )
  }





  countries: any[];
  cities: any[];
  brands: any[];
  countryId: any;
  countryList: any = [];
  cityList: any = [];
  public selectedCityIdValue;
  allBrandCountryCityList = [];
  allBrandCountryBrandList = [];
  public countryIdval;
  public brandValueList;

  mallList: any = [];
  disabledCity: boolean = false;
  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  allBrandCountryCityMallList = [];

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

  public searchcountryId;

  getAllCities(countryId) {
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;
    console.log(countryId);
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.searchcountryId = countryId.toString();
    if (countryId != '' && countryId != null && countryId != undefined) {
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
  public searchMallId;
  getAllMallId(ev) {
    this.searchMallId = ev.toString();
  }
  public searchBrandId;
  getAllMalls(event, countryId, brandId, cityId) {

    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;

    console.log(event);
    this.searchBrandId = event.toString();
    console.log(this.searchBrandId);
    
    if (countryId != '' && countryId != null && countryId != undefined && brandId != '' && brandId != null && brandId != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.searchNotificationForm.controls['notificationCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchNotificationForm.controls['notificationBrand'].value;
    console.log(this.brandMallList);

    // brandId = [];
    // brandId.push(this.brandMallList);

    this.cityMallList = this.searchNotificationForm.controls['notificationcity'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    //   console.log("brands" + brandId);


    console.log(cityId, countryId, brandId);
    // this.cityListMall = this.searchNotificationForm.controls['cityOid'].value;
    // cityId = [];
    // cityId.push(this.cityListMall)
    if (brandId != '' && countryId != '' && cityId != ''
    ) {
      //    console.log(cityId);
      let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
      this.https
        .getJson(GET_ALL_MALLS + "?brandOids=" + this.searchBrandId + '&countryOids=' + countryId + "&cityOids=" + cityId)
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

  public searchcityId;
  getAllMallsCity(ev, cityId) {
    console.log(ev.toString());
    console.log(cityId);
    this.searchcityId = ev.toString();
  }

  getAllStores(event, countryId, brandId, cityId) {
    this.selectedStoreOptions = [];
    this.storeInput.selectAllChecked = false;

    console.log(event);
    this.selectedmallIdValue = event;
    if (countryId != '' && countryId != null && countryId != undefined && brandId != '' && brandId != null && brandId != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.searchNotificationForm.controls['notificationCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchNotificationForm.controls['notificationBrand'].value;
    console.log(this.brandMallList);

    brandId = [];
    brandId.push(this.brandMallList);

    this.cityMallList = this.searchNotificationForm.controls['notificationcity'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    //   console.log("brands" + brandId);


    console.log(cityId, countryId, brandId);
    // this.cityListMall = this.searchNotificationForm.controls['cityOid'].value;
    // cityId = [];
    // cityId.push(this.cityListMall)
    if (brandId != '' && countryId != '' && cityId != '' && this.selectedmallIdValue != ''
    ) {
      //    console.log(cityId);
      let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v2/getStoresByMallId";

      this.https.getJson(GET_ALL_STORES + "?brandOids=" + brandId + '&countryOids=' + countryId + '&cityOids=' + cityId + '&mallOids=' + this.selectedmallIdValue)
        .subscribe(res => {
          console.log(res);
          this.storesArr = res;

          // res.forEach(res => {
          //   this.storesArr.push({
          //     "storeId": res.storeId,
          //     "storeSpecId": res.storeSpecId,
          //     "storeName": res.storeName,
          //     "value": res.storeId
          //   });
          // });
           console.log(this.storesArr)
          this.allBrandCountryCityMallList = this.storesArr;
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
