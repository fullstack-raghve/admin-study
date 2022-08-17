import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { SnackBarComponent } from 'src/app/shared/components/snack-bar/snack-bar.component';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';

@Component({
  selector: 'app-search-feeback-survey',
  templateUrl: './search-feeback-survey.component.html',
  styleUrls: ['./search-feeback-survey.component.scss']
})
export class SearchFeebackSurveyComponent implements OnInit {
  public searchFeedbackSurveyForm: FormGroup;
  public breadCrumbData: Array<Object> = [{
    title: 'Home',
    link: ''
  }, {
    title: 'Feedback',
    link: ''
  }];
  public displayedColumns: string[] = ['surveyName', 'brand', 'country', 'assignedFlowId', 'startDate','otherChannel', 'status'];
  public status = true;
  public dataSource;
  public paginationData;
  public resultsLength = 0;
  public stores;
  public searchResults: boolean = false;
  public noRecords: boolean = false;

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  flows: any;
  flowURL: string;
  countries: any[];
  countryId: any;
  brandList: any;
  
  cities: any[];
  mallList: any = [];


  allBrandCountryCityMallList = [];
  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  selectedCountryOptions:any[]; 
  selectedCityOptions: any[];
  selectedBrandOptions: any[];
  selectedMallOptions: any[];
  
  brandIds: any;

  brands: any[];
  mallListall: any[];
  countryList: any = [];
  cityList: any = [];
  API_EndPoint: any;


  constructor(private fb: FormBuilder,
    public snackBar: MatSnackBar,
    private https: HttpService) {
    this.flowURL = window.location.href;
    this.flowURL = this.flowURL.replace(/\/.*/, '');
    console.log(this.flowURL);
  }

  ngOnInit() {
    this.API_EndPoint = environment.APIEndpoint;
    this.getAllCountries();
    this.getFeedback();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.buildKioskForm();
    this.searchVal();
    this.getFlows();
  }

  openFilter() {
    this.status = !this.status;
  }

  buildKioskForm() {
    this.searchFeedbackSurveyForm = this.fb.group({
      // kioskId: ['',],
      searchVal: ['',],
      // kioskname: ['',],
      // surveyName: ['',],
      // kioskstore: ['',],
      // LastOnline: ['',],
      // battery: ['',],
      // code: ['',],
      // device: ['',],
      // assignedflow: ['',],
      // startDate: [""],
      // endDate: [""],
      // City: [''],
      // isOtherChannels: [''],
      assignedflow: [''],
      kioskCountry: [''],
      cityName: [''],
      mallOid: [''],
      kioskBrand: [''],

    });
  }
  searchVal() {
    this.searchResults = true;
    console.log(this.paginationData);
    if (this.searchFeedbackSurveyForm.invalid === false) {
      const formdata = this.searchFeedbackSurveyForm.value;
      const data = {
        'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
        'pageSize': this.paginationData !== undefined ? this.paginationData.pageSize : '10',
        // 'order': {
        //   "column": "oid",
        //   "dir": "asc"
        // },
        "order": {
          "column": "modifiedTime",
          "dir": "desc"
        },
        'keySearch': formdata.searchVal,
        'fieldSearch': [
          // {
          //   'fieldName': 'oid',
          //   'fieldValue': formdata.kioskId
          // },
          // {
          //   'fieldName': 'deviceName',
          //   'fieldValue': formdata.kioskname
          // },
          // {
          //   'fieldName': 'surveyName',
          //   'fieldValue': formdata.surveyName
          // },
          // {
          //   'fieldName': 'lastOnline',
          //   'fieldValue': formdata.LastOnline
          // },
          // {
          //   'fieldName': 'batteryStatus',
          //   'fieldValue': formdata.battery
          // },
          // {
          //   'fieldName': 'verificationCode',
          //   'fieldValue': formdata.code
          // },
          // {
          //     'fieldName': 'isOtherChannels',
          //     'fieldValue': formdata.isOtherChannels
          // },
          {
            'fieldName': 'assignedFlowOid',
            'fieldValue': formdata.assignedflow
          },



          // {
          //   'fieldName': 'countryOid',
          //   'fieldValue': formdata.Country
          // },
          // {
          //   'fieldName': 'isOtherChannels',
          //   'fieldValue': formdata.City
          // },
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
        ]
      };
      const SEARCH_FEEDBACKSURVEY = 'api/rpa/feedback/feedbackSurvey/v1/search';
      this.https.postJson(environment.APIEndpoint + SEARCH_FEEDBACKSURVEY, data).subscribe(res => {
        console.log(res);
        this.dataSource = new MatTableDataSource(res['items']);
        this.searchResults = false;
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
        this.resultsLength = res['totalCount'];
        if (this.resultsLength == 0){
          this.noRecords = true;
        }
        else{
          this.noRecords = false;
        }
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

  getFeedback() {
    const data = {
      'page': 0,
      'pageSize': 1000,
      'order': {
        "column": "oid",
        "dir": "asc"
      },
      'keySearch': '',
      'fieldSearch': [

      ]
    };
    this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/feedbackSurvey/v1/search', data).subscribe(res => {
      this.flows = res['items'];
      console.log(this.flows);
    }, err => {
      console.log(err);
    });
  }

  resetForm() {
    this.countryInput.selectAllChecked = false;
    this.cityInput.selectAllChecked = false;
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    this.selectedCountryOptions = [];
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.cityList = [];
    this.brandValueList = [];
    this.mallList = [];
    this.buildKioskForm();
    this.searchVal();
  }

  getFlows() {
    const data = {
      'page': this.paginationData !== undefined ? this.paginationData.pageIndex : '0',
      'pageSize': 1000,
      'order': {
        'column': 'modifiedTime',
        'dir': 'asc'
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
    }, err => {
      console.log(err);
    });
  }

  emailCopy(val: string){
    let selBox = document.createElement('textarea');
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 500,
        data: {
          status: "success",
          message: "Email URL copied"
        }
      });
    }

    messageCopy(val: string){
      let selBox = document.createElement('textarea');
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 500,
        data: {
          status: "success",
          message: "Message URL copied"
        }
      });
    }

    notificationCopy(val: string){
      let selBox = document.createElement('textarea');
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.snackBar.openFromComponent(SnackBarComponent, {
        duration: 500,
        data: {
          status: "success",
          message: "Notification URL copied"
        }
      });
    }


    //cascading filter methods
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
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    if (countryId != '' && countryId != null && countryId != undefined) {
      // this.disabledCity = false;
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
    this.brandInput.selectAllChecked = false;
    this.mallInput.selectAllChecked = false;
    console.log(countryId);
    this.countryIdval = countryId;
    if (countryId != '' && countryId != null && countryId != undefined) {
      // this.disabledCity = false;
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
    this.selectedMallOptions = [];
    this.mallInput.selectAllChecked = false;
    console.log(cityId);
    this.brandIds = event;
    

    if (countryId != '' && countryId != null && countryId != undefined && this.brandIds != '' && this.brandIds != null && this.brandIds != undefined && cityId != '' && cityId != null && cityId != undefined) {
      // this.disabledCity = false;
    } else {
      // this.disabledCity = true;
    }

    this.countrylistMall = this.searchFeedbackSurveyForm.controls['kioskCountry'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchFeedbackSurveyForm.controls['kioskBrand'].value;
    console.log(this.brandMallList);

    // brandId = [];
    // brandId.push(this.brandMallList);

    this.cityMallList = this.searchFeedbackSurveyForm.controls['cityName'].value;
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
