import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { value } from 'src/app/feedback.global';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { state } from '@angular/animations';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';


// export interface State {
//   storeOid: number;
//   storeName: string;
// }


export interface State {
  name: string;
  population: string;
}

export interface AssignFlow {
  flowId: number;
  flowName: string;
}

export interface Mall {
  mallId: number;
  mallName: string;
}

export interface City {
  cityId: number;
  cityName: string;
}
export interface Brand {
  brandId: number;
  brandName: string;
}
@Component({
  selector: 'app-search-kiosk',
  templateUrl: './search-kiosk.component.html',
  styleUrls: ['./search-kiosk.component.scss']
})
export class SearchKioskComponent implements OnInit {

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;

  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;

  cityCtrl = new FormControl();
  filteredcities: Observable<City[]>;

  assignCtrl = new FormControl();
  filteredFlows: Observable<AssignFlow[]>;

  mallCtrl = new FormControl();
  filteredmalls: Observable<Mall[]>;

  Flows: AssignFlow[] = [];
  Malls: Mall[] = [];
  states: State[] = [];
  Cities: City[] = [];


  public cityIdValue;

  public searchKioskForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }];
  public storeFilterCtrl: FormControl = new FormControl();
  public displayedColumns: string[] = ['deviceId', 'deviceName', 'storeId', 'countryName', 'cityName', 'brandName', 'mallName', 'location', 'connections', 'lastOnline', 'batteryPercentage', 'status', 'code', 'preview'];
  public status = true;
  public dataSource;
  public paginationData;
  public resultsLength = 0;
  public stores;
  public malls;
  // public storesValue: any =[];
  public searchResults: boolean = false;
  public storeCount = 10;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  flows: any;
  flowURL: string;
  countries: any[];
  cities: any[];
  brands: any[];
  mallListall: any[];
  countryId: any;
  brandList: any = [];
  countryList: any = [];
  cityList: any = [];


  public selectedOptions;

  public storeOidValue;
  public selectedmallIdValue;
  selectedBrandIdValue: any;
  mallList: any = [];


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


  constructor(private fb: FormBuilder,
    private https: HttpService) {
    this.flowURL = window.location.href;
    this.flowURL = this.flowURL.replace(/\/.*/, '');
    console.log(this.flowURL);
  }

  ngOnInit() {
    this.getStoresValue();
    this.getFeedback();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.buildKioskForm();
    this.searchVal();
    this.getStores();
    this.getAllCountries();
    this.GetBrandOnCountry();
    console.log(this.flowIdValue)
  }




  getStoresValue() {
    const GET_ALL_STORES = environment.APIEndpoint + 'api/rpa/store/v1/getAllStores';
    this.https.getJson(GET_ALL_STORES).subscribe(
      (respone) => {
        console.log(respone);
        for (let i = 0; i <= respone.length - 1; i++) {
          let objkey = {
            population: respone[i]['storeOid'],
            name: respone[i]['storeName'],
          }
          this.states.push(objkey);
        }
        this.filteredStates = this.stateCtrl.valueChanges
          .pipe(
            startWith(''),
            map(state => state ? this._filterStates(state) : this.states.slice())
          );
      }
    )
  }
  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();
    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  getFeedback() {
    const data = {
      'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
      'pageSize': 1000,
      'order': {
        "column": "modifiedTime",
        "dir": "desc"
      },
      'keySearch': '',
      'fieldSearch': [
        {
          'fieldName': 'kioskType',
          'fieldValue': 'YES'
        }
      ]
    };
    this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/flow/v1/search', data).subscribe(res => {
      this.flows = res['items'];
      console.log(this.flows);
      for (let i = 0; i <= this.flows.length - 1; i++) {
        let objFlowkey = {
          flowId: this.flows[i]['flowId'],
          flowName: this.flows[i]['flowName'],
        }
        // console.log(objFlowkey);

        this.Flows.push(objFlowkey);
      }
      this.filteredFlows = this.assignCtrl.valueChanges
        .pipe(
          startWith(''),
          map(flow => flow ? this._filterFlows(flow) : this.Flows.slice())
        );
    }, err => {
      console.log(err);
    });
  }
  private _filterFlows(value: string): AssignFlow[] {
    const filterValue = value.toLowerCase();
    return this.Flows.filter(flow => flow.flowName.toLowerCase().indexOf(filterValue) === 0);
  }

  public selectedcountryIdValue;
  disabledCity: boolean = true;



  Brands: Brand[] = [];
  brandCtrl = new FormControl();
  filteredbrands: Observable<Brand[]>;

  private _filterBrands(value: string): Brand[] {
    const filterValue = value.toLowerCase();
    return this.Brands.filter(brand => brand.brandName.toLowerCase().indexOf(filterValue) === 0);
  }
  public brandIdValue;

  public selecttedBrandId;

  private _filterCity(value: string): City[] {

    if (value) {
      const filterValue = value.toLowerCase();
      return this.Cities.filter(city => String(city.cityId).toLowerCase().indexOf(filterValue) > -1 || city.cityName.toLowerCase().indexOf(filterValue) > -1);
    } else {
      return this.Cities;
    }

    const filterValue = value.toLowerCase();
    return this.Cities.filter(city => String(city.cityId).toLowerCase().indexOf(filterValue) > -1 || city.cityName.toLowerCase().indexOf(filterValue) > -1);
  }
  openFilter() {
    this.status = !this.status;
  }

  buildKioskForm() {
    this.searchKioskForm = this.fb.group({
      kioskId: ['',],
      searchVal: ['',],
      kioskname: ['',],
      kioskstore: ['',],
      // kioskmall: [''],
      // kioskCity: [''],
      LastOnline: ['',],
      battery: ['',],
      code: ['',],
      device: ['',],
      assignedflow: ['',],
      kioskCountry: [''],
      cityName: [''],
      mallOid: [''],
      kioskBrand: [''],
      connectionStatus: [''],
      status: [''],
      cityOid: ['']
    });
  }
  // getbrandId(ev){
  //   console.log(ev);

  // }
  searchVal() {
    this.searchResults = true;
    console.log(this.paginationData);
    if (this.searchKioskForm.invalid === false) {
      const formdata = this.searchKioskForm.value;
      const data = {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        // "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        // "page": 0,
        "pageSize": 1000,
        'order': {
          'column': 'modifiedTime',
          'dir': 'desc'
        },
        'keySearch': formdata.searchVal,
        "fieldSearch": [
          {
            "fieldName": "oid",
            "fieldValue": formdata.kioskId
          },
          {
            "fieldName": "deviceName",
            "fieldValue": formdata.kioskname
          },
          {
            "fieldName": "store.oid",
            "fieldValue": this.storeOidValue != undefined ? this.storeOidValue : ""
          },
          {
            "fieldName": "lastOnline",
            "fieldValue": formdata.LastOnline
          },
          {
            "fieldName": "batteryStatus",
            "fieldValue": formdata.battery
          },
          {
            "fieldName": "verificationCode",
            "fieldValue": formdata.code
          },
          {
            "fieldName": "deviceMake",
            "fieldValue": ""
          },
          {
            "fieldName": "assignedFlowOid",
            "fieldValue": this.flowIdValue != undefined ? this.flowIdValue : ""
          },
          {
            "fieldName": "countryOid",
            "fieldValue": formdata.kioskCountry.toString()
          },
          {
            'fieldName': "cityOid",
            'fieldValue': formdata.cityName.toString()
          },
          {
            'fieldName': "mallOid",
            'fieldValue': formdata.mallOid.toString()
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.kioskBrand.toString()
          },
          {
            "fieldName": "deviceStatus",
            "fieldValue": formdata.connectionStatus
          },
          {
            "fieldName": "status",
            "fieldValue": formdata.status
          }
        ]
      };
      const SEARCH_KIOSK = 'api/rpa/feedback/kiosk/v1/search';
      this.https.postJson(environment.APIEndpoint + SEARCH_KIOSK, data).subscribe(res => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res['items']);
        this.searchResults = false;
        this.dataSource.sort = this.sort;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator=this.paginator;
        console.log(this.dataSource.paginator);
        console.log(this.dataSource);
        this.resultsLength = res['totalCount'];
        if (this.paginationData !== undefined && this.paginationData.pageIndex * this.paginationData.pageSize > this.resultsLength) {
          this.paginationData.pageIndex = 0;
          this.paginator.pageIndex = 0;
          this.searchVal();
        }
      }, err => {
        console.log(err);
        this.searchResults = false;
      });
    }
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

    this.buildKioskForm();
    this.getStoresValue();
    this.getFeedback();
    this.flowIdValue = '';
    this.selectedBrandIdValue = '';
    console.log(this.flowIdValue);
    console.log(this.selectedBrandIdValue);
    this.searchVal();

  }

  getStores() {
    const data = {
      'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
      'pageSize': '1000',
      'order': {
        'column': 'modifiedTime',
        'dir': 'asc'
      },
      'keySearch': '',
      'fieldSearch': [
      ]
    };
    const SEARCH_KIOSK = 'api/rpa/store/v1/getAll';
    this.https.postJson(environment.APIEndpoint + SEARCH_KIOSK, data).subscribe(res => {
      console.log(res);
      this.stores = res['items'];
    }, err => {
      console.log(err);
    });
  }

  countryListValue;

  public selectedCityIdValue;
  allBrandCountryCityList = [];
  allBrandCountryBrandList = [];

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
    console.log(countryId);
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;

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





  GetBrandOnCountry() {
    let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/get/regionBrands";
    this.https.getJson(GET_ALL_ONLINE_BRANDS)
      .subscribe((response) => {
        // console.log(response);
        this.brandList = response;
        console.log(this.brandList['brandName']);
        console.log(this.brandList['brandId']);
      },
        (error) => {
          console.log(error);
        });
  }
  getStoreValue(ev) {
    console.log(ev);
  }

  getAllMalls(event, countryId, cityId) {
    console.log(event);
    console.log(countryId);
    // console.log(brandId);
    console.log(cityId);

    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    this.mallInput.selectAllChecked = false;
    this.storeInput.selectAllChecked = false;

    this.brandIds = event;
    

    if (countryId != '' && countryId != null && countryId != undefined && this.brandIds != '' && this.brandIds != null && this.brandIds != undefined && cityId != '' && cityId != null && cityId != undefined) {
      this.disabledCity = false;
    } else {
      this.disabledCity = true;
    }

    this.countrylistMall = this.searchKioskForm.controls['kioskCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchKioskForm.controls['kioskBrand'].value;
    console.log(this.brandMallList);

    // brandId = [];
    // brandId.push(this.brandMallList);

    this.cityMallList = this.searchKioskForm.controls['cityName'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    //   console.log("brands" + brandId);


    // console.log(cityId, countryId, brandId);
    // this.cityListMall = this.searchKioskForm.controls['cityOid'].value;
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

    this.countrylistMall = this.searchKioskForm.controls['kioskCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchKioskForm.controls['kioskBrand'].value;
    console.log(this.brandMallList);

    brandId = [];
    brandId.push(this.brandMallList);

    this.cityMallList = this.searchKioskForm.controls['cityName'].value;
    cityId = [];
    cityId.push(this.cityMallList);
    //   console.log("brands" + brandId);


    console.log(cityId, countryId, brandId);
    // this.cityListMall = this.searchKioskForm.controls['cityOid'].value;
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

  // getAllStores1(ev) {
  //   this.selectedmallIdValue = ev;
  //   this.getAllStores(this.selectedBrandIdValue, this.selectedcountryIdValue, this.selectedCityIdValue, this.selectedmallIdValue);
  // }
  // getAllStores(mallId, countryId, brandId, cityId) {
  //   // console.log(event);
  //   this.selectedmallIdValue = mallId;
  //   if (brandId != '' && brandId != null && brandId != undefined
  //     && countryId != '' && countryId != null && countryId != undefined
  //     && cityId != '' && cityId != null && cityId != undefined
  //     && mallId != '' && mallId != null && mallId != undefined
  //   ) {

  //     this.countrylistMall = this.searchKioskForm.controls['kioskCountry'].value;
  //     countryId = [];
  //     countryId.push(this.countrylistMall);

  //     this.brandMallList = this.searchKioskForm.controls['kioskBrand'].value;
  //     brandId = [];
  //     brandId.push(this.brandMallList);

  //     this.cityMallList = this.searchKioskForm.controls['cityName'].value;
  //     cityId = [];
  //     cityId.push(this.cityMallList);


  //     console.log(mallId,countryId,brandId,cityId);


  //     let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v1/getStoresByMallId"
  //     this.https.getJson(GET_ALL_STORES + "?brandOid=" + brandId + '&countryOid=' + countryId + '&cityOid=' + cityId + '&mallOid=' + this.selectedmallIdValue)
  //       .subscribe(
  //         res => {
  //           console.log(res);
  //           console.log(res);
  //           this.stores = res;

  //           res.forEach(response => {
  //             this.storeList.push({
  //               storeOid: response.storeOid,
  //               storeId: response.storeId,
  //               userId: response.userId,
  //               userName: response.userName,
  //               storeName: response.storeName,
  //               storeAddress: response.storeAddress,
  //               status: response.status,
  //               launchDate: response.launchDate,
  //               value: response.value,
  //             });
  //           }
  //           )

  //         },
  //         err => {
  //           console.log(err);
  //         }
  //       );
  //     // this.disabledStores = false;
  //   } else {
  //     // this.disabledStores = true;
  //   }

  // }

  getstateVal(ev) {
    console.log(ev);
    this.storeOidValue = ev.toString();
  }
  public flowIdValue;
  getFlowVal(ev) {
    console.log(ev.flowId);
    this.flowIdValue = ev.flowId;
  }
  public mallIdValue;
  getMallVal(ev) {
    console.log(ev.mallId);
    this.mallIdValue = ev.mallId;
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
