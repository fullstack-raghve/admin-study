import { OnInit, ViewChild, Output, Input, Component, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormGroupDirective, FormArray, NgForm } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { HttpService } from '../../../../../services/http-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
export interface TxnData {
  trnSlNo: string;
  isRead: string;
  flowName: string;
  txnId: string;
  orderDeliveryType: string;
  starRating: string;
  feedbackEnquiryDate: string;
  feedbackEnquiryType: string;
  isComplete: string;
  brandName: string;
  countryName: string;
  cityName: string;
  storeName: string;
}

@Component({
  selector: 'search-feedback-and-enquiry',
  templateUrl: './search-feedback-and-enquiry.component.html',
  styleUrls: ['./search-feedback-and-enquiry.component.scss']
})
export class SearchFeedbackAndEnquiryComponent implements OnInit {
  public breadCrumbData: Array<Object> = [
    { title: 'Home', link: '' },
    { title: 'Order Management', link: '' }];

  displayedColumns: string[] = ['trnSlNo', 'isRead', 'flowName', 'txnId', 'orderDeliveryType', 'starRating', 'feedbackEnquiryDate', 'feedbackEnquiryType', 'isComplete', 'brandName', 'countryName', 'cityName', 'storeName'];
  dataSource: MatTableDataSource<TxnData>;

  @ViewChild('countryInput') countryInput: SelectAutocompleteComponent;
  @ViewChild('cityInput') cityInput: SelectAutocompleteComponent;
  @ViewChild('brandInput') brandInput: SelectAutocompleteComponent;
  @ViewChild('mallInput') mallInput: SelectAutocompleteComponent;
  @ViewChild('storeInput') storeInput: SelectAutocompleteComponent;
  @ViewChild('flowInput') flowInput: SelectAutocompleteComponent;

  public searchFeedbackAndEnquiryFormGroup: FormGroup;
  public paginationData;
  public resultsLength = 0;
  public noRecords: boolean = false;
  public searchPageLoader: boolean = false;
  public sortColumn = "modifiedTime";
  public sortDirection = "desc";

  paginationDetail = new BehaviorSubject({
    length: 10,
    pageIndex: 0,
    pageSize: 10
  });

  status = true;
  public storeList: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  // Filter 
  public stores = [];
  public brandList = [];
  public storesArr = [];
  public tagList = [];
  public flows;
  public storeCount = 10;
  public flowCount = 10;

  //cascading
  
  public countryId: any;
  public brandsList;
  public cities: any[];
  public mallList: any = [];
  
  selectedmallIdValue: any;

  allBrandCountryCityMallList = [];
  countrylistMall = [];
  brandMallList = [];
  cityMallList = [];
  selectedCountryOptions:any[]; 
  selectedCityOptions: any[];
  selectedBrandOptions: any[];
  selectedMallOptions: any[];
  selectedStoreOptions:any[];
  
  brandIds: any;

  brands: any[];
  mallListall: any =[];
  countryList: any = [];
  cityList: any = [];

  constructor(private fb: FormBuilder, private router: Router,
    private https: HttpService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.paginationData = {
      pageIndex: 0,
      pageSize: 10,
      length: this.resultsLength,
      previousPageIndex: 0
    };
    this.getAllCountries();
    this.getALlFlows();
    this.buildStoreForm();
    this.dataSource = new MatTableDataSource();
    if (sessionStorage.getItem('CheckType') == 'Order_Txns') {
      if (sessionStorage.searchValue) {
        this.searchFeedbackAndEnquiryFormGroup.controls['searchVal'].setValue(sessionStorage.getItem('searchValue'));
      }
      if (sessionStorage.paginationData) {
        let obj = JSON.parse(sessionStorage.paginationData);
        this.paginationDetail = new BehaviorSubject({
          length: obj.length,
          pageIndex: obj.pageIndex,
          pageSize: obj.pageSize
        });
        this.paginationDetail.next(obj);
        this.paginationData = obj;
        this.searchVal();
        this.paginator.pageIndex = obj.pageIndex;
      } else {
        this.searchVal();
      }
    } else {
      sessionStorage.clear();
      this.searchVal();
      sessionStorage.setItem('CheckType', 'Order_Txns');
    }
  }

  openFilter() {
    this.status = !this.status;
  }

  getUpdate(event) {
    sessionStorage.setItem('paginationData', JSON.stringify(event));
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
    this.flowInput.selectAllChecked = false;
    this.selectedCityOptions = [];
    this.selectedBrandOptions = [];
    this.selectedMallOptions = [];
    this.selectedStoreOptions = [];
    // this.searchBrandId = '';
    // this.searchcountryId = '';
    // this.searchcityId = '';
    this.selectedmallIdValue = '';
    this.cityList = [];
    this.brandsList = [];
    this.mallList = [];
    this.storesArr = [];

    this.buildStoreForm();
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchKey() {
    this.getUpdate(this.paginationData);
    this.paginator.pageIndex = this.paginationData.pageIndex;
  }
  searchVal() {
    let formdata = this.searchFeedbackAndEnquiryFormGroup.value;
    sessionStorage.setItem('searchValue', formdata.searchVal);
    this.searchPageLoader = true;
    if (!this.searchFeedbackAndEnquiryFormGroup.invalid) {
      let data = {
        "page": this.paginationData !== undefined ? this.paginationData.pageIndex : "0",
        "pageSize": this.paginationData !== undefined ? this.paginationData.pageSize : "10",
        "order": {
          "column": this.sortColumn,
          "dir": this.sortDirection
        },
        "keySearch": sessionStorage.getItem('searchValue'),
        "fieldSearch": [
          {
            "fieldName": "countryOid",
            "fieldValue": formdata.countryID.toString()
          },
          {
            'fieldName': "cityOid",
            'fieldValue': formdata.cityID.toString()
          },
          {
            "fieldName": "brandOid",
            "fieldValue": formdata.brandID.toString()
          },
          {
            'fieldName': "mallOid",
            'fieldValue': formdata.mallID.toString()
          },
          {
            "fieldName": "storeOid",
            "fieldValue": formdata.storeId.toString()
          },
          {
            "fieldName": "flowName",
            "fieldValue": formdata.flowId.toString()
          },
          {
            "fieldName": "orderType",
            "fieldValue": formdata.orderType
          },
          {
            "fieldName": "isComplete",
            "fieldValue": formdata.isComplete
          },
          // {
          //   "fieldName": "feedbackType",
          //   "fieldValue": formdata.feedbackType
          // },
          {
            "fieldName": "rating",
            "fieldValue": formdata.rating
          },
          {
            "fieldName": "fbTransaction",
            "fieldValue": formdata.feedbackOrEnquiryType === 'fbTransaction' ? '1' : '' 
          },
          {
            "fieldName": "fbEnquiry",
            "fieldValue": formdata.feedbackOrEnquiryType === 'fbEnquiry' ? '1' : '' 
          }
        ]

      }
      this.https.postJson(environment.APIEndpoint + 'api/rpa/feedback/flow/v1/feedbackEnquiry/search', data).subscribe(res => {
        this.searchPageLoader = false;

        this.resultsLength = res["totalCount"];
        if (this.resultsLength == 0) {
          this.noRecords = true;
        } else {
          this.noRecords = false;
        }
        this.dataSource = new MatTableDataSource(res["items"]);
        this.dataSource.sort = this.sort;
      }, err => {
        console.log(err);
        this.searchPageLoader = false;
      })
    }
  }

  buildStoreForm() {
    this.searchFeedbackAndEnquiryFormGroup = this.fb.group({
      countryID: [''],
      cityID: [''],
      mallID: [''],
      brandID: [''],
      storeId: [''],
      flowId: [''],
      orderType: [''],
      rating: [''],
      isComplete: [''],
      // feedbackType: [''],
      feedbackOrEnquiryType: [''],
      searchVal: [""]
    });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      this.sortColumn = "modifiedTime";
      this.sortDirection = "desc";
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }
    this.searchVal();
  }

  viewDetails(ID) {
    localStorage.setItem('viewFBEnqId', ID);
    this.router.navigate(['/view-feedback-and-enquiry']);
  }

  // filter cascading
   //cascading filter methods
 
   getAllCountries() {
     const GET_ALL_COUNTRIES = 'api/rpa/store/v1/get/storeRegions';
     this.https.getJson(environment.APIEndpoint + GET_ALL_COUNTRIES).subscribe(res => {
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
     }, err => {
       console.log(err);
     });
   }
 
   getAllCities(countryId) {
     this.cityInput.selectAllChecked = false;
     this.brandInput.selectAllChecked = false;
     this.mallInput.selectAllChecked = false;
     this.selectedCityOptions = [];
     this.selectedBrandOptions = [];
     this.selectedMallOptions = [];
     if (countryId != '' && countryId != null && countryId != undefined) {
       let GET_ALL_CITIES = environment.APIEndpoint + "api/rpa/master/city/v1/get/storeCities";
       this.https.getJson(GET_ALL_CITIES + '?countryIds=' + countryId)
         .subscribe((response) => {
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
             this.cityList = this.cities;
             var uniqueArray = this.removeDuplicatesJSON(this.cityList, 'cityId');
             this.cityList = uniqueArray;
           }
           )
         })
     } else {
       this.cityList = [];
       this.brandsList = [];
       this.mallList = [];
       this.storeList = [];
     }
   }
 
   getAllBrands(countryId) {
     this.selectedBrandOptions = [];
     this.selectedMallOptions = [];
     this.brandInput.selectAllChecked = false;
     this.mallInput.selectAllChecked = false;
     if (countryId != '' && countryId != null && countryId != undefined) {
       let GET_ALL_ONLINE_BRANDS = environment.APIEndpoint + "api/rpa/master/brand/v1/getBrandByRegionByCountryId" + '?countryOid=' + countryId;
       this.https.getJson(GET_ALL_ONLINE_BRANDS)
         .subscribe((response) => {
             this.brands = response;
             response.forEach(response => {
               this.brandsList.push({
                 brandId: response.brandId,
                 brandCode: response.brandCode,
                 languageDirection: response.languageDirection,
                 brandName: response.brandName,
                 status: response.status,
                 brandType: response.brandType,
                 value: response.brandId,
               });
               this.brandsList = this.brands;
               var uniqueArray = this.removeDuplicatesJSON(this.brandsList, 'brandId');
               this.brandsList = uniqueArray;
             });
         },
           (error) => {
             console.log(error);
           });
     } else {
       this.brandsList = [];
     }
   }
 
   getAllMalls(event, countryId, cityId) {
     this.selectedMallOptions = [];
     this.mallInput.selectAllChecked = false;
     this.brandIds = event;
 
     this.countrylistMall = this.searchFeedbackAndEnquiryFormGroup.controls['countryID'].value;
     countryId = [];
     countryId.push(this.countrylistMall);
     this.brandMallList = this.searchFeedbackAndEnquiryFormGroup.controls['brandID'].value;
 
     this.cityMallList = this.searchFeedbackAndEnquiryFormGroup.controls['cityID'].value;
     cityId = [];
     cityId.push(this.cityMallList);
     if (this.brandIds != '' && countryId != '' && cityId != ''
     ) {
       let GET_ALL_MALLS = environment.APIEndpoint + "api/rpa/store/v1/get/mallList"
       this.https
         .getJson(GET_ALL_MALLS + "?brandOids=" + this.brandIds + '&countryOids=' + countryId + "&cityOids=" + cityId)
         .subscribe(response => {
           this.mallListall = response;
           response.forEach(res => {
             this.mallList.push({
               "mallCode": res.mallCode,
               "mallId": res.mallId,
               "mallName": res.mallName,
               "languageDirection": res.languageDirection,
               "value": res.mallId
             });
           });
           this.mallList = this.mallListall;
           var uniqueArray = this.removeDuplicatesJSON(this.mallList, 'mallId');
           this.mallList = uniqueArray;
         });
     }
     else {
       this.mallList = [];
     }
   }


   getAllStores(event, countryId, brandId, cityId) {
    this.selectedmallIdValue = event;

    this.countrylistMall = this.searchFeedbackAndEnquiryFormGroup.controls['countryID'].value;
    countryId = [];
    countryId.push(this.countrylistMall);
    this.brandMallList = this.searchFeedbackAndEnquiryFormGroup.controls['brandID'].value;
    brandId = [];
    brandId.push(this.brandMallList);
    this.cityMallList = this.searchFeedbackAndEnquiryFormGroup.controls['cityID'].value;
    cityId = [];
    cityId.push(this.cityMallList);

    if (brandId != '' && countryId != '' && cityId != '' && this.selectedmallIdValue != ''
    ) {
      let GET_ALL_STORES = environment.APIEndpoint + "api/rpa/store/v2/getStoresByMallId";

      this.https.getJson(GET_ALL_STORES + "?brandOids=" + brandId + '&countryOids=' + countryId + '&cityOids=' + cityId + '&mallOids=' + this.selectedmallIdValue)
        .subscribe(res => {
          this.storesArr = res;
          res.forEach(res => {
            this.storesArr.push({
              "storeId": res.storeId,
              "storeSpecId": res.storeSpecId,
              "storeName": res.storeName,
              "value": res.storeId
            });
          });
          var uniqueArray = this.removeDuplicatesJSON(this.storesArr, 'storeId');
          this.storesArr = uniqueArray;
        });
    }
    else {
      this.storesArr = [];
    }
  }

  getALlFlows() {
    this.https.getJson(environment.APIEndpoint + "api/rpa/feedback/flow/v1/getAllFlow")
      .subscribe(res => {
        this.flows = res['items'];
      },
        (error) => {
          console.log(error);
        });
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